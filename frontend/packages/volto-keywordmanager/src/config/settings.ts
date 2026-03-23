import type { ConfigType } from '@plone/registry';
import KeywordManager from 'volto-keywordmanager/components/KeywordManager';
import { keywords } from 'volto-keywordmanager/reducers/keywords';

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
      path: '/controlpanel/keyword-manager',
      component: KeywordManager,
    },
  ];

  config.addonReducers = { ...config.addonReducers, keywords };

  return config;
}
