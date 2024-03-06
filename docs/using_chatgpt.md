# Using ChatGPT to write scripts for use with Tactical RMM

To streamline the process of generating scripts for Tactical RMM through ChatGPT and ensure they adhere to specific exit codes for various statuses, the following snippet provides a standardized request format. This snippet is designed to be used by anyone needing to create scripts for Tactical RMM. 

Suggest exit codes used are:

 - 0 reserved for passing
 - 2 for Warnings
 - 5 for Informational
 - 1 for Errors.

This can be applied to scripts for Windows, Linux, or macOS environments.

Standardized Request Snippet for Tactical RMM Script Generation
When requesting ChatGPT to generate scripts for Tactical RMM, please use the following format to ensure clarity and efficiency:

```yaml
Platform: [Specify the Operating System - Windows/Linux/macOS]
Task Description: [Briefly describe the task or the problem the script needs to solve.]
Exit Codes:
  - 0: Success (reserved, do not use for conditions)
  - 1: Error (to be used for general errors)
  - 2: Warning (specific condition that requires attention but is not a critical error)
  - 5: Informational (useful information that does not indicate an error)
Additional Requirements: [Any other requirements or specifics about the script, such as using specific commands or handling certain types of files.]
```

Example:
```yaml
Platform: Windows
Task Description: Check if a specific service (e.g., 'Print Spooler') is running and report status.
Exit Codes:
  - 0: Success (service is running)
  - 1: Error (cannot check the service status)
  - 2: Warning (service is not running)
  - 5: Informational (service status checked, no action required)
Additional Requirements: Use PowerShell for script implementation.
```

This standardized request format helps ensure that all necessary details are provided upfront, reducing back-and-forth and improving the efficiency of script generation. The specified exit codes align with Tactical RMM's requirements, facilitating smoother integration and deployment of the scripts within the RMM environment.

Example below:

Based on the provided task description and requirements, here's a PowerShell script that checks if the 'Print Spooler' service is running on a Windows machine and exits with the specified codes based on the service's status.

```powershell
# PowerShell Script to Check the 'Print Spooler' Service Status

try {
    $service = Get-Service -Name "Spooler"

    if ($service.Status -eq "Running") {
        # Service is running - Exit with code 0 for success
        Write-Output "Print Spooler service is running."
        exit 0
    } else {
        # Service is not running - Exit with code 2 for warning
        Write-Output "Print Spooler service is not running."
        exit 2
    }
} catch {
    # Error encountered while checking the service - Exit with code 1 for error
    Write-Output "Error checking Print Spooler service status."
    exit 1
}

# If the script reaches this point, it means the service status was checked successfully but no action is required
# Exit with code 5 for informational
Write-Output "Print Spooler service status checked, no action required."
exit 5
```

How It Works:
Try-Catch Block: This script uses a try-catch block to handle any errors that might occur when attempting to retrieve the status of the 'Print Spooler' service. If an error is caught, it exits with code 1, indicating an error.<br>
Service Status Check: It checks if the status of the 'Print Spooler' service is "Running". If it is, the script exits with code 0, indicating success. If the service is found but is not running, it exits with code 2, serving as a warning.<br>
Informational Exit: The last part of the script (which theoretically should never be reached due to the logic above) exits with code 5, indicating that the status was checked and no further action is required. This is more of a fallback scenario.<br>

Usage:<br>
This script can be executed in a PowerShell environment on any Windows machine. Depending on the service's status, it will provide the appropriate exit code as per your specifications, making it suitable for integration with Tactical RMM for monitoring and alert purposes.
