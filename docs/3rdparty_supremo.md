# Supremo

## Supremo Integration

!!!info
     You can set up a full automation policy to collect the machine GUID, but this example will collect from just one agent for testing purposes.

### Create Custom Field

From the UI go to **Settings > Global Settings > CUSTOM FIELDS > Agents**.

Add Custom Field:</br>
**Target** = `Agent`</br>
**Name** = `SupremoID`</br>
**Field Type** = `Text`</br>

### Create URL Action ([Ref](https://www.supremocontrol.com/tutorials/how-to-start-a-connection-with-supremo-using-a-link-or-url/))

While in Global Settings go to **URL ACTIONS**.

Add a URL Action:</br>
**Name** = `Supremo Control`</br>
**Description** = `Connect to a Supremo Session`</br>
**URL Pattern** =

```html
Supremo:{{agent.SupremoID}}
```

### Create Supremo Collector

[This](https://www.supremocontrol.com/faq-items/how-can-i-obtain-the-id-of-supremo-via-api/) populates the Custom field with the Supremo ID.

Navigate to an agent with Supremo running (or apply using **Settings > Automation Manager**).</br>
Go to Tasks.</br>
Add Task:</br>
**Select Script** = `Supremo - Get ClientID for client` (this is a builtin script from script library)</br>
**Descriptive name of task** = `Collects the SupremoID for Supremo.`</br>
**Collector Task** = `CHECKED`</br>
**Custom Field to update** = `SupremoID`</br>

Click **Next**</br>
Check **One Time**, choose a time in the past so it'll run once on the agent.</br>
Click **Add Task**

Right click on the newly created task and click **Run Task Now**.

Give it a second to execute, then right click the agent that you are working with and go to **Run URL Action > Supremo Control**.

It should launch the session in Supremo.

!!!note
     You have to have Supremo installed on the local computer.
