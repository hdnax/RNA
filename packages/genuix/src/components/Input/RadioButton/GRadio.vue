<template>
  <label
    v-bind="$attrs"
    :for="id"
    class="radio"
    :class="[
      `radio-${size}`,
      {
        'radio--disabled': disabled,
      },
    ]"
    :style="{
      '--_checked-border': tokens.bg,
      '--_dot-bg': tokens.bg,
    }"
  >
    <input
      :id="id"
      ref="inputRef"
      type="radio"
      class="radio-input"
      :checked="selected === value"
      :disabled="disabled"
      :name="name"
      :value="value"
      @change="selectValue"
    >
    <span class="radio-circle">
      <span
        v-if="selected === value"
        class="radio-dot"
      />
    </span>
    <span
      v-if="$slots.default || label"
      class="radio-label"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  computed,
  useTemplateRef,
} from 'vue';
import type {
  GRadioSize,
} from './types';
import {
  GSize,
  GSemantic,
  GProminence,
} from '@/types';
import {
  prominenceTokens,
} from '@/utils/prominence';

defineOptions({
  inheritAttrs: false,
});

const selected = defineModel<string>();

const {
  id = undefined,
  size = GSize.Md,
  semantic = GSemantic.Primary,
  disabled = false,
  label = undefined,
  value,
  name = undefined,
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Size variant */
  size?: GRadioSize;
  /** Color role */
  semantic?: GSemantic;
  /** Disable the component */
  disabled?: boolean;
  /** Display label */
  label?: string;
  /** Value emitted when this radio is selected */
  value: string;
  /** Input name attribute */
  name?: string;
}>();

const tokens = computed(() => prominenceTokens(GProminence.Primary, semantic));

function selectValue () {
  selected.value = value;
}

const inputRef = useTemplateRef('inputRef');

defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.radio {
  @apply inline-flex items-center gap-sm cursor-pointer select-none;
}

.radio--disabled {
  @apply cursor-not-allowed opacity-50;
}

.radio-input {
  @apply absolute opacity-0 w-0 h-0;
}

.radio-circle {
  @apply inline-flex items-center justify-center shrink-0 rounded-full border border-solid gui-primary-border gui-neutral-bg;
  transition: border-color var(--duration-fast) var(--ease-default);
}

.radio-input:checked + .radio-circle {
  border-color: var(--_checked-border);
}

.radio-input:focus-visible + .radio-circle {
  @apply gui-info-border;
}

.radio-dot {
  @apply rounded-full;
  background: var(--_dot-bg);
}

.radio-label {
  @apply gui-neutral-fg;
}

/* Sizes */
.radio-xs .radio-circle {
  width: var(--size-2);
  height: var(--size-2);
}
.radio-xs .radio-dot {
  width: 6px;
  height: 6px;
}
.radio-xs .radio-label {
  @apply text-xs;
}

.radio-sm .radio-circle {
  width: var(--size-2);
  height: var(--size-2);
}
.radio-sm .radio-dot {
  width: 6px;
  height: 6px;
}
.radio-sm .radio-label {
  @apply text-sm;
}

.radio-md .radio-circle {
  width: var(--size-3);
  height: var(--size-3);
}
.radio-md .radio-dot {
  width: 8px;
  height: 8px;
}
.radio-md .radio-label {
  @apply text-md;
}

.radio-lg .radio-circle {
  width: var(--size-4);
  height: var(--size-4);
}
.radio-lg .radio-dot {
  width: 10px; height: 10px;
}
.radio-lg .radio-label {
  @apply text-lg;
}

.radio-xl .radio-circle {
  width: var(--size-4);
  height: var(--size-4);
}
.radio-xl .radio-dot {
  width: 12px;
  height: 12px;
}
.radio-xl .radio-label {
  @apply text-xl;
}
}
</style>
