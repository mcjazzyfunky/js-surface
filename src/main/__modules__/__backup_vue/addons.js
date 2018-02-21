import Vue from 'vue';
import { createElement  } from './index.js';

const
    Component = null, // TODO
    Fragment = createElement('span'), // TODO
    fragment = createElement.bind(null, Fragment);

fragment.type = Fragment;

export {
    fragment,
    Component,
    Fragment
};

export default {
    fragment,
    Component,
    Fragment
};