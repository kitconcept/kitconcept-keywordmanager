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
  updateKeywords,
} from 'volto-keywordmanager/actions/keywords';
import { getKeywordIndexes } from 'volto-keywordmanager/actions/keywordindexes';

import backSVG from '@plone/volto/icons/back.svg';
import replaceSVG from '@plone/volto/icons/replace.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import showSVG from '@plone/volto/icons/show.svg';
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
  const [index, setIndex] = useState<string>('Subject');

  useEffect(() => {
    dispatch(getKeywords());
    dispatch(getKeywordIndexes());
  }, []);

  const onShowKeyword = (kw: string) => {
    console.log(`Looking at ${kw}`);
  };

  const handleDeleteKeywords = async (kw: string | Array<string>) => {
    await dispatch(deleteKeywords({ items: kw }));
    dispatch(getKeywords());
  };

  const handleUpdateKeywords = async (kw: string, olds: Array<string>) => {
    await dispatch(updateKeywords({ new_keyword: kw, old_keywords: olds }));
    dispatch(getKeywords());
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
          {keywordIndexes?.items.length > 1 && (
            <Select
              label="Keyword field:"
              selectionMode="single"
              value={index}
              onChange={setIndex}
              items={keywordIndexes?.items.map((idx) => ({
                label: idx,
                value: idx,
              }))}
            />
          )}
        </div>
        <div>
          <h2>Keywords</h2>
          <FormattedMessage
            id="number-selected-keywords"
            defaultMessage="{num} keyword(s) selected"
            values={{
              num: selectionCount,
            }}
          />
          <Button
            isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
            onPress={() => setIsModalOpen(true)}
          >
            <Icon name={replaceSVG} />
          </Button>
          <Button
            isDisabled={selectedKeys !== 'all' && selectedKeys?.size === 0}
            onPress={() => setIsConfirmModalOpen(true)}
          >
            <Icon name={trashSVG} />
          </Button>
        </div>
        <Modal
          className="rename-modal"
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        >
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
            <Icon name={clearSVG} />
          </Button>
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
          <div>
            <Button
              onPress={() => {
                setIsModalOpen(false);
                setName(null);
              }}
            >
              Cancel
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
              Rename & merge
            </Button>
          </div>
        </Modal>
        <Modal
          className="confirm-modal"
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
        >
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
                setIsConfirmModalOpen(false);
              }}
            >
              Cancel
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
              Delete
            </Button>
          </div>
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
                <Button onPress={() => onShowKeyword(kw.name)}>
                  <Icon name={showSVG} />
                </Button>
                <Button onPress={() => handleDeleteKeywords(kw.name)}>
                  <Icon name={trashSVG} />
                </Button>
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
