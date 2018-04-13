import Dio from 'dio.js';
import createElement from 'js-hyperscript/dio';
import adaptIsElementFunction from '../../adaption/adaptIsElementFunction';
import adaptDefineComponentFunction from '../../adaption/adaptDefineComponentFunction';
import adaptMountFunction from '../../adaption/adaptMountFunction';
import createPropsAdjuster from '../../helper/createPropsAdjuster';

const
    Adapter = Object.freeze({
        name: 'dio',

        api: {
            Dio,
            Surface: null // will be set later
        }
    }),

    defineComponent = adaptDefineComponentFunction({
        createComponentType,
        createElement,
        Adapter
    }),

    isElement = adaptIsElementFunction({
        isElement: Dio.isValidElement
    }),

    mount = adaptMountFunction({
        mountFunction: Dio.render,
        unmountFunction: Dio.unmountComponentAtNode,
        isElement: Dio.isValidElement
    }),

    createContext = Dio.createContext,
    Fragment = Dio.Fragment,

    Surface = {
        createContext,
        createElement,
        defineComponent,
        isElement,
        mount,
        Adapter,
        Fragment,
    };

Adapter.api.Surface = Surface;
Object.freeze(Adapter.api);
Object.freeze(Surface);

export default Surface;

export {
    createContext,
    createElement,
    defineComponent,
    isElement,
    mount,
    Adapter,
    Fragment
};

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

    class Component extends Dio.Component {
        constructor(props) {
            super(props);

            this.displayName = config.displayName;

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
                    } else {
                        this.forceUpdate(callback);
                    }
                };

            this.__isInitialized = false;
            this.__callbacksWhenDidMount = null;

            const result = config.init(props, refresh, updateState);

            this.__receiveProps = result.receiveProps || null;
            this.__finalize = result.finalize || null;
            this.__callMethod = result.callMethod || null;
            this.__handleError = result.handleError || null;
            this.__render = result.render;
        }

        shouldComponentUpdate() {
            return false;
        }

        // This is not working
       
        /*
        set props(props) {console.log('xxxxx', config.displayName, props)
            if (this.__receiveProps) {
                this.__receiveProps(props);
            }
            
            this.__props = props;
        }

        get props() {
            return this.__props;
        }
        */

        componentWillReceiveProps(nextProps) {
            if (this.__receiveProps) {
                this.__receiveProps(nextProps);
            }
        }

        componentDidMount() {
            this.__isInitialized = true;
    
            const callbacks = this.__callbacksWhenDidMount;

            if (callbacks) {
                this.__callbacksWhenDidMount = null;
    
                for (let i = 0; i < callbacks.length; ++i) {
                    callbacks[i]();
                }
            }
        }

        componentWillUnmount() {
            if (this.__finalize) {
                this.__finalize();
            }
        }

        render() {
            return this.__render(this.props, this.state);
        }
    }

    if (config.childContext) {
        Component.prototype.getChildContext = function () {
            return this.__childContext;
        };
    }

    if (config.methods) {
        for (const operationName of config.methods) {
            Component.prototype[operationName] = function (...args) {
                return this.__callMethod(operationName, args);
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