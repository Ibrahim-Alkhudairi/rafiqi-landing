import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import s from "./global-not-found.module.css";

// Any URL no route matches. It skips app/[lang]/layout.tsx, so it brings its
// own font and theme; Arabic first, like the site, with English beside it.
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: "الصفحة غير موجودة | Page not found",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0E1A3B",
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={plex.variable}>
      <body className={s.page}>
        <main className={s.main}>
          <section className={s.part}>
            <h1>الصفحة غير موجودة</h1>
            <p>ربما تغيّر الرابط أو كُتب خطأً.</p>
            <a className={s.button} href="/ar/">
              الذهاب إلى رفيقي
            </a>
          </section>
          <section className={s.part} lang="en" dir="ltr">
            <h2>Page not found</h2>
            <p>The link may have changed or been mistyped.</p>
            <a className={s.button} href="/en/">
              Go to Rafiqi
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}
