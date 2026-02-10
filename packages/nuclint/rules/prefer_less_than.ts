import type { Rule } from 'eslint';

/**
 * Custom ESLint rule to enforce using < and <= instead of > and >=
 * Inspired by `rust-analyzer`
 */
export const preferLessThanRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using < and <= instead of > and >=',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      avoidGreaterThan: 'Use < instead of >',
      avoidGreaterThanOrEqual: 'Use <= instead of >=',
    },
  },
  create (context) {
    return {
      BinaryExpression (node) {
        if (node.operator === '>') {
          context.report({
            node,
            messageId: 'avoidGreaterThan',
            fix (fixer) {
              const sourceCode = context.sourceCode ?? context.getSourceCode();
              const leftText = sourceCode.getText(node.left);
              const rightText = sourceCode.getText(node.right);

              return fixer.replaceText(node, `${rightText} < ${leftText}`);
            },
          });
        } else if (node.operator === '>=') {
          context.report({
            node,
            messageId: 'avoidGreaterThanOrEqual',
            fix (fixer) {
              const sourceCode = context.sourceCode ?? context.getSourceCode();
              const leftText = sourceCode.getText(node.left);
              const rightText = sourceCode.getText(node.right);

              return fixer.replaceText(node, `${rightText} <= ${leftText}`);
            },
          });
        }
      },
    };
  },
};
