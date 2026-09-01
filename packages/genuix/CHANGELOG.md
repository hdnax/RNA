# genuix

## 0.16.1

### Patch Changes

- Make primary color more prominent

## 0.16.0

### Minor Changes

- Touch up design system and remove unused components

## 0.15.2

### Patch Changes

- d1bfb99: Bump transitive dependencies to patched versions to resolve security vulnerabilities.

  - js-yaml >= 4.0.0 <= 4.1.1 patched to ^4.2.0
  - brace-expansion < 1.1.13 patched to ^1.1.13
  - brace-expansion >= 5.0.0 < 5.0.6 patched to ^5.0.6
  - form-data 4.0.5 patched to ^4.0.6

- Updated dependencies [d1bfb99]
  - @hdnax/stdx@0.3.7

## 0.15.1

### Patch Changes

- Bump @vitest/browser to ^4.1.8, eslint to ^10.5.0, flatted to ^3.4.2, minimatch to ^10.2.5, esbuild to ^0.28.1, lodash to ^4.18.0, jav to ^8.18.0, ws to ^8.20.1 to resolve vulnerability issues
- Updated dependencies
  - @hdnax/stdx@0.3.6

## 0.15.0

### Minor Changes

- Support vInverted, GColorPicker, GEmojiPicker, GSkeleton, GDataTable, GAnchor, GAffix, GTimeline, GToc, GLink, GDivider, GAvatarGroup

### Patch Changes

- Updated dependencies
  - @hdnax/stdx@0.3.5

## 0.14.0

### Minor Changes

- Fix inverted color token issues not being applied
- ae47b51: Add text size tokens 4xl through 9xl with corresponding line-height tokens; fix duplicate text-3xl token; text-5xl and above use line-height 1 for display use

### Patch Changes

- @hdnax/stdx@0.3.4

## 0.13.3

### Patch Changes

- Properly ignore built output, deps in lint config
- Updated dependencies
  - @hdnax/stdx@0.3.4

## 0.13.2

### Patch Changes

- Support auto close on select in GSelect

## 0.13.1

### Patch Changes

- Correct the URL to the shipped fonts

## 0.13.0

### Minor Changes

- Perfomance optimization: Split katex and ibm fonts out of bundled css

## 0.12.0

### Minor Changes

- Revert tailwind.css endpoint change

## 0.11.0

### Minor Changes

- Enhance tailwind import endpoint to include fonts, base styles

## 0.10.6

### Patch Changes

- Expose tailwindcss style for tailwind consumer

## 0.10.5

### Patch Changes

- Update dev dependencies to avoid vulnerability issues
- Updated dependencies
  - @hdnax/stdx@0.3.3

## 0.10.4

### Patch Changes

- Fix typescript build errors and lint issues
- Updated dependencies
  - @hdnax/stdx@0.3.2

## 0.10.3

### Patch Changes

- Fix vulnerability issues
- Updated dependencies
  - @hdnax/stdx@0.3.1

## 0.10.2

### Patch Changes

- Use v-if instead of v-show for GTable, GBreadcrumb, GSelectOption, GMultiSelectOption to avoid eager bulk renders

## 0.10.1

### Patch Changes

- Add missing `t` and `T` key in GKbd key name enum

## 0.10.0

### Minor Changes

- Make breadcrumb more flexible by making it a compound component

## 0.9.0

### Minor Changes

- Support more themes in code block, support GFilterable and GTable

## 0.8.0

### Minor Changes

- Re-release with resolved workspace:\* dependencies

## 0.7.0

### Minor Changes

- Add new icons: ArrowsLeftRight, Database, BookOpen, PlayCircle, GithubLogo, MagicWand, TreeStructure. Add polymorphic `as` and `to` props to GNavLink and GNavBrand for router integration.

## 0.6.1

### Patch Changes

- Add more icons

## 0.6.0

### Minor Changes

- Add new components: Navbar, GCommandPalette, GModal, Math, GRadio, GCheckBox, GNumberInput, GTextArea, GBreadcrumb, GTab, GSelect, GMultiSelect, GHero, GAvatar, GBadge, GLogo, GPill, GTextInput, GDatePicker, GCodeBlock, GInlineCode, GRangeSelection, GSwitch, GSpinner, Button, GFlippable, GCollapsible, GIcon; add useKbdShortcut, useHash, useHeight composables; add duration design tokens; scale-up font sizes and use IBM Plex font; fix accessibility, styling, and interaction issues across components

### Patch Changes

- @hdnax/stdx@0.3.0

## 0.5.0

### Minor Changes

- Add GDropdown, GTooltip, GKbdKey, GKbdShortcut, useTheme to genuix

### Patch Changes

- Updated dependencies
  - @hdnax/stdx@0.3.0

## 0.4.0

### Minor Changes

- Reorganize lint configs, ignore lint issues of internal files

## 0.3.1

### Patch Changes

- Add rules mandating arrays and objects to break on to new lines & fix lint issues

## 0.3.0

### Minor Changes

- Bump @hdnax/nuclint to v0.4.0

## 0.2.0

### Minor Changes

- Fix styles export

## 0.1.0

### Minor Changes

- Export styles from design system

## 0.0.0

### Patch Changes

- First version for placeholder
