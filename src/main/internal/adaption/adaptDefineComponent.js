import convertClassComponentConfig from '../converter/convertClassComponentConfig.js';

export default function adaptDefineComponent(
    defineFunctionalComponent, defineStandardComponent) {

    return function(config) {
        let ret;

        if (config.hasOwnProperty('constructor')) {
            ret = defineStandardComponent(convertClassComponentConfig(config));
        } else if (config.render) {
            ret = defineFunctionalComponent(config);
        } else {
            ret = defineStandardComponent(config);
        }

        return ret;
    };
}