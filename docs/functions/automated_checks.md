# Checks

![Checks](images/automated_checks.png)

## Checks vs Tasks

### When to Use Checks for Scripts
- Define custom return codes for **Information** and **Warning** levels.
- Configure alerts only after a specified number of consecutive failures.

### When to Use Tasks for Scripts
- Execute multiple commands and/or scripts in sequence.
- Leverage advanced scheduling options for flexibility.

## How Often Are Checks Run?

The frequency of checks is controlled at two levels:

1. **Per Check Configuration**  
   Each check has a **Run Check Every (seconds)** setting. Setting this to 0 defaults to the agent's global value.

2. **Agent Default Configuration**  
   The default check frequency for the agent is set under **Edit Agent > General** in the **Run Checks Every** field. The default value is 120 seconds.

## Best Practices

- Use [Automation Policies](automation_policies.md) to apply checks efficiently.
- Customize the frequency of individual checks as needed.
