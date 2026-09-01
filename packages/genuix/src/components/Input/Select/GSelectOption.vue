<template>
  <GTooltip
    arrow
    placement="right"
    :show-delay="500"
  >
    <button
      v-if="visible"
      :id="id"
      type="button"
      v-bind="$attrs"
      class="select-option"
      :class="[
        `select-option-${context.size}`,
        isFocused && 'select-option--focused',
      ]"
      role="option"
      :aria-selected="isSelected"
      @click="selectOption"
    >
      <slot>
        <template v-if="context.variant === GSelectVariant.Pill">
          <GPill
            class="max-w-full"
            :size="context.size"
            :color="pillColor"
          >
            <template #left>
              <span
                class="select-dot"
                :style="{
                  background: dotColor,
                }"
              />
            </template>
            {{ label ?? value }}
          </GPill>
        </template>
        <span
          v-else
          class="select-option-box-label"
        >{{ label ?? value }}</span>
      </slot>
    </button>
    <template #popper>
      <p class="line-clamp-3 max-w-72 md:max-w-96">
        {{ label ?? value }}
      </p>
    </template>
  </GTooltip>
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
  SELECT_KEY,
  GSelectVariant,
} from './types';
import {
  GPillColor,
  PILL_COLORS,
} from '@/components/Display/Pill/types';
import GPill from '@/components/Display/Pill/GPill.vue';
import GTooltip from '@/components/Overlay/Tooltip/GTooltip.vue';

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

const context = inject(SELECT_KEY)!;

function selectOption () {
  context.select(value);
}

const PILL_COLOR_VALUES = Object.values(GPillColor);

const pillColor = computed(
  () => color ?? PILL_COLOR_VALUES[value.length % PILL_COLOR_VALUES.length],
);

const dotColor = computed(() => (PILL_COLORS[pillColor.value] ?? PILL_COLORS[GPillColor.Gray]).solid);

// Detect current state of the option
const isSelected = computed(() => context.selectedValue.value === value);
const isFocused = computed(() => context.focusedValue.value === value);

const visible = computed(() => {
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
.select-option {
  display: block;
  width: calc(100% - 2 * var(--spacing-sm));
  margin: 0 var(--spacing-sm);
  text-align: left;
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  color: var(--gui-neutral-fg);
  padding: var(--spacing-sm) var(--spacing-sm);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select-option-xs {
  @apply text-xs;
  padding: var(--spacing-xs) var(--spacing-xs);
}

.select-option-sm {
  @apply text-sm;
}

.select-option-md {
  @apply text-md;
}

.select-option-lg {
  @apply text-lg;
  padding: var(--spacing-sm) var(--spacing-md);
}

.select-option-xl {
  @apply text-xl;
  padding: var(--spacing-sm) var(--spacing-md);
}

.select-option:hover,
.select-option--focused {
  background: var(--gui-primary-bg-hover);
}

.select-dot {
  @apply inline-block w-2 h-2 rounded-full shrink-0;
}

.select-option-box-label {
  @apply overflow-hidden text-ellipsis whitespace-nowrap;
  font-size: inherit;
}
}
</style>
