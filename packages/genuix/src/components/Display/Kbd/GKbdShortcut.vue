<template>
  <span
    v-bind="$attrs"
    :id="id"
    class="inline-flex items-center gap-1"
  >
    <template
      v-for="(key, i) in keys"
      :key="i"
    >
      <span
        v-if="0 < i"
        class="text-xs gui-neutral-fg-muted opacity-40"
      >+</span>
      <GKbdKey :name="key" />
    </template>
  </span>
</template>

<script setup lang="ts">
/* #human-slop
 * https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import GKbdKey from './GKbdKey.vue';
import type {
  GKbdKeyName,
} from './types';

defineOptions({
  inheritAttrs: false,
});

const {
  id = undefined,
  keys,
} = defineProps<{
  /** HTML id attribute */
  id?: string;
  /** Array of key names to display as a shortcut combination */
  keys: GKbdKeyName[];
}>();
</script>
