# Management Commands

To run any of the management commands first login to your server as the user used to install TRMM (eg `su - tactical`) and activate the python virtual env:

???+ note "Activate python virtual env"

    === ":material-ubuntu: standard"

        ```bash
        cd /rmm/api/tacticalrmm
        source ../env/bin/activate
        ```

    === ":material-docker: docker"

        ```bash
        docker exec -it trmm-backend /bin/bash
        /opt/venv/bin/python /opt/tactical/api/manage.py shell
        ```

    === ":material-docker: Dev Docker"

        ```bash
        docker exec -it trmm-api-dev env/bin/python manage.py shell
        ```

### Bulk Delete Agents (Last Check-In, Agent Version, Site, or Client)

If you want to remove old agents based on time, age, or location or for client offboarding - it’s a best practice to first test the removal.

```bash
python manage.py bulk_delete_agents --days 60
python manage.py bulk_delete_agents --agentver 1.5.0
python manage.py bulk_delete_agents --site examplesite
python manage.py bulk_delete_agents --client exampleclient
python manage.py bulk_delete_agents --hostname examplehostname
```

Then run the deletion:

```bash
python manage.py bulk_delete_agents --days 60 --delete
python manage.py bulk_delete_agents --agentver 1.5.0 --delete
python manage.py bulk_delete_agents --site examplesite --delete
python manage.py bulk_delete_agents --client exampleclient --delete
python manage.py bulk_delete_agents --hostname examplehostname --delete
```

!!!note
    You must specify at least one of --days, --agentver, --site, --client, or --hostname.

    You can combine multiple parameters (e.g., --site examplesite --days 90) to narrow down agents further.

    Without the --delete flag, the command will only list agents that match.

    With the --delete flag, the agents will be uninstalled and deleted.

Example Bash one-liner to delete multiple agents at once by hostname, `hosts.txt` file should contain one hostname per line.

```bash
for i in $(cat hosts.txt); do python manage.py bulk_delete_agents --hostname $i --delete; done
```

### Reset a Users Password

```bash
python manage.py reset_password <username>
```

### Reset a User's 2FA Token

```bash
python manage.py reset_2fa <username>
```

### Delete a User
```python
python manage.py shell
from accounts.models import User
User.objects.get(username="changeme").delete()
```

### Find All Agents That Have X Software Installed

```bash
python manage.py find_software "adobe"
```

### Find All Agents That Have X Windows Service and Show the Service Status

```bash
python manage.py find_services "quickbooks"
```

### Set a Specific Windows Update to not Install

```python
python manage.py shell
from winupdate.models import WinUpdate
WinUpdate.objects.filter(kb="KB5007186").update(action="ignore", date_installed=None)
```

### Show Outdated Online Agents

```bash
python manage.py show_outdated_agents
```

### Log Out All Active Web Sessions

```bash
python manage.py delete_tokens
```

### Reset All Auth Tokens for Install Agents and Web Sessions

```python
python manage.py shell
from knox.models import AuthToken
AuthToken.objects.all().delete()
```

### Check for Orphaned Tasks on All Agents and Remove Them

```bash
python manage.py remove_orphaned_tasks
```

### Get a url to login to mesh as the mesh superuser
```bash
python manage.py get_mesh_login_url
```

### Create a MeshCentral Agent Invite Link

```bash
python manage.py get_mesh_exe_url
```

### Bulk Update Agent Offline / Overdue Time

Change offline time on all agents to 5 minutes:

```bash
python manage.py bulk_change_checkin --offline --all 5
```

Change offline time on all agents in site named *Example Site* to 2 minutes:

```bash
python manage.py bulk_change_checkin --offline --site "Example Site" 2
```

Change offline time on all agents in client named *Example Client* to 12 minutes:

```bash
python manage.py bulk_change_checkin --offline --client "Example Client" 12
```

Change overdue time on all agents to 10 minutes:

```bash
python manage.py bulk_change_checkin --overdue --all 10
```

Change overdue time on all agents in site named *Example Site* to 4 minutes:

```bash
python manage.py bulk_change_checkin --overdue --site "Example Site" 4
```

Change overdue time on all agents in client named *Example Client* to 14 minutes:

```bash
python manage.py bulk_change_checkin --overdue --client "Example Client" 14
```

!!!tip
    You can cron it on the server to run every 30mins with something like<br>
    ```bash
    */30 * * * * /rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py bulk_change_checkin --overdue --all 10 > /dev/null 2>&1
    ```

### Script based functions

[Delete agents by client and site name by API](https://github.com/amidaware/community-scripts/blob/main/scripts_wip/TRMM_Mass_Delete_Agents.ps1)
