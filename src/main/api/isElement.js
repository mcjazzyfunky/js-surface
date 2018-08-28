import preact from 'preact'

const VNode = preact.h('a').constructor

export default it => it instanceof VNode 
