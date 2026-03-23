import { GET_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { DELETE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';

const initalState = {
  error: null,
  items: [],
  loaded: false,
  loading: false,
};

export function keywords(state = initalState, action = {}) {
  switch (action.type) {
    case `${GET_KEYWORDS}_PENDING`:
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
        loaded: true,
        loading: false,
      };
    case `${GET_KEYWORDS}_FAIL`:
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
