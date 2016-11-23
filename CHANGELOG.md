# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

# 4.0.1 - 2016-10-27

- Chore: added CI test on `node.js` version `7`.
- Chore: minimum required `npm-run-all` version is now `^3.0.0`.
- Chore: minimum required `nyc` version is now `^8.0.0`.
- Chore: minimum required `eslint-plugin-itgalaxy` version is now `^23.0.0`.
- Chore: rename `eslint-plugin-xo` to `eslint-plugin-unicorn`.
- Chore: minimum required `eslint-plugin-unicorn` version is now `^1.0.0`.
- Chore: minimum required `remark-preset-lint-itgalaxy` version is now `^2.0.0`.
- Chore: minimum required `execa` version is now `^0.5.0`.
- Chore: minimum required `eslint-plugin-promise` version is now `^3.0.0`. 
- Chore: minimum required `eslint-plugin-lodash` version is now `^2.1.0`.
- Chore: minimum required `eslint-plugin-import` version is now `^2.0.0`.
- Documentation: improve `README.md` and fix typos.

# 4.0.0

- Added: `crawlDelay` to each `police` item.
- Added: `cleanParam` to each `police` item (used only Yandex bot).
- Chore: used `remark-preset-lint-itgalaxy` preset.
- Chore: updated `devDependencies`.
- Chore: updated copyright year in `LICENSE`.
- Chore: improved tests.
- Fixed: strict order directives for each `User-agent`.
- Fixed: added newline after each `User-agent`.
- Removed: `crawlDelay` from `options`.
- Removed: `cleanParam` from `options`.
