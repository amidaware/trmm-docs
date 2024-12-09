# Tips n' Tricks

## Formatting matters

Make sure your tabs are at the right level.

![tabs matter](../images/reporting_tabs_matter.png)

## Quickly generate reports from client/site tree

Right click on a client or site to quickly run/download a report.


![quick report](../images/quick_report.png)

## Change PDF Orientation to Landscape


<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/-aS6K047Zbc?si=da6s4qyWgncc3Pdn" frameborder="0" allowfullscreen></iframe>
</div>

## Making API Calls from Within a Report Template

If you plan to make API calls (e.g., using axios or fetch) from within a report template, you need to configure additional settings to ensure proper functionality:

Append the following code to `/rmm/api/tacticalrmm/tacticalrmm/local_settings.py`:

```python
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = (
  *default_headers,
  "x-api-key",
)
```

Then restart the rmm service:

```bash
sudo systemctl restart rmm
```
