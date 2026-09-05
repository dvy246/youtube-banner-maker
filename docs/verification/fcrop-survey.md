# YouTube Channel Banner Crop Survey

**Survey date:** 2026-09-05  
**Status:** Gate 0 not passed  
**Method:** Read-only requests to public YouTube channel pages and banner CDN assets. No authenticated API or browser session was used.

## Purpose

This survey tests the provisional crop constants in `IMPLEMENTATION.md` before they become product behavior. The implementation specification requires all four device rectangles to match across at least eight channels. The current public desktop response lets us verify the desktop rectangle and width ladder, but it does not expose independently attributable TV, tablet, and mobile banner sources.

## Method

For each channel:

1. Fetch `https://www.youtube.com/@<handle>` with a desktop browser user agent.
2. Locate the `banner.imageBannerViewModel.image.sources` object.
3. Extract only URLs inside that banner object. Page-wide `fcrop64` searches are invalid because Community post thumbnails use unrelated crop tokens.
4. Record each declared width and `fcrop64` token.
5. Request the `w1707` banner source with `Accept: image/webp` and record the actual response type, byte length, and cache headers.

The `fcrop64` token consists of four unsigned 16-bit coordinates. For token `x1 y1 x2 y2`, normalized values are obtained by dividing each coordinate by `65535`; width and height are `(x2 - x1) / 65535` and `(y2 - y1) / 65535`.

## Desktop Banner Results

All eight banner objects exposed the same six-width ladder and the same crop token:

`w1060`, `w1138`, `w1707`, `w2120`, `w2276`, `w2560`  
`fcrop64=1,00005a57ffffa5a8`

| Channel | Handle | Desktop token | Match | w1707 type | w1707 bytes |
|---|---|---|---|---|---:|
| Veritasium | `@veritasium` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 134,061 |
| Marques Brownlee | `@mkbhd` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 42,905 |
| MrBeast | `@MrBeast` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 32,057 |
| Kurzgesagt | `@kurzgesagt` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 23,974 |
| Linus Tech Tips | `@LinusTechTips` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 87,539 |
| Ali Abdaal | `@AliAbdaal` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 58,059 |
| NASA | `@NASA` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 33,279 |
| TED | `@TED` | `00005a57ffffa5a8` | Yes | `image/jpeg` | 34,791 |

Decoded desktop rectangle:

| Coordinate | Raw | Normalized |
|---|---:|---:|
| x1 | 0 | 0.000000 |
| y1 | 23,127 | 0.352895 |
| x2 | 65,535 | 1.000000 |
| y2 | 42,408 | 0.647105 |
| width | 65,535 | 1.000000 |
| height | 19,281 | 0.294209 |

**Finding:** The provisional desktop rectangle is supported across this sample.

## Re-encode Results

The CDN ignored `Accept: image/webp` for all eight sampled `w1707` sources and returned `image/jpeg`. Every response included `cache-control: public, max-age=86400, no-transform`.

Observed byte sizes ranged from **23,974 to 134,061 bytes**, a 5.59x spread. The median was **38,092 bytes** and the mean was **55,834 bytes**.

**Finding:** `134,000` bytes is a valid observation for one image, but it is not supported as a typical or fixed YouTube byte budget. Encoded size varies materially with image content. A simulator may model downscaling and JPEG re-encoding, but should not target one fixed byte count as though YouTube does.

## Official Upload Guidance

Source: [YouTube Help: Manage your channel branding](https://support.google.com/youtube/answer/10456525?hl=en), retrieved 2026-09-05.

The current page states:

- Minimum upload dimensions: 2048 x 1152 px at 16:9.
- Safe area for text and logos at minimum dimensions: 1235 x 338 px.
- Recommended dimensions, especially for TV: 2560 x 1440 px.
- Images are cropped on certain views and devices.
- File size: 6 MB or smaller.

**Finding:** The upload dimensions, official safe-area dimensions, and 6 MB limit remain current.

## False-Positive Investigation

A page-wide scan initially found additional tokens, including:

- `00000000ffffffff`
- `00002df3ffffd20c`
- `23400000dcbfffff`
- several channel-specific tokens on `@PewDiePie`

Context inspection showed these URLs under `backstageAttachment.backstageImageRenderer`, which represents Community post images. They are square post thumbnails, not channel banner sources. They must not be used as evidence for TV, tablet, or mobile banner geometry.

**Finding:** Only tokens found inside `banner.imageBannerViewModel.image.sources` are accepted by this survey.

## Domain Signal

Read-only checks on 2026-09-05:

- DNS returned no A or NS records for `youtubebannermaker.com`.
- Verisign RDAP returned HTTP 404.
- WHOIS returned `No match for domain "YOUTUBEBANNERMAKER.COM"` while also printing a registry service status line.

These signals indicate no current registry object was found. They are not a purchase or reservation guarantee. No registration attempt was made.

## Canva Verification

Direct access to `https://www.canva.com/create/youtube-banners/` returned a Cloudflare HTTP 403 challenge. A Jina Reader fallback retrieved navigation and partial page text, but not enough editor behavior to verify signup, export, watermark, safe-area enforcement, or free-plan limits.

**Finding:** Canva capability claims remain unverified. They must not be published as facts.

## Gate 0 Verdict

**BLOCKED, not passed.**

Supported:

- Desktop crop token is identical across eight diverse channels.
- Desktop width ladder is identical across the sample.
- Official dimensions, safe area, and file-size limit are current.
- Served desktop assets are JPEG in this sample.
- CDN cache behavior is consistent across the sample.

Not yet supported to the gate's required standard:

- TV crop rectangle across eight channels.
- Tablet crop rectangle across eight channels.
- Mobile crop rectangle across eight channels.
- A fixed or typical `134 KB` re-encode target.

## Decision Required Before Stage 1

The current specification assumes four measured per-device crops and a fixed re-encode byte target. The evidence supports a narrower model:

1. Treat the official safe area as the guaranteed text/logo region.
2. Treat the eight-channel desktop crop as measured behavior, dated to this survey.
3. Label TV/tablet/mobile previews as specification-based layouts unless independently measured from attributable device responses.
4. Simulate a representative downscale plus JPEG round-trip without claiming or targeting a fixed YouTube byte budget.

Adopting this model changes a product-defining claim and requires explicit review before `IMPLEMENTATION.md`, `PRD.md`, or engine constants are changed.
