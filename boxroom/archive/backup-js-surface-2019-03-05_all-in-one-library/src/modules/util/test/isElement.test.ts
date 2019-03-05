import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Spec, SpecError } from 'js-spec'

import { createElement, Fragment } from  '../../core/main'
import { isElement } from  '../../util/main'

describe('[util] Testing function "isElement"', () => {
  it('should accept a div element as element', () => {
    expect(isElement(createElement('div')))
      .to.eql(true)
  })
  
  it('should accept a Fragment element as element', () => {
    expect(isElement(Fragment()))
      .to.eql(true)
  })

  it('should not accept undefined as element', () => {
    expect(isElement(undefined))
      .to.eql(false)
  })

  it('should not accept null as element', () => {
    expect(isElement(null))
      .to.eql(false)
  })

  it('should not accept true as element', () => {
    expect(isElement(true))
      .to.eql(false)
  })
 
  it('should not accept false as element', () => {
    expect(isElement(false))
      .to.eql(false)
  })

  it('should not accept a number as element', () => {
    expect(isElement(123.45))
      .to.eql(false)
  })
  
  it('should not accept a string as element', () => {
    expect(isElement('some text'))
      .to.eql(false)
  })
  
  it('should not accept an array as element', () => {
    expect(isElement([1, 2, 3]))
      .to.eql(false)
  })

  it('should not accept an iterable object as element', () => {
    expect(isElement({ [Symbol.iterator]: function*() {
        yield 1
        yield 2
        yield 3
    }}))
    .to.eql(false)
  })

  it('should not accept a non-iterable object as element', () => {
    expect(isElement(new Date()))
    .to.eql(false)
  })
  
  it('should have proper js-spec support', () => {
    expect(Spec.and(isElement).validate(createElement('p')))
      .to.eql(null)
    
    expect(Spec.and(isElement).validate({}))
      .to.instanceOf(SpecError)

    expect(Spec.and(isElement) .validate({}).hint)
      .to.eql('Must be a valid element')
  })
})
