import convertConfigToReactLike from './convertConfigToReactLike';

export default function deriveStandardBaseComponent(BaseComponent, config) {
    // config is already normalized

    const convertedConfig = convertConfigToReactLike(config);

    class Component extends BaseComponent {
        constructor(props, context) {
            super(props, context);
            this.__view = null;
            this.__childContext = null;
        }

        componentWillMount() {
            const
                updateView = (view, childContext, callback = null) => {
                    this.__view = view;
                    this.__childContext = childContext;
                    this.forceUpdate(callback);
                },
                
                updateState = (updater, callback) => {
                    this.setState(updater, !callback ? null : () => {
                        callback(this.state, this.props);
                    });
                };

            const result = config.init(updateView, updateState);

            this.__setProps = result.setProps;
            this.__close = result.close || null;
            this.__runOperation = result.runOperation || null;
            this.__handleError = result.handleError || null;

            this.__setProps(this.props);
        }

        componentWillReceiveProps(props) {
            this.__setProps(props);
        }

        componentWillUnmount() {
            if (this.__close) {
                this.__close();
            }
        }

        render() {
            const view = this.__view;
       //     this.__view = null; // TODO - why is this line not working with Preact (see demo 'simple-counter')?
            return view;
        }
    }

    if (config.childContext) {
        Component.prototype.getChildContext = function () {
            return this.__childContext;
        };
    }

    if (config.operations) {
        for (const operationName of config.operations) {
            Component.prototype[operationName] = function (...args) {
                return this.__runOperation(operationName, args);
            };
        }
    }

    if (config.isErrorBoundary) {
        Component.prototype.componentDidCatch = function (error, info) {
            this.__handleError(error, info);
        };
    }

    Object.assign(Component, convertedConfig);

    return Component;
}

