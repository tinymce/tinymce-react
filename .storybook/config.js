import { configure } from '@storybook/react';
import '@storybook/addon-console';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
