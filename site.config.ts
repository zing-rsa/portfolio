/**
 * Non-secret, editable site configuration.
 *
 * Everything here is safe to commit. Secrets (DB URL, GitHub token, session
 * secret, admin credentials) live in environment variables — see `.env.example`.
 *
 * Fill the placeholders below with real values. The GitHub username here drives
 * the stats section; the token that authorises those requests is the
 * `GITHUB_TOKEN` env var.
 */

export type SocialKey = "github" | "x" | "discord" | "email";

export interface SocialLink {
  key: SocialKey;
  label: string;
  /** Link socials (e.g. GitHub, X) open this URL. */
  href?: string;
  /**
   * Copy socials (e.g. email, Discord) copy this value to the clipboard on
   * click instead of navigating. It is kept out of the rendered HTML: server
   * components base64-encode it before passing it to the client, so the raw
   * value never appears in the DOM or JS bundle (a basic anti-scraping guard).
   */
  copyValue?: string;
}

export interface SiteConfig {
  name: string;
  /** Heading typed out in the hero. */
  heading: string;
  /** Two-sentence introduction. */
  intro: string;
  location: string;
  /** IANA timezone, e.g. "Europe/London" — used to show a live local time. */
  timezone: string;
  github: {
    /** GitHub login used for the stats section. */
    username: string;
  };
  socials: SocialLink[];
  footer: string;
  /** Path to the backoffice CMS. */
  adminPath: string;
}

export const siteConfig: SiteConfig = {
  name: "zing",
  heading: "hello, i'm zing",
  intro:
    "I'm a passionate developer and outdoor activity enjoyer. I develop software in payments and corporate finance and have keen interests in web development and blockchain.",
  location: "Cape Town, South Africa",
  timezone: "SAST",
  github: {
    username: "zing-rsa",
  },
  socials: [
    { key: "github", label: "GitHub", href: "https://github.com/zing-rsa" },
    { key: "x", label: "X", href: "https://x.com/zing_rsa" },
    // Copy-to-clipboard socials — value stays server-side, never in the DOM.
    { key: "discord", label: "Discord", copyValue: "zing" }, // your Discord username
    { key: "email", label: "Email", copyValue: "kritz.rob@gmail.com" },
  ],
  footer: "Please get in touch if you'd like to chat about software.",
  adminPath: "/admin",
};

export default siteConfig;
