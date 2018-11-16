// ACTION TYPE
const SET_RECEIPT = 'SET_RECEIPT'
const UPDATE_LINE_ITEM = 'UPDATE_LINE_ITEM'

// INITIAL STATE
const defaultState = {
    receipt: []
}

// ACTION CREATOR
export const setReceipt = receipt => ({ type: SET_RECEIPT, receipt })
export const updateLineItem = (lineItem, idx) => ({ type: UPDATE_LINE_ITEM, lineItem, idx })


// HANDLERS
const handler = {
    [SET_RECEIPT]: (state, action) => {
        return { ...state, receipt: action.receipt }
    },
    [UPDATE_LINE_ITEM]: (state, action) => {
        return {...state, receipt: state.receipt.splice(action.idx, 1, action.lineItem)}
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
