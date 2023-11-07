# Variables

Variables provide a way to enrich your report with data. Variables are entered using 
YAML syntax and can be edited directly in the template by using the variables
editor on the right. Everything with YAML is case-sensitive, so make sure to check for typos!

YAML syntax and features reference can be found [Here](https://quickref.me/yaml)

## Some sample variables and how to use them in the template

**Variables**

```yaml
title: Title Name
listOfData: [12, 13, 14]
an_object:
    key: value
    key2: value2
    key with a space: value3
an_array_of_objects:
    - key: value
      key2: value2
      the space: value3
    - key: value
      key2: value2
      the space: value3
```

**Markdown Template**
```md
# {{title}}

## A list of numbers
{% for item in listOfData %}
* {{item}}
{% endfor %}

## List the object keys
* {{an_object.key}}
* {{an_object.key2}}
* {{an_object["key with a space"]}}

## List of objects
{% for item in an_array_of_objects %}
* {{item.key}}
* {{item.key2}}
* {{item["the space"]}}
{% endfor %}
```

**Rendered Output**

```md
# Title Name

## List of numbers
* 12
* 13
* 14

# List the object keys
* value
* value2
* value3

## List of objects
* value
* value2
* value3
* value
* value2
* value3
```

## Dependencies

Dependencies offer a way to provide information to the templating engine at the reports
runtime. The three built in dependencies are **client**, **site**, and **agent**. The 
dependencies dropdown also allows for custom values to be entered. When you run the 
report, a dialog box will show that requires you to provide the values for the dependencies.
If you ran the report from a right-click context menu item for client, site, or agent, the 
dependency will auto-populate in the report.

Dependencies are actually merged into the variables behind the scenes, so any properties on
the dependency are available to the template to use.

## Built-in dependencies

You can access the built-in dependencies directly in the template using {{client.name}},
{{agent.hostname}}, etc.

## Custom dependencies

You can type in custom dependencies in the dropdown to prompt for other information at
report runtime. Custom dependencies only support string values at this time and are 
referenced in the template using {{ custom_dependency_name }}.

## Using Template Dependencies in variables

Note:  You can use dependencies in data queries to filter data. See [Data Queries](reporting_dataqueries.md)

You can also use dependencies in the variables section. The syntax is still the same 
as using them in the template, but you need to make sure that the {{}} is surrounded 
with quotes. 

Example with client and a custom_dep dependency

```yaml
title: '{{client.name}} Summary'
dependency: '{{custom_dep}} some value'
```

## Variable Analysis

If you want to see what your data will look like and how to use it in your template, you can 
click on the **>** icon on the top-left of the editor windows. (Under the Template Name field).
This will run the report template variables server-side and send the results back. This is
really useful for data queries and other dynamic information that isn't immediately apparent.

You can also click on the property to copy the template tag to the clipboard. There is also
a button for arrays to generate a for loop. You can clip in the loop button and it will put
the text in the clipboard to be pasted into the template.

If you are using dependencies, you will need to click on the Preview tab and fill in the 
dependencies before the variables analysis will run.

## Python modules available in template

### datetime

See [https://docs.python.org/3/library/datetime.html](https://docs.python.org/3/library/datetime.html) for all properties and functions

#### datetime.datetime

Example usage in template

`{{ datetime.datetime.now() }}`

#### datetime.date

Example usage in template

`{{ datetime.date.today() }}`

#### datetime.timedelta

Example usage in template

`{{ datetime.datetime.now() - datetime.timedelta(days=30) }}`

### re

See [https://docs.python.org/3/library/re.html](https://docs.python.org/3/library/re.html) for all properties and functions

Example usage in template

```
{% set matches = re.search('this', 'inthisstring') %}
{{matches}}
```

### ZoneInfo

See [https://docs.python.org/3/library/zoneinfo.html](https://docs.python.org/3/library/zoneinfo.html) for all properties and functions

Example usage in template

```
{% for item in data_sources.agentsList %}
    {% set pst_zone = ZoneInfo('America/Los_Angeles') %}
    {% set last_seen_pst = item.last_seen.astimezone(pst_zone) %}
    Last seen in PST: {{ last_seen_pst.strftime('%Y-%m-%d %H:%M:%S %Z') }}
{% endfor %}
```

## Custom jinja filters

In addition to the [builtin jinja filters](https://jinja.palletsprojects.com/en/3.1.x/templates/#builtin-filters), TRMM also ships with custom jijna filters. We can write custom filters based on your requests so please ask one of the developers in Discord if you would like a custom filter written to make parsing data in templates easier for you.

The list of custom jijna filters are listed [here](https://github.com/amidaware/tacticalrmm/blob/master/api/tacticalrmm/ee/reporting/custom_filters.py) and here are video examples of how to use them:

as_tz:

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/knnfyLqZ0E4" frameborder="0" allowfullscreen></iframe>
</div>

local_ips:

<div class="video-wrapper">
  <iframe width="400" height="225" src="https://www.youtube.com/embed/5ScKQe_XDXw" frameborder="0" allowfullscreen></iframe>
</div>


## Custom processors

Custom processors are provided to the yaml parser and allow shortcuts or provide functionality
that isn't possible using the template and variables alone.

### !now

Provides a timestamp at the report runtime.

Example

```yaml
report_run_timestamp: !now
```

You can also get a timestamp in the future or the past by passing a parameter. The supported time
intervals are:

* weeks
* days
* hours
* minutes
* seconds
* microseconds

If you want a timestamp in the future 5 days you would do:

```yaml
five_days_from_now: !now days=5
```

If you want a timestamp 4 hours in the past you would do:

```yaml
four_hours_ago: !now hours=-4
```

You can also specify a value from a dependency.

Note: The !now must be outside of the quotes.

```yaml
last_seen_time: !now 'hours=-{{last_seen}}'
```

If we ran the report and put in 5 it would output
```yaml
last_seen_time: !!now 'hours=-5'
```
