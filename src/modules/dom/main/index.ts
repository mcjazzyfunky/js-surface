import mount, { convertContext } from './api/mount'
import unmount from './api/unmount'
import { Dispatcher, Methods } from '../../core/main/index'
import React from 'react'

const { useState, useEffect, useContext, useImperativeMethods } = React as any

Dispatcher.init({
  useState,

  // TODO
  useEffect(action: () => void, deps) {
    useEffect(action, deps)
  },

  useContext(ctx: any) {
    if (!ctx.Provider.__internalType) {
      convertContext(ctx)
    }

    return useContext(ctx.Provider.__internal_type._context)
  },

  useMethods(ref: any, getMethods: () => Methods) {
    useImperativeMethods(ref, getMethods)
  }
})

export {
  mount,
  unmount
}
