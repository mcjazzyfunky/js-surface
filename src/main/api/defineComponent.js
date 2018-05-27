import validateComponentConfig from '../internal/validation/validateComponentConfig';
import validateProperty from '../internal/validation/validateProperty';
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

  const normalizedConfig = { ...config };

  if (typeof config.main === 'function') {
    if (typeof config.main.normalizeComponent === 'function') {
      normalizedConfig.main = config.main.normalizeComponent(config);
    } else {
      normalizedConfig.main = config.main(config);
    }
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
  return config.main.kind === 'basic'
    ? deriveSimpleComponent(config)
    : deriveAdvancedComponent(config);
}

function deriveSimpleComponent(config) {
  const
    convertedConfig = convertConfig(config),
    ret = props => convertNode(config.main.render(normalizeProps(props)));

  Object.assign(ret, convertedConfig);
  return ret;
}

function deriveAdvancedComponent(config) {
  // config is already normalized

  const convertedConfig = convertConfig(config);

  class Component extends React.Component {
    constructor(props) {
      super(props);

      this.__meta = config;
      this.__isInitialized = false;
      this.__handleError = null;
      this.__callbacksWhenBeforeUpate = [];

      const
        getProps = () => normalizeProps(!this.__isInitialized ? props : this.props),
        getState = () => this.state,

        updateState = (updater, callback) => {
          if (updater) { 
            if (!this.__isInitialized) {
              const stateUpdates =
                typeof updater === 'object'
                  ? updater
                  : updater(this.state);

              this.state = Object.assign(this.state || {}, stateUpdates);

              if (callback) {
                callback();
              }
            } else {
              this.setState(updater, callback);
            }
          }
        },

        forceUpdate = this.forceUpdate.bind(this);

      const result = config.main.init(getProps, getState, updateState, forceUpdate);

      this.componentDidMount = () => {
        this.__isInitialized = true;

        if (result.afterUpdate) {
          result.afterUpdate(null, null);
        }
      };

      if (result.afterUpdate) {
        this.componentDidUpdate = (prevProps, prevState) => {
          result.afterUpdate(normalizeProps(prevProps), prevState);
        };
      }

      if (result.finalize) {
        this.componentWillUnmount = () => {
          result.finalize();
        };
      }

      this.__handleError = result.handleError || null;

      if (result.needsUpdate) {
        this.shouldComponentUpdate = (nextProps, nextState) => {
          return result.needsUpdate(normalizeProps(nextProps), nextState);
        };
      }

      this.render = () => convertNode(result.render());

      if (config.methods) {
        for (const operationName of config.methods) {
          Component.prototype[operationName] = function (...args) {
            return result.callMethod(operationName, args);
          };
        }
      }

      if (this.__callbacksWhenBeforeUpate.length > 0) {
        const callbacks = this.__callbacksWhenBeforeUpate;
        
        this.__callbacksWhenBeforeUpate = [];

        for (let i = 0; i < callbacks.length; ++i) {
          callbacks[i](this.props, this.state);
        }
      }
    }
  }
  
  if (config.main.deriveStateFromProps) {
    Component.getDerivedStateFromProps = (props, state) => {
      return config.main.deriveStateFromProps(normalizeProps(props), state);
    };
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

  ret.propTypes = {
    '*': props => {
      let result = null;

      const
        messages = [],
        normalizedProps = normalizeProps(props);

      if (config.properties) {
        const propNames = Object.keys(config.properties);

        for (let i = 0; i < propNames.length; ++i) {
          const
            propName = propNames[i],
            propValue = normalizedProps[propName],
            propConfig = config.properties[propName],
            type = propConfig.type || null,
            constraint = propConfig.constraint || null,
            nullable = propConfig.nullable === undefined ? true : propConfig.nullable,
            result = validateProperty(propValue, propName, type, nullable, constraint);

          if (result) {
            messages.push(result.message);
          }
        }
      }

      if (config.validate) {
        const error = config.validate(normalizedProps);

        if (error) {
          messages.push(error instanceof Error ? error.message : String(error));
        }
      }

      if (messages.length === 1) {
        result = new Error(messages[0]);
      } else if (messages.length > 1) {
        result = new Error(`\n- ${messages.join('\n- ')}`);
      }

      return result;
    }
  };

  return ret;
}

// TODO
function normalizeProps(props) {
  let ret = props;

  if (props
    && 'children' in ret
    && props.children !== null
    && !(Array.isArray(props.children))) {
   
    ret = { ...props };

    delete ret.children;

    if (props.children) {
      ret.children = [props.children];
    }
  }

  return ret;
}