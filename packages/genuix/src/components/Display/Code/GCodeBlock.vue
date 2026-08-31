<template>
  <div
    v-bind="$attrs"
    :id="id"
    class="code-block"
    :class="[
      {
        'code-block--scroll': noWordWrap,
        [highlightTheme]: true,
      },
    ]"
    :style="{
      '--_border': tokens.border,
      '--_header-bg': tokens.bg,
      '--_header-fg': tokens.fg,
      '--_lang-color': tokens.mutedFg,
      '--_body-bg': tokens.subtleBg,
    }"
  >
    <div
      v-if="!hideHeader"
      class="code-header"
    >
      <span
        class="code-title"
      >
        <GIcon
          v-if="icon"
          :name="icon"
          class="code-title-icon"
        />
        <div
          v-if="title"
          class="code-title-name"
        >
          {{ title }}
        </div>
      </span>
      <div class="code-header-actions">
        <span class="code-language">{{ languageLabel }}</span>
        <GTooltip
          :shown="copied"
          :triggers="[]"
          placement="bottom-end"
        >
          <GButton
            :prominence="GButtonProminence.Tertiary"
            :semantic="semantic"
            :size="GButtonSize.Xs"
            @click="clickCopyButton"
          >
            <GIcon :name="GIconName.Copy" />
          </GButton>
          <template #popper>
            <span class="code-copy-tooltip">Copied to clipboard!</span>
          </template>
        </GTooltip>
      </div>
    </div>

    <GDismiss
      @dismiss="clearLineSelection"
    >
      <GRangeSelection1D
        ref="rangeSelectionRef"
        :count="highlightedLines.length"
      >
        <div
          class="code-content"
        >
          <!-- Do not format this as pre is format-sensitive -->
          <pre><code class="code-pre"><template
            v-for="(line, i) in highlightedLines"
            :key="i"
          >
<GRangeItem1D
              v-slot="{
                selected, isPosition,
              }"
              :index="i"
            ><span
              :id="`${id}-L${i + 1}`"
              class="code-line"
              :class="{
                'selected-code-line--start': isPosition('start'),
                'selected-code-line--end': isPosition('end'),
                'selected-code-line--middle': selected && !isPosition('start') && !isPosition('end'),
                'selected-code-line': selected,
              }"
            ><span class="code-line-gutter" /><span
              v-if="showLineNumbers"
              class="code-line-number"
            >{{ i + 1 }}</span><span
              class="code-line-content"
              v-html="line"
            /></span></GRangeItem1D></template></code></pre>
        </div>
      </GRangeSelection1D>
    </GDismiss>
  </div>
</template>

<script setup lang="ts">
/* #human-slop
 * https://github.com/huydo862003/Fck-AI-Slop/edit/main/README.md
 */

import DOMPurify from 'dompurify';
import {
  computed,
  ref,
  useTemplateRef,
} from 'vue';
import {
  hljs,
} from './hljs';
import {
  GCodeLanguageLabel,
  GHighlightTheme,
} from './types';
import type {
  GCodeLanguage,
  GCodeBlockSemantic,
} from './types';
import GRangeSelection1D from '@/components/Interaction/RangeSelection/range1D/GRangeSelection1D.vue';
import GRangeItem1D from '@/components/Interaction/RangeSelection/range1D/GRangeItem1D.vue';
import GIcon from '@/components/Display/Icon/GIcon.vue';
import {
  GIconName,
} from '@/components/Display/Icon/types';
import GButton from '@/components/Input/Button/GButton.vue';
import {
  GButtonProminence,
  GButtonSize,
} from '@/components/Input/Button/types';
import GDismiss from '@/components/Interaction/Dismiss/GDismiss.vue';
import GTooltip from '@/components/Overlay/Tooltip/GTooltip.vue';
import {
  GSemantic,
  GProminence,
} from '@/types';
import {
  prominenceTokens,
} from '@/utils/prominence';

defineOptions({
  inheritAttrs: false,
});

const {
  id,
  title = '',
  icon = undefined,
  code: rawCode,
  language,
  showLineNumbers = false,
  noWordWrap = false,
  hideHeader = false,
  prominence = GProminence.Tertiary,
  semantic = GSemantic.Neutral,
  highlightTheme = GHighlightTheme.Github,
} = defineProps<{
  /** HTML id attribute */
  id: string;
  /** Optional title shown in the code block header */
  title?: string;
  /** Optional icon shown in the header */
  icon?: GIconName;
  /** Source code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language: GCodeLanguage;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Whether to wrap long lines */
  noWordWrap?: boolean;
  /** Whether to hide the header bar */
  hideHeader?: boolean;
  /** Prominence level: tertiary (default), secondary (tinted bg), primary (filled header) */
  prominence?: GProminence;
  /** Color role for block border, header, and language label */
  semantic?: GCodeBlockSemantic;
  /** Built-in highlight color theme (auto-switches light/dark). Default: github */
  highlightTheme?: GHighlightTheme;
}>();

/* Theme */
const tokens = computed(() => prominenceTokens(prominence, semantic));

/* Human-friendly language label */
const languageLabel = computed(() => GCodeLanguageLabel[language]);

const rangeSelectionRef = useTemplateRef<InstanceType<typeof GRangeSelection1D>>('rangeSelectionRef');

function clearLineSelection () {
  rangeSelectionRef.value?.clearSelection();
}

/* Format the code block and highlight */
const code = computed(() => {
  // FIXME: don't do this, should use CSS
  let result = rawCode.replace('\n\n', '\n \n'); // Empty lines have smaller sizes than others... so we add a whitespace

  if (rawCode.startsWith('\n')) {
    result = rawCode.slice(1);
  } else if (rawCode.startsWith('\r\n')) {
    result = rawCode.slice(2);
  }

  if (result.endsWith('\r\n')) {
    result = result.slice(0, -2);
  } else if (result.endsWith('\n')) {
    result = result.slice(0, -1);
  }

  return result;
});

const highlightedLines = computed(() => {
  const highlighted = hljs.highlight(code.value, {
    language: language,
  }).value;
  const sanitized = DOMPurify.sanitize(highlighted);

  return sanitized.split(/(?:\n|\r\n)/);
});

/* Code block content copy */
const copied = ref(false);

async function clickCopyButton () {
  await navigator.clipboard.writeText(code.value.replace('\n \n', '\n\n'));
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<!-- eslint-disable -->
<style lang="scss">
@use './themes.scss';
</style>
<!-- eslint-enable -->

<style scoped>
@reference '@/style.css';

@layer components {
.code-block {
  @apply font-mono rounded-md;
  border: 1px solid var(--_border);
  background-color: var(--_body-bg);
}

.code-block--scroll {
  @apply overflow-x-auto;
}

.code-header {
  @apply px-3 py-xs gap-6 flex content-between items-center;
  border-bottom: 1px solid var(--_border);
  background-color: var(--_header-bg);
}

.code-title {
  @apply text-xs font-medium basis-0 items-center gap-sm flex grow min-w-0;
    /* LEARN: Even with basis-0 then grow (which means to take the leftovers of other elements), min-width has to be set, to override min-width of "auto" */
  color: var(--_header-fg);
  flex-basis: 0;
}

.code-title-icon {
  @apply shrink-0;
}

.code-title-name {
  @apply basis-0 grow overflow-hidden text-ellipsis whitespace-nowrap min-w-0;
    /* LEARN: Even with basis-0 then grow (which means to take the leftovers of other elements), min-width has to be set, to override min-width of "auto" */
}

.code-header-actions {
  @apply flex items-center grow-0 shrink-0 gap-sm;
}

.code-language {
  @apply gui-neutral-fg-muted text-xs;
  color: var(--_lang-color);
}

.code-copy-tooltip {
  @apply text-xs;
}

.code-pre {
  @apply m-0 leading-[0];
  @apply grid; /* grid is used to ensure all div spans the same space (so highlighted background will be consistent)*/
  @apply whitespace-pre-wrap; /* LEARN: Allow wrapping while preserving whitespace, else `overflow-wrap` wouldn't work */
  @apply break-words; /* Break long tokens that exceed container */
}

.code-block--scroll .code-pre {
  @apply whitespace-pre;       /* No wrapping, horizontal scroll instead */
  overflow-wrap: normal;
}

.code-line {
  @apply leading-normal flex items-start py-xs pr-2;
}

.code-line:hover {
  @apply gui-neutral-bg-hover;
}

.code-line-gutter {
  @apply pl-3 select-none; /* Do not make code selection also select code gutter */
}

.code-line-number {
  @apply text-xs gui-neutral-fg-muted mr-6 shrink-0 select-none; /* Do not make code selection also select code line number */
  line-height: var(--leading-normal); /* Match content line-height so number aligns with first wrapped line */
}

.code-pre :deep(> div) {
  @apply outline-none; /* Disable default browser outline */
}

.code-line-content {
  @apply text-sm;
  line-height: var(--leading-normal); /* More breathing room for wrapped lines */
}

/* Create a shadow to simulate an outline running on some border */
.selected-code-line--start {
  box-shadow:
    0 2px var(--color-accent-blue-10) inset,
    -2px 0 var(--color-accent-blue-10) inset,
    2px 0 var(--color-accent-blue-10) inset;
}

.selected-code-line--end {
  box-shadow:
    0 -2px var(--color-accent-blue-10) inset,
    -2px 0 var(--color-accent-blue-10) inset,
    2px 0 var(--color-accent-blue-10) inset;
}

.selected-code-line--start.selected-code-line--end {
  box-shadow:
    0 2px var(--color-accent-blue-10) inset,
    0 -2px var(--color-accent-blue-10) inset,
    -2px 0 var(--color-accent-blue-10) inset,
    2px 0 var(--color-accent-blue-10) inset;
}

.selected-code-line--middle {
  box-shadow:
    -2px 0 var(--color-accent-blue-10) inset,
    2px 0 var(--color-accent-blue-10) inset;
}

.selected-code-line {
  @apply gui-notice-bg-subtle;
}

.selected-code-line:hover {
  @apply gui-notice-bg-hover;
}

}
</style>
