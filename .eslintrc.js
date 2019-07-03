"use strict";

module.exports = {
  parserOptions: {
    sourceType: "script"
  },
  extends: ["plugin:itgalaxy/esnext", "plugin:itgalaxy/node"],
  overrides: [
    // Source
    {
      // Exclude nested tests
      excludedFiles: ["**/__tests__/**/*", "**/__mocks__/**/*", "**/*.md"],
      files: ["src/**/*"],
      parserOptions: {
        sourceType: "module"
      },
      rules: {
        // Allow to use ECMAScript 6 modules because we use `babel`
        "node/no-unsupported-features/es-syntax": "off"
      }
    },

    // Jest
    {
      extends: ["plugin:itgalaxy/jest"],
      excludedFiles: ["**/*.md"],
      files: ["**/__tests__/**/*", "**/__mocks__/**/*"],
      parserOptions: {
        sourceType: "module"
      },
      rules: {
        // Allow to use `console` (example - `mocking`)
        "no-console": "off",
        // Allow to use ECMAScript 6 modules because we use `babel`
        "node/no-unsupported-features/es-syntax": "off"
      }
    },

    // Markdown
    {
      extends: ["plugin:itgalaxy/markdown"],
      files: ["**/*.md"],
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
          impliedStrict: true
        }
      },
      rules: {
        strict: "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-process-env": "off",
        "no-process-exit": "off",
        "no-console": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "node/no-unpublished-require": "off",
        "node/no-unpublished-import": "off",
        "node/no-unsupported-features/es-syntax": "off"
      }
    }
  ],
  root: true
};
