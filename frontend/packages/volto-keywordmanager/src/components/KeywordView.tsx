import { Spinner, Table, Button, Modal } from '@plone/components';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useEffect, useState } from 'react';
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

import backSVG from '@plone/volto/icons/back.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

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
    id: 'title',
    defaultMessage: 'Title',
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(searchContent('/', { Subject: [id] }, 'keywords'));
  }, [dispatch, id]);

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
      <h1>
        <FormattedMessage
          id="keyword-name"
          defaultMessage="{name}"
          values={{ name: id }}
        />
      </h1>
      <div className="tools">
        <div className="bulk-actions">
          <Button
            isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
            onPress={() => setIsModalOpen(true)}
          >
            <Icon name={trashSVG} size="20px" />
          </Button>
        </div>
      </div>
      <Modal
        className="confirm-modal"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <h2>
          <FormattedMessage
            id="confirm-modal-title"
            defaultMessage="Delete keyword(s)"
          />
        </h2>
        <Button
          onPress={() => {
            setIsModalOpen(false);
          }}
        >
          <Icon name={clearSVG} />
        </Button>
        <p>
          <FormattedMessage
            id="confirm-modal-description"
            defaultMessage="You are about to delete {num} selected keyword(s). This action cannot be undone. Are you sure you want to proceed?"
            values={{
              num: <strong>{selectionCount}</strong>,
            }}
          />
        </p>
        <div>
          <Button
            onPress={() => {
              setIsModalOpen(false);
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
              setIsModalOpen(false);
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
