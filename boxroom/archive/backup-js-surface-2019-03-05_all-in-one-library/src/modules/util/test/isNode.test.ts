import { createElement } from  '../../core/main'
import { isNode } from  '../../util/main'

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Spec, SpecError } from 'js-spec'

describe('[util] Testing function "isNode"', () => {
  it('should accept a virtual element as node', () => {
    expect(isNode(createElement('div')))
      .to.eql(true)
  })

  it('should accept undefined as node', () => {
    expect(isNode(undefined))
      .to.eql(true)
  })

  it('should accept null as node', () => {
    expect(isNode(null))
      .to.eql(true)
  })

  it('should accept true as node', () => {
    expect(isNode(true))
      .to.eql(true)
  })
 
  it('should accept false as node', () => {
    expect(isNode(false))
      .to.eql(true)
  })

  it('should accept a number as node', () => {
    expect(isNode(123.45))
      .to.eql(true)
  })
  
  it('should accept a string as node', () => {
    expect(isNode('some text'))
      .to.eql(true)
  })
  
  it('should accept an array as node', () => {
    expect(isNode([1, 2, 3]))
      .to.eql(true)
  })

  it('should accept an iterable object as node', () => {
    expect(isNode({ [Symbol.iterator]: function*() {
        yield 1
        yield 2
        yield 3
    }}))
      .to.eql(true)
  })

  it('should not accept a non-iterable object as node', () => {
    expect(isNode(new Date()))
    .to.eql(false)
  })
  
  it('should have proper js-spec support', () => {
    expect(Spec.and(isNode).validate('some text'))
      .to.eql(null)
    
    expect(Spec.and(isNode).validate({}))
      .to.instanceOf(SpecError)

    expect(Spec.and(isNode) .validate({}).hint)
      .to.eql('Must be a valid node')
  })
})
