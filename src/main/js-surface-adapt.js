import SUPPORTED_RENDER_ENGINES from './constant/constants';
import adaptRE from './adaption/adaptComponentSystem';

export default function adaptComponentSystem(config) {
    if (config && typeof config === 'object' && typeof config.name === 'string'
        && SUPPORTED_RENDER_ENGINES.has(config.name)) {

        throw new Error(
             "[adaptComponentSystem] Use of reserved adapter name '"
             + config.name
             + "' is not allowed");
    }

    return adaptRE(config);
}
