# ro-selectoid

A simple dropdown component for Angular apps. Markup and behavior only; bring your own stylesheet. Also works out-of-the-box with Bootstrap 3 styles.

## Example

``` html
<ro-selectoid data-tag-name="li">
  <ro-selectoid-toggle data-tag-name="a">Click Me</ro-selectoid-toggle>
  <ro-selectoid-list>
    <li ng-repeat="item in items">
      <a ng-href="{{ item.url }}">{{ item.name }}</a>
    </li>
  </ro-selectoid-list>
</ro-selectoid>
```
