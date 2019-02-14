import { createElement as h, defineComponent } from '../../modules/core/main/index'

const Demo = defineComponent({
  displayName:  'Demo',

  render() {
    return (
      h('div', null,
        h('div', null, 'If you can read the following formated text then everything is fine:'),
        h('br'),
        h('div', {
          innerHTML: '&gt;&gt; <i>Hope</i> <b>you</b> can read <i>this</i> test <b>line</b>.',
        }))
    )
  }
})

export default Demo()
