// external imports
import { cloneElement } from 'preact'

// --- setInnerHtml -------------------------------------------------

function setInnerHtml(elem, htmlContent) {
  return cloneElement(elem,
    {
      dangerouslySetInnerHTML: {
        __html: htmlContent
      }
    })
}

// --- exports ------------------------------------------------------

export default setInnerHtml
