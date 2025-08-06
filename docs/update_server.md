# Updating the RMM

[Keeping your Linux server up to date](#keeping-your-linux-server-up-to-date)

[Updating to the latest RMM version](#updating-to-the-latest-rmm-version)

[Keeping your Let's Encrypt certificate up to date](#keeping-your-lets-encrypt-ssl-certificate-up-to-date)

[Video Walkthru](#video-walkthru)

## Keeping your Linux server up to date

You should periodically run `sudo apt update` and `sudo apt -y upgrade` to keep your server up to date.

Other than this, you should avoid making any changes to your server and let the `update.sh` script handle everything else for you.

!!!danger
    Do **NOT** attempt in-place OS upgrades, such as trying to in-place upgrade from Debian 11 to 12. You will break your server!

Instead, you must [backup](./backup.md) and [restore](./restore.md) to the new OS. 

Backup/restore functionality supports transition not only between different operating systems but also between architectures! For instance, you can back up an Ubuntu 20.04 system on an x86 architecture and restore it to an Oracle Cloud Free Tier ARM architecture running Debian 12.

## Updating to the latest RMM version

!!!danger
    Do __not__ attempt to manually edit the update script or any configuration files unless specifically told to by one of the developers.

    Since this software is completely self hosted and we have no access to your server, we have to assume you have not made any config changes to any of the files or services on your server, and the update script will assume this.

    You should also **never** attempt to automate running the update script via cron.

    The update script will update itself if needed to the latest version when you run it, and then prompt you to run it again.

    Sometimes, manual intervention will be required during an update in the form of yes/no prompts, so attempting to automate this will ignore these prompts and cause your installation to break.

SSH into your server as the user you created during install (eg `tactical`).

!!!danger
    __Never__ run any update scripts or commands as the `root` user.

    This will mess up permissions and break your installation.

!!!question
    You have a [backup](backup.md), right?

    You've reviewed all [release notes](https://github.com/amidaware/tacticalrmm/releases) between your current version and the latest version, right?


Download the update script and run it:

```bash
wget -N https://raw.githubusercontent.com/amidaware/tacticalrmm/master/update.sh
chmod +x update.sh
./update.sh
```

If you are already on the latest version, the update script will notify you of this and return immediately.

You can pass the optional `--force` flag to the update script to forcefully run through an update, which will bypass the check for latest version.

```bash
wget -N https://raw.githubusercontent.com/amidaware/tacticalrmm/master/update.sh
chmod +x update.sh
./update.sh --force
```

This is useful for a botched update that might have not completed fully.

The update script will also fix any permissions that might have gotten messed up during a botched update, or if you accidentally ran the update script as the `root` user.

!!!warning
    Do __not__ attempt to manually update MeshCentral to a newer version.

    You should let the `update.sh` script handle this for you.

    The developers will test MeshCentral and make sure integration does not break before bumping the mesh version.

## Keeping your SSL certificates up to date

=== "Let's Encrypt Certs"

    !!! info
        Currently, the update script does not automatically renew your Let's Encrypt wildcard certificate, which expires every 3 months, since this is non-trivial to automate using the DNS TXT record method.

    **Update SSL:** To renew and update your Let's Encrypt wildcard SSL certificate, run the following command, replacing `example.com` with your domain and `admin@example.com` with your email:

    ```bash
    sudo certbot certonly --manual -d *.example.com --agree-tos --no-bootstrap --preferred-challenges dns -m admin@example.com --no-eff-email
    ```

    Same instructions as during install for [verifying the TXT record](install_server.md#step-6-deploy-the-txt-record-in-your-dns-manager-for-lets-encrypt-wildcard-certs) has propagated before hitting ++enter++.

    <font color="red" size="20"><p style="text-align:center">**You're not done yet, keep reading!**</p></font>

    After renewing the certificate, it still needs to be applied to Tactical RMM. Now run the `update.sh` script, passing it the `--force` flag:

    ```bash
    ./update.sh --force
    ```

=== "BYO (Bring Your Own) Wildcard Certs"

    1. Replace the certificate and private key at the paths chosen during installation.
    
    2. Ensure they are readable by the Tactical Linux user.
    
    3. Restart the necessary services to apply the changes:

    ```bash
    sudo systemctl restart nginx meshcentral rmm daphne
    ```
    
## Video Walkthru

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/ElUfQgesYs0" frameborder="0" allowfullscreen></iframe>
</div>

# Update FAQ

Based on years of feedback, if your server was working, you updated...and now it's not working you probably did one of these things:

1. Not running certbot with the correct linux username (the one you installed TRMM with)
2. Didn't put the `*.` in front of your domain name in the certbot command (or other certbot command typo).
3. You [didn't](guide_gettingstarted.md#dont-do-these-things) `do-release-upgrade` did you?
4. Running an #unsupported proxy and assumed your reverse proxy was the only cert you needed to update?
