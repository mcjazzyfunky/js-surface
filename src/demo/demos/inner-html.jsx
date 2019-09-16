import { h, component, setInnerHtml } from '../../main/index'

const Demo = component({
  displayName:  'Demo',

  render() {
    const
      html = '&gt;&gt; <i>Hope</i> <b>you</b> can read <i>this</i> test <b>line</b>.',
      content = setInnerHtml(<div/>, html)

    return (
      <div>
        <div>If you can read the following formated text then everything is fine:</div>
        <br/>
        {content}
      </div>
    )
  }
})

export default <Demo/>
