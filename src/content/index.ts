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
};
