import preact from 'preact';

const VNode = preact.h('a', null).constructor;

export default function isNode(it) {
  return !it || typeof it !== 'object' || it instanceof VNode
    || typeof it[Symbol.iterator] === 'function';
}