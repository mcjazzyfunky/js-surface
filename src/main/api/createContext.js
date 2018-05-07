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

    Consumer.xxx = true;

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
    value: internalContext
  });

  return Object.freeze(ret);
}