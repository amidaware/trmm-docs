## Backing up the RMM

!!!note
    This is only applicable for the standard install, not Docker installs.

A backup script is provided for quick and easy way to backup all settings into one file to move to another server.

Download and run the backup script:

```bash
wget -N https://raw.githubusercontent.com/amidaware/tacticalrmm/master/backup.sh
chmod +x backup.sh
./backup.sh
```

The backup tar file will be saved in `/rmmbackups` with the following format:

`rmm-backup-CURRENTDATETIME.tar`

## Schedule to run Daily via Cron

Make a symlink in `/etc/cron.d` (daily cron jobs) with these contents `00 18 * * * tactical /rmm/backup.sh` to run at 6pm daily.

```bash
echo -e "\n" >> /rmm/backup.sh
sudo ln -s /rmm/backup.sh /etc/cron.daily/
```

!!!warning
    Currently the backup script doesn't have any pruning functions so the folder will grow forever without periodic cleanup. Or just become [awesome](https://github.com/fts-tmassey/tacticalrmm-cronbackup)

## Video Walkthru

<div class="video-wrapper">
  <iframe width="320" height="180" src="https://www.youtube.com/embed/rC0NgYJUf_8" frameborder="0" allowfullscreen></iframe>
</div>
