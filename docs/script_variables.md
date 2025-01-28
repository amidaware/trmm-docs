# Script Variables

Tactical RMM allows passing dashboard data into script as arguments or environment variables. This uses the syntax `{{model.field}}`. 

!!!info
    Nested relations are followed so something like `{{agent.site.name}}` will work.

For a full list of available fields, refer to the variables in the `models.py` files:

!!!info
    @property functions under the model will work as well

[Agent](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/agents/models.py#L60)

[Client](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/clients/models.py#L18)

[Site](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/clients/models.py#L93)

[Alert](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/alerts/models.py#L29)

[Check](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/checks/models.py#L30)

[CheckResult](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/checks/models.py#L281)

[AutomatedTask](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/autotasks/models.py#L51)

[TaskResult](https://github.com/amidaware/tacticalrmm/blob/89aceda65a1c54fea7b18250ca63614f091eac6e/api/tacticalrmm/autotasks/models.py#L464)

Below are some examples of available fields:

!!!info
    Everything between {{}} is CaSe sEnSiTive

## Agent

- **{{agent.version}}** - Tactical RMM agent version.
- **{{agent.operating_system}}** - Agent operating system example: *Windows 10 Pro, 64 bit (build 19042.928)*.
- **{{agent.plat}}** - Will show the platform example: *windows*.
- **{{agent.hostname}}** - The hostname of the agent.
- **{{agent.local_ips}}** - Local IP address of agent.
- **{{agent.public_ip}}** - Public IP address of agent.
- **{{agent.agent_id}}** - agent ID in database.
- **{{agent.last_seen}}** - Date and Time Agent last seen.
- **{{agent.total_ram}}** - Total RAM on agent. Returns an integer - example: *16*.
- **{{agent.boot_time}}** - Uptime of agent. Returns unix timestamp. example: *1619439603.0*.
- **{{agent.logged_in_username}}** - Username of logged in user.
- **{{agent.last_logged_in_user}}** - Username of last logged in user.
- **{{agent.monitoring_type}}** - Returns a string of *workstation* or *server*.
- **{{agent.description}}** - Description of agent in dashboard.
- **{{agent.mesh_node_id}}** - The mesh node id used for linking the tactical agent to mesh.
- **{{agent.overdue_email_alert}}** - Returns true if overdue email alerts is enabled in TRMM.
- **{{agent.overdue_text_alert}}** - Returns true if overdue SMS alerts is enabled in TRMM.
- **{{agent.overdue_dashboard_alert}}** - Returns true if overdue agent alerts is enabled in TRMM.
- **{{agent.offline_time}}** - Returns offline time setting for agent in TRMM.
- **{{agent.overdue_time}}** - Returns overdue time setting for agent in TRMM.
- **{{agent.check_interval}}** - Returns check interval time setting for agent in TRMM.
- **{{agent.needs_reboot}}** - Returns true if reboot is pending on agent.
- **{{agent.choco_installed}}** - Returns true if Chocolatey is installed.
- **{{agent.patches_last_installed}}** - The date that patches were last installed by Tactical RMM.
- **{{agent.timezone}}** - Returns timezone configured on agent.
- **{{agent.maintenance_mode}}** - Returns true if agent is in maintenance mode.
- **{{agent.block_policy_inheritance}}** - Returns true if agent has block policy inheritance.
- **{{agent.alert_template}}** - Returns true if agent has block policy inheritance.
- **{{agent.site}}** - The site that the agent belongs too. Can be used for nesting. See Site above for properties

## Client

- **{{client.name}}** - Returns name of client.

## Site

- **{{site.name}}** - Returns name of Site.
- **{{site.client}}** - The client that the site belongs too. Can be used for nesting. See Client above for properties

## Alert

!!!info
    Only available in failure and resolve actions on alert templates!

- **{{alert.alert_time}}** - Time of the alert.
- **{{alert.message}}** - Alert message.
- **{{alert.severity}}** - Severity of the alert *info, warning, or error*.
- **{{alert.alert_type}}** - The type of alert. Will be *availability, check, task, or custom*.
- **{{alert.snoozed}}** - Returns true if the alert is snoozed.
- **{{alert.snoozed_until}}** - Returns the datetime that the alert is unsnoozed.
- **{{alert.email_sent}}** - Returns true if this alert has triggered a failure email.
- **{{alert.resolved_email_sent}}** - Returns true if this alert has triggered a resolved email.
- **{{alert.sms_sent}}** - Returns true if this alert has triggered a failure text.
- **{{alert.resolved_sms_sent}}** - Returns true if this alert has triggered a resolved text.
- **{{alert.hidden}}** - Returns true if this alert is hidden. It won't show in the alerts icon in the dashboard
- **{{alert.action_run}}** - Returns datetime that an alert failure action was run.
- **{{alert.action_stdout}}** - Returns standard output of the alert failure action results.
- **{{alert.action_stderr}}** - Returns error output of the alert failure action results.
- **{{alert.action_retcode}}** - Returns return code of the alert failure action.
- **{{alert.resolved_action_run}}** - Returns datetime that an alert resolved action was run.
- **{{alert.resolved_action_stdout}}** - Returns standard output of the alert resolved action results.
- **{{alert.resolved_action_stderr}}** - Returns error output of the alert resolved action results.
- **{{alert.resolved_action_retcode}}** - Returns return code of the alert resolved action.

- **{{alert.agent}}** - The agent that triggered the alert. Can be used for nesting. See Agent above for properties.
- **{{alert.assigned_check}}** - The check that triggered the alert. Can be used for nesting. See Check above for properties.
- **{{alert.assigned_check.readable_desc}}** - This will return the name that is used in the UI for the check. 
- **{{alert.assigned_task}}** - The automated task that triggered the alert. Can be used for nesting. See Automated Task above for properties.
- **{{alert.assigned_task.name}}** - This will return the name that is used in the UI for the automated task. 
- **{{alert.site}}** - The site associated with the agent that triggered the alert. Can be used for nesting. See Site above for properties.
- **{{alert.client}}** - The client associated with the agent that triggered the alert. Can be used for nesting. See Client above for properties.

- **{{alert.get_result}}** - Will return the results of the associated check or automated task. Can be used for nesting. See CheckResult or TaskResult above for properties. This will be blank for agent availability alerts. For example to get the standard output of the check that failed, do **``{{ alert.get_result.stdout }}``**

## Custom Fields

You can use custom fields as variables by referencing the object that contains the custom field and using the exact name of the field as the property. For example, {{agent.Custom field Name}}. This reference is case sensitive, and spaces in the field name are supported.

Currently, custom fields are supported only for the following objects: Client, Site, and Agent. If the custom field cannot be found, the text will be passed as-is to the script.
