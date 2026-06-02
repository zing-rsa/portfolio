// Non-secret, editable site configuration.

export const siteConfig: SiteConfig = {
  name: "zing",
  heading: "hello, i'm zing",
  intro: "I'm a passionate developer and outdoor activity enjoyer. I develop software in payments and corporate finance and have keen interests in web development and blockchain.",
  location: "Cape Town, South Africa",
  timezone: "SAST",
  github: {
    username: "zing-rsa",
  },
  socials: [
    { key: "github", label: "GitHub", href: "https://github.com/zing-rsa" },
    { key: "x", label: "X", href: "https://x.com/zing_rsa" },
    { key: "discord", label: "Discord", copyValue: "zing_rsa" },
    { key: "email", label: "Email", copyValue: "kritz.rob@gmail.com" },
  ],
  footer: "Please get in touch if you'd like to chat about software.",
  adminPath: "/admin",
};

export interface Social {
  key: "github" | "x" | "discord" | "email";
  label: string;
  href?: string;
  copyValue?: string;
}

export interface SiteConfig {
  name: string;
  heading: string;
  intro: string;
  location: string;
  timezone: string;
  github: {
    username: string;
  };
  socials: Social[];
  footer: string;
  adminPath: string;
}

export default siteConfig;
