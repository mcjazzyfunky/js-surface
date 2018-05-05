import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

import { Component } from 'js-surface/common/classes';

const MountUnmount = defineComponent({
    displayName: 'MountUnmount',

    main: class extends Component {
        constructor(props) {
            super(props);

            this.__interval = null;
            this.__showFoo = true;
        }

        componentDidMount() {
            this.__interval = setInterval(() => {
                this.__showFoo = !this.__showFoo;
                this.forceUpdate();
            }, 3000);
        }

        componentWillUnmount() {
            clearInterval(this.__interval);
            this.__interval = null;
        }

        render() {
            return this.__showFoo
                ? ComponentA({ ref: this.refCallback.bind(this, 'ComponentA') })
                : ComponentB({ ref: this.refCallback.bind(this, 'ComponentB')});
        }

        refCallback(type, ref) {
            console.log(`Invoked ref callback - ${type}: `, String(ref));
        }
    }
});

const ComponentA = defineComponent({
    displayName: 'ComponentA',

    main: class extends Component {
        componentDidMount() {
            console.log('Did mount ComponentA...');
        }

        componentWillUnmount() {
            console.log('Will unmount ComponentA...');
        }

        render() {
            return h('div', null,
                ' - - - ComponentA - - - ');
        }
    }
});

const ComponentB = defineComponent({
    displayName: 'ComponentB',

    main: class extends Component {
        onDidMount() {
            console.log('Did mount ComponentB..');
        }

        onWillUnmount() {
            console.log('Will unmount ComponentB...');
        }

        render() {
            return h('div', null,
                ' - - - ComponentB - - - ');
        }
    }
});

mount(MountUnmount(), 'main-content');
