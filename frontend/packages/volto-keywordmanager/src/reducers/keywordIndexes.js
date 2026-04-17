import { GET_KEYWORD_INDEXES } from 'volto-keywordmanager/constants/KeywordIndexes';

const initalState = {
  error: null,
  items: [],
  loaded: false,
  loading: false,
};

export function keywordIndexes(state = initalState, action = {}) {
  switch (action.type) {
    case `${GET_KEYWORD_INDEXES}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_KEYWORD_INDEXES}_SUCCESS`:
      return {
        ...state,
        error: null,
        items: action.result,
        loaded: true,
        loading: false,
      };
    case `${GET_KEYWORD_INDEXES}_FAIL`:
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
