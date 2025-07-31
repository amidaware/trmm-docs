# Example Reports

## Agent Uptime

1. Import the `Agent Uptime_By Client (html)` report from the Shared Templates Report library
2. Check at least one overdue item in agent settings<br>![uptime](../images/example_uptime_setting.png)
3. Run report and enjoy!

![html report screenshot](../images/example_uptimereport.png)

## Windows 11 Upgrade Compatible list

To get a Windows 10 upgrade to Windows 11 compatibility list you'll want to:

1. Create an agent custom field<br>![Win11](../images/example_win11_compatible_customfield.png)
2. Create an automation policy that applies to all your workstations ![Task1](../images/example_win11_compatible_task1.png)<br>![Task2](../images/example_win11_compatible_task2.png)<br>![Task3](../images/example_win11_compatible_task3.png)
3. Import one of the `Windows 11 Compatible` Reports ![Reports](../images/example_win11_reports.png)
4. Enjoy!

![Win11 HTML report screenshot](../images/example_win11_compatible_reporthtml.png)


![pdf report screenshot](../images/example_win11_compatible_reportpdf.png)

## Antivirus Report

To get a report of the active Antivirus on an agent you'll want to:

1. Create an agent custom field<br>![Win11](../images/example_av_customfield.png)
2. Clone `Antivirus - Verify Status` Community script and add the `-customField` Script arg<br>![av script](../images/example_av_script.png)
3. Create an automation policy that applies to all your workstations ![Task1](../images/example_av_task1.png)<br>![Task2](../images/example_av_task2.png)<br>![Task3](../images/example_av_task3.png)
4. Import one of the `Antivirus` Reports ![Reports](../images/example_av_reportimport.png)
5. Enjoy!

![Antivirus HTML report screenshot](../images/example_av_reporthtml.png)

![Antivirus pdf report screenshot](../images/example_av_reportpdf.png)

## NOC Dashboard

Got a TV? Load it up for the team!

Want quick searchable agent status with more data? Load it locally!

The `Restrict Summary` button is for only showing agents that are offline and have an overdue alert set (eg critical machines). If it's on a hands off device make sure you set the refresh every so it's reloading data regularly.

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/OtV2M5uYj_k" frameborder="0" allowfullscreen></iframe>
</div>

## Software Inventory

`Software Inventory_By Software Name`

Search for software, sort by different columns

![Software Inventory](../images/example_softwarereport.gif)


`Software Report - Advanced DataTables`

![Software Advanced](../images/example_software_Advanced_DataTables.png)
