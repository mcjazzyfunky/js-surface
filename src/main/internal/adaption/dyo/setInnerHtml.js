// external imports
import { cloneElement } from 'dyo'

// --- setInnerHtml -------------------------------------------------

function setInnerHtml(elem, htmlContent) {
  return cloneElement(elem, { innerHTML: htmlContent })
}

// --- exports ------------------------------------------------------

export default setInnerHtml
