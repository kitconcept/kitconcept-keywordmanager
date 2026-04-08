import { GET_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { UPDATE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { DELETE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';

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
      path: `/@keywords?${params.toString()}`,
    },
  };
}

export function updateKeywords(data) {
  return {
    type: UPDATE_KEYWORDS,
    request: {
      op: 'patch',
      path: '/@keywords',
      data,
    },
  };
}

export function deleteKeywords(data) {
  return {
    type: DELETE_KEYWORDS,
    request: {
      op: 'del',
      path: '/@keywords',
      data,
    },
  };
}
