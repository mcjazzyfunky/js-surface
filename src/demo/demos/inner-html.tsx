import { createElement, component } from '../../modules/core/main/index'

const Demo: any = component({ // TODO
  displayName:  'Demo',

  render() {
    return (
      <div>
        <div>If you can read the following formated text then everything is fine:'</div>
        <br/>
        <div
          innerHTML={'&gt;&gt; <i>Hope</i> <b>you</b> can read <i>this</i> test <b>line</b>.'}
        />
      </div>
    )
  }
})

export default <Demo/>
