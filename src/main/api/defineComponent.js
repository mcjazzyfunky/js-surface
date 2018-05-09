import validateComponentConfig from '../internal/validation/validateComponentConfig';
import printError from '../internal/helper/printError';
import createElement from './createElement';
import convertNode from '../internal/conversion/convertNode';

import React from 'react';

const isReact= React.Fragment === Symbol.for('react.fragment');

export default function defineComponent(config) {
  const error = validateComponentConfig(config);

  if (error) {
    const errorMsg = prettifyErrorMsg(error.message, config);

    printError(errorMsg);
    throw new TypeError(errorMsg);
  }

  const normalizedConfig = { ...config };

  if (typeof config.main.normalizeComponent === 'function') {
    normalizedConfig.main = config.main.normalizeComponent(config);
  }

  let internalType = deriveComponent(normalizedConfig);

  if (config.properties) {
    const
      propNames = Object.keys(config.properties),
      injectedContexts = [],
      contextInfoPairs = [];

    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig = config.properties[propName],
        inject = propConfig.inject;

      if (inject) {
        let index = injectedContexts.indexOf(inject);

        if (index === -1) {
          index = injectedContexts.length;
          injectedContexts.push(inject);
        }

        contextInfoPairs.push([propName, index]);
      }
    }

    if (injectedContexts.length > 0) {
      const innerComponent = internalType;

      internalType = class CustomComponent extends React.Component {
        constructor(props) {
          super(props);

          this.__meta = normalizedConfig;
        }

        render() {
          const
            contextValues = new Array(injectedContexts.length),
            adjustedProps = { ...this.props };

          let node = null;

          for (let i = 0; i < injectedContexts.length; ++i) {
            if (i === 0) {
              node = React.createElement(injectedContexts[0].Consumer.__internal_type, null, value => {
                contextValues[0] = value;

                for (let j = 0; j < contextInfoPairs.length; ++j) {
                  let [propName, contextIndex] = contextInfoPairs[i];

                  if (this.props[propName] === undefined) {
                    adjustedProps[propName] = contextValues[contextIndex];
                  }
                }

                return React.createElement(innerComponent, adjustedProps);
              });
            } else {
              const currNode = node;
              
              node = React.createElement(injectedContexts[i].Consumer, null, value => {
                contextValues[i] = value;

                return currNode;
              });
            }
          }

          return node;
        }
      };

      internalType.displayName = config.displayName + '-wrap';

      if (config.methods) {
        for (let i = 0; i < config.methods.length; ++i) {
          const methodName = config.methods[i];

          internalType.prototype[methodName] =
            (...args) => innerComponent[methodName](...args);
        }
      }
    }
  }

  const ret = (...args) => {
    return createElement(ret, ...args);
  };

  Object.defineProperty(ret, '__internal_type', {
    enumerable: false,
    value: internalType
  });

  ret.meta = normalizedConfig;

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

  const convertedConfig = convertConfig(config);

  let main = config.main;

  class Component extends React.Component {
    constructor(props) {
      super(props);

      this.__meta = config;
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

        refresh = (beforeUpdateCallback, afterUpdateCallback) => {
          if (!this.__isInitialized) {
            if (afterUpdateCallback) {
              if (this.__callbacksWhenDidMount === null) {
                this.__callbacksWhenDidMount = [afterUpdateCallback];
              } else {
                this.__callbacksWhenDidMount.push(afterUpdateCallback);
              }
            }
          } else {
            this.forceUpdate(afterUpdateCallback);
          }
        };

      this.__props = props;
      this.__isInitialized = false;
      this.__callbacksWhenDidMount = null;
      this.__callbacksWhenBeforeUpate = [];

      const result = main(props, refresh, updateState);

      this.__receiveProps = result.receiveProps || null;
      this.__finalize = result.finalize || null;
      this.__callMethod = result.callMethod || null;
      this.__handleError = result.handleError || null;
      
      this.__render = (props, state) =>  convertNode(result.render(props, state));

      if (isReact) {
        Object.defineProperty(this, 'props', {
          enumerable: true, 
          
          set: nextProps => {
            if (nextProps !== this.__props) {
              if (this.__receiveProps) {
                this.__receiveProps(nextProps);
              }

              this.__props = nextProps;
            }
          },
          
          get: () => this.__props
        });
      } else {
        this.componentWillReceiveProps = nextProps => {
          if (this.__receiveProps) {
            this.__receiveProps(nextProps);
          }
        };
      }
    }

    shouldComponentUpdate() {
      return false;
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

    componentDidUpdate(/* prevProps, prevState, snapshot */) {
    }

    componentWillUnmount() {
      if (this.__finalize) {
        this.__finalize();
      }
    }

    render() {
      const ret = this.__render(this.props, this.state);

      if (!isReact) {
        this.__handleCallbacksWhenBeforeUpdate();
      }

      return ret;
    }

    // Just React
    getSnapshotBeforeUpdate() {
      if (isReact) {
        this.__handleCallbacksWhenBeforeUpdate();
      }

      return null;
    }

    __handleCallbacksWhenBeforeUpdate() {
      if (this.__callbacksWhenBeforeUpate.length > 0) {
        const callbacks = this.__callbacksWhenBeforeUpate;
        
        this.__callbacksWhenBeforeUpate = [];

        for (let i = 0; i < callbacks.length; ++i) {
          callbacks[i](this.props, this.state);
        }
      }
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

function convertConfig(config) {
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