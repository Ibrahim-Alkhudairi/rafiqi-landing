import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { content, hasLang, langs } from "@/content";
import { MotionProvider } from "./motion";
import "../globals.css";

// IBM Plex Sans Arabic (user decision, 2026-11-09): one family for both
// scripts, so the Arabic and English pages share a voice. Static weights only,
// so anything else snaps to the nearest of these.
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

export const dynamicParams = false;
export const generateStaticParams = () => langs.map((lang) => ({ lang }));

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0E1A3B", // --hero: the browser's toolbar runs into the top bar
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLang(lang)) return {};
  const { title, description } = content[lang].meta;
  return {
    // Absolute hreflang URLs need a base; SITE_URL once deployed, local otherwise.
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3100"),
    title,
    description,
    icons: { icon: "/icon.png", apple: "/icon.png" },
    alternates: { languages: { ar: "/ar/", en: "/en/" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={plex.variable}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
