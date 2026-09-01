<template>
  <GDropdown
    ref="dropdownRef"
    placement="bottom-start"
  >
    <slot name="trigger">
      <button
        type="button"
        class="emoji-picker-default-trigger"
      >
        <span
          v-if="modelValue"
          class="emoji-picker-trigger-emoji"
        >{{ modelValue }}</span>
        <span
          v-else
          class="emoji-picker-trigger-placeholder"
        >{{ placeholder }}</span>
      </button>
    </slot>
    <template #popper>
      <div
        v-bind="$attrs"
        class="emoji-picker"
      >
        <div class="emoji-picker-search">
          <GTextInput
            v-model="search"
            class="emoji-picker-search-input"
            :size="GTextInputSize.Md"
            placeholder="Search emoji..."
          />
        </div>
        <div class="emoji-picker-categories">
          <GTooltip
            v-for="category in categories"
            :key="category.name"
            :distance="8"
            arrow
            placement="bottom"
          >
            <button
              type="button"
              class="emoji-picker-category-btn"
              :class="{
                'emoji-picker-category-btn--active': activeCategory === category.name,
              }"
              @click="() => activeCategory = category.name"
            >
              {{ category.emojis[0].unicode }}
            </button>
            <template #popper>
              <span class="emoji-picker-tooltip">{{ category.name }}</span>
            </template>
          </GTooltip>
        </div>
        <div class="emoji-picker-grid">
          <template
            v-for="category in filteredCategories"
            :key="category.name"
          >
            <div class="emoji-picker-section-label">
              {{ category.name }}
            </div>
            <div class="emoji-picker-section-grid">
              <GTooltip
                v-for="emoji in category.emojis"
                :key="emoji.unicode"
                :distance="8"
                arrow
                placement="bottom"
              >
                <button
                  type="button"
                  class="emoji-picker-emoji"
                  @click="() => selectEmoji(emoji.unicode)"
                >
                  {{ emoji.unicode }}
                </button>
                <template #popper>
                  <span class="emoji-picker-tooltip">{{ emoji.name }}</span>
                </template>
              </GTooltip>
            </div>
          </template>
          <div
            v-if="filteredCategories.length === 0"
            class="emoji-picker-empty"
          >
            No emoji found
          </div>
        </div>
      </div>
    </template>
  </GDropdown>
</template>

<script setup lang="ts">
/* #human-slop
 *  https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import {
  ref,
  computed,
  useTemplateRef,
} from 'vue';
import GTextInput from '../TextInput/GTextInput.vue';
import {
  GTextInputSize,
} from '../TextInput/types';
import {
  EMOJI_CATEGORIES,
} from './types';
import type {
  EmojiCategory,
} from './types';
import GDropdown from '@/components/Overlay/Dropdown/GDropdown.vue';
import GTooltip from '@/components/Overlay/Tooltip/GTooltip.vue';

defineOptions({
  inheritAttrs: false,
});

const modelValue = defineModel<string>({
  default: '',
});

const {
  categories = EMOJI_CATEGORIES,
  placeholder = 'Empty',
} = defineProps<{
  /** Emoji categories to display */
  categories?: EmojiCategory[];
  /** Placeholder shown in default trigger when no emoji selected */
  placeholder?: string;
}>();

const dropdownRef = useTemplateRef<InstanceType<typeof GDropdown>>('dropdownRef');

function selectEmoji (emoji: string) {
  modelValue.value = emoji;
  dropdownRef.value?.hide();
}

const search = ref('');
const activeCategory = ref('');

const filteredCategories = computed(() => {
  const query = search.value.toLowerCase();
  const filtered = query
    ? categories.map((category) => ({
      ...category,
      emojis: category.emojis.filter((emoji) => emoji.name.toLowerCase().includes(query) || emoji.unicode.includes(query)),
    })).filter((cat) => 0 < cat.emojis.length)
    : categories;

  if (activeCategory.value && !query) {
    return filtered.filter((cat) => cat.name === activeCategory.value);
  }

  return filtered;
});
</script>

<style scoped>
@reference '@/style.css';

@layer components {
.emoji-picker-default-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding-left: var(--spacing-1);
  padding-right: var(--spacing-1);
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  font-size: 20px;
}

.emoji-picker-default-trigger:hover {
  background: var(--gui-neutral-bg-hover);
}

.emoji-picker {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 360px;
  border: 1px solid var(--gui-neutral-border);
  border-radius: var(--radius-md);
  background: var(--gui-neutral-bg);
  overflow: hidden;
}

.emoji-picker-search {
  padding: var(--spacing-sm);
  flex-shrink: 0;
}

.emoji-picker-search-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--gui-neutral-border-subtle);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--gui-neutral-fg);
  outline: none;
}

.emoji-picker-search-input::placeholder {
  color: var(--gui-neutral-fg-muted);
  opacity: 0.5;
}

.emoji-picker-categories {
  display: flex;
  gap: var(--spacing-2xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-bottom: 1px solid var(--gui-primary-border-subtle);
  flex-shrink: 0;
}

.emoji-picker-category-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-size: 16px;
  opacity: 0.5;
  transition: opacity var(--duration-fast) var(--ease-default),
              background-color var(--duration-fast) var(--ease-default);
}

.emoji-picker-category-btn:hover {
  opacity: 1;
  background: var(--gui-neutral-bg-hover);
}

.emoji-picker-category-btn--active {
  opacity: 1;
  background: var(--gui-primary-bg-active);
}

.emoji-picker-grid {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
  padding-bottom: var(--spacing-lg);
  min-height: 0;
}

.emoji-picker-section-label {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
  color: var(--gui-neutral-fg-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.emoji-picker-section-label:first-child {
  margin-top: 0;
}

.emoji-picker-section-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--spacing-2xs);
}

.emoji-picker-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-size: 20px;
  transition: background-color var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default);
}

.emoji-picker-emoji:hover {
  background: var(--gui-primary-bg-hover);
  transform: scale(1.2);
}

.emoji-picker-empty {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--gui-neutral-fg-muted);
  font-size: var(--text-sm);
}

.emoji-picker-trigger-placeholder {
  color: var(--gui-neutral-fg-muted);
  font-size: var(--text-sm);
  letter-spacing: 0.1em;
}

.emoji-picker-tooltip {
  font-size: var(--text-xs);
}
}
</style>
