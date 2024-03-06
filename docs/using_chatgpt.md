# Using ChatGPT to Write Scripts for Use with Tactical RMM

To enhance the process of crafting scripts for Tactical RMM through ChatGPT, ensuring adherence to specific exit codes for various statuses, we provide a standardized request format. This guide is aimed at facilitating anyone in need of creating scripts tailored for Tactical RMM, accommodating scripts for Windows, Linux, or macOS environments.

## Suggested Exit Codes:
- `0`: Reserved for passing.
- `2`: For Warnings.
- `5`: For Informational purposes.
- `1`: For Errors.

## Standardized Request Snippet for Tactical RMM Script Generation
To assure clarity and efficiency in your requests for script generation, please utilize the format below:

```yaml
Platform: [Specify the Operating System - Windows/Linux/macOS]
Task Description: [Briefly describe the task or the problem the script needs to solve.]
Exit Codes:
  - 0: Success (reserved, do not use for conditions)
  - 1: Error (to be used for general errors)
  - 2: Warning (specific condition that requires attention but is not a critical error)
  - 5: Informational (useful information that does not indicate an error)
Additional Requirements: [Include any other script requirements, such as specific commands or file handling.]
```

Example Request:
```yaml
Platform: Windows
Task Description: Check if a specific service (e.g., 'Print Spooler') is running and report status.
Exit Codes:
  - 0: Success (service is running)
  - 1: Error (cannot check the service status)
  - 2: Warning (service is not running)
  - 5: Informational (service status checked, no action required)
Additional Requirements: Use PowerShell for script implementation, utilizing `$host.SetShouldExit($exitcode)` for exit codes.
```
This structured request format is designed to preemptively provide all necessary details, streamlining the script creation process. By aligning with Tactical RMM's requirements, it simplifies integration and deployment with RMM environment.

PowerShell Script Example Utilizing $host.SetShouldExit($exitcode):
```powershell
# PowerShell Script to Check the 'Print Spooler' Service Status

try {
    $service = Get-Service -Name "Spooler"

    if ($service.Status -eq "Running") {
        Write-Output "Print Spooler service is running."
        $host.SetShouldExit(0) # Success
    } else {
        Write-Output "Print Spooler service is not running."
        $host.SetShouldExit(2) # Warning
    }
} catch {
    Write-Output "Error checking Print Spooler service status."
    $host.SetShouldExit(1) # Error
}

# Assuming the script logic completes without requiring further actions
Write-Output "Print Spooler service status checked, no action required."
$host.SetShouldExit(5) # Informational
```

How It Works:<br>
Try-Catch Block: Handles potential errors during the status check of the 'Print Spooler' service. Exiting with code 1 denotes an error.<br>
Service Status Check: Determines if the 'Print Spooler' service is active, exiting with code 0 for success or code 2 for warning.<br>
Informational Exit: Acts as a fallback, indicating that the status has been reviewed without necessitating additional actions, hence exiting with code 5.<br><br>
Usage:
This script can be seamlessly integrated into Tactical RMM's Script Manager and included within automation policies. Depending on the service's state, it delivers the relevant exit code, aligning with the outlined specifications for efficient monitoring and alerting within Tactical RMM.

!!!note
It is crucial to test the script thoroughly. Any errors or adjustments required can be directly addressed with ChatGPT. Ensure the logical sequence within the script is accurately structured for optimal performance.
