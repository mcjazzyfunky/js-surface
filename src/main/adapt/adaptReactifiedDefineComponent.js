import adaptDefineComponent from './adaptDefineComponent';
import validateInitResult from '../validation/validateInitResult';

const returnNull = () => null;

export default function adaptReactifiedDefineComponent(
    { ComponentClass, createElement }) {

    const
        createFactory =  function(type) {
            const factory = (props, ...children) => {
                return createElement(type, adjustProps(props), ...children);
            };

            factory.type = type;

            return factory;
        },
    
        defineFunctionalComponent = config => {
            let ret;
            const injectPropsNames = [];

            if (config.properties) {
                for (let property of Object.keys(config.properties)) {
                    if (config.properties[property].inject) {
                        injectPropsNames.push(property);
                    }
                }
            }

            if (injectPropsNames.length === 0) {
                ret = props => config.render(props);
            } else {
                ret = (props, context) => {
                    return config.render(mixPropsWithContext(props, context));
                };

                ret.contextTypes = {};

                for (let propName of injectPropsNames) {
                    ret.contextTypes[propName] = returnNull;
                }
            }

            ret.displayName = config.displayName;

            const factory = createFactory(ret);
            factory.component = ret;
            return factory;
        },

        defineStandardComponent = config => {
            const CustomComponent = defineCustomComponent(config, ComponentClass);

            const factory = createFactory(CustomComponent);
            factory.component = CustomComponent;
            return factory;
        };


    return adaptDefineComponent({
        defineFunctionalComponent,
        defineStandardComponent
    });
}

function defineCustomComponent(config, ComponentClass) {
    const CustomComponent = function Component (...superArgs) {
        ComponentClass.apply(this, superArgs);

        this.__view = null;
        this.__initialized = false;
        this.__mustBeRerendered = false;
        this.__callbackWhenUpdated = null;

        const
            updateView = (view, childContext, callbackWhenUpdated) => {
                this.__view = view;
                this.__childContext = childContext;
                this.__callbackWhenUpdated = callbackWhenUpdated;
                this.__mustBeRerendered = true;

                if (this.__initialized) {
                    this.forceUpdate();
                } else {
                    this.__initialized = true;
                }
            },

            forwardState = state => {
                if (!this.__ctrl) {
                    this.state = state;
                } else {
                    this.setState(state);
                }
            };

        this.__ctrl =
            new ComponentController(config, updateView, forwardState);
    };

    CustomComponent.displayName = config.displayName;
    CustomComponent.prototype = Object.create(ComponentClass.prototype);

    const injectPropNames = [];

    if (config.properties) {
        for (const key of Object.keys(config.properties)) {
            if (config.properties[key].inject) {
                injectPropNames.push(key);
            }
        }
    }

    if (injectPropNames.length > 0) {
        CustomComponent.contextTypes = {};

        for (const key of injectPropNames) {
            CustomComponent.contextTypes[key] = returnNull;
        }
    }

    if (config.provides) {
        CustomComponent.childContextTypes = {};

        for (let key of config.provides) {
            CustomComponent.childContextTypes[key] = returnNull;
        }

        CustomComponent.prototype.getChildContext = function () {
            return this.__childContext;
        };
    }

    Object.assign(CustomComponent.prototype, {
        componentWillMount() {
            this.__ctrl.setProps(mixPropsWithContext(this.props, this.context));
        },

        componentDidMount() {
            if (this.__callbackWhenUpdated) {
                this.__callbackWhenUpdated(null);
                this.__callbackWhenUpdated = null;
            }
        },

        componentDidUpdate() {
            if (this.__callbackWhenUpdated) {
                this.__callbackWhenUpdated(null);
                this.__callbackWhenUpdated = null;
            }
        },

        componentWillUnmount() {
            this.__ctrl.close();
        },

        componentWillReceiveProps(nextProps) {
            this.__ctrl.setProps(mixPropsWithContext(nextProps, this.context));
        },

        shouldComponentUpdate() {
            return this.__mustBeRerendered;
        },

        render() {
            this.__mustBeRerendered = false;
            return this.__view;
        }
    });

    if (config.isErrorBoundary) {
        CustomComponent.prototype.componentDidCatch = function (error, info) {
            this.__ctrl.handleError(error, info);
        };
    }

    if (config.methods) {
        for (const methodName of config.methods) {
            CustomComponent.prototype[methodName] = function (...args) {
                this.__ctrl.applyMethod(methodName, args);
            };
        }
    }

    return CustomComponent;
}

function mixPropsWithContext(props, context) {
    let ret = props;

    if (context) {
        ret = Object.assign({}, props);

        for (let key of Object.keys(context)) {
            if (context[key] !== undefined && props[key] === undefined) {
                ret[key] = context[key];
            }
        }
    }

    return ret;
}

function adjustProps(props) {
    let ret = props;

    if (props && props.ref) {
        ret = Object.assign({}, props);

        if (props.ref) {
            ret.ref = adjustRefCallback(props.ref);
        }
    }

    return ret;
}

function adjustRefCallback(refCallback) {
    let involvedElement = null;

    return element => {
        if (element) {
            refCallback(element, null);
            involvedElement = element;
        } else {
            refCallback(null, involvedElement);
            involvedElement = null;
        }
    };
}


class ComponentController {
    constructor(config, updateView, forwardState) {
        const
            result = config.init(updateView, forwardState),
            error = validateInitResult(result, config);

        if (error) {
            throw error;
        }

        this.__config = config;
        this.__setProps = result.setProps;
        this.__close = result.close || null;
        this.__applyMethod = result.applyMethod || null;
        this.__handleError = result.handleError || null;
    }

    setProps(props) {
        this.__setProps(props);
    }

    applyMethod(methodName, args) {
        if (!this.__config.methods || !this.__config.methods.includes(methodName)) {
            throw new Error(
                `Tried to call unknown public method '${methodName}' `
                + `on component of type '${this.__config.displayName}'`);
        }

        return this.__applyMethod(methodName, args);
    }

    close() {
        if (this.__close) {
            this.__close();
        }
    }

    handleError(error, info) {
        if (this.__handleError) {
            this.__handleError(error, info);
        }
    }
}
