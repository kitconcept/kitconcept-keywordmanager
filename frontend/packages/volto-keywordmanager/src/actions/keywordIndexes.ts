import { GET_KEYWORD_INDEXES } from 'volto-keywordmanager/constants/KeywordIndexes';

export function getKeywordIndexes() {
  return {
    type: GET_KEYWORD_INDEXES,
    request: {
      op: 'get',
      path: '/@keyword-indexes',
    },
  };
}
