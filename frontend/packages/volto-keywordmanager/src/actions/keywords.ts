import { GET_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { UPDATE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { DELETE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';

export function getKeywords({
  index = null,
  groupKeywords = false,
  batchSize = 25,
  batchStart = 0,
  sortOn = null,
  sortOrder = null,
}: {
  index?: string | null;
  groupKeywords?: boolean;
  batchSize?: number;
  batchStart?: number;
  sortOn?: string;
  sortOrder?: string;
}) {
  let params = new URLSearchParams({
    grouped: String(groupKeywords),
    b_size: String(batchSize),
    b_start: String(batchStart),
  });

  if (index) params.append('idx', index);
  if (sortOn) params.append('sort_on', sortOn);
  if (sortOrder) params.append('sort_order', sortOrder);

  let requestPath = '/@keywords';

  if (params) {
    requestPath += `?${params.toString()}`;
  }

  return {
    type: GET_KEYWORDS,
    request: {
      op: 'get',
      path: requestPath,
    },
  };
}

export function updateKeywords({
  new_keyword,
  old_keywords,
  indexName,
}: {
  new_keyword: string;
  old_keywords: string[];
  indexName: string;
}) {
  let requestPath = '/@keywords';

  if (indexName) {
    requestPath += `?idx=${indexName}`;
  }

  return {
    type: UPDATE_KEYWORDS,
    request: {
      op: 'patch',
      path: requestPath,
      data: {
        new_keyword,
        old_keywords,
      },
    },
  };
}

export function deleteKeywords({
  items,
  indexName,
}: {
  items: string[];
  indexName: string;
}) {
  let requestPath = '/@keywords';

  if (indexName) {
    requestPath += `?idx=${indexName}`;
  }

  return {
    type: DELETE_KEYWORDS,
    request: {
      op: 'del',
      path: requestPath,
      data: { items },
    },
  };
}
