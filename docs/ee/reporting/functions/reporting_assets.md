# Assets

The Reports Manager gives the ability to upload and store static assets for use in any
report. These can be used in html or PDF reports. 

In Report Templates, report assets are referenced by their unique ID so they can be renamed and moved
without messing up the links.

## Managing Assets

Open **Reports Manager** and click on the **Report Assets** button at the top. This will take you 
to the root of the reporting assets directory. You can drill into folders by double-clicking
and there is a right-click menu to perform other operations.

### Adding folders

Navigate to the directory you want to create the folder. Use the **Add Folder** button at the top and
give the folder a name. The folder will show up in the list.

### Uploading assets

Navigate to the directory you want to upload the file(s). Click on the **Upload** button at the top and a 
dialog will open. You can specify multiple assets and click Upload. If there is a name conflict, a set of random
characters will be appended.

### Downloading assets

Use the right-click menu item to download report assets. If you download a folder it will
zip it prior to download. Downloading a file will download the file without zipping.

### Deleting assets.

There are two ways to delete assets. You can use the right-click menu to select a folder or asset to 
delete. This will remove the folder and anything under it.

There is also a bulk delete option by selecting multiple items. Select all of the items you want to delete
and click the **Bulk Actions** button. Select **Delete** and confirm.

### Renaming assets

Use the right-click menu to rename folders or files. If there is a name conflict, a set of random
characters will be appended.

## Using assets in report templates

In the Report Template editor, click on the **Image** button on the toolbar. Select the **Report Assets**
radio button and browse to the asset you want to add. Select it and press insert. This will add a link 
with a url that looks something like `asset://{uuid}`. The reporting engine will resolve this url
to the asset and generate an appropriate url based on if the report output format is HTML or PDF.