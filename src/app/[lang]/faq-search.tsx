"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";
import { fix, normalizeAr } from "./faq-normalize";
import s from "./page.module.css";

type Item = { q: string; a: string };
type Group = { title: string; items: Item[] };
type Topic = { id: string; title: string; groups: Group[] };

// The question with the words that matched marked.
function Marked({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const { norm, map } = normalizeAr(text);
  const hits: [number, number][] = [];
  for (const w of words) {
    let from = 0;
    for (let at = norm.indexOf(w, from); at !== -1; at = norm.indexOf(w, from)) {
      hits.push([map[at], map[at + w.length - 1] + 1]);
      from = at + w.length;
    }
  }
  if (!hits.length) return <>{text}</>;
  hits.sort((x, y) => x[0] - y[0] || y[1] - x[1]); // by start, the longer first
  const parts: ReactNode[] = [];
  let pos = 0;
  for (const [x, y] of hits) {
    if (x < pos) continue;
    if (x > pos) parts.push(text.slice(pos, x));
    parts.push(<mark key={x}>{text.slice(x, y)}</mark>);
    pos = y;
  }
  if (pos < text.length) parts.push(text.slice(pos));
  return <>{parts}</>;
}

// Every question, by category, with a search that filters as you type (after
// a short pause), matching the question and its answer. Without JavaScript the
// search box stays hidden and all the questions show. The query is kept in
// the address (?q=), and Escape clears it.
export function FaqSearch({
  topics,
  text,
  help,
}: {
  topics: Topic[];
  text: { search: string; placeholder: string; count: string; none: string; clear: string; all: string; filter: string };
  help: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    setValue(q);
    setQuery(q);
    const asked = params.get("topic");
    if (asked && topics.some((x) => x.id === asked)) setTopic(asked);
    setMounted(true);
  }, [topics]);

  // A short pause after typing, then the list, the address and the count update.
  useEffect(() => {
    if (!mounted) return;
    const id = window.setTimeout(() => {
      setQuery(value);
      const url = new URL(window.location.href);
      if (value.trim()) url.searchParams.set("q", value.trim());
      else url.searchParams.delete("q");
      if (topic !== "all") url.searchParams.set("topic", topic);
      else url.searchParams.delete("topic");
      window.history.replaceState(null, "", url);
    }, 120);
    return () => clearTimeout(id);
  }, [value, topic, mounted]);

  const index = useMemo(
    () =>
      topics.map((topic) => ({
        ...topic,
        groups: topic.groups.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, hay: fix(it.q + " " + it.a) })) })),
      })),
    [topics],
  );
  const words = useMemo(() => fix(query).split(/\s+/).filter(Boolean), [query]);
  const filtering = words.length > 0;
  const visible = index.map((tp) => ({
    ...tp,
    groups: tp.groups.map((g) => ({
      ...g,
      items: g.items.map((it) => ({ ...it, match: !filtering || words.every((w) => it.hay.includes(w)) })),
    })),
  }));
  // The count on each pill follows the search; the one shown is the pick's.
  const counts = Object.fromEntries(visible.map((tp) => [tp.id, tp.groups.reduce((n, g) => n + g.items.filter((it) => it.match).length, 0)]));
  const all = Object.values(counts).reduce((n, c) => n + c, 0);
  const total = topic === "all" ? all : counts[topic] ?? 0;
  const narrowed = filtering || topic !== "all";

  return (
    <>
      <div className={s.faqSearch} hidden={!mounted} role="search">
        <label htmlFor="faq-q">{text.search}</label>
        <div className={s.faqField}>
          <input
            ref={input}
            id="faq-q"
            type="search"
            value={value}
            placeholder={text.placeholder}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setValue("");
            }}
          />
          {value && (
            <button
              type="button"
              className={s.faqClear}
              aria-label={text.clear}
              onClick={() => {
                setValue("");
                input.current?.focus();
              }}
            >
              <Icon name="close" />
            </button>
          )}
        </div>
        <div className={s.faqStatus} role="status">
          {narrowed && (total > 0 ? `${text.count} ${total}` : help)}
        </div>
      </div>
      {/* Native radios, so the filter works without JavaScript too (the CSS
          hides the categories not picked); the counts follow the search. */}
      <div className={s.faqPills} role="radiogroup" aria-label={text.filter}>
        {[{ id: "all", title: text.all }, ...topics.map((x) => ({ id: x.id, title: x.title }))].map((pill) => {
          const n = pill.id === "all" ? all : counts[pill.id];
          return (
            <label key={pill.id} data-empty={n === 0 || undefined}>
              <input type="radio" name="faq-topic" value={pill.id} checked={topic === pill.id} onChange={() => setTopic(pill.id)} />
              {pill.title}
              <span className={s.faqCount}>{n}</span>
            </label>
          );
        })}
      </div>
      {visible.map((topicBlock) => {
        const any = topicBlock.groups.some((g) => g.items.some((it) => it.match));
        return (
          <section key={topicBlock.id} id={`faq-${topicBlock.id}`} data-topic={topicBlock.id} className={s.faqTopic} aria-labelledby={`faq-${topicBlock.id}-title`} hidden={!any}>
            <h2 id={`faq-${topicBlock.id}-title`}>{topicBlock.title}</h2>
            {topicBlock.groups.map((group) => {
              const some = group.items.some((it) => it.match);
              return (
                <div key={group.title} className={s.faqGroup} hidden={!some}>
                  {group.title && <h3>{group.title}</h3>}
                  {group.items.map((it) => (
                    <details key={it.q} className={s.qa} hidden={!it.match}>
                      <summary>
                        {/* One box: the summary is a flex row, and each loose piece would be its own item. */}
                        <span>
                          <Marked text={it.q} words={words} />
                        </span>
                      </summary>
                      <p>{it.a}</p>
                    </details>
                  ))}
                </div>
              );
            })}
          </section>
        );
      })}
    </>
  );
}
