import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';


const SimpleCounter = defineComponent({
    displayName: 'SimpleCounter',

    properties: {
        label: {
            type: String,
            defaultValue: 'Counter:'
        },

        initialValue: {
            type: Number,
            defaultValue: 0
        }
    },

    init(updateView) {
        let
            props = null,
            counterValue = null;
        
        const
            incrementCounter = n => {
                counterValue += n;
                updateView(render());
            },

            render = () => {
                return (
                    h('div.simple-counter',
                        h('label.simple-counter-label.btn',
                            props.label),
                        h('button.simple-counter-decrease-button.btn.btn-default',
                            { onClick: () => incrementCounter(-1) },
                            '-'),
                        h('div.simple-counter-value.btn',
                            counterValue),
                        h('button.simple-counter-increase-button.btn.btn-default',
                            { onClick: () => incrementCounter(1) },
                            '+'))
                );
            };

        return {
            setProps(nextProps) {
                props = nextProps;
                
                if (counterValue === null) {
                    counterValue = props.initialValue;
                }

                updateView(render());
            }
        };
    },
});

mount(SimpleCounter({ initialValue: 100 }), 'main-content');
