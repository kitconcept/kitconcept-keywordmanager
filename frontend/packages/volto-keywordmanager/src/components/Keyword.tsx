import { Spinner, Table, Button } from '@plone/components';
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
  path: {
    id: 'path',
    defaultMessage: 'Path',
  },
  actions: {
    id: 'actions',
    defaultMessage: 'Actions',
  },
});

const KeywordView = (props) => {
  const { location } = props;
  const params = useParams<{ id: string }>();
  const id = params.id;
  const intl = useIntl();
  const keywords = useSelector((state) => state.search.subrequests.keywords);
  const dispatch = useDispatch();
  const isClient = useClient();
  const pathname = location.pathname;
  const [selectedKeys, setSelectedKeys] = useState<string | Set<string>>(
    new Set(),
  );

  useEffect(() => {
    dispatch(searchContent('/', { Subject: [id] }, 'keywords'));
  }, []);

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
      <h1>Hello world</h1>
      <Table
        className="react-aria-Table cmsui-table"
        columns={[
          {
            id: 'title',
            name: intl.formatMessage(messages.title),
            isRowHeader: true,
          },
          {
            id: 'path',
            name: intl.formatMessage(messages.path),
          },
          {
            id: 'actions',
            name: intl.formatMessage(messages.actions),
          },
        ]}
        rows={keywords?.items?.map((item) => ({
          id: item['@id'],
          textValue: item.title,
          title: <p>{item.title}</p>,
          path: <p>{item['@id']}</p>,
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
