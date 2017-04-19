import createMessageConstructors from
    '../internal/message/createMessageConstructors.js';

export default function defineMessages(config) {
      const
          baseClass = function Message() {
                throw new Error('Message class is not instantiable');
          },

          subClasses =  createMessageConstructors(config, null, baseClass);

      baseClass.toString = () => '#<Parent message class>';
      baseClass[Symbol.toStringTag] = constructor.toString;

      Object.assign(baseClass, subClasses);
      Object.freeze(baseClass);

      return baseClass;
}
