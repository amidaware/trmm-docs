# Checks

![Checks](images/automated_checks.png)

The maximum time between check runs is 86400 seconds (aka 24 hrs).

Checks are run based on scheduled (celery) timers triggered from the TRMM server. Agents [must be online](../howitallworks.md#understanding-trmm) to receive the script payload to trigger the event.

## Checks vs Tasks

Reasons to use Checks for scripts:

- You can define custom return codes for: Information and Warning return codes.
- You can specify more than 1 consecutive failures before getting alerts

Reasons to use Tasks for scripts:

- You can run multiple scripts in sequence
- You can have something run just once instead of at an interval

## How often is it run?

It is controlled at 2 levels:

- In a check, there's a Run Check every (seconds). `0` means the default value.
- Default value is defined per Agent under Edit Agent > General pane: Run checks every. Default is 120 seconds.

## Best Practices

Use [Automation Policies](automation_policies.md) to apply checks

Customize the frequency of checks running per Check
