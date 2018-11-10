import htmlTagNames from './tags/htmlTagNames'
import svgTagNames from './tags/svgTagNames'
import { createElement } from 'js-surface'

const
  Html = {},
  Svg = {}

for (let i = 0; i < htmlTagNames.length; ++i) {
  const tagName = htmlTagNames[i]

  Html[tagName] = createElement.bind(null, tagName)
}

for (let i = 0; i < svgTagNames.length; ++i) {
  const tagName = svgTagNames[i]

  Svg[tagName] = createElement.bind(null, tagName)
}

export {
  Html,
  Svg
}
