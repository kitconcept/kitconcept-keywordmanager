import { Spinner } from '@plone/components';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { getParentUrl } from '@plone/volto/helpers/Url/Url';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getKeywords } from 'volto-keywordmanager/actions/keywords';
import Error from '@plone/volto/components/theme/Error/Error';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useClient } from '@plone/volto/hooks';

import backSVG from '@plone/volto/icons/back.svg';

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
});

const KeywordView = (props) => {
  const { location } = props;
  const params = useParams<{ id: string }>();
  const id = params.id;
  const intl = useIntl();
  const keywords = useSelector((state) => state.keywords);
  const dispatch = useDispatch();
  const isClient = useClient();
  const pathname = location.pathname;
  const options = {
    id: id,
  };

  useEffect(() => {
    dispatch(getKeywords(options));
  }, []);

  if (keywords.loading) {
    return <Spinner label={intl.formatMessage(messages.loading)} />;
  }

  if (keywords?.error?.status) {
    return <Error error={keywords.error} />;
  }

  return (
    <>
      <h1>Hello world</h1>
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
    </>
  );
};

export default KeywordView;
