<template>
  <GDropdown
    v-bind="$attrs"
    :placement="isNested ? 'right-start' : 'bottom-start'"
    :flip="!isNested"
    width="auto"
    :arrow="false"
    :distance="isNested ? 8 : 4"
  >
    <button
      type="button"
      class="nav-menu-trigger"
      role="menuitem"
      aria-haspopup="true"
    >
      <GIcon
        :name="isNested ? GIconName.ChevronRight : GIconName.ChevronDown"
        class="nav-menu-chevron"
      />
      <GIcon
        v-if="icon"
        :name="icon"
        class="nav-menu-icon"
      />
      {{ label }}
    </button>
    <template #popper>
      <div
        class="nav-menu-items"
        role="menu"
      >
        <slot />
      </div>
    </template>
  </GDropdown>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  inject,
  provide,
} from 'vue';
import {
  NAV_MENU_DEPTH_KEY,
} from './types';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';
import GDropdown from '@/components/Overlay/Dropdown/GDropdown.vue';

defineOptions({
  inheritAttrs: false,
});

const {
  label,
  icon = undefined,
} = defineProps<{
  /** Display label */
  label: string;
  /** Icon shown before label */
  icon?: GIconName;
}>();

const isNested = !!inject(NAV_MENU_DEPTH_KEY, null);

provide(NAV_MENU_DEPTH_KEY, true);
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.nav-menu-trigger {
  @apply flex items-center gap-xs text-xs gui-neutral-fg-muted px-sm py-xs rounded-sm cursor-pointer bg-transparent border-none w-full;
  transition: color var(--duration-fast) var(--ease-default), background var(--duration-fast) var(--ease-default);
}

.nav-menu-trigger:hover {
  @apply gui-neutral-fg gui-primary-bg-hover;
}

.nav-menu-icon {
  @apply shrink-0;
}

.nav-menu-chevron {
  @apply shrink-0 opacity-50;
  width: 10px;
  height: 10px;
}

.nav-menu-items {
  @apply p-xs flex flex-col;
  min-width: 10rem;
}
}
</style>
