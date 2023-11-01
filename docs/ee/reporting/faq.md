# Reporting FAQ

## Pricing

Existing sponsors as of Oct 31, 2023: As a thank you for all your support and patience, you will get our Founders Edition perpetual reporting license which will be included in your existing sponsorship. To enable reporting, simply update your instance as you normally do and reporting will automatically be enabled.

For all others, Reporting will be included for all Tier 2 and higher packages.

## How do I enable reporting as a new sponsor?

1. Make sure your server has an appropriate [code signing](../../code_signing.md) token saved ( Settings > Code Signing).

2. Run the update script with the `--force` flag:

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

3. Reload the web page. Make sure you use your browser's reload button to hard reload the page.

If there's a problem, [open a ticket](https://support.amidaware.com).

## How do I generate pretty charts/graphs?

A bug was discovered with the chart/graph implementation right before release and it had to be pulled. It wil be released in a future update.
