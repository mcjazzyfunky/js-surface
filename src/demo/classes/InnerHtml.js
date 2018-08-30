import { createElement as h, defineComponent } from 'js-surface'

const Demo = defineComponent({
  displayName:  'Demo',

  render() {
    return (
      h('div', {
        dangerouslySetInnerHTML: {
          __html: 'Some <b>HTML</b> <i>text</i>'
        }
      }))
  }
})

export default Demo()
