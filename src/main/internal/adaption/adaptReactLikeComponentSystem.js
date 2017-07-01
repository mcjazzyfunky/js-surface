import shapeOfAdaptReactLikeComponentSystemConfig from '../shape/shapeOfAdaptReactLikeComponentSystemConfig.js';

import { Spec } from 'js-spec';

import adaptComponentSystem from '../../api/adaptComponentSystem.js';

const
    returnNull = () => null,
    fakeState = Object.freeze({});

export default function adaptReactLikeComponentSystem(reactLikeConfig) {
    const err = Spec.shape(shapeOfAdaptReactLikeComponentSystemConfig)(reactLikeConfig);

    if (err) {
        throw new Error(
            "Illegal first argument 'reactLikeConfig' for "
            + "function 'adaptReactLikeComponentSystem':"
            + err);
    }

    const
        CustomComponent = defineCustomComponent(reactLikeConfig.Component),
        //createFactory = reactLikeConfig.createFactory;
         
        createFactory =  function(type) {
            const factory = (props, ...children) => {
                return reactLikeConfig.createElement(type, adjustProps(props), ...children);
            };

            factory.type = type;


            return factory;
        };
        

    const newConfig = {
        componentSystem: {
            name: reactLikeConfig.componentSystemName,
            api: reactLikeConfig.componentSystemAPI,
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

                if (reactLikeConfig.componentSystemName === 'react-lite') {
                    ret.vtype = 2;
                }

                ret.displayName = config.displayName;

                return createFactory(ret);
            },

            defineStandardComponent: config => {
                // Sorry for that evil eval hack - do not know how to
                // ExtCustomComponent's class name otherwise
                // (ExtCustomComponent.name is read-only).
                const ExtCustomComponent = eval(`(class ${config.displayName} extends CustomComponent {
                    constructor(...args) {
                        super(args, config);
                        this.__childContextTypes = undefined;
                    }
                })`);

                ExtCustomComponent.displayName = config.displayName;

                if (config.publicMethods) {
                    for (let key of Object.keys(config.publicMethods)) {
                        ExtCustomComponent.prototype[key] = function () {
                            return config.publicMethods[key](this.__instance, arguments);
                        };
                    }
                }

                if (config.childInjectionKeys) {
                    ExtCustomComponent.childContextTypes = {};

                    for (let key of config.childInjectionKeys) {
                        ExtCustomComponent.childContextTypes[key] = returnNull;
                    }

                    ExtCustomComponent.prototype.getChildContext = function() {
                        return this.__getChildInjection();
                    };
                }

                ExtCustomComponent.displayName = config.displayName;

                const injectPropsNames = [];

                if (config.properties) {
                    for (let property of Object.keys(config.properties)) {
                        if (config.properties[property].inject) {
                            injectPropsNames.push(property);
                        }
                    }
                }

                if (injectPropsNames.length > 0) {
                    ExtCustomComponent.contextTypes = {};

                    for (let propName of injectPropsNames) {
                        ExtCustomComponent.contextTypes[propName] = returnNull;
                    }
                }

                // TODO - sorry for that hack
                if (reactLikeConfig.componentSystemName === 'react-lite') {
                    ExtCustomComponent.vtype = 4;
                }

                return createFactory(ExtCustomComponent);
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

    return adaptComponentSystem(newConfig);
}

function defineCustomComponent(ReactLikeComponent) {
    const customClass = class CustomComponent extends ReactLikeComponent {
        constructor(superArgs, config) {
            super(...superArgs);

            this.__viewToRender = null;
            this.__resolveRenderingDone = null;
            this.__shouldUpdate = false;
            this.state = fakeState;

            let initialized = false;

            const
                { propsConsumer, instance, getChildInjection } = config.init(
                    view => {
                        this.__viewToRender = view;

                        if (initialized) {
                            this.__shouldUpdate = true;
                            this.setState(fakeState);
                        } else {
                            initialized  = true;
                        }

                        return buildUpdatedViewPromise(this);
                    },
                    state => {
                        this.state = state;
                    });

            this.__propsConsumer = propsConsumer;
            this.__instance = instance;

            if (getChildInjection) {
                this.__getChildInjection = getChildInjection;
            }
        }

        componentWillMount() {
            this.props = mixPropsWithContext(this.props, this.context);
            this.__propsConsumer(this.props);
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
            this.__propsConsumer(undefined);
        }

        componentWillReceiveProps(nextProps) {
            this.props = mixPropsWithContext(nextProps, this.context);
            this.__propsConsumer(this.props);
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
    };

    return customClass;
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

function buildUpdatedViewPromise(infernoComponent) {
    let done = false;

    return new Promise(resolve => {
        if (!done) {
            infernoComponent.__resolveRenderingDone = () => {
                infernoComponent.__resolveRenderingDone = null;
                resolve(true);
            };

            done = true;
        } else {
            resolve(true);
        }
    });
}