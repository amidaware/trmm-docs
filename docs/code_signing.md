# Code Signing

*Version added: Tactical RMM v0.6.0 / Agent v1.5.0* (April 2021)

Tactical RMM agents are now [code signed](https://comodosslstore.com/resources/what-is-microsoft-authenticode-code-signing-certificate/)!

To get access to code signed agents, you must be a [Github Sponsor](https://github.com/sponsors/amidaware) with a minimum **monthly** donation of $50.00. 

One token is valid for 1 self hosted instance. If you have more than 1 instance you will need another token which you can get by increasing your sponsorship by $50 for each token. If you sign up for the $50 and then downgrade, your auth token _**will be**_ invalidated and stop working.

Once you have become a sponsor, please email **support@amidaware.com** with your Github username, the API subdomain you will be using for your instance (e.g. `api.example.com`), and Discord username if you're on our [Discord](https://discord.gg/upGTkWp).

Please allow up to 24 hours for a response

You will then be sent a code signing auth token, which you should enter into Tactical's web UI from *Settings > Code Signing*

## How does it work?

Every time you generate an agent or an agent does a self-update, your self-hosted instance sends a request to Tactical's code signing servers with your auth token.

If the token is valid, the server sends you back a code signed agent. If not, it sends you back the un-signed agent.

If you think your auth token has been compromised or stolen then please email support or contact wh1te909 on discord to get a new token / invalidate the old one.

## Why should I pay for Code Signing?

1. Code signing costs a lot of money. OV code signing requires a legitimate legal business...Amidaware was setup for this purpose. Code signing + operating a business costs thousands of dollars a year.
2. It helps the project move forward and it can supports devs spending time on it, they have lives, wives, jobs and kids which all demands attention.
3. It should stop bad actors using it maliciously.
4. It helps with AVs detecting it as anything malicious.

## Tactical RMM is getting flagged as PUA or virus, will this fix it?

Getting a code signed agent helps, but it is not guaranteed to eliminate this entirely. This is because AVs are unpredictable, changing all the time, constantly making new decisions and rules, telling you one thing and doing another, all doing different things in slightly different ways, etc.

However, the best way to submit a whitelisting request to your AV for the TRMM agent... is having a code signed exe to submit.

Right click `"C:\Program Files\TacticalAgent\tacticalrmm.exe"` > `Properties` > `Digital Signatures` tab. 

Serial Number: `04a01435f1a73c8874adc89457eda7dc`

Thumb Print: `278e23c068f71b85659e094a557f16cda609fdd6`
