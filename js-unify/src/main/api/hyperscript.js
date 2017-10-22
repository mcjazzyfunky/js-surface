import { createElement, isElement } from 'js-surface';
import { defineHyperscript } from 'js-hyperscript';

export default defineHyperscript({
    createElement,
    isElement,
    classAlias: 'className'
});
