# Automated Tasks

![Automated Tasks](images/automated_tasks.png)

An **Automated Task** allows you to run scripts and/or commands on an agent, with flexible scheduling options.

## Task Triggers

### Time-Based
- **Daily, Weekly, or Monthly**: Schedule tasks to run at regular intervals, as expected.
- **Run Once**:  
    - For future dates, tasks run as scheduled.  
    - For past dates, tasks are created to run 5 minutes after being registered with the Windows Task Scheduler. This ensures the task runs at least once, as the scheduler will not execute tasks with past "Run Once" dates.

### On Check Failure
Automatically trigger a script to address issues when a Check fails.  


### Onboarding
Use this type of task to execute "Run Once" scripts during agent onboarding. These tasks run immediately after the task is created on the agent, which happens a few minutes after the install of a new agent.

Ideal for:  
    - Setting workstation defaults  
    - Installing software  
    - Configuring machines  

Integrate these tasks with [Automation Policies](automation_policies.md) to streamline the setup of new devices.

### Manual
Manually triggered tasks for on-demand operations.  
Example:  
A **Windows Defender Cleanup Task** might perform the following when manually triggered:  
1. Delete all Shadow Copies from VSS.  
2. Create a new VSS Snapshot.  
3. Clear Defender logs to prevent duplicate alerts.  
4. Run a full Defender scan.  

This is useful for addressing alerts about Defender detections (e.g., malware or adware in download folders).

## Task Actions

- Execute any script from your **Script Library**, or use Batch or PowerShell commands.
- Configure multiple scripts/commands to run sequentially.  
  - Optionally continue or halt the sequence based on errors.

## Collector Tasks

Collector tasks allow you to save script output directly to a custom field.

### How to Create Collector Tasks
1. Add the task to an [Automation Policy](automation_policies.md) or directly to an agent.  
2. During task creation:
   - Select the **Collector** checkbox.
   - Choose the custom field where the output should be saved.

!!! note
    Currently, you can only save data to agent-level custom fields.

For more details, see [Custom Fields](custom_fields.md) and [Scripting](scripting.md).
