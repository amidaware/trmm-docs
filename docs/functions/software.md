# Software

## Software tab

![software tab](images/software_tab.png)

## Install Software Button

This will give you a list of software installable from the [Official Choco Community](https://community.chocolatey.org/packages)

## Uninstall button

This button will pull the software's uninstall string as set by the software developer.

You should be aware that:

- You can use the Agents history tab for log data
- If you don't select `Run as user` all commands are sent via the TRMM agent native security context: [`SYSTEM`](../howitallworks.md#runasuser-functionality). If the developer hasn't designed it to work from there you might get a stuck uninstaller with permission problems, or prompting with questions that can't be answered. YMMV
- msiexec doesn't log by default. If it's not uninstalling properly, you'll need to append `/l*v c:\path\to\somelog.txt` to the uninstall string and then check that log file and troubleshoot accordingly. [Microsoft docs](https://learn.microsoft.com/en-us/windows/win32/msi/standard-installer-command-line-options) has other msi command line options.
