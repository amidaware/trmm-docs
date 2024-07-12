# Global Settings

## General

- Enable agent automatic self update (Recommended setting: Enabled)
- Enable server side scripts
- Enable web terminal
- Default Agent timezone
- Default Date Format
- Default Server Policy
- Default Workstation Policy
- Default Alert Template
- [Receive notifications on](https://www.youtube.com/watch?v=Qh9BfKo2wIg&t=2139s)
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

See [Webhooks](webhooks.md)

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
