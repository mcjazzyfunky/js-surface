import { createElement, createElement as h, defineComponent, defineContext } from '../../modules/core/main/index'
import { init, useState, useContext } from '../../modules/experimental/main'
import { Spec } from 'js-spec'

const translations: Record<string, Record<string, string>> = {
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

const LocaleCtx = defineContext({
  displayName: 'LocaleCtx',
  defaultValue: 'en'
})

type AppProps = {
  defaultLocale: string
}

const App = defineComponent<AppProps>({
  displayName: 'App',

  properties: {
    defaultLocale: {
      type: String,
      validate: Spec.oneOf('en', 'fr', 'de'),
      defaultValue: 'en'
    }
  },

  render: init(c => {
    const [getLocale, setLocale] = useState(c, c.props.defaultLocale)

    return props => (
      <LocaleCtx.Provider value={getLocale()}>
        <div>
          <label htmlFor="lang-selector">Select language: </label>
          <select id="lang-selector" value={getLocale()} onChange={(ev: any) => setLocale(ev.target.value)}>
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="de">de</option>
          </select>
          <LocaleText id="salutation"/>
        </div>
      </LocaleCtx.Provider>
    )
  })
})

interface LocaleTextProps {
  id: string
}

const LocaleText = defineComponent<LocaleTextProps>({
  displayName: 'LocaleText',

  properties: {
    id: {
      type: String,
    }
  },

  render: init(c => {
    const getLocale = useContext(c, LocaleCtx)

    return props => (
      <p>
        { translations[getLocale()][props.id] }
      </p>
    )
  })
})

export default <App defaultLocale="en"/>
