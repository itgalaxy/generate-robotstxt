import { Address4, Address6 } from "ip-address";
import cosmiconfig from "cosmiconfig";
import isAbsoluteUrl from "is-absolute-url";
import url from "url";

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addLine(name, rule) {
  let contents = "";

  if (rule && Object.prototype.toString.call(rule) === "[object Array]") {
    rule.forEach(item => {
      contents += addLine(name, item);
    });
  } else {
    const ruleContent =
      name === "Allow" || name === "Disallow" ? encodeURI(rule) : rule;

    contents += `${capitaliseFirstLetter(
      name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    )}: ${ruleContent}\n`;
  }

  return contents;
}

function generatePoliceItem(item, index) {
  let contents = "";

  if (index !== 0) {
    contents += "\n";
  }

  contents += addLine("User-agent", item.userAgent);

  if (item.allow) {
    if (Array.isArray(item.allow)) {
      item.allow.forEach((allowed) => {
        contents += addLine("Allow", allowed);
      });
    } else {
      contents += addLine("Allow", item.allow);
    }
  }

  if (item.disallow) {
    if (Array.isArray(item.disallow)) {
      item.disallow.forEach((disallowed) => {
        contents += addLine("Disallow", disallowed);
      });
    } else {
      contents += addLine("Disallow", item.disallow);
    }
  }

  if (item.crawlDelay) {
    contents += addLine("Crawl-delay", item.crawlDelay);
  }

  if (item.cleanParam) {
    contents += addLine("Clean-param", item.cleanParam);
  }

  return contents;
}

export default function(
  {
    configFile = null,
    policy = [
      {
        allow: "/",
        cleanParam: null,
        crawlDelay: null,
        userAgent: "*"
      }
    ],
    sitemap = null,
    host = null
  } = {}
) {
  let options = {
    host,
    policy,
    sitemap
  };

  return Promise.resolve()
    .then(() => {
      const explorer = cosmiconfig("robots-txt", {
        rcExtensions: true
      });

      return explorer.load(process.cwd(), configFile).then(result => {
        if (result) {
          options = Object.assign({}, options, result.config);
        }

        return Promise.resolve();
      });
    })
    .then(
      () =>
        new Promise(resolve => {
          if (options.policy) {
            if (!Array.isArray(options.policy)) {
              throw new Error("Options `policy` must be array");
            }

            options.policy.forEach(item => {
              if (
                !item.userAgent ||
                (item.userAgent && item.userAgent.length === 0)
              ) {
                throw new Error(
                  "Each `police` should have a single string `userAgent` option"
                );
              }

              if (
                item.crawlDelay &&
                typeof item.crawlDelay !== "number" &&
                !isFinite(item.crawlDelay)
              ) {
                throw new Error(
                  "Option `crawlDelay` must be an integer or a float"
                );
              }

              if (item.cleanParam) {
                if (
                  typeof item.cleanParam === "string" &&
                  item.cleanParam.length > 500
                ) {
                  throw new Error(
                    "Option `cleanParam` should be less or equal 500 characters"
                  );
                } else if (Array.isArray(item.cleanParam)) {
                  item.cleanParam.forEach(subItem => {
                    if (typeof subItem === "string" && subItem.length > 500) {
                      throw new Error(
                        "String in `cleanParam` option should be less or equal 500 characters"
                      );
                    } else if (typeof subItem !== "string") {
                      throw new Error(
                        "String in `cleanParam` option should be a string"
                      );
                    }
                  });
                } else if (
                  typeof item.cleanParam !== "string" &&
                  !Array.isArray(item.cleanParam)
                ) {
                  throw new Error(
                    "Option `cleanParam` should be a string or an array"
                  );
                }
              }
            });
          }

          if (options.sitemap) {
            if (
              typeof options.sitemap === "string" &&
              !isAbsoluteUrl(options.sitemap)
            ) {
              throw new Error(
                "Option `sitemap` should be have an absolute URL"
              );
            } else if (Array.isArray(options.sitemap)) {
              options.sitemap.forEach(item => {
                if (typeof item === "string" && !isAbsoluteUrl(item)) {
                  throw new Error(
                    "Item in `sitemap` option should be an absolute URL"
                  );
                } else if (typeof item !== "string") {
                  throw new Error(
                    "Item in `sitemap` option should be a string"
                  );
                }
              });
            } else if (
              typeof options.sitemap !== "string" &&
              !Array.isArray(options.sitemap)
            ) {
              throw new Error(
                "Option `sitemap` should be a string or an array"
              );
            }
          }

          if (options.host) {
            if (typeof options.host !== "string") {
              throw new Error("Options `host` must be only one string");
            }

            const address4 = new Address4(options.host);
            const address6 = new Address6(options.host);

            if (address4.isValid() || address6.isValid()) {
              throw new Error("Options `host` should be not an IP address");
            }
          }

          let contents = "";

          options.policy.forEach((item, index) => {
            contents += generatePoliceItem(item, index);
          });

          if (options.sitemap) {
            contents += addLine("Sitemap", options.sitemap);
          }

          if (options.host) {
            let normalizeHost = options.host;

            if (normalizeHost.search(/^http[s]?:\/\//) === -1) {
              normalizeHost = `http://${host}`;
            }

            const parsedURL = url.parse(normalizeHost, false, true);

            if (!parsedURL.host) {
              throw new Error("Option `host` does not contain correct host");
            }

            let formattedHost = url.format({
              host:
                parsedURL.port && parsedURL.port === "80"
                  ? parsedURL.hostname
                  : parsedURL.host,
              port:
                parsedURL.port && parsedURL.port === "80" ? "" : parsedURL.port,
              protocol: parsedURL.protocol
            });

            formattedHost = formattedHost.replace(/^http:\/\//, "");

            contents += addLine("Host", formattedHost);
          }

          return resolve(contents);
        })
    );
}
