import {
    createElement as h,
    defineFunctionalComponent,
    defineClassComponent,
    mount
} from 'js-velvet';

const FunctionalGreeting = defineFunctionalComponent({
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

const StandardGreeting = defineClassComponent({
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

    render() {
        const text =
            this.props.locale === 'fr'
            ? `Bonjour ${this.props.name}!`
            : `Hello ${this.props.name}!`;

        return h('div', text);
    }
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