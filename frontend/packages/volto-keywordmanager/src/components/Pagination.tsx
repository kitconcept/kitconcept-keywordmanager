import { Button } from '@plone/components';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useIntl, defineMessages } from 'react-intl';

import prevSVG from '@plone/volto/icons/left-key.svg';
import nextSVG from '@plone/volto/icons/right-key.svg';
import firstSVG from '@plone/volto/icons/first.svg';
import lastSVG from '@plone/volto/icons/last.svg';

const messages = defineMessages({
  goToPrev: {
    id: 'goToPrev',
    defaultMessage: 'Go to previous page',
  },
  goToNext: {
    id: 'goToNext',
    defaultMessage: 'Go to next page',
  },
  prevPage: {
    id: 'prevPage',
    defaultMessage: 'Previous page',
  },
  nextPage: {
    id: 'nextPage',
    defaultMessage: 'Next page',
  },
  pageNum: {
    id: 'pageNum',
    defaultMessage: 'Page {num}',
  },
  goToPageNum: {
    id: 'goToPageNum',
    defaultMessage: 'Go to page {num}',
  },
  goToFirstPage: {
    id: 'goToFirstPage',
    defaultMessage: 'Go to first page',
  },
  goToLastPage: {
    id: 'goToLastPage',
    defaultMessage: 'Go to last page',
  },
});

interface PaginationProps {
  activePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaControls: string;
  showFirstLastPageIcons?: boolean;
}

export function Pagination(props: PaginationProps) {
  const {
    activePage,
    totalPages,
    onPageChange,
    ariaControls,
    showFirstLastPageIcons,
  } = props;
  const intl = useIntl();
  const isFirstPage = activePage === 1;
  const isLastPage = activePage === totalPages;

  const getVisiblePages = (): number[] => {
    let startPage = Math.max(1, activePage - 2);
    let endPage = Math.min(totalPages, activePage + 2);

    if (activePage <= 3) {
      endPage = Math.min(totalPages, 5);
    }

    if (activePage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Pagination" className="pagination">
      <ul className="pagination-list">
        {showFirstLastPageIcons && (
          <li className="pagination-item">
            <Button
              className="pagination-button pagination-button--first"
              onPress={() => onPageChange(1)}
              isDisabled={isFirstPage}
              aria-controls={ariaControls}
              aria-label={intl.formatMessage(messages.goToFirstPage)}
            >
              <Icon name={firstSVG} size="24px" ariaHidden="true" />
            </Button>
          </li>
        )}

        <li className="pagination-item">
          <Button
            className="pagination-button pagination-button--prev"
            onPress={() => onPageChange(activePage - 1)}
            isDisabled={isFirstPage}
            aria-controls={ariaControls}
            aria-label={intl.formatMessage(messages.goToPrev)}
          >
            <Icon name={prevSVG} size="24px" ariaHidden="true" />
            {intl.formatMessage(messages.prevPage)}
          </Button>
        </li>

        {visiblePages.map((pageNumber) => {
          const isActive = pageNumber === activePage;

          return (
            <li key={pageNumber} className="pagination-item">
              <Button
                className={`pagination-button pagination-button--number ${isActive ? 'pagination-button--active' : ''}`}
                onPress={() => onPageChange(pageNumber)}
                aria-controls={ariaControls}
                aria-label={
                  isActive
                    ? intl.formatMessage(messages.pageNum, {
                        num: pageNumber,
                      })
                    : intl.formatMessage(messages.goToPageNum, {
                        num: pageNumber,
                      })
                }
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}

        <li className="pagination-item">
          <Button
            className="pagination-button pagination-button--next"
            onPress={() => onPageChange(activePage + 1)}
            isDisabled={isLastPage}
            aria-controls={ariaControls}
            aria-label={intl.formatMessage(messages.goToNext)}
          >
            {intl.formatMessage(messages.nextPage)}
            <Icon name={nextSVG} size="24px" ariaHidden="true" />
          </Button>
        </li>

        {showFirstLastPageIcons && (
          <li className="pagination-item">
            <Button
              className="pagination-button pagination-button--last"
              onPress={() => onPageChange(totalPages)}
              isDisabled={isLastPage}
              aria-controls={ariaControls}
              aria-label={intl.formatMessage(messages.goToLastPage)}
            >
              <Icon name={lastSVG} size="24px" ariaHidden="true" />
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
}
