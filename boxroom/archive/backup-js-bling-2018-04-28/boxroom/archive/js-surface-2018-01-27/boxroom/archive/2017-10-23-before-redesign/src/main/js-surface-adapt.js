import SUPPORTED_RENDER_ENGINES from './constant/constants';
import adaptRE from './adaption/adaptRenderEngine';

export default function adaptRenderEngine(config) {
    if (config && typeof config === 'object' && typeof config.name === 'string'
        && SUPPORTED_RENDER_ENGINES.has(config.name)) {

        throw new Error(
             "[adaptRenderEngine] Use of reserved adapter name '"
             + config.name
             + "' is not allowed");
    }

    return adaptRE(config);
}
