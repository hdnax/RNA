<template>
  <GModal
    ref="modalRef"
    v-bind="$attrs"
    :name="COMMAND_PALETTE_KEY"
    :size="GModalSize.Md"
  >
    <template #header>
      <div class="command-palette-search">
        <GIcon
          :name="GIconName.Search"
          class="command-palette-search-icon"
        />
        <input
          ref="searchRef"
          v-model="query"
          class="command-palette-input"
          type="text"
          :placeholder="placeholder"
          @keydown="handleKeydown"
        >
      </div>
    </template>
    <div class="command-palette-list">
      <template v-if="groupedItems.length > 0">
        <template
          v-for="group in groupedItems"
          :key="group.label"
        >
          <div
            v-if="group.label"
            class="command-palette-group"
          >
            {{ group.label }}
          </div>
          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            class="command-palette-item"
            :class="[
              {
                'command-palette-item--focused': focusedId === item.id,
              },
            ]"
            @click="() => selectItem(item)"
            @mouseenter="() => focusedId = item.id"
          >
            <GIcon
              v-if="item.icon"
              :name="item.icon"
              class="command-palette-item-icon"
            />
            <span class="command-palette-item-label">{{ item.label }}</span>
            <GKbdShortcut
              v-if="item.shortcut"
              :keys="item.shortcut"
              class="command-palette-item-shortcut"
            />
          </button>
        </template>
      </template>
      <div
        v-else
        class="command-palette-empty"
      >
        No results
      </div>
    </div>
    <template #footer>
      <div class="command-palette-footer">
        <span class="command-palette-hint">
          <GKbdKey :name="GKbdKeyName.ArrowUp" />
          <GKbdKey :name="GKbdKeyName.ArrowDown" />
          navigate
        </span>
        <span class="command-palette-hint">
          <GKbdKey :name="GKbdKeyName.Enter" />
          select
        </span>
        <span class="command-palette-hint">
          <GKbdKey :name="GKbdKeyName.Escape" />
          close
        </span>
      </div>
    </template>
  </GModal>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  computed,
  nextTick,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import {
  GModalSize,
} from '../Modal/types';
import {
  COMMAND_PALETTE_KEY,
} from './types';
import type {
  CommandItem,
} from './types';
import GModal from '@/components/Overlay/Modal/GModal.vue';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';
import GKbdKey from '@/components/Display/Kbd/GKbdKey.vue';
import GKbdShortcut from '@/components/Display/Kbd/GKbdShortcut.vue';
import {
  GKbdKeyName,
} from '@/components/Display/Kbd/types';
import {
  useModal,
} from '@/composables/useModal';
import {
  useLocalKbdShortcuts,
} from '@/composables/useKbdShortcut';

defineOptions({
  inheritAttrs: false,
});

const {
  items,
  placeholder = 'Search commands...',
} = defineProps<{
  /** The items in the command pallete **/
  items: CommandItem[];
  /** The placeholder text in the search box of the command pallete */
  placeholder?: string;
}>();

const emit = defineEmits<{
  select: [item: CommandItem];
}>();

const modal = useModal();

const isOpen = computed(() => modal.isOpen(COMMAND_PALETTE_KEY).value);

const modalRef = useTemplateRef<InstanceType<typeof GModal> | null>('modalRef');
const searchRef = useTemplateRef<HTMLInputElement | null>('searchRef');
const query = ref('');
const focusedId = ref<string | undefined>(undefined);

const localShortcuts = useLocalKbdShortcuts(modalRef);

for (const item of items) {
  if (item.shortcut) {
    localShortcuts.register(item.shortcut, () => selectItem(item));
  }
}

/* Filtering */
const filteredItems = computed(() => {
  const searchTerm = query.value.toLowerCase();

  if (!searchTerm) return items;

  return items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm)
    || item.group?.toLowerCase().includes(searchTerm));
});

/* Group items by group name */
const groupedItems = computed(() => {
  const groups = new Map<string, CommandItem[]>();

  for (const item of filteredItems.value) {
    const key = item.group ?? '';

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return [...groups.entries()].map(([
    label,
    groupItems,
  ]) => ({
    label,
    items: groupItems,
  }));
});

const flatItems = computed(() => filteredItems.value);

/* Open/close sync */
watch(isOpen, async (open) => {
  if (open) {
    query.value = '';
    focusedId.value = flatItems.value[0]?.id;
    await nextTick();
    searchRef.value?.focus();
  }
});

function close () {
  modal.pop(COMMAND_PALETTE_KEY);
}

/* Keyboard navigation */
function handleKeydown (event: KeyboardEvent) {
  const list = flatItems.value;

  if (event.key === GKbdKeyName.ArrowDown) {
    event.preventDefault();
    if (!list.length) return;
    const index = focusedId.value ? list.findIndex((index_) => index_.id === focusedId.value) : -1;

    focusedId.value = list[list.length - 1 <= index ? 0 : index + 1].id;

    return;
  }

  if (event.key === GKbdKeyName.ArrowUp) {
    event.preventDefault();
    if (!list.length) return;
    const index = focusedId.value ? list.findIndex((index_) => index_.id === focusedId.value) : -1;

    focusedId.value = list[index <= 0 ? list.length - 1 : index - 1].id;

    return;
  }

  if (event.key === GKbdKeyName.Enter) {
    event.preventDefault();
    const item = list.find((index) => index.id === focusedId.value);

    if (item) selectItem(item);

    return;
  }
}

function selectItem (item: CommandItem) {
  close();
  if (item.action) {
    item.action();
  }
  emit('select', item);
}

// Reset focus when query changes
watch(query, () => {
  focusedId.value = flatItems.value[0]?.id;
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
/* Search */
.command-palette-search {
  @apply flex items-center gap-sm flex-1;
}

.command-palette-search-icon {
  @apply gui-neutral-fg-muted shrink-0 opacity-50;
}

.command-palette-input {
  @apply flex-1 border-none outline-none bg-transparent gui-neutral-fg-muted font-mono text-sm;
}

.command-palette-input::placeholder {
  @apply gui-neutral-fg-muted opacity-40;
}

/* List */
.command-palette-list {
  @apply flex-1 overflow-y-auto;
}

.command-palette-group {
  @apply text-xs gui-neutral-fg-muted px-sm py-xs;
}

/* Items */
.command-palette-item {
  @apply flex items-center gap-sm px-sm py-1.5 w-full text-left bg-transparent border-none cursor-pointer gui-neutral-fg-muted text-xs rounded-sm;
  transition: background var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default);
}

.command-palette-item:hover,
.command-palette-item--focused {
  @apply gui-primary-bg-hover gui-neutral-fg;
}

.command-palette-item-icon {
  @apply shrink-0 gui-neutral-fg-muted;
}

.command-palette-item-label {
  @apply flex-1 truncate;
}

.command-palette-item-shortcut {
  @apply ml-auto;
}

.command-palette-empty {
  @apply text-sm gui-neutral-fg-muted text-center py-lg;
}

/* Footer */
.command-palette-footer {
  @apply flex items-center gap-md;
}

.command-palette-hint {
  @apply flex items-center gap-xs text-xs gui-neutral-fg-muted;
}
}
</style>
