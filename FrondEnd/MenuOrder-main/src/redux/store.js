import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slider/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})