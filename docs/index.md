# Tactical RMM Documentation

![CI Tests](https://github.com/amidaware/tacticalrmm/actions/workflows/ci-tests.yml/badge.svg?branch=develop)
[![codecov](https://codecov.io/gh/amidaware/tacticalrmm/branch/develop/graph/badge.svg?token=8ACUPVPTH6)](https://codecov.io/gh/amidaware/tacticalrmm)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/python/black)

Tactical RMM is a remote monitoring & management tool built with Django, Vue and Golang.
It uses an [agent](https://github.com/amidaware/rmmagent) written in Golang and integrates with [MeshCentral](https://github.com/Ylianst/MeshCentral).

## [LIVE DEMO](https://demo.tacticalrmm.com/)

## Features

- TeamViewer-like remote desktop control
- Real-time remote shell
- Remote file browser (download and upload files)
- Windows Registry Editor
- Remote command and script execution (bash, batch, powershell, python, nushell and deno scripts)
- Event log viewer
- Services management
- Windows patch management
- Automated checks with email/SMS/Webhooks alerting (cpu, disk, memory, services, scripts, event logs)
- Automated task runner (run scripts on a schedule)
- Remote software installation via chocolatey
- Software and hardware inventory

### Sponsorship Features

- Mac and Linux Agents
- Windows [Code Signed](./code_signing.md) Agents
- Fully Customizable [Reporting](./ee/reporting/reporting_overview.md) Module
- [Single Sign-On](./ee/sso/sso.md) (SSO)

## Windows agent versions supported

- Windows 7, 8.1, 10, 11
- Server 2008 R2, 2012 R2, 2016, 2019, 2022, 2025

## Linux agent versions supported

- Any distro with systemd which includes but is not limited to: Debian (10, 11), Ubuntu x86_64 (18.04, 20.04, 22.04), Synology 7, CentOS, FreePBX, Raspberry Pi with raspbian and more!
- Check to see if you're running systemd with `ps --no-headers -o comm 1`

## Mac agent versions supported

- 64 bit Intel and Apple Silicon (M-Series Processors)

## Discuss/Collaborate and Get Help/Support

Join us on [Discord](https://discord.gg/upGTkWp) for (help/tips/discussion/dev chat/social etc). This is the primary method of discussing all things Tactical RMM.

_[Github Discussions](https://github.com/amidaware/tacticalrmm/discussions): is a distant 2nd option, we will frequently request you join Discord if you're requesting help or troubleshooting issues with your installation._

[Github Issues](https://github.com/amidaware/tacticalrmm/issues): Report bugs you discover with clear write-ups on how to reproduce problems. Also submit enhancement/feature requests here.

[View useful scripts](https://github.com/amidaware/community-scripts) to be used in Tactical RMM.

Check out [Awesome](https://github.com/amidaware/trmm-awesome) additions from the community.

## Github Repos

Main Code Repo: <https://github.com/amidaware/tacticalrmm>

Main Web admin frontend: <https://github.com/amidaware/tacticalrmm-web>

Tactical Agent Source: <https://github.com/amidaware/rmmagent>

Community Scripts: <https://github.com/amidaware/community-scripts>

<https://docs.tacticalrmm.com> source: <https://github.com/amidaware/trmm-docs>

Awesome contributions from the community: <https://github.com/amidaware/trmm-awesome>
