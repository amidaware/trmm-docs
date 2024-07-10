# SNMP Checks

*Version added: Tactical RMM v0.19.0 / Agent v2.8.0*

SNMP monitoring can now be done using the `pysnmplib` library included with the [portable python distribution](./scripting.md#python-on-windows) on windows agents.

Here is a sample script (written by ChatGPT) that can be used to query and monitor a printer. It takes the printer's IP address as the first argument.

```python
#!/usr/bin/python3

import sys
from pysnmp.hlapi import *

if len(sys.argv) != 2:
    print("Missing required argument: snmp device IP address")
    sys.exit(1)

printer_ip = sys.argv[1]
community_string = 'public'

oids = {
    'Printer Model': '1.3.6.1.2.1.1.1.0',
    'Total Page Count': '1.3.6.1.2.1.43.10.2.1.4.1.1',
    'Toner Level Black': '1.3.6.1.2.1.43.11.1.1.9.1.1',
    'Toner Level Cyan': '1.3.6.1.2.1.43.11.1.1.9.1.2',
    'Toner Level Magenta': '1.3.6.1.2.1.43.11.1.1.9.1.3',
    'Toner Level Yellow': '1.3.6.1.2.1.43.11.1.1.9.1.4',
    'Device Status': '1.3.6.1.2.1.25.3.2.1.5.1',
    'Serial Number': '1.3.6.1.2.1.43.5.1.1.17.1',
}

for name, oid in oids.items():
    iterator = getCmd(
        SnmpEngine(),
        CommunityData(community_string, mpModel=0),
        UdpTransportTarget((printer_ip, 161)),
        ContextData(),
        ObjectType(ObjectIdentity(oid))
    )

    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)

    if errorIndication:
        print(f"Error: {errorIndication}")
    elif errorStatus:
        print(f'Error: {errorStatus.prettyPrint()} at {errorIndex and varBinds[int(errorIndex) - 1] or "?"}')
    else:
        for varBind in varBinds:
            print(f'{name}: {varBind[1]}')
```