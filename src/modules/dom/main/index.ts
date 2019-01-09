import mount, { convertContext } from './api/mount'
import unmount from './api/unmount'
import { Context, Dispatcher } from '../../core/main/index'
import React from 'react'

const { useState, useEffect, useContext } = React as any

Dispatcher.init({
  useState,
  useEffect,

  useContext(ctx: any) {
    if (!ctx.Provider.__internalType) {
      convertContext(ctx)
    }

    return useContext(ctx.Provider.__internal_type._context)
  }
})

export {
  mount,
  unmount
}
