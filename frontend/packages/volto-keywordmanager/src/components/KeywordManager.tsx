import type { SortDescriptor, Selection } from 'react-aria-components';
import { Table, TableHeader, TableBody } from 'react-aria-components';
import { Column, Row, Cell, Collection } from 'react-aria-components';
import { Checkbox, Spinner, Button, Select } from '@plone/components';
import { DialogTrigger } from '@plone/components';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import Pagination from '@plone/volto/components/theme/Pagination/Pagination';
import { getParentUrl } from '@plone/volto/helpers/Url/Url';
import { useClient } from '@plone/volto/hooks';
import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getKeywords,
  deleteKeywords,
  updateKeywords,
} from 'volto-keywordmanager/actions/keywords';
import { getKeywordIndexes } from 'volto-keywordmanager/actions/keywordIndexes';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import RenameModal from './RenameModal';
import DeleteModal from './DeleteModal';

import backSVG from '@plone/volto/icons/back.svg';
import editSVG from '@plone/volto/icons/pencil.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import showSVG from '@plone/volto/icons/show.svg';
import sortUpSVG from '@plone/volto/icons/sort-up.svg';
import sortDownSVG from '@plone/volto/icons/sort-down.svg';
import { toast } from 'react-toastify';
import { Toast } from '@plone/components';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  loading: {
    id: 'loading',
    defaultMessage: 'Loading',
  },
  keyword: {
    id: 'Keyword',
    defaultMessage: 'Keyword',
  },
  occurrence: {
    id: 'Occurrence',
    defaultMessage: 'Occurrence',
  },
  actions: {
    id: 'Actions',
    defaultMessage: 'Actions',
  },
});

const KeywordManager = (props) => {
  const { location } = props;
  const keywords = useSelector((state) => state.keywords);
  const keywordIndexes = useSelector((state) => state.keywordIndexes);
  const intl = useIntl();
  const dispatch = useDispatch();
  const isClient = useClient();
  const pathname = location.pathname;
  // selectedKeys can become the string 'all' when the user selects all rows
  // (e.g. via the header checkbox), rather than a Set of individual keys
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const selectionCount =
    selectedKeys === 'all' ? keywords.items?.length : selectedKeys?.size;
  const [keywordIndex, setKeywordIndex] = useState<string>('Subject');
  // Sorting
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const sortOn = sortDescriptor?.column;
  const sortOrder = sortDescriptor?.direction;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const options = useMemo(
    () => ({
      ...(keywordIndex !== 'Subject' && { idx: keywordIndex }),
      ...(sortOrder && { sortOrder: sortOrder }),
      ...(sortOn && { sortOn: sortOn }),
    }),
    [keywordIndex, sortOrder, sortOn],
  );

  useEffect(() => {
    dispatch(getKeywords(options));
    dispatch(getKeywordIndexes());
  }, [dispatch, options]);

  const columns = [
    {
      id: 'keyword',
      name: (
        <>
          {intl.formatMessage(messages.keyword)}
          <Icon
            className={sortOn === 'keyword' && 'active'}
            name={sortOrder === 'descending' ? sortDownSVG : sortUpSVG}
            size="20px"
            ariaHidden="true"
          />
        </>
      ),
      isRowHeader: true,
      allowsSorting: true,
    },
    {
      id: 'occurrence',
      name: (
        <>
          {intl.formatMessage(messages.occurrence)}
          <Icon
            className={sortOn === 'occurrence' && 'active'}
            name={sortOrder === 'descending' ? sortDownSVG : sortUpSVG}
            size="20px"
            ariaHidden="true"
          />
        </>
      ),
      allowsSorting: true,
    },
    {
      id: 'actions',
      name: intl.formatMessage(messages.actions),
    },
  ];

  const rows = keywords.items?.map((kw) => ({
    id: kw.name,
    textValue: kw.name,
    keyword: kw.name,
    occurrence: kw.total,
    actions: (
      <div>
        <UniversalLink
          href={`${pathname}/${keywordIndex}/${kw.name}`}
          openLinkInNewTab={true}
        >
          <Icon name={showSVG} size="20px" />
        </UniversalLink>
        <Button onPress={() => handleDeleteKeywords(kw.name)}>
          <Icon name={trashSVG} size="20px" />
        </Button>
      </div>
    ),
  }));

  const handleSortChange = (newDescriptor: SortDescriptor) => {
    if (
      newDescriptor.column === sortDescriptor?.column &&
      sortDescriptor?.direction === 'descending'
    ) {
      setSortDescriptor(undefined);
    } else {
      setSortDescriptor(newDescriptor);
    }
  };

  const handleDeleteKeywords = async (kw: string | string[]) => {
    if (typeof kw == 'string') {
      kw = [kw];
    }
    setIsLoading(true);
    try {
      await dispatch(deleteKeywords({ items: kw, indexName: keywordIndex }));
      toast.success(
        <Toast title="Delete Success" content="Deleted successfully!" />,
      );
    } catch (error) {
      toast.error(
        <Toast error title="Delete Failed" content="Could not delete." />,
      );
    } finally {
      setIsLoading(false);
    }
    dispatch(getKeywords(options));
  };

  const handleUpdateKeywords = async (kw: string, olds: string[]) => {
    setIsLoading(true);
    try {
      await dispatch(
        updateKeywords({
          new_keyword: kw,
          old_keywords: olds,
          indexName: keywordIndex,
        }),
      );
      toast.success(
        <Toast title="Update Success" content="Updated successfully!" />,
      );
    } catch (error) {
      toast.error(
        <Toast error title="Update Failed" content="Could not update." />,
      );
    } finally {
      setIsLoading(false);
    }
    dispatch(getKeywords(options));
  };

  return (
    <div
      id="page-keyword_manager"
      className="ui container controlpanel-keyword-manager"
    >
      <h1 className="title">
        <FormattedMessage
          id="Keyword Manager"
          defaultMessage="Keyword Manager"
        />
      </h1>
      <p className="description">
        <FormattedMessage
          id="keyword-manager-description"
          defaultMessage="The Keyword Manager allows you to maintain the keywords used in your website. Start by selecting the keyword field you want to manage. You can then sort, filter, rename, merge, or delete individual keywords."
        />
      </p>
      {keywordIndexes?.items?.length > 1 && (
        <div>
          <p>
            <FormattedMessage
              id="keyword-field"
              defaultMessage="Keyword field: "
            />
          </p>
          <Select
            selectionMode="single"
            value={keywordIndex}
            onChange={setKeywordIndex}
            items={keywordIndexes?.items.map((idx) => ({
              label: idx,
              value: idx,
            }))}
          />
        </div>
      )}
      <div className="table-heading">
        <div className="info">
          <h2>
            <FormattedMessage id="Keywords" defaultMessage="Keywords" />
          </h2>
          <p>–</p>
          <p>
            {selectionCount < 1 ? (
              <FormattedMessage
                id="no-keyword-selected"
                defaultMessage="No keyword selected"
              />
            ) : (
              <FormattedMessage
                id="number-keywords-selected"
                defaultMessage="{num} keyword(s) selected"
                values={{
                  num: selectionCount,
                }}
              />
            )}
          </p>
        </div>
        <div className="tools">
          <div className="bulk-actions">
            <DialogTrigger>
              <Button
                isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
              >
                <Icon name={editSVG} size="20px" />
              </Button>
              <RenameModal
                isLoading={isLoading}
                selectionCount={selectionCount}
                selectedKeys={selectedKeys}
                keywords={keywords}
                onConfirm={(newName, oldNames) => {
                  handleUpdateKeywords(newName, oldNames);
                  setSelectedKeys(new Set());
                }}
              />
            </DialogTrigger>

            <DialogTrigger>
              <Button
                isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
              >
                <Icon name={trashSVG} size="20px" />
              </Button>
              <DeleteModal
                isLoading={isLoading}
                selectionCount={selectionCount}
                selectedKeys={selectedKeys}
                keywords={keywords}
                onConfirm={(keys) => {
                  handleDeleteKeywords(keys);
                  setSelectedKeys(new Set());
                }}
              />
            </DialogTrigger>
          </div>
        </div>
      </div>
      <Table
        className="react-aria-Table cmsui-table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={columns}>
          <Column>
            <Checkbox slot="selection" />
          </Column>
          <Collection items={columns}>
            {(column) => (
              <Column
                isRowHeader={column.isRowHeader}
                allowsSorting={column.allowsSorting}
              >
                {column.name}
              </Column>
            )}
          </Collection>
        </TableHeader>
        <TableBody
          items={rows}
          renderEmptyState={() =>
            keywords.loading ? (
              <Spinner aria-label={intl.formatMessage(messages.loading)} />
            ) : (
              'No results found.'
            )
          }
        >
          {(item) => (
            <Row columns={columns} textValue={item.textValue}>
              <Cell>
                <Checkbox slot="selection" />
              </Cell>
              <Collection items={columns}>
                {(column) => <Cell>{item[column.id]}</Cell>}
              </Collection>
            </Row>
          )}
        </TableBody>
      </Table>
      {isClient &&
        createPortal(
          <Toolbar
            pathname={pathname}
            hideDefaultViewButtons
            inner={
              <Link to={getParentUrl(pathname)} className="item">
                <Icon
                  name={backSVG}
                  className="contents circled"
                  size="30px"
                  title={intl.formatMessage(messages.back)}
                />
              </Link>
            }
          />,
          document.getElementById('toolbar') as HTMLElement,
        )}
    </div>
  );
};

export default KeywordManager;
