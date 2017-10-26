import adaptCreateElement from './adaptCreateElement';
import ComponentController from '../class/ComponentController';
import adaptComponentSystem from '../adaption/adaptComponentSystem';

const returnNull = () => null;

export default function adaptReactLikeComponentSystem(reactLikeConfig) {
    const
        createFactory =  function(type) {
            const factory = (props, ...children) => {
                return reactLikeConfig.createElement(type, adjustProps(props), ...children);
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
            
            // TODO
            if (reactLikeConfig.name === 'react-lite') {
                ret.vtype = 2;
            }

            ret.displayName = config.displayName;

            const factory = createFactory(ret);
            factory.component = ret;
            return factory;
        },

        defineStandardComponent = config => {
            const CustomComponent = defineCustomComponent(config, reactLikeConfig.Component);

            // TODO - sorry for that hack
            if (reactLikeConfig.name === 'react-lite') {
                CustomComponent.vtype = 4;
            }

            const factory = createFactory(CustomComponent);
            factory.component = CustomComponent;
            return factory;
        };

    const newConfig = {
        name: reactLikeConfig.name,
        api: reactLikeConfig.api,

        defineComponent: config => {
            return config.render
                ? defineFunctionalComponent(config)
                : defineStandardComponent(config); 
        },

        createElement: adaptCreateElement(reactLikeConfig.createElement, reactLikeConfig.name),

        isElement(it) { 
            return it !== undefined
                && it !== null
                && reactLikeConfig.isValidElement(it);
        },

        mount: reactLikeConfig.mount,
        browserBased: reactLikeConfig.browserBased !== false,
    };

    return adaptComponentSystem(newConfig);
}

function defineCustomComponent(config, ParentComponent) {
    const CustomComponent = function Component (...superArgs) {
        ParentComponent.apply(this, superArgs);

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
    CustomComponent.prototype = Object.create(ParentComponent.prototype);

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
