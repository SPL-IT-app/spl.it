// ACTION TYPE
const SET_EVENT = 'SET_EVENT'

// INITIAL STATE
const defaultState = {
    eventId: ''
}

// ACTION CREATOR
export const setEvent = event => ({ type: SET_EVENT, event })

// HANDLERS
const handler = {
    [SET_EVENT]: (state, action) => {
        return { ...state, eventId: action.event }
    }
}

// REDUCER
export default function (state = defaultState, action) {
    if (!handler.hasOwnProperty(action.type)) {
        return state
    } else {
        return handler[action.type](state, action)
    }
}
