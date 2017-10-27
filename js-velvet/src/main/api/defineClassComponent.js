import Component from './Component';
import determineComponentMeta from '../internal/helper/determineComponentMeta';
import buildInitFunction from '../internal/helper/buildInitFunction';
import buildComponentClass from '../internal/helper/buildComponentClass';

import { defineComponent } from 'js-surface';

export default function defineClassComponent(config) {
    const
        configType = typeof config,
        configIsObject = config !== null && configType === 'object',
        configIsFunction = configType === 'function';

    if (!configIsObject
        && (!configIsFunction
            || !(config.prototype instanceof Component))) {

        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'config' must be "
            + "an object or a class that extends class 'Component'");
    }

    let meta;
    
    try {
        meta = determineComponentMeta(config, false);
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
        { init: buildInitFunction(clazz, meta) },
        meta);

    return  defineComponent(jsSurfaceConfig);
}

