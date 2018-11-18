// ACTION TYPE
const SET_EVENT = 'SET_EVENT'

// INITIAL STATE
const defaultState = {
    selectedEvent: {}
}

// ACTION CREATOR
export const setReceipt = event => ({ type: SET_EVENT, event })

// HANDLERS
const handler = {
    [SET_EVENT]: (state, action) => {
        return { ...state, selectedEvent: action.event }
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
