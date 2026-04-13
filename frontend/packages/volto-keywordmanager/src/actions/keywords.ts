import { GET_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { UPDATE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';
import { DELETE_KEYWORDS } from 'volto-keywordmanager/constants/Keywords';

export function getKeywords({
  id = null,
  index = null,
  groupKeywords = false,
  batchSize = 25,
  batchStart = 0,
}: {
  id?: string | null;
  index?: string | null;
  groupKeywords?: boolean;
  batchSize?: number;
  batchStart?: number;
}) {
  let params = new URLSearchParams({
    grouped: String(groupKeywords),
    b_size: String(batchSize),
    b_start: String(batchStart),
  });

  if (index) {
    params.append('idx', index);
  }

  let requestPath = '/@keywords';

  if (id) {
    requestPath += `/${id}`;
  }

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
}: {
  new_keyword: string;
  old_keywords: string[];
}) {
  return {
    type: UPDATE_KEYWORDS,
    request: {
      op: 'patch',
      path: '/@keywords',
      data: {
        new_keyword,
        old_keywords,
      },
    },
  };
}

export function deleteKeywords({ items }: { items: string[] }) {
  return {
    type: DELETE_KEYWORDS,
    request: {
      op: 'del',
      path: '/@keywords',
      data: { items },
    },
  };
}
