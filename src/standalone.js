import { Address4, Address6 } from 'ip-address';
import url from 'url';

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

function generatePoliceItem(item, index) {
    let contents = '';

    if (index !== 0) {
        contents += '\n';
    }

    contents += addLine('User-agent', item.userAgent);

    if (item.allow) {
        contents += addLine('Allow', item.allow);
    }

    if (item.disallow) {
        contents += addLine('Disallow', item.disallow);
    }

    if (item.crawlDelay) {
        contents += addLine('Crawl-delay', item.crawlDelay);
    }

    if (item.cleanParam) {
        contents += addLine('Clean-param', item.cleanParam);
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
        .then(() => new Promise((resolve) => {
            if (options.policy) {
                if (!Array.isArray(options.policy)) {
                    throw new Error('Options `policy` must be array');
                }

                options.policy.forEach((item) => {
                    if (!item.userAgent || (item.userAgent && item.userAgent.length === 0)) {
                        throw new Error('Each `police` should have single string `userAgent` option');
                    }

                    if (item.crawlDelay && typeof item.crawlDelay !== 'number' && !isFinite(item.crawlDelay)) {
                        throw new Error('Option `crawlDelay` must be integer or float');
                    }
                });
            }

            if (options.host) {
                if (typeof options.host !== 'string') {
                    throw new Error('Options `host` must be `string` and single');
                }

                const address4 = new Address4(options.host);
                const address6 = new Address6(options.host);

                if (address4.isValid() || address6.isValid()) {
                    throw new Error('Options `host` should be not IP address');
                }
            }

            let contents = '';

            options.policy.forEach((item, index) => {
                contents += generatePoliceItem(item, index);
            });

            if (options.sitemap) {
                contents += addLine('Sitemap', options.sitemap);
            }

            if (options.host) {
                let normalizeHost = options.host;

                if (normalizeHost.search(/^http[s]?:\/\//) === -1) {
                    normalizeHost = `http://${host}`;
                }

                const parsedURL = url.parse(normalizeHost, false, true);

                if (!parsedURL.host) {
                    throw new Error('Option `host` does not contain correct host');
                }

                let formattedHost = url.format({
                    host: parsedURL.port && parsedURL.port === '80' ? parsedURL.hostname : parsedURL.host,
                    port: parsedURL.port && parsedURL.port === '80' ? '' : parsedURL.port,
                    protocol: parsedURL.protocol
                });

                formattedHost = formattedHost.replace(/^http:\/\//, '');

                contents += addLine('Host', formattedHost);
            }

            return resolve(contents);
        }));
}
