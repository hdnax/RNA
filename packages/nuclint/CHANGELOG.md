# nuclint

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
