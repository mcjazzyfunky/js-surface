import preact from 'preact';

const VNode = preact.h('a', null).constructor;

export default it => it instanceof VNode;
