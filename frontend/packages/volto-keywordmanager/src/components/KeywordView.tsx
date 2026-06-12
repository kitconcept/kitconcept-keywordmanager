import { Button, SearchField, Select, Spinner } from '@plone/components';
import { Table, TableHeader, TableBody, Row } from 'react-aria-components';
import { Column, Collection, Cell } from 'react-aria-components';
import { Checkbox } from '@plone/components';
import { searchContent } from '@plone/volto/actions/search/search';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Pagination } from './Pagination';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { useClient } from '@plone/volto/hooks';
import { useEffect, useMemo, useState } from 'react';
import { DialogTrigger } from '@plone/components';
import { createPortal } from 'react-dom';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { deleteKeywords } from 'volto-keywordmanager/actions/keywords';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';
import { Toast } from '@plone/components';

import { getVocabulary } from '@plone/volto/actions/vocabularies/vocabularies';
import backSVG from '@plone/volto/icons/back.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import searchSVG from '@plone/volto/icons/zoom.svg';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import KeywordList from './KeywordList';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  loading: {
    id: 'loading',
    defaultMessage: 'Loading',
  },
  title: {
    id: 'title-path',
    defaultMessage: 'Title / Path',
  },
  type: {
    id: 'type',
    defaultMessage: 'Type',
  },
  state: {
    id: 'state',
    defaultMessage: 'State',
  },
  selectTypePlaceholder: {
    id: 'All types',
    defaultMessage: 'All types',
  },
  selectStatePlaceholder: {
    id: 'All states',
    defaultMessage: 'All states',
  },
  searchFieldPlaceholder: {
    id: 'search',
    defaultMessage: 'Search',
  },
});

const KeywordView = (props) => {
  const { location } = props;
  const { keywordIndex, id } = useParams<{
    keywordIndex: string;
    id: string;
  }>();
  const intl = useIntl();
  const keywords = useSelector((state) => state.search.subrequests.keywords);
  const types = useSelector(
    (state) =>
      state.vocabularies['plone.app.vocabularies.ReallyUserFriendlyTypes'],
  );
  const states = useSelector(
    (state) => state.vocabularies['plone.app.vocabularies.WorkflowStates'],
  );
  const dispatch = useDispatch();
  const isClient = useClient();
  const pathname = location.pathname;
  const [selectedKeys, setSelectedKeys] = useState<string | Set<string>>(
    new Set(),
  );
  const selectionCount =
    selectedKeys === 'all' ? keywords.items?.length : selectedKeys?.size;
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;
  const totalPages = Math.ceil(keywords?.total / pageSize);
  const [selectedTypes, setSelectedTypes] = useState<[]>([]);
  const [selectedStates, setSelectedStates] = useState<[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const options = useMemo(
    () => ({
      [keywordIndex]: [id],
      metadata_fields: keywordIndex,
      b_size: pageSize,
      b_start: (currentPage - 1) * pageSize,
      ...(selectedTypes.length > 0 && { portal_type: selectedTypes }),
      ...(selectedStates.length > 0 && { review_state: selectedStates }),
      ...(search && { SearchableText: search }),
    }),
    [
      keywordIndex,
      id,
      selectedTypes,
      selectedStates,
      search,
      pageSize,
      currentPage,
    ],
  );

  useEffect(() => {
    dispatch(searchContent('/', options, 'keywords'));
    dispatch(
      getVocabulary({
        vocabNameOrURL: 'plone.app.vocabularies.ReallyUserFriendlyTypes',
      }),
    );
    dispatch(
      getVocabulary({
        vocabNameOrURL: 'plone.app.vocabularies.WorkflowStates',
      }),
    );
  }, [dispatch, options]);

  const columns = [
    {
      id: 'title',
      name: intl.formatMessage(messages.title),
      isRowHeader: true,
    },
    {
      id: 'type',
      name: intl.formatMessage(messages.type),
    },
    { id: 'state', name: intl.formatMessage(messages.state) },
  ];

  const rows = keywords?.items?.map((obj) => ({
    id: obj['@id'],
    textValue: obj.title,
    title: (
      <>
        <UniversalLink href={obj['@id'] || '/'}>{obj.title}</UniversalLink>
        <br />
        <span hidden>Path: </span>
        <span>{flattenToAppURL(obj['@id']) || '/'}</span>
        <KeywordList
          keywords={obj[keywordIndex]}
          currentId={id}
          onDelete={(item) => handleDeleteKeywords(item, obj['@id'])}
        />
      </>
    ),
    type: obj.type_title,
    state: (
      <FormattedMessage
        id={
          states?.items?.find((item) => item.value === obj.review_state)
            ?.label ?? 'no workflow state'
        }
      />
    ),
  }));

  const handleDeleteKeywords = async (kw: string | string[], id?: string) => {
    if (typeof kw == 'string') {
      kw = [kw];
    }
    setIsLoading(true);
    try {
      await dispatch(
        deleteKeywords({ items: kw, path: id, indexName: keywordIndex }),
      );
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
    dispatch(searchContent('/', options, 'keywords'));
  };

  return (
    <div
      id="page-keyword_manager"
      className="ui container controlpanel-keyword-manager"
    >
      <h1 className="title">
        <FormattedMessage
          id="keyword-name"
          defaultMessage='Manage Contents For Keyword "{name}"'
          values={{ name: id }}
        />
      </h1>
      <div className="table-heading">
        <div className="info">
          <h2>
            <FormattedMessage
              id="Contents"
              defaultMessage="{num} Contents"
              values={{ num: keywords?.total }}
            />
          </h2>
          <p>–</p>
          <p>
            {selectionCount < 1 ? (
              <FormattedMessage
                id="no-content-selected"
                defaultMessage="No content selected"
              />
            ) : (
              <FormattedMessage
                id="number-contents-selected"
                defaultMessage="{num} content(s) selected"
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
                <Icon name={trashSVG} size="20px" />
              </Button>
              <DeleteModal
                isLoading={isLoading}
                selectionCount={selectionCount}
                selectedKeys={selectedKeys}
                keywords={keywords}
                onConfirm={(keys) => {
                  keys.forEach((key) => handleDeleteKeywords(id, key));
                  setSelectedKeys(new Set());
                }}
              />
            </DialogTrigger>
          </div>
          <div className="filtering">
            <Select
              selectionMode="multiple"
              placeholder={intl.formatMessage(messages.selectTypePlaceholder)}
              onChange={setSelectedTypes}
              items={types?.items?.map((item) => ({
                label: item.value,
                value: <FormattedMessage id={item.label} />,
              }))}
            />
            <Select
              selectionMode="multiple"
              placeholder={intl.formatMessage(messages.selectStatePlaceholder)}
              onChange={setSelectedStates}
              items={states?.items?.map((item) => ({
                label: item.value,
                value: <FormattedMessage id={item.label} />,
              }))}
            />
            <div className="search">
              <SearchField
                placeholder={intl.formatMessage(
                  messages.searchFieldPlaceholder,
                )}
                onSubmit={setSearch}
              />
              <Button>
                <Icon name={searchSVG} size="20px" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Table
        className="react-aria-Table cmsui-table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          <Column>
            <Checkbox slot="selection" />
          </Column>
          <Collection items={columns}>
            {(column) => (
              <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
            )}
          </Collection>
        </TableHeader>
        <TableBody
          items={rows}
          renderEmptyState={() =>
            keywords?.loading ? (
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
      {totalPages > 1 && (
        <Pagination
          activePage={currentPage}
          totalPages={totalPages}
          onPageChange={(value) => {
            setCurrentPage(value);
            dispatch(searchContent('/', options, 'keywords'));
          }}
          ariaControls="keywords"
        />
      )}
      {isClient &&
        createPortal(
          <Toolbar
            pathname={pathname}
            hideDefaultViewButtons
            inner={
              <Link to={'/controlpanel/keyword-manager'} className="item">
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

export default KeywordView;
