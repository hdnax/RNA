<template>
  <GDropdown
    ref="dropdownRef"
    :arrow="false"
    placement="bottom-start"
    :distance="-(triggerHeight || 0)"
    width="trigger"
    class="overflow-hidden"
    @hide="handleClose"
    @show-end="focusSearchBox"
  >
    <template
      #default="{
        isOpen,
      }"
    >
      <button
        :id="id"
        ref="triggerRef"
        type="button"
        v-bind="$attrs"
        class="select-trigger"
        :class="[
          `select-trigger-${size}`,
          `select-trigger--${isOpen ? 'open' : 'closed'}`,
          !isPill && 'select-trigger--box',
        ]"
        :style="{
          '--_bg': tokens.bg,
          '--_bg-hover': tokens.bgHover,
          '--_fg': disabled ? tokens.mutedFg : tokens.fg,
          '--_border': tokens.border,
        }"
        :data-state="state"
        :disabled="disabled"
        role="combobox"
        aria-haspopup="listbox"
      >
        <span class="select-value">
          <slot
            v-if="selected"
            name="value"
            :value="selected"
            :label="displayValue!"
          >
            <template v-if="isPill">
              <GPill
                class="max-w-full"
                :size="size"
                :color="colors.get(selected)"
              >
                <template #left>
                  <span
                    class="select-dot"
                    :style="{
                      background: dotColor(colors.get(selected)),
                    }"
                  />
                </template>
                {{ displayValue }}
              </GPill>
            </template>
            <span
              v-else
              class="select-box-label"
            >{{ displayValue }}</span>
          </slot>
          <span
            v-else
            class="gui-neutral-fg-muted"
          >
            {{ placeholder }}
          </span>
        </span>
        <GIcon
          v-if="!isPill"
          :name="GIconName.ChevronDown"
          class="select-chevron"
        />
      </button>
    </template>
    <template
      #popper
    >
      <div
        class="contents"
        @keydown="handleKeydown"
      >
        <div
          class="select-search-row"
          :class="[`select-search-row-${size}`]"
          @click="focusSearchBox"
        >
          <slot
            v-if="selected"
            name="value"
            :value="selected"
            :label="displayValue"
          >
            <template v-if="isPill">
              <GPill
                class="max-w-full cursor-default"
                :size="size"
                :color="colors.get(selected)"
              >
                <template #left>
                  <span
                    class="select-dot"
                    :style="{
                      background: dotColor(colors.get(selected)),
                    }"
                  />
                </template>
                {{ displayValue }}
              </GPill>
            </template>
            <span
              v-else
              class="select-box-label"
            >{{ displayValue }}</span>
          </slot>
          <!-- size must be set here because browser set size to 20 by default, causing min-width: 0 to have no effect -->
          <input
            ref="searchRef"
            v-model="search"
            class="select-search"
            type="text"
            :size="selected ? 1 : undefined"
            :placeholder="selected ? '' : searchPlaceholder"
            @keydown.backspace="handleBackspaceWhenEmpty"
          >
        </div>
        <p class="font-extralight m-sm mb-xs text-xs gui-neutral-fg-muted select-none">
          {{ visibleCount > 0 ? 'Select an option' : 'No option found' }}
        </p>
        <div
          ref="menuRef"
          class="select-menu"
          :class="{
            'select-menu--empty': visibleCount === 0,
          }"
          role="listbox"
        />
      </div>
    </template>
  </GDropdown>
  <!-- Options always render for label/color registration, teleported into popper menu when available -->
  <div hidden>
    <Teleport
      :to="menuElement"
      :disabled="!menuElement"
    >
      <slot />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  computed,
  provide,
  reactive,
  readonly,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import {
  GSelectSize,
  GSelectState,
  GSelectVariant,
  SELECT_KEY,
} from './types';
import type {
  SelectOptionRegistration,
} from './types';
import {
  GKbdKeyName,
} from '@/components/Display/Kbd/types';
import {
  prominenceTokens,
} from '@/utils/prominence';
import {
  GProminence,
  GSemantic,
} from '@/types';
import GDropdown from '@/components/Overlay/Dropdown/GDropdown.vue';
import GPill from '@/components/Display/Pill/GPill.vue';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';
import {
  GPillColor,
  PILL_COLORS,
} from '@/components/Display/Pill/types';
import {
  useHeight,
} from '@/composables/useHeight';

defineOptions({
  inheritAttrs: false,
});

const selected = defineModel<string | undefined>();

const {
  id = undefined,
  size = GSelectSize.Md,
  variant = GSelectVariant.Pill,
  state = GSelectState.Default,
  disabled = false,
  placeholder = 'Empty',
  searchPlaceholder = 'Search for an option...',
  closeOnSelect,
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Size variant */
  size?: GSelectSize;
  /** Visual style variant */
  variant?: GSelectVariant;
  /** Validation state */
  state?: GSelectState;
  /** Disable the component */
  disabled?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Close the dropdown after selecting an option */
  closeOnSelect?: boolean;
}>();

const isPill = computed(() => variant === GSelectVariant.Pill);

const tokens = prominenceTokens(GProminence.Ghost, GSemantic.Neutral);

const dropdownRef = useTemplateRef('dropdownRef');

const triggerRef = useTemplateRef('triggerRef');
const triggerHeight = useHeight(triggerRef);

const searchRef = useTemplateRef('searchRef');
const menuElement = useTemplateRef<HTMLElement>('menuRef');

const search = ref('');

const visibleValues = reactive(new Set<string>());
const visibleCount = computed(() => visibleValues.size);

const labels = reactive(new Map<string, string>());
const colors = reactive(new Map<string, GPillColor | undefined>());

function dotColor (pillColor?: GPillColor) {
  return PILL_COLORS[pillColor ?? GPillColor.Gray].solid;
}

// Ordered list of visible values for keyboard navigation
const visibleList = computed(() => [...labels.keys()].filter((value) => visibleValues.has(value)));
const focusedValue = ref<string | undefined>(undefined);

watch(visibleList, (list) => {
  if (focusedValue.value !== undefined && !list.includes(focusedValue.value)) {
    focusedValue.value = undefined;
  }
});

const displayValue = computed(() => {
  if (!selected.value) return undefined;

  return labels.get(selected.value) ?? selected.value;
});

function handleClose () {
  search.value = '';
  focusedValue.value = undefined;
}

function register (value: string, options: SelectOptionRegistration) {
  labels.set(value, options.label);
  colors.set(value, options.color);
  if (options.visible) {
    visibleValues.add(value);
  }
}

function select (value: string) {
  selected.value = value;
  search.value = '';
  if (!closeOnSelect) {
    focusSearchBox();
  } else {
    dropdownRef.value?.hide();
  }
}

function unregister (value: string) {
  labels.delete(value);
  colors.delete(value);
  visibleValues.delete(value);
}

function update (value: string, options: SelectOptionRegistration) {
  labels.set(value, options.label);
  colors.set(value, options.color);

  const wasVisible = visibleValues.has(value);

  if (options.visible && !wasVisible) {
    visibleValues.add(value);
  } else if (!options.visible && wasVisible) {
    visibleValues.delete(value);
  }
}

provide(SELECT_KEY, {
  size,
  variant,
  selectedValue: readonly(selected),
  searchValue: readonly(search),
  focusedValue: readonly(focusedValue),
  select,
  register,
  update,
  unregister,
});

function focusSearchBox () {
  requestAnimationFrame(() => {
    searchRef.value?.focus();
  });
}

function handleBackspaceWhenEmpty (event: KeyboardEvent) {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.value !== '') {
    return;
  }
  if (selected.value !== undefined) {
    selected.value = undefined;
  }
}

function handleKeydown (event: KeyboardEvent) {
  const list = visibleList.value;

  if (!list.length) return;

  const index = focusedValue.value !== undefined ? list.indexOf(focusedValue.value) : -1;

  if (event.key === GKbdKeyName.ArrowDown) {
    event.preventDefault();
    focusedValue.value = list[list.length - 1 <= index ? 0 : index + 1];
  } else if (event.key === GKbdKeyName.ArrowUp) {
    event.preventDefault();
    focusedValue.value = list[index <= 0 ? list.length - 1 : index - 1];
  } else if (event.key === GKbdKeyName.Enter) {
    event.preventDefault();
    if (focusedValue.value !== undefined) {
      select(focusedValue.value);
    }
  }
}
</script>

<style scoped>
@reference '@/style.css';

@layer components {
/* Trigger */
.select-trigger {
  @apply inline-flex items-center justify-between rounded-md cursor-pointer gap-sm overflow-hidden w-full;
  background: var(--_bg);
  color: var(--_fg);
  border-color: var(--_border);
  transition: border-color var(--duration-fast) var(--ease-default);
}

.select-trigger:hover:not(:disabled) {
  background: var(--_bg-hover);
}

.select-trigger:disabled {
  @apply cursor-not-allowed opacity-50;
}

/* Merge trigger with dropdown when open */
.select-trigger--open {
  opacity: 0;
}

.select-value {
  @apply max-w-full overflow-hidden text-ellipsis;
  min-width: 0;
}

.select-dot {
  @apply inline-block w-2 h-2 rounded-full shrink-0;
}

/* States */
.select-trigger[data-state="error"] {
  @apply gui-danger-border;
}

.select-trigger[data-state="warning"] {
  @apply gui-warning-border;
}

.select-trigger[data-state="success"] {
  @apply gui-success-border;
}

/* Sizes */
.select-trigger-xs {
  @apply min-h-7 text-xs px-xs;
}

.select-trigger-sm {
  @apply min-h-8 text-sm px-sm;
}

.select-trigger-md {
  @apply min-h-9 text-md px-sm;
}

.select-trigger-lg {
  @apply min-h-10 text-lg px-md;
}

.select-trigger-xl {
  @apply min-h-12 text-xl px-md;
}

/* Search row */
.select-search-row {
  @apply gui-primary-bg-subtle rounded-none gui-neutral-fg-muted;
  @apply border-b gui-primary-border-subtle;
  @apply flex items-center flex-wrap gap-sm max-w-full cursor-text;
}

.select-search-row-xs {
  @apply text-xs px-xs py-xs;
}

.select-search-row-sm {
  @apply text-sm px-sm py-xs;
}

.select-search-row-md {
  @apply text-sm px-sm py-2;
}

.select-search-row-lg {
  @apply text-lg px-md py-2;
}

.select-search-row-xl {
  @apply text-lg px-md py-2;
}

.select-search {
  @apply border-none outline-none bg-transparent gui-neutral-fg max-w-full text-ellipsis;
  font-size: inherit;
}

.select-search-row:focus-within {
  @apply gui-primary-border;
}

.select-search::placeholder {
  @apply text-xs gui-neutral-fg-muted opacity-50;
}

/* Box variant trigger */
.select-trigger--box {
  @apply border gui-primary-border-subtle;
}

.select-box-label {
  @apply overflow-hidden text-ellipsis whitespace-nowrap;
}

.select-chevron {
  @apply shrink-0 gui-neutral-fg-muted;
}

/* Menu */
.select-menu {
  @apply mb-sm;
}
}
</style>
