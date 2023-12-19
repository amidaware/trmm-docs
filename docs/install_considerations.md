# Install Considerations

!!!exclamation
    Paid Hosted TRMM is available! Stop reading now and [open a ticket for pricing](https://support.amidaware.com).

There's pluses and minuses to each install type (Standard vs Docker *which is currently unsupported*). Be aware that:

- There is no migration script. Once you've installed with one type there is no "conversion". You'll be installing a new server and migrating agents manually if you decide to go another way.

!!!warning
    Tactical RMM does not support changing DNS names, so choose your names wisely. If you need to change your DNS name later a [paid migration](https://support.amidaware.com) is possible.

## Debian vs Ubuntu

| Base RAM Usage | OS |
| --- | --- |
| 80MB | Clean install of Debian |
| 300MB | Clean install of Ubuntu |

Because of RAM usage alone, we recommend Debian 12.

## Traditional Install - **Officially supported**

- It's a VM/machine. One storage device to backup if you want to do VM based backups.
- You have a [backup](backup.md) and [restore](restore.md) script.
- Much easier to troubleshoot when things go wrong.
- Faster performance / easier to fine tune and customize to your needs.

## Docker Install
- Docker is more complicated in concept: has volumes and images.
- Backup/restore is via Docker methods only.
- Docker has container replication/mirroring options for redundancy/multiple servers.
- **NOT** officially supported and **NOT** recommended for production use at the moment unless you are very comfortable managing/troubleshooting docker.

## Azure VMs

Azure ranks their VM's in Series <https://azure.microsoft.com/en-us/pricing/details/virtual-machines/series/>.

Tactical RMM will run poorly in CPU limited VMs. So **DO NOT** use Series A or Series B VMs. You will need at least a Series F or better. Also, make sure there is no IO throttling / IOPS limits for the VM.

The same applies for other big cloud providers that throttle low end VMs.

## Larger Installs

If you're having more than 200 agents, that's a larger install. You're probably also a business and making (and saving?) money with Tactical RMM, you're [supporting](support.md) the project right?

You should be aware of server defaults like `Default script run time: 120 seconds`

Imagine you have 10 check, on 500 computers, running every 120 seconds. 

For checks alone, that's 5000 writes every 120 seconds, or 3.6 million database entries created every 24hrs. Default retention on check history is 30 days, so your check history database is probably averaging 108,000,000 records before regular data purges. That's a lot of write-wear on your SSD-based storage layer. 

Do you really need your Disk Space check running more than 1-2 times a day? Probably not. 

Also consider staggering the times of all your checks, so that each check is naturally spreading the load on your server at more random intervals instead of focusing all checks at exactly the same time. 

So in Summary:

- Please support the project, we do need it!
- Adjust script default run intervals
- Don't have checks (and tasks) all run at the same time

If you have questions please [open a ticket](https://support.amidaware.com) to discuss looking at your server and configuration, load testing, and giving recommendations.
