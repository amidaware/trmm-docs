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
- **Webhooks** - Notications can be set via webhooks to many platforms.

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

1. Create a script with exit codes. The exit codes can be anything other than 0 (which is reserved for passing). Below we are using 2 as a Warning and 5 as Informational, any other code will be assumed to be an Error)
   
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

# Tactical RMM (Remote Monitoring and Management) allows you to use webhooks to integrate with external systems and automate your workflows. 

Webhooks in Tactical RMM can notify you of certain events in your RMM, like alerts or device status changes, by sending messages to a URL you specify. This messages can be made up with [variables](https://docs.tacticalrmm.com/script_variables/).

### To configure this in Tactical RMM, follow these general steps. Note that you might need to adjust based on your specific needs:

1. Adding Webhooks: Go to Settings -> Global Settings -> Webhooks
2. Create a New Webhook: Enter the URL and choose the method (GET, POST, etc.). Configure the request headers and body as needed for your endpoint.
3. Save and Test: Save your configuration and use the `Test` button to test the webhook against an agent to ensure its working correctly.
4. Make sure your server endpoint is correctly configured to parse and use the data Tactical RMM sends. Depending on what you need, you might also want to implement security measures such as validating incoming requests to ensure they are from Tactical RMM.
5. Specify Events: Select the events that should trigger the webhook via Alerts Manager (Settings -> Alerts Manager). Tactical RMM will send data to your endpoint based on these events.

### Here’s a detailed setup to help you configure webhooks for use with Tactical RMM:

1. URL Pattern
For webhooks, you need a URL where the Tactical RMM can send HTTP requests when an event occurs. This URL should be a server endpoint configured to accept HTTP requests. Here's an example of what it might look like:

```
https://yourserver.com/webhook_endpoint
```
Replace yourserver.com with your actual server domain and webhook_endpoint with the actual path where you will handle the webhooks.

2. HTTP Methods
Tactical RMM can configure webhooks to send requests using different HTTP methods based on the event or the integration’s requirements. Here are the methods you mentioned:

GET: Retrieves data from a server at the specified resource.
POST: Sends data to a server to create a new resource.
PUT: Replaces all current representations of the target resource with the uploaded content.
DELETE: Removes all current representations of the target resource given by a URL.
PATCH: Partially updates a resource.
3. Request Headers
Request headers allow the server to learn more about the request context. Here are some common headers used in webhook configurations:

Content-Type: Describes the nature of the data being sent. For JSON data, you use application/json.
Authorization: If your endpoint requires authentication, you might use a token or other credentials in this header.
User-Agent: Identifies the application making the request.
Example:

```json
{
    "Content-Type": "application/json",
    "User-Agent": "TacticalRMM/1.0"
}
```
4. Request Body
The request body contains data sent by Tactical RMM to your webhook URL. This data usually includes details about the event that triggered the webhook. The structure of the body will depend on the specifics of what you want to track, but here’s a basic JSON example for a device alert:

```json
{
    "text": "{{alert.message}}"
}
```

Submit or Test and Submit and apply using Alert Manager.

Reference Sites are: <br>
[Slack](https://api.slack.com/messaging/webhooks) <br>
[Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=newteams%2Cdotnet)<br>


When setting up webhooks for popular messaging platforms like Slack, Microsoft Teams, or Discord, each platform has its own specific requirements and formats for how the webhook data should be structured. Below, I’ll give you a detailed guide on how to format webhooks for each of these platforms, ensuring you can effectively integrate and send notifications or data to these systems.

Slack Webhooks
Slack uses Incoming Webhooks to receive custom messages from external sources. To send data to Slack, you typically format the webhook like this:

URL: You will get a unique URL when you set up an incoming webhook in Slack.

Method: POST

Headers:

```http
Content-Type: application/json
```

Body:

```json
{
    "text": "Hello, world! This is a line of text.\nAnd this is another one."
}
```
You can also send more complex messages with attachments, buttons, etc., by using Slack’s rich messaging format.

Microsoft Teams Webhooks
Microsoft Teams uses Office 365 Connectors for its incoming webhooks. The format for Teams is slightly more complex, allowing for potentially richer content.

URL: You will get a unique URL when you configure the webhook connector in Teams.

Method: POST

Headers:

```http
Content-Type: application/json
```
Body:

```json
{
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "summary": "Issue 176715375",
    "themeColor": "0078D7",
    "title": "Issue opened: \"Push notifications not working\"",
    "sections": [{
        "activityTitle": "Mona Lisa",
        "activitySubtitle": "On Project XYZ",
        "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
        "facts": [{
            "name": "Assigned to",
            "value": "Unassigned"
        }, {
            "name": "Due date",
            "value": "2016-08-29T04:31:32.993Z"
        }],
        "markdown": true
    }]
}
```

Discord Webhooks
Discord's webhooks are quite flexible and allow for rich content similar to Slack but have their own JSON payload structure.

URL: Unique URL provided when you create the webhook in Discord.

Method: POST

Headers:

```http
Content-Type: application/json
```

Body:

```json
{
    "content": "Hello, world! This is an alert.",
    "username": "WebhookBot",
    "avatar_url": "https://someurl.com/image.jpg",
    "embeds": [
        {
            "title": "Alert Title",
            "description": "This is an embed",
            "color": 15258703,
            "fields": [
                {
                    "name": "Field1",
                    "value": "Some value",
                    "inline": true
                },
                {
                    "name": "Field2",
                    "value": "Another value",
                    "inline": true
                }
            ]
        }
    ]
}
```
General Tips for Setting Up Webhooks <br>
 - Authentication: Always ensure that your webhook URL, which might contain sensitive information, is kept secure. Do not expose it in public repositories or shared spaces.
 - Customization: Utilize the customization options provided by each platform to tailor the appearance and functionality of your messages to fit your needs.
 - Testing: Before fully integrating a new webhook into your operational setup, thoroughly test it to ensure it behaves as expected. This includes testing how it handles different types of data and responding to errors.
 - Rate Limits: Be aware of any rate limits imposed by the platform (especially Discord and Slack) to avoid disruptions in service.

By configuring each webhook according to the platform-specific guidelines and tips provided, you can enhance communication and automation in your workflows effectively.

