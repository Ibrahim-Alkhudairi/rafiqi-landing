import type { Metadata, Viewport } from "next";
import { Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { content, hasLang, langs } from "@/content";
import { MotionProvider } from "./motion";
import "../globals.css";

// Readex Pro: the Arabic extension of Lexend, a face built on reading-ease
// research. One variable family; HEXP widens the display headline.
const readex = Readex_Pro({ subsets: ["arabic", "latin"], axes: ["HEXP"], variable: "--font-readex" });

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
    alternates: { languages: { ar: "/ar", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={readex.variable}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
