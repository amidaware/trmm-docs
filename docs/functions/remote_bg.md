# Remote Background

To access: **Right click** on an agent > **Remote Background**:

![agent_remote_bg](../images/agent_remote_bg.png)

## Terminal Tab

This allows you to open a terminal on the remote agent.

![terminal1](../images/terminal_1.png)

- Windows: CMD, PowerShell, or a custom shell specified by full path (e.g. C:\Program Files\PowerShell\7\pwsh.exe)
- Linux: Bash or a custom shell (e.g. /usr/bin/fish)
- macOS: zsh/bash or a custom shell (e.g. /bin/zsh)

Global shell defaults can be configured under *Global Settings > General*, applied to all agents:

![terminal_global](../images/terminal_global_settings.png)

Individual agents inherit the global default but can be overridden under the agent's edit settings, allowing a different shell per agent:

![terminal_edit_agent](../images/terminal_edit_agent.png)

Terminal access is controlled by the *Use Terminal* permission.

## File Browser

Meshcentral Integration: This will allow you to open a File Manager where you can manage and transfer files to and from the agent.

## Services Tab

Right click on a service to show the context menu where you can start/stop/restart services:

![services_contextmenu](../images/services_contextmenu.png)

Click *Service Details* to bring up the details tab where you can edit more service options:

![service_detail](../images/service_detail.png)

## Processes Tab

A very basic task manager that shows real time process usage.

**Right click** on a process to end the task:

![taskmanager](../images/taskmanager.png)

## Event Log

Allows you to query the Windows Application | System | Security Logs

![Event Log](images/remote_background_eventlog.png)
