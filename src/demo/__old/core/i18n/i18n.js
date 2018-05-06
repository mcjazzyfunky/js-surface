import {
  createContext,
  createElement as h,
  defineComponent,
  mount 
} from 'js-surface';

import { Spec } from 'js-spec';

const translations = {
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

const LocaleContext = createContext('en');

const App = defineComponent({
  displayName: 'App',

  properties: {
    defaultLocale: {
      type: String,
      constraint: Spec.oneOf('en', 'fr', 'de'),
      defaultValue: 'en'
    }
  },

  init(initialProps, refresh) {
    let locale = initialProps.defaultLocale;

    return { 
      render: () => {
        return (
          h(LocaleContext.Provider, { value: locale },
            h('div', null,
              h('label',
                { htmlFor: 'lang-selector' },
                'Select language: '),
              h('select',
                {
                  id: 'lang-selector',
                  value: locale,
                  onChange: ev => {
                    locale = ev.target.value;
                    refresh();
                  }
                },
                h('option', { value: 'en' }, 'en'),
                h('option', { value: 'fr' }, 'fr'),
                h('option', { value: 'de' }, 'de')),
              h('div', null, LocaleText({ id: 'salutation'}))))
        );
      }
    };
  }
});

const LocaleText = defineComponent({
  displayName: 'LocaleText',

  properties: {
    id: {
      type: String,
    }
  },

  render(props) {
    return (
      h('div', null,
        h(LocaleContext.Consumer, locale =>
          translations[locale][props.id]))
    );
  }
});

mount(App(), 'main-content');
