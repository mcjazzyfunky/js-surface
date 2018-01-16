import {
    hyperscript as h,
    defineComponent,
    mount
} from 'js-surface';

const FunctionalGreeting = defineComponent({
    displayName: 'Greeting',

    properties: {
        name: {
            type: String,
            defaultValue: 'Unkown'
        },

        locale: {
            type: String,
            defaultValue: 'en'
        }
    },

    render(props) {
        const text =
            props.locale === 'fr'
            ? `Salut ${props.name}!`
            : `Hi ${props.name}!`;

        return h('div', text);
    }
});

const DerivedFunctionalGreeting = FunctionalGreeting.withDefaults({
    name: 'Anonymous',
    locale: 'fr'
});

const StandardGreeting = defineComponent({
    displayName: 'Greeting',

    properties: {
        name: {
            type: String,
            defaultValue: 'Unkown'
        },

        locale: {
            type: String,
            defaultValue: 'en'
        }
    },

    init: updateView => ({
        setProps(props) {
            const text =
                props.locale === 'fr'
                ? `Bonjour ${props.name}!`
                : `Hello ${props.name}!`;
            
            updateView(h('div', text));
        }
    })
});

const DerivedStandardGreeting = StandardGreeting.withDefaults({
    name: 'Anonymous',
    locale: 'fr'
});

const content =
    h('div',
        h('h6', 'Original functional component:'),
        FunctionalGreeting(),
        h('hr'),
        h('h6', 'Derived functional component with different default values:'),
        DerivedFunctionalGreeting(),
        h('hr'), 
        h('h6', 'Original standard component:'),
        StandardGreeting(),
        h('hr'),
        h('h6', 'Derived standard component with different default values:'),
        DerivedStandardGreeting());

mount(content, 'main-content');