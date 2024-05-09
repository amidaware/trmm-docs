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

Test to see what will happen:

```bash
python manage.py bulk_delete_agents --days 60
python manage.py bulk_delete_agents --agentver 1.5.0
python manage.py bulk_delete_agents --site examplesite
python manage.py bulk_delete_agents --client exampleclient
```

Do the delete:

```bash
python manage.py bulk_delete_agents --days 60 --delete
python manage.py bulk_delete_agents --agentver 1.5.0 --delete
python manage.py bulk_delete_agents --site examplesite --delete
python manage.py bulk_delete_agents --client exampleclient --delete
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

### Script based functions

[Delete agents by client and site name by API](https://github.com/amidaware/community-scripts/blob/main/scripts_wip/TRMM_Mass_Delete_Agents.ps1)
