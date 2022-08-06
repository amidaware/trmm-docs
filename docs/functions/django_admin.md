# Django Admin

!!!warning
    Do not use the Django admin unless you really know what you're doing.<br />You should never need to access it unless you are familiar with Django or are instructed to do something here by one of the developers.

The Django admin is basically a web interface for the postgres database.

As of Tactical RMM v0.4.19, the Django admin is disabled by default.

To enable it, edit `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` and change `ADMIN_ENABLED` from `False` to `True` then `sudo systemctl restart rmm.service`.

Login to the Django admin using the same credentials as your normal web ui login.

If you did not save the Django admin url (which was printed out at the end of the install script), check the `local_settings.py` file referenced above for the `ADMIN_URL` variable. Then simply append the value of this variable to your api domain (`https://api.EXAMPLE.COM/`) to get the full url.

Example of a full Django admin url:
```
https://api.example.com/JwboKNYb3v6K93Fvtcz0G3vUM17LMTSZggOUAxa97jQfAh0P5xosEk7u2PPkjEfdOtucUp/
```