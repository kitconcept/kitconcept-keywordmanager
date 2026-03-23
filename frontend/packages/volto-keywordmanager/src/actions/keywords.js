import { GET_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { UPDATE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { DELETE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';

import { AnyAction } from 'redux';

export function getKeywords(options = {}) {
  const { groupKeywords, batchSize, batchStart, ...rest } = options;
  const params = new URLSearchParams({
    grouped: groupKeywords ?? false,
    b_size: batchSize ?? 25,
    b_start: batchStart ?? 0,
    ...rest,
  });
  return {
    type: GET_KEYWORDS,
    request: {
      op: 'get',
      path: `/@tags?${params.toString()}`,
    },
  };
}

export function updateKeywords() {
  return {
    type: UPDATE_KEYWORDS,
    request: {
      op: 'post',
      path: '/@tags',
    },
  };
}

/**
 * @param {string | string[]} keywords
 * @returns {AnyAction}
 */
export function deleteKeywords(keywords) {
  const result = Array.isArray(keywords) ? keywords.join(',') : keywords;
  return {
    type: DELETE_KEYWORDS,
    request: {
      op: 'del',
      path: `/@tags?${result}`,
    },
  };
}
