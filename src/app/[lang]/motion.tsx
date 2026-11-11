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
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type CSSProperties,
} from "react";
import Image from "next/image";
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

// The top bar: the full band while the hero (id `after`) is under it, a
// floating pill once the hero has scrolled up past the bar, all the way to
// the bottom of the page. The pill styling lives in
// page.module.css under [data-scrolled].
export function Header({ className, after, children }: { className: string; after: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Two thresholds so it never flickers back and forth near the hero's end.
    const onScroll = () => {
      const heroEnd = document.getElementById(after)?.getBoundingClientRect().bottom ?? 0;
      setScrolled((was) => heroEnd <= (ref.current?.offsetHeight ?? 0) + (was ? 32 : 0));
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

function PhaseLinks({ items, current, onPick, base = "" }: { items: Phases["items"]; current: string | null; onPick?: () => void; base?: string }) {
  return (
    <ol>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`${base}#${item.id}`} aria-current={current === item.id ? "true" : undefined} onClick={onPick}>
            <Icon name={item.icon as IconName} />
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

// The journey links in the top bar (wide screens).
export function PhaseNav({ t, base = "" }: { t: Phases; base?: string }) {
  const current = useCurrentPhase(t.items);
  return (
    <nav className={s.phaseNav} aria-label={t.label}>
      <PhaseLinks items={t.items} current={current} base={base} />
    </nav>
  );
}

// The burger menu (phones and tablets): the same journey links plus Download.
// Built on <details>, so it opens without JavaScript and announces
// expanded/collapsed; with JavaScript it also closes on a pick, on Escape
// wherever focus is (focus back to the burger), on a tap outside, and when
// focus moves out of it, so it never covers what has focus.
export function MobileMenu({ t, label, download, base = "" }: { t: Phases; label: string; download: string; base?: string }) {
  const current = useCurrentPhase(t.items);
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  useEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (menu.open && !menu.contains(e.target as Node)) menu.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !menu.open) return;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    };
    // Focus moving to the page; a click on the panel's blank space moves it
    // to nowhere (relatedTarget null) and keeps the menu open.
    const onFocusOut = (e: FocusEvent) => {
      if (menu.open && e.relatedTarget instanceof Node && !menu.contains(e.relatedTarget)) menu.open = false;
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    menu.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      menu.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <details ref={ref} className={s.menu}>
      <summary aria-label={label}>
        <Icon name="menu" className={s.menuIconOpen} />
        <Icon name="close" className={s.menuIconClose} />
      </summary>
      <nav className={s.menuPanel} aria-label={label}>
        <PhaseLinks items={t.items} current={current} onPick={close} base={base} />
        <a className={s.menuDownload} href={`${base}#download`} onClick={close}>
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
      if (input.name === "help") {
        touched.current = true; // a pick elsewhere ends the place list's hint too
        setPicked(input.value);
      }
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

  // A hint, once: the first time the list is at least 60% in view it scrolls
  // itself down about a row and a half, holds, and glides back, to show that
  // you can choose from it. It moves the box only, never the page. Skipped
  // when the list can't scroll, under reduced motion, or once the visitor has
  // touched, scrolled, focused or picked in it; any such touch during the
  // nudge cancels it where they left the list. Nothing gets focus or is
  // announced.
  const touched = useRef(false);
  const hinted = useRef(false);
  const shown = Boolean(picked);
  useEffect(() => {
    const box = list.current;
    if (!box || !shown || hinted.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let hold = 0;
    const stop = () => {
      touched.current = true;
      cancelAnimationFrame(frame);
      clearTimeout(hold);
      io.disconnect();
    };
    const glide = (to: number, ms: number, done: () => void) => {
      const from = box.scrollTop;
      const t0 = performance.now();
      const step = (now: number) => {
        if (touched.current) return; // a pick or a touch ends the hint where it is
        const k = Math.min(1, (now - t0) / ms);
        box.scrollTop = from + (to - from) * (1 - Math.pow(1 - k, 3));
        if (k < 1) frame = requestAnimationFrame(step);
        else done();
      };
      frame = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hinted.current || touched.current) return;
        const max = box.scrollHeight - box.clientHeight;
        if (max <= 4) return;
        hinted.current = true;
        io.disconnect();
        const start = box.scrollTop;
        const target = Math.min(max, start + 80);
        if (target - start < 4) return;
        glide(target, 700, () => {
          hold = window.setTimeout(() => glide(start, 700, () => {}), 400);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(box);
    const events = ["wheel", "touchstart", "pointerdown", "focusin", "keydown"] as const;
    events.forEach((e) => box.addEventListener(e, stop, { passive: true }));
    return () => {
      events.forEach((e) => box.removeEventListener(e, stop));
      cancelAnimationFrame(frame);
      clearTimeout(hold);
      io.disconnect();
    };
  }, [shown]);

  if (!picked) return null;
  const pick = (icon: string) => {
    touched.current = true;
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
// badges have scrolled away and hidden again from the moment the footer's
// download block comes on screen, so it never covers that block's own badges.
// Hidden means visibility: hidden, so it can't be tabbed to.
export function MobileCta({ label, base = "" }: { label: string; base?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const download = document.getElementById("download");
    const onScroll = () => {
      const reached = (download?.getBoundingClientRect().top ?? Infinity) < window.innerHeight;
      setShown(window.scrollY > window.innerHeight * 0.8 && !reached);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a className={s.mobileCta} href={`${base}#download`} data-shown={shown || undefined}>
      <Icon name="download" />
      {label}
    </a>
  );
}

// The hero phone, in 3D. It rests straight; a nearby pointer (mouse and
// trackpad only) tilts it a little, so its edge shows. Reduced motion:
// straight, no movement.
const rest = { rotateX: 0, rotateY: 0 };

// The hero phone: tilts toward the pointer anywhere over the hero (up to 9
// degrees, eased every frame), with a very slow sway of its own so it is alive
// on touch screens too. Only the tilt is written (as CSS variables, read by a
// transform), from one rAF loop that runs only while the hero is on screen.
// Reduced motion: nothing moves.
export function HeroPhone({ className, label, children }: { className: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduced();

  useEffect(() => {
    const el = ref.current;
    const hero = document.getElementById("hero");
    if (!el || !hero || reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const maxY = 9;
    const maxX = 7;
    let tx = 0; // the pointer's target, -1 to 1 over the hero
    let ty = 0;
    let x = 0; // eased
    let y = 0;
    let raf = 0;
    let on = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const frame = (now: number) => {
      const t = now / 1000;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      const swayY = 2 * Math.sin((t * Math.PI * 2) / 8); // idle: +-2 degrees over 8s
      const swayX = 1 * Math.sin((t * Math.PI * 2) / 10 + 1);
      const ry = x * maxY + swayY;
      const rx = -y * maxX + swayX;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (on) return;
      on = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      on = false;
      cancelAnimationFrame(raf);
    };
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(hero);
    if (fine) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
    }
    return () => {
      stop();
      observer.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      <div className={s.phoneTilt}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={s.phoneLayer} style={{ "--i": 12 - i } as CSSProperties} aria-hidden="true" />
        ))}
        <i className={s.phoneButton} aria-hidden="true" />
        <i className={s.phoneButton} aria-hidden="true" />
        <i className={s.phoneButton} aria-hidden="true" />
        <div className={s.phoneFace}>
          {children}
        </div>
      </div>
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

// The hero's interactive dot grid: one canvas (.heroDots) behind the phone,
// rings, chips, notes and text, dots 24px apart across the whole band. At
// rest, and where there is no mouse or motion is reduced, the dots are just
// there, faint. With a mouse a lens follows the pointer: dots within 140px
// grow and brighten with a smooth falloff. Under the copy the dots show and
// react too, damped by a soft ramp: their peak alpha and size are capped so
// the lead (#e6efff) keeps 4.5:1 and the headline 3:1, the AA floor the user
// chose there. The loop runs only while the pointer is over the hero or the
// lens is fading, and not while the hero is off screen; the canvas scales
// with the pixel ratio and is rebuilt on resize. Nothing is added to the
// accessibility tree.
export function HeroGlow() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    const copy = document.getElementById("hero-text");
    if (!hero || !copy) return;
    const live = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

    const GAP = 24;
    const REST = 0.16; // alpha at rest, everywhere (the lead keeps 5.0:1 on it)
    const PEAK = 0.7; // alpha at the lens's centre
    const CAP = 0.19; // the most a dot may reach under the copy: the lead at 4.5:1
    const canvas = document.createElement("canvas");
    canvas.className = s.heroDots;
    canvas.setAttribute("aria-hidden", "true");
    hero.prepend(canvas);
    const ctx = canvas.getContext("2d")!;

    let w = 0, h = 0, cols = 0, rows = 0;
    let copyness = new Float32Array(0); // 0 on the picture side, 1 under the copy, a soft ramp between

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgb(255 255 255 / ${REST})`;
      ctx.beginPath();
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const x = i * GAP + GAP / 2, y = j * GAP + GAP / 2;
          ctx.moveTo(x + 1.2, y);
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        }
      ctx.fill();
    };

    const build = () => {
      const r = hero.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      copyness = new Float32Array(cols * rows);
      const c = copy.getBoundingClientRect();
      const x0 = c.left - r.left - 16, x1 = c.right - r.left + 16, y0 = c.top - r.top - 16, y1 = c.bottom - r.top + 16;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const x = i * GAP + GAP / 2, y = j * GAP + GAP / 2;
          const dx = Math.max(x0 - x, 0, x - x1), dy = Math.max(y0 - y, 0, y - y1);
          copyness[j * cols + i] = 1 - Math.min(1, Math.hypot(dx, dy) / 90);
        }
      drawStatic();
    };

    build();
    // The copy's box moves with the font swap and its own size, so it is
    // observed too and measured again once the fonts are in. (The entrance
    // animates the headline's lines, not this box, so it is stable.)
    const ro = new ResizeObserver(build);
    ro.observe(hero);
    ro.observe(copy);
    let gone = false;
    document.fonts.ready.then(() => {
      if (!gone) build();
    });
    const off: (() => void)[] = [() => (gone = true), () => ro.disconnect(), () => canvas.remove()];

    if (live) {
      let px = -999, py = -999, over = false, visible = true, frame = 0, last = 0, pf = 0;
      const io = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (!visible) {
          cancelAnimationFrame(frame);
          frame = 0;
          // Out of view mid-lens: put the dots back, so it isn't frozen when it returns.
          over = false;
          pf = 0;
          last = 0;
          drawStatic();
        }
      });
      io.observe(hero);
      off.push(() => io.disconnect());

      const tick = (now: number) => {
        frame = 0;
        const dt = Math.min(48, now - (last || now - 16));
        last = now;
        pf += ((over ? 1 : 0) - pf) * Math.min(1, dt / 120);
        ctx.clearRect(0, 0, w, h);
        for (let j = 0; j < rows; j++)
          for (let i = 0; i < cols; i++) {
            const bx = i * GAP + GAP / 2, by = j * GAP + GAP / 2;
            const d = Math.hypot(bx - px, by - py);
            let r = 1.2, a = REST;
            if (d < 140) {
              const t = 1 - d / 140;
              const f = t * t * (3 - 2 * t) * pf;
              r = 1.2 + 2.3 * f;
              a = REST + (PEAK - REST) * f;
              const s2 = copyness[j * cols + i];
              if (s2 > 0) {
                a = Math.max(REST, a * (1 - s2) + Math.min(a, CAP) * s2);
                r = r * (1 - s2) + Math.min(r, 2) * s2;
              }
            }
            ctx.fillStyle = `rgb(255 255 255 / ${a})`;
            ctx.beginPath();
            ctx.arc(bx, by, r, 0, Math.PI * 2);
            ctx.fill();
          }
        if (visible && (over || pf > 0.01)) frame = requestAnimationFrame(tick);
        else {
          last = 0;
          pf = 0;
          drawStatic();
        }
      };
      const kick = () => {
        if (!frame && visible) frame = requestAnimationFrame(tick);
      };
      const onMove = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        px = e.clientX - r.left;
        py = e.clientY - r.top;
        over = true;
        kick();
      };
      const onLeave = () => {
        over = false;
        kick();
      };
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
      off.push(() => {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
        cancelAnimationFrame(frame);
      });
    }

    return () => off.forEach((f) => f());
  }, []);
  return null;
}

// "Who is it for?": both sides stay in view as two items, one a short line
// timer on its start edge. The selected item's line fills over 8s (CSS); when
// it ends the other is selected, in a loop, and the card beside them (the
// visual) switches. It runs only while the switcher is at least half in view
// and not hovered or holding focus (the fill is paused, not stopped), and
// under reduced motion there is no fill, so no auto-switching. Picking an item
// by click or key ends the auto-switching for good. An automatic switch never
// moves focus and is not announced. Without JavaScript both items show anyway
// and the visual shows the first.
export function WhoSwitcher({
  items,
  visuals,
}: {
  items: { key: string; icon: IconName; label: string; title: string; body: ReactNode }[];
  visuals: [ReactNode, ReactNode];
}) {
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState(0);
  const [picked, setPicked] = useState(false);
  const [changed, setChanged] = useState(false);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // The items, not the wrapper: on wide screens the wrapper has no box of its own.
    const el = root.current?.firstElementChild;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const select = (i: number, byUser: boolean) => {
    setSel(i);
    setChanged(true);
    if (byUser) setPicked(true);
  };

  const paused = !inView || hover || focus;

  return (
    <div
      ref={root}
      className={s.whoSwitcher}
      data-paused={paused || undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => setFocus(root.current?.contains(e.relatedTarget as Node | null) ?? false)}
    >
      <div className={s.whoItems}>
        {items.map((item, i) => (
          <article
            key={item.key}
            className={`${s.whoItem} ${i === 0 ? s.whoYou : s.whoGive}`}
            data-selected={sel === i || undefined}
            data-solid={(sel === i && (picked || !mounted)) || undefined}
          >
            <span className={s.whoLine} aria-hidden="true">
              {mounted && sel === i && !picked && (
                <span className={s.whoTimer} onAnimationEnd={() => select((sel + 1) % 2, false)} />
              )}
            </span>
            <h3>
              <button
                type="button"
                id={`who-pick-${item.key}`}
                className={s.whoPick}
                aria-pressed={sel === i}
                onClick={() => select(i, true)}
              >
                {item.title}
              </button>
            </h3>
            {item.body}
          </article>
        ))}
      </div>
      <div className={s.whoVisual} aria-hidden="true" data-pick={items[sel].key} data-changed={changed || undefined}>
        {visuals.map((visual, i) => (
          // A click on the card behind brings it forward, for the pointer; the
          // items' buttons are the real control, so it is not focusable.
          <div key={i} className={`${s.whoCard} ${i === 0 ? s.whoYou : s.whoGive}`} onClick={() => select(i, true)}>
            {sel === i && (
              <span className={s.whoBadge}>
                <Icon name={items[i].icon} />
                {items[i].label}
              </span>
            )}
            {visual}
          </div>
        ))}
      </div>
    </div>
  );
}

// The volunteer's four steps as a vertical tablist (automatic activation,
// roving tabindex; up and down, Home and End move and select). The selected
// step's text opens right under its tab, one at a time; hovering a tab with a
// mouse previews it, and a click or key selects it. The phone beside it is
// decoration (its screens are described by the steps' texts) and crossfades
// to the selected step's screen. No auto-advance. Without JavaScript every
// step's text is listed and the phone shows step 1. It returns two grid items
// (the stepper and the picture) and the stickers, so the band can lay them out.
type VolSteps = Content["volunteers"]["steps"];

// The camera: each step frames the part of its screen that matters by scaling
// and shifting the whole phone (frame and screen together), from the top
// centre. s is the scale; y the shift, as a share of the phone's height
// (negative lifts the phone, so what is low on the screen comes into view; the
// phone may rise into the band's top padding, and sinks into its bottom edge).
// m is the lift alone, for phones, where the phone is not scaled.
const CAMERA = [
  { s: 1.1, y: 0, m: 0 }, // the sort pills and the first request card
  { s: 1.15, y: -0.27, m: -0.22 }, // the same-day warning and "Apply for the request", low on the screen
  { s: 1.15, y: -0.22, m: -0.14 }, // the "contact the requester" row and the request's title
  { s: 1.15, y: 0.02, m: 0 }, // the request card marked "taken by a volunteer"
];

export function VolunteerSteps({ steps, hours }: { steps: VolSteps; hours: string }) {
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState(0);
  const [changes, setChanges] = useState(0);
  const [wobble, setWobble] = useState(false);
  const [ready, setReady] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Closed panels snap shut once on load (no transition); only after that do
  // opening and closing animate.
  useEffect(() => {
    setMounted(true);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  // The stickers wobble once, the first time a mouse enters the band.
  useEffect(() => {
    const band = document.getElementById("volunteers");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!band || !fine.matches) return;
    const on = () => setWobble(true);
    band.addEventListener("pointerenter", on, { once: true });
    return () => band.removeEventListener("pointerenter", on);
  }, []);

  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setChanges((n) => n + 1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = steps.length - 1;
    // From the focused tab, not from the selected step: a hover preview can
    // have moved the selection since.
    const at = Math.max(0, tabs.current.indexOf(document.activeElement as HTMLButtonElement));
    const to =
      e.key === "ArrowDown" ? (at + 1) % steps.length
      : e.key === "ArrowUp" ? (at + last) % steps.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    select(to);
    tabs.current[to]?.focus();
  };

  return (
    <>
      <div className={s.volStepper} data-ready={ready || undefined}>
        {/* Before the script runs (or without it) the steps are plain headings
            and all their texts are open; then they become tabs. */}
        <div
          role={mounted ? "tablist" : undefined}
          aria-orientation={mounted ? "vertical" : undefined}
          aria-labelledby={mounted ? "volunteers-title" : undefined}
          className={s.volTabs}
          onKeyDown={onKeyDown}
        >
          {steps.map((step, i) =>
            mounted ? (
              <button
                key={step.title}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`vol-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`vol-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                className={s.volTab}
                style={{ gridRow: 2 * i + 1 }}
                onClick={() => select(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
              >
                <span className={s.volNum} aria-hidden="true">
                  {i + 1}
                </span>
                {step.title}
              </button>
            ) : (
              <h3 key={step.title} className={s.volTab} style={{ gridRow: 2 * i + 1 }}>
                <span className={s.volNum} aria-hidden="true">
                  {i + 1}
                </span>
                {step.title}
              </h3>
            ),
          )}
        </div>
        {steps.map((step, i) => {
          const closed = mounted && sel !== i;
          return (
            // A closed panel is inert (out of the accessibility tree and the
            // tab order) rather than display: none, so it can animate shut.
            <div
              key={step.title}
              role={mounted ? "tabpanel" : undefined}
              id={`vol-panel-${i}`}
              aria-labelledby={mounted ? `vol-tab-${i}` : undefined}
              tabIndex={mounted && !closed ? 0 : undefined}
              className={s.volPanel}
              style={{ gridRow: 2 * i + 2 }}
              data-closed={closed || undefined}
              inert={closed}
            >
              <div className={s.volClip}>
                <p>{step.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={s.volVisual} aria-hidden="true">
        <div className={s.volStage}>
          <div className={s.volShot} data-changes={changes % 2}>
            <div className={s.volCam} style={{ "--cs": CAMERA[sel].s, "--cy": CAMERA[sel].y, "--cmy": CAMERA[sel].m } as CSSProperties}>
              <div className={s.whoPhone}>
                <div className={s.volScreens}>
                  {steps.map((step, i) => (
                    <Image
                      key={step.screen.src}
                      src={step.screen.src}
                      alt=""
                      width={step.screen.w}
                      height={step.screen.h}
                      sizes="17rem"
                      data-on={sel === i || undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={s.volStickers} data-wobble={wobble || undefined}>
          <span className={`${s.whoSticker} ${s.volHours}`}>
            <Icon name="award" />
            {hours}
          </span>
        </div>
      </div>
    </>
  );
}

// "What do you need company for?": with a mouse, hovering a chip picks it, as
// a click would (the radio is checked and a bubbling change fires, so the form
// overlay, the place list and the hint scroll all follow). Leaving keeps the
// last choice; focus doesn't move; touch and keys work as native radios do.
export function HelpHover() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const off: (() => void)[] = [];
    document.querySelectorAll<HTMLInputElement>('input[name="help"]').forEach((input) => {
      const label = input.closest("label");
      if (!label) return;
      const on = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || input.checked) return;
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      label.addEventListener("pointerenter", on);
      off.push(() => label.removeEventListener("pointerenter", on));
    });
    return () => off.forEach((f) => f());
  }, []);
  return null;
}
