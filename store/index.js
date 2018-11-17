import { createStore, combineReducers, applyMiddleware } from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from "./user"
import receipt from './receipt'


const reducer = combineReducers({ user, receipt })
const middleWare = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
const store = createStore(reducer, middleWare)

export default store
export * from './user'
export * from './receipt'
