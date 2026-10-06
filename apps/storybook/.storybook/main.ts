import type { StorybookConfig } from '@storybook/react-vite';

// All stories live in this app, never in packages/react (brief §5).
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
};

export default config;
