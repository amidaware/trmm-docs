# Overriding / Customizing Default Settings

### Browser token expiration

The default browser token expiration is set to 5 hours. See this [ticket](https://github.com/amidaware/tacticalrmm/issues/503) for reference.

To change it, add the following code block to the end of `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

```python
from datetime import timedelta

REST_KNOX = {
    "TOKEN_TTL": timedelta(days=30),
    "AUTO_REFRESH": True,
    "MIN_REFRESH_INTERVAL": 600,
}
```

Change `(days=30)` to whatever you prefer. Then run `sudo systemctl restart rmm.service` for changes to take effect.

### Using your own wildcard ssl cert

Modify the install script and replace `CERT_PUB_KEY` and `CERT_PRIV_KEY` with the full paths to your wildcard cert.

Make sure the files are readable by the `tactical` user.

Comment out all the stuff related to certbot in the install script.

After installation is complete, add the following 2 lines to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` replacing them with the full path to your certs.

```python
CERT_FILE = "/path/to/your/fullchain.pem"
KEY_FILE = "/path/to/your/privkey.pem"
```

Then run `/rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py reload_nats` and restart your server.

### Use NATS Standard instead of NATS websocket

Prior to TRMM v0.14.0 (released 7/7/2022), agents NATS traffic connected to the TRMM server on public port 4222.
If you have upgraded to v0.14.0 and have agents that won't work with websockets for some reason (too old TLS etc) then you can do the following to use NATS standard tcp on port 4222, just like how it was before v0.14.0:

For windows agents:

Add the following registry string value (REG_SZ):

`HKEY_LOCAL_MACHINE\SOFTWARE\TacticalRMM\NatsStandardPort` with value `4222`

Then restart the `tacticalrmm` windows service.

For linux agents:

Add the following key/value pair to `/etc/tacticalagent`:
```json
{"natsstandardport": "4222"}
```

Then `sudo systemctl restart tacticalagent.service`

Just make sure port 4222 TCP is still open in your firewall and you're done.

### Monitor NATS via its HTTP API

*Version added: Tactical RMM v0.15.1*



To enable [NATS monitoring](https://docs.nats.io/running-a-nats-service/configuration/monitoring), add the folllowing to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` (replace with whatever port you want).
```python
NATS_HTTP_PORT = 8222
```

Then from the TRMM Web UI, do **Tools > Server Maintenance > Reload Nats Configuration**.

And then from your TRMM server cli restart both the `rmm.service` and `nats.service` services.

