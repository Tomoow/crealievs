import type { StorybookConfig } from '@storybook/react-vite';

/** Base path for GitHub Pages: /repo-name/ when GITHUB_REPOSITORY is set (e.g. in CI). */
const base =
  typeof process.env.GITHUB_REPOSITORY === 'string'
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['static'],
  viteFinal: (config) => ({
    ...config,
    base,
  }),
};

export default config;
