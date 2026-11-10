import { ar } from "./ar";
import { en } from "./en";

export const content = { ar, en };
export type Lang = keyof typeof content;
export const langs = Object.keys(content) as Lang[];
export const hasLang = (l: string): l is Lang => l in content;

export const links = {
  appStore: "https://apps.apple.com/sa/app/id1602789379",
  googlePlay: "https://play.google.com/store/apps/details?id=org.liajlehum.rafeeq",
  privacy: "https://rafiqi-backend.azurewebsites.net/public-files/privacy-policy.html",
  association: "https://www.liajlehum.org.sa",
  associationPages: {
    about: "https://www.liajlehum.org.sa/about/",
    services: "https://www.liajlehum.org.sa/services/",
    volunteer: "https://www.liajlehum.org.sa/chances/",
    donate: "https://www.liajlehum.org.sa/projects/",
    contact: "https://www.liajlehum.org.sa/contact/",
    branches: "https://www.liajlehum.org.sa/pages/%D9%81%D8%B1%D9%88%D8%B9-%D8%A7%D9%84%D8%AC%D9%85%D8%B9%D9%8A%D8%A9/",
  },
};

export type SocialPlatform = "x" | "instagram" | "linkedin" | "youtube" | "tiktok" | "snapchat" | "facebook" | "whatsapp";

// Only the accounts the association's own site links to
export const social: { platform: SocialPlatform; href: string }[] = [
  { platform: "x", href: "https://twitter.com/Liajlehum" },
  { platform: "instagram", href: "https://www.instagram.com/liajlehum/" },
  { platform: "youtube", href: "https://www.youtube.com/channel/UCYbzyRSeP_ypOln2L_sLsLg" },
  { platform: "facebook", href: "https://m.facebook.com/liajlehum.sa" },
];
