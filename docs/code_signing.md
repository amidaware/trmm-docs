# Code Signing

*Version added: Tactical RMM v0.6.0 / Agent v1.5.0* (April 2021)

Tactical RMM agents are now [code signed](https://comodosslstore.com/resources/what-is-microsoft-authenticode-code-signing-certificate/)!

To get access to code signed agents, you must be a [Github Sponsor](https://github.com/sponsors/wh1te909) with a minimum **monthly** donation of $50.00. 

One token is valid for 1 self hosted instance. If you have more than 1 instance you will need another token which you can get by increasing your sponsorship by $50 for each token. If you signup for the $50 and then downgrade, your auth token _**will be**_ invalidated and stop working.

Once you have become a sponsor, please email **support@amidaware.com** with your Github username, the API subdomain you will be using for your instance (e.g. `api.example.com`), and Discord username if you're on our [Discord](https://discord.gg/upGTkWp).

Please allow up to 24 hours for a response

You will then be sent a code signing auth token, which you should enter into Tactical's web UI from *Settings > Code Signing*

## How does it work?

Everytime you generate an agent or an agent does a self-update, your self-hosted instance sends a request to Tactical's code signing servers with your auth token.

If the token is valid, the server sends you back a code signed agent. If not, it sends you back the un-signed agent.

If you think your auth token has been compromised or stolen then please email support or contact wh1te909 on discord to get a new token / invalidate the old one.

## Why should I pay for Code Signing?

For two reasons: 

1. To minimize AV's flagging and removing it. 
2. Supports the project, and allows developers to continue working on and improving Tactical RMM

## Tactical RMM is getting flagged as PUA or virus, will this fix it?

Getting a code signed agent, helps but is not guaranteed. Because AVs are not predictable, change all the time, constantly making new decisions and rules, tell you one thing do another, they all do different things etc.

However, the best way to submit a whitelisting request to your AV for the TRMM agent...having a code signed exe is best.

Right click `"C:\Program Files\TacticalAgent\tacticalrmm.exe"` > `Properties` > `Digital Signatures` tab. 

Serial Number: `04a01435f1a73c8874adc89457eda7dc`

Thumb Print: `278e23c068f71b85659e094a557f16cda609fdd6`
