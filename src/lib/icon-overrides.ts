/**
 * Global icon overrides.
 *
 * The icon resolver in `./icons` consults this map BEFORE simple-icons, keyed by
 * a lower-cased name/slug. Because every section (hero socials, project tech
 * badges, and the GitHub-derived pinned / languages / "most used" lists) goes
 * through that resolver, an entry here fixes an icon everywhere at once.
 *
 * Four kinds of entry:
 *   1. Alias        — `{ slug: "cplusplus" }` points a name at an existing
 *      simple-icons slug. Use this when the icon exists but under a different
 *      name than the one coming in (e.g. GitHub reports "C++", the slug is
 *      "cplusplus"). The simple-icons brand colour is used automatically.
 *   2. Alias + colour — `{ slug: "react", color: "#fff" }` reuses the
 *      simple-icons SVG path for that slug but overrides its brand colour with
 *      the given hex (used as-is). For when the glyph is right but the colour
 *      isn't (e.g. recolouring a brand icon to suit the theme).
 *   3. Custom path  — `{ path, color, viewBox? }` supplies a single SVG `d` and
 *      a hex colour for icons simple-icons doesn't ship (e.g. C#). `viewBox`
 *      defaults to "0 0 24 24"; set it if the path uses a different coordinate
 *      space.
 *   4. Arbitrary SVG — `{ svg, color?, viewBox? }` accepts a full `<svg>…</svg>`
 *      string (multiple paths, groups, its own colours). The viewBox is read
 *      from the markup (override with `viewBox` if it's wrong). Omit `color` to
 *      keep the SVG's own fills; set it to force a single fill (works for SVGs
 *      that use `currentColor`). The markup is trusted code, not user input.
 *
 * Keys are matched case-insensitively. Add as many keys per icon as you expect
 * to encounter (e.g. both "c#" and "csharp").
 */

export type IconOverride =
  | { slug: string } // alias, simple-icons brand colour
  | { slug: string; color: string } // alias, colour overridden
  | { path: string; color: string; viewBox?: string } // single custom path
  | { svg: string; color?: string; viewBox?: string }; // arbitrary inline SVG

// C# (simple-icons removed it). Single-path glyph from Material Design Icons
// (Apache-2.0), 24×24 viewBox. Colour is the C# brand purple — change to taste
// (GitHub itself uses green #178600 for the C# language label).
const CSHARP_PATH =
  "m11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96Q2 15.135 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49l-1.06-.34c-.4-.1-.86-.15-1.39-.15c-1.16-.01-2.12.36-2.87 1.1c-.76.73-1.15 1.85-1.18 3.34c0 1.36.37 2.42 1.08 3.2c.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32M13.89 19l.61-4H13l.34-2h1.5l.32-2h-1.5L14 9h1.5l.61-4h2l-.61 4h1l.61-4h2l-.61 4H22l-.34 2h-1.5l-.32 2h1.5L21 15h-1.5l-.61 4h-2l.61-4h-1l-.61 4zm2.95-6h1l.32-2h-1z";

export const iconOverrides: Record<string, IconOverride> = {
  // Custom path (no simple-icons entry):
  "c#": { path: CSHARP_PATH, color: "#9B4F96" },
  csharp: { path: CSHARP_PATH, color: "#9B4F96" },

  // Aliases — names that differ from their simple-icons slug:
  "c++": { slug: "cplusplus" },
  "f#": { slug: "fsharp" },
  ".net": { slug: "dotnet" },

  // Alias + colour override — right glyph, custom colour:
  haskell: { slug: "haskell", color: "#8F4E8B" },

  //Arbitrary inline SVG — paste a full <svg>…</svg>:
  precium: {
    svg: `<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="24" height="24">
      <style>
        .s0 { fill: #80dfd5 } 
        .s1 { fill: #75ded3 } 
        .s2 { fill: #bae3dd } 
        .s3 { fill: #c0e3dd } 
        .s4 { fill: #dfe7e1 } 
        .s5 { fill: #1e1e1e } 
        .s6 { fill: #e7e8e3 } 
      </style>
      <g id="Layer 1">
        <g id="Background">
          <path id="Path 0" fill-rule="evenodd" class="s0" d="m-0.01 21.75l-0.01 21.75c12.8-1.19 25.3-1.81 36.02-2.15 13.15-0.42 21.94-0.23 27 0.58 4.12 0.65 11.55 2.75 16.5 4.65 4.95 1.9 9.45 3.56 10 3.69 0.55 0.13 0.85-0.44 0.67-1.27-0.19-0.83-0.07-1.16 0.25-0.75 0.32 0.41 2.94-1.05 5.83-3.25 2.89-2.19 8.17-4.96 11.75-6.15 4.56-1.51 8.58-2.09 13.5-1.95 3.85 0.1 9.03 0.7 11.5 1.32 2.47 0.62 5.96 1.94 7.75 2.95 1.79 1.01 3.81 1.5 4.5 1.09q1.24-0.73 0.5 0.5c-0.41 0.68-0.3 1.47 0.25 1.74 0.55 0.27 0.91 0.16 0.81-0.25-0.11-0.41 0.61-4.13 1.59-8.25 1.46-6.15 1.67-10.06 1.19-21.75l-0.59-14.25c-31.92 0-32 0.01-32.01 2.25-0.01 1.24-0.67 4.72-1.47 7.75q-1.45 5.5-4.48 8.25c-2.19 1.98-4.09 2.75-6.79 2.73-2.06 0-8.7-0.9-14.75-1.99-6.05-1.09-16.63-3.09-23.5-4.46-6.88-1.37-16.1-3.18-20.5-4.02-4.4-0.84-9.8-2.39-12-3.44-2.2-1.06-5.13-3.07-6.5-4.48-2.41-2.46-2.94-2.56-14.75-2.57l-12.25-0.02z"/>
          <path id="Path 1" fill-rule="evenodd" class="s1" d="m25.56 1.25c0.25 0.69 2.37 2.45 4.7 3.91 2.33 1.47 6.72 3.36 9.74 4.2 3.02 0.85 7.75 1.83 10.5 2.19 2.75 0.36 8.83 1.48 13.5 2.49 4.67 1.02 14.91 2.99 22.75 4.4 7.84 1.41 15.83 2.56 17.75 2.56 2.42 0 4.44-0.85 6.54-2.75q3.03-2.75 4.48-8.25c0.8-3.03 1.46-6.51 1.47-7.75l0.01-2.25c-82.3 0-91.81 0.26-91.44 1.25z"/>
          <path id="Path 2" fill-rule="evenodd" class="s2" d="m149.48 14.25c0.55 11.32 0.37 15.74-0.89 21.5-1.14 5.17-1.95 7.06-2.84 6.58-0.69-0.37 1.03 1.76 3.83 4.75 2.79 2.98 6.21 7.22 7.59 9.42 1.39 2.2 3.16 5.65 3.93 7.68l1.4 3.67c4.1-5.7 6.07-9.83 7.03-12.85 1.3-4.1 1.87-10.2 2.21-24 0.26-10.18 0.19-21.31-0.14-24.75l-0.6-6.25h-22.22z"/>
          <path id="Path 3" fill-rule="evenodd" class="s3" d="m171.5 24.21c0 20.8-0.27 25.15-1.85 30.29-1.02 3.3-3.13 7.8-4.7 10-2.11 2.97-2.63 4.51-2.01 6 0.46 1.1 0.72 5.38 0.58 9.5-0.2 5.65-1.03 9.41-3.39 15.25-2.94 7.28-3.12 8.49-3.04 20 0.08 11-0.28 13.65-3.5 26-1.98 7.56-4.26 19.71-5.08 27-0.82 7.29-1.5 17.41-1.5 22.5l-0.01 9.25 23.5 0.01c1.13-18.22 2.36-32.29 3.46-43.01 1.1-10.72 2.26-22.43 2.59-26 0.33-3.57 1.21-10.78 1.97-16 0.75-5.22 2.3-18.05 3.43-28.5 1.14-10.45 3.02-27.33 4.18-37.5 1.81-15.73 1.99-20.74 1.25-33.5l-0.88-15-15-0.58z"/>
          <path id="Path 4" fill-rule="evenodd" class="s4" d="m187.38 15.25c0.76 13.04 0.58 17.93-1.24 33.75-1.17 10.17-3.05 27.05-4.19 37.5-1.13 10.45-2.68 23.28-3.43 28.5-0.76 5.22-1.64 12.43-1.97 16-0.33 3.57-1.49 15.28-2.59 26-1.1 10.72-2.33 24.79-2.73 31.26l-0.73 11.75 29.5-0.01v-200h-13.5z"/>
          <path id="Path 5" fill-rule="evenodd" class="s5" d="m107 39.13c-3.03 1.1-6.85 2.93-8.5 4.09-1.65 1.15-4.96 3.93-7.37 6.19-2.56 2.4-5.74 6.97-7.71 11.09-2.08 4.34-3.56 9.18-3.89 12.75l-0.53 5.75-41.5-0.02c-0.86 12.8-1.09 31.82-1.06 50.52l0.06 34 84.5 0.5-0.5-42.47c-8.53-1.19-14.15-3.07-18-4.94-4.47-2.18-8.72-5.25-11.75-8.5-2.61-2.8-6.09-7.9-7.72-11.34-1.63-3.44-3.32-8.84-3.75-12.01l-0.78-5.77 42.5 0.03-0.02 42.5c8.93-0.94 14.45-2.58 18.02-4.25 3.57-1.66 8.78-5.22 11.56-7.89 2.94-2.82 6.41-7.59 8.26-11.36 1.76-3.58 3.69-9.2 4.29-12.5 0.82-4.45 0.79-7.81-0.08-13-0.65-3.85-2.31-9.25-3.69-12-1.38-2.75-4.16-6.98-6.17-9.41-2.02-2.43-5.47-5.64-7.67-7.14-2.2-1.51-6.81-3.68-10.25-4.84-4.47-1.51-8.6-2.09-14.5-2.04-5.56 0.05-10.04 0.72-13.75 2.06z"/>
          <path id="Path 6" fill-rule="evenodd" class="s2" d="m26 41.6c-1.38 0.17-7.88 0.6-14.46 0.95l-11.96 0.65 0.42 26.8c9.69-0.59 19.02-1.34 27-2.04l14.5-1.28c16.75 4.53 24.44 5.83 29.5 6.06 8.31 0.38 8.5 0.34 8.59-1.93 0.04-1.27 1.54-5.46 3.31-9.31 1.78-3.85 3.99-7.82 4.92-8.81 1.47-1.59 1.5-1.93 0.18-2.73-0.83-0.51-5.21-2.28-9.75-3.94-4.54-1.66-11.06-3.47-14.5-4.01-3.44-0.55-12.77-0.93-20.75-0.85-7.97 0.08-15.62 0.28-17 0.44z"/>
          <path id="Path 7" fill-rule="evenodd" class="s3" d="m23.5 68.01c-3.85 0.47-10.72 1.22-15.26 1.67l-8.26 0.82c0.02 19.55 0.18 20.45 1.77 19.95 0.96-0.31 9.18-0.77 18.25-1.04l16.5-0.49 0.5-9.92 41.5-0.03c1.25 8.94 2.87 14.23 4.41 17.53 1.55 3.3 4.78 8.19 7.2 10.87 2.41 2.68 6.19 5.92 8.39 7.2 2.2 1.29 6.03 3.06 8.5 3.95 2.47 0.88 6.53 1.88 9 2.2 4.39 0.58 4.48 0.54 3.76-1.81-0.4-1.33-0.74-4.32-0.75-6.66-0.01-3.24-0.69-5.02-2.87-7.5-1.57-1.79-4.9-4.38-7.41-5.75-4.11-2.26-4.71-3.08-6.28-8.5-0.96-3.3-2.35-7.24-3.1-8.75-1.33-2.71-1.48-2.75-10.85-2.75h-9.5v-6c-11.62 0-16.98-0.88-22.75-2.59-5.53-1.64-11.88-2.71-17.25-2.92-4.67-0.18-11.65 0.05-15.5 0.52z"/>
          <path id="Path 8" fill-rule="evenodd" class="s2" d="m99.31 81.75c0.77 1.51 2.18 5.45 3.14 8.75 1.54 5.32 2.21 6.25 5.89 8.23 2.29 1.22 5.51 3.62 7.16 5.32 2.37 2.44 3.17 4.39 3.8 9.27 0.45 3.4 1.05 12.93 1.35 21.18 0.41 11.46 0.87 15.18 1.94 15.75 0.78 0.41 1.41 2.1 1.41 3.75 0 1.65 0.3 3.79 0.68 4.75 0.61 1.6 0.74 1.58 1.44-0.25 0.63-1.62 0.76-1.42 0.68 1-0.05 1.65 0.69 5.93 1.64 9.5 1.35 5.07 1.59 8.59 1.08 16-0.35 5.22-0.84 10.74-1.08 12.25l-0.44 2.75h19c0.01-14.34 0.69-24.46 1.51-31.75 0.82-7.29 3.06-19.21 4.99-26.5 3.07-11.62 3.53-14.95 3.75-27.08 0.17-9.65-0.05-13.28-0.75-12-0.55 1.01-3.25 4.01-6 6.67-2.75 2.66-7.93 6.24-11.5 7.94-4.37 2.08-8.39 3.2-12.25 3.41l-5.75 0.31v-42h-23.08z"/>
          <path id="Path 9" fill-rule="evenodd" class="s4" d="m10 89.69c-3.03 0.18-6.51 0.55-7.75 0.82-2.23 0.49-2.25 0.64-2.24 18.24v17.75c15.1-2.03 23.31-2.93 27.99-3.31l8.5-0.69c-0.38-24.03-0.72-31.56-0.99-32.25-0.37-0.9-3.25-1.2-10.26-1.07-5.36 0.11-12.22 0.34-15.25 0.51z"/>
          <path id="Path 10" fill-rule="evenodd" class="s6" d="m20.5 123.72c-1.1 0.3-6.05 1.04-11 1.66l-9 1.12-0.5 73.5h68c0.72-8.14 1.17-16.24 1.47-23.25l0.53-12.75-33.5-0.5v-40c-10.85-0.24-14.9-0.07-16 0.22z"/>
          <path id="Path 11" fill-rule="evenodd" class="s3" d="m121.28 156.64l0.22 6.86-18.5 0.5c0 6.2-0.43 11.04-0.95 14.75-0.53 3.71-1.09 10.01-1.25 14l-0.3 7.25h27.5c0.68-4.26 1.17-9.77 1.52-15 0.51-7.41 0.27-10.93-1.08-16-0.95-3.57-1.69-7.85-1.64-9.5 0.08-2.5-0.04-2.66-0.74-1-0.78 1.88-0.87 1.85-1.42-0.5-0.32-1.37-0.71-3.59-0.86-4.92-0.15-1.33-0.83-2.62-1.5-2.86-0.89-0.33-1.16 1.38-1 6.42z"/>
          <path id="Path 12" fill-rule="evenodd" class="s4" d="m69.58 175.75c-0.33 6.46-0.82 14.56-1.09 18l-0.49 6.25c31.8 0 32.01-0.03 32.44-2.25 0.24-1.24 0.69-6.07 1-10.75 0.3-4.68 0.89-11.77 1.3-15.76l0.76-7.26-33.31 0.02z"/>
        </g>
      </g>
    </svg>`,
  },
};
