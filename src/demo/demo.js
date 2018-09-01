import { createElement as h, defineComponent, mount } from 'js-surface'

import demos from './available-demos'

const DemoSelector = defineComponent({
  displayName: 'DemoSelector',

  init(getProps, getState, updateState, forceUpdate) {
    let currDemoIdx = Math.floor(document.location.href.replace(/^.*idx=/, '')) || 0

    function startDemo(idx) {
      currDemoIdx = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + currDemoIdx
      forceUpdate()
    }

    return {
      render() {
        const options = []

        for (let i = 0; i < demos.length; ++i) {
          const demo = demos[i]
          
          options.push(h('option', { key: i, value: i }, demo.title))
        }

        return (
          h('div',
            h('div',
              h('label',
                'Select demo: ',
                h('select', { onChange: ev => startDemo(ev.target.value), value: currDemoIdx }, options))),
            h('br'),
            h('div', demos[currDemoIdx].content))
        )
      }
    }
  }
})

const Demo = defineComponent({
  displayName: 'Demo',

  render() {
    return h('div', h('div', DemoSelector()))
  }
})

mount(Demo(), 'main-content')

// const elem = h(Demo, { a: 1, b: 2, key: 'a-key', ref: () => {} }, 11, 22)
// console.log(Object.keys(elem))
// console.log(Object.keys(elem.props))
// console.log(elem)