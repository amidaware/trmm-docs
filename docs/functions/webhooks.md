## Video Walkthru

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/aaaaaa" frameborder="0" allowfullscreen></iframe>
</div>

To apply and run on Agent overdue and Check/Task failures use [Alert Templates](alerting.md#alert-action-settings)

`Name`: Name

`Description`: for notes about webhook.

`URL Pattern`: For webhooks, you need a URL where the Tactical RMM can send HTTP requests when an event occurs. This URL should be a server endpoint configured to accept HTTP requests.

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
        "content": "Agent hasn't checked in for {{agent.overdue_time}} minutes.",
        "username": "{{agent.hostname}}",
        "avatar_url": "https://someurl.com/image.jpg",
        "embeds": [
            {
                "title": "Agent {{agent.hostname}} Client: {{agent.site.client.name}}",
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

=== ":simple-helpdesk: Ticketing System"

    [Zammad](../3rdparty_zammad.md)

    See above for how to open a ticket in Zammad with a webhook alert.



#### Testing webhooks
Use the test button to make sure your webhook is working. Note: `{{alert.XXX}}` variables will NOT be available in testing mode.

