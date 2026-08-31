<template>
  <GTooltip
    arrow
    :show-delay="1000"
    :distance="8"
    placement="bottom"
  >
    <component
      :is="as"
      v-bind="$attrs"
      role="link"
      :aria-label="label ? `${label} (opens in new tab)` : undefined"
      class="external-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <slot name="icon-before" />
      <slot />
      <slot name="icon-after">
        <GIcon
          :name="GIconName.ExternalLink"
          :size="12"
          class="external-link-icon"
          aria-hidden="true"
        />
      </slot>
      <span class="sr-only">(opens in new tab)</span>
    </component>
    <template
      v-if="resolvedTooltip"
      #popper
    >
      <span class="link-tooltip">{{ resolvedTooltip }}</span>
    </template>
  </GTooltip>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import type {
  Component,
} from 'vue';
import {
  computed,
  useAttrs,
} from 'vue';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';
import GTooltip from '@/components/Overlay/Tooltip/GTooltip.vue';

defineOptions({
  inheritAttrs: false,
});

const {
  as = 'a' as string | Component,
  label = '',
  hideTooltip = false,
} = defineProps<{
  /** Element or component to render as */
  as?: string | Component;
  /** Accessible label for the link */
  label?: string;
  /** Whether to hide the tooltip on hover */
  hideTooltip?: boolean;
}>();

const attrs = useAttrs();

const destination = computed(() =>
  (attrs.href ?? '') as string);

const resolvedTooltip = computed(() => {
  if (hideTooltip) return '';

  return label || destination.value;
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.external-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--gui-info-fg-muted);
  text-decoration: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-default);
}

.external-link:hover {
  color: var(--gui-info-fg);
  text-decoration: underline;
}

.external-link-icon {
  opacity: 0.6;
}

.link-tooltip {
  font-size: var(--text-xs);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
}
</style>
