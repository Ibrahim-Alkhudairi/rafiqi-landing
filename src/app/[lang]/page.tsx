import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { content, hasLang, links } from "@/content";
import { requestFills, type Content } from "@/content/ar";
import { Icon, type IconName } from "./icons";
import { Header, HeroPhone, MobileCta, MobileMenu, PhaseNav, TiltCard } from "./motion";
import s from "./page.module.css";

const notePlaces = [s.note0, s.note1, s.note2, s.note3];

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const t = content[lang];

  return (
    <>
      <a className={s.skip} href="#main">
        {t.skip}
      </a>

      <Header className={s.header} after="hero">
        <div className={s.bar}>
          <a className={s.brand} href={`/${lang}`}>
            <Image src="/icon.png" alt="" width={40} height={40} loading="eager" />
            <span className={s.brandText}>
              <span lang="ar">رفيقي</span> <span lang="en">Rafiqi</span>
            </span>
          </a>
          <PhaseNav t={t.phases} />
          <nav className={s.nav} aria-label={t.navLabel}>
            <a className={s.button} href="#download">
              <Icon name="download" />
              {t.download}
            </a>
          </nav>
          <MobileMenu t={t.phases} label={t.menu} download={t.download} />
        </div>
        {/* Language: EN | AR (عربي on the Arabic page) in the corner,
            outside the bar; the current one is filled. An abbreviated one is
            also named in full, in its own language, for screen readers. */}
        <nav className={s.langSwitch} aria-label={t.language}>
          {t.languages.map((l) => (
            <a key={l.lang} href={`/${l.lang}`} hrefLang={l.lang} aria-current={l.lang === lang ? "page" : undefined}>
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
      </Header>

      <main id="main" tabIndex={-1}>
        <section id="hero" className={s.hero} aria-labelledby="hero-title">
          {/* Where the story plays, this runs tall: the stage pins inside it,
              the text scrolls away over it (page.module.css, "The hero story"). */}
          <div className={s.story}>
            <div className={s.heroText}>
              <h1 id="hero-title">{t.hero.title}</h1>
              <p className={s.lead}>{t.hero.lead}</p>
              <StoreBadges t={t} />
              <ul className={s.proof}>
                {t.hero.proof.map((item) => (
                  <li key={item.text}>
                    <Icon name={item.icon as IconName} />
                    {item.text}
                  </li>
                ))}
              </ul>
              <a className={s.volunteerLink} href="#volunteers">
                {t.hero.volunteer}
              </a>
            </div>

            <div className={s.stage}>
              <HeroPhone className={s.phone}>
                <Image src="/screens/list.png" alt={t.hero.phoneAlt} width={804} height={1702} sizes="19rem" preload />
              </HeroPhone>
              {/* Illustrative notifications built from the app's real statuses. */}
              {t.hero.notes.map((note, i) => (
                <div key={note.title} className={`${s.note} ${notePlaces[i]}`}>
                  <TiltCard className={s.noteInner}>
                    {note.icon === "arrived" ? (
                      <span className={s.arrivedDot} />
                    ) : (
                      <span className={s.noteIcon}>
                        <Icon name={note.icon as IconName} />
                      </span>
                    )}
                    <span className={s.noteText}>
                      <strong>{note.title}</strong>
                      {note.text}
                    </span>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The promise in one sentence; its words light up in reading order as
            the page scrolls ("Manifesto" in the CSS). */}
        <div className={s.manifesto}>
          <p>
            {t.manifesto.split(" ").map((word, i) => (
              <span key={i} style={{ "--i": i } as CSSProperties}>
                {word}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* The journey, one chapter per step, each shaped by what it shows. */}
        <section id="before" className={`${s.chapter} ${s.ask}`} aria-labelledby="before-title">
          <div className={s.chapterCopy}>
            <h2 id="before-title">{t.before.title}</h2>
            <p className={s.lead}>{t.before.lead}</p>
            <h3 id="help-title">{t.before.panelTitle}</h3>
            {/* Native radios, so hover, tap, click and the arrow keys all
                work, with or without JavaScript ("Help picker" in the CSS). */}
            <div className={s.chips} role="radiogroup" aria-labelledby="help-title">
              {t.help.items.map((item) => (
                <label key={item.icon} data-tone={item.icon}>
                  <input type="radio" name="help" value={item.icon} defaultChecked={item.icon === "shopping"} />
                  <Icon name={item.icon as IconName} />
                  {item.title}
                </label>
              ))}
            </div>
          </div>
          <div className={s.chapterMedia}>
            <Shot {...t.before.screen}>
              {/* The form, filled in for the picked kind of help, in Arabic
                  like the app itself: its title, the request's name and
                  description, and the place, drawn over the screenshot's own
                  fields. */}
              <span className={s.formFill} aria-hidden="true" lang="ar" dir="rtl">
                {content.ar.help.items.map(({ icon, title, place }) => (
                  <span key={icon} data-tone={icon}>
                    <span className={s.fillTitle}>رفيقي في {title}</span>
                    <span className={s.fillName}>{requestFills[icon].name}</span>
                    <span className={s.fillText}>{requestFills[icon].text}</span>
                    <span className={s.fillPlace}>{place}</span>
                  </span>
                ))}
              </span>
            </Shot>
          </div>
        </section>

        <section id="way" className={`${s.chapter} ${s.way}`} aria-labelledby="way-title">
          <div className={s.chapterCopy}>
            <h2 id="way-title">{t.way.title}</h2>
            <p className={s.lead}>{t.way.lead}</p>
          </div>
          <div className={s.chapterMedia}>
            <Shot {...t.way.screen} />
          </div>
          {/* On a loop, the two of you set off from your points and meet at
              the pin; a checkbox pauses it, without JavaScript. */}
          <div className={s.mapStage}>
            <div className={s.mapCaption}>
              <h3>{t.way.panelTitle}</h3>
              <p>{t.way.panelText}</p>
            </div>
            <div className={s.mapFrame}>
              <RouteMap />
              <label className={s.pause}>
                <input type="checkbox" aria-label={t.way.pause} />
                <Icon name="pause" className={s.pauseIcon} />
                <Icon name="play" className={s.playIcon} />
              </label>
              {/* The place, popping up over the pin when the two of you
                  arrive; the meeting card below says it for screen readers. */}
              {t.help.items.map(({ icon, place }) => {
                const [x, y] = meetAt[icon];
                return (
                  <span
                    key={icon}
                    data-tone={icon}
                    className={s.meetPop}
                    aria-hidden="true"
                    style={{ left: `${x / 12}%`, top: `${(y - 90) / 4.2}%`, "--a": popAnchor(x) } as CSSProperties}
                  >
                    {place}
                  </span>
                );
              })}
            </div>
            <p className={s.meetCard}>
              <span>{t.way.meeting}</span>
              {/* The place and distance for the kind of help picked in the
                  Ask chapter. */}
              <strong>
                {t.help.items.map(({ icon, place }) => (
                  <span key={icon} data-tone={icon}>
                    {place}
                  </span>
                ))}
              </strong>
              <span className={s.distance}>
                <Icon name="pin" />
                <span>
                  {t.help.items.map(({ icon }) => (
                    <span key={icon} data-tone={icon}>
                      {kmTo(icon)}
                    </span>
                  ))}{" "}
                  {t.way.away}
                </span>
              </span>
            </p>
          </div>
        </section>

        <section id="meet" className={`${s.chapter} ${s.meet}`} aria-labelledby="meet-title">
          <div className={s.chapterCopy}>
            <h2 id="meet-title">{t.meet.title}</h2>
            <p className={s.lead}>{t.meet.lead}</p>
            <h3>{t.meet.panelTitle}</h3>
            {/* The request's path; on a loop, the line fills step by step. */}
            <ol className={s.steps}>
              {t.meet.steps.map((step) => (
                <li key={step.label}>
                  <strong>{step.label}</strong>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
            <label className={s.pause}>
              <input type="checkbox" aria-label={t.meet.pause} />
              <Icon name="pause" className={s.pauseIcon} />
              <Icon name="play" className={s.playIcon} />
            </label>
          </div>
          <div className={s.chapterMedia}>
            <p className={s.floatNote}>
              <span className={s.arrivedDot} />
              {t.meet.arrived}
            </p>
            <Shot {...t.meet.screen} />
          </div>
        </section>

        {/* Who comes: a navy band like the hero, the licence number set large. */}
        <section id="trust" className={s.trust} aria-labelledby="trust-title">
          <div className={s.trustInner}>
            <h2 id="trust-title">{t.trust.title}</h2>
            <ul className={s.trustList}>
              {t.trust.items.map((item) => (
                <li key={item.icon}>
                  {item.icon === "association" ? (
                    // Also in the text below, so screen readers skip this one.
                    <span className={s.bigNumber} aria-hidden="true">
                      {[...t.trust.licence].map((digit, i) => (
                        <span key={i}>{digit}</span>
                      ))}
                    </span>
                  ) : (
                    <Icon name={item.icon as IconName} />
                  )}
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="volunteers" className={`${s.chapter} ${s.volunteer}`} aria-labelledby="volunteers-title">
          <div className={s.chapterCopy}>
            <h2 id="volunteers-title">{t.volunteers.title}</h2>
            <p className={s.lead}>{t.volunteers.lead}</p>
            <ul className={s.points}>
              {t.volunteers.points.map((point) => (
                <li key={point}>
                  <Icon name="check" />
                  {point}
                </li>
              ))}
            </ul>
            <p className={s.hours}>
              <Icon name="award" />
              <span>{t.volunteers.hours}</span>
            </p>
            <StoreBadges t={t} />
          </div>
          <div className={s.chapterMedia}>
            <Shot {...t.volunteers.screen} />
          </div>
        </section>

        <section className={s.faqSection} aria-labelledby="faq-title">
          <div className={s.faqHead}>
            <h2 id="faq-title">{t.faq.title}</h2>
            <p className={s.help}>
              {t.faq.help} <Phone n={t.footer.phone} />
            </p>
          </div>
          <div className={s.faq}>
            {t.faq.items.map((item) => (
              <details key={item.q} className={s.qa}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing: a navy band like the hero, the welcome screen rising. */}
        <section id="download" className={s.close} aria-labelledby="download-title">
          <h2 id="download-title">{t.close.title}</h2>
          <p className={s.lead}>{t.close.text}</p>
          <StoreBadges t={t} />
          {/* Desktop only. A QR code can't be used without sight, so the
              store links above stay the accessible path; these are extras. */}
          <div className={s.qr}>
            <p>{t.close.qrHint}</p>
            <div className={s.qrCodes}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/qr/app-store.svg" alt={t.close.qrAppStore} width={132} height={132} />
                <figcaption lang="en">App Store</figcaption>
              </figure>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/qr/google-play.svg" alt={t.close.qrGooglePlay} width={132} height={132} />
                <figcaption lang="en">Google Play</figcaption>
              </figure>
            </div>
          </div>
          <div className={s.closePhone}>
            <div className={s.device}>
              <Image src="/welcome.png" alt={t.close.screenAlt} width={1242} height={2148} sizes="16rem" />
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerInner}>
          <p className={s.systemNote}>{t.footer.concept}</p>
          <nav aria-label={t.footer.label}>
            <ul className={s.footerLinks}>
              <li>
                <a href={links.appStore} lang="en">
                  App Store
                </a>
              </li>
              <li>
                <a href={links.googlePlay} lang="en">
                  Google Play
                </a>
              </li>
              <li>
                <a href={links.privacy}>{t.footer.privacy}</a>
              </li>
              <li>
                <a href={links.association}>{t.footer.association}</a>
              </li>
            </ul>
          </nav>
          <p className={s.contact}>
            {t.footer.contact}: <Phone n={t.footer.phone} />
          </p>
          <p>{t.footer.by}</p>
        </div>
      </footer>

      <MobileCta label={t.download} />
    </>
  );
}

// Digits run left to right even inside Arabic text.
function Phone({ n }: { n: string }) {
  return (
    <a href={`tel:${n}`} dir="ltr">
      {n}
    </a>
  );
}

// Where you meet for each kind of help: a street corner on the map, in map
// units, clear of the caption and meeting card that float over it.
const meetAt: Record<string, [number, number]> = {
  transport: [380, 280],
  walk: [380, 140],
  gov: [540, 210],
  shopping: [540, 140],
  hospital: [700, 210],
  other: [700, 140],
};

type Point = [number, number];

// Where the place's popup hangs off its pin: 0 sticks out to the right (the
// left column, by the caption), 1 to the left (the right column, by the
// meeting card), 0.5 centred.
const popAnchor = (x: number) => (x - 380) / (700 - 380);

// The two routes there along the streets: yours from the bottom left, along
// the bottom street and up; the volunteer's from the top right, along the
// top street and down.
function routesTo([x, y]: Point) {
  return {
    you: [[120, 392], [120, 350], [x, 350], [x, y]] as Point[],
    volunteer: [[1100, 28], [1100, 70], [x, 70], [x, y]] as Point[],
  };
}

const routeLength = (points: Point[]) =>
  points.slice(1).reduce((sum, [x, y], i) => sum + Math.abs(x - points[i][0]) + Math.abs(y - points[i][1]), 0);

// How far the meeting point is from you: your route at 305 map units to the
// kilometre, so the hospital (762 units) is the 2.5 km of the app's own list.
const kmTo = (icon: string) => (routeLength(routesTo(meetAt[icon]).you) / 305).toFixed(1);

// A dot's trip along its route as keyframes: it sets off at 5% of the loop
// and reaches the pin at 65%, each turn at its share of the route's length
// so it moves at an even speed, then waits and fades out from 85% to 95%.
function trip(name: string, points: Point[]) {
  const [x0, y0] = points[0];
  const at = ([x, y]: Point) => `${x - x0}px ${y - y0}px`;
  const total = routeLength(points);
  const turns = points
    .slice(1)
    .map((p, i) => `${(5 + (60 * routeLength(points.slice(0, i + 2))) / total).toFixed(2)}%{translate:${at(p)}}`);
  const end = at(points[points.length - 1]);
  return `@keyframes ${name}{0%{translate:0 0;opacity:0}5%{translate:0 0;opacity:1}${turns.join("")}85%{translate:${end};opacity:1}95%,100%{translate:${end};opacity:0}}[data-trip="${name}"]{animation-name:${name}}`;
}

// The meeting map: for each kind of help, two routes along the streets,
// yours (ink) and the volunteer's (cyan), meeting at its pin; CSS shows the
// picked kind's. pathLength=1 lets CSS draw the routes behind the travelling
// dots ("The arrival" in the CSS); without motion they are simply drawn, the
// dots at their starts.
function RouteMap() {
  const kinds = Object.entries(meetAt).map(([icon, at]) => ({ icon, at, routes: routesTo(at) }));
  const trips = kinds.map(({ icon, routes }) => trip(`trip-${icon}-you`, routes.you) + trip(`trip-${icon}-volunteer`, routes.volunteer));
  const d = (points: Point[]) => `M${points.join("L").replaceAll(",", " ")}`;
  return (
    <svg className={s.map} viewBox="0 0 1200 420" aria-hidden="true" focusable="false">
      {/* Generated from the routes above, not from visitors: safe as HTML. */}
      <style dangerouslySetInnerHTML={{ __html: `@media (prefers-reduced-motion: no-preference){${trips.join("")}}` }} />
      <rect className={s.mapGround} width="1200" height="420" />
      <path className={s.street} d="M0 70H1200M0 210H1200M0 350H1200M120 0V420M380 0V420M700 0V420M980 0V420" />
      <path className={s.streetMinor} d="M0 140H1200M0 280H1200M250 0V420M540 0V420M840 0V420M1100 0V420" />
      {kinds.map(({ icon, at: [x, y], routes }) => (
        <g key={icon} data-tone={icon}>
          <path className={s.routeYou} d={d(routes.you)} pathLength={1} />
          <path className={s.routeVolunteer} d={d(routes.volunteer)} pathLength={1} />
          <circle className={s.dotYou} cx="120" cy="392" r="12" data-trip={`trip-${icon}-you`} />
          <circle className={s.dotVolunteer} cx="1100" cy="28" r="12" data-trip={`trip-${icon}-volunteer`} />
          <circle className={s.meetRing} cx={x} cy={y} r="14" />
          <g className={s.pin}>
            <path className={s.pinShape} d={`M${x} ${y - 2}c-18-20-30-34-30-49a30 30 0 0 1 60 0c0 15-12 29-30 49z`} />
            <circle cx={x} cy={y - 51} r="11" fill="#fff" />
          </g>
        </g>
      ))}
    </svg>
  );
}

// A real app screen, cropped to the part that matters.
function Shot({ src, alt, w, h, children }: { src: string; alt: string; w: number; h: number; children?: ReactNode }) {
  return (
    <div className={s.shot}>
      <Image src={src} alt={alt} width={w} height={h} sizes="(min-width: 52rem) 24rem, 90vw" />
      {children}
    </div>
  );
}

function StoreBadges({ t }: { t: Content }) {
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
