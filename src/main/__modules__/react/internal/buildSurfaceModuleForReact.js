import React from 'react';
import createElement from 'js-hyperscript/react';
import adaptIsElementFunction from '../../../adaption/adaptIsElementFunction';
import adaptDefineComponentFunction from '../../../adaption/adaptDefineComponentFunction';
import createPropsAdjuster from '../../../helper/createPropsAdjuster';


export default function buildSurfaceModuleForReact({ adapterName, api = null, extras = null }) {
    const
        Adapter = Object.freeze({
            name: adapterName,
            api: {
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

        createContext = React.createContext,
        Fragment = React.Fragment,

        Surface = {
            createContext,
            createElement,
            defineComponent,
            isElement,
            Adapter,
            Fragment,
            ...extras
        };

    Adapter.api.Surface = Surface;
    Object.freeze(Adapter.api);
    Object.freeze(Surface);

    return Surface;
}

// ------------------------------------------------------------------


function createComponentType(config) {
    // config is already normalized

    let ret;

    const propsAdjuster = createPropsAdjuster(config);

    if (config.render) {
        ret = props => config.render(propsAdjuster(props, config));
        ret.displayName = config.displayName;
    } else {
        ret = deriveReactComponent(config);
    }

    return ret;
}

function deriveReactComponent(config) {
    // config is already normalized

    const convertedConfig = convertConfigToReactLike(config);

    class Component extends React.Component {
        constructor(props) {
            super(props);

            const
                updateState = (updater, callback) => {
                    if (!this.__isInitialized) {
                        this.state = updater();

                        if (callback) {
                            callback(this.state);
                        }
                    } else {
                        this.setState(updater, !callback ? null : () => {
                            callback(this.state);
                        });
                    }
                },

                refresh = callback => {
                    if (!this.__isInitialized) {
                        if (callback) {
                            if (this.__callbacksWhenDidMount === null) {
                                this.__callbacksWhenDidMount = [callback];
                            } else {
                                this.__callbacksWhenDidMount.push(callback);
                            }
                        }
                    } else if (!this.__supressUpdates) {
                        this.__supressUpdates = true;
                        this.forceUpdate(callback);
                    }
                };

            this.__isInitialized = false;
            this.__supressUpdates = false;
            this.__shouldRefresh = false;
            this.__callbacksWhenDidMount = null;
            
            const result = config.init(props, refresh, updateState);

            this.__receiveProps = result.receiveProps || null;
            this.__finalize = result.finalize || null;
            this.__runOperation = result.runOperation || null;
            this.__handleError = result.handleError || null;
            this.__render = result.render;
        }

        shouldComponentUpdate() {
            return this.__shouldRefresh;
        }

        set props(props) {
            if (this.__receiveProps) {
                this.__receiveProps(props);
            }
            
            this.__props = props;
        }

        get props() {
            return this.__props;
        }

        componentDidMount() {
            this.__isInitialized = true;
            this.__supressUpdates = false;
    
            const callbacks = this.__callbacksWhenDidMount;

            if (callbacks) {
                this.__callbacksWhenDidMount = null;
    
                for (let i = 0; i < callbacks.length; ++i) {
                    callbacks[i]();
                }
            }
        }

        componentDidUpdate() {
            this.__supressUpdates = false;
        }

        componentWillUnmount() {
            if (this.__finalize) {
                this.__finalize();
            }
        }

        render() {
            this.__shouldRefresh = false;
            return this.__render(this.props, this.state);
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
