# Base Templates

Base Templates are used to apply the same formatting to multiple templates. The base template
will declare one or more "blocks" that are then filled in by the child template. Base templates
use the Jinja syntax for inheriting and extending. You can see the reference 
[Here](https://jinja.palletsprojects.com/en/3.1.x/templates/#template-inheritance).

!!!note
    Even though the examples for base templates are in html, you can use any format you want.

## Adding base templates

To add a base template you can browse to **Reports Manager > Base Templates > Add**. From there 
you can create your base template in the editor and click save.

## Using a base template in your report template

To use the base template, we will need to open up the Report Template editor 
(**Reports Manager > double-click on the template**), then select the base template from the 
dropdown.

!!!note 
    This will automatically add the {% extends ... %} tag at the beginning of the report template
    on the backend. If you are looking through the Jinja base template documentation, you can omit that
    line.

## Using blocks

See below for a basic base template that specifies one block.

```html
<html>
    <head>
        <style>
            {{css}}
        </style>
    </head>
    <body>
        {% block content%}{% endblock %}
    </body>
</html>
```

In the template that is inheriting the base template above, you can fill in these
blocks like so:

```
{% block content%}
This will show up between the <body> tags in the base template/
{% endblock %}
```

## Multiple blocks

We can also fill in multiple blocks if they are specified in the base template. Any blocks
that aren't used will just be blank.

```html
<html>
    <head>
        <style>
            {{css}}
        </style>
    </head>
    <body>
        <div id="header">
        {% block header %}{% endblock %}
        </div>

        <div id="content">
        {% block content %}{% endblock %}
        </div>

        <div id="footer">
        {% block footer %}{% endblock %}
        </div>
    </body>
</html>
```

In the template, we just need to use the same blocks and it will fill in the data.

```
{% block header %}
This is the header
{% endblock %}

{% block content %}
This is the content
{% endblock %}

{% block footer %}
This is the footeer
{% endblock %}
```

## Variable analysis

In the Report Template editor, you can quickly see what blocks the base template has available. 
You can click on the **>** button in the top-left of the editor (Under the report name field) and 
at the top it will give a warning if it doesn't see the blocks listed. You can also click on the
blocks to copy them to the clipboard to be pasted into the template.
