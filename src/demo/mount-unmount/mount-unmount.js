import {
    createElement as h,
    defineClassComponent,
    render,
    Component
} from 'js-surface';


const MountUnmount = defineClassComponent(class extends Component {
    static get displayName() {
        return 'MountUnmount';
    }

    constructor() {
        super();
        this.__interval = null;
        this.__showFoo = true;
    }


    onDidMount() {
        this.__interval = setInterval(() => {
            this.__showFoo = !this.__showFoo;
            this.refresh();
        }, 10000);
    }

    onWillUnmount() {
        clearInterval(this.__interval);
        this.__interval = null;
    }

    render() {
        return this.__showFoo
            ? Foo({ ref: this.refCallback.bind(this, 'Foo') })
            : Bar({ ref: this.refCallback.bind(this, 'Bar')});
    }

    refCallback(type, ref, prevRef) {
        console.log(`Invoked ref callback - ${type}: `, String(ref), String(prevRef));
    }
});

const Foo = defineClassComponent(class extends Component {
    static get displayName() {
        return 'Foo';
    }

    onDidMount() {
        console.log('Did mount Foo...');
    }

    onWillUnmount() {
        console.log('Will unmount Foo...');
    }

    render() {
        return h('div', ' - - - Foo - - - ');
    }
});

const Bar = defineClassComponent(class extends Component {
    static get displayName() {
        return 'Bar';
    }

    onDidMount() {
        console.log('Did mount Bar..');
    }

    onWillUnmount() {
        console.log('Will unmount Bar...');
    }

    render() {
        return h('div', ' - - - Bar - - - ');
    }
});

render(MountUnmount(), 'main-content');
