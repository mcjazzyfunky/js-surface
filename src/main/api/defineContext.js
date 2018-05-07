import createElement from './createElement';
import validateContextConfig from '../internal/validation/validateContextConfig';
import printError from '../internal/helper/printError';
import React from 'react';

export default function defineContext(config) {
  const error = validateContextConfig(config);

  if (error) {
    const errorMsg = prettifyErrorMsg(error.message, config);

    printError(errorMsg);
    throw new TypeError(errorMsg);
  }

  const
    internalContext = React.createContext(config.defaultValue),
    internalProvider = internalContext.Provider,
    internalConsumer = internalContext.Consumer,

    Provider = function (...args) {
      return createElement(Provider, ...args);
    },

    Consumer = (...args) => {
      return createElement(Consumer, ...args);
    };


  Object.defineProperty(Provider, '__internalType', {
    enumerable: false,
    value: internalProvider
  });

  Object.defineProperty(Consumer, '__internalType', {
    enumerable: false,
    value: internalConsumer
  });

  Object.defineProperty(Consumer, '__internalIsConsumer', {
    enumerable: false,
    value: true
  });

  const ret = { Provider, Consumer };

  Object.defineProperty(ret, '__internalContext', {
    enumerable: false,
    value: internalContext,
  });

  return Object.freeze(ret);
}

function prettifyErrorMsg(errorMsg, config) {
  return config && typeof config === 'object'
    && typeof config.displayName === 'string'
    && config.displayName.trim().length > 0
    ? '[defineContext] Invalid configuration for context '
      + `"${config.displayName}": ${errorMsg} `
    : `[defineContext] Invalid context configuration: ${errorMsg}`;
}
