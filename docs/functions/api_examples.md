# API Examples

## Get Custom Fields

```powershell
$TRMM_API_Base_Endpoint = Read-Host "Please provide your API domain i.e https://api.domain.com"
$TRMM_API_Key = Read-Host "Please provide your API Key"

$TRMM_API_CustomFields_Endpoint = $TRMM_API_Base_Endpoint + "/core/customfields"

$TRMM_Request_Headers = @{

    "X-API-KEY" = $TRMM_API_Key

}

$Request = Invoke-RestMethod $TRMM_API_CustomFields_Endpoint -Headers $TRMM_Request_Headers -Method Get

$TRMM_Agent_ExistingCustomFields = ($Request | ? {$_.model -eq 'Agent'})

# Gets all of the Windows Features and places it in an array to parse later
# This is to ensure that TRMM has all Windows Feature roles available as a Custom Field
$AllWindowsFeatures = Get-WindowsFeature
$TRMM_Role_AllCustomFields = @()

foreach($WindowsFeature in $AllWindowsFeatures){

    if($WindowsFeature.Depth -eq 1){

        $PrimaryRole = $WindowsFeature.DisplayName

    } else {

        $TRMM_Role_AllCustomFields += [PSCustomObject]@{

            "Role" = $PrimaryRole
            "Value" = $WindowsFeature.DisplayName

        }

    }

}

$Unique_Roles = $TRMM_Role_AllCustomFields | Select -Unique Role
#Loop through each WindowsFeature
foreach($WindowsFeature in $Unique_Roles){

    if($TRMM_Agent_ExistingCustomFields.Name -like "*$($WindowsFeature.Role)*"){

        # Need to check if it also contains the value

    } else {

        # Check to see if the Role is an Array or an Object
        # Convert to Array otherwise

        if((($TRMM_Role_AllCustomFields | ? {$_.Role -eq $WindowsFeature.Role}).Value) -isnot [array]){

            $CustomFieldOptions = @(($TRMM_Role_AllCustomFields | ? {$_.Role -eq $WindowsFeature.Role}).Value)

        } else {

            $CustomFieldOptions = ($TRMM_Role_AllCustomFields | ? {$_.Role -eq $WindowsFeature.Role}).Value

        }

        # Create the Custom Field body
        $CustomFieldData = @{

            model = "agent"
            name = "Server Role - " + $WindowsFeature.Role
            type = "multiple"
            options = $CustomFieldOptions

        }

        $CreateCustomField = Invoke-RestMethod $TRMM_API_CustomFields_Endpoint -Headers $TRMM_Request_Headers -Method Post -Body ($CustomFieldData | ConvertTo-Json) -ContentType "application/json"

    }
}
```

## Get Custom Fields

<https://discord.com/channels/736478043522072608/888474369544847430/1004184193078669522>

```python
import requests
import json

API = "https://api.example.com"
HEADERS = {
    "Content-Type": "application/json",
    "X-API-KEY": "changeme",
}

payload = {"custom_fields": [{"string_value": "66666", "field": 2}]}

r = requests.put(
    f"{API}/agents/IcAhWvOHlADwjuYmndAkjbJuhSdWvWjtvYcYjCZk/",
    data=json.dumps(payload),
    headers=HEADERS,
)

print(r.__dict__)
```

## Create Collector Tasks

<https://discord.com/channels/736478043522072608/888474369544847430/1004383584070676610>

```powershell
# Query the TRMM API with PowerShell

# Add this to dotenv.ps1
#$TRMM_API_KEY = ""
#$TRMM_API_DOMAIN = ""
. .\dotenv.ps1

function GetURL {
    param (
        [string] $Path
    )
    return "https://${TRMM_API_DOMAIN}/${Path}/"
}

$Headers = @{
    'X-API-KEY' = $TRMM_API_KEY
}

$Collector = [PSCustomObject]@{
    policy = 1
    actions = @(@{
        name = "Collector - Location - City and State"
        type = "script"
        script = 121
        timeout = 90
        script_args = @()
    })
    assigned_check = $null
    custom_field = 14
    name = "Get city and state from API"
    # expire_date = $null
    run_time_date = "2022-08-02T08:00:00Z"
    # run_time_bit_weekdays = $null
    weekly_interval = 1
    daily_interval = 1
    # monthly_months_of_year = $null
    # monthly_days_of_month = $null
    # monthly_weeks_of_month = $null
    # task_instance_policy = 0
    # task_repetition_interval = $null
    # task_repetition_duration = $null
    # stop_task_at_duration_end = $false
    # random_task_delay = $null
    # remove_if_not_scheduled = $false
    run_asap_after_missed = $true
    task_type = "daily"
    alert_severity = "info"
    # collector_all_output = $false
    # continue_on_error = $false
}

$Tasks_Endpoint = GetURL("tasks")
$Payload = $Collector | ConvertTo-Json
$Response = Invoke-RestMethod $Tasks_Endpoint -Headers $Headers -ContentType "application/json" -Method "Post" -Body $Payload
if (! $?) {
    Write-Output "Failed to submit request: $($error[0].ToString() )"
    Write-Output "Stacktrace: $($error[0].Exception.ToString() )"
    Exit(1)
}
$Response | ConvertTo-Json
```

## Show Tasks

```powershell
# Query the TRMM API with PowerShell
. .\dotenv.ps1

$Tasks_Endpoint = GetURL("tasks")
$Response = Invoke-RestMethod $Tasks_Endpoint -Headers $Headers -ContentType "application/json" -Method "Get"
# $Response | ConvertTo-Json
$Response.foreach({ $_ }) | Select-Object ID, Policy, Name, Custom_Field | Format-Table
```

## Task/collector results

```powershell
# Query the TRMM API with PowerShell
. .\dotenv.ps1

$Agents_Endpoint = GetURL("agents")
$Agents = Invoke-RestMethod $Agents_Endpoint -Headers $Headers -ContentType "application/json" -Method "Get"
# $Agents | ConvertTo-Json
# $Agents.foreach({ $_ }) | Select-Object Agent_ID, Hostname, Site_Name, Client_Name, Monitoring_Type | Format-Table
$Agent_ID = "AGENT ID FROM TABLE"

$Agents.foreach({
    if ($_.Agent_ID -ne $Agent_ID) {
        return
    }
    $Fields_Endpoint = GetURL("agents/$($_.Agent_ID)/tasks")
    $Fields = Invoke-RestMethod $Fields_Endpoint -Headers $Headers -ContentType "application/json" -Method "Get"
    # $Fields | ConvertTo-Json
    $Fields.foreach({ $_ }) | Select-Object ID, Check_Name, Name, Actions, Task_Result | Format-Table
})
```

## Update Custom Fields

<https://discord.com/channels/736478043522072608/888474369544847430/1004422340815360111>

This will update the custom fields for an agent. The field value come from the custom fields two posts above. Other fields that exist will not be updated. If you want to update only 1 custom field, use only 1 entry in the array.

```powershell
# Query the TRMM API with PowerShell
. .\dotenv.ps1

$Agent_ID = "AGENT ID GOES HERE"
$Endpoint = GetURL("agents/$($Agent_ID)")

$Custom_Fields = [PSCustomObject]@{
    custom_fields = @(
        @{
            field = 13
            string_value = "Value updated from the API"
        },
        @{
            field = 14
            string_value = "Another value from the API"
        }
    )
}

$Payload = $Custom_Fields | ConvertTo-Json
$Response = Invoke-RestMethod $Endpoint -Headers $Headers -ContentType "application/json" -Method Put -Body $Payload
if (! $?) {
    Write-Output "Failed to submit request: $($error[0].ToString() )"
    Write-Output "Stacktrace: $($error[0].Exception.ToString() )"
    Exit(1)
}
$Response | ConvertTo-Json
```

## List service information from Agent

```powershell
# Query the TRMM API with PowerShell
. .\dotenv.ps1

$Payload = [PSCustomObject]@{
    code = [string](Get-Content -Path .\TRMM-Run-Cmd-Remote.ps1 -Raw -Encoding UTF8)
    timeout = 90
    args = @()
    shell = "powershell"
}

$Agent_ID = "ENTER AGENT ID HERE"
$Rest_Params = @{
    Uri = GetURL("scripts/${Agent_ID}/test")
    Headers = $Headers
    ContentType = "application/json"
    Method = "POST"
    Body = $Payload | ConvertTo-Json
}
# Write-Output $Rest_Params["Body"]

# Prefer to handle the error ourselves rather than fill the screen with red text.
$ErrorActionPreference = 'SilentlyContinue'

$Response = Invoke-RestMethod @Rest_Params
if (! $?) {
    Write-Output "Failed to submit request: $($error[0].ToString() )"
    Write-Output "Stacktrace: $($error[0].Exception.ToString() )"
    Exit(1)
}
# $Response | ConvertTo-Json
$Services = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Response))
ConvertFrom-Json $Services
```

## Combining scripts

This will iterate over all agents, filter out non-Windows and offline agents, run the PowerShell above to the first 5 services that are running, and compile the information in a Servers array.

```powershell
# Query the TRMM API with PowerShell
. .\dotenv.ps1

# Default parameters. Body is missing because GET does not include the body.
$Rest_Params = @{
    Uri = ""
    Headers = $Headers
    ContentType = "application/json"
    Method = "GET"
}

# Prefer to handle the error ourselves rather than fill the screen with red text.
$ErrorActionPreference = 'SilentlyContinue'

$Rest_Params["Uri"] = GetURL("agents")
$Agents = Invoke-RestMethod @Rest_Params
if (! $?) {
    Write-Output "Failed to get list of agents from API: $($error[0].ToString() )"
    Write-Output "Stacktrace: $($error[0].Exception.ToString() )"
    Exit(1)
}

# Remote command to run.
$Payload = [PSCustomObject]@{
    # Without the type casting to [string], this was returning properties relating to Get-Content.
    code = [string](Get-Content -Path .\TRMM-Run-Cmd-Remote.ps1 -Raw -Encoding UTF8)
    timeout = 90
    args = @()
    shell = "powershell"
}

$Rest_Params["Body"] = [string]($Payload | ConvertTo-Json)
$Rest_Params["Method"] = "POST"
$Servers = @()
foreach($Agent in $Agents) {
    # Build this object to match your needs.
    $Server = [PSCustomObject]@{
        Agent_ID = $Agent.agent_id
        # Services = "Error / Unavailable"
        Service_Name = "N/A"
        Service_Status = "N/A"
        Service_DisplayName = "N/A"
        Hostname = $Agent.hostname
        Platform = $Agent.plat
        Status = $Agent.status
    }

    if ($Agent.plat -ne "windows" -or $Agent.status -ne "online") {
        # Only process online Windows agents. Add other checks as necessary.
        # Uncomment this if you want to include filtered servers in the output.
        # $Servers += $Server.PSObject.Copy()
        continue
    }

    $Rest_Params["Uri"] = GetURL("scripts/$($Agent.Agent_ID)/test")
    $Response = Invoke-RestMethod @Rest_Params
    if (! $?) {
        $Servers += $Server.PSObject.Copy()
        continue
    }

    # Create a new server object for every item returned from the remote agent (Services in this case).
    $Services = ConvertFrom-Json ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Response)))
    foreach($Service in $Services) {
        $Server.Service_Name = $Service.Name
        $Server.Service_Status = $Service.Status
        $Server.Service_DisplayName = $Service.DisplayName
        $Servers += $Server.PSObject.Copy()
    }
}

$Servers | Format-Table Agent_ID, Hostname, Status, Service_Name, Service_Status, Service_DisplayName
# $Servers
```
