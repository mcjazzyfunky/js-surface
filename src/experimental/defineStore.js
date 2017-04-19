import Store from '../internal/store/Store.js';

function defineStore(config) {
    const symbol = new Symbol();

    if (!config || typeof config !== 'object') {
        throw new Error("[defineStore] First argument 'config' must be an object");
    } else if (config.hasOwnProperty('init') && typeof config.init !== 'function') {
        throw new Error("[defineStore] Configuration parameter 'init' must be a function");
    }

    const
        hasUpdateActions = config.hasOwnProperty('updateActions'),
        hasCommandActions = config.hasOwnProperty('commandActions'),
        updateActions = hasUpdateActions ? config.updateAction : null,
        commandActions = hasCommandActions ? config.commandActions : null;

    if (hasUpdateActions
        && (updateActions === null || typeof updateActions !== 'object')) {

        throw new Error('[defineStore] Configuration parameter '
            + "'updateActions' must be an object");
    } else if (hasCommandActions
        && (commandActions === null || typeof commandActions !== 'object')) {

        throw new Error('[defineStore] Configuration parameter '
            + "'commandActions' must be an object");
    }

    const storeClass = function (seed) {
        Store.apply(this);
    };

    storeClass.protype = Object.create(Store.prototype);

    return storeClass;
}
