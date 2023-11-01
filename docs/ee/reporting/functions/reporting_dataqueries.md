# Data Queries

## Introduction

Data queries allow you to pull information from the Tactical RMM database to use in your 
Templates. Data queries are defined in the variables editor under the data_sources object.
There is a predefined format that the data query must follow and it is defined using a JSON 
or yaml syntax.

At it's simplest form, a data query just specifies a model. Doing this will pull all of the 
records and columns available from the table.

This is an example of a data query that pulls all columns and rows from the sites table.

```yaml
data_sources:
    sites:
        model: site
```

Once this is specified in the variables, you can use this data in the template like this:
`{{data_sources.sites}}`. This will just dump the data into the template, but it isn't very 
useful. We can actually loop over this data query to format it using a Jinja
for loop.

```
{% for item in data_sources.sites %}
{{item.name}}
{% endfor %}
```

This will print out the name of every site on a new line.

We can have multiple data_sources specified also like so.

```yaml
data_sources:
    sites:
        model: site
    clients:
        model: client
```

The same rules apply for the second query. You can reference it in your templates using
`{{data_sources.clients}}`. 

## Template Dependencies

Template dependencies allow you to pass information to a report at runtime. This could be
a client, site, or agent. These are covered in detail in the documentation, but just know
that you can use template dependencies in your data queries by using the `{{ }}` in place of the 
data you want to replace. See the example below for a client dependency:

```yaml
data_sources:
    sites:
        model: site
        filter:
            client_id: '{{ client.id }}'
```

!!!note
    Note that quotes are required around `{{}}` tags in the variables section

## Data Query Editor

There is a data query editor that supports auto-complete so that you can more easily
determine which columns and relations are available. *It is recommended to always use
this editor to avoid typos and errors when generating reports.* You can open the query 
editor by going to **Reports Manager > Data Queries > New** or in the template editor by 
clicking **Add Data Query** or **Edit Data Query** toolbar button in the template.

Do note that the Query Editor uses JSON syntax to provide the auto-complete functionality.
You can either start typing to trigger the auto-complete list, or press the Ctrl+Alt key.

## Syntax

Below are the allowed properties in a data query. You can combine these properties together
is the same data query unless specifically noted.

### model - string

The only required field for a data query is the **model**. This tells the system which database 
table to pull the data from. The available models are:

* agent
* agentcustomfield
* agenthistory
* alert
* auditlog
* automatedtask
* check
* checkhistory
* checkresult
* chocosoftware
* client
* clientcustomfield
* debuglog
* globalkeystore
* pendingaction
* policy
* site
* taskresult
* winupdate
* winupdatepolicy

### [only](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#only) - array of strings

**Only** is useful for only pulling certain columns. This is recommended if you are
pulling data from the agents table since **services** and **wmi_detail** columns are
very large and can take a long time to run.

A few examples of using only.

```yaml
data_sources:
    sites:
        model: site
        only:
          - name
          - failing_checks
    clients:
        model: client
        only:
          - name
          - failing_checks
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
```

### [defer](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#defer)

To not load some fields by default to limit data from being pulled, unless it is needed later for some reason.

### custom_fields - array of strings

This is only applicable to the **client**, **site**, and **agent** model. You can 
pass an array of strings with names of custom fields and it will inject them into
the data. 

Lets say we have these custom fields configured:

Client
- custom_field
- Custom Field 2

Site
- another Custom Field
- no_spaces

Agent
- agent_custom_field

We can pull this data in a data query like this:

```yaml
data_sources:
    clients:
        model: client
        only:
          - name
          - failing_checks
        custom_fields:
          - custom_field
          - Custom Field 2
    sites:
        model: site
        only:
          - name
          - failing_checks
        custom_fields:
          - another Custom Field
          - no_spaces
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
        custom_field:
          - agent_custom_field
```

The custom field names are case sensitive and the custom field must be configured in
the system or no custom data will be pulled. A custom_fields object is added to the
data and is accessible in the template.

You can access the custom field data for the clients data query like this:

```
{% for item in data_source.clients %}
{{ item.custom_fields.custom_field }}
{{ item.custom_fields["Custom Field 2"] }}
{% endfor %}
```

Note that you can't use dot notation for a property if it has spaces. See the above 
example for the **Custom Field 2** property

### [filter](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#filter) - object

Using the filter property, you can filter the amount of rows that are returned. This
is useful if you only want a agents for a particular client or site, or you only
want agents tht are pending a reboot.

See below for an example:

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        filter:
            needs_reboot: True
```

This data query will only return agents that need a reboot. We can also add a second
filter like so.

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        filter:
            needs_reboot: True
            plat: "windows"
```

The above is just doing an *equals* comparison to make sure the rows match. You can also
use other operations like greater than, contains, etc. 

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        filter:
            operating_system__contains: "22H2"
```

To use the contains filter, we need to append two underscores (_) and type in the field lookup. 
This just uses the django built in field lookups.A full list can be found 
[Here](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#field-lookups)

### [exclude](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#exclude) - object

We can use this to exclude rows from our data. The same rules apply for filter apply here. (See above)

Example

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        exclude:
            plat: "linux"
```

### limit - number

This will limit the number of returned rows in the data.

Example

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        limit: 400
```

### [get](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#get) - boolean 

Instead of returning a list, the data query will attempt to return a single object. This is 
best used with a filter that guarantees a single row returned, i.e: filtering by id. This will
error out if the query returns more than one object.

Example

```yaml
data_sources:
    agent:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        filter: 
          agent_id: hjk1hj23hj23hkj2hjh3j2h3
        get: true
```

In the template, you can use the properties directly instead of looping

```
{{data_sources.agent.hostname}}
{{data_sources.agent.operating_system}}
```

### [first](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#first) - boolean

This will return the first row in a table. This is guaranteed to always return one result.
You can apply other properties (like filter or exclude) also to limit the data.

Example 

```yaml
data_sources:
    agent:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        first: true
```

In the template, you can use the properties directly instead of looping

```
{{data_sources.agent.hostname}}
{{data_sources.agent.operating_system}}
```

### [count](https://docs.djangoproject.com/en/4.2/ref/models/querysets/#id9) - boolean

This allows you to return the number of rows found. Can be used with filter or exclude.

Example 

```yaml
data_sources:
    agent:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        count: true
```

### order_by - string

This allows you to reorder the returned data based on a specific column. Putting a '-'
before the column puts it in descending order and the default is ascending order

Ascending Example 

```yaml
data_sources:
    agent:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        order_by: hostname
```

Descending Example

```yaml
data_sources:
    agent:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
        order_by: -hostname
```

### csv - boolean | object

This is a shorthand to return a string formatted as a csv. 

Example

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
          - site__name
          - site__client__name
        filter:
            site__client__name: "Client Name"
        csv: true
```

This will add a **site__name** and **site__client__name** column on the returned data. We use a
double underscore every time we want to go to another table. The site column exists directly on
the agents table. So in order to get the name (which resides on the sites table) we need to use
the double underscore. Same thing with the client name. We need to go through the sites table
in order to get the client name so we use another double underscore. 

Usage in template

{{data_sources.agents}}

Output will look something like:

```
hostname,operating_system, plat,needs_reboot,site__name,site__client__name
data,data,data,data,data,data
```

You can also rename the columns by passing a mapping into csv like so:

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
          - site__name
          - site__client__name
        filter:
            site__client__name: "Client Name"
        csv: 
            hostname: Hostname
            operating_system: Operating System
            plat: Platform
            needs_reboot: Needs Reboot
            site__name: Site Name
            site__client__name: Client Name
```

Which would return something like

```
Hostname,Operating System,Platform,Needs Reboot,Site Name,Client Name
data,data,data,data,data,data
```

### json - boolean

This will return a json string representation of the object. This is useful
if you are passing the data source to be processed by javascript.

Example

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
          - site__name
          - site__client__name
        filter:
            site__client__name: "Client Name"
        json: true
```

Usage in template

`{{data_sources.agents}}`

Output will look something like:

```
hostname,operating_system, plat,needs_reboot,site__name,site__client__name
data,data,data,data,data,data
```

## Relations

You can include columns from a related model by using the double underscore syntax. You may have
a data query using the agents table, but want to include the Site name and the Client name.
See the example below:

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
          - site__name
          - site__client__name
```

This will add a **site__name** and **site__client__name** column on the returned data. We use a
double underscore every time we want to go to another table. The site column exists directly on
the agents table. So in order to get the name (which resides on the sites table) we need to use
the double underscore. Same thing with the client name. We need to go through the sites table
in order to get the client name so we use another double underscore. 

All available combinations are listed in the query editor

To display these columns in the template you can do this:

This will return a json string representation of the object. This is useful if you are passing the 
data source to be processed by javascript or you just want to create your own custom api endpoint.

```
{% for item in data_source.agents %}
{{ item.site__name }}
{{ item.site__client__name }}
{% endfor %}
```

We can also filter based on relations. See below:

```yaml
data_sources:
    agents:
        model: agent
        only:
          - hostname
          - operating_system
          - plat
          - needs_reboot
          - site__name
          - site__client__name
        filter:
            site__client__name: "Client Name"
```