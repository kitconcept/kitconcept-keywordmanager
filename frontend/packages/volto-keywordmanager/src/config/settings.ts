import type { ConfigType } from '@plone/registry';
import KeywordManager from 'volto-keywordmanager/components/KeywordManager';
import { keywords } from 'volto-keywordmanager/reducers/keywords';
import { keywordIndexes } from 'volto-keywordmanager/reducers/keywordIndexes';
import KeywordView from 'volto-keywordmanager/components/KeywordView';

export default function install(config: ConfigType) {
  config.settings.controlpanels = [
    ...config.settings.controlpanels,
    {
      '@id': '/keyword-manager',
      group: 'Content',
      title: 'Keyword Manager',
    },
  ];

  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/controlpanel/keyword-manager/:id',
      component: KeywordView,
    },
    {
      path: '/controlpanel/keyword-manager',
      component: KeywordManager,
    },
  ];

  config.addonReducers = { ...config.addonReducers, keywords, keywordIndexes };

  return config;
}
