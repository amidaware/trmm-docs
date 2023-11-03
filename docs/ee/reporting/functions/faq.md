# Reporting FAQ

## Pricing

Existing sponsors as of Oct 31, 2023: As a thank you for all your support and patience, you will get our Founders Edition perpetual reporting license which will be included in your existing sponsorship. To enable reporting, simply update your instance as you normally do and reporting will automatically be enabled.

For all others, Reporting will be included for all [Tier 2](../../../sponsor.md#sponsor-with-stripe-or-paypal) and higher packages. Exceptions will be made for Non-Profits who will only require Tier 1.

## How do I enable reporting as a new sponsor?

1. Make sure your server has an appropriate [code signing](../../../code_signing.md) token saved ( Settings > Code Signing).

2. Run the update script with the `--force` flag (see instructions below for standard vs docker installs):

3. Reload the web page. Make sure you use your browser's reload button to hard reload the page.

???+ note ""

    === ":material-ubuntu: Standard install"

        ```bash
        cd ~
        wget -N https://raw.githubusercontent.com/amidaware/tacticalrmm/master/update.sh
        chmod +x update.sh
        ./update.sh --force
        ```

    === ":material-docker: Docker install"

        ```bash
        docker compose down
        docker compose up -d
        ```

If there's a problem, [open a ticket](https://support.amidaware.com).

## How do I add charts/graphs to my report templates?

A bug was discovered with the chart/graph implementation right before release and it had to be pulled. It wil be released in a future update.
