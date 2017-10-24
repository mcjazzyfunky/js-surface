import Component from './Component';
import determineComponentMeta from '../internal/helper/determineComponentMeta';
import buildInitFunction from '../internal/helper/buildInitFunction';
import buildComponentClass from '../internal/helper/buildComponentClass';

import { defineComponent } from 'js-surface';

export default function defineClassComponent(config, meta = null) {
    const
        configType = typeof config,
        configIsObject = config !== null && configType === 'object',
        configIsFunction = configType === 'function';

    if (!configIsObject
        && (!configIsFunction
            || !(config.prototype instanceof Component))) {

        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'cofig' must be "
            + "an object or a class that extends class 'Component'");
    } else if (typeof meta !== 'object') { 
        throw new Error(
            '[defineFunctionalComponent] '
            + "Second argument 'meta' must be an object, null or undefined");
    }

    let adjustedMeta;
    
    try {
        adjustedMeta =
            determineComponentMeta(meta ? meta : config, false, !!meta);
    } catch (error) {
        throw new Error('[defineClassComponent] ' + error.message);
    }

    let clazz;

    if (configIsObject && config.class) {
        clazz = config.class;
    } else if (configIsObject) {
        clazz = buildComponentClass(config);
    } else {
        clazz = config;
    }

    const jsSurfaceConfig = Object.assign(
        { init: buildInitFunction(clazz, adjustedMeta) },
        adjustedMeta);

    return  defineComponent(jsSurfaceConfig);
}

