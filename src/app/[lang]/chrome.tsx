import Image from "next/image";
import { links, social, content, type Lang } from "@/content";
import type { Content } from "@/content/ar";
import { Icon, type IconName } from "./icons";
import { Header, MobileCta, MobileMenu, PhaseNav } from "./motion";
import s from "./page.module.css";

// The page's chrome, shared by the landing page and the FAQ page: the skip
// link and top bar, and the footer with the pinned Download button. On the
// landing page `base` is "" (its sections are on the page); elsewhere it is
// "/<lang>/", so the section and Download links lead back to the landing
// page. `path` is where the other language's link goes ("" or "faq/"), and
// `after` the id of the element the bar's pill waits for.
// Language: EN | AR (عربي on the Arabic page); the current one is filled. An
// abbreviated one is also named in full, in its own language, for screen
// readers. `path` is where each link goes inside its language ("" or "faq/").
export function LangSwitch({ lang, path = "" }: { lang: Lang; path?: string }) {
  const t = content[lang];
  return (
    <nav className={s.langSwitch} aria-label={t.language}>
      {t.languages.map((l) => (
        <a key={l.lang} href={`/${l.lang}/${path}`} hrefLang={l.lang} aria-current={l.lang === lang ? "page" : undefined}>
          {l.label}
          {l.name && (
            <span className={s.srOnly} lang={l.lang}>
              {" "}
              {l.name}
            </span>
          )}
        </a>
      ))}
    </nav>
  );
}

export function SiteHeader({ lang, base = "", path = "", after }: { lang: Lang; base?: string; path?: string; after: string }) {
  const t = content[lang];
  return (
    <>
      <a className={s.skip} href="#main">
        {t.skip}
      </a>

      <Header className={s.header} after={after}>
        <div className={s.bar}>
          <a className={s.brand} href={`/${lang}/`}>
            <Image src="/icon.png" alt="" width={40} height={40} loading="eager" />
            <span className={s.brandText}>
              <span lang="ar">رفيقي</span> <span lang="en">Rafiqi</span>
            </span>
          </a>
          <PhaseNav t={t.phases} base={base} />
          <nav className={s.nav} aria-label={t.navLabel}>
            <a className={s.button} href={`${base}#download`}>
              <Icon name="download" />
              {t.download}
            </a>
          </nav>
          <MobileMenu t={t.phases} label={t.menu} download={t.download} base={base} />
          <LangSwitch lang={lang} path={path} />
        </div>
      </Header>
    </>
  );
}

export function SiteFooter({ lang, base = "", cta = true }: { lang: Lang; base?: string; cta?: boolean }) {
  const t = content[lang];
  return (
    <>
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.footerGrid}>
            {/* The download block: where the header's Download button, the menu's and
                the pinned one on phones all land. */}
            <div id="download" className={s.footerBrand} aria-label={t.footer.groups.app} role="group">
              <a className={s.footerLogo} href={`/${lang}/`}>
                <Image src="/icon.png" alt="" width={48} height={48} />
                <span>
                  <span lang="ar">رفيقي</span> <span lang="en">Rafiqi</span>
                </span>
              </a>
              <p>{t.footer.by}</p>
              <nav aria-label={t.footer.label}>
                <StoreBadges t={t} />
              </nav>
            </div>

            <nav className={s.footerGroup} aria-labelledby="footer-sections">
              <h2 id="footer-sections">{t.footer.groups.sections}</h2>
              <ul>
                {t.phases.items.map((item) => (
                  <li key={item.id}>
                    <a href={`${base}#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className={s.footerGroup} aria-labelledby="footer-association">
              <h2 id="footer-association">{t.footer.groups.association}</h2>
              <ul>
                <li>
                  <a href={links.association}>{t.footer.association}</a>
                </li>
                {((["about", "services", "volunteer", "donate", "contact"]) as (keyof typeof links.associationPages)[]).map((key) => (
                  <li key={key}>
                    <a href={links.associationPages[key]}>{t.footer.pages[key]}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={s.footerGroup}>
              <h2>{t.footer.groups.contact}</h2>
              <ul>
                <li>
                  <Phone n={t.footer.phone} />
                </li>
                <li>
                  <a href={`mailto:${t.footer.email}`} dir="ltr">
                    {t.footer.email}
                  </a>
                </li>
              </ul>
              <p className={s.footerPlace}>
                <strong>{t.footer.locations[0].name}</strong>
                <span>{t.footer.locations[0].address}</span>
              </p>
              <p className={s.footerPlace}>
                <a href={links.associationPages.branches}>
                  {t.footer.pages.branches}: {t.footer.locations.slice(1).map((place) => place.address.split(/[,،]/)[0]).join(" · ")}
                </a>
              </p>
              <nav aria-labelledby="footer-follow">
                <h2 id="footer-follow" className={s.footerFollowTitle}>
                  {t.footer.groups.follow}
                </h2>
                <ul className={s.footerSocial}>
                  {social.map(({ platform, href }) => (
                    <li key={platform}>
                      <a href={href} aria-label={t.footer.social[platform as keyof typeof t.footer.social]}>
                        <Icon name={platform as IconName} />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className={s.footerBar}>
            <span>© {t.footer.groups.association}</span>
          </div>
        </div>
      </footer>

      {cta && <MobileCta label={t.download} base={base} />}
    </>
  );
}

// Digits run left to right even inside Arabic text.
export function Phone({ n }: { n: string }) {
  return (
    <a href={`tel:${n}`} dir="ltr">
      {n}
    </a>
  );
}

export function StoreBadges({ t }: { t: Content }) {
  return (
    <div className={s.stores}>
      <a href={links.appStore} lang={t.stores.appStore.lang}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/badges/app-store.svg" alt={t.stores.appStore.alt} width={175} height={52} />
      </a>
      <a href={links.googlePlay} lang={t.stores.googlePlay.lang}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.stores.googlePlay.src} alt={t.stores.googlePlay.alt} width={175} height={52} />
      </a>
    </div>
  );
}
