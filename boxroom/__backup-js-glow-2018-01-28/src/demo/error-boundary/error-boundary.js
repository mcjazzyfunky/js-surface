import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface'; 

import { Component } from 'js-surface/addons';

const ErrorTrigger = defineComponent({ 
    displayName: 'ErrorTrigger',

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = { errorMsg: null };
        }

        simulateError(errorMsg = 'Simulated error') {
            this.state = { errorMsg };
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

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                error: null,
                errorInfo: null
            };       
        }

        onDidCatchError(error, errorInfo) {
            this.state = { error, errorInfo };
        }

        render() {
            let ret = null;

            if (!this.error) {
                ret = ErrorTrigger();
            } else {
                ret = h('div', 'Catched error: ' + this.error.message);
            }

            return ret;
        }
    }
});

mount(ErrorBoundary(), 'main-content');
