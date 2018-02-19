import {
    createElement as h,
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

        return h('div', null, text);
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

    main: updateView => ({
        setProps(props) {
            const text =
                props.locale === 'fr'
                ? `Bonjour ${props.name}!`
                : `Hello ${props.name}!`;
            
            updateView(h('div', null, text));
        }
    })
});

const DerivedStandardGreeting = StandardGreeting.withDefaults({
    name: 'Anonymous',
    locale: 'fr'
});

const content =
    h('div', null,
        h('h6', null, 'Original functional component:'),
        FunctionalGreeting(),
        h('hr'),
        h('h6', null, 'Derived functional component with different default values:'),
        DerivedFunctionalGreeting(),
        h('hr'), 
        h('h6', null, 'Original standard component:'),
        StandardGreeting(),
        h('hr'),
        h('h6', null, 'Derived standard component with different default values:'),
        DerivedStandardGreeting());

mount(content, 'main-content');