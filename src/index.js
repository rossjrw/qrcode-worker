import QRCode from "qrcode";

const stringParams = ["errorCorrectionLevel", "color.dark", "color.light"];
const numberParams = ["margin", "scale"];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Whitelist+normalise params to create cache key
    const allowedParams = ["url", ...stringParams, ...numberParams];
    const normalisedParams = allowedParams
      .map((paramName) => [paramName, url.searchParams.get(paramName)])
      .filter(([, paramValue]) => paramValue != null)
      .sort(([paramName1], [paramName2]) =>
        paramName1.localeCompare(paramName2),
      );
    const cacheKey = new Request(
      `${url.origin}/?${new URLSearchParams(normalisedParams).toString()}`,
      request,
    );

    // Try to get from cache first
    const cache = caches.default;
    let response = await cache.match(cacheKey);
    if (response) {
      return response;
    }

    const urlToEncode = url.searchParams.get("url");
    if (!urlToEncode) {
      response = new Response(
        [
          `${url.hostname} - QR code generator service`,
          `Usage: GET ${url.hostname}/?url=<URL>`,
          `Documentation: https://github.com/rossjrw/qrcode-worker`,
        ].join("\n\n"),
        {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        },
      );

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    const options = {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "L",
    };

    // Parse optional qrcode options from query parameters
    for (const param of stringParams) {
      const value = url.searchParams.get(param);
      if (value) {
        if (param.includes(".")) {
          const [parent, child] = param.split(".");
          if (!options[parent]) options[parent] = {};
          options[parent][child] = value;
        } else {
          options[param] = value;
        }
      }
    }
    for (const param of numberParams) {
      const value = url.searchParams.get(param);
      if (value) {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num > 0) {
          options[param] = num;
        }
      }
    }

    try {
      const svg = await QRCode.toString(urlToEncode, options);
      response = new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      response = new Response(`Invalid input: ${error.message}`, {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
};
