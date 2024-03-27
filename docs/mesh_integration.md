# MeshCentral Integration

## Overview

Tactical RMM integrates with [MeshCentral](https://github.com/Ylianst/MeshCentral) for the following 3 functions:

- Take Control.
- Real time shell.
- Real time file browser.

!!!note
    MeshCentral has issues with Firefox, use a Chromium-based browser.

It should be noted that Tactical RMM and MeshCentral are 2 completely separate products and can run independently of each other.

They do not even have to run on the same box, however when you install Tactical RMM it simply installs MeshCentral for you with some pre-configured settings to allow integration.

It is highly recommended to use the MeshCentral instance that Tactical installs, since it allows the developers more control over it and to ensure things don't break.

## How does it work?

Please watch this video to fully understand how mesh integrations and permissions sync work.

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/HS03aIg5S5g" frameborder="0" allowfullscreen></iframe>
</div>

MeshCentral has an embedding feature that allows integration into existing products.

See *Section 14 - Embedding MeshCentral* in the [MeshCentral User Guide](https://ylianst.github.io/MeshCentral/meshcentral/#embedding-meshcentral) for a detailed explanation of how this works.

The Tactical RMM agent keeps track of your Mesh agents, and periodically interacts with them to synchronize the Mesh agent's unique ID with the Tactical RMM database.

When you do a take control / terminal / file browser on an agent using the Tactical UI, behind the scenes, Tactical generates a login token for MeshCentral's website and then "wraps" MeshCentral's UI in an iframe for that specific agent only, using it's unique ID to know what agent to render in the iframe.

## Customize Take Control Username

If you've enabled the Mesh "Ask Consent + Bar" display option that shows across the top when controlling a users machine and you'd like to change the name that users see, make sure the user has a First and/or Last name set TRMM (Settings > User Administration).

## Get a url to login to mesh as the mesh superuser
```bash
/rmm/api/env/bin/python /rmm/api/tacticalrmm/manage.py get_mesh_login_url
```

## Running your own existing or separate MeshCentral server?

We do testing to make sure everything works with the version found [here](https://github.com/amidaware/tacticalrmm/blob/master/api/tacticalrmm/tacticalrmm/settings.py) (look for MESH_VER).

Installation instructions for using your own MeshCentral server:

1. Run standard installation.
2. After installation is complete, disable meshcentral `sudo systemctl disable --now meshcentral`.
3. In TRMM Web UI go to Settings > Global Settings > MeshCentral and update values from your existing mesh (make sure to use a mesh superuser).
4. Add `USE_EXTERNAL_MESH = True` to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`
5. Restart TRMM server.

!!!info
    Mesh usernames are **CaSe sEnSiTive**

## Take Control Connect vs RDP Connect

![](images/2024-02-29-00-20-58.png)

When using `Take Control` from Tactical RMM you are using the Desktop function in MeshCentral

`Connect` button: 

Right-click the button for options.

About the same a VNC, but it's not compatible with VNC. The original VNC protocol did not use JPEG, instead it uses RLE encoding or ZRLE. MeshCentral's remote desktop only uses JPEG (or WEBP in some cases) because browsers can decode JPEG easily.

The MeshAgent will split the desktop into 32x32 pixel tiles and see if any of the tiles have changed. If a group of tiles change since the last frame, a JPEG is sent to update the area.

`RDP Connect` button: 

Is a browser based RDP client. It connects to the native RDP in versions of Windows that support inbound RDP connects. Pro, Workstation, Enterprise, Server, Terminal Server, RDS Server etc. 

!!!note
    It does not work for Windows Home because Home doesn't support incoming RDP connections.

## Remote Terminal how it works

For the remote terminal, we launch a shell on the remote system and pipe VT100 terminal emulation to/from the browser. On the browser, we use XTermJS to view the terminal session.

## MeshCentral Options

There are [MANY](https://github.com/Ylianst/MeshCentral/blob/master/meshcentral-config-schema.json) MeshCentral options that you can configure. Here are some you might want to investigate:

[`allowHighQualityDesktop`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L135)

[`desktopMultiplex`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L149)

[`userAllowedIP`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L151)

[`agentAllowedIP`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L153)

[`tlsOffload`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L170) (for proxy users)

[`maxInvalid2fa`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L260)

## Using Tactical RMM Without MeshCentral

Install Tactical RMM normally. Then, to disable the MeshCentral Server on the TRMM server run:

```bash
sudo systemctl disable --now meshcentral mongod
```

Then when installing an agent, make sure to pass the `-nomesh` flag to the [installer](install_agent.md#optional-installer-args)

## OMG MeshCentral isn't maintained anymore!

MeshCentral is still [actively being maintained](https://meshcentral2.blogspot.com/2023/10/meshcentral-windows-arm64-nodejs-v11.html), the lead devs had jobs in which they were paid by a corporation to develop MeshCentral, they now have got other jobs which means they are supporting and developing MeshCentral in their free time (like alot of other projects) this means development is slower but not that it isn't maintained anymore. If this changes or it becomes necessary to fix something that breaks or packages needing updated we are prepared to begin maintaining our own fork. The features of MeshCentral that TRMM uses are only the 3 items above and are extremely mature.

