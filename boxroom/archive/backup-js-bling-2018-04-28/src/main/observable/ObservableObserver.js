let symbolObservable =
    typeof Symbol === 'function' && Symbol.observable
        ? Symbol.observable
        : '@@observable';

export default class ObservableObserver {
    constructor() {
        this.__observers = [];

        this.__observable = {
            subscribe: this.subscribe.bind(this),
            [symbolObservable]: () => this.observable
        };
    }

    subscribe(subscriber) {
        const normalizedSubscriber = normalizeSubscriber(subscriber);
        
        this.__observers.push(normalizedSubscriber);

        let closed = false;

        return () => ({
            unsubscribe() {
                if (!closed) {
                    this.__subscriber = this.__observers.filter(
                        it => it !== normalizedSubscriber);

                    closed = true;
                }
            },

            get closed() {
                return closed;
            }
        });
    }

    next(value) {
        for (let i = 0; i < this.__observers.length; ++i) {
            this.__observers[i].next(value);
        }
    }
    
    error(err) {
        const observers = this.__observers;
        
        this.__observers = [];

        for (let i = 0; i < observers.length; ++i) {
            observers[i].error(err);
        }
    }

    complete() {
        const observers = this.__observers;
        
        this.__observers = [];

        for (let i = 0; i < observers.length; ++i) {
            observers[i].complete();
        }
    }

    toObservable() {
        return this.__observable;
    }

    [symbolObservable]() {
        return this.__observable;
    }
}

function noop() {
}

function normalizeSubscriber(subscriber) {
    return {
        next: typeof subscriber.next === 'function'
            ? subscriber.next.bind(subscriber)
            : noop(),
        
        error: typeof subscriber.error === 'function'
            ? subscriber.error.bind(subscriber)
            : noop(),

        complete: typeof subscriber.complete === 'function'
            ? subscriber.complete.bind(subscriber)
            : noop()
    };
}