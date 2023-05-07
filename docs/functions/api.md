## API Access

Tactical RMM uses a Django Rest Framework backend which is designed to be consumed by a [VueJS frontend](https://github.com/amidaware/tacticalrmm-web).

Therefore, anything you can do via the web interface, you can do via the API.

However this makes it difficult to document the API as it has only been designed to be consumed by our vue frontend.

The easiest way to see what endpoint/payload you need to send is to open your browser's developer tools > Network tab. Then, perform the action you wish to do via the api in Tactical's web interface and watch the network tab to see the endpoint and the payload that is generated, and use that as an example of how to structure your api request.

Please note that using an API key will bypass 2FA authentication.

Please also note that since Tactical RMM follows [Semantic Versioning](https://semver.org/), until we reach a 1.0.0 release, the API is considered unstable and may change at anytime.

When creating the key you'll need to choose a user, which will reflect what permissions the key has based on the user's role.

Navigate to **Settings > Global Settings > API Keys** to generate a key.

!!!warning
    Pay attention to your trailing `/` they matter.

Headers:

```json
{
    "Content-Type": "application/json",
    "X-API-KEY": "J57BXCFDA2WBCXH0XTELBR5KAI69CNCZ"
}
```

Example curl request:

```bash
curl https://api.example.com/clients/ -H "X-API-KEY: Y57BXCFAA9WBCXH0XTEL6R5KAK69CNCZ"
```

## Querying the API

Here are some examples:

???+ abstract "Example Code"

    === ":fontawesome-brands-python: Python"

        Requests Windows Update check to run against agent ID

        ```python
        import requests

        API = "http://api.example.com"
        HEADERS = {
            "Content-Type": "application/json",
            "X-API-KEY": "DKNRPTHSAPCKT8A36MCAMNZREWWWFPWI",
        }


        def trigger_update_scan():
            agents = requests.get(f"{API}/agents/?detail=false", headers=HEADERS)
            for agent in agents.json():
                r = requests.post(f"{API}/winupdate/{agent['agent_id']}/scan/", headers=HEADERS)
                print(r.json())


        if __name__ == "__main__":
            trigger_update_scan()
        ```

    === ":material-powershell: PowerShell 1"

        ```powershell
        # Example - Get all agents using API

        $headers = @{
            'X-API-KEY' = 'ABC1234567890987654321'
        }

        $url = "https://api.yourdomain.com/agents/"

        $agentsResult = Invoke-RestMethod -Method 'Get' -Uri $url -Headers $headers -ContentType "application/json"

        foreach ($agent in $agentsResult) {
            Write-Host $agent

            #Write-Host $agent.hostname
        }
        ```

    === ":material-powershell: PowerShell 2"

        ```powershell
        # Example - Send PowerShell command to agent.  Make sure to pass {{agent.agent_id}} as a parameter

        param(
            $AgentId
        )

        $headers = @{
            'X-API-KEY' = 'ABC1234567890987654321'
        }

        $url = "https://api.yourdomain.com/agents/$AgentId/cmd/"

        $body = @{
            "shell"   = "powershell"
            "cmd"     = "dir c:\\users"
            "timeout" = 30
        }

        $commandResult = Invoke-RestMethod -Method 'Post' -Uri $url -Body ($body|ConvertTo-Json) -Headers $headers -ContentType "application/json"

        Write-Host $commandResult
        ```

### Running a Script on an Agent Using the API

`POST` to the endpoint `/agents/<agentid>/runscript/` this:

```
{
    "output": "forget",
    "email": [],
    "emailMode": "default",
    "custom_field": null,
    "save_all_output": false,
    "script": 102, // primary key of script in postgres
    "args": [
        "arg1",
        "arg2"
    ],
    "timeout": 90 // seconds
}
```

## Enable Swagger

This will let you add a browser interface to see how you can use the API better.

Open `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py` and add

```conf
SWAGGER_ENABLED = True
```

Restart Django: `sudo systemctl restart rmm.service`

Then visit `https://api.example.com/api/schema/swagger-ui/` to see it in action.

## API via CLI

<https://gitlab.com/NiceGuyIT/trmm-cli>

## API Examples

Listing all software on all agents:

```python
import requests

API = "https://api.example.com"
HEADERS = {
    "Content-Type": "application/json",
    "X-API-KEY": "9SI43IFUMPEVRWOZR4NC8PGP4ZLA9PYX",
}

def get_software():
    agents = requests.get(f"{API}/agents/?detail=false", headers=HEADERS)  # get a list of all agents
    for agent in agents.json():  # loop thru all agents and print list of installed software
        r = requests.get(f"{API}/software/{agent['agent_id']}/", headers=HEADERS)
        print(r.json())

if __name__ == "__main__":
    get_software()
```

## More Examples

[Lots of misc examples](api_examples.md)
