"use strict";

module.exports = {
  extends: [
    "plugin:itgalaxy/script",
    "plugin:itgalaxy/esnext",
    "plugin:itgalaxy/node"
  ],
  overrides: [
    // Source
    {
      extends: ["plugin:itgalaxy/module"],
      // Exclude nested tests
      excludedFiles: ["**/__tests__/**/*", "**/__mocks__/**/*", "**/*.md"],
      files: ["src/**/*"],
      rules: {
        // Allow to use ES module syntax
        // You should use babel if your node version is not supported ES syntax module, dynamic loading ES modules or other features
        "node/no-unsupported-features/es-syntax": [
          "error",
          { ignores: ["modules", "dynamicImport"] }
        ]
      }
    },

    // Jest
    {
      extends: ["plugin:itgalaxy/dirty", "plugin:itgalaxy/jest"],
      excludedFiles: ["**/*.md"],
      files: ["**/__tests__/**/*", "**/__mocks__/**/*"],
      rules: {
        // Test can be written with using ES module syntax or CommonJS module syntax
        "node/no-unsupported-features/es-syntax": [
          "error",
          { ignores: ["modules", "dynamicImport"] }
        ],

        // Allow to use `console` (example - `mocking`)
        "no-console": "off"
      }
    },

    // Markdown
    {
      extends: [
        // Documentation files can contain ECMA and CommonJS modules
        "plugin:itgalaxy/dirty",
        "plugin:itgalaxy/markdown"
      ],
      files: ["**/*.md"],
      rules: {
        "no-unused-vars": "off",
        "no-console": "off",
        "import/no-unresolved": "off",
        "node/no-unpublished-require": "off",
        "node/no-unpublished-import": "off",
        // Documentation files can contain ES module syntax and CommonJS module syntax
        "node/no-unsupported-features/es-syntax": [
          "error",
          { ignores: ["modules", "dynamicImport"] }
        ]
      }
    }
  ],
  root: true
};
