import {
  DELETE_KEYWORDS,
  GET_KEYWORDS,
  UPDATE_KEYWORDS,
} from 'volto-keywordmanager/constants/Keywords';

const initialState = {
  error: null,
  items: [],
  loaded: false,
  loading: false,
};

export function keywords(state = initialState, action = {}) {
  switch (action.type) {
    case `${DELETE_KEYWORDS}_PENDING`:
    case `${GET_KEYWORDS}_PENDING`:
    case `${UPDATE_KEYWORDS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_KEYWORDS}_SUCCESS`:
      return {
        ...state,
        error: null,
        items: action.result.items,
        items_total: action.result.items_total,
        loaded: true,
        loading: false,
      };
    case `${DELETE_KEYWORDS}_SUCCESS`:
    case `${UPDATE_KEYWORDS}_SUCCESS`:
      return {
        ...state,
        error: action.result?.failed,
        loaded: true,
        loading: false,
      };
    case `${DELETE_KEYWORDS}_FAIL`:
    case `${GET_KEYWORDS}_FAIL`:
    case `${UPDATE_KEYWORDS}_FAIL`:
      return {
        ...state,
        error: action.error,
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
