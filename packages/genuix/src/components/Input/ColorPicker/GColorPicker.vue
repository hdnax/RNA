<template>
  <GDropdown
    ref="dropdownRef"
    placement="bottom-start"
    width="trigger"
    :distance="1"
  >
    <!-- Colorpicker trigger -->
    <button
      type="button"
      v-bind="$attrs"
      aria-haspopup="dialog"
      :disabled="disabled"
      :style="{
        '--_bg-hover': disabled ? tokens.bg : tokens.bgHover,
        '--_fg': disabled ? tokens.mutedFg : tokens.fg,
        '--_bg': tokens.bg,
        '--_border': tokens.border,
      }"
      class="colorpicker-trigger"
      :class="{
        'cursor-pointer': !disabled,
        [`colorpicker-trigger-${size}`]: true,
      }"
    >
      <span
        :style="{
          background: selectedSwatch.value,
        }"
        class="color-chip"
      />
      <span>
        {{ selectedSwatch.name }}
      </span>
    </button>
    <!-- Colorpicker popper -->
    <template #popper>
      <div
        class="colorpicker-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Color picker"
      >
        <GButton
          v-for="color in colors"
          :key="`${color.value}-${color.name}`"
          class="color-button"
          :prominence="GButtonProminence.Ghost"
          @click="() => selectColor(color)"
        >
          <div
            :style="{
              background: color.value,
            }"
            class="color-chip"
          />
          <div>
            {{ color.name }}
          </div>
        </GButton>
      </div>
    </template>
  </GDropdown>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */
import {
  computed, useTemplateRef, watch,
} from 'vue';
import GButton from '../Button/GButton.vue';
import {
  GButtonProminence,
} from '../Button/types';
import type {
  ColorSwatch,
} from './types';
import {
  DEFAULT_COLORS,
  GColorPickerSize,
} from './types';
import {
  prominenceTokens,
} from '@/utils/prominence';
import {
  GProminence, GSemantic,
} from '@/types';
import GDropdown from '@/components/Overlay/Dropdown/GDropdown.vue';

defineOptions({
  inheritAttrs: false,
});

const color = defineModel<string>({
  default: '#000000',
});

const {
  colors = DEFAULT_COLORS,
  size = GColorPickerSize.Md,
  disabled = false,
} = defineProps<{
  /** Preset color swatches to display */
  colors?: ColorSwatch[];
  /** Size variant */
  size?: GColorPickerSize;
  /** Disable the component */
  disabled?: boolean;
}>();

const dropdownRef = useTemplateRef('dropdownRef');

const tokens = prominenceTokens(GProminence.Ghost, GSemantic.Neutral);

const selectedSwatch = computed<ColorSwatch>(() => {
  return colors.find((color) => color.value === color.value) ?? DEFAULT_COLORS[0];
});

watch(() => colors, () => {
  color.value = selectedSwatch.value.value;
}, {
  immediate: true,
  deep: true,
});

function selectColor (selectedColor: ColorSwatch) {
  color.value = selectedColor.value;
  dropdownRef.value?.hide();
}
</script>

<style scoped>
@reference '@/style.css';

.colorpicker-trigger {
  @apply inline-flex items-center gap-1 justify-start rounded-md px-sm border border-solid;
  background: var(--_bg);
  color: var(--_fg);
  border-color: var(--_border);

  &:hover {
    background: var(--_bg-hover);
  }

  &:disabled:hover {
    @apply cursor-not-allowed;
  }
}

.colorpicker-trigger:active:not(:disabled) {
  animation: colorpicker-pulse var(--duration-fast, 150ms) var(--ease-out, ease-out);
}

@keyframes colorpicker-pulse {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
  100% { filter: brightness(1); }
}

.color-chip {
  @apply size-md rounded-md border gui-primary-border mr-1;
}

/* Color panel */
.colorpicker-panel {
  @apply gui-neutral-bg gui-primary-border-subtle rounded-lg font-mono p-sm flex flex-col max-h-56 overflow-auto;
}

.color-button {
  @apply flex flex-row gap-2 justify-start px-2  text-md leading-relaxed;
}

/* Trigger sizes */
.colorpicker-trigger-xs {
  @apply h-5 text-xs;
  width: 120px;
}

.colorpicker-trigger-sm {
  @apply h-6 text-sm;
  width: 140px;
}

.colorpicker-trigger-md {
  @apply h-8 text-md;
  width: 180px;
}

.colorpicker-trigger-lg {
  @apply h-9 text-lg;
  width: 200px;
}

.colorpicker-trigger-xl {
  @apply h-10 text-xl;
  width: 240px;
}
</style>
