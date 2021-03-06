// ACTION TYPE
const SET_RECEIPT = 'SET_RECEIPT';
const UPDATE_LINE_ITEM = 'UPDATE_LINE_ITEM';
const ADD_LINE_ITEM = 'ADD_LINE_ITEM';
const REMOVE_LINE_ITEM = 'REMOVE_LINE_ITEM';

// INITIAL STATE
const defaultState = {
  receipt: [],
};

// ACTION CREATOR
export const setReceipt = receipt => ({ type: SET_RECEIPT, receipt });
export const updateLineItem = (lineItem, idx) => ({
  type: UPDATE_LINE_ITEM,
  lineItem,
  idx,
});
export const addLineItem = () => ({ type: ADD_LINE_ITEM });
export const removeLineItem = lineItem => ({
  type: REMOVE_LINE_ITEM,
  lineItem,
});

// HANDLERS
const handler = {
  [SET_RECEIPT]: (state, action) => {
    return { ...state, receipt: action.receipt };
  },
  [UPDATE_LINE_ITEM]: (state, action) => {
    const newReceipt = [...state.receipt];
    newReceipt.splice(action.idx, 1, action.lineItem);
    return { ...state, receipt: [...newReceipt] };
  },
  [ADD_LINE_ITEM]: (state, action) => {
    return {
      ...state,
      receipt: [...state.receipt, { quantity: 1, name: '', price: 0.0 }],
    };
  },
  [REMOVE_LINE_ITEM]: (state, action) => {
    console.log('action index => ', action.lineItem);
    const newReceipt = [...state.receipt];
    newReceipt.splice(action.lineItem, 1);
    return {
      ...state,
      receipt: newReceipt,
    };
  },
};

// REDUCER
export default function(state = defaultState, action) {
  if (!handler.hasOwnProperty(action.type)) {
    return state;
  } else {
    return handler[action.type](state, action);
  }
}
