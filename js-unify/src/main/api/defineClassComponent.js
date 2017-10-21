import Component from './Component';
import determineComponentMeta from '../internal/helper/determineComponentMeta';
import buildInitFunction from '../internal/helper/buildInitFunction';

import { defineStandardComponent } from 'js-surface';

export default function defineClassComponent(componentClass, meta = null) {
    if (typeof componentClass !== 'function') {
        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'componentFunction' must be a constructor function");
    } else if (!(componentClass.prototype instanceof Component)) {
        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'componentFunction' must be a class "
            + "that extends class 'Component'");
    } else if (typeof meta !== 'object') { 
        throw new Error(
            '[defineFunctionalComponent] '
            + "Second argument 'meta' must be an object, null or undefined");
    }

    let adjustedMeta;
    
    try {
        adjustedMeta =
            determineComponentMeta(meta ? meta : componentClass, false);
    } catch (error) {
        throw new Error('[defineClassComponent] ' + error.message);
    }

    const config = Object.assign(
        { init: buildInitFunction(componentClass, adjustedMeta) },
        adjustedMeta);

    return  defineStandardComponent(config);
}

