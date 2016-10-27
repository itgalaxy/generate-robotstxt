function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addLine(name, rule) {
    let contents = '';

    if (rule && Object.prototype.toString.call(rule) === '[object Array]') {
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
        allow: '/',
        cleanParam: null,
        crawlDelay: null,
        userAgent: '*'
    }],
    sitemap = null,
    host = null
} = {}) {
    let options = {
        host,
        policy,
        sitemap
    };

    let starter = Promise.resolve();

    if (configFile) {
        starter = new Promise((resolve) => {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const optionsFromConfigFile = require(configFile);

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
                return reject(new Error('Options "policy" must be array'));
            }

            if (Array.isArray(host)) {
                return reject(new Error('Options "host" must be one'));
            }

            let contents = '';
            let counter = 0;

            options.policy.forEach((item) => {
                if (!item.userAgent || (item.userAgent && item.userAgent.length === 0)) {
                    return reject(new Error('Each "police" should have "User-agent"'));
                }

                contents += addLine('User-agent', item.userAgent);

                if (item.allow) {
                    contents += addLine('Allow', item.allow);
                }

                if (item.disallow) {
                    contents += addLine('Disallow', item.disallow);
                }

                if (item.crawlDelay && typeof item.crawlDelay !== 'number' && !isFinite(item.crawlDelay)) {
                    return reject(new Error('Options "crawlDelay" must be integer or float'));
                }

                if (item.crawlDelay) {
                    contents += addLine('Crawl-delay', item.crawlDelay);
                }

                if (item.cleanParam) {
                    contents += addLine('Clean-param', item.cleanParam);
                }

                counter++;

                if (counter !== options.policy.length) {
                    contents += '\n';
                }

                return item;
            });

            if (options.sitemap) {
                contents += addLine('Sitemap', options.sitemap);
            }

            if (options.host) {
                contents += addLine('Host', options.host);
            }

            return resolve(contents);
        }));
}
