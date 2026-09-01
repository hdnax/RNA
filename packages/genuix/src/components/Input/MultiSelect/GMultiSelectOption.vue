<template>
  <button
    v-if="visible"
    v-bind="$attrs"
    :id="id"
    type="button"
    class="multiselect-option"
    :class="[
      isSelected && 'multiselect-option--selected',
      isFocused && 'multiselect-option--focused',
    ]"
    role="option"
    :aria-selected="isSelected"
    @click="toggle"
  >
    <slot>
      <GPill
        v-if="isPill"
        class="max-w-full"
        :size="context.size"
        :color="pillColor"
      >
        <template #left>
          <span
            class="multiselect-dot"
            :style="{
              background: dotColor,
            }"
          />
        </template>
        {{ label ?? value }}
      </GPill>
      <span
        v-else
        class="multiselect-box-option-label"
      >{{ label ?? value }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  onUpdated,
  watch,
} from 'vue';
import {
  GMultiSelectVariant,
  MULTI_SELECT_KEY,
} from './types';
import {
  GPillColor,
  PILL_COLORS,
} from '@/components/Display/Pill/types';
import GPill from '@/components/Display/Pill/GPill.vue';

defineOptions({
  inheritAttrs: false,
});

const {
  id = undefined,
  value,
  label = undefined,
  color = undefined,
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Must be unique among the options */
  value: string;
  /** Display label */
  label?: string;
  /** Pill color for this option */
  color?: GPillColor;
}>();

const context = inject(MULTI_SELECT_KEY)!;

function toggle () {
  context.toggle(value);
}

const PILL_COLOR_VALUES = Object.values(GPillColor);

const pillColor = computed(
  () => color ?? PILL_COLOR_VALUES[value.length % PILL_COLOR_VALUES.length],
);

const dotColor = computed(() => (PILL_COLORS[pillColor.value] ?? PILL_COLORS[GPillColor.Gray]).solid);

const isPill = computed(() => context.variant === GMultiSelectVariant.Pill);

const isSelected = computed(() => context.selectedValues.value.includes(value));
const isFocused = computed(() => context.focusedValue.value === value);

const visible = computed(() => {
  if (context.selectedValues.value.includes(value)) return false;
  const query = context.searchValue.value.toLowerCase();

  if (!query) return true;

  return (label ?? value).toLowerCase().includes(query);
});

const options = computed(() => ({
  label: label ?? value,
  color: pillColor.value,
  visible: visible.value,
}));

onMounted(() => context.register(value, options.value));

onUpdated(() => context.update(value, options.value));
watch(visible, () => context.update(value, options.value));

onUnmounted(() => context.unregister(value));
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.multiselect-option {
  display: block;
  width: calc(100% - 2 * var(--spacing-sm));
  margin: 0 var(--spacing-sm);
  text-align: left;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  color: var(--gui-neutral-fg);
  padding: var(--spacing-sm) var(--spacing-sm);
}

.multiselect-option:hover,
.multiselect-option--focused {
  background: var(--gui-primary-bg-hover);
}

.multiselect-dot {
  @apply inline-block w-2 h-2 rounded-full shrink-0;
}

.multiselect-box-option-label {
  @apply text-sm gui-neutral-fg;
}
}
</style>
