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

## Allow Users to change their passwords and 2FA codes

If you would like to allow your techs to change their TRMM login passwords or reset their 2FA codes make sure under permission manager that you give them permission to `Accounts` > `List User Accounts` (they do not need Manage User Accounts permission unless you want them being able to reset OTHER users passwords)

Users will then be able to change only their passwords/2FA with the `Settings Menu` > `User Administration` > Right-click themselves > Reset xxx
