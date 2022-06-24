# MeshCentral Integration

## Overview

Tactical RMM integrates with [MeshCentral](https://github.com/Ylianst/MeshCentral) for the following 3 functions:

- Take Control
- Real time shell
- Real time file browser

!!!note

    MeshCentral Has issues with Firefox, use a Chromium-based browser

At some point in the future, these functions will be directly built into the Tactical Agent, removing the need for MeshCentral.

It should be noted that Tactical RMM and MeshCentral are 2 completely separate products and can run independently of each other.

They do not even have to run on the same box, however when you install Tactical RMM it simply installs meshcentral for you with some preconfigured settings to allow integration.

It is highly recommended to use the MeshCentral instance that Tactical installs, since it allows the developers more control over it and to ensure things don't break.

## How does it work

MeshCentral has an embedding feature that allows integration into existing products.

See *Section 14 - Embedding MeshCentral* in the [MeshCentral User Guide](https://info.meshcentral.com/downloads/MeshCentral2/MeshCentral2UserGuide.pdf) for a detailed explanation of how this works.

The Tactical RMM Agent keeps track of your Mesh Agents, and periodically interacts with them to synchronize the mesh agent's unique ID with the tactical rmm database.

When you do a take control / terminal / file browser on an agent using the Tactical UI, behind the scenes, Tactical generates a login token for meshcentral's website and then "wraps" MeshCentral's UI in an iframe for that specific agent only, using it's unique ID to know what agent to render in the iframe.

## Running your own existing or separate MeshCentral Server?

We do testing to make sure everything works with the version found [here](https://github.com/amidaware/tacticalrmm/blob/master/api/tacticalrmm/tacticalrmm/settings.py) (look for MESH_VER)

Installation instructions for using your own MeshCentral server:

1. Run standard installation
2. When asked for mesh URL specify your existing mesh server URL
3. After installation, you will need to run thru manually uploading installers and connecting token with [this](troubleshooting.md#need-to-recover-your-mesh-token):
4. Make sure DNS is pointing to your existing server

!!!info
    mesh usernames are **CaSe sEnSiTive**

## Customize Take Control Username

If you've enabled the mesh "Ask Consent + Bar" display option that shows across the top when controlling a users machine and you'd like to change the name that users see in login to https://mesh.yourdomain.com goto Users on left > Click user > Edit `Real Name`

## MeshCentral Options

There are [MANY](https://github.com/Ylianst/MeshCentral/blob/master/meshcentral-config-schema.json) MeshCentral Options that you can configure, here's some you might want to investigate

[`allowHighQualityDesktop`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L135)

[`desktopMultiplex`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L149)

[`userAllowedIP`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L151)

[`agentAllowedIP`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L153)

[`tlsOffload`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L170) (for proxy users)

[`maxInvalid2fa`](https://github.com/Ylianst/MeshCentral/blob/d06ca601ffde4602f97147038616ed2331f01624/meshcentral-config-schema.json#L260)
