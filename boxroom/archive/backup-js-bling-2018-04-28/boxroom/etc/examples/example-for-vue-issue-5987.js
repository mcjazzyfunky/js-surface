
import { defineComponent, mount } from 'js-surface/vue';
import { Component, Html } from 'js-surface/vue/addons';

const { button, div, hr } = Html;

const CounterButton = defineComponent({
    displayName: 'Counter',
    
    operations: ['resetCounter'],
    
    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = { counter: 0 };
        }
        
        incrementCounter() {
            this.setState({ counter: this.state.counter + 1 });
        }
        
        resetCounter() {
            this.setState({ counter: 0 });
        }
        
        render() {
            return (
                button({ id: 'counter-button', onClick: () => this.incrementCounter() },
                     'Counter: ' + this.state.counter) 
            );
        }
    }
});

const App = defineComponent({
    displayName: 'App',
    
    main: class extends Component {
        constructor(props) {
            super(props);
            
            this.counterButton = null;
        }
        
        setCounterButton(counterButton) {
            this.counterButton = counterButton;
        }
        
        resetCounterRemotely() {
            if (this.counterButton) {
                this.counterButton.resetCounter();
            }
        }
        
        render() {
            return (
                div(null,
                    CounterButton({ ref: it => this.setCounterButton(it) }),
                    hr(),
                    button({ onClick: () => this.resetCounterRemotly() },
                        'Reset counter'))
            );
        }
    }
});

// Vue.component('App', App.type);

mount(App(), 'content');

