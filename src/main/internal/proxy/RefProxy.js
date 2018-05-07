export default class RefProxy {
  constructor(instance) {
    const methodNames = instance.__meta.methods;

    Object.defineProperty(this, 'props', {
      enumerable: true,
      get: () => instance.props 
    });

    if (methodNames) {
      for (let i = 0; i < methodNames.length; ++i) {
        const methodName = methodNames[i];

        this[methodName] = (...args) => {
          return instance[methodName](...args);
        };
      }
    }

    Object.freeze(this);
  }
}