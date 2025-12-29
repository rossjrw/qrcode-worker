import QRCode from "qrcode";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    const urlToEncode = url.searchParams.get("url");
    if (!urlToEncode) {
      return new Response(
        [
          `${url.hostname} - QR code generator service`,
          `Usage: ${url.hostname}/?url=<URL>`,
          `Documentation: https://github.com/rossjrw/qrcode-worker`,
        ].join("\n\n"),
        {
          status: 400,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }

    const options = {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "L",
    };

    // Parse optional qrcode options from query parameters
    const stringParams = ["errorCorrectionLevel", "color.dark", "color.light"];
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

    const numberParams = ["margin", "scale"];
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
      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      return new Response(`Invalid input: ${error.message}`, {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
