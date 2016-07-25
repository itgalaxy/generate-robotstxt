function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addLine(name, rule) {
    let contents = '';

    if (Object.prototype.toString.call(name) === '[object Object]') {
        Object.keys(name).forEach((key) => {
            const value = name[key];

            contents += addLine(key, value);
        });
    } else if (rule && Object.prototype.toString.call(rule) === '[object Array]') {
        rule.forEach((item) => {
            contents += addLine(name, item);
        });
    } else {
        contents += `${capitaliseFirstLetter(name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())}: ${rule}\n`;
    }

    return contents;
}

export default function ({
    configFile = null,
    policy = [{
        userAgent: '*',
        allow: '/'
    }],
    sitemap = null,
    crawlDelay = null,
    host = null,
    cleanParam = null
} = {}) {
    let options = {
        policy,
        sitemap,
        crawlDelay,
        host,
        cleanParam
    };

    let starter = null;

    if (!configFile) {
        starter = Promise.resolve();
    } else {
        starter = new Promise((resolve) => {
            const optionsFromConfigFile = require(configFile); // eslint-disable-line global-require

            options = Object.assign(
                {},
                options,
                optionsFromConfigFile.default
                    ? optionsFromConfigFile.default
                    : optionsFromConfigFile
            );

            return resolve();
        });
    }

    return starter
        .then(() => new Promise((resolve, reject) => {
            if (!Array.isArray(options.policy)) {
                return reject(new Error('Options `policy` must be array'));
            }

            if (Array.isArray(host)) {
                return reject(new Error('Options `host` must be one'));
            }

            if (typeof options.crawlDelay !== 'number' && !isFinite(options.crawlDelay)) {
                return reject(new Error('Options `crawlDelay` must be integer or float'));
            }

            let contents = '';

            options.policy.forEach((item) => {
                contents += addLine(item);
            });

            if (options.sitemap) {
                contents += addLine('Sitemap', options.sitemap);
            }

            if (options.host) {
                contents += addLine('Host', options.host);
            }

            if (options.crawlDelay) {
                contents += addLine('Crawl-delay', options.crawlDelay);
            }

            if (options.cleanParam) {
                contents += addLine('Clean-param', options.cleanParam);
            }

            return resolve(contents);
        }));
}
