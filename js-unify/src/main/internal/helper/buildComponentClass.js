import Component from '../../api/Component';

export default function buildComponentClass(config) {
    // config is object

    class CustomComponent extends Component {
        constructor(props) {
            super(props);

            if (config.constructor) {
                config.constructor.call(this, props);
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
