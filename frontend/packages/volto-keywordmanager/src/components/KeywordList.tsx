import { useState } from 'react';
import { Button } from '@plone/components';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import circleDismissSVG from '@plone/volto/icons/circle-dismiss.svg';

const KeywordList = ({ keywords = [], currentId, onDelete }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const maxVisible = 4;
  const visible = expanded ? keywords : keywords.slice(0, maxVisible);
  const hiddenCount = keywords.length - maxVisible;

  return (
    <ul aria-label="Keywords">
      {visible.map((item) => (
        <li key={item} className={item === currentId && 'current'}>
          <span>{item}</span>
          <Button
            type="button"
            aria-label={`Remove keyword: ${item}`}
            onPress={() => onDelete(item)}
          >
            <Icon name={circleDismissSVG} size="16px" ariaHidden="true" />
          </Button>
        </li>
      ))}
      {!expanded && hiddenCount > 0 && (
        <li className="normal">
          <Button
            type="button"
            aria-label={`Show ${hiddenCount} more keywords`}
            onPress={() => setExpanded(true)}
          >
            +{hiddenCount}
          </Button>
        </li>
      )}
    </ul>
  );
};

export default KeywordList;
