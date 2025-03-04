# Overriding / Customizing Default Settings

### Browser token expiration

The default browser token expiration is set to 5 hours. See this [ticket](https://github.com/amidaware/tacticalrmm/issues/503) for reference.

To change it, add the following code block to the end of `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

```python
from datetime import timedelta

REST_KNOX = {
    "TOKEN_TTL": timedelta(days=30),
    "AUTO_REFRESH": True,
    "MIN_REFRESH_INTERVAL": 600,
}
```

Change `(days=30)` to whatever you prefer. Then run `sudo systemctl restart rmm.service` for changes to take effect.

### Using your own wildcard SSL cert

#### Before Install

Follow the instructions in the [install guide](../install_server.md#step-5-run-the-install-script) for the `--use-own-cert` install flag.

#### Existing Install

1. Append the following two variables to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`, replacing the paths with the actual locations of your certificate and private key. The certificate must include the full chain:
```python
CERT_FILE = "/path/to/your/fullchain.pem"
KEY_FILE = "/path/to/your/privkey.pem"
```

2. Ensure that both files are readable by the `tactical` Linux user:
```bash
sudo chown tactical:tactical /path/to/your/fullchain.pem /path/to/your/privkey.pem
sudo chmod 440 /path/to/your/fullchain.pem /path/to/your/privkey.pem
```

3. Update all instances of `ssl_certificate` and `ssl_certificate_key` in the three Nginx configuration files located in `/etc/nginx/sites-available` to point to your certificate and private key paths.

4. Restart the services: `sudo systemctl restart nginx meshcentral rmm daphne`


### Use NATS Standard instead of NATS websocket

Prior to TRMM v0.14.0 (released 7/7/2022), agents NATS traffic connected to the TRMM server on public port 4222.
If you have upgraded to v0.14.0 and have agents that won't work with websockets for some reason (too old TLS etc) then you can do the following to use NATS standard TCP on port 4222, just like how it was before v0.14.0:

For Windows agents:

Add the following registry string value (REG_SZ):

`HKEY_LOCAL_MACHINE\SOFTWARE\TacticalRMM\NatsStandardPort` with value `4222`

Then restart the `tacticalrmm` Windows service.

For Linux agents:

Add the following key/value pair to `/etc/tacticalagent`:
```json
{"natsstandardport": "4222"}
```

Then `sudo systemctl restart tacticalagent.service`

Just make sure port 4222 TCP is still open in your firewall and you're done.

### Configuring Custom Temp Dirs on Windows Agents

*Version added: Tactical RMM v0.15.10*

*Requires Agent v2.4.7*

By default, the Windows agent utilizes the `C:\ProgramData\TacticalRMM` directory for executing scripts and managing agent updates. However, it is possible to override this default directory by setting two optional registry string values (`REG_SZ`), specifying full paths to the desired directories:

`HKEY_LOCAL_MACHINE\SOFTWARE\TacticalRMM\WinTmpDir`: This registry value is used for running scripts and handling agent updates. Provide the full path to the custom directory.

`HKEY_LOCAL_MACHINE\SOFTWARE\TacticalRMM\WinRunAsUserTmpDir`: This registry value is specifically for executing Run As User scripts. Provide the full path to the custom directory.

Please note that these custom directories must already exist on the system, as the agent will not attempt to create them. Ensure that the desired directories are created and that the appropriate permissions are set before adding the registry values.

*Directory path cannot contain spaces, this is a known issue and will be fixed in a future release.*

To apply the changes, restart the `tacticalrmm` Windows service. The custom temporary directories will then be used for the respective tasks.

Example:

![reg](../images/wintmpdir.png)

### Monitor NATS via its HTTP API

*Version added: Tactical RMM v0.15.1*



To enable [NATS monitoring](https://docs.nats.io/running-a-nats-service/configuration/monitoring), add the folllowing to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` (replace with whatever port you want).
```python
NATS_HTTP_PORT = 8222
```

Then from the TRMM Web UI, do **Tools > Server Maintenance > Reload Nats Configuration**.

And then from your TRMM server cli restart both the `rmm.service` and `nats.service` services.

### Modify the Placeholder Text for the 'Send Command' Functionality

*Version added: Tactical RMM v0.15.12*

Users now have the flexibility to customize the placeholder text that is displayed in the 'Send Command' dialog. This customization can be achieved by defining any or all of the following three optional variables in `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` file:

```python
CMD_PLACEHOLDER_TEXT = "<Your customized command prompt text>"
POWERSHELL_PLACEHOLDER_TEXT = "<Your customized PowerShell prompt text>"
SHELL_PLACEHOLDER_TEXT = "<Your customized shell prompt text>"
```

To activate, restart the api with `sudo systemctl restart rmm` and then refresh the web interface.

### Define a root user to prevent changes from web UI

To define a "root" user who cannot be modified via the web UI, add the following line to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

```python
ROOT_USER = "username"
```

Replace "username" with the actual username. After making this change, run `sudo systemctl restart rmm.service` to apply the changes.

### Adjusting Agent Check-In Intervals

The agent periodically communicates with the RMM server, sending various data about its status and environment at random intervals. These randomized intervals are designed to prevent the "thundering herd" problem, where too many agents would check in simultaneously, potentially overloading the server.

You can modify these intervals by adding one or more of the following variables to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`. Each variable is a Python tuple containing two values: the minimum and maximum interval times, specified in seconds. The agent will select a random interval within this range for each check-in.

The default check-in intervals are as follows:

```python
CHECKIN_HELLO = (30, 60)  # Agent heartbeat ("I'm alive")
CHECKIN_AGENTINFO = (200, 400)  # System info (logged-in user, boot time, RAM, etc.)
CHECKIN_WINSVC = (2400, 3000)  # Windows services and their status
CHECKIN_PUBIP = (300, 500)  # Agent's public IP address
CHECKIN_DISKS = (1000, 2000)  # Disk information and usage
CHECKIN_SW = (2800, 3500)  # Installed Windows software list
CHECKIN_WMI = (3000, 4000)  # Asset details (as seen in the "Assets" tab)
CHECKIN_SYNCMESH = (800, 1200)  # Agent's Mesh node ID
```

By adjusting these intervals, you can control how frequently the agent checks in with the RMM server for different types of data. This flexibility allows for balancing between server load and the frequency of updates.

After adding any of these settings, you must restart both the RMM service (`sudo systemctl restart rmm`) and the agent service. An easy way to restart the agent service is by using the "Tools > Recover All Agents" function in the TRMM web UI.

### Configuring Agent Check Jitter

*Version added: v1.0.0*

To prevent the thundering herd problem, where multiple agents send their check results simultaneously and overwhelm the server, a random jitter has been introduced. By default, this jitter is a random delay between 1 and 60 seconds.

To customize this behavior, add the following variable to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` and adjust the values as needed, then restart the RMM service (`sudo systemctl restart rmm`):
```python
CHECK_INTERVAL_JITTER = (1, 60)
```