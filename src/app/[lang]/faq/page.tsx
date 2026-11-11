import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content, hasLang, langs } from "@/content";
import { LangSwitch, Phone, SiteFooter } from "../chrome";
import { Icon } from "../icons";
import { FaqSearch } from "../faq-search";
import s from "../page.module.css";

// The FAQ page: every question by category, with a search. /ar/faq/ and
// /en/faq/ are written at build time, like the landing page.
export const generateStaticParams = () => langs.map((lang) => ({ lang }));

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLang(lang)) return {};
  return {
    title: content[lang].faq.page.metaTitle,
    alternates: { languages: { ar: "/ar/faq/", en: "/en/faq/" } },
  };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const t = content[lang];
  const topics = [
    ...t.faq.topics.map((topic, i) => ({ id: (["general", "disability", "volunteers"] as const)[i], title: topic.title, groups: topic.groups })),
  ];

  return (
    <>
      <a className={s.skip} href="#main">
        {t.skip}
      </a>
      <main id="main" tabIndex={-1}>
        <div className={s.faqPage}>
          {/* No site bar here: a way back to the questions on the home page,
              and the language switch. */}
          <div className={s.faqTop}>
            <a className={s.faqBack} href={`/${lang}/#faq`}>
              <Icon name="chevron" />
              {t.faq.page.home}
            </a>
            <LangSwitch lang={lang} path="faq/" />
          </div>
          <div id="faq-intro">
            <h1>{t.faq.page.title}</h1>
            <p className={s.lead}>{t.faq.page.lead}</p>
          </div>
          <FaqSearch
            topics={topics}
            text={t.faq.page}
            help={
              <>
                {t.faq.page.none} <Phone n={t.footer.phone} />
              </>
            }
          />
        </div>
      </main>
      <SiteFooter lang={lang} base={`/${lang}/`} cta={false} />
    </>
  );
}
