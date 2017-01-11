'use strict';

export default class EventMappers {
    /**
     * @ignore
     */
    constructor() {
        throw new Error("[EventMappers.constructor] Class EventMappers is not instantiable");
    }

    static mapChangeEvent(event) {
        if (!event || !event.target) {
            throw new TypeError("[EventMappers.mapChangeEvent] First argument 'event' is not a 'change event'");
        }

        return {
            type: 'change',
            value: event.target.value
        };
    }

    static mapInputEvent(event) {
        if (!event || !event.target) {
            throw new TypeError("[EventMappers.mapInputEvent] First argument 'event' is not an 'input event'");
        }

        return {
            type: 'input',
            value: event.target.value
        };
    }

    static mapClickEvent(event) {
        if (!event || !event.target) {
            throw new TypeError("[EventMappers.mapInputEvent] First argument 'event' is not an 'input event'");
        }

        return {
            type: 'click'
        };
    }
}
