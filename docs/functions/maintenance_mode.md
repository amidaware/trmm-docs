# Maintenance Mode

Enabling maintenance mode for an agent will prevent any overdue/check/task email/sms alerts from being sent.

It will also prevent clients/sites/agents from showing up as red in the dashboard if they have any failing checks or are overdue.

To enable maintenance mode for all agents in a client/site, **Right Click** on a client / site and choose **Enable Maintenance Mode**

![maint_mode](../images/maint_mode.png)

To enable maintenance mode for a single agent, **Right Click** on the agent and choose **Enable Maintenance Mode**

## Putting server into maintenance mode

* Follow the instructions at the top of [Management Commands](../management_cmds.md) page to activate the python virtual env

* Run the management command using one of the options below:

```
python manage.py server_maint_mode [options]
```

| Options              | Description                                                                                                                                                   |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--enable`        | **Enable Maintenance Mode.** Sets all agents to maintenance mode and saves their current states.                                                            |
| `--disable`       | **Disable Maintenance Mode.** Restores agents to their previous states before maintenance mode was enabled.                                                 |
| `--force-enable`  | **Force Enable Maintenance Mode.** Unconditionally sets all agents to maintenance mode, ignoring any previously saved states.                              |
| `--force-disable` | **Force Disable Maintenance Mode.** Unconditionally disables maintenance mode for all agents, removing any saved state information.                        |

**Note**: Only one of the above options should be used at a time to avoid conflicts.
