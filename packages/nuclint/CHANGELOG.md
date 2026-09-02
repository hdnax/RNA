# nuclint

## 0.17.5

### Patch Changes

- fix: rename unicorn/prevent-abbreviations to name-replacements and update pnpm overrides for security alerts

## 0.17.4

### Patch Changes

- d1bfb99: Bump transitive dependencies to patched versions to resolve security vulnerabilities.

  - js-yaml >= 4.0.0 <= 4.1.1 patched to ^4.2.0
  - brace-expansion < 1.1.13 patched to ^1.1.13
  - brace-expansion >= 5.0.0 < 5.0.6 patched to ^5.0.6
  - form-data 4.0.5 patched to ^4.0.6

## 0.17.3

### Patch Changes

- patch vue/block-tag-newline rule config for singleline

## 0.17.2

### Patch Changes

- Patch some problematic configs

## 0.17.1

### Patch Changes

- Fix the inverted-color story and lint issues

## 0.17.0

### Minor Changes

- Enrich vue and tailwindcss rulesets.

### Patch Changes

- ae47b51: Disable nav and num abbreviation expansions in naming rules

## 0.16.0

### Minor Changes

- Add naming, comment, import, and expression rulesets
- Add custom rules: type-literal-newline, no-heavy-comments, no-trailing-period-comments, no-special-characters, no-import-alias
- Export named configs instead of default export
- Fix global vs scoped ignores in flat config

## 0.15.0

### Minor Changes

- Properly ignore built output, deps in lint config

## 0.14.4

### Patch Changes

- Update dev dependencies to avoid vulnerability issues

## 0.14.3

### Patch Changes

- Fix typescript build errors and lint issues

## 0.14.2

### Patch Changes

- Fix vulnerability issues

## 0.14.1

### Patch Changes

- Use a new eslint import resolver to avoid erroneous errors

## 0.14.0

### Minor Changes

- Use better import resolver in nuclint

## 0.13.0

### Minor Changes

- Only warn on explicit anys and non-null assertions

## 0.12.0

### Minor Changes

- Improve formatting of array and object expressions

## 0.11.0

### Minor Changes

- Config esm and cjs targets

## 0.10.0

### Minor Changes

- Reorganize lint configs, ignore lint issues of internal files

## 0.9.1

### Patch Changes

- Make max-len more relaxed & add consistent: true to object-property-newline

## 0.9.0

### Minor Changes

- Relax ternary formatting rules to allow single-line ternaries. Changed `multiline-ternary` from `always` to `always-multiline`, which only breaks ternaries across multiple lines when they contain nested ternaries or exceed the maximum line length.

## 0.8.1

### Patch Changes

- Fix import paths of `./rules/prefer_less_than.ts`

## 0.8.0

### Minor Changes

- Added ESLint rules for better code formatting:
  - Breaking complex conditions into multiple lines with `operator-linebreak`
  - Enforcing flat nested ternaries without excessive indentation using `flatTernaryExpressions`
  - Forcing all ternaries to be multiline with `multiline-ternary: always`
  - Breaking chained method calls with `newline-per-chained-call`
  - Custom rule to enforce using `<` and `<=` instead of `>` and `>=` comparison operators, following `rust-analyzer`

## 0.7.0

### Minor Changes

- Ignore strings, comments in `maxlen` rules
- Enforce breaking long parameter lists on multiple lines
- Disallow pattern like `{ prop: key; \n ... \n }`

## 0.6.0

### Minor Changes

- Add rules mandating arrays and objects to break on to new lines & fix lint issues

## 0.5.0

### Minor Changes

- Add comprehensive ESLint rules for better code quality and consistency:
  - Add TypeScript rules: consistent-type-imports, consistent-type-definitions, no-explicit-any, no-non-null-assertion
  - Add stylistic rules: array-bracket-spacing, brace-style, comma-dangle, comma-spacing, eol-last, key-spacing, multiline-ternary, no-multiple-empty-lines, no-trailing-spaces, object-curly-spacing
  - Add import rules: named, no-cycle, no-deprecated, no-self-import, no-unused-modules
  - Improve no-unused-vars to handle function parameters and caught errors with underscore prefix
  - Add arrow-parens rule to enforce parentheses in arrow functions
  - Add multiline-ternary rule to allow formatting long ternary chains across multiple lines

## 0.4.1

### Patch Changes

- Use @typescript-eslint/no-unused-vars instead of base no-unused-vars rule

## 0.4.0

### Minor Changes

- Enforce space between function name and ( in function definition
- Enforce space before { in block
- Allow unused vars if it starts with \_
- Enforce indentation as 2 spaces

## 0.3.0

### Minor Changes

- Mandate ; at the end of a property type declaration inside interface

## 0.2.0

### Minor Changes

- Support vue eslint rules

## 0.1.0

### Minor Changes

- Publish nuclint as raw js

## 0.0.0

### Patch Changes

- First version for placeholder
