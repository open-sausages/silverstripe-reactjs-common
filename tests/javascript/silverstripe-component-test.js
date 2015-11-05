jest.dontMock('../../public/src/silverstripe-component.js');
jest.dontMock('jquery');

describe('SilverStripeComponent', () => {

	var $ = require('jquery'),
		React = require('react/addons'),
		TestUtils = React.addons.TestUtils,
		SilverStripeComponent = require('../../public/src/silverstripe-component.js'),
		props;

	class TestComponent extends SilverStripeComponent {
		render() {
			return <div />;
		}
	};

	beforeEach(() => {
		props = {};
	});

	/* 
	 * Note: Currently jsdom doesn't support element.dataset because of a limitation in v8.
	 * This means we can't $(document).data('events') to get a list of events bound to document.
	 * So for now we're just triggering the events we expect to be bound and testing for the expected outcome.
	 */

	describe('componentDidMount()', () => {
		it('should not bind any event if props.cmsEvents is missing', () => {
			var component = TestUtils.renderIntoDocument(
				<TestComponent {...props} />
			);

			expect(component.cmsEvents).toBe(undefined);
		});

		it('should bind `cmsEvents.length` events to document', () => {
			props.cmsEvents = {
				'cms.tabchanged': function (event, title) {
					this.setState({ currentTab: title });
				},
				'cms.folderchanged': function (event, title) {
					this.setState({ currentFolder: title });
				}
			};

			let component = TestUtils.renderIntoDocument(
				<TestComponent {...props} />
			);

			expect(component.state).toBe(null);

			$(document).trigger('cms.tabchanged', 'Main');
			expect(component.state.currentTab).toBe('Main');

			$(document).trigger('cms.folderchanged', 'Uploads');
			expect(component.state.currentFolder).toBe('Uploads');
		});
	});

	describe('componentWillUnmount()', () => {
		it('should unbind all of the component\'s CMS events', () => {
			var currentTab = null,
				container = document.createElement('div');

			props.cmsEvents = {
				'cms.tabchanged': function (event, title) {
					currentTab = title;
				}
			};

			// Add the component which will attach the event listeners.
			let component = React.render(<TestComponent {...props} />, container);

			// Make sure the listener is working
			$(document).trigger('cms.tabchanged', 'Main');
			expect(currentTab).toBe('Main');

			// Remove the component which should remove the listeners.
			React.unmountComponentAtNode(container);

			// The value shouldn't change now the listener has been removed.
			$(document).trigger('cms.tabchanged', 'Settings');
			expect(currentTab).toBe('Main');
		});
	});

	describe('_emitCmsEvent()', () => {
		it('should trigger the passed event on document', () => {
			var cmsTitle = null,
				component = TestUtils.renderIntoDocument(
					<TestComponent {...props} />
				);

			$(document).on('test-component.changed-title', function (event, title) {
				cmsTitle = title;
			});

			expect(cmsTitle).toBe(null);
			component._emitCmsEvent('test-component.changed-title', 'SilverStripe');
			expect(cmsTitle).toBe('SilverStripe');

			$(document).off('test-component.changed-title');
		});
	});
});
