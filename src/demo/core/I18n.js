import { defineContext, createElement as h, defineComponent } from 'js-surface';
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

const LocaleContext = defineContext({
  displayName: 'LocaleCtx',
  defaultValue: 'en'
});

const App = defineComponent({
  displayName: 'App',

  properties: {
    defaultLocale: {
      type: String,
      constraint: Spec.oneOf('en', 'fr', 'de'),
      defaultValue: 'en'
    }
  },

  main: {
    type: 'advanced',
    
    init: (getProps, getState, updateState) => {
      updateState({ locale: getProps().defaultLocale });

      return { 
        render: () => {
          const locale = getState().locale;

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
                      const newLocale = ev.target.value;

                      updateState(() => ({ locale: newLocale }));
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
  }
});

const LocaleText = defineComponent({
  displayName: 'LocaleText',

  properties: {
    id: {
      type: String,
    }
  },

  main: {
    type: 'basic',

    render(props) {
      return (
        h('div', null,
          h(LocaleContext.Consumer, locale =>
            translations[locale][props.id]))
      );
    }
  }
});

export default App();
