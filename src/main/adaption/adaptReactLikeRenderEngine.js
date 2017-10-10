import shapeOfAdaptReactLikeRenderEngineConfig from '../shape/shapeOfAdaptReactLikeRenderEngineConfig';
import ComponentController from '../class/ComponentController';

import { Spec } from 'js-spec';

import adaptRenderEngine from '../adaption/adaptRenderEngine';

const
    returnNull = () => null,
    stateUpdatedPromise = Promise.resolve(true);

export default function adaptReactLikeRenderEngine(reactLikeConfig) {
    const err =
        Spec.shape(shapeOfAdaptReactLikeRenderEngineConfig)
            .validate(reactLikeConfig, '');

    if (err) {
        throw new Error(
            "Illegal first argument 'reactLikeConfig' for "
            + "function 'adaptReactLikeRenderEngine':"
            + err);
    }

    const
        createFactory =  function(type) {
            const factory = (props, ...children) => {
                return reactLikeConfig.createElement(type, adjustProps(props), ...children);
            };

            factory.type = type;

            return factory;
        };
        

    const newConfig = {
        renderEngine: {
            name: reactLikeConfig.renderEngineName,
            api: reactLikeConfig.renderEngineAPI,
        },
        interface: {
            defineFunctionalComponent: config => {
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

                if (reactLikeConfig.renderEngineName === 'react-lite') {
                    ret.vtype = 2;
                }

                ret.displayName = config.displayName;

                const factory = createFactory(ret);
                factory.component = ret;
                return factory;
            },

            defineStandardComponent: config => {
                const CustomComponent = defineCustomComponent(config, reactLikeConfig.Component);

                // TODO - sorry for that hack
                if (reactLikeConfig.renderEngineName === 'react-lite') {
                    CustomComponent.vtype = 4;
                }

                const factory = createFactory(CustomComponent);
                factory.component = CustomComponent;
                return factory;
            },

            createElement(type, props, ...children) {
                return reactLikeConfig.createElement(type, adjustProps(props), ...children);
            },

            isElement(it)  {
                return it !== undefined
                    && it !== null
                    && reactLikeConfig.isValidElement(it);
            },

            render: reactLikeConfig.render
        },
        options: {
            isBrowserBased: reactLikeConfig.isBrowserBased !== false,
        }
    };

    return adaptRenderEngine(newConfig);
}

function defineCustomComponent(config, ParentComponent) {
    const CustomComponent = function (...superArgs) {
        ParentComponent.apply(this, superArgs);

        this.__view = null;
        this.__viewUpdateResolver = null;

        const
            updateView = view => {
                this.__view = view;

                return new Promise(resolve => {
                    this.__viewUpdateResolver = resolve;
                    ParentComponent.prototype.forceUpdate.apply(this);
                });
            },

            updateState = state => {
                //this.state = state;

                // Check whether this has a performance issue
                this.setState(state);
                return stateUpdatedPromise;
            };

        this.__ctrl =
            new ComponentController(config, updateView, updateState);
    };

    CustomComponent.displayName = config.displayName;
    CustomComponent.prototype = Object.create(ParentComponent.prototype);

    const injectPropsNames = [];

    if (config.properties) {
        for (const key of Object.keys(config.properties)) {
            if (config.properties[key].inject) {
                injectPropsNames.push(key);
            }
        }
    }

    if (injectPropsNames.length === 0) {
        CustomComponent.contextTypes = {};

        for (const key of injectPropsNames) {
            CustomComponent.contextTypes[key] = returnNull;
        }
    }

    if (config.childInjections) {
        CustomComponent.childContextTypes = {};

        for (let key of config.childInjections) {
            CustomComponent.childContextTypes[key] = returnNull;
        }

        CustomComponent.prototype.getChildContext = function () {
            return this.__ctrl.provideChildInjections();
        };
    }
    
    Object.assign(CustomComponent.prototype, {
        forceUpdate() {
            this.__ctrl.forceUpdate();
        },

        componentWillMount() {
            this.props = mixPropsWithContext(this.props, this.context);
            this.__ctrl.receiveProps(this.props);
        },

        componentDidMount() {
            if (this.__viewUpdateResolver) {
                this.__viewUpdateResolver(true);
                this.__viewUpdateResolver = null;
            }
        },

        componentDidUpdate() {
            if (this.__viewUpdateResolver) {
                this.__viewUpdateResolver();
                this.__viewUpdateResolver = null;
            }
        },

        componentWillUnmount() {
            this.__ctrl.receiveProps(undefined);
        },

        componentWillReceiveProps(nextProps) {
            this.props = mixPropsWithContext(nextProps, this.context);
            this.__innerCompoennt.receiveProps(this.props);
        },

        render() {
            return this.__view;
        }
    });

    if (config.publicMethods) {
        for (const methodName of config.publicMethods) {
            CustomComponent.prototype[methodName] = function (...args) {
                this.__ctrl.applyPublicMethod(methodName, args);
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
