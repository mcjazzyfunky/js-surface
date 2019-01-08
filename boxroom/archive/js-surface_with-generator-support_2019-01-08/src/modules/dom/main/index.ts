import mount from './api/mount'
import unmount from './api/unmount'
import { Dispatcher } from '../../core/main/index'
import React from 'react'

const { useState, useEffect, useContext } = React as any

Dispatcher.init({
  useState,
  useEffect,
  useContext
})

export {
  mount,
  unmount
}
