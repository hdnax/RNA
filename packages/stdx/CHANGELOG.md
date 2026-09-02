# @hdnax/stdx

## 0.3.8

### Patch Changes

- fix: rename unicorn/prevent-abbreviations to name-replacements and update pnpm overrides for security alerts

## 0.3.7

### Patch Changes

- d1bfb99: Bump transitive dependencies to patched versions to resolve security vulnerabilities.

  - js-yaml >= 4.0.0 <= 4.1.1 patched to ^4.2.0
  - brace-expansion < 1.1.13 patched to ^1.1.13
  - brace-expansion >= 5.0.0 < 5.0.6 patched to ^5.0.6
  - form-data 4.0.5 patched to ^4.0.6

## 0.3.6

### Patch Changes

- Bump @vitest/browser to ^4.1.8, eslint to ^10.5.0, flatted to ^3.4.2, minimatch to ^10.2.5, esbuild to ^0.28.1, lodash to ^4.18.0, jav to ^8.18.0, ws to ^8.20.1 to resolve vulnerability issues

## 0.3.5

### Patch Changes

- Fix signature of getId to accept object, instead of Record<string, unknown>, which is too restrictive

## 0.3.4

### Patch Changes

- Properly ignore built output, deps in lint config

## 0.3.3

### Patch Changes

- Update dev dependencies to avoid vulnerability issues

## 0.3.2

### Patch Changes

- Fix typescript build errors and lint issues

## 0.3.1

### Patch Changes

- Fix vulnerability issues

## 0.3.0

### Minor Changes

- Add platform queries, python-based range iterators and id generators

## 0.2.0

### Minor Changes

- Reorganize lint configs, ignore lint issues of internal files
