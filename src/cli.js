#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import meow from "meow";
import resolveFrom from "resolve-from";
import standalone from "./standalone.js";

const cli = meow(
  `
    Usage generate-robotstxt [options] <dest>

    Options:
       --config  Path to a specific configuration file.
`,
  {
    flags: {
      config: {
        type: "string",
      },
    },
  }
);

const optionsBase = {};

if (cli.flags.config) {
  // Should check these possibilities:
  //   a. name of a node_module
  //   b. absolute path
  //   c. relative path relative to `process.cwd()`.
  // If none of the above work, we'll try a relative path starting
  // in `process.cwd()`.
  optionsBase.configFile =
    resolveFrom(process.cwd(), cli.flags.config) ||
    path.join(process.cwd(), cli.flags.config);
}

Promise.resolve()
  .then(() => Object.assign({}, optionsBase))
  .then((options) => standalone(options))
  .then((output) => {
    if (cli.input.length === 0) {
      throw new Error("Require `dest` argument");
    }

    const dest = path.resolve(cli.input.pop());

    return Promise.resolve().then(() => fs.outputFile(dest, output));
  })
  .catch((error) => {
    console.log(error); // eslint-disable-line no-console
    process.exit(error.code || 1);
  });
