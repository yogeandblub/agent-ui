import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    // Fail stories on accessibility violations rather than just reporting them (brief §3.10, §14).
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
