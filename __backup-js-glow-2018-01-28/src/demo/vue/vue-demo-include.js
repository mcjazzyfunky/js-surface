import {
    component,
    createElement as h,
    mount,
    Component
} from 'js-surface';

import { Spec } from 'js-spec';

import Vue from 'vue';

document.getElementById('main-content').innerHTML = '<div><vue-demo/></div>';

// ==============================================
// jsGlow components
// ==============================================

const GlowButton =
    component({
        displayName: 'GlowButton',

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

const GlowCounter =
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
                    GlowButton(
                        {
                            className: 'btn-primary',
                            text: '-',
                            onClick: () => this.incrementCounter(-1)
                        },
                        '-'),
                    h('span', null,
                        ` ${this.state.counterValue} `),
                    GlowButton(
                        {
                            className: 'btn-primary',
                            text: '+',
                            onClick: () => this.incrementCounter(1)
                        }))
            );
        }
    })
    .factory;

const GlowClock =
    component({
        displayName: 'GlowClock',

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

Vue.component('surface-button', GlowButton.type);
Vue.component('surface-counter', GlowCounter.type);
Vue.component('surface-clock', GlowClock.type);

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
                <surface-button text="Please click me" @click="buttonClicked" />
            </div>
            <hr/>
            <h3>Counter demo:</h3>
            <div>
                <surface-button text="Set to 0" @click="resetToZeroClicked"/>
                <surface-counter caption="Counter:" ref="counter"/>
                <surface-button text="Set to 100" @click="resetToOneHundredClicked"/>
            </div>
            <hr/>
            <div>
                <surface-clock headline="Clock demo:" @change="timeChanged"/>
            </div>
        </div>
    `
});

new Vue({
    el: '#main-content'
});


