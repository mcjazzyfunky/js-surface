export default class Store {
    constructor(messageClass, initialState, initialData) {
        this.__messageClass = messageClass;
        this.__state = initialState;
        this.__data = initialData;
        this.__subscribers = new Set();
        this.__dispatch = this.dispatch.bind(this);
    }

    dispatch(msg) {
        if (!(msg instanceof this.__messageClass)
            || typeof msg.apply !== 'function'
            || msg.category !== 'updates' && msg.category !== 'interactions'
            || msg.category === 'updates' && msg.apply.length !== 1
            || msg.category === 'interactions' && msg.apply.length > 1) {

            throw new Error('Invalid message type passed to store dispatch method');
        }

        if (msg.category === 'updates') {
            const newState = msg.apply(this.__state);
            this.__state = newState;

            for (let subscriber of this.__subscribers) {
                subscriber(newState);
            }
        } else {
            const newData = msg.apply({
                state: this.__state,
                data: this.__data,
                dispatch: this.__dispatch
            });

            if (newData !== undefined && newData !== null) {
                if (typeof newData === 'object') {
                    this.__data = newData;
                } else {
                    throw new Error("Invalid return value of effect messsage's apply method");
                }
            }
        }
    }

    getData() {
      return this.__data;
    }

    subscribe(subscriber) {
        this.__subscribers.add(subscriber);

        return () => {
            this.__subscribers.delete(subscriber);
        };
    }
}
