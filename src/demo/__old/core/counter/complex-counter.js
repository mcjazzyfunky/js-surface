import {
  createElement as h, 
  defineComponent,
  mount 
} from 'js-surface';

import { Spec } from 'js-spec';

const CounterInfo = defineComponent({
  displayName:  'CounterInfo',

  properties: {
    value: {
      type: Number
    }
  },

  init: (_, refresh) => ({
    receiveProps() {
      refresh();
    },

    render(props) {
      return (
        h('label',
          null,
          h('b',
            null,
            props.value)));
    }
  })
});

// --------------------------------------------------------------------

const Counter = defineComponent({
  displayName: 'Counter',

  properties: {
    initialValue: {
      type: Number,
      constraint: Spec.integer,
      defaultValue: 0
    },

    onChange: {
      type: Function,
      nullable: true,
      defaultValue: null
    }
  },

  methods: ['resetCounter'],

  init(initialProps, refresh, updateState) {
    let counterValue;

    const
      setCounterValue = n => {
        counterValue = n;
  
        updateState(() => ({ counterValue }), () => {
          refresh();
        });
      },

      increaseCounter = n => {
        setCounterValue(counterValue + n);
      },

      render = () => {
        return (
          h('span',
            { className: 'counter' },
            h('button',
              {
                className: 'btn btn-default',
                onClick: () => increaseCounter(-1)
              },
              '-'),
            h('div',
              { style: { width: '30px', display: 'inline-block', textAlign: 'center' }},
              CounterInfo({ value: counterValue })),
            h('button',
              {
                className: 'btn btn-default',
                onClick: () => increaseCounter(1)
              }, 
              '+'))
        );
      };
     
    setCounterValue(0);

    return {
      render,

      callMethod(name, args) {
        if (name === 'resetCounter') {
          const [n = 0] = args;

          counterValue = n;
          refresh();
        }
      }
    };
  }
});

// --------------------------------------------------------------------

const CounterCtrl = defineComponent({
  displayName: 'CounterCtrl',

  init() {
    let counterInstance = null;

    return {
      render() {
        return (
          h('div',
            { className: 'counter-ctrl' },
            h('button',
              {
                className: 'btn btn-info',
                onClick: () => counterInstance.resetCounter(0)
              },
              'Set to 0'),
            ' ',
            Counter({ ref: it => { counterInstance = it; } }),
            ' ',
            h('button',
              {
                className: 'btn btn-info',
                onClick: () => counterInstance.resetCounter(100)
              },
              'Set to 100'))
        );
      }
    };
  }
});

mount(CounterCtrl(), 'main-content');

