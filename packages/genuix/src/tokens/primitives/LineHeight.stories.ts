/* #human-slop
 * https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite';
import {
  h,
} from 'vue';

const heights = [
  {
    token: '--leading-tight',
    label: 'leading-tight (1.12)',
  },
  {
    token: '--leading-normal',
    label: 'leading-normal (1.5)',
  },
  {
    token: '--leading-relaxed',
    label: 'leading-relaxed (1.65)',
  },
  {
    token: '--leading-loose',
    label: 'leading-loose (1.7)',
  },
];

function Preview () {
  return h(
    'div',
    {
      style: 'display: flex; flex-direction: column; gap: 16px;',
    },
    heights.map((height) =>
      h('div', {
        style: 'display: flex; align-items: center; gap: 12px;',
      }, [
        h('code', {
          style: 'font-size: 12px; color: #666; min-width: 200px;',
        }, height.label),
        h('div', {
          style: `
            line-height: var(${height.token});
            font-size: 14px;
            background: rgba(0,0,0,0.05);
            padding: 0 8px;
          `,
        }, 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.'),
      ])),
  );
}

const meta = {
  title: 'Tokens/Primitives/Line height',
  tags: [],
  parameters: {
    docs: {
      description: {
        component: 'Unitless line height ratios, synced with Typerighter',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Unitless line height ratios.',
      },
    },
  },
  render: () => ({
    setup () {
      return () => h(Preview);
    },
  }),
};
