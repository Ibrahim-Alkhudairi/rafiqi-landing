"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { Content } from "@/content/ar";
import { Icon, type IconName } from "./icons";
import s from "./page.module.css";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

// useReducedMotion is null on the server. Apply it only after mount, or the
// first client render differs from the HTML and React keeps the server's.
function useReduced() {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && prefers === true;
}

// The top bar: the full band while the hero (id `after`) plays, a floating
// pill from the moment the hero's end is on screen (its scroll story has
// finished) all the way to the bottom of the page. The pill styling lives in
// page.module.css under [data-scrolled].
export function Header({ className, after, children }: { className: string; after: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Two thresholds so it never flickers back and forth near the hero's end.
    const onScroll = () => {
      const heroEnd = document.getElementById(after)?.getBoundingClientRect().bottom ?? 0;
      setScrolled((was) => heroEnd <= window.innerHeight + (was ? 32 : 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [after]);

  // The band shrinks to the row's real width, measured here as --pill-x.
  useEffect(() => {
    const header = ref.current;
    const bar = header?.firstElementChild as HTMLElement | null;
    if (!header || !bar) return;
    const measure = () =>
      header.style.setProperty("--pill-x", `${Math.max(0, (header.clientWidth - bar.offsetWidth) / 2)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref} className={className} data-scrolled={scrolled || undefined}>
      {children}
    </header>
  );
}

type Phases = Content["phases"];

// Which phase is on screen. A phase can own several sections ("Who will go
// with you?" counts as the volunteer phase); none in view (the FAQ, the
// footer) means null.
function useCurrentPhase(items: Phases["items"]) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const phaseOf = new Map(items.flatMap((item) => item.sections.map((id) => [id, item.id] as const)));
    const sections = [...phaseOf.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        const last = sections.findLast((el) => inView.has(el.id));
        setCurrent(last ? phaseOf.get(last.id)! : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);
  return current;
}

function PhaseLinks({ items, current, onPick }: { items: Phases["items"]; current: string | null; onPick?: () => void }) {
  return (
    <ol>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} aria-current={current === item.id ? "true" : undefined} onClick={onPick}>
            <Icon name={item.icon as IconName} />
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

// The journey links in the top bar (wide screens).
export function PhaseNav({ t }: { t: Phases }) {
  const current = useCurrentPhase(t.items);
  return (
    <nav className={s.phaseNav} aria-label={t.label}>
      <PhaseLinks items={t.items} current={current} />
    </nav>
  );
}

// The burger menu (phones and tablets): the same journey links plus Download.
// Built on <details>, so it opens without JavaScript and announces
// expanded/collapsed; with JavaScript it also closes on a pick, on Escape
// (focus back to the burger) and on a tap outside.
export function MobileMenu({ t, label, download }: { t: Phases; label: string; download: string }) {
  const current = useCurrentPhase(t.items);
  const ref = useRef<HTMLDetailsElement>(null);
  const close = (focusBurger = false) => {
    const menu = ref.current;
    if (!menu?.open) return;
    menu.open = false;
    if (focusBurger) menu.querySelector("summary")?.focus();
  };

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const menu = ref.current;
      if (menu?.open && !menu.contains(e.target as Node)) menu.open = false;
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <details ref={ref} className={s.menu} onKeyDown={(e) => e.key === "Escape" && close(true)}>
      <summary aria-label={label}>
        <Icon name="menu" className={s.menuIconOpen} />
        <Icon name="close" className={s.menuIconClose} />
      </summary>
      <nav className={s.menuPanel} aria-label={label}>
        <PhaseLinks items={t.items} current={current} onPick={() => close()} />
        <a className={s.menuDownload} href="#download" onClick={() => close()}>
          <Icon name="download" />
          {download}
        </a>
      </nav>
    </details>
  );
}

// On the way: the app's search screen, live. Its suggestion box lists the
// places you could meet, its field shows the one picked, and a tap on a
// suggestion picks it: that checks the place's Ask chip (the radios named
// "help"), so the map, its card and the Ask card all follow; a pick in Ask
// shows up here. Until JavaScript runs, the screenshot shows as it is.
export function PlaceSearch({
  labelledBy,
  places,
  away,
}: {
  labelledBy: string;
  places: { icon: string; place: string; km: string }[];
  away: string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string>();

  useEffect(() => {
    setPicked(document.querySelector<HTMLInputElement>('input[name="help"]:checked')?.value);
    const onChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.name === "help") setPicked(input.value);
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, []);

  // The picked suggestion stays in view in the box (moving the box only,
  // never the page, as a pick in Ask happens far above).
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>("label:has(:checked)");
    if (!box || !row) return;
    if (row.offsetTop < box.scrollTop) box.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > box.scrollTop + box.clientHeight)
      box.scrollTop = row.offsetTop + row.offsetHeight - box.clientHeight;
  }, [picked]);

  if (!picked) return null;
  const pick = (icon: string) => {
    document.querySelector<HTMLInputElement>(`input[name="help"][value="${icon}"]`)!.checked = true;
    setPicked(icon);
  };
  return (
    <div className={s.search} dir="rtl">
      {/* Typed in the field: the picked place. */}
      <span key={picked} className={s.searchText} dir="auto" aria-hidden="true">
        {places.find((p) => p.icon === picked)?.place}
      </span>
      <div ref={list} className={s.suggestions} role="radiogroup" aria-labelledby={labelledBy}>
        {places.map(({ icon, place, km }) => (
          <label key={icon}>
            <input type="radio" name="place" checked={picked === icon} onChange={() => pick(icon)} />
            <Icon name="pin" />
            <span dir="auto">
              <strong>{place}</strong>
              <span>
                {km} {away}
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Phones: a Download button in thumb reach, shown once the hero's own store
// badges have scrolled away and hidden again at the bottom, where the
// download section is. Hidden means visibility: hidden, so it can't be tabbed to.
export function MobileCta({ label }: { label: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 24;
      setShown(y > window.innerHeight * 0.8 && !atBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a className={s.mobileCta} href="#download" data-shown={shown || undefined}>
      <Icon name="download" />
      {label}
    </a>
  );
}

// The hero phone, in 3D. It rests straight; a nearby pointer (mouse and
// trackpad only) tilts it a little, so its edge shows. Its rise in the
// pinned hero is CSS ("The hero story" in page.module.css). Reduced motion:
// straight, no movement.
const rest = { rotateX: 0, rotateY: 0 };

export function HeroPhone({ className, after, children }: { className: string; after: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduced();
  const [rise, setRise] = useState<"down" | "up">();

  // Up once the statement (id `after`) has fully faded, down while any of it
  // shows. On phones the CSS plays the rise in one go off this, instead of
  // over a stretch of scroll; elsewhere it's unused.
  useEffect(() => {
    const text = document.getElementById(after);
    if (!text) return;
    // Read a frame later: during the scroll event the fade hasn't caught up
    // with the scroll yet, and stopping right where it ends would read 0.001.
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setRise(getComputedStyle(text).opacity === "0" ? "up" : "down"));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [after]);
  const tiltX = useMotionValue(rest.rotateX);
  const tiltY = useMotionValue(rest.rotateY);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reach = 460; // px from the phone's centre where the tilt starts
    const max = 5; // degrees at the edge of that reach
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < reach;
      tiltY.set(rest.rotateY + (near ? (dx / reach) * max : 0));
      tiltX.set(rest.rotateX + (near ? (-dy / reach) * max : 0));
    };
    const reset = () => {
      tiltX.set(rest.rotateX);
      tiltY.set(rest.rotateY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, [reduce, tiltX, tiltY]);

  return (
    <div ref={ref} className={className} data-rise={rise}>
      <m.div className={s.phoneTilt} style={reduce ? rest : { rotateX, rotateY }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={s.phoneLayer} style={{ "--i": 12 - i } as CSSProperties} aria-hidden="true" />
        ))}
        <i className={s.phoneButton} aria-hidden="true" />
        <i className={s.phoneButton} aria-hidden="true" />
        <i className={s.phoneButton} aria-hidden="true" />
        <div className={s.phoneFace}>{children}</div>
      </m.div>
    </div>
  );
}

// A hero notification. Hovered with a mouse or trackpad it grows a little and
// tilts with the pointer, on the same spring as the phone; it settles back
// when the pointer leaves. Touch and reduced motion: it stays still.
export function TiltCard({ className, children }: { className: string; children: ReactNode }) {
  const reduce = useReduced();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const grow = useMotionValue(1);
  const spring = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(tiltX, spring);
  const rotateY = useSpring(tiltY, spring);
  const scale = useSpring(grow, spring);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    // Measured on the untransformed parent, so the tilt can't feed back into itself.
    const r = e.currentTarget.parentElement!.getBoundingClientRect();
    const max = 10; // degrees at the card's edge
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max);
    grow.set(1.08);
  };
  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    grow.set(1);
  };

  return (
    <m.div
      aria-hidden="true"
      className={className}
      style={{ rotateX, rotateY, scale, transformPerspective: 800 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.div>
  );
}
