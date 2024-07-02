# Global Settings

## General

- Enable agent automatic self update (Recommended setting: Enabled)
- Enable server scripts
- Enable web terminal
- Default Agent timezone
- Default Date Format
- Default Server Policy
- Default Workstation Policy
- Default Alert Template
- Agent Debug Level
- Clear faults on agents that haven't checked in after (days)
- Reset Patch Policy on Agents

## Email Alerts

See [Email Alerts](emailsms_alert.md#email-setup)

## SMS Alerts

See [SMS Alerts](emailsms_alert.md#sms-alerts)

## Meshcentral

See [Meshcentral](../mesh_integration.md)

## Custom Fields

See [Custom Fields](custom_fields.md)

## (Global) Key Store

See [Key Store](keystore.md)

## URL Actions

See [URL Actions](url_actions.md)

## Web Hooks

TODO: Make consistent formatting, either TOC style or something else. Make video.

## Video Walkthru

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/aaaaaa" frameborder="0" allowfullscreen></iframe>
</div>

To apply and run on Agent overdue and Check/Task failures use [Alert Templates](alerting.md#alert-action-settings)

`Name`: Name

`Description`: for notes about webhook.

`URL Pattern`: For webhooks, you need a URL where the Tactical RMM can send HTTP requests when an event occurs. This URL should be a server endpoint configured to accept HTTP requests.

### `HTTP Methods`
Tactical RMM can configure webhooks to send requests using different HTTP methods based on the event or the integration’s requirements.

GET: Retrieves data from a server at the specified resource.

POST: Sends data to a server to create a new resource.

PUT: Replaces all current representations of the target resource with the uploaded content.

DELETE: Removes all current representations of the target resource given by a URL.

PATCH: Partially updates a resource.

### Request Headers

Request headers allow the server to learn more about the request context. Here are some common headers used in webhook configurations:

Content-Type: Describes the nature of the data being sent. For JSON data, you use application/json.
Authorization: If your endpoint requires authentication, you might use a token or other credentials in this header.

User-Agent: Identifies the application making the request.

```json
{
    "Content-Type": "application/json"
}
```

### Request Body

The request body contains data sent by Tactical RMM to your webhook URL. This data usually includes details about the event that triggered the webhook. The structure of the body will depend on the specifics of what you want to track, but here’s a basic JSON example for a device alert:

=== ":material-code-json: JSON"

    Simple JSON

    ```json
    {
        "text": "{{agent.hostname}}: {{alert.message}}"
    }
    ```

=== ":simple-discord: Discord"

    Discord Message: Edit a channel > Integrations > Webhooks

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

=== ":material-microsoft-teams: Microsoft Teams"

    [Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=newteams%2Cdotnet)

    Microsoft Teams uses Office 365 Connectors for its incoming webhooks. The format for Teams is slightly more complex, allowing for potentially richer content.

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

=== ":material-slack: Slack"

    [Slack](https://api.slack.com/messaging/webhooks)

    You can also send more complex messages with attachments, buttons, etc., by using Slack’s rich messaging format.

    ```json
    {
        "text": "Hello, world! This is a line of text.\nAnd this is another one."
    }
    ```

Use the test button to make sure your webhook is working

**General Tips for Setting Up Webhooks**

- Authentication: Always ensure that your webhook URL, which might contain sensitive information, is kept secure. Do not expose it in public repositories or shared spaces.
- Customization: Utilize the customization options provided by each platform to tailor the appearance and functionality of your messages to fit your needs.
- Testing: Before fully integrating a new webhook into your operational setup, thoroughly test it to ensure it behaves as expected. This includes testing how it handles different types of data and responding to errors.
- Rate Limits: Be aware of any rate limits imposed by the platform (especially Discord and Slack) to avoid disruptions in service.

## Retention (TRMM Database)

These are the settings related to your Tools > Server Maintenance > Prune DB Tables

Tactical RMM ships with data retention defaults that will work fine for most environments. There are situations, depending on the number of agents and checks configured, that these defaults need to be tweaked to improve performance.

### Adjusting Data Retention

The options are:

- **Check History** - Will delete check history older than the days specified (default is 30 days).
- **Resolved Alerts** - Will delete alerts that have been resolved older than the days specified (default is disabled).
- **Agent History** - Will delete agent command/script history older than the days specified (default is 60 days).
- **Debug Logs** - Will delete agent debug logs older than the days specified (default is 30 days).
- **Audit Logs** Will delete Tactical RMM audit logs older than the days specified (default is disabled).

To disable database pruning on a table, set the days to 0.

## API Keys

See [API](api.md)
