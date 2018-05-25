import { createElement as h, defineComponent } from 'js-surface';

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

  main: {
    type: 'advanced',
    
    init(getProps, getState, updateState) {
      updateState(() => ({ counterValue: getProps().initialValue }));

      const
        incrementCounter = delta => {
          updateState(state => ({ counterValue: state.counterValue + delta }));
        },

        render = () => {
          const
            props = getProps(),
            state = getState();

          return (
            h('div',
              { className: 'simple-counter' },
              h('label',
                { className: 'simple-counter-label btn' },
                props.label),
              h('button',
                {
                  className: 'simple-counter-decrease-button btn btn-default',
                  onClick: () => incrementCounter(-1)
                },
                '-'),
              h('span',
                { className: 'simple-counter-value btn' },
                state.counterValue),
              h('button',
                {
                  className: 'simple-counter-increase-button btn btn-default',
                  onClick: () => incrementCounter(1)
                },
                '+'))
          );
        };

      return {
        render
      };
    }
  }
});

export default SimpleCounter({ initialValue: 100 });
