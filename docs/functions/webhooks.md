## Video Walkthru

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/Qh9BfKo2wIg" frameborder="0" allowfullscreen></iframe>
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

The request body must contain valid JSON and can include anything you want. Here are some examples:

=== ":simple-discord: Discord"

    Discord: Edit a channel > Integrations > Webhooks

    ```json
    {
        "content": "Agent hasn't checked in for {{agent.overdue_time}} minutes.",
        "username": "{{agent.hostname}}",
        "avatar_url": "https://cdn3.emoji.gg/emojis/PogChamp.png",
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

=== ":material-code-json: JSON"

    Simple JSON

    ```json
    {
        "text": "{{agent.hostname}}: {{alert.message}}"
    }
    ```

=== ":material-microsoft-teams: Microsoft Teams (Basic)"

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

=== ":material-microsoft-teams: Microsoft Teams (Advanced)"

    [Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=newteams%2Cdotnet)

    Microsoft Teams uses Office 365 Connectors for its incoming webhooks. The format for Teams is slightly more complex, allowing for potentially richer content.

    ```json
    {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "contentUrl": null,
                "content": {
                    "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.2",
                    "msteams": {
                        "width": "Full"
                    },
                    "body": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "style": "person",
                                            "url": "https://amidaware.com/images/amidaware.jpg",
                                            "altText": "TacticalRMM",
                                            "size": "small"
                                        }
                                    ],
                                    "width": "auto"
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "weight": "bolder",
                                            "text": "TacticalRMM",
                                            "wrap": true,
                                            "size": "heading"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "spacing": "none",
                                            "text": "Created date here",
                                            "isSubtle": true,
                                            "wrap": true
                                        }
                                    ],
                                    "width": "stretch"
                                }
                            ]
                        },
                        {
                            "type": "ColumnSet",
                            "isVisible": true,
                            "columns": [
                                {
                                    "type": "Column",
                                    "isVisible": true,
                                    "items": [
                                        {
                                            "type": "RichTextBlock",
                                            "inlines": [
                                                {
                                                    "type": "TextRun",
                                                    "text": "first column more text",
                                                    "wrap": true,
                                                    "color": "default",
                                                    "weight": "bolder"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "isVisible": true,
                                    "items": [
                                        {
                                            "type": "RichTextBlock",
                                            "inlines": [
                                                {
                                                    "type": "TextRun",
                                                    "text": "Second column",
                                                    "wrap": true
                                                },
                                                {
                                                    "type": "TextRun",
                                                    "text": "second column more text",
                                                    "wrap": true,
                                                    "color": "default",
                                                    "weight": "bolder"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "style": "emphasis",
                                    "minHeight": "40px",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "The minimal message!",
                                            "wrap": true
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "verticalContentAlignment": "center",
                                    "isVisible": false,
                                    "items": [
                                        {
                                            "type": "ActionSet",
                                            "isVisible": false,
                                            "actions": []
                                        },
                                        {
                                            "type": "ActionSet",
                                            "isVisible": false,
                                            "actions": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ]
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

