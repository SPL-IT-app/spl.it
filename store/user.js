// ACTION TYPE
const GET_USER = 'GET_USER '
const REMOVE_USER = 'REMOVE_USER'

// INITIAL STATE
const defaultState = {
    currentUser: {}
}

// ACTION CREATOR
export const getUser = user => ({ type: GET_USER, user })

export const removeUser = () => ({
    type: REMOVE_USER
})


// HANDLERS
const handler = {
    [GET_USER]: (state, action) => {
        return { ...state, currentUser: action.user }
    },
    [REMOVE_USER]: (state, action) => {
        return {...state, currentUser: {}}
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
