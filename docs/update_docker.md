# Updating the RMM (Docker)

## Updating to the latest RMM version

!!!question
    You have a [backup](https://docs.docker.com/desktop/backup-and-restore/), right? RIGHT?!

Tactical RMM updates the docker images on every release and should be available within a few minutes.

SSH into your server as a user that is in the docker group and run the below commands:

```bash
cd [dir/with/compose/file]
mv docker-compose.yml docker-compose.yml.old
wget https://raw.githubusercontent.com/amidaware/tacticalrmm/master/docker/docker-compose.yml
docker compose pull
docker compose down
docker compose up -d --remove-orphans
```

If your user isn't in the docker group you can add yourself to the group with:

```
sudo usermod -aG docker [user]
```
Keep in mind that you will most likely need to log out and then back in


## Keeping your Let's Encrypt certificate up to date

To renew your Let's Encrypt wildcard cert, run the following command, replacing `example.com` with your domain and `admin@example.com` with your email:

```bash
sudo certbot certonly --manual -d *.example.com --agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns -m admin@example.com --no-eff-email
```

Verify the domain with the TXT record. Once issued, run the below commands to base64 encode the certificates and add them to the .env file.

```bash
echo "CERT_PUB_KEY=$(sudo base64 -w 0 /etc/letsencrypt/live/${rootdomain}/fullchain.pem)" >> .env
echo "CERT_PRIV_KEY=$(sudo base64 -w 0 /etc/letsencrypt/live/${rootdomain}/privkey.pem)" >> .env
```

!!!warning
    You must remove the old and any duplicate entries for CERT_PUB_KEY and CERT_PRIV_KEY in the .env file.

Now run `docker compose up -d restart` and the new certificate will be in effect.

Bonus: [Upgrade postgres13 to 14](https://github.com/amidaware/trmm-awesome#docker-upgrade-postgres-13-to-14)
