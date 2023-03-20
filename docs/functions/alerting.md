# Alerting Overview

Alerting and notifications can be managed centrally using Alert Templates. All an alert template does is configure the Email, Text, and Dashboard alert check boxes on Agents, Checks, and Automated Tasks.

Using Alert Templates also enables additional features like:

- Periodic notifications if an alert is left unresolved.
- Being able to notify on certain alert severities.
- Sending notifications when an alert is resolved.
- Executing scripts when an alert is triggered or resolved.

[Setting up Email Alert Examples](email_alert.md)
## Supported Notifications

- **Email Alerts** - Sends email to configured set of email addresses.
- **SMS Alerts** - Sends text messages to configured set of numbers.
- **Dashboard Alerts** - A notification popup will show up and be visible in the dashboard.

## Alert Severities

!!!info
    Agent overdue alerts are always of severity Error.

Alert severities are configured directly on the Check or Automated Task. When the Check / Automated Task fails, it will create an alert of the specified severity. The severity types are:

- Informational
- Warning
- Error

## Adding Alert Templates

To create an alert template, go to **Settings > Alerts Manager**, then click **New**.

The available options are:

### General Settings

- **Name** - The name that is used to identify the Alert Template in the dashboard.
- **Email Recipients** - Sets the list of email recipients. If this isn't set the email recipients in global settings will be used.
- **From Email** - Sets the From email address of the notification. If this isn't set the From address from global settings is used.
- **SMS Recipients** - Sets the list of text recipients. If this isn't set the sms list from global settings is used.

### Action Settings

- **Failure Action** - Runs the selected script once on any agent. This is useful for running one-time tasks like sending an http request to an external system to create a ticket.
- **Failure Action Args** - Optionally pass in arguments to the failure script.
- **Failure Action Timeout** - Sets the timeout for the script.
- **Resolved Action** - Runs the selected script once on any agent if the alert is resolved. This is useful for running one-time tasks like sending an http request to an external system to close the ticket that was created.
- **Resolved Action Args** - Optionally pass in arguments to the resolved script.
- **Resolved Action Timeout** - Sets the timeout for the script.

#### Run Actions Only On:
- **Agents** - If Enabled, will run script failure / resolved actions on agent overdue alerts, else no alert actions will be triggered for agent overdue alerts.
- **Checks** - If Enabled, will run script failure / resolved actions on check alerts, else no alert actions will be triggered check alerts.
- **Tasks** - If Enabled, will run script failure / resolved actions on automated task alerts, else no alert actions will be triggered automated task alerts.


### Agent / Check / Task Failure Settings

- **Email** - When **Enabled**, will send an email notification and override the Email Alert checkbox on the Agent / Check / Task. When **Not Configured**, the Email Alert checkbox on the Agent / Check / Task will take effect. If **Disabled**, no email notifications will be sent and will override any Email alert checkbox on the Agent / Check / Task.
- **Text** - When **Enabled**, will send a text notification and override the SMS Alert checkbox on the Agent / Check / Task. When **Not Configured**, the SMS Alert checkbox on the Agent / Check / Task will take effect. If **Disabled**, no SMS notifications will be sent and will override any SMS Alert checkbox on the Agent / Check / Task.
- **Dashboard** - When **Enabled**, will send a dashboard notification and override the Dashboard Alert checkbox on the Agent / Check / Task. When **Not Configured**, the Dashboard Alert checkbox on the Agent / Check / Task will take effect. If **Disabled**, no SMS notifications will be sent and will override any Dashboard Alert checkbox on the Agent / Check / Task.
- **Alert again if not resolved after (days)** - This sends another notification if the alert isn't resolved after the set amount of days. Set to 0 to disable this.
- **Alert on severity** - Only applicable to Check and Task alert notifications. This will only send alerts when they are of the configured severity.

    !!!info
        Alert on Severity needs to be configured for check and task notifications to be sent!

### Agent / Check / Task Resolved Settings

- **Email** - If enabled, sends an email notification when an alert is resolved.
- **Text** - If enabled, sends a text messaged when an alert is resolved.

## Applying Alert Templates

Alert templates can be configured Globally, through an Automation Policy, or set directly on the Client or Site.

- To apply **Globally**, navigate to **Settings > Global Settings**. Set the **Alert Template** dropdown and save.
- You can configure an alert template on an automation policy by navigating to **Settings > Automation Manager**, and clicking the **Assign Alert Template** click on the policy, or right-clicking the policy and selecting **Assign Alert Template**.
- To configure on a Client or Site, right-click on one in the Client / Site tree view and select **Assign Alert Template**.

## Alert Template Exclusions

You can exclude Clients, Sites, and Agents from alert templates. To do this you can:

- Right-click on the **Alert Template** in **Alerts Manager** and select **Exclusions**.
- Select the **Alert Exclusions** link in the Alert Template row.

You can also **Exclude Desktops** from the alert template. This is useful if you only care about servers.

## Alert Template Inheritance

Alerts are applied in the following order. The agent picks the closest matching alert template.

1. Policy w/ Alert Template applied to Site
2. Site
3. Policy w/ Alert Template applied to Client
4. Client
5. Default Alert Template

## Setting up Alert Severities with scripts

If scripting for alert severities please see below, 

1. Create a script with exit codes. The exit codes can be anything other than 0. Below we are using 2 as a Warning and 5 as Informational, any other code will be assumed to be an Error)
   
    ```ps
    If (!(test-path c:\ProgramData\TacticalRMM\temp)) {
        New-Item -ItemType Directory -Force -Path "C:\ProgramData\TacticalRMM\temp"
        $exitcode = 2
        $host.SetShouldExit($exitcode)
        exit
    }
    Else {
        Write-Output "found folder"
        $exitcode = 5
        $host.SetShouldExit($exitcode)
        exit
    }
    ```

2. Setup a script check and fill in the corresponding Warning and Informational codes (don't forget to hit enter). 
3. Save script check and you should now have the different Severities.

