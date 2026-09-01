<template>
  <label
    v-bind="$attrs"
    :for="id"
    class="checkbox"
    :class="[
      `checkbox-${size}`,
      {
        'checkbox--disabled': disabled,
      },
    ]"
    :style="{
      '--_checked-bg': tokens.bg,
      '--_checked-border': tokens.bg,
    }"
  >
    <input
      :id="id"
      ref="inputRef"
      v-model="checked"
      type="checkbox"
      class="checkbox-input"
      :name="name"
      :disabled="disabled"
    >
    <slot
      name="checkbox"
      :checked="checked"
      :disabled="disabled"
    >
      <span class="checkbox-box">
        <GIcon
          v-if="checked"
          :name="GIconName.Check"
          class="checkbox-icon"
        />
      </span>
    </slot>
    <span
      v-if="$slots.default || label"
      class="checkbox-label"
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
  GCheckboxSize,
} from './types';
import {
  GSize,
  GSemantic,
  GProminence,
} from '@/types';
import {
  prominenceTokens,
} from '@/utils/prominence';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';

defineOptions({
  inheritAttrs: false,
});

const checked = defineModel<boolean>({
  default: false,
});

const {
  id = undefined,
  name = undefined,
  size = GSize.Md,
  semantic = GSemantic.Primary,
  disabled = false,
  label = undefined,
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Input name attribute */
  name?: string;
  /** Size variant */
  size?: GCheckboxSize;
  /** Color role */
  semantic?: GSemantic;
  /** Disable the component */
  disabled?: boolean;
  /** Display label */
  label?: string;
}>();

const tokens = computed(() => prominenceTokens(GProminence.Primary, semantic));

const inputRef = useTemplateRef('inputRef');

defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.checkbox {
  @apply inline-flex items-center gap-sm cursor-pointer select-none;
}

.checkbox--disabled {
  @apply cursor-not-allowed opacity-50;
}

.checkbox-input {
  @apply absolute opacity-0 w-0 h-0;
}

.checkbox-box {
  @apply inline-flex items-center justify-center shrink-0 rounded-sm border border-solid gui-primary-border gui-neutral-bg;
  transition: background var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default);
}

.checkbox-input:checked + .checkbox-box {
  background: var(--_checked-bg);
  border-color: var(--_checked-border);
}

.checkbox-input:focus-visible + .checkbox-box {
  @apply gui-info-border;
}

.checkbox-icon {
  color: #fff;
}

.checkbox-label {
  @apply gui-neutral-fg;
}

/* Sizes */
.checkbox-xs .checkbox-box {
  width: var(--size-2);
  height: var(--size-2);
}
.checkbox-xs .checkbox-label {
  @apply text-xs;
}

.checkbox-sm .checkbox-box {
  width: var(--size-2);
  height: var(--size-2);
}
.checkbox-sm .checkbox-label {
  @apply text-sm;
}

.checkbox-md .checkbox-box {
  width: var(--size-3);
  height: var(--size-3);
}
.checkbox-md .checkbox-label {
  @apply text-md;
}

.checkbox-lg .checkbox-box {
  width: var(--size-4);
  height: var(--size-4);
}
.checkbox-lg .checkbox-label {
  @apply text-lg;
}

.checkbox-xl .checkbox-box {
  width: var(--size-4);
  height: var(--size-4);
}
.checkbox-xl .checkbox-label {
  @apply text-xl;
}
}
</style>
