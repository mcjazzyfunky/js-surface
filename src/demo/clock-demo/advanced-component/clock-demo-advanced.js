import {
	createElement as dom,
	defineAdvancedComponent,
	defineStore,
} from 'js-surface';

const Store = defineStore({
	init() {
		const ret = {
			state: {
				dateTime: new Date()
			},
			data: {
				timerId: null
			}
		};

		return ret;
	},

	updates: {
		setDateTime: dateTime => state => ({
			...state,
			dateTime
		})
	},

	commands: {
		subscribeToTimer: () => (s, data, dispatch) => {
			if (data.timerId) {
				clearInterval(data.timerId);
			}

			const timerId = setInterval(() => {
				dispatch(Store.setDateTime(new Date()));
			}, 1000);

			return { ...data, timerId };
		},

		unsubscribeFromTimer: () => (s, data) => {
			if (data.timerId) {
				clearInterval(data.timerId);
			}

			return { ...data, timerId: null };
		},

		updateDateTime: () => (s, d, dispatch) => {
			self.dispatch(Store.setDateTime(new Date()));
		}
	}
});

export default defineAdvancedComponent({
	name: "AdvancedClock",

	properties: {
		label: {
			type: String,
			defaultValue: 'Date/Time'
		}
	},

	init() {
		return new Store({ dateTime: new Date() });
	},

	onWillMount({ dispatch }) {
		dispatch(
			Store.updateDateTime(),
			Store.subscribeToTimer());
	},

	onWillUnmount({ dispatch }) {
		dispatch(Store.unsubscribeFromTimer());
	},

	render({ props, state }) {
		return (
			dom('div',
				null,
				dom('label',
					null,
					props.label),
				dom('span',
					null,
					state.dateTime)));
	}
});
