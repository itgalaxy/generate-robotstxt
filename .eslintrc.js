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
      files: ["src/**/*"]
    },

    // Jest
    {
      extends: ["plugin:itgalaxy/dirty", "plugin:itgalaxy/jest"],
      excludedFiles: ["**/*.md"],
      files: ["**/__tests__/**/*", "**/__mocks__/**/*"],
      rules: {
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
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "node/no-unpublished-require": "off",
        "node/no-unpublished-import": "off"
      }
    }
  ],
  root: true
};
