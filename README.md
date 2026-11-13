# indakure.com

Website for IndaKure, an adult-use cannabis dispensary and garden at 1483 Lincoln Highway, Somerset, NJ.
Built and managed by Komunion Studio.

- **Hosting:** Netlify, auto-deploys from this repository's `main` branch. Every push goes live in about a minute.
- **Website files:** the `site` folder. Only that folder is published (see `netlify.toml`).
- **Signups:** "Notify me" and "Subscribe" forms post to a Google Sheet through `google-apps-script.gs` (deployed as an Apps Script web app). The web-app URL is set in `site/signup.js`.

## Pages

| Page | File |
|---|---|
| Home (Coming Soon) | `site/index.html` |
| About | `site/about.html` |
| Our Story | `site/our-story.html` |
| Garden Notes (blog list) | `site/blog.html` |
| Blog posts | `site/blog-post.html` (address: `/blog-post?post=<id>`) |
| Privacy & Terms | `site/privacy.html` (static HTML) |

Pages are HTML templates rendered in the browser by `site/support.js` (with React vendored in `site/vendor/`).
Markup sits inside `<x-dc>`; `{{ name }}` values and the page's data and behaviour come from the
`class Component` script at the bottom of each file. `<sc-if>` and `<sc-for>` are conditionals and loops.
Photos sit in `<image-slot src="…">` elements; their crop framing is in `site/image-slots.state.json`.

Links between pages use clean addresses (`/about`, `/blog`); `netlify.toml` maps them to the .html files and turns off Netlify's HTML post-processing, which otherwise rewrites links and breaks inline styles.

## Common updates

**New blog post**
1. Add an entry to `IK_POSTS` in `site/blog-post.html` (`slot`, `src`, `cat`, `read`, `color`, `ink`, `title`, `excerpt`, `body`).
2. Add the post card to the `all` list in `site/blog.html` and the `posts` list in `site/index.html`.
3. Put the photo in `site/assets/` (JPG, about 1800 px on the long edge).

**Swap a photo:** replace the file in `site/assets/` (same name), or point the `src` at a new file.

**Footer and license number:** each page's footer, search for `NJ CRC Lic.`.

**Roll back a bad deploy:** Netlify → Deploys → pick an earlier deploy → *Publish deploy*.

## Notes

- Site is informational only. No online cannabis sales. A future menu or pickup ordering would come from a cannabis platform (Dutchie, Jane) embedded on its own page.
- Tropiline webfont files are in `site/fonts/`. Confirm the font license covers web use.
- Keep copy free of medical claims, and frame "growing" as tending plants and community, never as cultivating the product.
