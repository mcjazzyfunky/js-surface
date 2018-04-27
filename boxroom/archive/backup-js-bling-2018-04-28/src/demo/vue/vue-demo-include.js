import {
    component,
    createElement as h,
    mount,
    Component
} from 'js-bling';

import { Spec } from 'js-spec';

import Vue from 'vue';

document.getElementById('main-content').innerHTML = '<div><vue-demo/></div>';

// ==============================================
// jsBling components
// ==============================================

const BlingButton =
    component({
        displayName: 'BlingButton',

        properties: {
            text: {
                type: String,
                nullable: true,
                defaultValue: null
            },

            className: {
                type: String,
                nullable: true,
                defaultValue: null
            },

            onClick: {
                type: Function,
                nullable: true,
                defaultValue: null
            }
        }
    },
    function (props) {
        return (
            h('button', 
                {
                    className: 'btn ' + String(props.class),
                    onClick: props.onClick
                },
                props.text)
        );
    })
    .factory;

const BlingCounter =
    component({
        displayName: 'Counter',

        properties: {
            initialValue: {
                type: Number,
                constraint: Spec.integer,
                defaultValue: 0
            }
        },

        operations: ['reset'],
    },
    class extends Component {
        constructor(props) {
            super(props);

            this.state = { counterValue: props.initialValue };
        }

        incrementCounter(delta) {
            this.setState({
                counterValue: this.state.counterValue + delta
            });
        }

        reset(value = 0) {
            this.setState({ counterValue: value });
        }
        
        render() {
            return (
                h('span', null,
                    BlingButton(
                        {
                            className: 'btn-primary',
                            text: '-',
                            onClick: () => this.incrementCounter(-1)
                        },
                        '-'),
                    h('span', null,
                        ` ${this.state.counterValue} `),
                    BlingButton(
                        {
                            className: 'btn-primary',
                            text: '+',
                            onClick: () => this.incrementCounter(1)
                        }))
            );
        }
    })
    .factory;

const BlingClock =
    component({
        displayName: 'BlingClock',

        properties: {
            headline: {
                type: String,
                defaultValue: 'Current time' 
            },

            onChange: {
                type: Function,
                nullable: true,
                defaultValue: null
            }
        }
    },
    class extends Component {
        constructor(props) {
            super(props);
            this.interval = null;
            this.updateTime(new Date());
        }

        updateTime(dateTime) {
            this.state = { time: dateTime.toLocaleTimeString() };

            if (this.props.onChange) {
                this.props.onChange({
                    type: 'change',
                    time: this.state.time
                });
            }
        }

        componentDidMount() {
            this.interval = setInterval(() => {
                this.updateTime(new Date());
            }, 1000);
        }

        componentWillUnmount() {
            clearInterval(this.interval);
            this.interval = null;
        }

        render() {
            return (
                h('div', null,
                    h('h3', null,
                        this.props.headline),
                    this.state.time)
            );
        }
    });

// ==============================================
// Vue portion
// ==============================================

Vue.component('bling-button', BlingButton.type);
Vue.component('bling-counter', BlingCounter.type);
Vue.component('bling-clock', BlingClock.type);

Vue.component('vue-demo', {
    methods: {
        buttonClicked() {
            alert('Thank you very much for clicking the button!');
        },

        timeChanged(event) {
            console.log('Time has changed: ' + event.time);
        },

        resetToZeroClicked() {
            this.$refs.counter.reset(0);
        },

        resetToOneHundredClicked() {
            this.$refs.counter.reset(100);
        }
    },

    template: `
        <div>
            <h3>Button demo:</h3>
            <div>
                <bling-button text="Please click me" @click="buttonClicked" />
            </div>
            <hr/>
            <h3>Counter demo:</h3>
            <div>
                <bling-button text="Set to 0" @click="resetToZeroClicked"/>
                <bling-counter caption="Counter:" ref="counter"/>
                <bling-button text="Set to 100" @click="resetToOneHundredClicked"/>
            </div>
            <hr/>
            <div>
                <bling-clock headline="Clock demo:" @change="timeChanged"/>
            </div>
        </div>
    `
});

new Vue({
    el: '#main-content'
});


