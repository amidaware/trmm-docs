# Docker Setup

!!!danger
    Docker is not officially supported at the moment and not recommended for production use unless you are an advanced docker user and very comfortable managing and troubleshooting docker.<br/><br/>
    Please read the [docker install considerations](install_considerations.md#docker-install) before continuing.

### Install Docker

Install docker.

Please keep in mind that the docker package is usually called docker.io in debian based distros including ubuntu

### Create the DNS A records

!!!warning
    All 3 domain names have to be at the same subdomain level because you only get one LetsEncrypt wildcard cert, and it'll only apply to that level of DNS name.

We'll be using `example.com` as our domain for this example.

!!!info
    The RMM uses 3 different sites. The Vue frontend e.g. `rmm.example.com` which is where you'll be accessing your RMM from the browser, the REST backend e.g. `api.example.com` and MeshCentral e.g. `mesh.example.com`

1. Get the public IP of your server with `curl https://icanhazip.tacticalrmm.io`
2. Open the DNS manager of wherever the domain you purchased is hosted.
3. Create 3 A records: `rmm`, `api` and `mesh` and point them to the public IP of your server:

![arecords](images/arecords.png)

### Acquire Let's Encrypt wildcard certs with Certbot

!!!warning
    If the Let's Encrypt wildcard certificates are not provided, a self-signed certificate will be generated and most agent functions won't work.

**1 ) Install Certbot**

```bash
sudo apt-get install certbot
```

**2 ) Generate the wildcard Let's Encrypt certificates**

We're using the [DNS-01 challenge method](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge).

**3 ) Deploy the TXT record in your DNS manager**

!!!warning
    TXT records can take anywhere from 1 minute to a few hours to propagate depending on your DNS provider.<br/>
    You should verify the TXT record has been deployed first before pressing Enter.<br/>
    A quick way to check is with the following command:<br/> `dig -t txt _acme-challenge.example.com`<br/>
    or test using: <https://viewdns.info/dnsrecord/> Enter: `_acme-challenge.example.com`

![txtrecord](images/txtrecord.png)

![dnstxt](images/dnstxt.png)

**4 ) Request  ncrypt wildcard cert**

```bash
sudo certbot certonly --manual -d *.example.com --agree-tos --no-bootstrap --preferred-challenges dns
```

!!!note
    Replace `example.com` with your root domain.

### Configure DNS and firewall

You will need to add DNS entries so that the three subdomains resolve to the IP of the docker host. There is a reverse proxy running that will route the hostnames to the correct container. On the host, you will need to ensure the firewall is open on TCP port 443.

### Setting up the environment

Get the docker-compose and .env.example file on the host you which to install on

```bash
wget https://raw.githubusercontent.com/amidaware/tacticalrmm/master/docker/docker-compose.yml
wget https://raw.githubusercontent.com/amidaware/tacticalrmm/master/docker/.env.example
mv .env.example .env
```

Change the values in .env to match your environment.

When supplying certificates through Let's Encrypt, see the section below about base64 encoding the certificate files.

### Base64 encoding certificates to pass as env variables

Use the below command to add the the correct values to the .env.

Running this command multiple times will add redundant entries, so those will need to be removed.

Let's Encrypt certs paths are below. Replace ${rootdomain} with your own.

public key
`/etc/letsencrypt/live/${rootdomain}/fullchain.pem`

private key
`/etc/letsencrypt/live/${rootdomain}/privkey.pem`

```bash
echo "CERT_PUB_KEY=$(sudo base64 -w 0 /path/to/pub/key)" >> .env
echo "CERT_PRIV_KEY=$(sudo base64 -w 0 /path/to/priv/key)" >> .env
```

### Starting the environment

Run the below command to start the environment:

```bash
docker compose up -d
```

Removing the -d will start the containers in the foreground and is useful for debugging.

If you get a error saying you don't have permission you can add yourself to the docker group with:
```
sudo usermod -aG docker [user]
```
You may need to log out and back in for it to take full effect.

### Login

Navigate to `https://rmm.example.com` and login with the username/password you created during install.

Once logged in, you will be redirected to the initial setup page.

Create your first client/site and choose the default timezone.

## Note About Backups

The backup script **does not** work with docker. To backup your install use [standard docker backup/restore](https://docs.docker.com/desktop/backup-and-restore/) processes.

Or, you can look at [larseberhardt/TRMM-Docker-Backup-Script](https://github.com/larseberhardt/TRMM-Docker-Backup-Script).
