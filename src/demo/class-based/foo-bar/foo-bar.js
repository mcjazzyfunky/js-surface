import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

import { Component } from 'js-surface/common';

const App = defineComponent({
    displayName: 'App',

    main: class extends Component {
        constructor(props) {
            super(props);
            this.interval = null;
            this.showFoo = false;
        }

        componentDidMount() {
            this.interval = setInterval(() => this.forceUpdate(), 1000);
        }
    
        componentWillUnmount() {
            clearInterval(this.interval);
        }

        render() {
            this.showFoo = !this.showFoo;

            return this.showFoo
                ? h('header', { ref: this.callback.bind(this, 'Foo') }, 'Foo')
                : h('header', { ref: this.callback.bind(this, 'Bar') }, 'Bar');
        }

        callback(type, ref, previous) {
            console.log(`Callback function invoked - ${type} "ref":`, ref, previous);
        }
    }
});

mount(App(), document.getElementById('main-content'));
