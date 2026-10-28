import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Reduced motion shows every section at once, so axe checks the settled
// page rather than a frame mid-fade. /fr is the 404 page.
for (const path of ["/ar", "/en", "/fr"]) {
  test(`${path}: no axe violations (WCAG 2.2 AA + AAA contrast)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
}

const faq = "section[aria-labelledby='faq-title']";
// Pill i: 0 is "Most asked", then the three topics. Counts are what the content has.
const panels = [
  { key: "top", groups: 0, questions: 7 },
  { key: "0", groups: 3, questions: 6 },
  { key: "1", groups: 3, questions: 15 },
  { key: "2", groups: 3, questions: 13 },
];
const faqPills = (page: import("@playwright/test").Page) =>
  page.getByRole("radiogroup", { name: /Common questions|أسئلة شائعة/ }).getByRole("radio");
const openPanelQuestions = (page: import("@playwright/test").Page, key: string) =>
  page.evaluate(
    ([sel, key]) => document.querySelectorAll(`${sel} [data-panel='${key}'] details`).forEach((d) => ((d as HTMLDetailsElement).open = true)),
    [faq, key],
  );

for (const lang of ["ar", "en"] as const) {
  test(`/${lang} FAQ: the most asked come first, and each pill swaps in its own questions`, async ({ page }) => {
    await page.goto(`/${lang}`);
    const pills = faqPills(page);
    await expect(pills).toHaveCount(4);
    await expect(pills.first()).toBeChecked();
    await expect(pills.first()).toHaveAccessibleName(lang === "ar" ? "الأكثر سؤالًا" : "Most asked");
    const panel = (key: string) => page.locator(`${faq} [data-panel='${key}']`);
    for (const [i, { key, groups, questions }] of panels.entries()) {
      await pills.nth(i).click();
      await expect(pills.nth(i)).toBeChecked();
      for (const other of panels) {
        if (other.key === key) await expect(panel(key)).toBeVisible();
        else await expect(panel(other.key)).toBeHidden();
      }
      await expect(panel(key).locator("[class*='__qa']")).toHaveCount(questions);
      await expect(panel(key).locator("h3")).toHaveCount(groups);
    }
    // Arrow keys move the pick, as in any radio group.
    await pills.first().click();
    await pills.first().press("ArrowDown");
    await expect(pills.nth(1)).toBeChecked();
    await expect(panel("0")).toBeVisible();
    await expect(panel("top")).toBeHidden();
    const question = panel("0").locator("[class*='__qa']").first();
    await expect(question.locator("> p")).toBeHidden();
    await question.locator("> summary").click();
    await expect(question.locator("> p")).toBeVisible();
  });

  test(`/${lang} FAQ with every question of each pill open: no axe violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${lang}`);
    for (const [i, { key }] of panels.entries()) {
      await faqPills(page).nth(i).click();
      await openPanelQuestions(page, key);
      const { violations } = await new AxeBuilder({ page })
        .include(faq)
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"])
        .analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`), `pill ${key}`).toEqual([]);
    }
  });
}

test("FAQ with every question of each pill open: no sideways scroll at 320px and at 200% text", async ({ page }) => {
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const cdp = await page.context().newCDPSession(page);
  const checkEachPill = async (label: string) => {
    for (const [i, { key }] of panels.entries()) {
      await faqPills(page).nth(i).click();
      await openPanelQuestions(page, key);
      expect(await overflow(), `${label}, pill ${key}`).toBe(0);
    }
  };
  for (const lang of ["ar", "en"]) {
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: 16, fixed: 13 } });
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${lang}`);
    await checkEachPill(`/${lang} at 320px`);
    // The browser's text-size setting, as in the 200% spec above.
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${lang}`);
    await expect(page.locator("html")).toHaveCSS("font-size", "32px");
    await checkEachPill(`/${lang} at 200% text`);
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

test("journey bar marks the phase on screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const bar = page.getByRole("navigation", { name: "Parts of the journey" });
  await page.locator("#meet").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("meet")!.scrollIntoView({ block: "center" }));
  await expect(bar.getByRole("link", { name: "At the meeting" })).toHaveAttribute("aria-current", "true");
  await expect(bar.locator("[aria-current]")).toHaveCount(1);
  // "Who will go with you?" counts as the volunteer phase.
  await page.evaluate(() => document.getElementById("trust")!.scrollIntoView({ block: "center" }));
  await expect(bar.getByRole("link", { name: "Volunteer" })).toHaveAttribute("aria-current", "true");
  // Past every phase (the FAQ, the footer), nothing stays marked.
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
  await page.mouse.wheel(0, 600);
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

test("journey bar hides where there is no room for it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await expect(page.getByRole("navigation", { name: "Parts of the journey" })).toBeHidden();
});

test("no JavaScript: no section is left hidden", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: "http://localhost:3123" });
  const page = await context.newPage();
  await page.goto("/ar");
  // Nothing waits on a script to appear; the help picker is plain radios.
  for (const section of await page.locator("main section").all()) {
    await expect(section).toHaveCSS("opacity", "1");
  }
  // The FAQ pills are plain radios: picking one swaps the panel, no script.
  await expect(page.locator(`${faq} input[name='faq'][value='top']`)).toBeChecked();
  await expect(page.locator(`${faq} [data-panel='top']`)).toBeVisible();
  await page.locator(`${faq} input[name='faq'][value='0']`).check();
  await expect(page.locator(`${faq} [data-panel='0']`)).toBeVisible();
  await expect(page.locator(`${faq} [data-panel='top']`)).toBeHidden();
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
  // It steps aside for the download section, so it never covers its badges.
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
  await expect(menu.getByRole("link", { name: "At the meeting" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(burger).toBeFocused();
  await burger.click();
  await menu.getByRole("link", { name: "On the way" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#way$/);
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
    await expect(page.getByRole("link", { name: "الذهاب إلى رفيقي" })).toHaveAttribute("href", "/ar");
    await expect(page.getByRole("link", { name: "Go to Rafiqi" })).toHaveAttribute("href", "/en");
  }
});

test("hero story: the phone rises once the statement has faded, then the notifications arrive one by one", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const phone = page.locator("[class$='__phone']");
  const phoneTop = async () => (await phone.boundingBox())!.y;
  const note = (i: number) => page.locator(`[class*='__note${i}']`);
  await expect(page.locator("[class*='__stage']")).toHaveCSS("position", "sticky");
  expect(await phoneTop()).toBeGreaterThanOrEqual(900);
  await expect(note(0)).toHaveCSS("opacity", "0");
  // The statement fades where it stands instead of scrolling up; the phone
  // waits below the screen until it has gone.
  const text = page.locator("[class*='__heroText']");
  const y0 = (await text.boundingBox())!.y;
  await page.evaluate(() => window.scrollTo({ top: 150, behavior: "instant" }));
  await expect.poll(async () => Math.abs((await text.boundingBox())!.y - y0)).toBeLessThan(2);
  expect(Number(await text.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.8);
  expect(await phoneTop()).toBeGreaterThanOrEqual(900);
  // f = how far through the pinned stretch the page has scrolled.
  const scrollTo = (f: number) =>
    page.evaluate((f) => {
      const story = document.querySelector<HTMLElement>("[class*='__story']")!;
      const top = story.getBoundingClientRect().top + scrollY;
      const travel = story.offsetHeight - (innerHeight - 72);
      window.scrollTo({ top: top - 72 + travel * f, behavior: "instant" });
    }, f);
  await scrollTo(0.55);
  await expect(phone).toHaveAttribute("data-rise", "up");
  await expect(phone).toHaveCSS("translate", "none");
  await expect(note(0)).toHaveCSS("opacity", "1");
  await expect(note(3)).toHaveCSS("opacity", "0");
  await scrollTo(0.95);
  for (const i of [0, 1, 2, 3]) await expect(note(i)).toHaveCSS("opacity", "1");
  // The top bar stays the full band until the story has played out.
  const header = page.locator("header").first();
  await expect(header).not.toHaveAttribute("data-scrolled");
  await scrollTo(1.02);
  await expect(header).toHaveAttribute("data-scrolled", "true");

  // Reduced motion: no pinning, everything shown at once.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("[class*='__stage']")).not.toHaveCSS("position", "sticky");
  await expect(phone).toHaveCSS("translate", "none");
  for (const i of [0, 3]) await expect(note(i)).toHaveCSS("opacity", "1");
});

for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`hero story at ${w}px: the phone comes up on its own the moment the statement has faded`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/en");
    const phone = page.locator("[class$='__phone']");
    const text = page.locator("#hero-text");
    await expect(phone).toHaveAttribute("data-rise", "down");
    // Scroll to `by` px past where the statement has faded (--text-out is 35svh).
    const scrollPastFade = (by: number) =>
      page.evaluate((by) => {
        const story = document.querySelector<HTMLElement>("[class*='__story']")!;
        window.scrollTo({ top: story.getBoundingClientRect().top + scrollY - 72 + innerHeight * 0.35 + by, behavior: "instant" });
      }, by);
    await scrollPastFade(-40);
    expect(Number(await text.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0);
    await expect(phone).toHaveAttribute("data-rise", "down");
    expect((await phone.boundingBox())!.y).toBeGreaterThanOrEqual(844);
    // Just past the fade: no more scrolling, and it rises all the way.
    await scrollPastFade(4);
    await expect(phone).toHaveAttribute("data-rise", "up");
    await expect(phone).toHaveCSS("translate", "none");
    expect((await phone.boundingBox())!.y).toBeLessThan(h / 2);
    // Back up into the statement: the phone goes back down.
    await scrollPastFade(-40);
    await expect(phone).toHaveAttribute("data-rise", "down");
  });

  // Focus inside the statement keeps it at full opacity, so the rise has to
  // follow scroll position, not the fade.
  test(`hero story at ${w}px: focus inside the statement does not keep the phone down`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/en");
    const phone = page.locator("[class$='__phone']");
    await page.locator("#hero-text a").first().focus();
    await page.evaluate(() => {
      const story = document.querySelector<HTMLElement>("[class*='__story']")!;
      window.scrollTo({ top: story.getBoundingClientRect().top + scrollY - 72 + innerHeight * 0.35 + 4, behavior: "instant" });
    });
    await expect(phone).toHaveAttribute("data-rise", "up");
    await expect(phone).toHaveCSS("translate", "none");
  });
}

// Both of these are about the very first frame after a fast jump to the top,
// so the values are read straight away, never polled.
for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`hero story at ${w}px: a fast scroll to the top shows the headline with no phone over it`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/en");
    const phone = page.locator("[class$='__phone']");
    await page.evaluate(() => {
      const story = document.querySelector<HTMLElement>("[class*='__story']")!;
      window.scrollTo({ top: story.getBoundingClientRect().top + scrollY - 72 + innerHeight * 0.35 + 4, behavior: "instant" });
    });
    await expect(phone).toHaveAttribute("data-rise", "up");
    // Two frames, so the scroll-linked fade has had its first update; a
    // transition would still be 0.7s from done.
    const [phoneOpacity, textOpacity] = await page.evaluate(async () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(null))));
      const opacity = (sel: string) => getComputedStyle(document.querySelector(sel)!).opacity;
      return [opacity("[class$='__phone']"), opacity("#hero-text")];
    });
    expect(phoneOpacity).toBe("0");
    expect(textOpacity).toBe("1");
  });
}

test("top bar: a fast scroll to the top has the full band back at once, with no gaps at the sides", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ar");
  const header = page.locator("header").first();
  // With motion on, the bar stays the full band until the hero story has played out.
  await page.evaluate(() => window.scrollTo({ top: document.querySelector<HTMLElement>("[class*='__story']")!.getBoundingClientRect().bottom + scrollY, behavior: "instant" }));
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
  const places = page.getByRole("radiogroup", { name: "Set the meeting point" });
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
  await expect(places.getByRole("radio", { name: /^Kingdom Tower/ })).toBeInViewport({ ratio: 0.9 });
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
  await expect(page).toHaveURL(/\/en$/);
  const en = page.getByRole("navigation", { name: "Language" });
  await expect(en.getByRole("link", { name: "EN English" })).toHaveAttribute("aria-current", "page");
  await expect(en.getByRole("link", { name: "AR العربية" })).toHaveAttribute("href", "/ar");
});
