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

export function HeroPhone({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduced();
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
    <div ref={ref} className={className}>
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
