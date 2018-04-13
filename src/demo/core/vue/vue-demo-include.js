import {
    createElement as h,
    defineComponent
} from 'js-surface';

import { Spec } from 'js-spec';

import Vue from 'vue';

document.getElementById('main-content').innerHTML = '<div><vue-demo/></div>';

// ==============================================
// js-surface components
// ==============================================

const SurfaceButton = defineComponent({
    displayName: 'SurfaceButton',

    properties: {
        text: {
            type: String,
            nullable: true,
            defaultValue: null
        },

        x: {
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
    },

    render(props) {
        return (
            h('button',
                {
                    className: 'btn btn ' + String(props.class),
                    onClick: props.onClick
                },
                props.text)
        );
    }
});

const SurfaceCounter = defineComponent({
    displayName: 'Counter',

    properties: {
        initialValue: {
            type: Number,
            constraint: Spec.integer,
            defaultValue: 0
        }
    },

    methods: ['reset'],

    init(updateView) {
        let counterValue = 0;

        const 
            incrementCounter = n => {
                counterValue += n;
                updateView(render());
            },

            render = () => {
                return (
                    h('span', null,
                        SurfaceButton(
                            {
                                className: 'btn-primary',
                                text: '-',
                                onClick: () => incrementCounter(-1)
                            }),
                        h('span', null,
                            ` ${counterValue} `),
                        SurfaceButton(
                            {
                                className: 'btn-primary',
                                text: '+',
                                onClick: () => incrementCounter(1)
                            }))
                );
            };

        return {
            receiveProps(props) {
                if (props === null) {
                    counterValue = props.initialValue;                    
                }

                updateView(render());
            },

            callMethod(name, args) {
                if (name === 'reset') {
                    const n = args[0];

                    counterValue = n;
                    updateView(render());
                }
            }
        };
    }
});

// ==============================================
// Vue components 
// ==============================================

Vue.component('surface-button', SurfaceButton.type);
Vue.component('surface-counter', SurfaceCounter.type);

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
        </div>
    `
});

new Vue({
    el: '#main-content'
});
