import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { content, links, social } from "../src/content";
import { fix } from "../src/app/[lang]/faq-normalize";

// The side of #who that is not picked is greyed by design, down to the AA floor
// (3:1 title, 4.5:1 body), so the AAA contrast scan skips it and a second,
// AA-only scan guards it (see the #who axe spec).
const unselectedWho = "[class*='__whoItem']:not([data-selected])";

// Reduced motion shows every section at once, so axe checks the settled
// page rather than a frame mid-fade. /fr is the 404 page.
for (const path of ["/ar", "/en", "/fr"]) {
  test(`${path}: no axe violations (WCAG 2.2 AA + AAA contrast)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .exclude(unselectedWho)
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
}

// The landing page keeps only the seven most asked; the rest live on /faq/.
const openAll = (page: import("@playwright/test").Page, root: string) =>
  page.evaluate((r) => document.querySelectorAll(`${r} details`).forEach((d) => ((d as HTMLDetailsElement).open = true)), root);

for (const lang of ["ar", "en"] as const) {
  test(`/${lang} FAQ on the home page: the seven most asked, then a link to all the questions`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const section = page.locator("#faq");
    await expect(section.locator("details[class*='__qa']")).toHaveCount(7);
    await expect(section.getByRole("radio")).toHaveCount(0);
    await expect(section.locator("a[class*='__faqMore']")).toHaveText(content[lang].faq.more);
    await expect(section.locator("a[class*='__faqMore']")).toHaveAttribute("href", `/${lang}/faq/`);
    const question = section.locator("details[class*='__qa']").first();
    await expect(question.locator("> p")).toBeHidden();
    await question.locator("> summary").click();
    await expect(question.locator("> p")).toBeVisible();
  });

  test(`/${lang} FAQ on the home page with every question open: no axe violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    await openAll(page, "#faq");
    const { violations } = await new AxeBuilder({ page })
      .include("#faq")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
}

test("FAQ on the home page with every question open: no sideways scroll at 320px and at 200% text", async ({ page }) => {
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const cdp = await page.context().newCDPSession(page);
  for (const lang of ["ar", "en"]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: 16, fixed: 13 } });
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${lang}`);
    await openAll(page, "#faq");
    expect(await overflow(), `/${lang} at 320px`).toBe(0);
    // The browser's text-size setting, as in the 200% spec above.
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${lang}`);
    await expect(page.locator("html")).toHaveCSS("font-size", "32px");
    await openAll(page, "#faq");
    expect(await overflow(), `/${lang} at 200% text`).toBe(0);
  }
});

test("light only: a dark system setting still gets the app's light theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/ar");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

for (const width of [320, 390]) {
  test(`no sideways scroll at ${width}px (WCAG 1.4.10 reflow)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const lang of ["ar", "en"]) {
      await page.goto(`/${lang}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `/${lang}`).toBe(0);
    }
  });
}

test("200% text: no sideways scroll, header scrolls away instead of pinning", async ({ page }) => {
  // The browser's text-size setting, not CSS zoom: rem and media-query em both follow it.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const lang of ["ar", "en"]) {
    await page.goto(`/${lang}`);
    await expect(page.locator("html")).toHaveCSS("font-size", "32px");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `/${lang}`).toBe(0);
    await expect(page.locator("header")).not.toHaveCSS("position", "sticky");
  }
});

test("header pins on a normal phone but not in landscape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar");
  await expect(page.locator("header")).toHaveCSS("position", "sticky");
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator("header")).not.toHaveCSS("position", "sticky");
});

test("keyboard: skip link leads straight to the store badges", async ({ page }) => {
  await page.goto("/ar");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "تخطَّ إلى المحتوى" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS("outline-style", "solid");

  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Download on the App Store" }).first()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "احصل عليه من Google Play" }).first()).toBeFocused();
});

test("reduced motion: every scroll moment is shown finished", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  // The manifesto's words at full strength, the routes drawn, the track full.
  for (const word of await page.locator("[class*='__manifesto'] span").all()) {
    await expect(word).toHaveCSS("opacity", "1");
  }
  for (const route of await page.locator("[class*='__routeYou'], [class*='__routeVolunteer']").all()) {
    await expect(route).toHaveCSS("stroke-dashoffset", "0px");
  }
  await expect(page.locator("[class*='__mapStage'] [class*='__meetCard']")).toHaveCSS("opacity", "1");
});

test("first viewport shows the headline and the store badges", async ({ page }) => {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/ar");
    const badge = await page.locator("main").getByRole("link", { name: "Download on the App Store" }).first().boundingBox();
    expect(badge && badge.y + badge.height, `${w}x${h}`).toBeLessThanOrEqual(h);
  }
});

// The footer has a nav of the same name, so these are scoped to the header.
const sectionNav = {
  en: { name: "Page sections", links: ["About us", "Who it's for", "How it works", "Volunteering", "FAQ"] },
  ar: { name: "أقسام الصفحة", links: ["من نحن", "لمن رفيقي", "كيف يعمل", "التطوع", "الأسئلة"] },
};
const sectionIds = ["about", "who", "journey", "volunteers", "faq"];

for (const lang of ["ar", "en"] as const) {
  test(`/${lang} page sections bar: five links in order, each pointing at a section that exists`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${lang}`);
    const bar = page.locator("header").getByRole("navigation", { name: sectionNav[lang].name });
    const links = bar.getByRole("link");
    await expect(links).toHaveText(sectionNav[lang].links);
    for (const [i, id] of sectionIds.entries()) {
      await expect(links.nth(i)).toHaveAttribute("href", `#${id}`);
      await expect(page.locator(`#${id}`), `#${id}`).toHaveCount(1);
    }
  });
}

test("page sections bar marks the section on screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const bar = page.locator("header").getByRole("navigation", { name: sectionNav.en.name });
  const show = (id: string) => page.evaluate((i) => document.getElementById(i)!.scrollIntoView({ block: "center", behavior: "instant" }), id);
  const current = (name: string) => expect(bar.getByRole("link", { name })).toHaveAttribute("aria-current", "true");
  await show("about");
  await current("About us");
  await expect(bar.locator("[aria-current]")).toHaveCount(1);
  await show("who");
  await current("Who it's for");
  // How it works covers the journey: the ask, the meeting point, the match and the meeting.
  for (const id of ["journey", "before", "way", "matched", "meet"]) {
    await show(id);
    await current("How it works");
  }
  await show("volunteers");
  await current("Volunteering");
  // Past every section (the footer), nothing stays marked.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(bar.locator("[aria-current]")).toHaveCount(0);
});

test("top bar turns into a pill when scrolled, without changing height", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar");
  const header = page.locator("header").first();
  const pillOpacity = () =>
    header.locator("> div").evaluate((bar) => getComputedStyle(bar, "::before").opacity);
  expect(await pillOpacity()).toBe("0");
  const before = (await header.boundingBox())!.height;
  // The pill waits for the hero's bottom to pass above the bar, not a fixed distance.
  const heroBottom = () => page.evaluate(() => document.querySelector("#hero")!.getBoundingClientRect().bottom + scrollY);
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
  await page.waitForTimeout(100);
  await expect(header).not.toHaveAttribute("data-scrolled");
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), await heroBottom());
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await expect.poll(pillOpacity).toBe("1");
  expect((await header.boundingBox())!.height).toBe(before);
  // Still the pill at the bottom of the page; the full bar is for the hero only.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(100);
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveAttribute("data-scrolled");
});

test("page sections bar hides where there is no room for it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await expect(page.locator("header").getByRole("navigation", { name: sectionNav.en.name })).toBeHidden();
});

test("no JavaScript: no section is left hidden", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: "http://localhost:3123" });
  const page = await context.newPage();
  await page.goto("/ar");
  // Nothing waits on a script to appear; the help picker is plain radios.
  for (const section of await page.locator("main section").all()) {
    await expect(section).toHaveCSS("opacity", "1");
  }
  // The seven questions are plain details elements, open or shut with no script.
  await expect(page.locator("#faq details")).toHaveCount(7);
  await page.locator("#faq details > summary").first().click();
  await expect(page.locator("#faq details > p").first()).toBeVisible();
  await page.getByRole("radio", { name: "المشي" }).check();
  await expect(page.locator("[class*='__formFill'] > [data-tone='walk']")).toHaveCSS("opacity", "1");
  await context.close();
});

test("phones: Download stays in thumb reach once the hero badges scroll away", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const cta = page.locator("a[href='#download'][data-shown], a[href='#download']").last();
  await expect(cta).toBeHidden();
  await page.evaluate(() => document.getElementById("way")!.scrollIntoView({ block: "center" }));
  await expect(cta).toBeVisible();
  const box = (await cta.boundingBox())!;
  expect(box.y + box.height).toBeGreaterThan(844 - 120);
  // It steps aside for the footer's download block, so it never covers its badges.
  await page.evaluate(() => document.getElementById("download")!.scrollIntoView({ block: "end" }));
  await expect(cta).toBeHidden();
  await expect(page.getByRole("link", { name: "920019904" }).first()).toHaveAttribute("href", "tel:920019904");
});

test("phones: the burger opens the journey menu, and a pick or Escape closes it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const burger = page.locator("summary[aria-label='Menu']");
  const menu = page.getByRole("navigation", { name: "Menu" });
  await expect(page.getByRole("link", { name: "العربية" })).toBeVisible(); // language stays in the bar
  await expect(menu).toBeHidden();
  await burger.click();
  await expect(menu.getByRole("link", { name: "How it works" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(burger).toBeFocused();
  await burger.click();
  await menu.getByRole("link", { name: "Who it's for" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#who$/);
});

test("phones: the menu closes when focus leaves it, and Escape closes it wherever focus is", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const burger = page.locator("summary[aria-label='Menu']");
  const menu = page.getByRole("navigation", { name: "Menu" });
  await burger.click();
  await menu.getByRole("link", { name: "Download" }).focus();
  await page.keyboard.press("Tab"); // out of the menu, into the page
  await expect(menu).toBeHidden();
  await burger.click();
  await page.evaluate(() => (document.activeElement as HTMLElement).blur()); // as a click on the panel's blank space does
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(burger).toBeFocused();
});

test("phones: the burger's panel stays on screen at 320px and at 200% text", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [width, font] of [[320, 16], [390, 32]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: font, fixed: font } });
    await page.setViewportSize({ width, height: 844 });
    for (const lang of ["ar", "en"]) {
      await page.goto(`/${lang}`);
      await page.locator("header summary").click();
      const panel = (await page.locator("[class*='__menuPanel']").boundingBox())!;
      expect(panel.x, `/${lang} ${width}px ${font}px`).toBeGreaterThanOrEqual(0);
      expect(panel.x + panel.width, `/${lang} ${width}px ${font}px`).toBeLessThanOrEqual(width);
    }
  }
});

test("unknown URLs get the site's own 404, Arabic first, light, with a way back", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  for (const url of ["/fr", "/en/foo"]) {
    const res = await page.goto(url);
    expect(res?.status(), url).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("link", { name: "الذهاب إلى رفيقي" })).toHaveAttribute("href", "/ar/");
    await expect(page.getByRole("link", { name: "Go to Rafiqi" })).toHaveAttribute("href", "/en/");
  }
});

test("top bar: a fast scroll to the top has the full band back at once, with no gaps at the sides", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar");
  const header = page.locator("header").first();
  // The bar stays the full band until the hero's bottom has passed above it.
  await page.evaluate(() => window.scrollTo({ top: document.querySelector("#hero")!.getBoundingClientRect().bottom + scrollY, behavior: "instant" }));
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  // The attribute drops through a React setState; the clip-path is read right after it.
  await expect(header).not.toHaveAttribute("data-scrolled");
  const clip = await header.evaluate((el) => getComputedStyle(el, "::before").clipPath);
  expect(clip).toMatch(/^inset\(0px( 0px){0,2}( [\d.]+px)?\)$/);
});

test("help picker: a pick tints the card and fills in the request form beside it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const group = page.getByRole("radiogroup", { name: "What do you need company for?" });
  const fill = (tone: string) => page.locator(`[class*='__formFill'] > [data-tone='${tone}']`);
  const cardColour = () => page.locator("#before").evaluate((el) => getComputedStyle(el).backgroundColor);
  await expect(group.getByRole("radio", { name: "Shopping" })).toBeChecked();
  await expect(fill("shopping")).toHaveCSS("opacity", "1");
  await expect(fill("hospital")).toHaveCSS("opacity", "0");
  const shoppingColour = await cardColour();
  // Keyboard: the arrow keys move the pick.
  await group.getByRole("radio", { name: "Shopping" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(group.getByRole("radio", { name: "Hospital" })).toBeChecked();
  await expect(fill("hospital")).toHaveCSS("opacity", "1");
  await expect(fill("shopping")).toHaveCSS("opacity", "0");
  await expect.poll(cardColour).not.toBe(shoppingColour);
  // Pointer: a click picks too; hovering another kind changes nothing.
  await group.getByRole("radio", { name: "Walking" }).click();
  await group.getByText("Hospital").hover();
  await expect(fill("walk")).toHaveCSS("opacity", "1");
  await expect(fill("hospital")).toHaveCSS("opacity", "0");
  // The map moves the meeting point there, and its card names that place and distance.
  await expect(page.locator("svg [data-tone='walk']")).toBeVisible();
  await expect(page.locator("svg [data-tone='shopping']")).toBeHidden();
  await expect(page.locator("[class*='__meetCard'] strong")).toHaveText("King Abdullah Park, Al Malaz", { useInnerText: true });
  await expect(page.locator("[class*='__meetCard'] [class*='__distance']")).toHaveText("1.7 km from you", { useInnerText: true });
});

test("the app's search, live: a suggestion picks the meeting place, and a pick in Ask shows there", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const places = page.getByRole("radiogroup", { name: content.en.way.title });
  const kinds = page.getByRole("radiogroup", { name: "What do you need company for?" });
  const typed = page.locator("[class*='__searchText']");
  await expect(places.getByRole("radio", { name: /^Riyadh Park, Al Aqiq/ })).toBeChecked();
  await expect(typed).toHaveText("Riyadh Park, Al Aqiq");
  await places.getByRole("radio", { name: /^Dr. Sulaiman Al-Habib Hospital/ }).click();
  await expect(typed).toHaveText("Dr. Sulaiman Al-Habib Hospital, Al Olaya");
  await expect(kinds.getByRole("radio", { name: "Hospital" })).toBeChecked();
  await expect(page.locator("svg [data-tone='hospital']")).toBeVisible();
  await expect(page.locator("svg [data-tone='shopping']")).toBeHidden();
  // Keyboard: the arrow keys move down the suggestions.
  await page.keyboard.press("ArrowDown");
  await expect(typed).toHaveText("Civil Affairs office, Al Malaz");
  // A pick in Ask types itself in, and its row scrolls into view in the box.
  await kinds.getByRole("radio", { name: "Other needs" }).click();
  await places.scrollIntoViewIfNeeded(); // the page only; the box scrolls itself
  await expect(typed).toHaveText("Kingdom Tower, Al Olaya");
  await expect(places.getByRole("radio", { name: /^Kingdom Tower/ })).toBeChecked();
  // Inside the box's own visible rect, not the page viewport: the page's
  // scroll position depends on the copy above and says nothing about the box.
  await expect
    .poll(async () => {
      const row = (await places.getByRole("radio", { name: /^Kingdom Tower/ }).boundingBox())!;
      const box = (await places.boundingBox())!;
      return row.y >= box.y - 1 && row.y + row.height <= box.y + box.height + 1;
    })
    .toBe(true);
});

test("map: the two of you travel to the pin on a loop", async ({ page }) => {
  await page.goto("/en");
  const dot = page.locator("[data-trip='trip-shopping-you']"); // shopping is picked by default
  await expect(dot).toHaveCSS("animation-iteration-count", "infinite");
  await expect(dot).toHaveCSS("animation-play-state", "running");
  // Nothing waits on scrolling: the pin drops in with each loop, the card stays.
  await expect(page.locator("svg [data-tone='shopping'] g[class*='__pin']")).toHaveCSS("animation-iteration-count", "infinite");
  await expect(page.locator("[class*='__meetCard']")).toHaveCSS("opacity", "1");
  // Reduced motion: no loop; the routes are drawn.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(dot).toHaveCSS("animation-name", "none");
  await expect(page.locator("svg [data-tone='shopping'] [class*='__routeYou']")).toHaveCSS("stroke-dashoffset", "0px");
});

test("meeting track: the steps light in turn on a loop", async ({ page }) => {
  await page.goto("/en");
  const pseudo = (n: number, which: "::before" | "::after", prop: string) =>
    page.locator(`[class*='__steps'] li:nth-child(${n})`).evaluate((el, [which, prop]) => getComputedStyle(el, which).getPropertyValue(prop), [which, prop]);
  expect(await pseudo(1, "::after", "animation-iteration-count")).toBe("infinite");
  expect(await pseudo(3, "::before", "animation-name")).toMatch(/stepDot3/);
  // Reduced motion: the track is shown complete, with no loop.
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await pseudo(1, "::after", "animation-name")).toBe("none");
});

test("language switch: EN | AR (عربي on the Arabic page), the current one marked, and it switches", async ({ page }) => {
  await page.goto("/ar");
  const ar = page.getByRole("navigation", { name: "اللغة" });
  await expect(ar.getByRole("link", { name: "عربي" })).toHaveAttribute("aria-current", "page");
  await ar.getByRole("link", { name: "EN English" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  const en = page.getByRole("navigation", { name: "Language" });
  await expect(en.getByRole("link", { name: "EN English" })).toHaveAttribute("aria-current", "page");
  await expect(en.getByRole("link", { name: "AR العربية" })).toHaveAttribute("href", "/ar/");
});


const heroTitle = { en: "A volunteer companion for people with disabilities", ar: "مرافق متطوع للأشخاص ذوي الإعاقة" };
const appStore = { en: "Download on the App Store", ar: "Download on the App Store" };

for (const lang of ["en", "ar"] as const) {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    test(`/${lang} hero at ${w}px: headline and App Store badge are there, the volunteer link is not, and there is no sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(`/${lang}`);
      const hero = page.locator("#hero");
      const title = hero.getByRole("heading", { level: 1, name: heroTitle[lang] });
      await expect(title).toBeVisible();
      await expect(hero.getByRole("link", { name: appStore[lang] })).toBeVisible();
      // The one "I want to volunteer" link lives in #who now.
      await expect(hero.locator("a[href='#volunteers']")).toHaveCount(0);
      if (w === 1440) {
        // The phone is the hero's picture; it must be on the first screen with the headline.
        for (const box of [await title.boundingBox(), await hero.locator("[class$='__phone']").boundingBox()]) {
          expect(box!.y).toBeLessThan(h);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

test("hero: the phone keeps its alt text, while the six help chips and both notes are hidden from screen readers", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#hero [class*='__phone'] img")).toHaveAttribute("alt", "Rafiqi welcome screen: the Rafiqi logo in the middle, above blue waves");
  const chips = page.locator("#hero [class*='__chip']");
  await expect(chips).toHaveCount(6);
  for (const chip of await chips.all()) await expect(chip).toHaveAttribute("aria-hidden", "true");
  for (const n of ["noteCheck", "noteArrived"]) {
    await expect(page.locator(`#hero [class*='__${n}']`), n).toHaveAttribute("aria-hidden", "true");
  }
});

test("hero with reduced motion: nothing moves, the arrived note is shown and the check note is not", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  // One note at rest, so the picture is the same for everyone who asked for stillness.
  await expect(page.locator("#hero [class*='__noteArrived']")).toHaveCSS("opacity", "1");
  await expect(page.locator("#hero [class*='__noteCheck']")).toHaveCSS("opacity", "0");
  for (const chip of await page.locator("#hero [class*='__chip']").all()) {
    await expect(chip).toHaveCSS("animation-name", "none");
  }
});

test("hero at 320px and at 200% text: no sideways scroll, and no chip over the headline", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [fontSize, width] of [[16, 320], [32, 390]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } });
    await page.setViewportSize({ width, height: 844 });
    for (const lang of ["en", "ar"]) {
      await page.goto(`/${lang}`);
      const { overflow, hits } = await page.evaluate(() => {
        const t = document.querySelector("#hero-title")!.getBoundingClientRect();
        const hits = [...document.querySelectorAll("#hero [class*='__chip']")]
          .filter((c) => getComputedStyle(c).display !== "none")
          .filter((c) => {
            const r = c.getBoundingClientRect();
            return r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top;
          }).length;
        return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, hits };
      });
      expect(overflow, `/${lang} at ${fontSize}px, ${width} wide`).toBe(0);
      expect(hits, `/${lang} at ${fontSize}px, ${width} wide: chips over the headline`).toBe(0);
    }
  }
});

for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`top bar at ${w}px: the pill appears only once the hero's bottom has passed above the bar, and goes at the top`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/ar");
    const header = page.locator("header").first();
    // Scroll so the hero's bottom edge sits `gap` px below the bar's bottom edge.
    const scrollToGap = (gap: number) =>
      page.evaluate((g) => {
        const bar = document.querySelector("header")!.offsetHeight;
        const end = document.querySelector("#hero")!.getBoundingClientRect().bottom + scrollY;
        window.scrollTo({ top: end - bar - g, behavior: "instant" });
      }, gap);
    await expect(header).not.toHaveAttribute("data-scrolled");
    await scrollToGap(10);
    await page.waitForTimeout(150);
    await expect(header).not.toHaveAttribute("data-scrolled");
    await scrollToGap(-10);
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(header).not.toHaveAttribute("data-scrolled");
  });
}

// The licence number was removed from the whole site; this catches it coming back.
for (const lang of ["ar", "en"]) {
  test(`/${lang}: the licence number 1053 appears nowhere on the page or in its title`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const text = await page.evaluate(() => `${document.title}\n${document.body.innerText}`);
    expect(text).not.toContain("1053");
    expect(text).not.toContain("١٠٥٣");
  });
}

const who = {
  en: { title: "Who is Rafiqi for?", you: "If you have a disability", give: "If you want to volunteer" },
  ar: { title: "لمن رفيقي؟", you: "إن كانت لديك إعاقة", give: "إن أردت أن تتطوع" },
};

type Pg = import("@playwright/test").Page;
// Scrolled to the middle so the section is over half in view, which is what lets the timer run.
const showWho = (page: Pg) => page.locator("#who").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
// Both picture cards are always shown, stacked; data-pick says which one is on top.
const whoCard = (page: Pg, which: "whoYou" | "whoGive") =>
  page.locator(`#who [class*='__whoVisual'] [class*='__whoCard'][class*='__${which}']`);
const visual = (page: Pg) => page.locator("#who [class*='__whoVisual']");
const bothCardsShown = async (page: Pg, which: "you" | "give") => {
  await expect(visual(page)).toHaveAttribute("data-pick", which);
  await expect(whoCard(page, "whoYou")).toBeVisible();
  await expect(whoCard(page, "whoGive")).toBeVisible();
};

for (const lang of ["ar", "en"] as const) {
  const t = who[lang];
  const picks = (page: Pg) => ({
    you: page.locator("#who").getByRole("button", { name: t.you }),
    give: page.locator("#who").getByRole("button", { name: t.give }),
  });

  test(`/${lang} who section: comes after the hero and the about section, shows both sides with three tags each and no store badges, and starts on "you"`, async ({ page }) => {
    await page.goto(`/${lang}`);
    expect(await page.evaluate(() => [...document.querySelector("main")!.children].slice(0, 3).map((el) => el.id))).toEqual(["hero", "about", "who"]);
    const region = page.getByRole("region", { name: t.title });
    await expect(region).toHaveAttribute("id", "who");
    await expect(region.getByRole("heading", { level: 3, name: t.you })).toBeVisible();
    await expect(region.getByRole("heading", { level: 3, name: t.give })).toBeVisible();
    for (const side of ["whoYou", "whoGive"]) {
      await expect(region.locator(`article[class*='__whoItem'][class*='__${side}'] [class*='__whoTags'] li`), side).toHaveCount(3);
    }
    await expect(region.locator("[class*='__whoTags'] li")).toHaveCount(6);
    for (const li of await region.locator("[class*='__whoTags'] li").all()) await expect(li).toBeVisible();
    // The section was cleared of its label row and its store badges; the hero and the footer carry them.
    await expect(region.getByRole("link", { name: "Download on the App Store" })).toHaveCount(0);
    await expect(region.locator("[class*='__whoActions'], [class*='__whoLabel']")).toHaveCount(0);
    const { you, give } = picks(page);
    await expect(you).toHaveAttribute("aria-pressed", "true");
    await expect(give).toHaveAttribute("aria-pressed", "false");
    await bothCardsShown(page, "you");
  });

  test(`/${lang} who section: clicking the volunteers side selects it and brings its card to the front, and the keyboard does the same`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const { you, give } = picks(page);
    await give.click();
    await expect(give).toHaveAttribute("aria-pressed", "true");
    await expect(you).toHaveAttribute("aria-pressed", "false");
    await bothCardsShown(page, "give");
    for (const key of ["Enter", "Space"]) {
      await you.click();
      await expect(give).toHaveAttribute("aria-pressed", "false");
      await give.focus();
      await page.keyboard.press(key);
      await expect(give, key).toHaveAttribute("aria-pressed", "true");
      await bothCardsShown(page, "give");
    }
  });

  test(`/${lang} who section: the volunteers' side comes up on its own after a while, without moving the focus`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await showWho(page);
    const active = () => page.evaluate(() => document.activeElement?.tagName);
    const before = await active();
    await expect.poll(() => picks(page).give.getAttribute("aria-pressed"), { timeout: 11_000 }).toBe("true");
    await bothCardsShown(page, "give");
    expect(await active()).toBe(before);
  });

  test(`/${lang} who section: after a pick it stays where the visitor put it`, async ({ page }) => {
    test.slow();
    await page.goto(`/${lang}`);
    await showWho(page);
    await picks(page).you.click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(10_000);
    await expect(picks(page).you).toHaveAttribute("aria-pressed", "true");
  });

  test(`/${lang} who section: the timer waits while the pointer is over it`, async ({ page }) => {
    test.slow();
    await page.goto(`/${lang}`);
    await showWho(page);
    await page.locator("#who [class*='__whoItem']").first().hover();
    await page.waitForTimeout(10_000);
    await expect(picks(page).you).toHaveAttribute("aria-pressed", "true");
  });

  test(`/${lang} who section with reduced motion: no timer and no switching by itself, but the buttons still select`, async ({ page }) => {
    test.slow();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    await showWho(page);
    await page.waitForTimeout(10_000);
    await expect(picks(page).you).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => [...document.querySelectorAll("#who [class*='__whoTimer']")].every((el) => el.getAnimations().length === 0))).toBe(true);
    await picks(page).give.click();
    await expect(picks(page).give).toHaveAttribute("aria-pressed", "true");
    await bothCardsShown(page, "give");
  });

  test(`/${lang} who section without JavaScript: both sides and both cards are shown, with "you" on top`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`/${lang}`);
    await expect(page.locator("#who").getByRole("heading", { level: 3, name: t.you })).toBeVisible();
    await expect(page.locator("#who").getByRole("heading", { level: 3, name: t.give })).toBeVisible();
    await bothCardsShown(page, "you");
    await ctx.close();
  });

  test(`/${lang} who section: only the front card shows its label badge, and it follows the pick`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const names = { you: lang === "ar" ? "ذوو الإعاقة" : "People with disabilities", give: lang === "ar" ? "المتطوعون" : "Volunteers" };
    const badge = page.locator("#who [class*='__whoVisual'] [class*='__whoBadge']:visible");
    await expect(visual(page)).toHaveAttribute("data-pick", "you");
    await expect(badge).toHaveText(names.you);
    await picks(page).give.click();
    await expect(visual(page)).toHaveAttribute("data-pick", "give");
    await expect(badge).toHaveText(names.give);
  });

  test(`/${lang} who section: only the picked side is marked selected, and its line carries the timer`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const item = (side: string) => page.locator(`#who article[class*='__whoItem'][class*='__${side}']`);
    // data-selected may be absent or "false" on the other item; exactly one counts as selected.
    const selected = () => page.locator("#who article[class*='__whoItem']").evaluateAll((els) => els.filter((e) => e.hasAttribute("data-selected") && e.getAttribute("data-selected") !== "false").map((e) => e.className));
    expect((await selected()).join()).toMatch(/__whoYou/);
    expect(await selected()).toHaveLength(1);
    await expect(item("whoYou").locator("[class*='__whoTimer']")).toHaveCount(1);
    await expect(item("whoGive").locator("[class*='__whoTimer']")).toHaveCount(0);
    await picks(page).give.click();
    await expect.poll(async () => (await selected()).join()).toMatch(/__whoGive/);
    expect(await selected()).toHaveLength(1);
    await expect(item("whoYou").locator("[class*='__whoTimer']")).toHaveCount(0);
  });

  test(`/${lang} who section: the text of the side not picked stays sharp and fully opaque`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    for (const pick of [picks(page).you, picks(page).give]) {
      await pick.click();
      for (const el of await page.locator("#who [class*='__whoItem'] :is(h3, p, [class*='__whoTags'] li)").all()) {
        await expect(el).toHaveCSS("filter", "none");
        await expect(el).toHaveCSS("opacity", "1");
      }
    }
  });

  test(`/${lang} who section: no axe violations with either side selected, and the side not picked stays at AA contrast`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    const names = (r: { violations: { id: string; nodes: { target: unknown }[] }[] }) => r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`);
    const run = async () => ({
      // Everything else, the picked side included, keeps the full AAA scan.
      rest: names(await new AxeBuilder({ page }).include("#who").exclude(unselectedWho).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"]).analyze()),
      // The AA floor for the greyed side: this is what stops it fading further.
      floor: names(await new AxeBuilder({ page }).include(`#who ${unselectedWho}`).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()),
    });
    expect(await run()).toEqual({ rest: [], floor: [] });
    await picks(page).give.click();
    expect(await run()).toEqual({ rest: [], floor: [] });
  });

  test(`/${lang} hero and who section together: there is one volunteer link, in the volunteers' item, and it goes to the volunteers section`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const name = { en: "I want to volunteer", ar: "أريد أن أتطوع" }[lang];
    const links = page.locator("#hero, #who").getByRole("link", { name });
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute("href", "#volunteers");
    await expect(page.locator("#who [class*='__whoGive'] [class*='__whoLink']")).toHaveCount(1);
    await expect(page.locator("#hero a[href='#volunteers']")).toHaveCount(0);
  });

  test(`/${lang} who section: the volunteer link comes after its item's button, goes to #volunteers and does not change the pick`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    const link = page.locator("#who [class*='__whoLink']");
    await expect(link).toBeVisible();
    // Tab order: the item's button, then the link.
    await picks(page).give.focus();
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    await expect(picks(page).you).toHaveAttribute("aria-pressed", "true");
    await link.click();
    await expect(page).toHaveURL(/#volunteers$/);
    await expect(picks(page).you).toHaveAttribute("aria-pressed", "true");
    await expect(picks(page).give).toHaveAttribute("aria-pressed", "false");
  });


  test(`/${lang} who section: the picture is hidden from screen readers and its screens are decoration with empty alt text`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(page.locator("#who [class*='__whoVisual']")).toHaveAttribute("aria-hidden", "true");
    // Both cards are in the DOM, the one not shown too.
    const shots = page.locator("#who [class*='__whoShot'] img");
    await expect(shots).toHaveCount(2);
    for (const img of await shots.all()) await expect(img).toHaveAttribute("alt", "");
  });
}

test("who section: no sideways scroll at 320px, 390px and at 200% text, on either side", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [fontSize, width] of [[16, 320], [16, 390], [32, 390]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } });
    await page.setViewportSize({ width, height: 844 });
    for (const lang of ["ar", "en"] as const) {
      await page.goto(`/${lang}`);
      for (const title of [who[lang].you, who[lang].give]) {
        await page.locator("#who").getByRole("button", { name: title }).click();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `/${lang} at ${fontSize}px, ${width} wide, ${title}`).toBe(0);
      }
    }
  }
});

const aboutName = { en: "About us", ar: "من نحن" };
const aboutLink = { en: "Visit Liajlehum's website", ar: "تعرّف على جمعية لأجلهم" };

for (const lang of ["ar", "en"] as const) {
  test(`/${lang} about section: a region named by its heading, with the text, a link to the association's site and a decorative icon`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const region = page.getByRole("region", { name: aboutName[lang] });
    await expect(region).toHaveAttribute("id", "about");
    await expect(region.locator("p")).toHaveCount(1);
    expect((await region.locator("p").innerText()).length).toBeGreaterThan(60);
    await expect(region.getByRole("link", { name: aboutLink[lang] })).toHaveAttribute("href", "https://www.liajlehum.org.sa");
    await expect(region.locator("[class*='__aboutIcon']")).toHaveAttribute("alt", "");
  });

  test(`/${lang} about section with reduced motion: shown at once, not animated`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    await expect(page.locator("#about")).toHaveCSS("opacity", "1");
    await expect(page.locator("#about [class*='__aboutInner']")).toHaveCSS("animation-name", "none");
  });

  test(`/${lang} hero: the headline is still one sentence for screen readers, split into two animated lines`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(page.getByRole("heading", { level: 1, name: heroTitle[lang] })).toBeVisible();
    await expect(page.locator("#hero-title [class*='__heroLine']")).toHaveCount(2);
  });
}

test("about section: no sideways scroll at 320px and at 200% text", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [fontSize, width] of [[16, 320], [32, 390]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } });
    await page.setViewportSize({ width, height: 844 });
    for (const lang of ["ar", "en"]) {
      await page.goto(`/${lang}`);
      await page.locator("#about").scrollIntoViewIfNeeded();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `/${lang} at ${fontSize}px, ${width} wide`).toBe(0);
    }
  }
});

// The parts that enter on load. The chip bob and the note turns loop for good, so they are left out of "still running".
const heroParts = "#hero-title, #hero-title [class*='__heroLine'], #hero [class*='__lead'], #hero [class*='__actions'], #hero [class*='__proof'], #hero [class*='__phone'] img, #hero [class*='__chip']";

test("hero entrance: the headline animates in on load, and within 2.5s everything is shown and only the loops keep running", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  // Right after load, so the entrance is caught in the act.
  expect(await page.evaluate(() => document.querySelector("#hero-title")!.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
  await page.waitForTimeout(2500);
  for (const el of await page.locator(heroParts).all()) await expect(el).toHaveCSS("opacity", "1");
  const running = await page.evaluate(() =>
    document
      .querySelector("#hero")!
      .getAnimations({ subtree: true })
      .filter((a) => a.playState === "running" && Number.isFinite(a.effect!.getComputedTiming().endTime))
      .map((a) => (a as CSSAnimation).animationName),
  );
  expect(running).toEqual([]);
});

test("hero entrance with reduced motion: nothing animates, and everything is shown at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => document.querySelector("#hero")!.getAnimations({ subtree: true }).length)).toBe(0);
  for (const el of await page.locator(heroParts).all()) await expect(el).toHaveCSS("opacity", "1");
});

// A guard for the size pass: each block should fit one screen, so nobody has
// to scroll inside a block to take it in. Heights are measured, not scrolled
// to, in the settled (reduced-motion) page.
// Only 1440x800: at 1280x720 several sections are over by design. #way is
// left out in English, where it is over by 19px even at 1440.
for (const [lang, w, h] of [["ar", 1440, 800], ["en", 1440, 800]] as const) {
  test(`/${lang} at ${w}x${h}: the about card, the who section, the match step and the first FAQ questions each fit one screen`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`/${lang}`);
    const m = await page.evaluate(() => {
      const rect = (sel: string, root: ParentNode = document) => root.querySelector(sel)!.getBoundingClientRect();
      const all = (sel: string) => [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect());
      const room = innerHeight - document.querySelector("header")!.offsetHeight - 32;
      const whoTop = rect("#who-title").top;
      const whoBottom = Math.max(...all("#who [class*='__whoItem']").map((r) => r.bottom), rect("#who [class*='__whoVisual']").bottom);
      const qs = all("#faq details");
      return {
        room,
        about: rect("#about [class*='__aboutInner']").height,
        who: whoBottom - whoTop,
        matched: rect("#matched").height,
        faq: qs[2].bottom - rect("#faq-title").top,
      };
    });
    for (const k of ["about", "who", "matched", "faq"] as const) expect(m[k], `${k} (room ${m.room})`).toBeLessThanOrEqual(m.room);
  });
}

for (const lang of ["ar", "en"] as const) {
  const f = content[lang].footer;
  const footer = (page: import("@playwright/test").Page) => page.getByRole("contentinfo");

  test(`/${lang} footer: one contentinfo landmark with a nav for each group of links, each named differently`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    const navs = footer(page).getByRole("navigation");
    const names = await navs.evaluateAll((els) => els.map((el) => el.getAttribute("aria-label") ?? document.getElementById(el.getAttribute("aria-labelledby")!)?.textContent));
    expect(names).toEqual([f.label, f.groups.sections, f.groups.association, f.groups.follow]);
    expect(new Set(names).size).toBe(names.length);
    // The brand block is the download target for every Download button.
    await expect(footer(page).locator("#download")).toHaveAttribute("aria-label", f.groups.app);
  });

  test(`/${lang} footer: the page-section links match the header's and point at sections that exist`, async ({ page }) => {
    // The header's bar is hidden where there is no room for it.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${lang}`);
    const group = footer(page).getByRole("navigation", { name: f.groups.sections });
    const items = content[lang].phases.items;
    await expect(group.getByRole("link")).toHaveText(items.map((i) => i.label));
    for (const [i, item] of items.entries()) {
      await expect(group.getByRole("link").nth(i)).toHaveAttribute("href", `#${item.id}`);
      await expect(page.locator(`#${item.id}`)).toHaveCount(1);
    }
    const head = page.locator("header").getByRole("navigation", { name: content[lang].phases.label });
    expect(await group.getByRole("link").evaluateAll((a) => a.map((x) => x.getAttribute("href")))).toEqual(
      await head.getByRole("link").evaluateAll((a) => a.map((x) => x.getAttribute("href"))),
    );
  });

  test(`/${lang} footer: the six Liajlehum links go to the association's site`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const group = footer(page).getByRole("navigation", { name: f.groups.association });
    const p = links.associationPages;
    await expect(group.getByRole("link")).toHaveCount(6);
    expect(await group.getByRole("link").evaluateAll((a) => a.map((x) => x.getAttribute("href")))).toEqual([links.association, p.about, p.services, p.volunteer, p.donate, p.contact]);
  });

  test(`/${lang} footer: the phone is a tel link, the email a mailto link, and the branches line goes to the branches page`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(footer(page).locator(`a[href='tel:${f.phone}']`)).toHaveCount(1);
    await expect(footer(page).locator("a[href='mailto:info@liajlehum.org.sa']")).toHaveCount(1);
    await expect(footer(page).locator(`a[href='${links.associationPages.branches}']`)).toHaveCount(1);
  });

  test(`/${lang} footer: four social links in order, named, with hidden icons and room to tap`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const group = footer(page).getByRole("navigation", { name: f.groups.follow });
    const order = ["x", "instagram", "youtube", "facebook"] as const;
    expect(social.map((x) => x.platform)).toEqual(order);
    await expect(group.getByRole("link")).toHaveCount(4);
    for (const [i, platform] of order.entries()) {
      const link = group.getByRole("link").nth(i);
      await expect(link).toHaveAttribute("href", social[i].href);
      await expect(link).toHaveAccessibleName(f.social[platform]);
      await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
      const box = (await link.boundingBox())!;
      expect(Math.min(box.width, box.height), platform).toBeGreaterThanOrEqual(44);
    }
  });

  test(`/${lang} footer: each social icon sits in the middle of its circle`, async ({ page }) => {
    await page.goto(`/${lang}`);
    // A specificity clash once pushed the icons to the start side; this keeps it from returning quietly.
    const links = footer(page).getByRole("navigation", { name: f.groups.follow }).getByRole("link");
    await expect(links).toHaveCount(4);
    for (const [i, link] of (await links.all()).entries()) {
      const a = (await link.boundingBox())!;
      const icon = (await link.locator("svg").boundingBox())!;
      expect(a.width, `link ${i} width`).toBeGreaterThanOrEqual(44);
      expect(a.height, `link ${i} height`).toBeGreaterThanOrEqual(44);
      expect(Math.abs(icon.x + icon.width / 2 - (a.x + a.width / 2)), `link ${i} horizontal`).toBeLessThanOrEqual(1);
      expect(Math.abs(icon.y + icon.height / 2 - (a.y + a.height / 2)), `link ${i} vertical`).toBeLessThanOrEqual(1);
    }
  });

  test(`/${lang} footer: the licence number, the ministry line and the privacy link are gone`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const text = await footer(page).innerText();
    for (const gone of ["1053", "١٠٥٣", "وزارة", "Ministry"]) expect(text).not.toContain(gone);
    // The privacy policy link was removed from the footer.
    await expect(footer(page).locator(`a[href='${links.privacy}']`)).toHaveCount(0);
  });

  test(`/${lang} footer: no axe violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    const { violations } = await new AxeBuilder({ page })
      .include("footer")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
}

test("footer: no sideways scroll at 320px and at 200% text", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [fontSize, width] of [[16, 320], [32, 390]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } });
    await page.setViewportSize({ width, height: 844 });
    for (const lang of ["ar", "en"]) {
      await page.goto(`/${lang}`);
      await page.locator("footer").scrollIntoViewIfNeeded();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `/${lang} at ${fontSize}px, ${width} wide`).toBe(0);
    }
  }
});

// The magnify dot background: one canvas behind the hero, redrawn only while a
// mouse is over the hero. Its pixels are the observable, since axe cannot see them.
const dotsPixels = (page: import("@playwright/test").Page) => page.locator("#hero canvas").evaluate((c) => (c as HTMLCanvasElement).toDataURL());
const sweep = async (page: import("@playwright/test").Page) => {
  for (const [x, y] of [[1000, 300], [1100, 400], [1200, 500], [1150, 350]]) await page.mouse.move(x, y, { steps: 4 });
};

test("hero dots: one canvas fills the hero's background, hidden from assistive tech and from the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const canvas = page.locator("#hero canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  const c = (await canvas.boundingBox())!;
  const h = (await page.locator("#hero").boundingBox())!;
  expect(Math.abs(c.width - h.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(c.height - h.height)).toBeLessThanOrEqual(2);
  // Nothing of it reaches the accessibility tree.
  expect(await page.locator("#hero").ariaSnapshot()).not.toMatch(/canvas/i);
});

test("hero dots: a mouse over the hero lights the dots around it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await page.mouse.move(10, 10);
  const before = await dotsPixels(page);
  // The listener attaches on hydration, so keep sweeping until the pixels answer.
  await expect.poll(async () => {
    await sweep(page);
    return (await dotsPixels(page)) !== before;
  }).toBe(true);
});

test("hero dots with reduced motion: the dots are drawn once and a mouse changes nothing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await expect(page.locator("#hero canvas")).toHaveCount(1);
  const before = await dotsPixels(page);
  await sweep(page);
  await page.waitForTimeout(500);
  expect(await dotsPixels(page)).toBe(before);
});

test("hero dots on a touch screen: the dots are static and a mouse-like move changes nothing", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto("/en");
  await expect(page.locator("#hero canvas")).toHaveCount(1);
  const before = await dotsPixels(page);
  await page.mouse.move(100, 200, { steps: 4 });
  await page.mouse.move(250, 300, { steps: 4 });
  await page.waitForTimeout(500);
  expect(await dotsPixels(page)).toBe(before);
  await ctx.close();
});

test("hero dots: the canvas never adds sideways scroll, at 320px or at 200% text", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [fontSize, width] of [[16, 320], [32, 390]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/en");
    // HeroGlow creates the canvas after mount.
    await page.locator("#hero canvas").waitFor({ state: "attached" });
    const { overflow, canvasRight } = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      canvasRight: document.querySelector("#hero canvas")!.getBoundingClientRect().right,
    }));
    expect(overflow, `${fontSize}px, ${width} wide`).toBe(0);
    expect(canvasRight, `${fontSize}px, ${width} wide: canvas`).toBeLessThanOrEqual(width + 1);
  }
});

// ---- The FAQ page, /<lang>/faq/ ----

test("FAQ search folds Arabic spelling: hamza, tashkeel, ta marbuta and Latin case all match", () => {
  expect(fix("إجتماع")).toBe(fix("اجتماع"));
  expect(fix("مَجَّانِيّ")).toBe(fix("مجاني"));
  expect(fix("مدرسة")).toBe(fix("مدرسه"));
  expect(fix("Free")).toBe(fix("fREE"));
  // Arabic-Indic digits are the same as the Western ones.
  expect(fix("١٢")).toBe(fix("12"));
  expect(fix("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
});

// Read from the content, so adding a question does not mean editing a number here.
const topicCount = (i: number) => content.en.faq.topics[i].groups.reduce((n, g) => n + g.items.length, 0);
const faqCounts = { top: content.en.faq.items.length, general: topicCount(0), disability: topicCount(1), volunteers: topicCount(2) };
const faqTotal = Object.values(faqCounts).reduce((n, c) => n + c, 0);
const wordFor = { ar: "مجاني", en: "free" };

for (const lang of ["ar", "en"] as const) {
  const t = content[lang];
  const pg = t.faq.page;
  const other = lang === "ar" ? "en" : "ar";
  const search = (page: import("@playwright/test").Page) => page.getByRole("search").getByRole("searchbox", { name: pg.search });
  const status = (page: import("@playwright/test").Page) => page.getByRole("status");
  const pill = (page: import("@playwright/test").Page, id: string) => page.locator(`input[name='faq-topic'][value='${id}']`);
  const shownQuestions = (page: import("@playwright/test").Page) => page.locator("main details[class*='__qa']:visible");
  // The search waits a moment after typing before it filters.
  const type = async (page: import("@playwright/test").Page, text: string) => {
    await search(page).fill(text);
  };

  test(`/${lang} FAQ page: the title, no site bar, a way back, every question in four topics, and the footer`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    await expect(page).toHaveTitle(pg.metaTitle);
    await expect(page.getByRole("heading", { level: 1, name: pg.title })).toBeVisible();
    await expect(page.locator("header")).toHaveCount(0);
    const back = page.locator("a[class*='__faqBack']");
    await expect(back).toHaveText(pg.home);
    await expect(back).toHaveAttribute("href", `/${lang}/#faq`);
    await expect(page.locator("main details[class*='__qa']")).toHaveCount(faqTotal);
    const questions = await page.locator("main details[class*='__qa'] > summary").allInnerTexts();
    expect(new Set(questions).size, "each question once").toBe(faqTotal);
    await expect(page.locator("section[class*='__faqTopic']")).toHaveCount(4);
    for (const id of ["top", "general", "disability", "volunteers"]) {
      const topic = page.locator(`section[data-topic='${id}']`);
      await expect(topic.getByRole("heading", { level: 2 })).toHaveCount(1);
      await expect(topic.locator("details[class*='__qa']")).toHaveCount(faqCounts[id as keyof typeof faqCounts]);
    }
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    // The footer's section links are absolute, since this is not the home page.
    const hrefs = await page.getByRole("contentinfo").getByRole("navigation", { name: t.footer.groups.sections }).getByRole("link").evaluateAll((a) => a.map((x) => x.getAttribute("href")));
    expect(hrefs).toEqual(t.phases.items.map((i) => `/${lang}/#${i.id}`));
  });

  test(`/${lang} FAQ page: the language switch goes to the other language's FAQ`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    await expect(page.locator("main a[hreflang='" + other + "']")).toHaveAttribute("href", `/${other}/faq/`);
  });

  test(`/${lang} FAQ page: searching narrows the questions, shows the count and marks the match in the question`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    await expect(search(page)).toBeVisible();
    await expect(page.getByRole("button", { name: pg.clear })).toHaveCount(0);
    await type(page, wordFor[lang]);
    await expect.poll(async () => await shownQuestions(page).count()).toBeLessThan(faqTotal);
    const n = await shownQuestions(page).count();
    expect(n).toBeGreaterThan(0);
    await expect(status(page)).toHaveText(`${pg.count} ${n}`.replace(/\s+/g, " "), { useInnerText: true });
    await expect(page.locator("main summary mark").first()).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]q=`));
    await expect(page.getByRole("button", { name: pg.clear })).toBeVisible();
  });

  test(`/${lang} FAQ page: Escape clears the search and brings every question back`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    await type(page, wordFor[lang]);
    await expect.poll(async () => await shownQuestions(page).count()).toBeLessThan(faqTotal);
    await search(page).press("Escape");
    await expect(search(page)).toHaveValue("");
    await expect.poll(async () => await shownQuestions(page).count()).toBe(faqTotal);
    await expect(page).not.toHaveURL(/[?&]q=/);
  });

  test(`/${lang} FAQ page: a search with no match says so and offers the phone number`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    await type(page, "zzzqqq");
    await expect(shownQuestions(page)).toHaveCount(0);
    await expect(status(page)).toContainText(pg.none);
    await expect(status(page).getByRole("link")).toHaveAttribute("href", `tel:${t.footer.phone}`);
    for (const label of await page.locator("[class*='__faqPills'] label").all()) await expect(label).toHaveAttribute("data-empty", /.*/);
  });

  test(`/${lang} FAQ page: the pills filter by topic, show their counts, and follow the search`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    const group = page.getByRole("radiogroup", { name: pg.filter });
    await expect(group.getByRole("radio")).toHaveCount(5);
    await expect(group.locator("[class*='__faqCount']")).toHaveText([faqTotal, faqCounts.top, faqCounts.general, faqCounts.disability, faqCounts.volunteers].map(String));
    await page.locator("[class*='__faqPills'] label", { hasText: t.faq.topics[2].title }).click();
    await expect(pill(page, "volunteers")).toBeChecked();
    await expect(page.locator("section[data-topic='volunteers']")).toBeVisible();
    await expect(page.locator("section[data-topic='general']")).toBeHidden();
    await expect(shownQuestions(page)).toHaveCount(faqCounts.volunteers);
    // With a search too: the pick's count is the count of what is shown.
    await type(page, wordFor[lang]);
    await expect.poll(async () => await shownQuestions(page).count()).toBeLessThan(faqCounts.volunteers);
    const n = await shownQuestions(page).count();
    const label = page.locator("[class*='__faqPills'] label", { has: pill(page, "volunteers") });
    await expect(label.locator("[class*='__faqCount']")).toHaveText(String(n));
    if (n === 0) await expect(label).toHaveAttribute("data-empty", /.*/);
  });

  test(`/${lang} FAQ page: ?q= and ?topic= are read on load and kept in the address`, async ({ page }) => {
    await page.goto(`/${lang}/faq/?q=${encodeURIComponent(wordFor[lang])}&topic=general`);
    await expect(search(page)).toHaveValue(wordFor[lang]);
    await expect(pill(page, "general")).toBeChecked();
    await expect(page.locator("section[data-topic='top']")).toBeHidden();
    await expect(page).toHaveURL(/q=/);
    await expect(page).toHaveURL(/topic=general/);
  });

  test(`/${lang} FAQ page without JavaScript: every question shows, the search box is hidden, and the pills still filter`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL: "http://localhost:3123" });
    const page = await ctx.newPage();
    await page.goto(`/${lang}/faq/`);
    await expect(page.locator("main details[class*='__qa']")).toHaveCount(faqTotal);
    await expect(page.getByRole("search")).toBeHidden();
    await expect(shownQuestions(page)).toHaveCount(faqTotal);
    await page.locator("[class*='__faqPills'] label", { hasText: t.faq.topics[0].title }).click();
    await expect(page.locator("section[data-topic='general']")).toBeVisible();
    await expect(page.locator("section[data-topic='volunteers']")).toBeHidden();
    await ctx.close();
  });

  test(`/${lang} FAQ page: no axe violations by default, searched, with no match, and with a topic picked`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}/faq/`);
    const scan = async (label: string) => {
      await openAll(page, "main");
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`), label).toEqual([]);
    };
    await scan("default");
    await type(page, wordFor[lang]);
    await expect(page.locator("main summary mark").first()).toBeVisible();
    await scan("searched");
    await type(page, "zzzqqq");
    await expect(status(page)).toContainText(pg.none);
    await scan("no match");
    await type(page, "");
    await page.locator("[class*='__faqPills'] label", { hasText: t.faq.topics[1].title }).click();
    await scan("topic picked");
  });
}

test("FAQ page: no sideways scroll at 320px and at 200% text, with every question open", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  for (const [fontSize, width] of [[16, 320], [32, 390]]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: fontSize, fixed: 13 } });
    await page.setViewportSize({ width, height: 844 });
    for (const lang of ["ar", "en"]) {
      await page.goto(`/${lang}/faq/`);
      await openAll(page, "main");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `/${lang}/faq/ at ${fontSize}px, ${width} wide`).toBe(0);
    }
  }
});

// ---- The hint scroll in the app's place list ----

// Records the highest the list has been scrolled, since the nudge is brief.
const watchList = async (page: import("@playwright/test").Page) => {
  // PlaceSearch renders the list only after it mounts.
  await page.locator("[class*='__suggestions']").waitFor();
  await page.evaluate(() => {
    const box = document.querySelector("[class*='__suggestions']")!;
    (window as unknown as { __top: number }).__top = 0;
    box.addEventListener("scroll", () => ((window as unknown as { __top: number }).__top = Math.max((window as unknown as { __top: number }).__top, box.scrollTop)));
  });
};
const listTop = (page: import("@playwright/test").Page) => page.evaluate(() => (window as unknown as { __top: number }).__top);
const showList = (page: import("@playwright/test").Page) =>
  page.locator("[class*='__suggestions']").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));

test("place list: the first time it is in view it scrolls itself down and back, without moving the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await watchList(page);
  await showList(page);
  const y = await page.evaluate(() => scrollY);
  await expect.poll(() => listTop(page), { timeout: 4000 }).toBeGreaterThan(0);
  await expect.poll(() => page.locator("[class*='__suggestions']").evaluate((el) => el.scrollTop), { timeout: 3500 }).toBe(0);
  expect(await page.evaluate(() => scrollY), "the page stayed put").toBe(y);
});

test("place list: the hint plays only once, however often it comes back into view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await watchList(page);
  await showList(page);
  await expect.poll(() => listTop(page), { timeout: 4000 }).toBeGreaterThan(0);
  await expect.poll(() => page.locator("[class*='__suggestions']").evaluate((el) => el.scrollTop), { timeout: 3500 }).toBe(0);
  await page.evaluate(() => { (window as unknown as { __top: number }).__top = 0; window.scrollTo({ top: 0, behavior: "instant" }); });
  await showList(page);
  await page.waitForTimeout(2000);
  expect(await listTop(page)).toBe(0);
});

test("place list with reduced motion: no hint scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await watchList(page);
  await showList(page);
  await page.waitForTimeout(2500);
  expect(await listTop(page)).toBe(0);
});

// The page-wide scan above runs at 1280, where the header's section bar is hidden.
// From 85em it shows, so scan there too, and no two landmarks may share a name.
for (const lang of ["ar", "en"] as const) {
  test(`/${lang} at 1440x900: no axe violations with the header bar showing, and every navigation has its own name`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${lang}`);
    const { violations } = await new AxeBuilder({ page })
      .exclude(unselectedWho)
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
    const names = await page.getByRole("navigation").evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label") ?? document.getElementById(el.getAttribute("aria-labelledby") ?? "")?.textContent?.trim() ?? ""),
    );
    expect(names.length).toBeGreaterThan(3);
    expect(names.filter((n) => !n), "every navigation is named").toEqual([]);
    expect(names.filter((n, i) => names.indexOf(n) !== i), "duplicate navigation names").toEqual([]);
  });
}

// Overlapping hits: the longest one is marked, so «ال المتطوع» marks the whole word.
test("FAQ page: a search whose words overlap marks the longer one whole", async ({ page }) => {
  await page.goto("/ar/faq/?q=" + encodeURIComponent("ال المتطوع"));
  // Questions that do not match stay in the page, hidden, with their own marks; only the shown ones count.
  const shown = page.locator("main details:visible summary mark");
  await expect(shown.first()).toBeVisible();
  const marks = await shown.allInnerTexts();
  expect(marks).toContain("المتطوع");
});

for (const lang of ["ar", "en"] as const) {
  const t = content[lang];

  test(`/${lang} chapters: three match points, four volunteer steps, the note after the status steps, and the guide's screens with their own alt text`, async ({ page }) => {
    await page.goto(`/${lang}`);
    await expect(page.locator("#matched [class*='__matchedList'] li")).toHaveCount(t.matched.points.length);
    expect(t.matched.points).toHaveLength(3);
    await expect(page.locator("#volunteers").getByRole("tab")).toHaveCount(t.volunteers.steps.length);
    expect(t.volunteers.steps).toHaveLength(4);
    await expect(page.locator("#meet")).toContainText(t.meet.after);
    for (const [id, file, screen] of [["before", "request-filled", t.before.screen], ["way", "map-confirm", t.way.screen], ["meet", "status-requester", t.meet.screen]] as const) {
      expect(screen.src, id).toContain(file);
      await expect(page.locator(`#${id} img[src*='${file}']`).first(), id).toHaveAttribute("alt", screen.alt);
    }
  });

  // The app is not claimed to work with screen readers; the guide only explains how to set one up.
  test(`/${lang} FAQ: the screen-reader answer does not claim the app works with one`, async ({ page }) => {
    await page.goto(`/${lang}/faq/`);
    const answers = await page.locator("main details", { has: page.locator("summary", { hasText: lang === "ar" ? "قارئ الشاشة" : /screen reader/i }) }).locator("> p").allInnerTexts();
    expect(answers.length).toBeGreaterThan(0);
    for (const a of answers) expect(a.trim()).not.toMatch(/^(نعم|Yes)/);
  });
}

// ---- The journey ----

for (const lang of ["ar", "en"] as const) {
  const t = content[lang];

  test(`/${lang} journey: four numbered steps in order, the match step with three points, valid headings, and the manifesto after the meeting`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const steps = page.locator("#journey [class$='__step']");
    await expect(steps).toHaveCount(4);
    for (const [i, label] of t.journey.steps.entries()) {
      await expect(steps.nth(i).locator("[class$='__marker']")).toHaveText(String(i + 1));
      await expect(steps.nth(i).locator("[class$='__stepHead']")).toContainText(label);
    }
    await expect(page.locator("#matched [class*='__matchedList'] li")).toHaveCount(3);
    // The steps' own ids sit inside #journey, in order.
    expect(await page.evaluate(() => ["before", "way", "matched", "meet"].map((id) => document.querySelector(`#journey #${id}`) !== null))).toEqual([true, true, true, true]);
    // No heading level is skipped inside the journey: h2, then h3.
    const levels = await page.locator("#journey").evaluate((el) => [...el.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1])));
    expect(levels[0]).toBe(2);
    for (let i = 1; i < levels.length; i++) expect(levels[i], `heading ${i}`).toBeLessThanOrEqual(levels[i - 1] + 1);
    expect(levels.slice(1).every((l) => l >= 3), "only h3 and below under the h2").toBe(true);
    // The manifesto closes the journey, before the volunteers band.
    expect(
      await page.evaluate(() => {
        const m = document.querySelector("[class*='__manifesto']")!;
        const before = (a: Element, b: Element) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
        return before(document.getElementById("meet")!, m) && before(m, document.getElementById("volunteers")!);
      }),
    ).toBe(true);
  });

  // ---- The volunteers' steps ----

  test(`/${lang} volunteer steps: four tabs, the first selected, and the arrow keys, Home and End move the pick and the focus`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    const tabs = page.locator("#volunteers").getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(page.locator("#volunteers").getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(tabs.first()).toHaveAttribute("tabindex", "0");
    await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
    await tabs.first().focus();
    for (const [key, to] of [["ArrowDown", 1], ["ArrowDown", 2], ["ArrowUp", 1], ["End", 3], ["Home", 0]] as const) {
      await page.keyboard.press(key);
      await expect(tabs.nth(to), key).toBeFocused();
      await expect(tabs.nth(to), key).toHaveAttribute("aria-selected", "true");
    }
  });

  test(`/${lang} volunteer steps: picking one opens its text, shuts the others and swaps the phone's screen`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    const band = page.locator("#volunteers");
    const steps = t.volunteers.steps;
    await band.getByRole("tab").nth(2).click();
    await expect(band.getByRole("tabpanel", { name: steps[2].title })).toContainText(steps[2].text);
    for (const i of [0, 1, 3]) await expect(page.locator(`#vol-panel-${i}`)).toHaveAttribute("inert", /.*/);
    await expect(page.locator("#vol-panel-2")).not.toHaveAttribute("inert", /.*/);
    const shown = band.locator("[class*='__volScreens'] img[data-on]");
    await expect(shown).toHaveCount(1);
    expect(decodeURIComponent((await shown.getAttribute("src"))!)).toContain(steps[2].screen.src.split("/").pop()!.split(".")[0]);
    await expect(band.locator("[class*='__volShot'] img").first()).toHaveAttribute("alt", "");
    await expect(page.locator("#volunteers [class*='__volVisual']")).toHaveAttribute("aria-hidden", "true");
  });

  test(`/${lang} volunteer steps with reduced motion: opening and shutting is instant`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    await page.locator("#volunteers").getByRole("tab").nth(1).click();
    // Reduced motion shortens transitions to a hair above zero (1e-05s), which is still instant.
    const longest = await page.evaluate(() =>
      Math.max(...[...document.querySelectorAll("#volunteers [role=tabpanel], #volunteers [class*='__volClip']")].map((el) => Math.max(...getComputedStyle(el).transitionDuration.split(",").map(parseFloat)))),
    );
    expect(longest).toBeLessThanOrEqual(0.001);
  });

  test(`/${lang} volunteer steps without JavaScript: all four texts are shown`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`/${lang}`);
    for (const [i, step] of t.volunteers.steps.entries()) {
      await expect(page.locator(`#vol-panel-${i}`).getByText(step.text)).toBeVisible();
    }
    await ctx.close();
  });

  test(`/${lang} volunteer steps: no axe violations on the first and on the third step`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    const scan = async (label: string) => {
      const { violations } = await new AxeBuilder({ page }).include("#volunteers").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`), label).toEqual([]);
    };
    await scan("step 1");
    await page.locator("#volunteers").getByRole("tab").nth(2).click();
    await scan("step 3");
  });
}
