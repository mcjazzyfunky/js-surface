import {
    createElement as h,
    mount
} from 'js-surface';

import {
    defineClassComponent
} from 'js-unify';

const App = defineClassComponent({
    displayName: 'App',

    constructor() {
        this.interval = null;
        this.showFoo = false;
    },

    onDidMount() {
        this.interval = setInterval(() => this.forceUpdate(), 1000);
    },
   
    onWillUnmount() {
        clearInterval(this.interval);
    },

    render() {
        this.showFoo = !this.showFoo;

        return this.showFoo
            ? h('header', { ref: this.callback.bind(this, 'Foo') }, 'Foo')
            : h('header', { ref: this.callback.bind(this, 'Bar') }, 'Bar');
    },

    callback(type, ref, previous) {
        console.log(`Callback function invoked - ${type} "ref":`, ref, previous);
    }
});

mount(App(), document.getElementById('main-content'));
