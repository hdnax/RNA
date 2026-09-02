<template>
  <GDropdown
    :arrow="false"
    placement="bottom-start"
    :distance="-(triggerHeight || 0)"
    width="trigger"
    @hide="handleClose"
    @show-end="focusSearchBox"
  >
    <template
      #default="{
        isOpen,
      }"
    >
      <div
        :id="id"
        ref="triggerRef"
        v-bind="$attrs"
        class="multiselect-trigger"
        :class="[
          `multiselect-trigger-${size}`,
          `multiselect-trigger--${isOpen ? 'open' : 'closed'}`,
          isPill ? 'multiselect-trigger--pill' : 'multiselect-trigger--box',
        ]"
        :style="{
          '--_bg': tokens.bg,
          '--_bg-hover': tokens.bgHover,
          '--_fg': disabled ? tokens.mutedFg : tokens.fg,
          '--_border': tokens.border,
        }"
        :data-state="state"
      >
        <template v-if="isPill">
          <GPill
            v-for="value in selected"
            :key="value"
            class="max-w-full"
            :size="size"
            :color="colors.get(value)"
          >
            <template #left>
              <span
                class="multiselect-dot"
                :style="{
                  background: dotColor(colors.get(value)),
                }"
              />
            </template>
            {{ labels.get(value) ?? value }}
          </GPill>
        </template>
        <template v-else>
          <span
            v-for="value in selected"
            :key="value"
            class="multiselect-box-tag"
          >
            {{ labels.get(value) ?? value }}
          </span>
        </template>
        <span
          v-if="selected.length === 0"
          class="gui-neutral-fg-muted"
        >
          {{ placeholder }}
        </span>
        <GIcon
          v-if="!isPill"
          :name="GIconName.ChevronDown"
          class="multiselect-chevron"
        />
      </div>
    </template>
    <template #popper>
      <div
        class="multiselect-popper"
        @keydown="handleKeydown"
      >
        <!-- Search row -->
        <div class="multiselect-search-row">
          <template v-if="isPill">
            <GPill
              v-for="val in selected"
              :key="val"
              class="max-w-full shrink"
              :color="colors.get(val)"
            >
              <template #left>
                <span
                  class="multiselect-dot"
                  :style="{
                    background: dotColor(colors.get(val)),
                  }"
                />
              </template>
              {{ labels.get(val) ?? val }}
              <template #right>
                <button
                  type="button"
                  class="multiselect-pill-close"
                  aria-label="Remove"
                  @click.stop="() => deselect(val)"
                >
                  <GIcon :name="GIconName.X" />
                </button>
              </template>
            </GPill>
          </template>
          <template v-else>
            <span
              v-for="val in selected"
              :key="val"
              class="multiselect-box-tag"
            >
              {{ labels.get(val) ?? val }}
              <button
                type="button"
                class="multiselect-pill-close"
                aria-label="Remove"
                @click.stop="() => deselect(val)"
              >
                <GIcon :name="GIconName.X" />
              </button>
            </span>
          </template>
          <input
            ref="searchRef"
            v-model="search"
            class="multiselect-search"
            type="text"
            :size="selected.length > 0 ? 1 : undefined"
            :placeholder="selected.length === 0 ? searchPlaceholder : ''"
            @keydown.backspace="handleBackspaceWhenEmpty"
          >
        </div>
        <template v-if="!allSelected">
          <p class="font-extralight m-sm mb-xs text-xs gui-neutral-fg-muted select-none">
            {{ visibleCount > 0 ? 'Select an option' : 'No option found' }}
          </p>
          <div
            ref="menuRef"
            class="multiselect-menu"
            :class="{
              'multiselect-menu--empty': visibleCount === 0,
            }"
            role="listbox"
            aria-multiselectable="true"
          />
        </template>
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
import type {
  MultiSelectOptionRegistration,
} from './types';
import {
  GMultiSelectSize,
  GMultiSelectState,
  MULTI_SELECT_KEY,
  GMultiSelectVariant,
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
import {
  GPillColor,
  PILL_COLORS,
} from '@/components/Display/Pill/types';
import {
  GIconName,
} from '@/components/Display/Icon/types';
import GDropdown from '@/components/Overlay/Dropdown/GDropdown.vue';
import GPill from '@/components/Display/Pill/GPill.vue';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  useHeight,
} from '@/composables/useHeight';

defineOptions({
  inheritAttrs: false,
});

const selected = defineModel<string[]>({
  default: () => [],
});

const {
  id = undefined,
  size = GMultiSelectSize.Md,
  variant = GMultiSelectVariant.Pill,
  state = GMultiSelectState.Default,
  disabled = false,
  placeholder = 'Empty',
  searchPlaceholder = 'Select an option',
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Size variant */
  size?: GMultiSelectSize;
  /** Visual style variant */
  variant?: GMultiSelectVariant;
  /** Validation state */
  state?: GMultiSelectState;
  /** Disable the component */
  disabled?: boolean;
  /** Input placeholder text */
  placeholder?: string;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
}>();

const isPill = computed(() => variant === GMultiSelectVariant.Pill);

const tokens = prominenceTokens(GProminence.Ghost, GSemantic.Neutral);

const triggerRef = useTemplateRef('triggerRef');
const triggerHeight = useHeight(triggerRef);
const searchRef = useTemplateRef<HTMLInputElement>('searchRef');
const menuElement = useTemplateRef<HTMLElement>('menuRef');

const search = ref('');

const visibleValues = reactive(new Set<string>());
const visibleCount = computed(() => visibleValues.size);
const allSelected = computed(() => 0 < labels.size && labels.size <= selected.value.length);
const labels = reactive(new Map<string, string>());
const colors = reactive(new Map<string, GPillColor | undefined>());

// Ordered list of visible values for keyboard navigation
const visibleList = computed(() => [...labels.keys()].filter((value) => visibleValues.has(value)));
const focusedValue = ref<string | undefined>(undefined);

// Clear focus if the focused value is no longer visible
watch(visibleList, (list) => {
  if (focusedValue.value !== undefined && !list.includes(focusedValue.value)) {
    focusedValue.value = undefined;
  }
});

function deselect (value: string) {
  selected.value = selected.value.filter((value_) => value_ !== value);
}

function dotColor (pillColor?: GPillColor) {
  return PILL_COLORS[pillColor ?? GPillColor.Gray].solid;
}

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
  if (0 < selected.value.length) {
    selected.value = selected.value.slice(0, -1);
  }
}

function handleClose () {
  search.value = '';
  focusedValue.value = undefined;
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
      toggle(focusedValue.value);
    }
  }
}

function register (value: string, options: MultiSelectOptionRegistration) {
  labels.set(value, options.label);
  colors.set(value, options.color);
  if (options.visible) {
    visibleValues.add(value);
  }
}

function toggle (value: string) {
  const index = selected.value.indexOf(value);

  if (0 <= index) {
    selected.value = selected.value.filter((value_) => value_ !== value);
  } else {
    selected.value = [
      ...selected.value,
      value,
    ];
  }
  focusSearchBox();
}

function unregister (value: string) {
  labels.delete(value);
  colors.delete(value);
  visibleValues.delete(value);
}

function update (value: string, options: MultiSelectOptionRegistration) {
  labels.set(value, options.label);
  colors.set(value, options.color);

  const wasVisible = visibleValues.has(value);

  if (options.visible && !wasVisible) {
    visibleValues.add(value);
  } else if (!options.visible && wasVisible) {
    visibleValues.delete(value);
  }
}

provide(MULTI_SELECT_KEY, {
  size,
  variant,
  selectedValues: readonly(selected),
  searchValue: readonly(search),
  focusedValue: readonly(focusedValue),
  toggle,
  register,
  update,
  unregister,
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
/* Trigger */
.multiselect-trigger {
  @apply inline-flex items-center flex-wrap rounded-md cursor-pointer gap-sm overflow-hidden;
  width: 15rem;
  background: var(--_bg);
  color: var(--_fg);
  border-color: var(--_border);
  transition: border-color var(--duration-fast) var(--ease-default);
}

.multiselect-trigger:hover:not(:disabled) {
  background: var(--_bg-hover);
}

/* Merge trigger with dropdown when open */
.multiselect-trigger--open {
  opacity: 0;
}

/* States */
.multiselect-trigger[data-state="error"] {
  @apply gui-danger-border;
}

.multiselect-trigger[data-state="warning"] {
  @apply gui-warning-border;
}

.multiselect-trigger[data-state="success"] {
  @apply gui-success-border;
}

/* Sizes */
.multiselect-trigger-xs {
  @apply min-h-7 text-xs px-xs py-xs;
  --_pill-max-width: 5rem;
}

.multiselect-trigger-sm {
  @apply min-h-8 text-sm px-sm py-xs;
  --_pill-max-width: 6rem;
}

.multiselect-trigger-md {
  @apply min-h-9 text-md px-sm py-sm;
  --_pill-max-width: 8rem;
}

.multiselect-trigger-lg {
  @apply min-h-10 text-lg px-md py-sm;
  --_pill-max-width: 10rem;
}

.multiselect-trigger-xl {
  @apply min-h-12 text-xl px-md py-sm;
  --_pill-max-width: 12rem;
}

/* Variants */

/** Box */
.multiselect-trigger--box {
  @apply border gui-primary-border-subtle justify-between;

  .multiselect-pill-close {
    @apply hidden;
  }
}

.multiselect-box-tag {
  @apply inline-flex items-center gap-xs gui-neutral-fg;
}

.multiselect-chevron {
  @apply shrink-0 gui-neutral-fg-muted;
}

/** Pill */
.multiselect-trigger--pill {
  /* Pill dot */
  .multiselect-dot {
    @apply inline-block w-2 h-2 rounded-full shrink-0;
  }

  /* Pill close button */
  .multiselect-pill-close {
    @apply inline-flex items-center justify-center cursor-pointer rounded-sm border-none bg-transparent;
    color: inherit;
    opacity: 0.6;
    line-height: 1;
    padding: 0;
  }

  .multiselect-pill-close:hover {
    opacity: 1;
  }
}

/* Search row */
.multiselect-search-row {
  @apply gui-primary-bg-subtle rounded-none gui-neutral-fg-muted;
  @apply border-b gui-primary-border-subtle;
  @apply flex items-center flex-wrap gap-sm px-3 py-2 text-sm overflow-x-auto;
  --_pill-max-width: calc(var(--spacing) * 50);
}

.multiselect-search {
  @apply flex-1 border-none outline-none bg-transparent gui-neutral-fg text-sm;
  min-width: 80px;
}

.multiselect-search-row:focus-within {
  @apply gui-primary-border;
}

.multiselect-search::placeholder {
  @apply text-xs gui-neutral-fg-muted opacity-50;
}

/* Menu */
.multiselect-menu {
  @apply mb-sm;
}

.multiselect-menu--empty {
  @apply mb-xs;
}
}
</style>
