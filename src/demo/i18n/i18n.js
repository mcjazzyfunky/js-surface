import {
    createElement as h,
    defineComponent,
    render,
    Component
} from 'js-surface';

import { Spec } from 'js-spec';

const translationsByLang = {
    en: {
        salutation: 'Hello, ladies and gentlemen'
    },
    de: {
        salutation: 'Hallo, meine Damen und Herren'
    },
    fr: {
        salutation: 'Salut, Mesdames, Messieurs'
    }
};

const App = defineComponent(class extends Component {
    static get displayName() {
        return 'App';
    }

    static get properties() {
        return {
            defaultLang: {
                type: String,
                constraint: Spec.oneOf(['en', 'fr', 'de']),
                defaultValue: 'en'
            }
        };
    }

    static get childInjectionKeys() {
        return ['translations'];
    }

    constructor(props) {
        super(props);
        this.setLang(props.defaultLang);
    }

    getChildInjection() {
        return {
            translations: translationsByLang[this.state.lang]
        };
    }

    setLang(lang) {
        this.state = { lang };
    }

    render() {
        return (
            h('div',
                h('label[for=lang-selector]',
                    'Select language: '),
                h('select#lang-selector',
                    {   value: this.state.lang,
                        onChange: ev => this.setLang(ev.target.value)
                    },
                    h('option', 'en'),
                    h('option', 'fr'),
                    h('option', 'de')),
                h('div', Text({ name: 'salutation'})))
        );
    }
});

const Text = defineComponent({
    displayName: 'Text',

    properties: {
        name: {
            type: String,
        },

        translations: {
            type: Object,
            inject: true
        }
    },

    render(props) {console.log('Rendering Text', props.translations)
        return (
            h('div',
                props.translations[props.name])
        );
    }
});

render(App(), 'main-content');