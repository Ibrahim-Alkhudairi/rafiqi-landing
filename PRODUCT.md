# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** people with disabilities in Saudi Arabia (and the family members who set things up for them) who want company for everyday outings: a walk, shopping, a hospital visit, a government office, getting around. Many use screen readers, large text, zoom or reduced motion.
- **Secondary:** volunteers who want to help, browsing nearby requests and accepting one that suits them.

## Product Purpose

Rafiqi (رفيقي), an app by Liajlehum Association for Disability, connects a person with a disability to a volunteer whose identity is verified through Nafath. The beneficiary describes the request (type of help, date, start and end time, details) and drops a meeting point on a map; a volunteer accepts, the request is assigned to them directly, and the two message each other in the app. This page is a local demo of an advertising landing page: success is a visitor understanding what the app does within seconds and downloading it (App Store / Google Play), with volunteers finding their own path.

## Positioning

Companionship, not transport or care: a verified person from the community meets you at a point you choose and goes with you. Identity verification through Nafath and an association behind it are what a generic volunteering or ride app cannot claim.

## Operating Context

- Help categories in the current app: walking, shopping, hospital, ministries / government offices, getting around (transport), other needs.
- Volunteers sort requests by closest to you, newest, or soonest, and see the distance from their location.
- Request statuses exist in the app (e.g. new, "volunteer arrived").
- Free on iPhone, iPad (iOS 13+) and Android.
- Links: App Store id1602789379; Google Play `org.liajlehum.rafeeq`; privacy policy on the app backend; association site liajlehum.org.sa.

## Capabilities and Constraints

- Stack: Next.js 16 + React 19, CSS modules, Motion (`motion/react`), Playwright + axe tests. Local only, no deploy.
- Arabic first (right-to-left) at `/ar`, English at `/en`; both languages written in full.
- Volunteer hours: the user states they count and show up in Absher, and chose (2026-10-20) to state it on the page without a qualifier. No public source confirms this for Rafiqi specifically; it rests on the user's word.

## Brand Commitments

- Name رفيقي | Rafiqi, the app icon and wordmark.
- Light background (user decision, binding).
- The app's own colours (binding): primary blue #2788EA, lavender tints #FDF8FE / #F6F1F8, yellow status pill #FDEFBE, and the per-category colours (walking #FA541D, shopping #9420A8, hospital #F94A48, ministries #F9BC09, transport #019380, other #FC561E). Text-bearing blues may be deepened for contrast.
- Real app screens (binding): the welcome screen plus the request form, map picker, request status and request list screens in `public/screens/`.
- The route-and-meeting-pin idea (binding): two people's routes meeting at a point.
- "Concept — not affiliated with Liajlehum" stays visible.
- Standing preference (user, 2026-10-20): minimalist and product-first, in the manner of flighty.com. The user rejected a generic SaaS card layout and a chat-thread concept as "AI sloppy" / "terrible".

## Evidence on Hand

- Real app screens: welcome screen `public/welcome.png`; region crops of the request form, map picker, request status and request list in `public/screens/*-crop.png` (originals are the user's App Store screenshots); app icon `public/icon.png`; store badges in `public/badges/` (Apple badge English only).
- Liajlehum is registered with the Ministry of Human Resources and Social Development, licence 1053.
- Absent and never to be fabricated: user counts, volunteer counts, ratings, testimonials, partner logos, press, and any claim that the app works with screen readers (a public review says it does not).

## Product Principles

1. Understood in seconds: what it is, who it is for, how to get it.
2. The beneficiary's path leads; the volunteer's path is always one step away.
3. Show the real app doing its job rather than describing it.
4. Every claim is one the app or the association can stand behind.
5. Usable by the people it serves: nothing that works only with a mouse, perfect sight, or full motion.

## Accessibility & Inclusion

WCAG 2.2 AA with cheap AAA: body text at least 7:1, large text at least 4.5:1, targets at least 44px, plain language, no meaning by colour alone, reduced motion and large text respected, no overlay widget. Layout must reflow at 320px and at 200% text.

The website itself serves two audiences, people with disabilities and volunteers, and must be fully accessible to both. Every part of the page, including the beneficiary path and the volunteer path, is held to the requirements above and reviewed against them.
