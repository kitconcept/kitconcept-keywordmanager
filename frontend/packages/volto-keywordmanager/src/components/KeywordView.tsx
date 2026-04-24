import { Spinner, Table, Button, SearchField } from '@plone/components';
import { DialogTrigger } from 'react-aria-components';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import Pagination from '@plone/volto/components/theme/Pagination/Pagination';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { getParentUrl } from '@plone/volto/helpers/Url/Url';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { searchContent } from '@plone/volto/actions/search/search';
import Error from '@plone/volto/components/theme/Error/Error';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useClient } from '@plone/volto/hooks';
import { deleteKeywords } from 'volto-keywordmanager/actions/keywords';
import DeleteModal from './DeleteModal';

import backSVG from '@plone/volto/icons/back.svg';
import trashSVG from '@plone/volto/icons/delete.svg';

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
  actions: {
    id: 'actions',
    defaultMessage: 'Actions',
  },
});

const KeywordView = (props) => {
  const { location } = props;
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const keywords = useSelector((state) => state.search.subrequests.keywords);
  const dispatch = useDispatch();
  const isClient = useClient();
  const pathname = location.pathname;
  const [selectedKeys, setSelectedKeys] = useState<string | Set<string>>(
    new Set(),
  );
  const selectionCount =
    selectedKeys === 'all' ? keywords.items?.length : selectedKeys?.size;
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const pageSizes = [25, 50, 100];

  const options = useMemo(
    () => ({
      Subject: [id],
      ...(pageSize !== 25 && { b_size: pageSize }),
      ...(currentPage !== 0 && { b_start: currentPage }),
    }),
    [id, pageSize, currentPage],
  );

  useEffect(() => {
    dispatch(searchContent('/', options, 'keywords'));
  }, [dispatch, options]);

  const handleDeleteKeywords = async (kw: string | string[]) => {
    if (typeof kw == 'string') {
      kw = [kw];
    }
    await dispatch(deleteKeywords({ items: kw }));
    await dispatch(searchContent('/', { Subject: [id] }, 'keywords'));
  };

  if (keywords?.loading) {
    return <Spinner label={intl.formatMessage(messages.loading)} />;
  }

  if (keywords?.error?.status) {
    return <Error error={keywords.error} />;
  }

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
              id="Keywords"
              defaultMessage="{num} Keywords"
              values={{ num: keywords?.total }}
            />
          </h2>
          <p>–</p>
          <p>
            {selectionCount < 1 ? (
              <FormattedMessage
                id="no-selected-keywords"
                defaultMessage="No keyword selected"
              />
            ) : (
              <FormattedMessage
                id="number-selected-keywords"
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
                <Icon name={trashSVG} size="20px" />
              </Button>
              <DeleteModal
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
          <div className="search">
            <SearchField />
          </div>
        </div>
      </div>
      <Table
        className="react-aria-Table cmsui-table"
        columns={[
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
          {
            id: 'actions',
            name: intl.formatMessage(messages.actions),
          },
        ]}
        rows={keywords?.items?.map((item) => ({
          id: item['@id'],
          textValue: item.title,
          title: <p>{item.title}</p>,
          type: <p>{item['@type']}</p>,
          state: <p>{item.review_state}</p>,
          actions: (
            <Button onPress={() => handleDeleteKeywords(item['@id'])}>
              <Icon name={trashSVG} size="20px" />
            </Button>
          ),
        }))}
        selectionMode="multiple"
        onSelectionChange={setSelectedKeys}
      />
      {keywords?.total > Math.min(...pageSizes) && (
        <Pagination
          current={currentPage}
          total={Math.ceil(keywords?.total / pageSize)}
          pageSize={pageSize}
          pageSizes={pageSizes}
          onChangePage={(e, { value }) => {
            setCurrentPage(value);
            dispatch(
              searchContent(
                '/',
                {
                  b_size: pageSize,
                  b_start: pageSize * value,
                  Subject: [id],
                },
                'keywords',
              ),
            );
          }}
          onChangePageSize={(e, { value }) => {
            setPageSize(value);
            dispatch(
              searchContent(
                '/',
                { b_size: value, b_start: currentPage, Subject: [id] },
                'keywords',
              ),
            );
          }}
        />
      )}
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

export default KeywordView;
