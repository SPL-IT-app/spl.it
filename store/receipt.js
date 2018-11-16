// ACTION TYPE
const SET_RECEIPT = 'SET_RECEIPT'

// INITIAL STATE
const defaultState = {
    receipt: []
}

// ACTION CREATOR
export const setReceipt = receipt => ({ type: SET_RECEIPT, receipt })


// HANDLERS
const handler = {
    [SET_RECEIPT]: (state, action) => {
        return { ...state, receipt: action.receipt }
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
