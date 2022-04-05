import { SET_DATE } from "../types";

const initialState = {
  date: "",
  loading: true,
};

type actionType = {
  payload: String,
  type: any
};

export default function dateReducer (state = initialState, action: actionType) {
  switch (action.type) {
    case SET_DATE:
      return {
        ...state,
        date: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};