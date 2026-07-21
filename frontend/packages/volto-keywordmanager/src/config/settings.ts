import type { ConfigType } from '@plone/registry';
import KeywordManager from '@kitconcept/volto-keywordmanager/components/KeywordManager';
import { keywords } from '@kitconcept/volto-keywordmanager/reducers/keywords';
import { keywordIndexes } from '@kitconcept/volto-keywordmanager/reducers/keywordIndexes';
import KeywordView from '@kitconcept/volto-keywordmanager/components/KeywordView';

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
      path: '/controlpanel/keyword-manager/:keywordIndex/:id',
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
