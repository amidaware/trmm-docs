# How It All Works

## Understanding TRMM

Anything you configure: scripts, tasks, patching, etc is queued and scheduled on the server to do something.
Everything that is queued, happens immediately when agents are online.
The agent gets a NATS command, the server tells it to do xyz and it does it.

When agents are not connected to the server nothing happens. The Windows Task Scheduler says do x at some time, what it's asked to do is get x command from the server. If the server is offline, nothing happens.
If an agent comes online, every x interval (Windows Update, pending tasks etc) check and see if there is something for me to do that I missed while I was offline. When that time occurs (eg agent sees if it needs to update itself at 35 minutes past every hour [Update Agents](update_agents.md) ) it'll get requested on the online agent.

That's the simplified general rule for everything TRMM.

[![Network Design](images/TacticalRMM-Network.png)](images/TacticalRMM-Network.png)

[Image Source](images/TacticalRMM-Network.drawio)

Still need graphics for:

    1. Agent installer steps

    2. Agent checks / tasks and how they work on the workstation/interact with server

## Server

Has a Postgres database located here:

[Django Admin](functions/django_admin.md)

!!!description
    A web interface for the Postgres database

All Tactical RMM dependencies are listed [here](https://github.com/amidaware/tacticalrmm/blob/develop/api/tacticalrmm/requirements.txt).

A complete list of all packages used by Tactical RMM are listed [here](https://github.com/amidaware/tacticalrmm-web/blob/develop/package-lock.json).

### Outbound Firewall Rules

If you have strict outbound firewall rules these are the outbound rules needed for all functionality:

#### Regular Use

1. Access to Github for downloading and installing TRMM, and checking if new TRMM version is available to show in the admin web panel.
2. Access to nginx.org to [install](https://github.com/amidaware/tacticalrmm/blob/ae5d0b1d81ed7e7ee1f3ebaafaf8a8ad96c8a49a/install.sh#L180)
3. Access to mongodb.org to [install](https://github.com/amidaware/tacticalrmm/blob/ae5d0b1d81ed7e7ee1f3ebaafaf8a8ad96c8a49a/install.sh#L241)
4. Access to python.org to [install](https://github.com/amidaware/tacticalrmm/blob/ae5d0b1d81ed7e7ee1f3ebaafaf8a8ad96c8a49a/install.sh#L253)
5. Access to postgresql.org to [install](https://github.com/amidaware/tacticalrmm/blob/ae5d0b1d81ed7e7ee1f3ebaafaf8a8ad96c8a49a/install.sh#L269)
6. Whatever servers [Let's Encrypt](https://letsencrypt.org/docs/faq/#what-ip-addresses-does-let-s-encrypt-use-to-validate-my-web-server) uses for DNS-01 challenges
7. Cloudflare is for the licensing servers.

#### Server Without Code Signing Key

No additional rules needed.

#### Server With Code Signing Key

No additional rules needed.

### System Services

This lists the system services used by the server.

Quick server health inspection

```bash
cd /rmm/api/tacticalrmm/
source ../env/bin/activate
for i in active reserved scheduled stats; do celery -A tacticalrmm inspect $i; done
```

#### Nginx Web Server

Nginx is the web server for the `rmm`, `api`, and `mesh` domains. All sites redirect port 80 (HTTP) to port 443 (HTTPS).

???+ abstract "nginx configuration (a.k.a. sites available)"

    - [nginx configuration docs](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)

    === ":material-web: `rmm.example.com`"

        This serves the frontend website that you interact with.

        - Config: `/etc/nginx/sites-enabled/frontend.conf`
        - root: `/var/www/rmm/dist`
        - Access log: `/var/log/nginx/frontend-access.log`
        - Error log: `/var/log/nginx/frontend-error.log`
        - TLS certificate: `/etc/letsencrypt/live/example.com/fullchain.pem`

    === ":material-web: `api.example.com`"

        This serves the TRMM API for the frontend and agents.

        - Config: `/etc/nginx/sites-enabled/rmm.conf`
        - roots:
            - `/rmm/api/tacticalrmm/static/`
            - `/rmm/api/tacticalrmm/tacticalrmm/private/`
        - Upstreams:
            - `unix://rmm/api/tacticalrmm/tacticalrmm.sock`
            - `unix://rmm/daphne.sock`
        - Access log: `/rmm/api/tacticalrmm/tacticalrmm/private/log/access.log`
        - Error log: `/rmm/api/tacticalrmm/tacticalrmm/private/log/error.log`
        - TLS certificate: `/etc/letsencrypt/live/example.com/fullchain.pem`

    === ":material-web: `mesh.example.com`"

        This serves MeshCentral for remote access.

        - Config: `/etc/nginx/sites-enabled/meshcentral.conf`
        - Upstream: `http://127.0.0.1:4430/`
        - Access log: `/var/log/nginx/access.log` (uses default)
        - Error log: `/var/log/nginx/error.log` (uses default)
        - TLS certificate: `/etc/letsencrypt/live/example.com/fullchain.pem`

    === ":material-web: default"

        This is the default site installed with nginx. This listens on port 80 only.

        - Config: `/etc/nginx/sites-enabled/default`
        - root: `/var/www/rmm/dist`
        - Access log: `/var/log/nginx/access.log` (uses default)
        - Error log: `/var/log/nginx/error.log` (uses default)

???+ note "systemd config"

    === ":material-console-line: status commands"

        - Status: `systemctl status --full nginx.service`
        - Stop: `systemctl stop nginx.service`
        - Start: `systemctl start nginx.service`
        - Restart: `systemctl restart nginx.service`
        - Restart: `systemctl reload nginx.service` reloads the config without restarting
        - Test config: `nginx -t`
        - Listening process: `ss -tulnp | grep nginx`

    === ":material-ubuntu: standard"

        - Service: `nginx.service`
        - Address: `0.0.0.0`
        - Port: 443
        - Exec: `/usr/sbin/nginx -g 'daemon on; master_process on;'`
        - Version: 1.18.0

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-nginx"`
        - View logs: `docker compose logs tactical-nginx`
        - "tail" logs: `docker compose logs tactical-nginx | tail`
        - Shell access: `docker exec -it trmm-nginx /bin/bash`


#### Tactical RMM (Django uWSGI) Service

Built on the Django framework, the Tactical RMM service is the heart of the system by serving the API for the frontend and agents.

???+ note "uWSGI config"

    - [uWSGI docs](https://uwsgi-docs.readthedocs.io/en/latest/index.html)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full rmm.service`
        - Stop: `systemctl stop rmm.service`
        - Start: `systemctl start rmm.service`
        - Restart: `systemctl restart rmm.service`
        - journalctl:
            - "tail" the logs: `journalctl --identifier uwsgi --follow`
            - View the logs: `journalctl --identifier uwsgi --since "30 minutes ago" | less`
            - Debug logs for 5xx errors will be located in `/rmm/api/tacticalrmm/tacticalrmm/private/log`

    === ":material-ubuntu: standard"

        - Service: `rmm.service`
        - Socket: `/rmm/api/tacticalrmm/tacticalrmm.sock`
        - uWSGI config: `/rmm/api/tacticalrmm/app.ini`
        - Log: None
        - Journal identifier: `uwsgi`
        - Version: 2.0.18

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-backend"`
        - View logs: `docker compose logs tactical-backend`
        - "tail" logs: `docker compose logs tactical-backend | tail`
        - Shell access: `docker exec -it trmm-backend /bin/bash`

#### Daphne: Django Channels Daemon

[Daphne](https://github.com/django/daphne) is the official ASGI HTTP / WebSocket server maintained by the [Channels project](https://channels.readthedocs.io/en/stable/index.html).

???+ note "Daphne config"

    - Django [Channels configuration docs](https://channels.readthedocs.io/en/stable/topics/channel_layers.html)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full daphne.service`
        - Stop: `systemctl stop daphne.service`
        - Start: `systemctl start daphne.service`
        - Restart: `systemctl restart daphne.service`
        - journalctl (this provides only system start/stop logs, not the actual logs):
            - "tail" the logs: `journalctl --identifier daphne --follow`
            - View the logs: `journalctl --identifier daphne --since "30 minutes ago" | less`

    === ":material-ubuntu: standard"

        - Service: `daphne.service`
        - Socket: `/rmm/daphne.sock`
        - Exec: `/rmm/api/env/bin/daphne -u /rmm/daphne.sock tacticalrmm.asgi:application`
        - Config: `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`
        - Log: `/rmm/api/tacticalrmm/tacticalrmm/private/log/trmm_debug.log`

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-websockets"`
        - View logs: `docker compose logs tactical-websockets`
        - "tail" logs: `docker compose logs tactical-websockets | tail`
        - Shell access: `docker exec -it trmm-websockets /bin/bash`

#### NATS Server Service

[NATS](https://nats.io/) is a messaging bus for "live" communication between the agent and server. NATS provides the framework for the server to push commands to the agent and receive information back.

???+ note "NATS config"

    - [NATS server configuration docs](https://docs.nats.io/running-a-nats-service/configuration)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full nats.service`
        - Stop: `systemctl stop nats.service`
        - Start: `systemctl start nats.service`
        - Restart: `systemctl restart nats.service`
        - Reload: `systemctl reload nats.service` reloads the config without restarting
        - journalctl:
            - "tail" the logs: `journalctl --identifier nats-server --follow`
            - View the logs: `journalctl --identifier nats-server --since "30 minutes ago" | less`
        - Listening process: `ss -tulnp | grep nats-server`
        - Checking for NATS or websocket problems `sudo journalctl --no-pager -u nats` and `sudo journalctl --no-pager -u nats-api`

    === ":material-ubuntu: standard"

        - Service: `nats.service`
        - Address: `0.0.0.0`
        - Port: `4222 (standard), 9235 (websocket)`
        - Exec: `/usr/local/bin/nats-server --config /rmm/api/tacticalrmm/nats-rmm.conf`
        - Config: `/rmm/api/tacticalrmm/nats-rmm.conf`
            - TLS: `/etc/letsencrypt/live/example.com/fullchain.pem`
        - Log: None
        - Version: v2.3.3

    === ":material-docker: docker"

        - Get into bash in your docker with: `docker exec -it trmm-nats /bin/bash`
        - Log: `nats-api -log debug`
        - Shell access: `docker exec -it trmm-nats /bin/bash`

#### NATS API Service

???+ note "NATS API config"

    === ":material-console-line: status commands"

        - Status: `systemctl status --full nats-api.service`
        - Stop: `systemctl stop nats-api.service`
        - Start: `systemctl start nats-api.service`
        - Restart: `systemctl restart nats-api.service`
        - journalctl: This application does not appear to log anything.

    === ":material-ubuntu: standard"

         - Service: `nats-api.service`
         - Exec: `/usr/local/bin/nats-api --config /rmm/api/tacticalrmm/nats-api.conf`
         - Config: `/rmm/api/tacticalrmm/nats-api.conf`
             - TLS: `/etc/letsencrypt/live/example.com/fullchain.pem`
         - Log: None

    === ":material-docker: docker"

        - Get into bash in your docker with: `docker exec -it trmm-nats /bin/bash`
        - Log: `nats-api -log debug`

#### Celery Service

[Celery](https://github.com/celery/celery) is a task queue focused on real-time processing and is responsible for scheduling tasks to be sent to agents.

Log located at `/var/log/celery`

???+ note "Celery config"

    - [Celery docs](https://docs.celeryproject.org/en/stable/index.html)
    - [Celery configuration docs](https://docs.celeryproject.org/en/stable/userguide/configuration.html)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full celery.service`
        - Stop: `systemctl stop celery.service`
        - Start: `systemctl start celery.service`
        - Restart: `systemctl restart celery.service`
        - journalctl: Celery executes `sh` causing the systemd identifier to be `sh`, thus mixing the `celery` and `celerybeat` logs together.
            - "tail" the logs: `journalctl --identifier sh --follow`
            - View the logs: `journalctl --identifier sh --since "30 minutes ago" | less`
        - Tail logs: `tail -F /var/log/celery/w*-*.log`

    === ":material-ubuntu: standard"

        - Service: `celery.service`
        - Exec: `/bin/sh -c '${CELERY_BIN} -A $CELERY_APP multi start $CELERYD_NODES --pidfile=${CELERYD_PID_FILE} --logfile=${CELERYD_LOG_FILE} --loglevel="${CELERYD_LOG_LEVEL}" $CELERYD_OPTS'`
        - Config: `/etc/conf.d/celery.conf`
        - Log: `/var/log/celery/w*-*.log`

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-celery"`
        - View logs: `docker compose logs tactical-celery`
        - "tail" logs: `docker compose logs tactical-celery | tail`
        - Shell access: `docker exec -it trmm-celery /bin/bash`

#### Celery Beat Service

[Celery Beat](https://github.com/celery/django-celery-beat) is a scheduler. It kicks off tasks at regular intervals, that are then executed by available worker nodes in the cluster.

???+ note "Celery Beat config"

    - [Celery beat docs](https://docs.celeryproject.org/en/stable/userguide/periodic-tasks.html)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full celerybeat.service`
        - Stop: `systemctl stop celerybeat.service`
        - Start: `systemctl start celerybeat.service`
        - Restart: `systemctl restart celerybeat.service`
        - journalctl: Celery executes `sh` causing the systemd identifier to be `sh`, thus mixing the `celery` and `celerybeat` logs together.
            - "tail" the logs: `journalctl --identifier sh --follow`
            - View the logs: `journalctl --identifier sh --since "30 minutes ago" | less`
        - Tail logs: `tail -F /var/log/celery/beat.log`

    === ":material-ubuntu: standard"

        - Service: `celerybeat.service`
        - Exec: `/bin/sh -c '${CELERY_BIN} -A ${CELERY_APP} beat --pidfile=${CELERYBEAT_PID_FILE} --logfile=${CELERYBEAT_LOG_FILE} --loglevel=${CELERYD_LOG_LEVEL}'`
        - Config: `/etc/redis/redis.conf`
        - Log: `/var/log/celery/beat.log`

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-celerybeat"`
        - View logs: `docker compose logs tactical-celerybeat`
        - "tail" logs: `docker compose logs tactical-celerybeat | tail`
        - Shell access: `docker exec -it trmm-celerybeat /bin/bash`

#### Redis Service

[Redis](https://github.com/redis/redis) is an in-memory data structure store used as a database, cache, and message broker for Django / Celery.

Log located at `/var/log/redis`

???+ note "Redis config"

    - [Redis docs](https://redis.io/)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full redis-server.service`
        - Stop: `systemctl stop redis-server.service`
        - Start: `systemctl start redis-server.service`
        - Restart: `systemctl restart redis-server.service`
        - Tail logs: `tail -F /var/log/redis/redis-server.log`

    === ":material-ubuntu: standard"

        - Service: `redis-server.service`
        - Log: `/var/log/redis/redis-server.log`

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-redis"`
        - View logs: `docker compose logs tactical-redis`
        - "tail" logs: `docker compose logs tactical-redis | tail`
        - Shell access: `docker exec -it trmm-redis /bin/bash`

#### MeshCentral

[MeshCentral](https://github.com/Ylianst/MeshCentral) is used for "Take Control" (connecting to machine for remote access), and 2 screens of the "Remote Background" (Terminal, and File Browser).

Config file location:

```bash
/meshcentral/meshcentral-data/config.json
```

[Customize](https://ylianst.github.io/MeshCentral/meshcentral/config/) with care.

!!!info
    Mesh usernames are **CaSe sEnSiTive**. Tactical will make sure it's all lower case to avoid sync problems.

???+ note "MeshCentral"

    - [MeshCentral docs](https://ylianst.github.io/MeshCentral/)

    === ":material-console-line: status commands"

        - Status: `systemctl status --full meshcentral`
        - Stop: `systemctl stop meshcentral`
        - Start: `systemctl start meshcentral`
        - Restart: `systemctl restart meshcentral`

    === ":material-docker: docker"

        - From the docker host view container status - `docker ps --filter "name=trmm-meshcentral"`
        - View logs: `docker compose logs tactical-meshcentral`
        - "tail" logs: `docker compose logs tactical-meshcentral | tail`
        - Shell access: `docker exec -it trmm-meshcentral /bin/bash`

    === ":material-remote-desktop: Debugging"

        - Open either "Take Control" or "Remote Background" to get mesh login token.
        - Open https://mesh.example.com to open native mesh admin interface.
        - Left-side "My Server" > Choose "Console" > type `agentstats`
        - To view detailed logging goto "Trace" > click Tracing button and choose categories.

        If you run `sudo systemctl status --full --no-pager meshcentral` and you don't see `Active: active (running) since ...`

        You can manually run meshcentral using this command to see the full output with errors.

        ```bash
        sudo systemctl stop meshcentral
        cd /meshcentral/
        /usr/bin/node node_modules/meshcentral
        ```

#### MeshCentral Agent

Get Mesh Agent Version info with this command. Should match server version.

```cmd
"C:\Program Files\Mesh Agent\MeshAgent.exe" -info"
```
Compare the hash with the tags in the repo at <https://github.com/Ylianst/MeshAgent/tags>.

Checks / tasks / agent data uses regular http to Nginx.

Agent status uses NATS websockets.

### Other Dependencies

[Django](https://www.djangoproject.com/) - Framework to enable the server to interact with browser.

<details>
  <summary>Django dependencies</summary>

```text
future==0.18.2
loguru==0.5.3
msgpack==1.0.2
packaging==20.9
psycopg2-binary==2.9.1
pycparser==2.20
pycryptodome==3.10.1
pyotp==2.6.0
pyparsing==2.4.7
pytz==2021.1
```
</details>

[qrcode](https://pypi.org/project/qrcode/) - Creating QR codes for 2FA.

<details>
  <summary>qrcode dependencies</summary>

```text
requests==2.25.1
six==1.16.0
sqlparse==0.4.1
```
</details>

[Twilio](https://www.twilio.com/) - Python SMS notification integration.

<details>
  <summary>twilio dependencies</summary>

```text
urllib3==1.26.5
uWSGI==2.0.19.1
validators==0.18.2
vine==5.0.0
websockets==9.1
zipp==3.4.1
```
</details>


## Windows Agent

Found in `%programfiles%\TacticalAgent`

The Tactical RMM agent runs under the `SYSTEM` security context.

When scripts / checks execute, they are:

1. Transferred from the server via NATS.
2. Saved to a randomly created file in `C:\ProgramData\TacticalRMM`.
3. Executed.
4. Return info is captured and returned to the server via NATS.
5. File in `C:\ProgramData\TacticalRMM` is removed automatically after execution / timeout.
6. Command Parameters for scripts stay in memory

Also "Send Command" stay in memory as well.

Having said that...Windows logs all things PowerShell: `Event Viewer` > `Microsoft` > `Windows` > `PowerShell` > `Operational` Log so be careful with fancy API calls and auth token using agents for execution.

!!!warning
    **Remember:** Auth tokens are Username/Password/2FA verification all rolled into a single chunk of text!

### RunAsUser functionality

Now that we know the agent runs under the `SYSTEM` security context and what that means, there is an option to "RunAsUser" (Windows only).

There are multiple things to understand and consider.

1. TRMMs native "RunAsUser" is only supported on workstations and non-RDP/terminal services servers.
2. The user has to be logged in, if the computer is still sitting at the Login screen there will be no active user to discover, and fail. If you're using fast user switching, it is the active user that will be discovered and used.

There are two ways to do RunAsUser with tactical in relation to scripting.

1. The Tactical RMM "RunAsUser" checkbox associated with the script, and all code will be run under the actively logged in user only with their security permissions. The user access token that will be used is the [limited user access token](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/how-it-works). You will not be able to do any admin level stuff because TRMM's RunAsUser doesn't have a UAC elevation capability to call and request a 2nd access token with admin privileges.
2. Using the PowerShell "RunAsUser" [3rd party module](https://github.com/amidaware/community-scripts/blob/da4d615a781d218ed3bec66d56a1530bc7513e16/scripts/Win_RunAsUser_Example.ps1)

### Outbound Firewall Rules

If you have strict firewall rules these are the only outbound rules from the agent needed for all functionality:

1. All agents have to be able to connect outbound to TRMM server on the 3 domain names on port 443.

2. The agent uses `https://icanhazip.tacticalrmm.io/` to get public IP info. If this site is down for whatever reason, the agent will fallback to `https://icanhazip.com` and then `https://ifconfig.co/ip`

#### Unsigned Agents

Unsigned agents require access to: `https://github.com/amidaware/rmmagent/releases/*` for downloading / updating agents.

#### Signed Agents

Signed agents require access to: `https://agents.tacticalrmm.com` for downloading / updating agents.

### Agent Installation Process

* Copies temp files to `C:\ProgramData\TacticalRMM` folder.
* INNO setup installs app into `%ProgramFiles%\TacticalAgent\` folder.

***

### Agent Update Process

Downloads latest `tacticalagent-vx.x.x.exe` to `%PROGRAMDATA\TacticalRMM%`.

Executes the file (INNO setup exe).

Log file `C:\ProgramData\TacticalRMM\tacticalagent_update_vX.X.X.txt` is created.

***

### Tactical Agent Debugging

Choose your method:

=== ":material-console-line: Windows Automatically"

    If the Tactical agent is connecting to your server, you can use the Community scripts:

    - `TacticalRMM - TRMM Agent enable Debug Mode`
    - `TacticalRMM - TRMM Agent disable Debug Mode`
    - and `TacticalRMM - Get Agent Logs`

=== ":material-console-line: Windows Manually"

    Open CMD as admin on the problem computer and stop the agent services:

    ```cmd
    net stop tacticalrmm
    ```

    Run the tacticalrmm service manually with debug logging:

    ```cmd
    "C:\Program Files\TacticalAgent\tacticalrmm.exe" -m rpc -log debug -logto stdout
    ```

    !!!note
        There's a Community script that will collect your agent log called `TacticalRMM - Get Agent Logs`.

=== ":material-debian: Linux"

    As root user, edit:

    ```bash
    vi /etc/systemd/system/tacticalagent.service
    ```

    Change

    ```
    ExecStart=/usr/local/bin/tacticalagent -m svc
    ```

    to

    ```
    ExecStart=/usr/local/bin/tacticalagent -m svc -log debug
    ```

    then

    ```
    systemctl daemon-reload
    systemctl restart tacticalagent.service
    ```

=== ":material-apple: Mac"

    In terminal window:

    ```bash
    sudo launchtl list | grep -e mesh -e tacticalagent
    ```

#### Mesh Agent Recovery

Use Agents right click menu > `Agent recovery` > `Mesh Agent`

#### Tactical Agent Recovery

Use Agents right click menu > `Agent recovery` > `Tactical Agent`

**...OR**

=== ":material-console-line: MeshCentral is online"

    Connect to `Terminal` (Admin Shell)

    Run

    ```cmd
    net stop tacticalrmm
    net start tacticalrmm
    ```

    Check if Tactical RMM agent is online.

=== ":material-console-line: From Local Machine"

    Start / Restart Tactical RMM service from either `services.msc` or from Admin Command prompt:

    ```cmd
    net stop tacticalrmm
    net start tacticalrmm
    ```

    Open `C:\Program Files\TacticalAgent\agent.log` to look for issues.

### Windows Update Management

_The current Tactical RMM Windows Update process is relatively simple atm. As of right now, it is in the top 3 big items to be reworked._

#### TLDR: Tactical RMM Based Patching Recommendation

* Use the `Automation Policy` > `Patch Policy` to apply it to machines. The `Other` category is poorly named by Microsoft, those are the regular monthly updates and should be auto-approved.
* Be patient, and things will be patched (based on the policy).
* Trying to immediately approve patches to many machines **OR** block specific patches is a slow and manual process.

!!!note
    If you want more control of Windows patching right now, look into a script-based implementation of [PSWindowsUpdate](http://woshub.com/pswindowsupdate-module/).

**Be aware**: When you install the Tactical RMM Agent on a Windows computer it sets this:

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU
AUOptions (REG_DWORD):
1: Keep my computer up to date is disabled in Automatic Updates.
```

If you want to resume normal Windows patching and disable Tactical RMM updating functions, you should run [this](https://github.com/amidaware/community-scripts/blob/main/scripts/Win_Windows_Update_RevertToDefault.ps1).

**Where does it get updates from?** TRMM gets the list of Windows updates using this Microsoft API: <https://docs.microsoft.com/en-us/windows/win32/api/_wua/>

The Tactical RMM server updates an agent's patch list every 8 hours based on the patch policy to check for what to update, and what's installed.

!!!note
    Currently if the agent is not online at the time the patch policy is set to install, there is no "install as soon as it comes online".

!!!tip
    Trying to get reboots to happen at specific times after Windows update? Set your `Reboot After Installation` to: Never<br>
    Then create a task that reboots at your preferred date/time

### Log Files

You can find 3 sets of detailed logs at `/rmm/api/tacticalrmm/tacticalrmm/private/log`.

* `error.log` Nginx log for all errors on all TRMM URL's: rmm, api and mesh

```bash
tail -f /rmm/api/tacticalrmm/tacticalrmm/private/log/error.log
```

* `access.log` Nginx log for auditing access on all URL's: rmm, api and mesh (_this is a large file, and should be cleaned periodically_)

```bash
tail -f /rmm/api/tacticalrmm/tacticalrmm/private/log/access.log
```

* `django_debug.log` created by Django webapp

```bash
tail -f /rmm/api/tacticalrmm/tacticalrmm/private/log/django_debug.log
```

### Failed / Successful Admin logins

These are logged in `/rmm/api/tacticalrmm/tacticalrmm/private/log/access.log`

Successful Login

```log
10.0.0.18 - - [21/May/2025:00:01:43 -0400] "POST /v2/checkcreds/ HTTP/1.1" 200 13 "https://rmm.example.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
```

Failed Login

```log
10.0.8.62 - - [21/May/2025:00:01:13 -0400] "POST /v2/checkcreds/ HTTP/1.1" 400 17 "https://rmm.example.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
```

| Field                                      | Description                                                                 |
|-------------------------------------------|-----------------------------------------------------------------------------|
| `10.0.0.18`                               | Client IP address                                                           |
| `-`                                       | Unused (RFC 1413 identity)                                                  |
| `-`                                       | Unused (authenticated user ID)                                             |
| `[21/May/2025:00:01:43 -0400]`            | Timestamp (local time with timezone offset)                                |
| `"POST /v2/checkcreds/ HTTP/1.1"`         | HTTP request method, path, and version                                     |
| `200`                                     | HTTP status code (200 = OK/success) (400 = Failed)                          |
| `13`                                      | Response size in bytes (body only)                                         |
| `"https://rmm.example.com/"`         | Referer URL (origin of the request)                                        |
| `"Mozilla/5.0 (Windows NT 10.0;...)`      | User-Agent string (browser and OS info)                                    |

[Fail2Ban](unsupported_scripts.md#fail2ban) uses this to limit password guessing
