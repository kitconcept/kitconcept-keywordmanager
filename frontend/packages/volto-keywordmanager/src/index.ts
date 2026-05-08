import type { ConfigType } from '@plone/registry';
import installSettings from './config/settings';
import './theme/main.css';

function applyConfig(config: ConfigType) {
  installSettings(config);

  return config;
}

export default applyConfig;
