# Unsupported Reference Scripts

!!!note
    These are not supported scripts/configurations by Tactical RMM, but it's provided here for your reference.

    Although these aren't officially supported configurations, we generally will help point you in the right direction. Please use the Discord [#unsupported channel](https://discord.com/channels/736478043522072608/888474319750066177) to discuss issues related to these complex installations.

## Fail2ban

Install fail2ban

```bash
sudo apt install -y fail2ban
```

Set Tactical fail2ban filter conf file

```bash
tacticalfail2banfilter="$(cat << EOF
[Definition]
failregex = ^<HOST>.*400.17.*$
ignoreregex = ^<HOST>.*200.\d+.*$
EOF
)"
sudo echo "${tacticalfail2banfilter}" > /etc/fail2ban/filter.d/tacticalrmm.conf
```

Set Tactical fail2ban jail conf file

```bash
tacticalfail2banjail="$(cat << EOF
[tacticalrmm]
enabled = true
port = 80,443
filter = tacticalrmm
action = iptables-allports[name=tactical]
logpath = /rmm/api/tacticalrmm/tacticalrmm/private/log/access.log
maxretry = 3
bantime = 14400
findtime = 14400
EOF
)"
sudo echo "${tacticalfail2banjail}" > /etc/fail2ban/jail.d/tacticalrmm.local
```
Restart fail2ban

```bash
sudo systemctl restart fail2ban.service
```

## Using purchased SSL certs instead of Let'sEncrypt wildcards

Credit to [@dinger1986](https://github.com/dinger1986)

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

```bash
ssl_certificate /etc/letsencrypt/live/EXAMPLE.COM/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/EXAMPLE.COM/privkey.pem;
```

With

```bash
ssl_certificate /certs/api.EXAMPLE.COM/fullchain.pem;
ssl_certificate_key /certs/api.EXAMPLE.COM/privkey.pem;
```

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

Regenerate NATS Conf

```bash
cd /rmm/api/tacticalrmm
source ../env/bin/activate
python manage.py reload_nats
```

Restart services

```bash
sudo systemctl restart rmm.service celery.service celerybeat.service nginx.service nats.service nats-api.service
```

## Use Certbot to do acme challenge over http

The standard SSL cert process in Tactical uses a [DNS challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge) that requires dns txt files to be updated in your public DNS with every cert renewal.

The below script uses [http challenge](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) on the 3 separate ssl certs, one for each subdomain: rmm, api, mesh.

!!!note
    Your Tactical RMM server will need to have TCP Port 80 exposed to the internet.

```bash
#!/bin/bash

###Set colors same as Tactical RMM install and Update
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

### Ubuntu 20.04 Check

UBU20=$(grep 20.04 "/etc/"*"release")
if ! [[ $UBU20 ]]; then
  echo -ne "\033[0;31mThis script will only work on Ubuntu 20.04\e[0m\n"
  exit 1
fi

cls() {
  printf "\033c"
}

print_green() {
  printf >&2 "${GREEN}%0.s-${NC}" {1..80}
  printf >&2 "\n"
  printf >&2 "${GREEN}${1}${NC}\n"
  printf >&2 "${GREEN}%0.s-${NC}" {1..80}
  printf >&2 "\n"
}

cls

### Set variables for domains

while [[ $rmmdomain != *[.]*[.]* ]]
do
echo -ne "${YELLOW}Enter the subdomain used for the backend (e.g. api.example.com)${NC}: "
read rmmdomain
done

while [[ $frontenddomain != *[.]*[.]* ]]
do
echo -ne "${YELLOW}Enter the subdomain used for the frontend (e.g. rmm.example.com)${NC}: "
read frontenddomain
done

while [[ $meshdomain != *[.]*[.]* ]]
do
echo -ne "${YELLOW}Enter the subdomain used for meshcentral (e.g. mesh.example.com)${NC}: "
read meshdomain
done

echo -ne "${YELLOW}Enter the current root domain (e.g. example.com or example.co.uk)${NC}: "
read rootdomain


### Setup Certificate Variables
CERT_PRIV_KEY=/etc/letsencrypt/live/${rootdomain}/privkey.pem
CERT_PUB_KEY=/etc/letsencrypt/live/${rootdomain}/fullchain.pem

### Make Letsencrypt directories

sudo mkdir /var/www/letsencrypt
sudo mkdir /var/www/letsencrypt/.mesh
sudo mkdir /var/www/letsencrypt/.rmm
sudo mkdir /var/www/letsencrypt/.api

### Remove config files for nginx

sudo rm /etc/nginx/sites-available/rmm.conf
sudo rm /etc/nginx/sites-available/meshcentral.conf
sudo rm /etc/nginx/sites-available/frontend.conf
sudo rm /etc/nginx/sites-enabled/rmm.conf
sudo rm /etc/nginx/sites-enabled/meshcentral.conf
sudo rm /etc/nginx/sites-enabled/frontend.conf

### Setup tactical nginx config files for letsencrypt

nginxrmm="$(cat << EOF
server_tokens off;
upstream tacticalrmm {
    server unix:////rmm/api/tacticalrmm/tacticalrmm.sock;
}
map \$http_user_agent \$ignore_ua {
    "~python-requests.*" 0;
    "~go-resty.*" 0;
    default 1;
}
server {
    listen 80;
    server_name ${rmmdomain};
	    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt/.api/;}
    location / {
    return 301 https://\$server_name\$request_uri;}
}
server {
    listen 443 ssl;
    server_name ${rmmdomain};
    client_max_body_size 300M;
    access_log /rmm/api/tacticalrmm/tacticalrmm/private/log/access.log;
    error_log /rmm/api/tacticalrmm/tacticalrmm/private/log/error.log;
    ssl_certificate ${CERT_PUB_KEY};
    ssl_certificate_key ${CERT_PRIV_KEY};
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    
	location /static/ {
        root /rmm/api/tacticalrmm;
    }
    location /private/ {
        internal;
        add_header "Access-Control-Allow-Origin" "https://${frontenddomain}";
        alias /rmm/api/tacticalrmm/tacticalrmm/private/;
    }
location ~ ^/ws/ {
        proxy_pass http://unix:/rmm/daphne.sock;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_redirect     off;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
}
    location /saltscripts/ {
        internal;
        add_header "Access-Control-Allow-Origin" "https://${frontenddomain}";
        alias /srv/salt/scripts/userdefined/;
    }
    location /builtin/ {
        internal;
        add_header "Access-Control-Allow-Origin" "https://${frontenddomain}";
        alias /srv/salt/scripts/;
    }
    location ~ ^/(natsapi) {
        allow 127.0.0.1;
        deny all;
        uwsgi_pass tacticalrmm;
        include     /etc/nginx/uwsgi_params;
        uwsgi_read_timeout 500s;
        uwsgi_ignore_client_abort on;
    }
    location / {
        uwsgi_pass  tacticalrmm;
        include     /etc/nginx/uwsgi_params;
        uwsgi_read_timeout 9999s;
        uwsgi_ignore_client_abort on;
    }
}
EOF
)"
echo "${nginxrmm}" | sudo tee /etc/nginx/sites-available/rmm.conf > /dev/null


nginxmesh="$(cat << EOF
server {
  listen 80;
  server_name ${meshdomain};
      location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt/.mesh/;}
    location / {
  return 301 https://\$server_name\$request_uri;}
}
server {
    listen 443 ssl;
    proxy_send_timeout 330s;
    proxy_read_timeout 330s;
    server_name ${meshdomain};
    ssl_certificate ${CERT_PUB_KEY};
    ssl_certificate_key ${CERT_PRIV_KEY};
    ssl_session_cache shared:WEBSSL:10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    location / {
        proxy_pass http://127.0.0.1:4430/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-Host \$host:\$server_port;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
)"
echo "${nginxmesh}" | sudo tee /etc/nginx/sites-available/meshcentral.conf > /dev/null


nginxfrontend="$(cat << EOF
server {
    server_name ${frontenddomain};
    charset utf-8;
    location / {
        root /var/www/rmm/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        add_header Pragma "no-cache";
    }
    error_log  /var/log/nginx/frontend-error.log;
    access_log /var/log/nginx/frontend-access.log;
    listen 443 ssl;
    ssl_certificate ${CERT_PUB_KEY};
    ssl_certificate_key ${CERT_PRIV_KEY};
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
}
server {
    listen 80;
    server_name ${frontenddomain};
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt/.rmm/;}
    location / {
    return 301 https://\$host\$request_uri;}
}
EOF
)"
echo "${nginxfrontend}" | sudo tee /etc/nginx/sites-available/frontend.conf > /dev/null

### Relink nginx config files

sudo ln -s /etc/nginx/sites-available/rmm.conf /etc/nginx/sites-enabled/rmm.conf
sudo ln -s /etc/nginx/sites-available/meshcentral.conf /etc/nginx/sites-enabled/meshcentral.conf
sudo ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/frontend.conf

### Restart nginx

sudo systemctl restart nginx.service

### Get letsencrypt Certs

sudo letsencrypt certonly --webroot -w /var/www/letsencrypt/.mesh/ -d ${meshdomain}
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt/.rmm/ -d ${frontenddomain}
sudo letsencrypt certonly --webroot -w /var/www/letsencrypt/.api/ -d ${rmmdomain}

### Ensure letsencrypt Permissions are correct
sudo chown ${USER}:${USER} -R /etc/letsencrypt
sudo chmod 775 -R /etc/letsencrypt

### Set variables for new certs

CERT_PRIV_KEY_API=/etc/letsencrypt/live/${rmmdomain}/privkey.pem
CERT_PUB_KEY_API=/etc/letsencrypt/live/${rmmdomain}/fullchain.pem
CERT_PRIV_KEY_RMM=/etc/letsencrypt/live/${frontenddomain}/privkey.pem
CERT_PUB_KEY_RMM=/etc/letsencrypt/live/${frontenddomain}/fullchain.pem
CERT_PRIV_KEY_MESH=/etc/letsencrypt/live/${meshdomain}/privkey.pem
CERT_PUB_KEY_MESH=/etc/letsencrypt/live/${meshdomain}/fullchain.pem

### Replace certs in files

rmmlocalsettings="$(cat << EOF
CERT_FILE = "${CERT_PUB_KEY_API}"
KEY_FILE = "${CERT_PRIV_KEY_API}"
EOF
)"
echo "${rmmlocalsettings}" | tee --append /rmm/api/tacticalrmm/tacticalrmm/local_settings.py > /dev/null

sudo sed -i "s|${CERT_PRIV_KEY}|${CERT_PRIV_KEY_API}|g" /etc/nginx/sites-available/rmm.conf
sudo sed -i "s|${CERT_PUB_KEY}|${CERT_PUB_KEY_API}|g" /etc/nginx/sites-available/rmm.conf
sudo sed -i "s|${CERT_PRIV_KEY}|${CERT_PRIV_KEY_MESH}|g" /etc/nginx/sites-available/meshcentral.conf
sudo sed -i "s|${CERT_PUB_KEY}|${CERT_PUB_KEY_MESH}|g" /etc/nginx/sites-available/meshcentral.conf
sudo sed -i "s|${CERT_PRIV_KEY}|${CERT_PRIV_KEY_RMM}|g" /etc/nginx/sites-available/frontend.conf
sudo sed -i "s|${CERT_PUB_KEY}|${CERT_PUB_KEY_RMM}|g" /etc/nginx/sites-available/frontend.conf

### Remove Wildcard Cert

rm -r /etc/letsencrypt/live/${rootdomain}/
rm -r /etc/letsencrypt/archive/${rootdomain}/
rm /etc/letsencrypt/renewal/${rootdomain}.conf

### Regenerate Nats Conf
cd /rmm/api/tacticalrmm
source ../env/bin/activate
python manage.py reload_nats

### Restart services

for i in rmm celery celerybeat nginx nats nats-api
do
printf >&2 "${GREEN}Restarting ${i} service...${NC}\n"
sudo systemctl restart ${i}
done

# Create renewal post hook to restart services after renewal
echo '#!/usr/bin/env bash' | sudo tee /etc/letsencrypt/renewal-hooks/post/001-restart-services.sh
sudo sed -i "/\#\!\/usr\/bin\/env bash/ a systemctl restart nginx meshcentral rmm celery celerybeat nats" /etc/letsencrypt/renewal-hooks/post/001-restart-services.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/post/001-restart-services.sh

### Renew certs can be done by sudo letsencrypt renew (this should automatically be in /etc/cron.d/certbot)
```

## Using your own certs with Docker

Let'sEncrypt is the only officially supported method of obtaining wildcard certificates. Publicly signed certificates should work but have not been fully tested.

If you are providing your own publicly signed certificates, ensure you download the **full chain** (combined CA/Root + Intermediary) certificate in pem format. If certificates are not provided, a self-signed certificate will be generated and most agent functions won't work.

## Restricting Access to rmm.EXAMPLE.COM

Limit access to Tactical RMM's administration panel in Nginx to specific locations:

### Using DNS

Create a file allowed-domain.list which contains the DNS names you want to grant access to your rmm:

    Edit `/etc/nginx/allowed-domain.list` and add:

    ```text
    nom1.dyndns.tv
    nom2.dyndns.tv
    ```

Create a bash script domain-resolver.sh which does the DNS lookups for you:

    Edit `/etc/nginx/domain-resolver.sh`

    ```bash
    #!/usr/bin/env bash
    filename="$1"
    while read -r line
    do
        ddns_record="$line"
        if [[ !  -z  $ddns_record ]]; then
            resolved_ip=getent ahosts $line | awk '{ print $1 ; exit }'
            if [[ !  -z  $resolved_ip ]]; then
                echo "allow $resolved_ip;# from $ddns_record"
            fi
        fi
    done < "$filename"
    ```

Give the right permission to this script `chmod +x /etc/nginx/domain-resolver.sh`

Add a cron job which produces a valid Nginx configuration and restarts Nginx:

    `/etc/cron.hourly/domain-resolver`

    ```bash
    #!/usr/bin/env bash
    /etc/nginx/domain-resolver.sh /etc/nginx/allowed-domain.list > /etc/nginx//allowed-ips-from-domains.conf
    service nginx reload > /dev/null 2>&1
    ```

    This can be a hourly, daily, or monthly job or you can have it run at a specific time. 

Give the right permission to this script `chmod +x /etc/cron.hourly/domain-resolver`

When run it will give something like this:

    Edit `/etc/nginx//allowed-ips-from-domains.conf`

    ```conf
    allow xxx.xxx.xxx.xxx;# from maison.nom1.dyndns.tv
    allow xxx.xxx.xxx.xxx;# from maison.nom2.dyndns.tv
    ```

Update your Nginx configuration to take this output into account:

    Edit `/etc/nginx/sites-enabled/frontend.conf`

    ```conf
    server {
        server_name rmm.example.com;
        charset utf-8;
        location / {
            root /var/www/rmm/dist;
            try_files $uri $uri/ /index.html;
            add_header Cache-Control "no-store, no-cache, must-revalidate";
            add_header Pragma "no-cache";
        }
        error_log  /var/log/nginx/frontend-error.log;
        access_log /var/log/nginx/frontend-access.log;
        include /etc/nginx/allowed-ips-from-domains.conf;
        deny all;
        listen 443 ssl;
        listen [::]:443 ssl;
        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    }

    server {
        if ($host = rmm.example.com) {
            return 301 https://$host$request_uri;
        }

        listen 80;
        listen [::]:80;
        server_name rmm.example.com;
        return 404;
    }
    ```
### Using a fixed IP

Create a file containg the fixed IP address (where xxx.xxx.xxx.xxx must be replaced by your real IP address):

    Edit `/etc/nginx/allowed-ips.conf`

    ```conf
    # Private IP address
    allow 192.168.0.0/16;
    allow 172.16.0.0/12;
    allow 10.0.0.0/8;
    # Public fixed IP address
    allow xxx.xxx.xxx.xxx
    ```

Update your Nginx configuration to take this output into account:

    Edit `/etc/nginx/sites-enabled/frontend.conf`

    ```conf
    server {
        server_name rmm.example.com;
        charset utf-8;
        location / {
            root /var/www/rmm/dist;
            try_files $uri $uri/ /index.html;
            add_header Cache-Control "no-store, no-cache, must-revalidate";
            add_header Pragma "no-cache";
        }
        error_log  /var/log/nginx/frontend-error.log;
        access_log /var/log/nginx/frontend-access.log;
        include /etc/nginx/allowed-ips;
        deny all;
        listen 443 ssl;
        listen [::]:443 ssl;
        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    }

    server {
        if ($host = rmm.example.com) {
            return 301 https://$host$request_uri;
        }

        listen 80;
        listen [::]:80;
        server_name rmm.example.com;
        return 404;
    }
    ```

### Automating SSL with Cloudflare

Use Cloudflare API with certbot

<https://www.bjornjohansen.com/wildcard-certificate-letsencrypt-cloudflare>

You need to restart mesh and nginx for changes to take effect
