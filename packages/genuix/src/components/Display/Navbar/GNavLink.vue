<template>
  <component
    :is="as"
    v-bind="$attrs"
    class="nav-link"
    :class="[active && 'nav-link--active']"
    role="menuitem"
  >
    <GIcon
      v-if="icon"
      :name="icon"
      class="nav-link-icon"
    />
    <slot>{{ label }}</slot>
  </component>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import type {
  Component,
} from 'vue';
import type {
  GIconName,
} from '@/components/Display/Icon/types';
import GIcon from '@/components/Display/Icon/GIcon.vue';

defineOptions({
  inheritAttrs: false,
});

const {
  as = 'a',
  label = undefined,
  icon = undefined,
  active = false,
} = defineProps<{
  /** Element or component to render as */
  as?: string | Component;
  /** Display label */
  label?: string;
  /** Icon shown before label */
  icon?: GIconName;
  /** Whether this link is the active route */
  active?: boolean;
}>();
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.nav-link {
  @apply inline-flex items-center gap-xs text-xs no-underline gui-neutral-fg-muted px-sm py-xs rounded-sm cursor-pointer;
  transition: color var(--duration-fast) var(--ease-default), background var(--duration-fast) var(--ease-default);
}

.nav-link:hover {
  @apply gui-neutral-fg gui-primary-bg-hover no-underline;
}

.nav-link--active {
  @apply gui-primary-fg;
}

.nav-link-icon {
  @apply shrink-0;
}
}
</style>
