# Unsupported Install Platforms

## LXC installs

[Read source](https://discord.com/channels/736478043522072608/959541976372502598)

Tactical RMM install on LXC: redis not starting.

### Symptoms

1. Agent exe install shows `Server error (503)` pop-up during the installation process.
2. Running the `troubleshoot_server.sh` reports `redis-server service isn't running (Tactical wont work without this)`.
3. `systemctl start redis` reports a problem:
   ```log
   "Job for redis-server.service failed because the control process exited with error code.
   See "systemctl status redis-server.service" and "journalctl -xe" for details."
   ```

Checking the systemctl:

```bash
`systemctl status redis-server.service`
```

Produces the following:

```log
"Job for redis-server.service failed because the control process exited with error code.
See "systemctl status redis-server.service" and "journalctl -xe" for details.
root@rmm:/home/tactical# systemctl status redis-server.service
● redis-server.service - Advanced key-value store
     Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Fri 2022-04-01 21:35:05 UTC; 1min 26s ago
       Docs: http://redis.io/documentation,
             man:redis-server(1)
    Process: 14975 ExecStart=/usr/bin/redis-server /etc/redis/redis.conf --supervised systemd --daemonize no (code=exited, status=2>
   Main PID: 14975 (code=exited, status=226/NAMESPACE)

Apr 01 21:35:05 rmm systemd[1]: redis-server.service: Main process exited, code=exited, status=226/NAMESPACE
Apr 01 21:35:05 rmm systemd[1]: redis-server.service: Failed with result 'exit-code'.
Apr 01 21:35:05 rmm systemd[1]: Failed to start Advanced key-value store.
Apr 01 21:35:05 rmm systemd[1]: redis-server.service: Scheduled restart job, restart counter is at 5.
Apr 01 21:35:05 rmm systemd[1]: Stopped Advanced key-value store.
Apr 01 21:35:05 rmm systemd[1]: redis-server.service: Start request repeated too quickly.
Apr 01 21:35:05 rmm systemd[1]: redis-server.service: Failed with result 'exit-code'.
Apr 01 21:35:05 rmm systemd[1]: Failed to start Advanced key-value store.
lines 1-16/16 (END)"
```

### The Fix

[(https://stackoverflow.com/questions/49670211/failed-to-start-advanced-key-value-store-redis-server-service-control-process-e)](https://stackoverflow.com/questions/49670211/failed-to-start-advanced-key-value-store-redis-server-service-control-process-e)

Remove the server that comes with Tactical RMM:

```bash
apt-get --purge redis-server
```

Delete the `/var/log/redis` directory, then:

```bash
apt-get install redis-server
```

Then installation would look like this:

```log
"Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  redis-server
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 0 B/98.2 kB of archives.
After this operation, 196 kB of additional disk space will be used.
Selecting previously unselected package redis-server.
(Reading database ... 36187 files and directories currently installed.)
Preparing to unpack .../redis-server_5%3a6.0.16-1+deb11u2_amd64.deb ...
Unpacking redis-server (5:6.0.16-1+deb11u2) ...
Setting up redis-server (5:6.0.16-1+deb11u2) ...
Created symlink /etc/systemd/system/redis.service → /lib/systemd/system/redis-server.service.
Created symlink /etc/systemd/system/multi-user.target.wants/redis-server.service → /lib/systemd/system/redis-server.service.
Job for redis-server.service failed because the control process exited with error code.
See "systemctl status redis-server.service" and "journalctl -xe" for details.
Processing triggers for man-db (2.9.4-2) ..."
```

Running the redis-server would shed more light on the issue:

```bash
/usr/bin/redis-server /etc/redis/redis.conf
```

```log
*** FATAL CONFIG FILE ERROR (Redis 6.0.16) ***
Reading the configuration file, at line 260
>>> 'logfile /var/log/redis/redis-server.log'
Can't open the log file: No such file or directory'
```

Apparently, `/ver/log/redis` has to be created manually:

```bash
'mkdir /var/log/redis
chown -R redis:redis /var/log/redis
chmod -R u+rwX,g+rwX,u+rx /var/log/redis'
```

Run redis-server:

```bash
su -s /bin/bash -c '/usr/bin/redis-server /etc/redis/redis.conf' redis
```

Confirm with:

```bash
ps ax|grep redis
```

All done! Thanks [FWG]SSOO