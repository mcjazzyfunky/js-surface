import { createElement as h, defineComponent } from 'js-surface/core'

const helloWorldContent = {
  [Symbol.iterator]: function * () {
    yield 'I'
    yield 't'
    yield 'e'
    yield 'r'
    yield 'a'
    yield 't'
    yield 'o'
    yield 'r'
    yield 's'

    yield {
      [Symbol.iterator]: function * () {
        yield ' '
        yield 'seem'
        yield ' '
        yield 'to'
        yield ' '
      }
    }

    yield 'w'
    yield 'o'
    yield ['r', 'k', ' ', 'p', {
      [Symbol.iterator]: function * () {
        yield 'r'
        yield 'operly!'
      }
    }]
  }
}

const Demo = defineComponent({
  displayName:  'Demo',

  render() {
    return (
      h('div',
        { style: { display: 'block' } },
        helloWorldContent))
  }
})

export default Demo()
