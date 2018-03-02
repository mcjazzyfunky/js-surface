import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface'; 

import { Component } from 'js-surface/common';

const ErrorTrigger = defineComponent({ 
    displayName: 'ErrorTrigger',

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = { errorMsg: null };
        }

        simulateError(errorMsg = 'Simulated error') {
            console.log('Triggering error...');
            this.setState({ errorMsg });
        }

        onClick() {
            this.simulateError();
        }

        render() {
            if (this.state.errorMsg) {
                throw new Error(this.state.errorMsg);
            } else {
                return h('button',
                    { className: 'btn', onClick: () => this.onClick() },
                    'Trigger error');
            }
        }
    }
});

const ErrorBoundary = defineComponent({
    displayName: 'ErrorBoundary',

    isErrorBoundary: true,

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                error: null,
                errorInfo: null
            };       
        }

        componentDidCatch(error, errorInfo) {
            this.setState({ error, errorInfo });
        }

        render() {
            let ret = null;

            if (!this.state.error) {
                ret = ErrorTrigger();
            } else {
                ret = h('div', null,
                    'Catched error: ' + this.state.error.message);
            }

            return ret;
        }
    }
});

mount(ErrorBoundary(), 'main-content');
