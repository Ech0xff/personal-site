# Reading Desk Redesign

The independent prototype starts at `/redesign`. Its Posts, Thoughts, Events,
and System pages live below that prefix. Posts, Thoughts, and Events currently
show only their heading and `Not implemented yet.`; their sample articles have
been removed. The homepage has no footer. All copy and audio settings are local
fixtures in `src/app/redesign/_components/desk-content.const.ts`; no Supabase
configuration, CMS content, legacy components, or legacy theme resources are
loaded by these pages. UI copy is English; the greeting sequence is decorative.

## Development and Preview

Use the [standard development commands](../README.md#development), then visit
`/redesign`. The prototype does not require database credentials. The existing
site still does.

To build just the prototype when Supabase is unavailable:

```sh
NODE_ENV=production bun run build --debug-build-paths 'src/app/redesign/**/page.tsx'
NODE_ENV=production bun run start --port 3001
```

This is a partial verification build, not a deployable replacement for the whole
site. It replaces the local production build artifacts and includes only the
selected routes. Run the normal full build with configured Supabase before any
whole-site deployment. See the [verification workflow](../README.md#verification).

## Runtime and Build Boundaries

The existing UI lives under the `(legacy)` route group, with the same public
URLs and the original root providers. Redesign has a separate root layout. There
is no shared `app/layout.tsx`. Navigating between roots loads a new document;
navigation inside the prototype keeps its curtain controller mounted. API
handlers remain at their original locations. The old favicon is served from
`public/favicon.ico` at its existing URL; redesign uses a blank favicon until a new identity is chosen.

StyleX 0.19 uses the official Babel and PostCSS pipeline. `babel.config.js` must
use the `.js` extension: this Next.js Babel loader rejects `.cjs` and `.mjs`
configuration files. PostCSS reuses the Babel plugin options, scans only redesign
sources, and replaces the single `@stylex` directive in its reset stylesheet.
Runtime style injection is disabled. Next.js retains Turbopack and React Compiler.

The Babel configuration applies to the project build, while the generated
StyleX stylesheet is imported only by the redesign root. Legacy Tailwind and
SCSS continue through their existing pipeline. The extra Babel compilation is a
build-time tradeoff; it does not introduce a runtime style engine.

StyleX's `valid-styles`, `valid-shorthands`, and `no-unused` rules run through the
existing Oxlint JavaScript-plugin support. Use explicit border components,
corner radii, and grid start/end properties. Unsupported multi-value shorthands
can otherwise compile without the intended styling.

## Design System

The live guide at `/redesign/system` consumes the same tokens and interaction
styles as the homepage. Sources are in `src/app/redesign/_design`:

- **Foundations:** raw palette, system font stacks (including separate artistic and signature roles), typography scale, spacing,
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
the record uses a circular frame. Deep-terracotta pill labels overlap the top border and
rise seven pixels into place as the frame fades in. Dedicated `objectLabelBackground`
and cream `objectLabel` tokens keep the label surface distinct from the desk and lamp glow.
The full border runs beneath the opaque label, meeting its actual edges without
a fixed-width cutout. Mouse clicks do not retain object feedback after pointer
exit; keyboard `:focus-visible` on an object or an inner control retains its
focus feedback. On phones (≤600 px), interactive object names remain visible and their
frames are suppressed, including during hover. Decorative items stay unlabelled.

All rendered colors, including selection, gradients, material highlights, and
shadows, are declared in the token module. The neutral light-stone curtain uses `color.curtain` (`palette.softStone`, #e4e2de)
and `color.curtainText` (`palette.neutralInk`, #333330). The overlay, curved edges,
greetings, and greeting dot consume these same semantics on both initial loads
and page transitions. These colors are also displayed in the system guide. A future dark theme must override semantic,
material, lighting, and shadow variables together; no theme switch is shipped.

GitHub, Email, X, and Bilibili icons follow the introduction. Their local URLs
intentionally remain `null`. Unconfigured entries use `aria-disabled` buttons
with no navigation action, retaining hover previews and keyboard focus.

Only the small reset, CSS entrypoint, Lenis structural stylesheet, and no-script curtain fallback use raw CSS.
All component styling uses StyleX. Motion owns animated transform/opacity values
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

- The curtain contains only the greeting or destination name, with no footer
  caption. Each greeting appears once, including Hello, Hallo, and Ciallo~. A fresh
  randomized permutation is chosen only when an intro actually runs. The initial
  curtain has no fixed greeting, preventing a pre-hydration Hello flash.
- Greetings play on fresh homepage loads and reloads only. The persistent root
  prevents replay on internal returns; browser history restoration and reduced
  motion bypass them. No session or daily storage is involved.
- Ordinary prototype links cover the old page, navigate, then reveal the new
  page. Modified clicks retain Next Link behavior. Inert content and a temporary
  scroll lock protect the transition; a six-second watchdog releases it if a
  navigation stalls. History changes cancel pending animations. The page heading
  receives focus after a completed animated transition.
- The tilted display has three icon buttons for CLI, Stats, and Guestbook at
  the bottom right. The `>_` prompt appears only in CLI; the clock stays at the
  bottom left. Each icon has an accessible name and pressed state. The casing height stays fixed across programs. Switching uses
  a 140ms fade out/in and a 320ms scanline; a newer selection cancels any pending
  content swap, and reduced motion removes the transition.
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
theme surface and background blur once scrolled. On phone menu expansion, this
surface extends down with a fading edge to keep links readable over content,
without a bordered panel. The progress line remains above the header, and the
curtain covers both. The shared header-height token keeps the lamp cord connected to the top edge
on every breakpoint. The light field starts lower on the desk and remains
bounded by the scene. At widths up to 600 px, the right navigation becomes a
`• Menu` disclosure. Its links appear below the trigger without a panel or
border. Mouse hover, touch clicks, Enter/Space, and Arrow Down open it; Escape,
leaving the group without keyboard focus, moving focus away, selecting a link,
or clicking outside close it. The backing surface animates its bottom edge over
280ms; links enter after 70ms, and closing delays the backdrop by 80ms. Hidden
phone navigation is inert immediately while its visual fade completes.
Arrow Down focuses the first link and Escape
returns focus to the trigger. Desktop and tablet retain the inline navigation.

The redesign root owns one Lenis 1.3.26 instance with `autoRaf`, wheel smoothing,
and a token-controlled lerp of 0.12. Touch retains native inertia (`syncTouch:
false`). Reduced motion destroys the instance and restores native scrolling;
changing the preference back recreates it. Curtain activity stops Lenis and
releases it when navigation completes or the watchdog clears the overlay.
Browser history retains Next.js scroll restoration. The instance is destroyed
when its root unmounts. No legacy route loads this scrolling integration.

The reset hides native scrollbars while preserving scrolling input. A fixed
three-pixel top progress line reflects the native scroll position through a
Motion value; it is hidden during curtains or when the page fits in the viewport.
ResizeObserver and scroll/resize events keep the progress synchronized across
route changes and responsive layouts. The indicator is decorative, not a drag
control. The CSS from Lenis supplies structural scroll-lock rules only; visual
styles remain in StyleX.

## Built-in Music and Audio Analysis

The prototype ships two audio files in `public/redesign`: the original 16-second
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

The redesign shell has its own Jotai Provider. `desk-preferences.atom.ts` uses
native `atomWithStorage` and `createJSONStorage` for the selected track, per-track
positions, control pinning, playback mode, lamp on/off, 12/24-hour clock format,
the selected display program, local like state, guestbook sub-tab, draft, and
locally submitted messages. The removed manual typing-pause preference is ignored.
There is no custom storage implementation. A JSON reviver validates persisted
values and cross-tab events; a storage getter migrates the legacy plain-string
clock entry to JSON and supplies a no-op fallback when storage is unavailable.
Existing record and pin keys stay compatible.

The server and initial client render use deterministic defaults; stored preferences
load on mount. Native storage events synchronize preferences across tabs. Remote
track/progress updates reconcile the active audio element in the paused state;
they never autoplay. Local progress is saved at most once every five seconds and flushed
on seeking, switching, pausing, hiding the page, and unmounting. Saving local
progress, changing playback mode, and pinning controls do not reload the audio.
Playback intent, hover visibility, spectrum frames, and the current clock tick
are transient and are not persisted.

Future upload/URL ingestion, metadata prefill, and durable audio/analysis storage
belong to the CMS integration phase. Reuse the analysis format above, analyze once
per imported file, and keep decoding work outside ordinary playback requests.
See [TODO](./TODO.md#redesign-follow-up) for the remaining integration work.

## Display Content

Stats shows fixture counts for posts and thoughts. Total visits use an eye icon
beside the toggleable, locally persisted like; there is no daily visitor or
bookmark action. The total remains a fixture until the analytics service is wired.

Guestbook provides Read and Write tabs with keyboard arrow navigation. Seven fixture
notes demonstrate names, optional email addresses, anonymous authors, and multiline
comments. Read scrolls independently below its fixed tabs with its scrollbar hidden.
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
`anonymous@xxxx`. Message headers place a circular avatar at the left and the date
at the far right. Message text is trimmed and validated. Name, email, optional GitHub username,
and message drafts persist as they are edited. Submitting retains up to 50 local
notes, clears the message, returns to Read, and focuses its tab. All submitted text
is rendered as React text, never HTML. No storage-status copy is shown in the form.

Avatars use only the optional GitHub username supplied in Write, via the account's
`https://github.com/<username>.png?size=64` image URL. Email is display metadata and
is never searched or sent to an avatar service. Usernames are validated before
submission; old drafts and messages without this field remain compatible. The
Muyu fixture uses the supplied `ech0xff` username. Missing usernames and failed
images use the same person icon as the Write form. Loaded avatars retain their
original colors and opacity inside the circular crop. There is no email lookup,
Gravatar fallback, or GitHub API request.

Public guestbook storage, moderation, and real statistics remain future work in
[TODO](./TODO.md). This prototype does not submit messages to Supabase.
