# Restore

!!!warning
    This script will only run on a freshly installed “empty” server with no TRMM installed or TRMM failed install. Plan accordingly (aka snapshot back to pre-`restore.sh` run or re-setup a new fresh VPS).

!!!info
    The restore script will only restore to a different physical or virtual server. It cannot be used to restore to a different domain/subdomain. If you would like to restore to a different domain/subdomain, [commercial support](https://support.amidaware.com/) offers a paid domain name migration service.

    If the purpose of your restore is to migrate your instance from one machine to another e.g. to upgrade your install to a newer OS and/or different arch, then it is recommended to leave both the old and new instances up and running until all your agents have successfully migrated to the new instance. You can use the old instance to forcefully migrate stubborn agents that are still attached to it (see instructions below).

### Setup the new server

Follow the same instructions as a [fresh install](install_server.md) but stop when you reach the 'Run the install script' section (you'll be using the restore script instead of install).

!!!tip
    Take a snapshot of your vm if possible so you can get back to this point if something doesn't work right and you have to try the restore again.

### Change DNS A records

Open the DNS manager of wherever your domain is hosted.

Update the 3 A records `rmm`, `api` and `mesh` and point them to the public IP of your new server.
### Run the restore script

Switch to the `tactical` user (if you used a custom username, it must match the install you're coming from):

```bash
su - tactical
```

Copy the backup tarball you created during [backup](backup.md) to the new server (eg in your `tactical` users home folder).

Download the restore script:

```bash
wget -N https://raw.githubusercontent.com/amidaware/tacticalrmm/master/restore.sh
chmod +x restore.sh
```

Call the restore script, passing it the backup tarball as the first argument:

```bash
./restore.sh rmm-backup-XXXXXXXXX.tar
```


Note: the section below is only applicable if you are migrating to a new instance while still keeping the old instance. If you used the same VM to restore then you are done.

Once the restore has completed, log into your **OLD** instance and from the Web UI do **Tools > Recover All Agents**.

!!!info
    You will most probably have to add entries to your host file (on the machine you're trying to access the web UI from) for your subdomains to access the old instance, since you'll already have updated DNS to point to the new server.

What this will do is restart both the tacticalagent and meshagent services on any stubborn agents that are still connected to the old instance, which should be enough to get them connected to the new instance.

## Restore Testing

If you want to validate your backups the best way to do that is to:

1. Run the standard Restore to a new temp VM as [above](#setup-the-new-server).
2. Run `sudo systemctl celery celerybeat` to stop the restored test VM from sending agent offline false alerts.
3. Change the hosts file on your computer so that only your computer overrides regular DNS and allows you to login and test your test restore. Add the server ip and names in one line like this `192.168.55.5 rmm.example.com api.example.com mesh.example.com`.
4. Login and test things, see agents, policies, agent history etc.
5. Undo hosts file entry and delete test VM
