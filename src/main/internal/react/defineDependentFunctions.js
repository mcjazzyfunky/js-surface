import adaptFunctionalComponent from
	'../component/adaption/adaptFunctionalComponent.js';

import adaptBasicComponent from
	'../component/adaption/adaptBasicComponent.js';

const fakeState = Object.freeze({});

export default function createDependentFunctions(
	{ Component
	, createElement
	, createFactory
	, isValidElement
	}) {

	const commonMethods = {
		defineFunctionalComponent(config) {
			return adaptFunctionalComponent(config, adjustedConfig => {
				const ret = props => adjustedConfig.render(props);

				ret.displayName = adjustedConfig.name;

				return ret;
			});
		},

		defineBasicComponent(config) {
			return adaptBasicComponent(config, adjustedConfig => {
				class ExtCustomComponent extends CustomComponent {
					constructor(...args) {
						super(args, adjustedConfig);
					}
				}

				ExtCustomComponent.displayName = adjustedConfig.name;

				return createFactory(ExtCustomComponent);
			});
		},

		createElement: createElement,

		isElement(it)  {
	    	return it !== undefined
	    		&& it !== null
	    		&& isValidElement(it);
		}
	};


	class CustomComponent extends Component {
	    constructor(superArgs, config) {
	        super(...superArgs);

			this.__viewToRender = null;
			this.__resolveRenderingDone = null;
			this.__shouldUpdate = false;
			this.state = fakeState;

			let initialized = false;

			const
				{ onProps, methods } = config.initProcess(
					view => {
						this.__viewToRender = view;

						if (initialized) {
							this.__shouldUpdate = true;
							this.setState(fakeState);
						} else {
							initialized  = true;
						}

						return new Promise(resolve => {
							this.__resolveRenderingDone = () => {
								this.__resolveRenderingDone = null;
								resolve(true);
							};
						});

					},
					state => {
						this.state = state;
					});

			this.__onProps = onProps;

			if (methods) {
				Object.assign(this, methods);
			}
	    }

	    componentWillMount() {
	    	this.__onProps(this.props);
	    }

	    componentDidMount() {
	    	if (this.__resolveRenderingDone) {
				this.__resolveRenderingDone();
	    	}
	    }

	    componentDidUpdate() {
	    	if (this.__resolveRenderingDone) {
				this.__resolveRenderingDone();
	    	}
	    }

	    componentWillUnmount() {
			this.__onProps(undefined);
	    }

	    componentWillReceiveProps(nextProps) {
	    	this.__onProps(nextProps);
	    }

	    shouldComponentUpdate() {
	    	const ret = this.__shouldUpdate;

	    	if (ret) {
	    		this.__shouldUpdate = false;
	    	}

	    	return ret;
	    }

	    render() {
	    	return this.__viewToRender;
	    }
	}

	return commonMethods;
}

