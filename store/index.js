import { createStore, combineReducers, applyMiddleware } from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from "./user"
import receipt from './receipt'
import event from './event'



const reducer = combineReducers({ user, receipt, event })
const middleWare = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
const store = createStore(reducer, middleWare)

export default store
export * from './user'
export * from './receipt'
export * from './event'

