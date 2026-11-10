import Image from "next/image";
import { notFound } from "next/navigation";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { content, hasLang, links, social } from "@/content";
import { requestFills, type Content } from "@/content/ar";
import { Icon, type IconName } from "./icons";
import { Phone, SiteFooter, SiteHeader, StoreBadges } from "./chrome";
import { HeroGlow, HeroPhone, PlaceSearch, TiltCard, VolunteerSteps, WhoSwitcher } from "./motion";
import s from "./page.module.css";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const t = content[lang];
  const sticker = t.who.give.sticker;

  return (
    <>
      <SiteHeader lang={lang} after="hero" />

      <main id="main" tabIndex={-1}>
        <section id="hero" className={s.hero} aria-labelledby="hero-title">
          <HeroGlow />
          <div className={s.heroGrid}>
            <div id="hero-text" className={s.heroText}>
              <h1 id="hero-title">
                {t.hero.title.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    <span className={s.heroLine}>{line}</span>
                  </span>
                ))}
              </h1>
              <p className={s.lead}>{t.hero.lead}</p>
              <div className={s.actions}>
                <StoreBadges t={t} />
              </div>
              <ul className={s.proof}>
                {t.hero.proof.map((item) => (
                  <li key={item.text}>
                    <Icon name={item.icon as IconName} />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* The phone among the kinds of help it covers; decoration, but
                for the phone's own alt text. */}
            <div className={s.visual}>
              <span className={s.ring} aria-hidden="true" />
              <span className={`${s.ring} ${s.ring2}`} aria-hidden="true" />
              <HeroPhone className={s.phone}>
                <span className={s.phoneScreen}>
                  <Image src="/welcome.png" alt={t.hero.phoneAlt} width={1242} height={2148} sizes="18rem" preload />
                </span>
              </HeroPhone>
              {(["hospital", "shopping", "gov", "transport", "walk", "other"] as const).map((icon) => (
                <span key={icon} className={s.chip} data-tone={icon} aria-hidden="true">
                  <span>
                    <Icon name={icon} />
                  </span>
                  {t.help.items.find((item) => item.icon === icon)!.title}
                </span>
              ))}
              {/* Illustrative notifications built from the app's real statuses. */}
              {t.hero.notes.map((note, i) => (
                <div key={note.title} className={`${s.note} ${i === 0 ? s.noteCheck : s.noteArrived}`} aria-hidden="true">
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

        {/* About us: who is behind the app, in two lines of thought: the name
            and the logo on the start side, the paragraph and the way to the
            association's site on the other. */}
        <section id="about" className={s.about} aria-labelledby="about-title">
          <div className={s.aboutInner}>
            <svg className={`${s.spark} ${s.aboutSpark1}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />
            </svg>
            <svg className={`${s.spark} ${s.aboutSpark2}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />
            </svg>
            <div className={s.aboutBody}>
              <h2 id="about-title">{t.about.title}</h2>
              <p>{t.about.text}</p>
              <a className={s.aboutLink} href={links.association}>
                {t.about.link}
                <Icon name="chevron" />
              </a>
            </div>
            <div className={s.aboutVisual}>
              <div className={s.aboutTile}>
                <Image className={s.aboutIcon} src="/icon.png" alt="" width={128} height={128} />
              </div>
              <ul className={s.aboutTags}>
                {t.about.tags.map((tag) => (
                  <li key={tag.text}>
                    <Icon name={tag.icon as IconName} />
                    {tag.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Who it is for: a calm feature list, both sides in view, the line above
            the selected one a timer (WhoSwitcher in motion.tsx); the card
            beside it, with a real app screen, trades places to match. The
            screens are described elsewhere on the page, so they are
            decoration here. */}
        <section id="who" className={s.who} aria-labelledby="who-title">
          <div className={s.whoInner}>
            <h2 id="who-title">{t.who.title}</h2>

            <WhoSwitcher
              items={[
                {
                  key: "you",
                  icon: "walk" as const,
                  label: t.who.you.label,
                  title: t.who.you.title,
                  body: (
                    <>
                      <p>{t.who.you.text}</p>
                      <WhoTags tags={t.who.you.tags} />
                    </>
                  ),
                },
                {
                  key: "give",
                  icon: "association" as const, // lucide hand-heart, already in icons.tsx
                  label: t.who.give.label,
                  title: t.who.give.title,
                  body: (
                    <>
                      <p>{t.who.give.text}</p>
                      <WhoTags tags={t.who.give.tags} />
                      <a className={s.whoLink} href="#volunteers">
                        {t.hero.volunteer}
                        <Icon name="chevron" />
                      </a>
                    </>
                  ),
                },
              ]}
              visuals={[
                <Fragment key="you">
                  <span className={`${s.whoBackdrop} ${s.whoRing}`} />
                  <div className={`${s.whoShot} ${s.whoPhoneShot} ${s.whoTiltYou}`}>
                    <div className={s.whoPhone}>
                      <Image src="/screens/who-request.jpg" alt="" width={720} height={1560} sizes="17rem" />
                    </div>
                  </div>
                </Fragment>,
                <Fragment key="give">
                  <span className={`${s.whoBackdrop} ${s.whoSun}`} />
                  <div className={`${s.whoShot} ${s.whoPhoneShot} ${s.whoTiltGive}`}>
                    <div className={s.whoPhone}>
                      <Image src="/screens/who-volunteer.jpg" alt="" width={591} height={1280} sizes="17rem" />
                    </div>
                  </div>
                  {/* A request as the app lists it. */}
                  {sticker && (
                    <span className={`${s.whoSticker} ${s.whoRequest}`}>
                      <span>
                        <Icon name="pin" />
                      </span>
                      <span>
                        <strong>{sticker.title}</strong>
                        <small>2.5 {t.way.away}</small>
                      </span>
                    </span>
                  )}
                </Fragment>,
              ]}
            />
          </div>
        </section>

        {/* One journey, four steps on one line that fills as you scroll; each
            step is a chapter shaped by what it shows. */}
        <section id="journey" className={s.journey} aria-labelledby="journey-title">
          <div className={s.journeyHead}>
            <h2 id="journey-title">{t.journey.title}</h2>
            <p className={s.lead}>{t.journey.lead}</p>
          </div>
          <div className={s.journeyPath}>
          <div className={s.step}>
            <p className={s.stepHead} aria-hidden="true">
              <span className={s.marker}>1</span>
              {t.journey.steps[0]}
            </p>
          <section id="before" className={`${s.chapter} ${s.ask}`} aria-labelledby="before-title">
            <div className={s.chapterCopy}>
              <h3 id="before-title" className={s.stepTitle}>{t.before.title}</h3>
              <p className={s.lead}>{t.before.lead}</p>
              <h4 id="help-title">{t.before.panelTitle}</h4>
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
          </div>
          <div className={s.step}>
            <p className={s.stepHead} aria-hidden="true">
              <span className={s.marker}>2</span>
              {t.journey.steps[1]}
            </p>
          <section id="way" className={`${s.chapter} ${s.way}`} aria-labelledby="way-title">
            <div className={s.chapterCopy}>
              <h3 id="way-title" className={s.stepTitle}>{t.way.title}</h3>
              <p className={s.lead}>{t.way.lead}</p>
            </div>
            <div className={s.chapterMedia}>
              <Shot {...t.way.screen}>
                <PlaceSearch
                  labelledBy="way-title"
                  places={t.help.items.map(({ icon, place }) => ({ icon, place, km: kmTo(icon) }))}
                  away={t.way.away}
                />
              </Shot>
            </div>
            {/* On a loop, the two of you set off from your points and meet at
                the pin. */}
            <div className={s.mapStage}>
              <div className={s.mapCaption}>
              <h4>{t.way.panelTitle}</h4>
            </div>
            <div className={s.mapFrame}>
                <RouteMap />
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
          </div>
          <div className={s.step}>
            <p className={s.stepHead} aria-hidden="true">
              <span className={s.marker}>3</span>
              {t.journey.steps[2]}
            </p>
          <section id="matched" className={s.chapter} aria-labelledby="matched-title">
            <div className={s.chapterCopy}>
              <h3 id="matched-title" className={s.stepTitle}>{t.matched.title}</h3>
              <p className={s.lead}>{t.matched.lead}</p>
            </div>
            <ul className={s.matchedList}>
              {t.matched.points.map((point) => (
                <li key={point.title}>
                  <Icon name={point.icon as IconName} />
                  <strong>{point.title}</strong>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </section>
          </div>
          <div className={s.step}>
            <p className={s.stepHead} aria-hidden="true">
              <span className={s.marker}>4</span>
              {t.journey.steps[3]}
            </p>
          <section id="meet" className={`${s.chapter} ${s.meet}`} aria-labelledby="meet-title">
            <div className={s.chapterCopy}>
              <h3 id="meet-title" className={s.stepTitle}>{t.meet.title}</h3>
              <p className={s.lead}>{t.meet.lead}</p>
              {/* The request's path; on a loop, the line fills step by step. */}
              <ol className={s.steps}>
                {t.meet.steps.map((step) => (
                  <li key={step.label}>
                    <strong>{step.label}</strong>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ol>
              <p className={s.stepsNote}>{t.meet.after}</p>
            </div>
            <div className={s.chapterMedia}>
              <p className={s.floatNote}>
                <span className={s.arrivedDot} />
                {t.meet.arrived}
              </p>
              <Shot {...t.meet.screen} />
            </div>
          </section>
          </div>
          </div>
            {/* The promise in one sentence; its words light up in reading order as
                the page scrolls ("Manifesto" in the CSS). Screen readers get it
                whole, as some stop on every word span. */}
            <div className={s.manifesto}>
              <p>
                <span className={s.srOnly}>{t.manifesto}</span>
                {t.manifesto.split(" ").map((word, i) => (
                  <span key={i} aria-hidden="true" style={{ "--i": i } as CSSProperties}>
                    {word}{" "}
                  </span>
                ))}
              </p>
            </div>
        </section>

        {/* The other side of the same journey: one light-blue band, the volunteer's
            four steps as a stepper on the start side, a phone and two
            stickers on the other (VolunteerSteps in motion.tsx). */}
        <section id="volunteers" className={s.volBand} aria-labelledby="volunteers-title">
          <div className={s.volHead}>
            <h2 id="volunteers-title">{t.volunteers.title}</h2>
            <p className={s.lead}>{t.volunteers.lead}</p>
          </div>
          <VolunteerSteps steps={t.volunteers.steps} events={t.volunteers.eventsShort} hours={t.volunteers.hoursShort} />
        </section>

        <section id="faq" className={s.faqSection} aria-labelledby="faq-title">
          <div className={s.faqHead}>
            <h2 id="faq-title">{t.faq.title}</h2>
            <p className={s.help}>
              {t.faq.help} <Phone n={t.footer.phone} />
            </p>
          </div>
          <div>
            <div className={s.faqPanel}>
              {t.faq.items.map((item) => (
                <details key={item.q} className={s.qa}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
            <a className={s.faqMore} href={`/${lang}/faq/`}>
              {t.faq.more}
              <Icon name="chevron" />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </>
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
// The reasons, as stickers; an icon only where the content gives one.
function WhoTags({ tags }: { tags: { icon: string; text: string }[] }) {
  return (
    <ul className={s.whoTags}>
      {tags.map((tag) => (
        <li key={tag.text}>
          {tag.icon && <Icon name={tag.icon as IconName} />}
          {tag.text}
        </li>
      ))}
    </ul>
  );
}

function Shot({ src, alt, w, h, children }: { src: string; alt: string; w: number; h: number; children?: ReactNode }) {
  return (
    <div className={s.shot}>
      <Image src={src} alt={alt} width={w} height={h} sizes="(min-width: 52rem) 24rem, 90vw" />
      {children}
    </div>
  );
}

