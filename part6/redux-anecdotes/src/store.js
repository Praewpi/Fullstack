import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterReducer from './reducers/filterReducer'

// Configure the Redux store with multiple reducers
const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer, // Reducer for managing anecdotes state
    notification: notificationReducer, // Reducer for managing notification state
    filter: filterReducer, // Reducer for managing filter state
  }
})

export default store