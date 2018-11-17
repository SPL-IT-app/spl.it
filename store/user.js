// ACTION TYPE
const GET_USER = 'GET_USER '

// INITIAL STATE
const defaultState = {
    currentUser: {}
}

// ACTION CREATOR
export const getUser = user => ({ type: GET_USER, user })


// HANDLERS
const handler = {
    [GET_USER]: (state, action) => {
        return { ...state, currentUser: action.user }
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
