<template>
  <button
    v-bind="$attrs"
    :id="id"
    type="button"
    class="btn"
    :class="[
      `btn-${size}`,
      {
        'is-loading': loading,
      },
    ]"
    :style="{
      '--_bg': tokens.bg,
      '--_bg-hover': tokens.bgHover,
      '--_fg': tokens.fg,
      '--_border': tokens.border,
    }"
    :disabled="isInactive"
  >
    <GSpinner
      v-if="loading"
      :size="spinnerSize"
      class="btn-spinner"
    />
    <span class="btn-content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
/* #human-slop
 * https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  computed,
} from 'vue';
import {
  GButtonProminence,
  GButtonSemantic,
  GButtonSize,
} from './types';
import GSpinner from '@/components/Display/Spinner/GSpinner.vue';
import {
  GSpinnerSize,
} from '@/components/Display/Spinner/types';
import {
  prominenceTokens,
} from '@/utils/prominence';

defineOptions({
  inheritAttrs: false,
});

const {
  id = undefined,
  prominence = GButtonProminence.Primary,
  semantic = GButtonSemantic.Primary,
  size = GButtonSize.Md,
  disabled = false,
  loading = false,
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Visual prominence */
  prominence?: GButtonProminence;
  /** Color role */
  semantic?: GButtonSemantic;
  /** Size variant */
  size?: GButtonSize;
  /** Disable the component */
  disabled?: boolean;
  /** Show a loading spinner and disable the button */
  loading?: boolean;
}>();

const tokens = computed(() => prominenceTokens(prominence, semantic));

const isInactive = computed(() => disabled || loading);

const spinnerSize = computed(() => {
  const map: Record<GButtonSize, GSpinnerSize> = {
    [GButtonSize.Xs]: GSpinnerSize.Xs,
    [GButtonSize.Sm]: GSpinnerSize.Xs,
    [GButtonSize.Md]: GSpinnerSize.Sm,
    [GButtonSize.Lg]: GSpinnerSize.Md,
    [GButtonSize.Xl]: GSpinnerSize.Md,
  };

  return map[size];
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.btn {
  @apply inline-flex items-center justify-center font-mono cursor-pointer select-none relative;
  border-radius: var(--radius-md);
  transition-property: background-color, color, border-color;
  transition-duration: var(--duration-fast, 150ms);
  transition-timing-function: var(--ease-default, ease);
  background-color: var(--_bg);
  color: var(--_fg);
  border: 1px solid var(--_border);
}

.btn:hover:not(.btn:disabled) {
  background-color: var(--_bg-hover);
}

.btn:active:not(.btn:disabled) {
  animation: btn-pulse var(--duration-fast, 150ms) var(--ease-out, ease-out);
}

.btn:disabled {
  @apply cursor-not-allowed;
  filter: brightness(0.95);
}

.btn.is-loading {
  @apply cursor-wait;
  filter: brightness(0.85);
}

@keyframes btn-pulse {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
  100% { filter: brightness(1); }
}

/* Sizes */
.btn-xs {
  height: var(--size-3);
  padding-inline: var(--spacing-xs);
  font-size: var(--text-xs);
}

.btn-sm {
  height: var(--size-4);
  padding-inline: var(--spacing-sm);
  font-size: var(--text-xs);
}

.btn-md {
  height: var(--size-5);
  padding-inline: var(--spacing-md);
  font-size: var(--text-sm);
}

.btn-lg {
  height: var(--size-6);
  padding-inline: var(--spacing-lg);
  font-size: var(--text-md);
}

.btn-xl {
  height: var(--size-7);
  padding-inline: var(--spacing-xl);
  font-size: var(--text-lg);
}

/* Loading state: Spinner lays on top of the content */
.btn-spinner {
  @apply absolute;
}

.btn-content {
  @apply opacity-100 inline-flex items-center gap-xs;
  transition: opacity var(--duration-fast) var(--ease-default);
}
}
</style>
