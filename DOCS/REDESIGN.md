# Reading Desk Redesign

The homepage document title is `The Little Nest`. Public child pages use
`The Little Nest - <page title>`, with the article title on post detail pages.

The public reading desk starts at `/`. Posts groups all public articles by year with title/date rows and counts,
with UUID article detail routes; Thoughts and Events show full documents using
the shared feed and timeline. The homepage has no footer. Copy belongs to the
layout, desk, and display features. The playlist remains shared with scripts.
Appearance preferences and tokens are shared with administration. UI copy is
English; business content stays in its original language. Public content and
counts use anonymous server-side Supabase reads; see
[Architecture](./ARCHITECTURE.md#public-content-and-caching).

## Development and Preview

Use the [standard development commands](../README.md#development), then visit
`/`. The reading desk shell works without database credentials; content and counts
show an unavailable state if Supabase is unconfigured. Authentication requires
`ADMIN_TOKEN`; the dashboard also requires Supabase credentials.

To build just the public pages when Supabase is unavailable:

```sh
NODE_ENV=production bun run build --debug-build-paths 'src/app/(site)/**/page.tsx'
NODE_ENV=production bun run start --port 3001
```

This is a partial verification build, not a deployable replacement for the whole
site. It replaces the local production build artifacts and includes only the
selected routes. Run the normal full build with configured Supabase before any
whole-site deployment. See the [verification workflow](../README.md#verification).

## Runtime and Build Boundaries

The public UI lives under `(site)` and serves unprefixed URLs. Authentication
and dashboard routes remain under `(admin)` with their existing providers.
Reusable controls live in `src/components`; shared StyleX tokens live in
`src/design`. Each group owns a root layout,
and there is no shared `app/layout.tsx`. Navigating between roots loads a new
document; navigation inside the public site keeps its curtain controller mounted.
Dashboard operations use authenticated Server Actions. The five former redesign page
URLs permanently redirect to their unprefixed counterparts, while audio URLs
and storage keys remain unchanged. Article details use `/posts/<uuid>`; unknown or hidden articles show a not-found page. The public layout permits search indexing.
The public site uses the `ex` monogram in `public/favicon.svg`, with a light
background that keeps the dark mark legible in both light and dark browser tabs.

StyleX 0.19 uses the official Babel and PostCSS pipeline. `babel.config.js` must
use the `.js` extension: this Next.js Babel loader rejects `.cjs` and `.mjs`
configuration files. PostCSS reuses the Babel plugin options, scans all source TS/TSX files and replaces the single `@stylex` directive in
`src/design/stylex.css`, imported by both roots. Babel resolves the TypeScript
path aliases relative to the project working directory, including when Turbopack
bundles the PostCSS configuration.
Runtime style injection is disabled. Next.js retains Turbopack and React Compiler.

The Babel configuration applies to the project build, and both roots import the same generated
StyleX stylesheet. Each root retains its own reset; the public scrollbar and
Lenis behavior do not apply to administration pages. The extra Babel compilation is a
build-time tradeoff; it does not introduce a runtime style engine.

StyleX's `valid-styles`, `valid-shorthands`, and `no-unused` rules run through the
existing Oxlint JavaScript-plugin support. Use explicit border components,
corner radii, and grid start/end properties. Unsupported multi-value shorthands
can otherwise compile without the intended styling.

## Design System

The live guide at `/system` consumes the same tokens and interaction
styles as the homepage. Shared foundations and semantics live in `src/design/tokens.stylex.ts`.
The same file owns scene materials, lighting, and every light/dark override.
Scene composition styles and object markers remain in `src/app/(site)/_design`:

- **Foundations:** system font stacks (including separate artistic and signature roles), typography scale, spacing,
  shape, and breakpoints.
- **Semantics:** canvas, surface, text, muted text, accent, focus, inverse text,
  reading widths, contact/lifted/inset shadows, and animation/layer constants.
- **Materials:** book cloth and paper edges, lamp shade and warm light, vinyl
  grooves and label, computer casing, CRT screen, and phosphor text.

`defineVars` supplies themeable values; `defineConsts` supplies media queries and
fixed animation constants. A local `createTheme` override dims the lamp without
changing the site's appearance preference. Component geometry remains beside
its owner. StyleX styles belong in components or `.style.ts` modules; token
exports and named `defineMarker` exports belong in `.stylex.ts` files as required
by the compiler. Shared object feedback uses `when.ancestor` for hover and
keyboard focus. On desktop, two-pixel frames loosely enclose each complete object; only
the record uses a circular frame. Accent-colored pill labels overlap the top border and
rise seven pixels into place as the frame fades in. Dedicated `objectLabelBackground`
and contrasting `objectLabel` tokens keep the label surface distinct from the desk and lamp glow.
The full border runs beneath the opaque label, meeting its actual edges without
a fixed-width cutout. Mouse clicks do not retain object feedback after pointer
exit; keyboard `:focus-visible` on an object or an inner control retains its
focus feedback. On phones (≤600 px), interactive object names remain visible and their
frames are suppressed, including during hover. Decorative items stay unlabelled.

All rendered colors, including selection, gradients, material highlights, and
shadows, are defined in `src/design/tokens.stylex.ts`. The public and admin roots
use the same neutral light/dark semantics and blue accent. Curtain, navigation,
feedback labels, and controls consume these tokens. Physical materials retain
their identity while dark variants adjust ambient light, highlights, and depth.

On phones, opening Menu reveals the navigation glass background even at the
top of the page. Closing it restores the background's scroll-dependent visibility.

The navigation theme button cycles System → Light → Dark → System. It stays
available on phones and uses the same control as administration. Both roots
share the existing `theme` storage key; System is the default and follows OS
changes. Pre-paint classes prevent the wrong theme from flashing before hydration.
Cross-tab changes update appearance without resetting content or playback.
The System guide shows locally scoped Light and Dark examples covering interface
colors, materials, lighting, and shadows. Its sample overrides do not change the
page preference. The lamp independently toggles a separate intensity token group for glow and
bulb opacity, without changing the inherited warm-light palette. Theme changes
share one 300 ms document crossfade for manual, system, and cross-tab updates.
Reduced motion and unsupported browsers switch directly.

GitHub, Email, X, and Bilibili icons follow the introduction. Their local URLs
intentionally remain `null`. Unconfigured entries use `aria-disabled` buttons
with no navigation action, retaining hover previews and keyboard focus.

Only the small reset, CSS entrypoint, Lenis structural stylesheet, and no-script curtain fallback use raw CSS.
All owned component styling uses StyleX. Motion owns animated transform/opacity values
for the curtain, page entry, and magnetic content. There are no legacy token references, Tailwind
utilities, downloaded artwork, shared legacy icons, or external font requests.

Responsive layouts use phone ≤600px, tablet 601–1023px, and desktop ≥1024px.
Desktop arranges separate objects with staggered positions and angles, without overlaps
around a vertically centered introduction and sizes the desk against the
viewport height. A minimum usable scene height allows natural scrolling on short
windows instead of clipping objects. Tablet and phone use bounded, responsive object compositions with staggered
positions instead of uniform item rows. Smaller objects cluster around the larger
display, books, and record; the narrowest widths add vertical clearance to protect
labels and click targets. Each object keeps its own clear space, including decorative
coffee and pencil; only parts within a single object (such as the book stack) overlap. Normal document scrolling remains available.
The hero uses the same handwritten font token as the Thoughts letter.

## Administration Design System

Authentication and the four dashboard sections share typography, shapes, and
semantic token names. Administration applies its own white/zinc light palette,
neutral dark palette, and blue accent. Its sidebar, post table, thought feed,
event timeline, and file gallery follow the original CMS layout. Additional semantics cover input and
selected surfaces, disabled and status colors, overlays, image-viewer surfaces,
and code tokens. `/system` includes shared form and status samples with a locally
scoped dark example. At widths up to 767 px, the sidebar becomes a top navigation. Its Menu disclosure
reuses the homepage hover, touch, and keyboard behavior; expansion animates the
header height and pushes the content down. Closed links are inert.

Owned components compose StyleX declarations through `xstyle`, variants, and
sizes. Color values stay in token modules; event colors remain business content.
BlockNote uses a scoped CSS adapter supplied by StyleX variables. Sonner uses
its class-name API with StyleX styles. Appearance state is shared across both roots,
including pre-paint theme classes, system changes, and cross-tab persistence.
Inputs use borderless surfaces and labels that rise on focus or populated values.
Buttons and icon actions use the shared `Magnetic` primitive with stationary hit
areas, transparent surfaces, and semantic hover colors. Compact dashboard controls
keep their sensing area within their bounds. Close controls draw a circular outline
on hover or keyboard focus, with reduced-motion support. Publish time appears as
English date text that opens a date/time picker; event color is a single clickable
swatch. Hide/Show remains text-only.
Content loading uses one shared inline component; editing occupies the full
content surface with metadata in the toolbar and no separate preview mode.
See [Architecture](./ARCHITECTURE.md) for the token login and content data flow.

## Interaction Rules

- The left signature is the Home link: its copyright symbol rotates once while
  `code` slides down and fades into `design`. The complete default `code by ech0xff` signature uses the same upright monospace
  font, size, and weight. Only `design` uses the larger, contrasting italic serif.
  The byline is always lowercase (`by ech0xff`). ResizeObserver measures both word spans so
  their actual font widths animate the byline position without clipping. Posts, Thoughts, and Events use a small current-page dot;
  Hover and current states share the same accent color and dot. Home has no dot. Decorative item numbering and the flower mark are omitted.
- The greeting hand waves once every three seconds. Reduced motion disables
  waving and spatial hover transitions.
- Object names sit centered across the top edge of enclosing frames on hover or keyboard focus, with
  no captions below the objects. The vinyl outline is circular. Hovering the
  books combines a slight lift and group rotation with a separate front-volume
  shift. Letters fan gently; the calendar page tilts around its binding.
  Coffee and pencil are decorative and have neither frames nor labels.

- The curtain shows only the greeting or destination name, centered throughout
  the transition and any data wait. It has no spinner, loading caption, or timeout
  controls. Each greeting appears once, including Hello, Hallo, and Ciallo~. A fresh
  randomized permutation is chosen only when an intro actually runs. The initial
  curtain has no fixed greeting, preventing a pre-hydration Hello flash. The final
  greeting remains through data waiting and reveal; direct loads never switch
  from a greeting to the route name.
- Internal navigation covers over 400 ms and reveals over 550 ms once the
  destination route is ready.
- Greetings play once on direct loads and reloads of every public page, including
  article details. The persistent root
  prevents replay on internal returns; browser history restoration and reduced
  motion bypass them. No session or daily storage is involved.
- Ordinary public site links prefetch while covering the old page, navigate, then reveal the new
  page. Modified clicks retain Next Link behavior. Inert content and a temporary
  scroll lock protect the transition. Revealing requires the target route's
  complete data and document rendering, not merely a changed URL. Direct visits
  also wait for readiness after greetings finish. History changes cancel old
  animations and use a static waiting layer; reduced motion also uses static
  waiting. The visible page heading receives focus after completion. See
  [route readiness](./ARCHITECTURE.md#public-route-readiness).
- The tilted display has three icon buttons for CLI, Stats, and Guestbook at
  the bottom right. The `>_` prompt appears only in CLI; the clock stays at the
  bottom left. Each icon has an accessible name and pressed state. The casing height stays fixed across programs. Selection displays the target panel immediately;
  a 220 ms opacity/three-pixel entry transition and a faint scan run independently of content readiness.
  Reduced motion disables both animations. React Activity boundaries retain panel
  state and suspend effects while a program is hidden.
  The CLI retains its typed position while another program is selected. Its timer
  also suspends off-screen and in hidden documents; reduced motion shows complete
  static text. There is no manual pause control.
- Only painted lamp geometry accepts pointer clicks; its nearby tooltip names
  the next action as transparent text to its left. The lamp has no enclosing
  frame; its hint fades with a small horizontal movement on hover or keyboard
  focus. Reduced motion removes that movement. Keyboard activation uses the same button. The lamp controls
  only local lighting tokens. The glow gradient keeps its warm colors while the
  whole light field fades over 650ms, matching the bulb; rapid toggles reverse
  the ongoing opacity transition. Record rotation follows actual
  audio playback and stays still when reduced motion is requested.

## Magnetic Controls and Clock

`Magnetic` sits inside a native link or button. Its fixed outer span measures
pointer position; a pointer-transparent Motion span moves only the contents.
The control's hit area stays still. Spring targets are Motion values, avoiding
React renders on every pointer movement. Strength, maximum displacement (7 px),
sensing extensions (8 px horizontally and 10 px vertically), and spring parameters
live in motion tokens. Adjacent social controls leave enough room for these
fixed hit areas. Pointer exit/cancellation returns
the contents to rest. Touch, coarse pointers, and reduced motion skip tracking.
The display clock intentionally has neither magnetic movement nor a hover hint.
Navigation dots live inside the moving contents. Object CSS transforms remain
separate from their internal parts and feedback frames.

The clock sits inside the display at the bottom left at every breakpoint. It displays the visitor's local time to the second, toggles
between 24-hour and 12-hour formats, and remembers the selection under
`redesign:clock-format:v1`. Storage failures fall back to in-memory state.
Tabular numerals and a reserved width prevent layout shifts. The clock starts
with a hydration-safe placeholder, resynchronizes to system time on each tick,
and suspends updates while the document is hidden. It has no live region.

## Responsive Navigation and Scrolling

The sticky header remains at the viewport top while scrolling, with a translucent
theme surface at 80% opacity, background blur, and the same fading lower edge
at every breakpoint after scrolling away from the top. At scroll position zero,
the backing surface is fully transparent, including with the phone menu open.
On phone menu expansion, this surface extends down to keep links readable over content,
without a bordered panel. The progress line remains above the header, and the
curtain covers both. The shared header-height token keeps the lamp cord connected to the top edge
on every breakpoint. The light field starts lower on the desk and remains
bounded by the scene. At widths up to 600 px, the right navigation becomes a
`• Menu` disclosure. Its links appear below the trigger without a panel or
border. Mouse hover, touch clicks, Enter/Space, and Arrow Down open it; Escape,
leaving the whole navbar without keyboard focus, moving focus away, selecting a link,
or clicking outside close it. The expanded background remains part of the navbar hit area. Menu-mode navigation dots sit to the left of labels. The backing surface animates its bottom edge over
280ms; links enter after 70ms, and closing delays the backdrop by 80ms. Hidden
phone navigation is inert immediately while its visual fade completes.
Arrow Down focuses the first link and Escape
returns focus to the trigger. Desktop and tablet retain the inline navigation.

At widths of 1024 px and above, the home desk uses the viewport height remaining
below the header, with a minimum usable scene height. Desktop composition scales uniformly into the available viewport below the header. Tablet and phone layouts retain normal document scrolling.

The redesign root owns one Lenis 1.3.26 instance with `autoRaf`, wheel smoothing,
and a token-controlled lerp of 0.12. Touch retains native inertia (`syncTouch:
false`). Reduced motion destroys the instance and restores native scrolling;
changing the preference back recreates it. Curtain activity stops Lenis and
releases it when navigation completes or the watchdog clears the overlay.
Browser history retains Next.js scroll restoration. The instance is destroyed
when its root unmounts. No administration route loads this scrolling integration.

The reset hides native scrollbars while preserving scrolling input. A fixed
three-pixel top progress line reflects the native scroll position through a
Motion value; it is hidden during curtains or when the page fits in the viewport.
ResizeObserver and scroll/resize events keep the progress synchronized across
route changes and responsive layouts. The indicator is decorative, not a drag
control. The CSS from Lenis supplies structural scroll-lock rules only; visual
styles remain in StyleX.

## Built-in Music and Audio Analysis

The public site ships two audio files in `public/redesign`: the original 16-second
synthesized “A quiet morning” (`quiet-morning.wav`) and “Miku feat. Hatsune Miku”
by Anamanaguchi (`miku.mp3`, 223.125 seconds). The latter was obtained from the
[artist's official track page](https://anamanaguchi.bandcamp.com/track/miku-feat-hatsune-miku)
on 2026-09-13. `sourcePage` records provenance only; playback makes no external
requests and does not use an expiring stream URL. Both tracks have non-lyrical
VTT descriptions. The complete Miku title is displayed on the upper arc.

Regenerate the original recording and both precomputed spectra with:

```sh
bun scripts/generate-redesign-audio.ts
bun run audio:analyze
```

The analysis command decodes the local files into temporary mono PCM16 audio
at 11,025 Hz using FFmpeg (or macOS `afconvert` when FFmpeg is unavailable).
It runs a centered 1,024-sample Hann-window FFT and stores 24 logarithmic frequency
bands from 45 to 5,000 Hz at 30 frames per second. Temporary decoded files are
removed afterward. Decoding tools are needed only to regenerate the committed
analysis assets, not to build or run the website.

Each `.spectrum.bin` has a 16-byte header: ASCII `SP01`, little-endian uint16 FPS,
uint16 band count, uint32 frame count, and float32 duration. Unsigned 8-bit band
samples follow in frame order. Miku's spectrum is about 161 KB and the original
track's is about 12 KB. The browser validates the header and payload length,
then interpolates frames using the audio element's actual `currentTime`.
Seeking, repeating, and changing tracks therefore keep the effect synchronized.
No Web Audio graph or cross-origin browser analysis is required.

The 96 decorative radial spokes use stronger bass response and a maximum
34-unit extension in their SVG coordinates. Their level follows recorded energy
and playback volume. Silence, mute, pause, buffering, hidden documents, and reduced
motion suppress the effect; reduced motion also keeps the disc still. Animation
updates the SVG path without per-frame React state changes. Changing tracks aborts
outstanding spectrum fetches; an unavailable analysis never prevents audio playback.

The record reveals stationary controls on hover or keyboard focus; phone and
non-hover devices always show them. Hover never starts or stops music. The center
retains a plain colored label and spindle hole. The entire disc remains a native
playback button. A lower arc beneath the progress rail contains previous, pin, play/pause,
playback mode, and next controls. The progress rail uses a smaller inner radius
to keep the icons inside the record with separate seek and button targets. All icons
have transparent backgrounds and keep their original color after activation. Pin
rotates 35 degrees when fixed instead of changing color. Pin retains the controls after pointer exit without
changing playback intent. The artist subtitle and song-list popover are omitted.

The lower arc supports mouse/touch dragging with pointer capture and Arrow,
Page Up/Down, Home, and End keys. Controls are siblings of the disc button, so
seeking, pinning, and changing modes cannot accidentally toggle playback. A
screen-reader status reports playback or unavailable audio. Explicit playback
rejection remains retryable. Leaving the homepage or hiding the document pauses
audio; returning does not restart it.

Playback modes cycle through repeat-all (default), repeat-one, and shuffle.
Repeat-all advances and wraps when a track ends. Repeat-one restarts the same
recording; manual previous/next still switch tracks. Shuffle selects another
track, excluding the current one. With two tracks, shuffle necessarily alternates.
Automatic advances start at zero; manual switching restores the saved position
for the selected song and preserves whether playback was paused or playing.

## Persistent Desk Preferences

The public shell has its own Jotai Provider. Each feature owns its stored atoms:
record session, control pinning and playback mode; lamp state; clock format;
display program; the local like marker; and guestbook tabs and drafts.
The shared `storedPreference` factory uses Jotai JSON storage, validates values
with the owning schema, catches read/write failures, and reconciles storage
events. The clock alone supplies migration of its old plain-string value.
Record recovery normalizes parsed values directly without serializing them again.
All existing storage keys remain compatible. Playback intent, animation frames,
and hover state stay transient.

The server and initial client render use deterministic defaults; stored preferences
load on mount. Storage events synchronize preferences across tabs. Remote
track/progress updates reconcile the active audio element in the paused state;
they never autoplay. Local progress is saved at most once every five seconds and flushed
on seeking, switching, pausing, hiding the page, and unmounting. Saving local
progress, changing playback mode, and pinning controls do not reload the audio.
Playback intent, hover visibility, spectrum frames, and the current clock tick
are transient and are not persisted.

The recording editor imports files and direct URLs with metadata prefill and
durable audio/analysis storage. It reuses the analysis format above and keeps
decoding outside ordinary playback requests. See [audio import operations](../README.md#audio-imports)
for setup and deployment verification.

## Display Content

Stats reads public Posts, Thoughts and Events counts plus likes and page views
through Supabase RPC. Each content label includes a small link icon and navigates
to its route. The same marker appears beside navigable desk object labels.
The eye displays total views; a successful like sets the local marker and disables
the button. No visitor identity or cancel-like control is involved.

Guestbook provides Read and Write tabs with keyboard arrow navigation. Public notes load from Supabase, 50 at a time with a Load more control. Read scrolls independently below its fixed tabs with its scrollbar hidden.
Text selection is disabled in Read to avoid selection blocks while dragging the
small scroll surface; Write retains native text selection and editing.
It is keyboard-focusable, and `data-lenis-prevent` keeps wheel and touch input native
inside the list instead of scrolling the desk. The textarea has the same Lenis
exclusion for long comments. Verify nested scrolling with actual wheel input;
setting `scrollTop` alone does not exercise Lenis interception. Write uses a fixed,
borderless form with icons in a fixed left column and inputs on the right. Message
lines wrap within the right column, aligned with the first line; there are no text
or chevron prefixes. Only long textarea content scrolls internally. The native
inputs retain selection, paste, autofill, and IME support. A phosphor block caret
uses progressive `caret-shape: block`; browsers without support retain their native
caret. The clock and program icons stay fixed in both views.

Name and email are optional. Blank names render as Anonymous, and supplied email
addresses appear below names in smaller text; missing addresses display
`No email provided`. Message headers place a circular avatar at the left and the date
at the far right. Message text is trimmed and validated. Name, email, optional GitHub username,
and message drafts persist as they are edited. Successful submission persists the note, clears the message, returns to Read,
and focuses its tab. Failed or rate-limited submissions retain the draft. All submitted text
is rendered as React text, never HTML. No storage-status copy is shown in the form.

Avatars use only the optional GitHub username supplied in Write, via the account's
`https://github.com/<username>.png?size=64` image URL. Email is display metadata and
is never searched or sent to an avatar service. Usernames are validated before
submission; old drafts and messages without this field remain compatible. Missing usernames and failed
images use the same person icon as the Write form. Loaded avatars retain their
original colors and opacity inside the circular crop. There is no email lookup,
Gravatar fallback, or GitHub API request.

Comments publish immediately, with emails displayed. The database rejects new
comments when ten have already succeeded in the last rolling 60 seconds, including
concurrent requests. Admins can hide, restore and delete notes in Guestbook.
See [Architecture](./ARCHITECTURE.md#desk-rpc) for RPC boundaries.

## Feature Boundaries and Display Loading

Public UI is grouped into layout, desk, record-player, and display modules.
Component styles, state, schemas, and private hooks stay with their owner.
The system route owns its design samples. Shared object feedback renders frames
and labels while each object owns geometry. Navigation effects live in the
navigation hook; the shell composes the header, content, and curtain.

The server homepage composes the computer's rendered content slots. Stats and
Guestbook use explicit request state to show the shared Loading component across
the entire upper viewport, centered horizontally and vertically. The clock and
program buttons stay available; read/write tabs and partial data are replaced
during reads, including retries and loading more entries.
Selecting a program immediately selects its slot; scan animation is decorative.
The shell never imports data-access components. Stats and Guestbook read on activation, with local loading, error and retry
states; there are no artificial delays, polling or Realtime subscriptions.

Automated checks retain five critical boundary suites. Browser acceptance covers
theme synchronization, desktop and mobile object controls, playback recovery,
guestbook persistence, and dashboard editing/upload flows. See the
[verification workflow](../README.md#verification).

## Public Reading Layout

Posts, Thoughts, Events, article details, and content error states share the
`ContentShell` reading container: a 768 px maximum outer width with 24 px side padding (720 px of content),
and 40 px side padding on phones to leave room for the compact TOC. The directory
is outside this shared content width. At 1280 px and above,
the fixed TOC derives its horizontal position from the same reading-width token
plus a gap. Its vertical center follows the article body center, capped at the viewport center and kept below the sticky header when the body center scrolls above the viewport. The body excludes the title and date. There is no Contents heading, icon, or reserved heading space. ResizeObserver remeasures body changes including asynchronous images and diagrams. It never consumes body width.
Full contents use a thin left rail, hierarchical indents, and an accent-colored
visible section range. Narrower views use a fixed rail of short lines with a single
bright, long peak centered on the visible section range and tapered neighbors.
The compact rail always includes every heading: row spacing compresses to fit the
available height, and the rail cannot scroll.
Mouse hover, keyboard focus, or a touch tap morphs those same lines into the full
scrollable directory over 440 ms: the rail expands, rows spread, and labels appear.
The motion hook measures the two layouts at interaction boundaries and animates
transforms and opacity; it does not animate row heights or repeatedly correct
scroll positions through a resize observer. Pending animations are cancelled on
reversal, breakpoint changes, reduced motion, and unmount.
On compact screens, the expanded directory starts at viewport top and fills `100dvh`; its list scrolls internally. The collapsed rail and wide-screen directory remain visible at the bottom of an article. No title or icon space is reserved.
A fading canvas veil keeps text legible without a bordered popup or article shift.
Reduced motion removes the transition. Selection, outside clicks, and Escape
close it; long directories keep the current link visible. Touch pointer-leave
events never schedule hover dismissal, and pointer focus cannot toggle a tap twice.
Internal pointer presses are tracked before focus changes: WebKit can blur the
trigger to the document body before dispatching a chapter click. That blur must
not collapse or inert the links; keyboard focus leaving the TOC still dismisses it.
Browser regression checks include repeated chapter taps, internal scrolling to the
last chapter, hash history, outside dismissal, and keyboard exit in mobile WebKit.
The TOC portals into an untransformed shell host beside the animated main element.
This keeps viewport coordinates stable during page entry while the shell still
applies its transition focus lock to the directory.
Native heading links retain hashes, history, header clearance, and Lenis support.

The Posts archive uses the shared reading shell. Year groups keep their counts.
Each row owns its left border and indentation (24 px, or 12 px on phones), so
adjacent borders form a continuous line while each segment responds independently.
Every title/date row is a full-width link at least 44 px high and requests full
article prefetching when it enters the viewport. Titles and dates
remain on one line at every width: titles truncate with an ellipsis, retain their
full accessible text and native title tooltip, and dates remain intact on the
right. Title sizes are 18 px / 14 px on phones; dates use 14 px / 12 px. Hover and
keyboard focus paint the whole row surface and accent its left border. The summary may wrap and shows the public
count and approximate non-whitespace document characters, including titles.
Tags and per-post excerpts are omitted.
Public lists have no pagination or load-more control. Dashboard pagination is
unchanged. Shared visibility controls use a blue selected segment, and all Posts
table columns, including action groups, center beneath their headings. The auth
card has a token-driven border and shadow in both themes. Its return link uses
the shared magnetic interaction. The token field keeps its filled background and
accent underline at rest; its label floats only on focus or when populated.

Page introductions use the cached public list totals: Posts and Thoughts include approximate
non-whitespace document character counts; Events reports its recorded event count.
Events do not require a heading and can render body text or media alone.

Readonly document images in both roots open the shared native-dialog image viewer,
including Posts, Thoughts, and Events. Exported image triggers are keyboard-accessible
buttons. The viewer uses transparent image and control surfaces, with borderless
zoom-in/out magnifiers and a percentage label. Clicking anywhere except the zoom
buttons dismisses it, including the image, padding, and percentage; Escape and
focus restoration remain supported. Its surface is excluded from Lenis scrolling. Thoughts use 16 px vertical entry padding
with no separate media reservation or bottom margin; images remain inline.

## Columns and Link Cards

The editor uses BlockNote's official multi-column extension. `/Two Columns` and
`/Three Columns` create layouts; native drag handles move blocks into, between, or out
of columns, and dividers resize widths. Undo/redo remains native. Columns accept
ordinary blocks, including images, audio, video, files and cards, and stack on
phones. Previously saved custom media rows remain readable and migrate to native
columns on editing. There is no custom row toolbar.

Standalone URL paragraphs offer Turn into link card, alongside `/Link card`.
The only field is the URL. After a short typing pause, the authenticated editor
fetches Microlink metadata and saves the snapshot alongside the document. A small
refresh icon retries parsing. Late responses cannot overwrite a changed URL.
Failures retain a usable link. Reading never requests metadata.

Cards follow the historical meta directive: a compact publisher line, title,
summary and hostname, with an optional cover at the right. Column cards place the
cover above the text; narrow standalone cards keep a smaller cover. Both roots reuse
shared surface, border, typography and motion tokens.

## Item Layout and Editing

Item definitions own display names, config schemas/defaults, size limits, collision
padding, and capabilities. Existing object renderers receive configuration through
props. Introductory copy and terminal lines are configuration; guestbook data,
statistics, and playback stay in their existing features. The lamp and introduction default to fixed positions and participate in collision
detection. Appearance can enable or disable dragging for each item, including
decorations. The initial desktop composition retains the original display and record player in the upper corners, books and letter in the lower corners, and calendar and coffee below the centered introduction. Reference placements account for item frame padding. Reference layouts use desktop/tablet/phone dimensions and
preserve the composition across viewport changes. Fixed items retain their saved positions and are placed before movable items. Saving another item never rewrites fixed placements. Desktop scaling depends only on the viewport; when movable items cannot fit, the canvas scrolls instead of shrinking fixed objects. Its scroll viewport reserves the header area so the lamp cord can extend above the scene without being clipped. Item internals use the named desk container. Browsing and editing both choose the active layout from the current window width; no manual device-size override is available.

A 350 ms hold anywhere in an item’s hover area lifts the object; moving more than 8 px before activation cancels it. Short presses keep the original clicks. Inputs, sliders, and internal scroll areas retain their own interactions. Gesture exclusion checks stop at the item boundary, so the outer desk scroll container does not disable dragging. Touch scrolling remains native until a hold activates dragging. Existing hover frames provide feedback during browsing. Editing hides those frames and shows a single editor boundary with its title centered on the top edge.
Press feedback, the lifted frame, and a legal-position outline explain the gesture.
The floating object may cross neighbors; release chooses the nearest clear rectangle.
Escape and pointer cancellation restore its starting state. Visitors can always drag,
regardless of authentication or edit mode. Personal positions persist independently
of the saved layout and do not copy public metadata or capability settings.

The display's lower-right Settings gear offers Reset layout to every visitor and an additional
Edit desk action for administrators. Reset clears personal positions in every size class and restores the public composition. Settings actions use phosphor-colored icons with floating hover/focus labels. Editing happens in the home scene. Its icon toolbar is portaled to the document body and fixed above the bottom safe area, so it never displaces the scene. It wraps groups on narrow screens and keeps hints and notices outside normal flow. The toolbar
uses transparent magnetic buttons without a saved-status badge and provides undo/redo, business-interaction preview, and exit; saves happen at the
end of an edit or completed layout gesture. Both Settings and the toolbar offer Shuffle: only draggable items move, fixed items remain obstacles, and the collision solver places each randomized candidate within the canvas width and height. It retries bounded compositions and keeps the previous layout when no complete fit is found. Settings saves personal positions for the active breakpoint; editing saves a single undo step. The toolbar Reset restores the current breakpoint to its layout at editor entry as one saved, undoable edit. Short presses select objects; resize handles preserve aspect ratio.
Each successful drag/resize adds one history step; undo and redo also save.
The server-loaded configuration is ready before entering edit mode. Failed layout
saves return to the saved placement, while failed form saves keep their input.
See [Architecture](./ARCHITECTURE.md#configurable-desk) for persistence and permissions.

## Ring Cursor

The public shell replaces the system mouse pointer with a hollow ring, including
inputs, text, and the image viewer. Its center follows pointer coordinates without
smoothing. Hover springs into an enlarged accent ring, pressing contracts it, activated item dragging rotates a dashed ring, and release emits one fading expansion. Reduced motion keeps immediate scale feedback and disables springs, rotation, and ripples. A contrasting outline keeps
it visible over imagery. The manual popover layer is raised above native dialogs,
does not intercept events, and uses Motion values without rerendering desk items.
Touch hides the ring. Text selection, insertion carets, focus outlines, and the
administration cursor remain native. Reduced motion removes scale transitions.

## Code and Diagram Blocks

Searchable language input, syntax colors, and icon-based Copy appear inside one code-block surface. Search matches language names and aliases and supports Arrow keys, Enter, and Escape. Source/diagram buttons use matching SVG line icons. The BlockNote default background and padding are cleared to avoid nested frames. PlantUML
blocks initially display the diagram; the code icon switches in place to source,
which is editable only in the editor. Returning to the diagram requests the current
source. Errors remain within the block and never prevent source access. Empty blocks
start in source mode. Diagram clicks use the existing image viewer. Link-card edit
controls appear inside the card and temporarily replace its bottom domain line.

### Item content forms and recordings

In edit mode the title has a separate pencil action. The name remains a drag handle
for movable objects; introduction reserves space for its title and defaults to fixed. A
centered native dialog resembles a sheet of paper with generous margins, subtle
edges, and theme-aware surface and ink. Dedicated paper fields retain floating
labels over ruled inputs; multiline text follows evenly spaced lines. Long forms scroll
inside the dialog, which stays within the phone viewport. Compact form margins leave room for a live preview on the right; below the desktop breakpoint, the preview follows the fields. It reflects the unsaved content, scale, and initial/hover appearance. The preview keeps hover animation but its native inert subtree excludes clicks, focus, navigation, dragging, and playback. Escape and close confirm
before dropping changed fields; backdrop clicks do not dismiss the editor. Apply
persists the item and adds one undo step after success. There is no extra Save button.
The pencil action has the shared magnetic effect without a hover background. Close
uses the shared dashboard rotating cross and drawn ring, with magnetism and a
retracting/fading exit transition. Content
and Appearance are separate sections; names and the dragging toggle belong to Appearance; only type-specific fields
remain in Content. Tabs use magnetic icons with accessible labels and the navigation bar’s accent dot for the active section. Items without type-specific fields omit Content. Movement uses a switch with explicit Draggable and Fixed states. The visible
editor heading is omitted. Restore stays at the lower left in both tabs and resets
only the active section.
Appearance presents Initial and On hover side by side with matching rotation,
horizontal/vertical offset, and scale labels. Values describe each state directly.
Resizable items also expose minimum and maximum size. Current scale affects only
the active breakpoint; other appearance values are shared. Terminal passages use a
text directory without numeric prefixes, with drag ordering, keyboard-accessible move actions, and one
active editor. Calendar dates automatically show the visitor’s current local day.
The dialog shell opens immediately,
with form loading and audio-library refresh indicators confined to its body.

The record form uses a sortable track directory and one active editor with a compact
play/pause, seek, and duration preview. Add recordings expands upload, URL import,
and a compact persistent library. It supports uploading MP3/M4A/WAV/FLAC or importing a direct audio URL,
editing title/artist, previewing, reordering and removing recordings. Duration comes
from analysis. The library retains background jobs across dialog closures and offers
manual retries. Audio and spectrum readiness are displayed independently: missing
spectra never prevent playback. The first version limits imports to 50 MiB and
15 minutes; music-platform share pages are not audio URLs.

The login card retains its contrasting surface and border but omits the broad outer
shadow that introduced dark color bands on the surrounding canvas. Its return link
pairs the existing label with a left arrow.
