# Supported Extras

## Using purchased SSL certs instead of Let's Encrypt wildcards

**How to change certs used by Tactical RMM to purchased ones (this can be a wildcard cert).**

You need to add the certificate private key and public keys to the following files:

`/etc/nginx/sites-available/rmm.conf`

`/etc/nginx/sites-available/meshcentral.conf`

`/etc/nginx/sites-available/frontend.conf`

`/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

Create a new folder for certs and allow tactical user permissions (assumed to be tactical):

```bash
sudo mkdir /certs
sudo chown -R tactical:tactical /certs
```

Now move your certs into that folder.

Open the api file and add the api certificate or if it's a wildcard the directory should be `/certs/EXAMPLE.COM/`

```bash
sudo nano /etc/nginx/sites-available/rmm.conf
```

Replace  

```text
ssl_certificate /etc/letsencrypt/live/EXAMPLE.COM/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/EXAMPLE.COM/privkey.pem;
```

With

```text
ssl_certificate /certs/api.EXAMPLE.COM/fullchain.pem;
ssl_certificate_key /certs/api.EXAMPLE.COM/privkey.pem;
```

!!!note
    Note the fullchain requirement for the certs, it won't work without it.

Repeat the process for:

```text
/etc/nginx/sites-available/meshcentral.conf
/etc/nginx/sites-available/frontend.conf
```

But change api to mesh and rmm respectively.

Add the following to the last lines of `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

```bash
nano /rmm/api/tacticalrmm/tacticalrmm/local_settings.py
```

add

```python
CERT_FILE = "/certs/api.EXAMPLE.COM/fullchain.pem"
KEY_FILE = "/certs/api.EXAMPLE.COM/privkey.pem"
```

Then restart your server or restart services

```bash
sudo systemctl restart rmm.service celery.service celerybeat.service nginx.service
```

## Use Certbot to do acme challenge over http

The standard SSL cert process in Tactical uses a [DNS challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge) that requires a dns txt record to be updated in your public DNS with every cert renewal.

The below uses [http challenge](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) on the 3 separate ssl certs, one for each subdomain: rmm, api, mesh.

!!!note
    Your Tactical RMM server will need to have TCP Port 80 exposed to the internet.

Make Letsencrypt directories

`sudo mkdir /var/www/letsencrypt`

`sudo mkdir /var/www/letsencrypt/.mesh`

`sudo mkdir /var/www/letsencrypt/.rmm`

`sudo mkdir /var/www/letsencrypt/.api`

Setup tactical nginx config files for letsencrypt

Add in the following block in listen 80 under server_name in each of the configs replacing dir with the created folders above

`/etc/nginx/sites-available/rmm.conf`

`/etc/nginx/sites-available/meshcentral.conf`

`/etc/nginx/sites-available/frontend.conf`

```text
      location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt/.dir/;}
```

Restart nginx

`sudo systemctl restart nginx.service`

Get letsencrypt Certs replace yourdomain.com with your domain

sudo letsencrypt certonly --webroot -w /var/www/letsencrypt/.mesh/ -d mesh.yourdomain.com
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt/.rmm/ -d rmm.yourdomain.com
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt/.api/ -d api.yourdomain.com

Ensure letsencrypt Permissions are correct
sudo chown ${USER}:${USER} -R /etc/letsencrypt
sudo chmod 775 -R /etc/letsencrypt

Replace certs in files

Open the api file and add the api certificates

```bash
sudo nano /etc/nginx/sites-available/rmm.conf
```

Replace  

```text
ssl_certificate /etc/letsencrypt/live/EXAMPLE.COM/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/EXAMPLE.COM/privkey.pem;
```

With

```text
ssl_certificate /etc/letsencrypt/live/api.EXAMPLE.COM/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/api.EXAMPLE.COM/privkey.pem;
```

!!!note
    Note the fullchain requirement for the certs, it won't work without it.

Repeat the process for:

```text
/etc/nginx/sites-available/meshcentral.conf
/etc/nginx/sites-available/frontend.conf
```

But change api to mesh and rmm respectively.

Add the following to the last lines of `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

```bash
nano /rmm/api/tacticalrmm/tacticalrmm/local_settings.py
```

add

```python
CERT_FILE = "/etc/letsencrypt/live/api.EXAMPLE.COM/fullchain.pem"
KEY_FILE = "/etc/letsencrypt/live/api.EXAMPLE.COM/privkey.pem"
```

Then restart your server or restart services

```bash
sudo systemctl restart rmm.service celery.service celerybeat.service nginx.service
```

Create renewal post hook to restart services after renewal
lepost="$(cat << EOF
#!/usr/bin/env bash
chown -R tactical:tactical /etc/letsencrypt
systemctl restart nginx meshcentral rmm celery celerybeat nats nats-api
EOF
)"
echo "${lepost}" | sudo tee /etc/letsencrypt/renewal-hooks/post/001-restart-services.sh > /dev/null
sudo chmod +x /etc/letsencrypt/renewal-hooks/post/001-restart-services.sh


## Using your own certs with Docker

Publicly signed certificates should work but have not been fully tested.

If you are providing your own publicly signed certificates, ensure you download the **full chain** (combined CA/Root + Intermediary) certificate in pem format. If certificates are not provided, a self-signed certificate will be generated and most agent functions won't work.
