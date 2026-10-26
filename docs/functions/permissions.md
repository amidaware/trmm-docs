# User Roles and Permissions

## Permission Manager

Make sure you've setup at least 1 valid (Super User aka Administrator) role under _Settings > Permission Manager_

1. Login as usual Tactical user
2. Go to Settings - Permissions Manager
3. Click New Role
4. You can all the role anything, I called it Admins
5. Tick the Super User Box/or relevant permissions required
6. Click Save then exit Permissions Manager
7. Go to Settings - Users
8. Open current logged in user/or any other user and assign role (created above step 6) in the Role drop down box.
9. Click Save 

Once you've set that up a Super User role and assigned your primary user, you can create other Roles with more limited access.


!!!tip
    If you are only trying to give permissions to one or more sites within a client, but not all of the sites, then leave the "Allowed Clients" field blank and only add sites to "Allowed Sites". If a client is set in "Allowed Clients" that will override any site perms and give access to all sites within that client, regardless of what sites are set.

### Allowed Clients vs Allowed Sites

A role with only "Allowed Sites" works with its sites, but doesn't manage the client record itself:

| | Client in "Allowed Clients" | Only sites in "Allowed Sites" |
|---|---|---|
| Client in the client tree | Shown with all its sites | Shown with only the allowed sites |
| Agents | All agents of the client | Only agents in the allowed sites |
| Client-wide actions (bulk command, script or patch actions, *Run Checks*, maintenance mode, patch policy reset, URL actions) | Apply to all agents of the client | Apply only to agents in the allowed sites |
| Edit or delete the client | Yes (with *Manage Clients*) | No |

To let a role edit or delete a client, add the client to "Allowed Clients". If both fields are left blank, the role has access to all clients and sites.

## Video Walkthru

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/TTPLvgjMgp0" frameborder="0" allowfullscreen></iframe>
</div>

## Permissions with extra Security implications

* Reporting Viewer / Manager

The Reporting permission operates on a global access model, granting users full visibility into report history and data across all clients and sites regardless of traditional object-scope restrictions.

!!!warning
    **DO NOT** use the Web Terminal for running the Tactical [update]() script as it will stop the service running the web terminal and bork your update.

* Use TRMM Server Web Terminal
* Run Scripts on TRMM Server

Both of these functions are running under the linux user that you installed TRMM with (usually `tactical` if you followed the docs).

These have full access to your TRMM server's filesystem and as a result have the ability to become root if you have passwordless sudo enabled.

These can be very dangerous features if not handled with care so think carefully before you enable/use them.

These features can be disabled from the web UI in Global Settings.

![alt text](images/trmm_permissions_scriptnterminal.png)

They can also be disabled at the filesystem level (which overrides the setting in Global Settings) by adding any of these variables to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`

```py
TRMM_DISABLE_WEB_TERMINAL = True
TRMM_DISABLE_SERVER_SCRIPTS = True
```

After adding these make sure they take effect by running `sudo systemctl restart rmm daphne celery celerybeat`

!!!info
    **Docker Installs** need to only update the .env file and issue command  ```docker compose down && docker compose up -d ```  for the variables to take effect.
