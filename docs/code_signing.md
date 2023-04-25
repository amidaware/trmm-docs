# Code Signing

*Version added: Tactical RMM v0.6.0 / Agent v1.5.0* (April 2021)

Tactical RMM agents are now [code signed](https://comodosslstore.com/resources/what-is-microsoft-authenticode-code-signing-certificate/)!

To get access to code signed agents (which includes linux/mac agents), you must be a [Sponsor](sponsor.md) with a minimum **monthly** [Tier 1](sponsor.md#sponsor-with-stripe-or-paypal) sponsorship.

One token is valid for 1 self hosted instance. If you have more than 1 instance please contact [support](https://support.amidaware.com/) for pricing options.

Once you have become a [Sponsor](sponsor.md), open a [support ticket](https://support.amidaware.com/) and choose the "Code Signing Request" layout.

![ticketlayout](images/code_signing_ticket_layout.png)

Select the payment method you paid with from the dropdown.

If you sponsored via [Github Sponsors](sponsor.md#sponsor-with-github-sponsors) make sure to enter your Github **username** (not email).

If you sponsored via [Stripe or Paypal](sponsor.md#sponsor-with-stripe-or-paypal) make sure to enter the same email address you used when paying. 

Enter the API subdomain you will be using for your instance (e.g. `api.example.com`).

If you already have an existing token and want to switch your sponsorship from github to stripe/paypal, make sure to mention that in the ticket description and include your github username. Don't forget to also cancel your github sponsorship after you have successfully setup Paypal/Stripe.

If you have joined our [Discord](https://discord.gg/upGTkWp) and would like to be added to the sponsors role, include your Discord username as well.

Please allow up to 24 hours for a response.

You will then be sent a code signing auth token, which you should enter into Tactical's web UI from *Settings > Code Signing*

## How does it work?

Every time you generate an agent or an agent does a self-update, your self-hosted instance sends a request to Tactical's code signing servers with your auth token.

If the token is valid, the server sends you back a code signed agent. If not, it sends you back the un-signed agent.

If you think your auth token has been compromised or stolen then please [open a ticket](https://support.amidaware.com/) to get a new token / invalidate the old one.

## Why should I pay for Code Signing?

1. Code signing costs a lot of money. OV code signing requires a legitimate legal business...Amidaware was setup for this purpose. Code signing + operating a business costs thousands of dollars a year.
2. It helps the project move forward and it can supports devs spending time on it, they have lives, wives, jobs and kids which all demands attention.
3. It should stop bad actors using it maliciously.
4. It helps with AVs detecting it as anything malicious.

## Tactical RMM is getting flagged as PUA or virus, will this fix it?

Getting a code signed agent helps, but it is not guaranteed to eliminate this entirely. This is because AVs are unpredictable, changing all the time, constantly making new decisions and rules, telling you one thing and doing another, all doing different things in slightly different ways, etc.

However, the best way to submit a whitelisting request to your AV for the TRMM agent... is having a code signed exe to submit.

Right click `"C:\Program Files\TacticalAgent\tacticalrmm.exe"` > `Properties` > `Digital Signatures` tab. 

Serial Number: `0fef30ccce9d30183067160018796558`

Thumb Print: `0e4844266294100d3f93e1cc7eecf61e9206bb14`
