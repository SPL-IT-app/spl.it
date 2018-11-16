const GET_USER = 'GET_USER '

const defaultState = {
    currentUser: {}
}

export const getUser = user => ({ type: GET_USER, user })

const handler = {
    [GET_USER]: (state, action) => {
        return { ...state, currentUser: action.user }
    }
}

export default function (state = defaultState, action) {
    if (!handler.hasOwnProperty(action.type)) {
        return state
    } else {
        return handler[action.type](state, action)
    }
}
