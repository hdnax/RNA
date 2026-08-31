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

const sizes = [
  {
    token: '--text-1',
    label: 'text-1 (11px)',
  },
  {
    token: '--text-2',
    label: 'text-2 (14px)',
  },
  {
    token: '--text-3',
    label: 'text-3 (15px)',
  },
  {
    token: '--text-4',
    label: 'text-4 (17px)',
  },
  {
    token: '--text-5',
    label: 'text-5 (21px)',
  },
  {
    token: '--text-6',
    label: 'text-6 (26px)',
  },
  {
    token: '--text-7',
    label: 'text-7 (33px)',
  },
  {
    token: '--text-8',
    label: 'text-8 (41px)',
  },
  {
    token: '--text-9',
    label: 'text-9 (51px)',
  },
  {
    token: '--text-10',
    label: 'text-10 (80px)',
  },
];

function Preview () {
  return h(
    'div',
    {
      style: 'display: flex; flex-direction: column; gap: 16px;',
    },
    sizes.map((size) =>
      h('div', {
        style: 'display: flex; align-items: baseline; gap: 12px;',
      }, [
        h('code', {
          style: 'font-size: 12px; color: #666; min-width: 200px;',
        }, size.label),
        h('span', {
          style: `font-size: var(${size.token});`,
        }, 'The quick brown fox'),
      ])),
  );
}

const meta = {
  title: 'Tokens/Primitives/Font size',
  tags: [],
  parameters: {
    docs: {
      description: {
        component: 'Type scale built on a major third ratio (~1.25) with 17px base.',
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
        story: 'Font size scale using major third ratio (~1.25), base 17px.',
      },
    },
  },
  render: () => ({
    setup () {
      return () => h(Preview);
    },
  }),
};
