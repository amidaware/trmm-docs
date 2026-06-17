# SNMP Checks

*Version added: Tactical RMM v0.19.0 / Agent v2.8.0*

### Video Walkthru

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/Qh9BfKo2wIg" frameborder="0" allowfullscreen></iframe>
</div>

SNMP monitoring can now be done using the [portable python distribution](./scripting.md#python-on-windows) on windows agents.

Here is a sample script (written by Claude) that can be used to query and monitor a printer. It takes the printer's IP address as the first argument.

```python
#!/usr/bin/python3

import socket
import random
import sys

SNMP_VERSION = 0          # 0 = SNMPv1 (mpModel=0), 1 = SNMPv2c
COMMUNITY    = "public"
PORT         = 161
TIMEOUT      = 2.0        # seconds per attempt
RETRIES      = 1

def _enc_len(n):
    if n < 0x80:
        return bytes([n])
    out = bytearray()
    while n:
        out.insert(0, n & 0xFF)
        n >>= 8
    return bytes([0x80 | len(out)]) + bytes(out)


def _tlv(tag, value):
    return bytes([tag]) + _enc_len(len(value)) + value


def _enc_uint(value):                 # non-negative INTEGER
    if value == 0:
        return _tlv(0x02, b"\x00")
    out = bytearray()
    v = value
    while v:
        out.insert(0, v & 0xFF)
        v >>= 8
    if out[0] & 0x80:
        out.insert(0, 0x00)
    return _tlv(0x02, bytes(out))


def _enc_b128(n):
    if n == 0:
        return b"\x00"
    out = bytearray()
    while n:
        out.insert(0, n & 0x7F)
        n >>= 7
    for i in range(len(out) - 1):
        out[i] |= 0x80
    return bytes(out)


def _enc_oid(oid):
    p = [int(x) for x in oid.strip().strip(".").split(".")]
    body = _enc_b128(40 * p[0] + p[1])
    for x in p[2:]:
        body += _enc_b128(x)
    return _tlv(0x06, body)


def _enc_octstr(s):
    if isinstance(s, str):
        s = s.encode("latin-1")
    return _tlv(0x04, s)


_NULL = _tlv(0x05, b"")


def _build_get(community, oid, request_id, version):
    varbind = _tlv(0x30, _enc_oid(oid) + _NULL)
    varbind_list = _tlv(0x30, varbind)
    pdu = _tlv(0xA0, _enc_uint(request_id) + _enc_uint(0) + _enc_uint(0) + varbind_list)
    return _tlv(0x30, _enc_uint(version) + _enc_octstr(community) + pdu)


def _read_len(d, i):
    b = d[i]
    i += 1
    if b < 0x80:
        return b, i
    n = 0
    for _ in range(b & 0x7F):
        n = (n << 8) | d[i]
        i += 1
    return n, i


def _tlv_read(d, i):
    tag = d[i]
    i += 1
    length, i = _read_len(d, i)
    return tag, d[i:i + length], i + length


def _dec_oid(b):
    if not b:
        return ""
    first = b[0]
    a = min(first // 40, 2)
    vals = [a, first - 40 * a]
    n = 0
    for byte in b[1:]:
        n = (n << 7) | (byte & 0x7F)
        if not (byte & 0x80):
            vals.append(n)
            n = 0
    return ".".join(map(str, vals))


def _dec_value(tag, b):
    if tag == 0x02:                                  # INTEGER
        return int.from_bytes(b, "big", signed=True) if b else 0
    if tag in (0x41, 0x42, 0x43, 0x46):              # Counter32/Gauge32/TimeTicks/Counter64
        return int.from_bytes(b, "big") if b else 0
    if tag == 0x40:                                  # IpAddress
        return ".".join(map(str, b))
    if tag == 0x06:                                  # OID
        return _dec_oid(b)
    if tag == 0x05:                                  # NULL
        return None
    if tag == 0x80:
        return "noSuchObject"
    if tag == 0x81:
        return "noSuchInstance"
    if tag == 0x82:
        return "endOfMibView"
    if tag == 0x04:                                  # OCTET STRING
        if any(c < 9 or 13 < c < 32 for c in b):     # binary -> show hex
            return "0x" + b.hex()
        try:
            return b.decode("utf-8").rstrip("\x00")
        except UnicodeDecodeError:
            return b.decode("latin-1").rstrip("\x00")
    return "0x" + b.hex()


_ERRORS = {0: "noError", 1: "tooBig", 2: "noSuchName",
           3: "badValue", 4: "readOnly", 5: "genErr"}


def _parse_response(data):
    _, msg, _ = _tlv_read(data, 0)
    i = 0
    _, _, i = _tlv_read(msg, i)        # version
    _, _, i = _tlv_read(msg, i)        # community
    _, pdu, _ = _tlv_read(msg, i)      # PDU
    j = 0
    _, rid_b, j = _tlv_read(pdu, j)
    _, est_b, j = _tlv_read(pdu, j)
    _, eix_b, j = _tlv_read(pdu, j)
    _, vbl, j = _tlv_read(pdu, j)
    request_id = int.from_bytes(rid_b, "big")
    error_status = int.from_bytes(est_b, "big", signed=True)
    error_index = int.from_bytes(eix_b, "big", signed=True)
    binds = []
    k = 0
    while k < len(vbl):
        _, vb, k = _tlv_read(vbl, k)
        m = 0
        _, oid_b, m = _tlv_read(vb, m)
        vtag, val_b, m = _tlv_read(vb, m)
        binds.append((_dec_oid(oid_b), _dec_value(vtag, val_b)))
    return request_id, error_status, error_index, binds


def snmp_get(ip, oid, community=COMMUNITY, version=SNMP_VERSION,
             port=PORT, timeout=TIMEOUT, retries=RETRIES):
    """Return (error_status, error_index, [(oid, value), ...]) for one GET."""
    request_id = random.randint(1, 0x7FFFFFFF)
    packet = _build_get(community, oid, request_id, version)
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        for attempt in range(retries + 1):
            sock.sendto(packet, (ip, port))
            try:
                while True:
                    data, _ = sock.recvfrom(65535)
                    rid, est, eix, binds = _parse_response(data)
                    if rid == request_id:           # ignore stray/late packets
                        return est, eix, binds
            except socket.timeout:
                if attempt == retries:
                    raise
    finally:
        sock.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Missing required argument: snmp device IP address")
        sys.exit(1)

    printer_ip = sys.argv[1]

    oids = {
        "Printer Model":       "1.3.6.1.2.1.1.1.0",
        "Total Page Count":    "1.3.6.1.2.1.43.10.2.1.4.1.1",
        "Toner Level Black":   "1.3.6.1.2.1.43.11.1.1.9.1.1",
        "Toner Level Cyan":    "1.3.6.1.2.1.43.11.1.1.9.1.2",
        "Toner Level Magenta": "1.3.6.1.2.1.43.11.1.1.9.1.3",
        "Toner Level Yellow":  "1.3.6.1.2.1.43.11.1.1.9.1.4",
        "Device Status":       "1.3.6.1.2.1.25.3.2.1.5.1",
        "Serial Number":       "1.3.6.1.2.1.43.5.1.1.17.1",
    }

    for name, oid in oids.items():
        try:
            error_status, error_index, binds = snmp_get(printer_ip, oid)
        except socket.timeout:
            print(f"Error: no response from {printer_ip} (timeout)")
            continue
        except OSError as exc:
            print(f"Error: {exc}")
            continue

        if error_status:
            print(f"Error: {_ERRORS.get(error_status, error_status)} at index {error_index}")
        else:
            for _, value in binds:
                print(f"{name}: {value}")
```