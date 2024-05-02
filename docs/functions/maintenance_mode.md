# Maintenance Mode

Enabling maintenance mode for an agent will prevent any overdue/check/task email/sms alerts from being sent.

It will also prevent clients/sites/agents from showing up as red in the dashboard if they have any failing checks or are overdue.

To enable maintenance mode for all agents in a client/site, **Right Click** on a client / site and choose **Enable Maintenance Mode**

![maint_mode](../images/maint_mode.png)

To enable maintenance mode for a single agent, **Right Click** on the agent and choose **Enable Maintenance Mode**

## Putting server into maintenance mode

```
# put all in maintenance mode
echo "from agents.models import Agent; Agent.objects.update(maintenance_mode=True)" | /rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py shell

# revert back to normal
echo "from agents.models import Agent; Agent.objects.update(maintenance_mode=False)" | /rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py shell
```
