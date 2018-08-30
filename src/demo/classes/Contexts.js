import { createElement as h, defineContext, defineComponent } from 'js-surface'
import { Component } from 'js-surface/classes'

const ParentDisabledCtx = defineContext({
  displayName: 'ParentDisabledCtx',
  type: Boolean,
  defaultValue: false
})

const Parent = defineComponent({
  displayName: 'Parent',

  properties: {
    children: {
      type: Array,
      nullable: true,
      defaultValue: null
    }
  },

  main: class extends Component {
    constructor(props) {
      super(props)

      this.state = { disabled: false }
    }

    toggleDisableState() {
      this.setState({
        disabled: !this.state.disabled
      })
    }
  
    render() {
      return (
        h(ParentDisabledCtx.Provider,
          { value: this.state.disabled }, 
          h('div', null,
            h('div', null,
              'Parent component is ', this.state.disabled ? 'disabled' : 'enabled', '.'),
            h('button', { onClick: () => this.toggleDisableState() },
              this.state.disabled ? 'Enable' : 'Disable'),
            h('div', null, this.props.children)))
      )
    }
  }
})

const Child = defineComponent({
  displayName: 'Child',

  main: class extends Component {
    render() {
      return (
        h('div', null,
          'This time information should never update: ',
          new Date().toLocaleTimeString(),
          h(ParentDisabledCtx.Consumer, parentDisabled => 
            h('div', null,
              'Child component is ',
              parentDisabled ? 'disabled' : 'enabled',
              '.')))
      )
    }
  }
})

const Container = defineComponent({
  displayName: 'Container',

  properties: {
    children: {
      type: Array
    }
  },

  main: class extends Component {
    shouldComponentUpdate() {
      return false
    }

    render() {
      return (
        h('div', null,
          h('div', null, this.props.children))
      )
    }
  }
})

export default Parent(null, Container(null, Child()))
