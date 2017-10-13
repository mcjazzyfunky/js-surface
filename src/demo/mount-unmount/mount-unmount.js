import {
    createElement as h,
    defineClassComponent,
    mount 
} from 'js-surface';


const MountUnmount = defineClassComponent({
    displayName: 'MountUnmount',

    constructor() {
        this.__interval = null;
        this.__showFoo = true;
    },


    onDidMount() {
        this.__interval = setInterval(() => {
            this.__showFoo = !this.__showFoo;
            this.forceUpdate();
        }, 3000);
    },

    onWillUnmount() {
        clearInterval(this.__interval);
        this.__interval = null;
    },

    render() {
        return this.__showFoo
            ? ComponentA({ ref: this.refCallback.bind(this, 'ComponentA') })
            : ComponentB({ ref: this.refCallback.bind(this, 'ComponentB')});
    },

    refCallback(type, ref, prevRef) {
        console.log(`Invoked ref callback - ${type}: `, String(ref), String(prevRef));
    }
});

const ComponentA = defineClassComponent({
    displayName: 'ComponentA',

    onDidMount() {
        console.log('Did mount ComponentA...');
    },

    onWillUnmount() {
        console.log('Will unmount ComponentA...');
    },

    render() {
        return h('div', ' - - - ComponentA - - - ');
    }
});

const ComponentB = defineClassComponent({
    displayName: 'ComponentB',

    onDidMount() {
        console.log('Did mount ComponentB..');
    },

    onWillUnmount() {
        console.log('Will unmount ComponentB...');
    },

    render() {
        return h('div', ' - - - ComponentB - - - ');
    }
});

mount(MountUnmount(), 'main-content');
