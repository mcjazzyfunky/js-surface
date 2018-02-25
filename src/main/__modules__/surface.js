import adaptDefineComponentFunction from '../adaption/adaptDefineComponentFunction';
import adaptIsElementFunction from '../adaption/adaptIsElementFunction';
import adaptMountFunction from '../adaption/adaptMountFunction';
import createPropsAdjuster from '../helper/createPropsAdjuster';

import dio from 'dio.js';

const
    dummyValidator = function validator() {},

    isElement = adaptIsElementFunction({
        isElement: dio.isValidElement
    }),

    mount = adaptMountFunction({
        mountFunction: dio.render,
        unmountFunction: dio.unmountComponentAtNode,
        isElement: dio.isValidElement
    }),

    Fragment = dio.Fragment,
    fragment = createElement.bind(null, Fragment),

    Adapter = {
        name: 'surface'
    },
    
    defineComponent = adaptDefineComponentFunction({
        createComponentType,
        createElement: dio.createElement,
        Adapter
    }),

    Surface = {
        // core
        createElement,
        defineComponent,
        isElement,
        mount,
        Adapter,

        // add-ons
        fragment,
        Fragment
    };

Adapter.api = Object.freeze({
    Surface
});

Object.freeze(Adapter.api);

export default Surface;

export {
    // core
    createElement,
    defineComponent,
    isElement,
    mount,
    Adapter,

    // addons
    fragment,
    Fragment
};

// --- locals -------------------------------------------------------

function createElement(...args) {
    const firstArg = args[0];

    if (firstArg === null) {
        args[0] = dio.Fragment;
    } else if (firstArg && firstArg.type && typeof firstArg.type === 'function') {
        args[0] = firstArg.type;
    }

    return dio.createElement.apply(null, args);
}

function convertConfig(config) {
    // config is already normalized

    const ret = {
        displayName: config.displayName,
        defaultProps: {},
        propTypes: {},
        
        // contextTypes will be handled by wrapper component
        // (=> higher-order component)
        contextTypes: null,
        childContextTypes: null
    };

    ret.displayName = config.displayName;

    if (config.properties) {
        for (const propName of Object.keys(config.properties)) {
            const propCfg = config.properties[propName];

            ret.propTypes[propName] = dummyValidator;

            if (propCfg.hasOwnProperty('defaultValue') && propCfg.defaultValue === undefined) {
                ret.defaultProps[propName] = undefined; // TODO?
            } else if (propCfg.defaultValue !== undefined) {
                ret.defaultProps[propName] = propCfg.defaultValue;
            } else if (propCfg.getDefaultValue) {
                Object.defineProperty(ret.defaultProps, propName, {
                    enumerable: true,

                    get: () => propCfg.getDefaultValue()
                }); 
            }
        }
    }

    if (config.childContext) {
        ret.childContextTypes = {};

        for (const key of config.childContext) {
            ret.childContextTypes[key] = dummyValidator;
        }
    }

    return ret;
}

function createComponentType(config) {
    // config is already normalized

    let ret,
        injectableProperties = null;

    const propsAdjuster = createPropsAdjuster(config);

    if (config.properties) {
        for (const key of Object.keys(config.properties)) {
            if (config.properties[key].inject === true) {
                injectableProperties = injectableProperties || [];
                injectableProperties.push(key);
            }
        }
    }

    if (config.render) {
        if (injectableProperties) {
            const derivedComponent = config.render.bind(null);

            derivedComponent.displayName = config.displayName;

            ret = (props, context) => {
                const ret = createElement(derivedComponent, 
                    propsAdjuster(mergePropsWithContext(props, context, config), true));

                return ret;
            };

            ret.displayName = config.displayName + '-wrapper';
        } else {
            ret = props => config.render(propsAdjuster(props, config));
        }
    } else {
        if (injectableProperties) {
            const derivedComponent = createComponentClass(config);

            ret = (props, context) => {
                return createElement(derivedComponent, 
                    propsAdjuster(mergePropsWithContext(props, context, config), true));
            };

            ret.displayName = config.displayName + '-wrapper';
        } else {
            ret = createComponentClass(config);
        }
    }

    if (injectableProperties) {
        ret.contextTypes = {};
        
        for (const key of injectableProperties) {
            ret.contextTypes[key] = dummyValidator;
        }
    }

    return ret;
}

function mergePropsWithContext(props, context) {
    let ret = null;

    props = props || {};
    context = context || {};
    
    const contextKeys = Object.keys(context);

    for (let i = 0; i < contextKeys.length; ++i) {
        const
            contextKey = contextKeys[i],
            contextValue = context[contextKey];

        if (contextValue !== undefined && props[contextKey] === undefined) {
            if (ret === null) {
                ret = Object.assign({}, props);
            }

            ret[contextKey] = contextValue;
        }
    }

    if (ret === null) {
        ret = props;
    }

    return ret;
}


function createComponentClass(config) {
    // config is already normalized

    class Component extends dio.Component {
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

    Object.assign(Component, convertConfig(config));


    return Component;
}

