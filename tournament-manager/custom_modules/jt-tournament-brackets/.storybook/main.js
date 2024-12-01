module.exports = {};
// .storybook/main.js

const path = require('path');
const aliases = require('../scripts/aliases');
const ROOT_DIR = path.resolve(__dirname, '../');
const SRC_DIR = path.resolve(ROOT_DIR, '/src');

// Export a function. Accept the base config as the only param.
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: [/\.stories\.jsx?$/],
          include: [SRC_DIR], // You can specify directories
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
        },
      },
    },
  ],

  docs: {
    autodocs: true,
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};
