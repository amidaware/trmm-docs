# Install Considerations

There's pluses and minuses to each install type (Standard vs Docker *which is currently unsupported*). Be aware that:

- There is no migration script. Once you've installed with one type there is no "conversion". You'll be installing a new server and migrating agents manually if you decide to go another way.

!!!warning
    Tactical RMM does not support changing DNS names, so choose your names wisely. If you need to change your DNS name later you will be uninstalling all old agents, and installing a new server and re-deploying agents.

## Debian vs Ubuntu

| Base RAM Usage | OS |
| --- | --- |
| 80MB | Clean install of Debian |
| 300MB | Clean install of Ubuntu |

Because of RAM usage alone, we recommend Debian 11.

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
