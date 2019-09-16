// external imports
import React from 'react'

// --- setInnerHtml -------------------------------------------------

function setInnerHtml(elem, htmlContent) {
  return React.cloneElement(elem,
    {
      dangerouslySetInnerHTML: {
        __html: htmlContent
      }
    })
}

// --- exports ------------------------------------------------------

export default setInnerHtml
