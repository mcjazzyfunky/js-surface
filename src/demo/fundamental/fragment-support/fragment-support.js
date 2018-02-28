import { createElement as h, defineComponent, fragment, mount } from 'js-surface';

const FragmentDemo = defineComponent({
    displayName:  'FragmentDemo',

    render() {
        return (
            fragment(null,
                h('div', null,
                    'This text line is an element inside of an fragment.'),
                h('div', null,
                    'This text line is another element inside of an fragment.'),
                h('hr'),
                h('h6', null,
                    'A simple fragment test with a select box:'),
                h('select', null, Options())
            )
        );
    }
});

const Options = defineComponent({
    displayName: 'Options',

    render() {
        return (
            fragment(null,
                h('option', null, 'Option #1' ),
                h('option', null, 'Option #2' ),
                h('option', null, 'Option #3' )));
    }
});

mount(FragmentDemo(), 'main-content');
