import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/tokens.css';

/** Desktop grid max-width (matches --screen-max-width: 1200px). Wraps every story for a realistic view. */
const STORY_MAX_WIDTH = 1200;
const STORY_PADDING = 24;

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: STORY_MAX_WIDTH,
          margin: '0 auto',
          padding: STORY_PADDING,
          width: '100%',
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
