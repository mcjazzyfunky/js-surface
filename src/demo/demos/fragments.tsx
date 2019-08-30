import { createElement, component, Fragment } from '../../modules/core/main/index'

const FragmentDemo: any = component({ // TODO
  displayName:  'FragmentDemo',

  render() {
    return (
      <Fragment>
        <div>
          This text line is an element inside of a fragment.
        </div>
        <div>
          This text line is another element inside of the same fragment.
        </div>
        <hr/>
        <div>
          <h4>A simple fragment test with a select box:</h4>
          <select><Options/></select>
        </div>
      </Fragment>
    )
  }
})

const Options: any = component({ // TODO
  displayName: 'Options',

  render() {
    return (
      <Fragment>
        <option>Option #1</option>
        <option>Option #2</option>
        <option>Option #3</option>
      </Fragment>
    )
  }
})

export default FragmentDemo()
