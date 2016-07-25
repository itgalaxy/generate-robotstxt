#!/usr/bin/env node

import fs from 'fs';
import meow from 'meow';
import path from 'path';
import resolveFrom from 'resolve-from';
import standalone from './standalone';

const cli = meow(`
    Usage
        $ generate-robotstxt [options] <dest>
    Options
       --config  Path to a specific configuration file (JSON, YAML, or CommonJS),
                 or the name of a module in \`node_modules\` that points to one.
                 If no \`--config\` argument is provided, generate-robotstxt will search for
                 configuration  files in the following places, in this order:
                    - a \`robotstxt\` property in \`package.json\`
                    - a \`.robotstxtrc\` file (with or without filename extension:
                        \`.json\`, \`.yaml\`, and \`.js\` are available)
                    - a \`robotstxt.config.js\` file exporting a JS object

`, {
    string: [
        'config'
    ],
    alias: {
        /* eslint-disable id-length */
        h: 'help',
        v: 'version'
        /* eslint-enable id-length */
    }
});

const optionsBase = {};

if (cli.flags.config) {
    // Should check these possibilities:
    //   a. name of a node_module
    //   b. absolute path
    //   c. relative path relative to `process.cwd()`.
    // If none of the above work, we'll try a relative path starting
    // in `process.cwd()`.
    optionsBase.configFile = resolveFrom(process.cwd(), cli.flags.config)
        || path.join(process.cwd(), cli.flags.config);
}

if (cli.input.length === 0) {
    throw new Error('Require `destination` argument');
}

Promise
    .resolve()
    .then(() => Object.assign({}, optionsBase))
    .then((options) => standalone(options))
    .then((output) => {
        const dest = cli.input.pop();

        return new Promise((resolve, reject) => {
            fs.writeFile(dest, output, (error) => {
                if (error) {
                    return reject(new Error(error));
                }

                return resolve(output);
            });
        });
    })
    .catch((error) => {
        console.log(error); // eslint-disable-line no-console
        process.exit(error.code || 1); // eslint-disable-line no-process-exit
    });
