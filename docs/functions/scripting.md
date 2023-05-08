# Scripting

Tactical RMM supports uploading existing scripts or creating new scripts from within the web interface.

Windows agent languages supported:
- PowerShell
- Windows Batch
- Python

There is [RunAsUser](../howitallworks.md#runasuser-functionality) functionality for Windows.

Linux/Mac languages supported:
- Any language that is installed on the remote machine (use a shebang at the top of the script to set the interpreter)

## Adding Scripts

In the dashboard, browse to **Settings > Scripts Manager**. Click the **New** button and select either Upload Script or New Script. The available options for scripts are:

- **Name** - This identifies the script in the dashboard.
- **Description** - Optional description for the script.
- **Category** - Optional way to group similar scripts together.
- **Type** - This sets the language of the script. Available options are:
    - PowerShell
    - Windows Batch
    - Python
    - Shell (use for Linux/macOS scripts)

- **Script Arguments** - Optional way to set default arguments for scripts. These will auto populate when running scripts and can be changed at runtime.
- **Default Timeout** - Sets the default timeout of the script and will stop script execution if the duration surpasses the configured timeout. Can be changed at script runtime.
- **Favorite** - Favorites the script.

## Downloading Scripts

To download a Tactical RMM Script, click on the script in the Script Manager to select it. Then click the **Download Script** button on the top. You can also right-click on the script and select download.

## Community Scripts

These are script that are built into Tactical RMM. They are provided and maintained by the Tactical RMM community. These scripts are updated whenever Tactical RMM is updated and can't be modified or deleted in the dashboard.

### Hiding Community Scripts
You can choose to hide community script throughout the dashboard by opening **Script Manager** and clicking the **Show/Hide Community Scripts** toggle button.

## Using Scripts

### Manual run on agent

In the **Agent Table**, you can right-click on an agent and select **Run Script**. You have the options of:

- **Wait for Output** - Runs the script and waits for the script to finish running and displays the output.
- **Fire and Forget** - Starts the script and does not wait for output.
- **Email Output** - Starts the script and will email the output. Allows for using the default email address in the global settings or adding a new email address.
- **Save as Note** - Saves the output as a Note that can be views in the agent Notes tab.
- **Collector** - Saves to output to the specified custom field.

There is also an option on the agent context menu called **Run Favorited Script**. This will pre-populate the script run dialog with the script of your choice.

[Script Execution Process](../../howitallworks/#windows-agent)

### Script Arguments

The `Script Arguments` field should be pre-filled with information for any script that can accept or requires parameters.

<p style="background-color:#1e1e1e;">
&nbsp;<span style=color:#d4d4d4><</span><span style="color:#358cd6">Required Parameter Name</span><span style=color:#d4d4d4>></span> <span style=color:#d4d4d4><</span><span style="color:#358cd6">string</span><span style=color:#d4d4d4>></span><br>
&nbsp;<span style="color:#ffd70a">[</span><span style=color:#d4d4d4>-<</span><span style="color:#358cd6">Optional Parameter Name</span><span style=color:#d4d4d4>></span> <span style=color:#d4d4d4><</span><span style="color:#358cd6">string</span><span style=color:#d4d4d4>></span><span style="color:#ffd70a">]</span><br>
&nbsp;<span style="color:#ffd70a">[</span><span style=color:#d4d4d4>-<</span><span style="color:#358cd6">string</span><span style=color:#d4d4d4>></span> <span style="color:#c586b6">{</span><span style=color:#87cefa>(</span><span style=color:#d4d4d4><</span><span style="color:#358cd6">default string if not specified</span><span style=color:#d4d4d4>></span><span style=color:#87cefa>)</span> <span style=color:#d4d4d4>|</span> <span style=color:#d4d4d4><</span><span style="color:#358cd6">string2</span><span style=color:#d4d4d4>></span> <span style=color:#d4d4d4>|</span> <span style=color:#d4d4d4><</span><span style="color:#358cd6">string3</span><span style=color:#d4d4d4>></span><span style="color:#c586b6">}</span><span style="color:#ffd70a">]</span></p>

Where `[]` indicates an optional parameter

and `{}` indicates a parameter with several preconfigured parameter

and `()` indicates a default parameter if none is specified.

Starting with 0.15.4 you can use environment variables to pass them too!

## Video Walkthru

<div class="video-wrapper">
  <iframe width="320" height="180" src="https://www.youtube.com/embed/pN80ljSwT7M" frameborder="0" allowfullscreen></iframe>
</div>


### Run Script on many agents at once

Under the `Tools menu` -> `Bulk Script` you can execute scripts against Clients/Sites/Selected Agents/All based on All/Servers/Workstations. The history is saved in the history tab of the agent. The history can also be retrieved from the API from the `/agents/history/` endpoint.

### Run Command on many agents at once

Under the `Tools menu` -> `Bulk Command` you can execute a command against Clients/Sites/Selected Agents/All based on All/Servers/Workstations. The history is saved in the history tab of the agent. The history can also be retrieved from the API from the `/agents/history/` endpoint.

### Automated Tasks

Tactical RMM allows scheduling tasks to run on agents. This leverages the Windows Task Scheduler and has the same scheduling options.

See [Automated Tasks](automated_tasks.md) for configuring automated tasks.

### Script Checks

Scripts can also be run periodically on an agent and trigger an alert if it fails.

### Alert Failure/Resolve Actions

Scripts can be triggered when an alert is triggered and resolved. This script will run on any online agent and supports passing the alert information as arguments.

For configuring **Alert Templates**, see [Alerting](./alerting.md)

See below for populating dashboard data in scripts and the available options.

## Using dashboard data in scripts

Tactical RMM allows passing in dashboard data to scripts as arguments. The below PowerShell arguments will get the client name of the agent and also the agent's public IP address.

```
-ClientName {{client.name}} -PublicIP {{agent.public_ip}}
```

!!!info
    Everything between {{}} is CaSe sEnSiTive

See a full list of possible built-in variables [Here](../script_variables.md)

### Getting Custom Field values

Tactical RMM supports pulling data from custom fields using the {{model.custom_field_name}} syntax.

See [Using Custom Fields in Scripts](custom_fields.md#Using Custom Fields in Scripts).

### Getting values from the Global Keystore

Tactical RMM supports getting values from the global key store using the {{global.key_name}} syntax.

See [Global Keystore](keystore.md).

### Example PowerShell Script

The below script takes five named values. The arguments will look like this: `-SiteName {{site.name}} -ClientName {{client.name}} -PublicIP {{agent.public_ip}} -CustomField {{client.AV_KEY}} -Global {{global.API_KEY}}`

```powershell
param (
   [string] $SiteName,
   [string] $ClientName,
   [string] $PublicIp,
   [string] $CustomField,
   [string] $Global
)

Write-Output "Site: $SiteName"
Write-Output "Client: $ClientName"
Write-Output "Public IP: $PublicIp"
Write-Output "Custom Fields: $CustomField"
Write-Output "Global: $Global"
```

## Script Snippets

Script Snippets allow you to create common code blocks or comments and apply them to all of your scripts. This could be initialization code, common error checking, or even code comments.

### Adding Script Snippets

In the dashboard, browse to **Settings > Scripts Manager**. Click the **Script Snippets** button.

- **Name** - This identifies the script snippet in the dashboard
- **Description** - Optional description for the script snippet
- **Shell** - This sets the language of the script. Available options are:
    - PowerShell
    - Windows Batch
    - Python

### Using Script Snippets

When editing a script, you can add template tags to the script body that contains the script snippet name. For example, if a script snippet exists with the name "Check WMF", you would put {{Check WMF}} in the script body and the snippet code will be replaced.

!!!info
    Everything between {{}} is CaSe sEnSiTive

The template tags will only be visible when Editing the script. When downloading or viewing the script code the template tags will be replaced with the script snippet code.

### PowerShell 7

<https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/start-process?view=powershell-7.2>

Shell Type: PowerShell

Command: `Start-Process nohup 'pwsh -noprofile -c "1..120 | % { Write-Host . -NoNewline; sleep 1 }"'`

## Python

Tactical installs Python 3.8 on Windows and uses the default Python on other OS's. It is suggested to write code
[targeting][] Python 3.8 to prevent incompatibilities across platforms.

How do you target a specific version? The [shebang][] can specify the interpreter on macOS and Linux, but since Windows
does not use the shebang, the interpreter needs to be specified by the calling program. This is probably why Python
is installed by TRMM on Windows because it knows where the Python executable is.

Ok, so how do you use the shebang? Take this hello world script for example. The shebang `#!` in this script will
use `/usr/bin/python3`. This is easy enough until you run across a system where the system Python is not the expected
3.8 or later.

```bash
#!/usr/bin/python3
print("Hello World!")
```

This is where [env][] comes into play. `env` will search the `$PATH` for the executable that matches the argument. In
this case, the script will be run by the first "python3" found in $PATH. However, what if `python3` points
to `python3.6`? You're in the same boat you were in before.

```bash
#!/usr/bin/env python3
print("Hello World!")
```

Or are you? If you read the [env man page][env], it states you can add parameters to the command line. In case you
didn't know, the shebang is the command line! `env` will modify the `$PATH` before searching for `python3`, allowing
you to use a custom python location.

```bash
#!/usr/bin/env PATH="/opt/my-python/3.8/:$PATH" python3
print("Hello World!")
```

Wait! Isn't the shebang a shell script, not a Python script? In TRMM, a "Shell" script and a "Python" script are
treated the same _except_ that Python scripts also work on Windows. On Linux and macOS, "Shell" and "Python" scripts
are treated the same.

| Script Type | OS      | Supported |
| ----------- | ------- | --------- |
| Python      | Windows | Yes       |
| Python      | Linux   | Yes       |
| Python      | macOS   | Yes       |
| Shell       | Windows | **No**    |
| Shell       | Linux   | Yes       |
| Shell       | macOS   | Yes       |

[env]: https://www.gnu.org/software/coreutils/manual/html_node/env-invocation.html#env-invocation
[shebang]: https://en.wikipedia.org/wiki/Shebang_(Unix)
[targeting]: #targeting-a-specific-version

### Python version references

- [Python 2 was sunset][] in January 2020.
- [Python versions][]: Python 3.7 is end of life in June 2023.
- [Debian releases][] including the end of life date.
- [Python support in Debian][] to determine the Python version included in Debian.
- [Ubuntu inherits from Debian][]; see previous line.
- [Ubuntu vs Debian OS versions][]; to map Ubuntu version to Debian version to determine the Python version.
- [Ubuntu Release Notes][] may contain the Python version included.
- [macOS versions][]; macOS version number mapped to the OS name.
- [macOS release history][]; includes supported/maintained/unsupported and last update date.

| OS                                      | Python version               | Installed by TRMM |
| --------------------------------------- | ---------------------------- | ----------------- |
| Windows                                 | 3.8                          | Yes               |
| Linux, Debian 10 (Buster) (end of life) | 3.7                          | No                |
| Linux, Debian 11 (Bullseye)             | 3.9                          | No                |
| Linux, Debian 12 (Bookworm)             | 3.12                         | No                |
| Linux, Ubuntu 20.04 LTS                 | 3.8                          | No                |
| Linux, Ubuntu 22.04 LTS                 | 3.10                         | No                |
| macOS Ventura                           | 3.8                          | No                |
| [macOS Monterey 12.3]                   | 2.7 removed                  | No                |
| [macOS Catalina 10.15]                  | 2.7 (not recommended to use) | No                |

[Debian releases]: https://wiki.debian.org/DebianReleases#Production_Releases
[macOS versions]: https://support.apple.com/en-us/HT201260
[macOS release history]: https://en.wikipedia.org/wiki/MacOS_version_history#Releases
[macOS Monterey 12.3]: https://developer.apple.com/documentation/macos-release-notes/macos-12_3-release-notes#Python
[macOS Catalina 10.15]: https://developer.apple.com/documentation/macos-release-notes/macos-catalina-10_15-release-notes#Scripting-Language-Runtimes
[Python 2 was sunset]: https://www.python.org/doc/sunset-python-2/
[Python support in Debian]: https://wiki.debian.org/Python#Supported_Python_Versions
[Python versions]: https://devguide.python.org/versions/
[Ubuntu inherits from Debian]: https://wiki.ubuntu.com/Python
[Ubuntu Release Notes]: https://wiki.ubuntu.com/Releases
[Ubuntu vs Debian OS versions]: https://askubuntu.com/questions/445487/what-debian-version-are-the-different-ubuntu-versions-based-on
[]: https://stackoverflow.com/questions/69725962/syntaxerror-invalid-syntax-when-using-match-case

### Targeting a specific version

Python compiles the script into bytecode and then executes it. Because of the compilation step, errors due to
language constructs introduced in a later version of Python will cause the script to fail. For example,
[Python 3.10 introduced the "match" term][] as their version of a case or switch statement.

```Python
#!/usr/bin/env python3

match "term":
    case "Nope":
        print("No match found")
    case "term":
        print("Found match!")
    case _:
        print("Default if nothing matches")
```

The same code will work on Python 3.10.

```bash
$ python3.10 test-python-version.py
Found match!
```

The same code fails on versions prior to 3.10.
```bash
$ python3.6 test-python-version.py
  File "test-python-version.py", line 3
    match "term":
               ^
SyntaxError: invalid syntax
```

[Python 3.10 introduced the "match" term]: https://docs.python.org/3/whatsnew/3.10.html#pep-634-structural-pattern-matching
