# Settings Override

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

Add the following 2 lines to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` replacing them with the full path to your certs.

```python
CERT_FILE = "/path/to/your/fullchain.pem"
KEY_FILE = "/path/to/your/privkey.pem"
```

Make sure the files are readable by the `tactical` user.
Then, `sudo systemctl restart rmm.service` and from the web UI, do Tools > Server Maintenance > Reload Nats.

You'll also need to edit your nginx configs (`rmm.conf`, `meshcentral.conf` and `frontend.conf`) located in `/etc/nginx/sites-available/` and update the path there too, then `sudo systemctl restart nginx`