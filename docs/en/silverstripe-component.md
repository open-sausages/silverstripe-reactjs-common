# SilverStripeComponent

The base class for SilverStripe React components. If you're building React components for the CMS, this is the class you want to extend. `SilverStripeComponent` extends `React.Component` and adds some handy CMS specific behaviour.

## Creating a component

__my-component.js__
```javascript
import SilverStripeComponent from 'silverstripe-component';

class MyComponent extends SilverStripeComponent {

}

export default MyComponent;
```

That's how you create a SilverStripe React component!

## Interfacing with ye olde CMS JavaScript

One of the great things about ReactJS is that it works great with DOM based libraries like jQuery and Entwine. To allow legacy-land scripts to notify your React component about changes, add the following.

__my-component.js__
```javascript
import SilverStripeComponent from 'silverstripe-component';

class MyComponent extends SilverStripeComponent {
	componentDidMount() {
		super.componentDidMount();
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
	}
}

export default MyComponent;
```

This is functionally no different from the first example. But it's a good idea to be explicit and add these `super` calls now. You will inevitably add `componentDidMount` and `componentWillUnmount` hooks to your component and it's easy to forget to call `super` then.

So what's going on when we call those? Glad you asked. If you've passed `cmsEvents` into your component's `props`, wonderful things will happen.

Let's take a look at some examples.

### Getting data into a component

Sometimes you'll want to call component methods when this change in legacy-land. For example when a CMS tab changes you might want to update some component state.

__main.js__
```javascript
import $ from 'jquery';
import React from 'react';
import MyComponent from './my-component';

$.entwine('ss', function ($) {
	$('.my-component-wrapper').entwine({
		getProps: function (props) {
			var defaults = {
				cmsEvents: {
					'cms.tabchanged': function (event, title) {
						this.setState({ currentTab: title });
					}
				}
			};
			
			return $.extend(true, defaults, props);
		},
		onadd: function () {
			var props = this.getProps();
			
			React.render(
				<MyComponent {...props} />,
				this[0]
			);
		}
	});
});
```

__legacy.js__
```javascript
(function ($) {
	$.entwine('ss', function ($) {
		$('.cms-tab').entwine({
			onclick: function () {
				$(document).trigger('cms.tabchanged', this.find('.title').text());
			}
		});
	});
}(jQuery));
```

Each key in `props.cmsEvents` gets turned into an event listener by `SilverStripeComponent.componentDidMount`. When a legacy-land script triggers that event on `document`, the associated component callback is invoked, with the component's context bound to it.

All `SilverStripeComponent.componentWillUnmount` does is clean up the event listeners when they're no longer required.

There are a couple of important things to note here:

1. Both files are using the same `ss` namespace.
2. Default properties are defined the a `getProps` method.

This gives us the flexability to add and override event listeners from legacy-land. We're currently updating the current tab's title when `.cms-tab` is clicked. But say we also wanted to highlight the tab. We could do something like this.

__legacy.js__
```javascript
(function ($) {
	$.entwine('ss', function ($) {
		$('.main .my-component-wrapper').entwine({
			getProps: function (props) {
				return this._super({
					cmsEvents: {
						'cms.tabchanged': function (event, title) {
							this.setState({
								currentTab: title,
								selected: true
							});
						}
					}
				});
			}
		});
		
		$('.cms-tab').entwine({
			onclick: function () {
				$(document).trigger('cms.tabchanged', this.find('.title').text());
			}
		});
	});
}(jQuery));
```

Here we're using Entwine to override the `getProps` method in `main.js`. Note we've made the selector more specific `.main .my-component-wrapper`. The most specific selector comes first in Entwine, so here our new `getProps` gets called, which passes the new callback to the `getProps` method defined in `main.js`.

### Getting data out of a component

There are times you'll want to update things in legacy-land when something changes in you component.

`SilverStripeComponent` has a handly method `_emitCmsEvents` to help with this.

__my-component.js__
```javascript
import SilverStripeComponent from 'silverstripe-component';

class MyComponent extends SilverStripeComponent {
	componentDidMount() {
		super.componentDidMount();
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
	}
	
	componentDidUpdate() {
		this._emitCmsEvent('my-component.title-changed', this.state.title);
	}
}

export default MyComponent;
```

__legacy.js__
```javascript
(function ($) {
	$.entwine('ss', function ($) {
		$('.cms-tab').entwine({
			onmatch: function () {
				var self = this;

				$(document).on('my-component.title-changed', function (event, title) {
					self.find('.title').text(title);
				});
			},
			onunmatch: function () {
				$(document).off('my-component.title-changed');
			}
		});
	});
}(jQuery));
```
