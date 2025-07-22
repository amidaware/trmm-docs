# Unsupported Reference Scripts

!!!note
    These are not supported scripts/configurations by Tactical RMM, but it's provided here for your reference.

    Although these aren't officially supported configurations, we generally will help point you in the right direction. Please use the Discord [#unsupported channel](https://discord.com/channels/736478043522072608/888474319750066177) to discuss issues related to these complex installations.

## Fail2ban

Install fail2ban

```bash
sudo apt install -y fail2ban python3-systemd
```
There is a known issue on Debian 12 where fail2ban doesnt start, if its not running (check with `systemctl status fail2ban`) if its not please check `/etc/fail2ban/jail.local` exists, if it doesn't, do the following:

```bash
echo -e "[sshd]\nbackend=systemd\nenabled=true" | sudo tee /etc/fail2ban/jail.local
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

## Using your own certs with Docker

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
        resolved_ip=$( getent ahosts $line | awk '{ print $1 ; exit }' )
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

Update your Nginx's configuration to take this output into account:

Edit `/etc/nginx/sites-enabled/frontend.conf`

```conf
server {
    ....
    include /etc/nginx/allowed-ips-from-domains.conf;
    deny all;
    listen 443 ssl;
    ....
}

```
### Using a fixed IP

Create a file containg the fixed IP address (where xxx.xxx.xxx.xxx must be replaced by your real IP address):

Edit `/etc/nginx/allowed-ips.conf`

```
# Private IP address
allow 192.168.0.0/16;
allow 172.16.0.0/12;
allow 10.0.0.0/8;
# Public fixed IP address
allow xxx.xxx.xxx.xxx
```

Update your Nginx configuration to take this output into account.

Edit `/etc/nginx/sites-enabled/frontend.conf`

```
server {
    ....
    include /etc/nginx/allowed-ips.conf;
    deny all;
    ....
}
```

### Automating SSL with Cloudflare

Use Cloudflare API with certbot

<https://www.bjornjohansen.com/wildcard-certificate-letsencrypt-cloudflare>

You need to restart mesh and nginx for changes to take effect
