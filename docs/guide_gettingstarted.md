
# Getting Started Guide

Congratulations, if you've finished installing Tactical RMM it's now time to check things out.

## At Install

* Setup [Email Alerts](functions/email_alert.md)
* Setup SMS Alerts
* Set Server Preferences Under `Global Settings` > `General`
* Review [User Settings](tipsntricks.md#customize-user-interface)
* Set Retention Policies under Under `Global Settings` > `Retention`

### Setup Automation Policies

* Default Profile for workstations
* Default Profile for servers
* Decide on [Windows Updates policy](howitallworks.md#windows-update-management)

### Multiple Users

* Setup Permission Manager
* Add users to Permission Groups
* Decide on "Disable Auto Login for Remote Control and Remote background"

## Every 75 days

* TRMM Server OS updates
* reboot TRMM server
* Renew LetsEncrypt Certs
* Update TRMM

## Biannually

* Cleanup [old agents](management_cmds.md#bulk-delete-old-agents-by-last-checkin-date-or-agent-version)
