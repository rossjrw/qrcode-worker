# QR Code Worker

Minimal QR code generator hosted within the free tier on [Cloudflare Workers](https://workers.cloudflare.com/) through aggressive caching. Uses [npm qrcode](https://www.npmjs.com/package/qrcode) under the hood.

Used by [PR Preview Action](https://github.com/rossjrw/pr-preview-action) to display QR codes for preview links.

## Usage

```html
<img
  src="https://qr.rossjrw.com/?url=https://github.com/rossjrw/qrcode-worker"
  width="80"
/>
```

<img src="https://qr.rossjrw.com/?url=https://github.com/rossjrw/qrcode-worker" width="80">

The QR code image is always returned as an SVG without implicit sizing, able to be displayed at whatever scale is needed.

The `url` query parameter should be [URI-encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).

Some [qrcode](https://www.npmjs.com/package/qrcode) options are supported as query parameters:

- `errorCorrectionLevel`: L, M, Q, H (default: L)
- `color.dark`, `color.light`: RGB hex code without leading #
- `margin`: number (default: 1)

```html
<img
  src="https://qr.rossjrw.com/
    ?url=https://github.com/rossjrw/qrcode-worker
    &errorCorrectionLevel=H
    &color.dark=f00
    &color.light=00f
    &margin=5
  "
  width="80"
/>
```

<img
  src="https://qr.rossjrw.com/?url=https://github.com/rossjrw/qrcode-worker&errorCorrectionLevel=H&color.dark=f0f&color.light=0ff&margin=5"
  width="80"
/>

## Terms of use

qr.rossjrw.com is built for [PR Preview Action](https://github.com/rossjrw/pr-preview-action) but I'm not going to be moderating its usage unless someone starts causing problems.

To that effect, I reserve the right at any time and without notice to terminate the service or change its output.

All other hosted QR code services, whether free or paid, also reserve this right, whether they choose to be explicit about it or not.

## Deployment

This codebase uses the MIT license. Feel free to fork it, change whatever you like (e.g. the terms of use) and redeploy it for your own use.

No configuration needed on the Cloudflare end, just link your git repo and add a custom domain if you like.

Aggressive [worker caching](https://developers.cloudflare.com/workers/runtime-apis/cache/) is already included.
