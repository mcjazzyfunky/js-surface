
import React from 'react';
import createElement from 'js-hyperscript/react';
import adaptIsElementFunction from '../../adaption/adaptIsElementFunction';
import adaptDefineComponentFunction from '../../adaption/adaptDefineComponentFunction';
import createPropsAdjuster from '../../helper/createPropsAdjuster';


export default function buildSurfaceModuleForReact({ api, mount }) {
    const
        Adapter = Object.freeze({
            name: 'react',
            api: {
                React,
                ...api,
                Surface: null // will be set later
            }
        }),

        defineComponent = adaptDefineComponentFunction({
            createComponentType,
            createElement,
            Adapter
        }),

        isElement = adaptIsElementFunction({
            isElement: React.isValidElement
        }),

        fragment = createElement.bind(fragment),
        Fragment = React.Fragment,

        Surface = Object.freeze({
            // core
            createElement,
            defineComponent,
            isElement,
            mount,
            Adapter,
            // add-ons
            fragment,
            Fragment
        });

    Adapter.api.Surface = Surface;
    Object.freeze(Adapter.api);

    return Object.freeze({
        // core
        createElement,
        defineComponent,
        isElement,
        mount,
        Adapter,

        // addons
        fragment,
        Fragment
    });
}

// ------------------------------------------------------------------


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
            ret.displayName = config.displayName;
        }
    } else {
        if (injectableProperties) {
            const derivedComponent = deriveReactComponent(config);

            ret = (props, context) => {
                let mergedProps = propsAdjuster(mergePropsWithContext(props, context, config), true);

                return createElement(derivedComponent, mergedProps);
            };

            ret.displayName = config.displayName + '-wrapper';
        } else {
            ret = deriveReactComponent(config);
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

function deriveReactComponent(config) {
    // config is already normalized

    const convertedConfig = convertConfigToReactLike(config);

    class Component extends React.Component {
        constructor(props, context) {console.log(config.displayName);
            super(props, context);
            this.__view = undefined;
            this.__childContext = null;
       // }

//        componentWillMount() {
            const
                updateView = (view, childContext, callback = null) => {console.log('updateView', config.displayName)
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

        shouldComponentUpdate() {
            return this.__view !== undefined;
        }

        componentWillReceiveProps(props) {console.log('willreceiveProps', config.displayName)
            this.__setProps(props);
        }

        componentWillUnmount() {
            if (this.__close) {
                this.__close();
            }
        }

        render() {
            const view = this.__view;
            this.__view = undefined;
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



const dummyValidator = function validator() {
    return null;
};


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

    return ret;
}

function convertConfigToReactLike(config) {
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
