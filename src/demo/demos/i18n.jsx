import { h, component, context, useState, useContext }
  from '../../main/index'

import * as Spec from 'js-spec/validators'

const translations = {
  en: {
    salutation: 'Hello, ladies and gentlemen!'
  },
  de: {
    salutation: 'Hallo, meine Damen und Herren!'
  },
  fr: {
    salutation: 'Salut, Mesdames, Messieurs!'
  }
}

const LocaleCtx = context({
  name: 'LocaleCtx',
  defaultValue: 'en'
})

const App = component({
  name: 'App',

  validate: Spec.checkProps({
    optional: {
      defaultLocale: Spec.oneOf('en', 'fr', 'de')
    }
  }),

  main({ defaultLocale = 'en' }) {
    const [locale, setLocale] = useState(() => defaultLocale)

    return (
      <LocaleCtx.Provider value={locale}>
        <div>
          <label htmlFor="lang-selector">Select language: </label>
          <select id="lang-selector" value={locale} onChange={ev => setLocale(ev.target.value)}>
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="de">de</option>
          </select>
          <LocaleText id="salutation"/>
        </div>
      </LocaleCtx.Provider>
    )
  }
})

const LocaleText = component({
  name: 'LocaleText',

  validate: Spec.checkProps({
    optional: {
      id: Spec.string
    }
  }),

  main(props) {
    const locale = useContext(LocaleCtx)

    return (
      <p>
        { translations[locale][props.id] }
      </p>
    )
  }
})

export default <App defaultLocale="en"/>
