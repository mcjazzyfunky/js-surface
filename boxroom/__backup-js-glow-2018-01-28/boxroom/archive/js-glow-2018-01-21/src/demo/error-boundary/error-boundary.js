import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    mount
} from 'js-glow'; 

const ErrorTrigger = defineClassComponent({ 
    displayName: 'ErrorTrigger',

    constructor() {
        this.state = { errorMsg: null };
    },

    simulateError(errorMsg = 'Simulated error') {
        this.state = { errorMsg };
    },

    onClick() {
        this.simulateError();
    },

    render() {
        if (this.state.errorMsg) {
            throw new Error(this.state.errorMsg);
        } else {
            return h('button',
                { className: 'btn', onClick: () => this.onClick() },
                'Trigger error');
        }
    }
});

const ErrorBoundary = defineClassComponent({
    displayName: 'ErrorBoundary',

    constructor() {
        this.state = {
            error: null,
            errorInfo: null
        };       
    },

    onDidCatchError(error, errorInfo) {
        this.state = { error, errorInfo };
    },

    render() {
        let ret = null;

        if (!this.error) {
            ret = ErrorTrigger();
        } else {
            ret = h('div', 'Catched error: ' + this.error.message);
        }

        return ret;
    }
});

mount(ErrorBoundary(), 'main-content');
