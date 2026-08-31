/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite';
import GAnchor from './GAnchor.vue';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';

const meta = {
  title: 'Components/Display/GAnchor',
  tags: ['autodocs'],
  component: GAnchor,
  parameters: {
    docs: {
      description: {
        component: 'Convenience wrapper around GAffix for anchored headings. Shows # link on hover.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: 'intro' },
  render: () => ({
    components: {
      GAnchor,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <GAnchor id="intro">
          <h2 id="intro" style="margin: 0;">Introduction</h2>
        </GAnchor>
        <GAnchor id="install">
          <h2 id="install" style="margin: 0;">Installation</h2>
        </GAnchor>
        <GAnchor id="usage">
          <h2 id="usage" style="margin: 0;">Usage</h2>
        </GAnchor>
      </div>
    `,
  }),
};

export const CustomIcon: Story = {
  args: { id: 'section' },
  render: () => ({
    components: {
      GAnchor,
      GIcon,
    },
    setup: () => ({
      GIconName,
    }),
    template: `
      <GAnchor id="section">
        <template #icon>
          <GIcon :name="GIconName.Link" :size="14" />
        </template>
        <h3 id="section" style="margin: 0;">Section with link icon</h3>
      </GAnchor>
    `,
  }),
};

export const MixedHeadings: Story = {
  args: { id: 'h1' },
  render: () => ({
    components: {
      GAnchor,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <GAnchor id="h1">
          <h1 id="h1" style="margin: 0;">Heading 1</h1>
        </GAnchor>
        <GAnchor id="h2">
          <h2 id="h2" style="margin: 0;">Heading 2</h2>
        </GAnchor>
        <GAnchor id="h3">
          <h3 id="h3" style="margin: 0;">Heading 3</h3>
        </GAnchor>
        <GAnchor id="h4">
          <h4 id="h4" style="margin: 0;">Heading 4</h4>
        </GAnchor>
      </div>
    `,
  }),
};
