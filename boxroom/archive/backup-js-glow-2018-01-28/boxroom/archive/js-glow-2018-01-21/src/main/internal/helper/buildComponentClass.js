import Component from '../../api/Component';

const baseMethodNameSet = new Set();

for (const key of Object.getOwnPropertyNames(Component.prototype)) {
    if (typeof Component.prototype[key] === 'function'
        && !key.startsWith('_') && key !== 'constructor') {

        baseMethodNameSet.add(key);
    }
}

export default function buildComponentClass(config) {
    // config is object

    const methodNameSet = new Set(baseMethodNameSet);

    for (const key of Object.keys(config)) {
        if (typeof config[key] === 'function') {
            methodNameSet.add(key);
        } else {
            methodNameSet.delete(key);
        }
    }

    const
        methodNames = Array.from(methodNameSet),
        methodCount = methodNames.length;

    class CustomComponent extends Component {
        constructor(props) {
            super(props);

            if (config.constructor) {
                config.constructor.call(this, props);
            }

            for (let i = 0; i < methodCount; ++i) {
                const
                    key = methodNames[i],
                    value = this[key];

                this[key] = value.bind(this);
            }
        }
    }

    for (const key of Object.keys(config)) {
        if (typeof config[key] === 'function' && key !== 'constructor') {
            CustomComponent.prototype[key] = config[key];
        }
    }

    return CustomComponent;
}
