import validateComponentConfig from '../internal/validation/validateComponentConfig';
import printError from '../internal/helper/printError';
import createElement from './createElement';
import convertNode from '../internal/conversion/convertNode';

import React from 'react';

export default function defineComponent(config) {
  const error = validateComponentConfig(config);

  if (error) {
    const errorMsg = prettifyErrorMsg(error.message, config);

    printError(errorMsg);
    throw new TypeError(errorMsg);
  }

  const dioComponentClass = deriveComponent(config);

  const ret = (...args) => {
    return createElement(ret, ...args);
  };

  Object.defineProperty(ret, '__internalType', {
    enumerable: false,
    value: dioComponentClass
  });

  ret.meta = { ...config };

  if (typeof ret.meta.main !== 'function') {
    ret.meta.main = ret.meta.main.normalizeComponent(config);
  }

  Object.freeze(ret.meta);
  Object.freeze(ret);

  return ret;
}

function prettifyErrorMsg(errorMsg, config) {
  return config && typeof config === 'object'
    && typeof config.displayName === 'string'
    && config.displayName.trim().length > 0
    ? '[defineComponent] Invalid configuration for component '
      + `"${config.displayName}": ${errorMsg} `
    : `[defineComponent] Invalid component configuration: ${errorMsg}`;
}

function deriveComponent(config) {
  // config is already normalized

  const convertedConfig = convertConfigToDio(config);

  let main = config.main;

  if (main && main.normalizeComponent) {
    main = main.normalizeComponent(config);
  }

  class Component extends React.Component {
    constructor(props) {
      super(props);

      const meta = {...config};
      delete meta.main;
  
      this.__meta = meta;
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

      const result = main(props, refresh, updateState);

      this.__receiveProps = result.receiveProps || null;
      this.__finalize = result.finalize || null;
      this.__callMethod = result.callMethod || null;
      this.__handleError = result.handleError || null;
      
      this.__render = (props, state) =>  convertNode(result.render(props, state));
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

function convertConfigToDio(config) {
  // config is already normalized

  const ret = {
    displayName: config.displayName,
    defaultProps: {},
  };

  ret.displayName = config.displayName;

  if (config.properties) {
    for (const propName of Object.keys(config.properties)) {
      const propCfg = config.properties[propName];

      if (propCfg.hasOwnProperty('defaultValue') && propCfg.defaultValue === undefined) {
        ret.defaultProps[propName] = undefined;
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

  return ret;
}
