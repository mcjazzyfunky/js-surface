import {
  defineContext,
  createElement as h,
  defineComponent,
  mount
} from 'js-surface';

const ValueCtx = defineContext();

const Parent = defineComponent({
  displayName: 'Parent',

  properties: {
    masterValue: {
      type: String,
      defaultValue: 'default-value'
    }
  },

  init: () => ({
    render(props) {
      return (
        h('div', null,
          h('div', null, 'Provided value: ', props.masterValue),
          h('br'),
          h('div', null,
            h(ValueCtx.Provider, { value: props.masteralue }),
              ChildFunctional(),
              ChildStandard(),
              ChildFunctional({ value: 'with explicit value' }),
              ChildStandard({ value: 'with another explicit value' })))
      );
    }
  })
});

const ChildFunctional = defineComponent({
  displayName: 'ChildFunctional',

  properties: {
    value: {
      type: String,
      defaultValue: 'default value',
      
      inject: {
        context: ValueCtx
      },
    }
  },

  render(props) {
    return h('div', null, 'ChildFunctional(', props.value, ')');
  }
});

const ChildStandard = defineComponent({
  displayName: 'ChildStandard',

  properties: {
    value: {
      type: String,
      defaultValue: 'default value',
      
      inject: {
        context: ValueCtx
      },
    }
  },

  init: () => ({
    render(props) {
      return h('div', null, 'ChildStandard(', props.value, ')');
    }
  })
});

mount(Parent({ masterValue: 'the injected value' }), 'main-content');
