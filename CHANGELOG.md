# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

# Head

- Fixed: `host` options is now processed based `URL`.
- Fixed: thrown error if `host` option being IP address.
- Fixed: clarified error message on multiple and not string `userAgent` option.

# 4.0.1 - 2016-10-27

- Chore: added CI test on `node.js` version `7`.
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
