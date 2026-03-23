import { Spinner, Table, Modal } from '@plone/components';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Error from '@plone/volto/components/theme/Error/Error';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { getParentUrl } from '@plone/volto/helpers/Url/Url';
import { useClient } from '@plone/volto/hooks';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getKeywords,
  deleteKeywords,
} from 'volto-keywordmanager/actions/keywords';

import backSVG from '@plone/volto/icons/back.svg';
import replaceSVG from '@plone/volto/icons/replace.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import showSVG from '@plone/volto/icons/show.svg';

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
  const intl = useIntl();
  const dispatch = useDispatch();
  const isClient = useClient();
  const pathname = location.pathname;
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  // selectedKeys can become the string 'all' when the user selects all rows
  // (e.g. via the header checkbox), rather than a Set of individual keys
  const hasSelection = selectedKeys === 'all' || selectedKeys?.size > 0;
  const selectionCount =
    selectedKeys === 'all' ? keywords.items?.length : selectedKeys?.size;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getKeywords());
  }, []);

  const onShowKeyword = (kw) => {
    console.log(`Looking at ${kw}`);
  };

  const onDeleteKeyword = (kw) => {
    console.log(`Delete keyword ${kw}`);
    deleteKeywords(kw);
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
        <h1>
          <FormattedMessage
            id="Keyword Manager"
            defaultMessage="Keyword Manager"
          />
        </h1>
        <p>
          <FormattedMessage
            id="keyword-manager-description"
            defaultMessage="Lorem Ipsum"
          />
        </p>
        <div>
          <h2>Keywords</h2>
          <FormattedMessage
            id="number-selected-keywords"
            defaultMessage="{num} keyword(s) selected"
            values={{
              num: selectionCount,
            }}
          />
          <button disabled={!hasSelection} onClick={() => setIsModalOpen(true)}>
            <Icon name={replaceSVG} />
          </button>
          <button
            disabled={!hasSelection}
            onClick={() =>
              onDeleteKeyword(
                selectedKeys === 'all'
                  ? keywords.items?.map((kw) => kw.name)
                  : [...selectedKeys], // spread into an array since selectedKeys is a Set()
              )
            }
          >
            <Icon name={trashSVG} />
          </button>
        </div>
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} isDismissable>
          <h2>Hello world!</h2>
        </Modal>
        <Table
          className="react-aria-Table cmsui-table"
          columns={[
            {
              id: 'keyword',
              name: intl.formatMessage(messages.keyword),
              isRowHeader: true,
            },
            {
              id: 'occurrence',
              name: intl.formatMessage(messages.occurrence),
            },
            {
              id: 'actions',
              name: intl.formatMessage(messages.actions),
            },
          ]}
          rows={keywords.items?.map((kw) => ({
            id: kw.name,
            textValue: kw.name,
            keyword: kw.name,
            occurrence: kw.total,
            actions: (
              <>
                <button
                  disabled={hasSelection}
                  onClick={() => onShowKeyword(kw.name)}
                >
                  <Icon name={showSVG} />
                </button>
                <button
                  disabled={hasSelection}
                  onClick={() => onDeleteKeyword(kw.name)}
                >
                  <Icon name={trashSVG} />
                </button>
              </>
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
    )
  );
};

export default KeywordManager;
