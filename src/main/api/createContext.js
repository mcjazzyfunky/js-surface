import createElement from './createElement';
import dio from 'dio.js';

export default function createContext(config) {
  const
    internalContext = dio.createContext(config.defaultValue),
    internalProvider = internalContext.Provider,
    internalConsumer = internalContext.Consumer,

    Provider = function (args) {
      return createElement(Provider, ...args);
    },

    Consumer = (...args) => {
      return createElement(Consumer, ...args);
    };

  Object.defineProperty(Provider, '__internalType', {
    enumerable: false,
    get: () => internalProvider
  });

  Object.defineProperty(Consumer, '__internalType', {
    enumerable: false,
    get: () => internalConsumer
  });

  const ret = { Provider, Consumer };

  Object.defineProperty(ret, '__internalContext', {
    enumerable: false,
    get: () => internalContext
  });

  return Object.freeze(ret);
}