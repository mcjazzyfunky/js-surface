import shapeOfAdaptReactLikeRenderEngineConfig from '../shape/shapeOfAdaptReactLikeRenderEngineConfig';

import { Spec } from 'js-spec';

import adaptRenderEngine from '../adaption/adaptRenderEngine';

const
    returnNull = () => null,
    fakeState = Object.freeze({});

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
                // Sorry for that evil eval hack - do not know how to
                // ExtCustomComponent's class name otherwise
                // (Babel makes ExtCustomComponent.name read-only).
                const ExtCustomComponent = eval(
                    `(function ${config.displayName} (...args) {
                        CustomComponent.call(this, args, config);
                    })`);

                ExtCustomComponent.prototype = Object.create(CustomComponent.prototype);
                ExtCustomComponent.displayName = config.displayName;

                if (config.publicMethods) {
                    for (let key of Object.keys(config.publicMethods)) {
                        ExtCustomComponent.prototype[key] = function (...args) {
                            return config.publicMethods[key].apply(this.__instance, args);
                        };
                    }
                }

                if (config.childInjections) {
                    ExtCustomComponent.childContextTypes = {};

                    for (let key of Object.keys(config.childInjections)) {
                        ExtCustomComponent.childContextTypes[key] = returnNull;
                    }

                    ExtCustomComponent.prototype.getChildContext = function() {
                        // TODO - call this.__provideChildInjections each time and make sure
                        // that the values of the result did not change,
                        // as changing the child injection is not supported currently
                        let ret = this.__childContext;

                        if (!ret) {
                            this.__childContext = this.__provideChildInjections();
                            ret = this.__childContext;
                        }

                        return ret;
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
                if (reactLikeConfig.renderEngineName === 'react-lite') {
                    ExtCustomComponent.vtype = 4;
                }

                const factory = createFactory(ExtCustomComponent);
                factory.component = ExtCustomComponent;
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

function defineCustomComponent(ReactLikeComponent) {
    const customClass = class extends ReactLikeComponent {
        constructor(superArgs, config) {
            super(...superArgs);

            this.__viewToRender = null;
            this.__resolveRenderingDone = null;
            this.__shouldUpdate = false;
            this.state = fakeState;

            let initialized = false;

            const
                { propsConsumer, instance, provideChildInjections } = config.init(
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
                    },
                    this);

            this.__propsConsumer = propsConsumer;
            this.__instance = instance;

            if (provideChildInjections) {
                this.__provideChildInjections = provideChildInjections;
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

function buildUpdatedViewPromise(reactComponent) {
    let done = false;

    return new Promise(resolve => {
        if (!done) {
            reactComponent.__resolveRenderingDone = () => {
                reactComponent.__resolveRenderingDone = null;
                resolve(true);
            };

            done = true;
        } else {
            resolve(true);
        }
    });
}
