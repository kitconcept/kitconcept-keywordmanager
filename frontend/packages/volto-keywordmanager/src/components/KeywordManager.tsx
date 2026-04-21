import {
  Spinner,
  Table,
  Modal,
  Button,
  RadioGroup,
  Radio,
  TextField,
  Select,
} from '@plone/components';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Error from '@plone/volto/components/theme/Error/Error';
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

import backSVG from '@plone/volto/icons/back.svg';
import replaceSVG from '@plone/volto/icons/replace.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import showSVG from '@plone/volto/icons/show.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import sortUpSVG from '@plone/volto/icons/sort-up.svg';
import sortDownSVG from '@plone/volto/icons/sort-down.svg';

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
  const [selectedKeys, setSelectedKeys] = useState<string | Set<string>>(
    new Set(),
  );
  const selectionCount =
    selectedKeys === 'all' ? keywords.items?.length : selectedKeys?.size;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedRadio, setSelectedRadio] = useState<string>('select');
  const [name, setName] = useState<null | string>(null);
  const [keywordIndex, setKeywordIndex] = useState<string>('Subject');
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const pageSizes = [25, 50, 100];
  // Sorting
  const [sortOn, setSortOn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const options = useMemo(
    () => ({
      ...(pageSize !== 25 && { batchSize: pageSize }),
      ...(currentPage !== 0 && { batchStart: currentPage }),
      ...(keywordIndex !== 'Subject' && { idx: keywordIndex }),
      ...(sortOrder && { sortOrder: sortOrder }),
      ...(sortOn && { sortOn: sortOn }),
    }),
    [pageSize, currentPage, keywordIndex, sortOrder, sortOn],
  );

  useEffect(() => {
    dispatch(getKeywords(options));
    dispatch(getKeywordIndexes());
  }, [dispatch, options]);

  const handleSorting = (value: string) => {
    if (sortOn !== value) {
      setSortOn(value);
      setSortOrder('ascending');
      return;
    }
    if (value === 'alphabetical') setSortOn(value);
    if (value === 'frequency') setSortOn(value);
    if (!sortOrder) {
      setSortOrder('ascending');
    } else if (sortOrder === 'ascending') {
      setSortOrder('descending');
    } else if (sortOrder === 'descending') {
      setSortOrder('');
      setSortOn('');
    }
  };

  const handleDeleteKeywords = async (kw: string | string[]) => {
    if (typeof kw == 'string') {
      kw = [kw];
    }
    await dispatch(deleteKeywords({ items: kw, indexName: keywordIndex }));
    await dispatch(getKeywords(options));
  };

  const handleUpdateKeywords = async (kw: string, olds: string[]) => {
    await dispatch(
      updateKeywords({
        new_keyword: kw,
        old_keywords: olds,
        indexName: keywordIndex,
      }),
    );
    await dispatch(getKeywords(options));
  };

  if (keywords.loading) {
    return <Spinner label={intl.formatMessage(messages.loading)} />;
  }

  if (keywords?.error?.status) {
    return <Error error={keywords.error} />;
  }

  return (
    keywords.loaded && (
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
            defaultMessage="The Keyword Manager allows you to maintain the keywords used in your intranet. Start by selecting the keyword field you want to manage. You can then sort, filter, rename, merge, or delete individual keywords."
          />
        </p>
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
        <div className="table-heading">
          <div className="info">
            <h2>
              <FormattedMessage id="Keywords" defaultMessage="Keywords" />
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
              <Button
                isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
                onPress={() => setIsModalOpen(true)}
              >
                <Icon name={replaceSVG} size="20px" />
              </Button>
              <Button
                isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
                onPress={() => setIsConfirmModalOpen(true)}
              >
                <Icon name={trashSVG} size="20px" />
              </Button>
            </div>
          </div>
        </div>
        <Modal
          className="rename-modal"
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        >
          <div className="modal-header">
            <h2>
              <FormattedMessage
                id="rename-modal-title"
                defaultMessage="Rename & merge keyword(s)"
              />
            </h2>
            <Button
              onPress={() => {
                setIsModalOpen(false);
                setName(null);
              }}
            >
              <Icon name={clearSVG} size="20px" />
            </Button>
          </div>
          <div className="modal-body">
            <p>
              <FormattedMessage
                id="rename-modal-description"
                defaultMessage="You are about to rename {num} selected keyword(s). This action cannot be undone. Either select one of the existing keywords to keep or enter a new name to replace all selected keywords."
                values={{
                  num: <strong>{selectionCount}</strong>,
                }}
              />
            </p>
            <RadioGroup
              defaultValue="select"
              value={selectedRadio}
              onChange={setSelectedRadio}
            >
              <div className="react-aria-Radio-wrapper">
                <Radio value="select" />
                <Select
                  isDisabled={selectedRadio !== 'select'}
                  label="Select existing keyword to keep:"
                  selectionMode="single"
                  placeholder="Please select ..."
                  onChange={setName}
                  items={
                    selectedKeys === 'all'
                      ? keywords.items?.map((kw) => ({
                          label: kw.name,
                          value: kw.name,
                        }))
                      : [...selectedKeys].map((kw) => ({
                          label: kw,
                          value: kw,
                        }))
                  }
                />
              </div>
              <div className="react-aria-Radio-wrapper">
                <Radio value="text" />
                <TextField
                  isDisabled={selectedRadio !== 'text'}
                  label="New keyword name:"
                  placeholder="Please enter new name"
                  onChange={setName}
                />
              </div>
            </RadioGroup>
          </div>
          <div className="modal-actions">
            <Button
              onPress={() => {
                setIsModalOpen(false);
                setName(null);
              }}
            >
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              isDisabled={name === null}
              onPress={() => {
                handleUpdateKeywords(
                  name,
                  selectedKeys === 'all'
                    ? keywords.items?.map((kw) => kw.name)
                    : [...selectedKeys],
                );
                setIsModalOpen(false);
                setSelectedKeys(new Set());
              }}
            >
              <FormattedMessage
                id="Rename & Merge"
                defaultMessage="Rename & Merge"
              />
            </Button>
          </div>
        </Modal>
        <Modal
          className="confirm-modal"
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
        >
          <div className="modal-header">
            <h2>
              <FormattedMessage
                id="confirm-modal-title"
                defaultMessage="Delete keyword(s)"
              />
            </h2>
            <Button
              onPress={() => {
                setIsConfirmModalOpen(false);
              }}
            >
              <Icon name={clearSVG} />
            </Button>
          </div>
          <div className="modal-body">
            <p>
              <FormattedMessage
                id="confirm-modal-description"
                defaultMessage="You are about to delete {num} selected keyword(s). This action cannot be undone. Are you sure you want to proceed?"
                values={{
                  num: <strong>{selectionCount}</strong>,
                }}
              />
            </p>
          </div>
          <div className="modal-actions">
            <Button
              onPress={() => {
                setIsConfirmModalOpen(false);
              }}
            >
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              onPress={() => {
                handleDeleteKeywords(
                  selectedKeys === 'all'
                    ? keywords.items?.map((kw) => kw.name)
                    : [...selectedKeys], // spread into an array since selectedKeys is a Set()
                );
                setIsConfirmModalOpen(false);
                setSelectedKeys(new Set());
              }}
            >
              <FormattedMessage id="Delete" defaultMessage="Delete" />
            </Button>
          </div>
        </Modal>
        <Table
          className="react-aria-Table cmsui-table"
          columns={[
            {
              id: 'keyword',
              name: (
                <div>
                  <p>{intl.formatMessage(messages.keyword)}</p>
                  <Button onPress={() => handleSorting('alphabetical')}>
                    <Icon
                      name={
                        sortOn === 'alphabetical' && sortOrder === 'ascending'
                          ? sortDownSVG
                          : sortUpSVG
                      }
                      size="20px"
                    />
                  </Button>
                </div>
              ),
              isRowHeader: true,
            },
            {
              id: 'occurrence',
              name: (
                <div>
                  <p>{intl.formatMessage(messages.occurrence)}</p>
                  <Button onPress={() => handleSorting('frequency')}>
                    <Icon
                      name={
                        sortOn === 'frequency' && sortOrder === 'ascending'
                          ? sortDownSVG
                          : sortUpSVG
                      }
                      size="20px"
                    />
                  </Button>
                </div>
              ),
            },
            {
              id: 'actions',
              name: <p>{intl.formatMessage(messages.actions)}</p>,
            },
          ]}
          rows={keywords.items?.map((kw) => ({
            id: kw.name,
            textValue: kw.name,
            keyword: <p>{kw.name}</p>,
            occurrence: <p>{kw.total}</p>,
            actions: (
              <div>
                <UniversalLink
                  href={`${pathname}/${kw.name}`}
                  openLinkInNewTab={true}
                >
                  <Icon name={showSVG} size="20px" />
                </UniversalLink>
                <Button onPress={() => handleDeleteKeywords(kw.name)}>
                  <Icon name={trashSVG} size="20px" />
                </Button>
              </div>
            ),
          }))}
          selectionMode="multiple"
          onSelectionChange={setSelectedKeys}
        />
        {keywords?.items_total > Math.min(...pageSizes) && (
          <Pagination
            current={currentPage}
            total={Math.ceil(keywords?.items_total / pageSize)}
            pageSize={pageSize}
            pageSizes={pageSizes}
            onChangePage={(e, { value }) => {
              setCurrentPage(value);
              dispatch(
                getKeywords({
                  batchSize: pageSize,
                  batchStart: pageSize * value,
                  ...(keywordIndex !== 'Subject' && { index: keywordIndex }),
                }),
              );
            }}
            onChangePageSize={(e, { value }) => {
              setPageSize(value);
              dispatch(
                getKeywords({
                  batchSize: value,
                  batchStart: currentPage,
                  ...(keywordIndex !== 'Subject' && { index: keywordIndex }),
                }),
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
    )
  );
};

export default KeywordManager;
