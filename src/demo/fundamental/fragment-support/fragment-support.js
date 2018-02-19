import { defineComponent, fragment, mount, Html } from 'js-surface';

const { div, hr, h6, option, select } = Html;

const FragmentDemo = defineComponent({
    displayName:  'FragmentDemo',

    render() {
        return (
            fragment(null,
                div(null,
                    'This text line is an element inside of an fragment.'),
                div(null,
                    'This text line is another element inside of an fragment.'),
                hr(),
                h6(null,
                    'A simple fragment test with a select box:'),
                select(null, Options())
            )
        );
    }
});

const Options = defineComponent({
    displayName: 'Options',

    render() {
        return (
            fragment(null,
                option({ text: 'Option #1' }),
                option({ text: 'Option #2' }),
                option({ text: 'Option #3' })));
    }
});

mount(FragmentDemo(), 'main-content');
