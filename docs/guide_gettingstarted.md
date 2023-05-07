
# Getting Started Guide

Install the server, [choose the best path](install_considerations.md)

## Post Install

* [ ] Setup [Email Alerts](functions/email_alert.md){target=_blank}
* [ ] Setup SMS Alerts
* [ ] Set Server Preferences Under `Global Settings > General`
* [ ] Review [User Settings](tipsntricks.md#customize-user-interface){target=_blank}
* [ ] Set Retention Policies under Under `Global Settings > Retention`

### Setup Automation Policies

* [ ] Default Profile for workstations `Settings menu > Global Settings > General`
* [ ] Default Profile for servers `Settings menu > Global Settings > General`
* [ ] Decide on [Windows Updates policy](howitallworks.md#windows-update-management){target=_blank}

### Multiple Users

* [ ] Setup Permission Manager `Settings menu > Permission Manager`
* [ ] Add users to Permission Groups `Settings menu > User Administration`
* [ ] Decide on "Disable Auto Login for Remote Control and Remote background" `Settings menu > Global Settings > Meshcentral`

### Maintenance

Periodically, the system needs updates and attention:

#### Every 75 days

* [ ] TRMM Server [OS updates](update_server.md#video-walkthru){target=_blank}
* [ ] Reboot TRMM server
* [ ] Renew [LetsEncrypt Certs](update_server.md#keeping-your-lets-encrypt-certificate-up-to-date){target=_blank}
* [ ] [Update TRMM](update_server.md#updating-to-the-latest-rmm-version){target=_blank}

#### Bi-annually

* [ ] Clean up [old agents](management_cmds.md#bulk-delete-old-agents-by-last-checkin-date-or-agent-version){target=_blank}
