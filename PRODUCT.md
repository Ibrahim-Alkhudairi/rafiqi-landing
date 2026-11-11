# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** people with disabilities in Saudi Arabia (and the family members who set things up for them) who want company for everyday outings: a walk, shopping, a hospital visit, a government office, getting around. Many use screen readers, large text, zoom or reduced motion.
- **Secondary:** volunteers who want to help, browsing nearby requests and accepting one that suits them.

## Product Purpose

Rafiqi (رفيقي), an app by Liajlehum Association for Disability, connects a person with a disability to a volunteer whose identity is verified through Nafath. The beneficiary describes the request (type of help, date, start and end time, details) and drops a meeting point on a map; a volunteer applies, the request is assigned to them directly, and each side then sees an option to contact the other, with the first name (guide p20; the guide and its screens show no in-app chat). This is Rafiqi's live landing page (an advertising page): success is a visitor understanding what the app does within seconds and downloading it (App Store / Google Play), with volunteers finding their own path.

## Positioning

Companionship, not transport or care: a verified person from the community meets you at a point you choose and goes with you. Identity verification through Nafath and an association behind it are what a generic volunteering or ride app cannot claim.

## Operating Context

- Help categories in the current app: walking, shopping, hospital, ministries / government offices, getting around (transport), other needs.
- Volunteers sort requests by closest to you, newest, or soonest, and see the distance from their location.
- Request statuses exist in the app (e.g. new, "volunteer arrived").
- Free on iPhone, iPad (iOS 13+) and Android.
- Links: App Store id1602789379; Google Play `org.liajlehum.rafeeq`; privacy policy on the app backend (not linked from the site: user decision, 2026-11-10; the store listings carry it); association site liajlehum.org.sa. The QR codes for the stores were removed with the close section (user decision, 2026-11-10).

## Capabilities and Constraints

- Stack: Next.js 16 + React 19, CSS modules, Motion (`motion/react`), Playwright + axe tests. Static export deployed to https://rafiqi.sa on Bluehost by GitHub Actions on every push to `main`, the same as join.rafiqi.sa.
- Arabic first (right-to-left) at `/ar`, English at `/en`; both languages written in full.
- Volunteer hours: counted on the National Volunteering Platform (المنصة الوطنية للعمل التطوعي), as the user stated on 2026-11-11, stated on the page without a qualifier. This replaces the NCNP wording (المركز الوطني لتنمية القطاع غير الربحي, 2026-10-27), which itself replaced an earlier claim (2026-10-20) that hours show up in Absher. No public source confirms this for Rafiqi specifically; it rests on the user's word.

## Brand Commitments

- Name رفيقي | Rafiqi, the app icon and wordmark.
- Light background (user decision, binding).
- The app's own colours (binding): primary blue #2788EA, lavender tints #FDF8FE / #F6F1F8, yellow status pill #FDEFBE, and the per-category colours (walking #FA541D, shopping #9420A8, hospital #F94A48, ministries #F9BC09, transport #019380, other #FC561E). Text-bearing blues may be deepened for contrast.
- Real app screens (binding): the welcome screen plus the request form, map picker, request status and request list screens in `public/screens/`.
- The route-and-meeting-pin idea (binding): two people's routes meeting at a point.
- rafiqi.sa is Rafiqi's official site (user decision): no concept or "not affiliated with Liajlehum" notice.
- Standing preference (user, 2026-10-20): minimalist and product-first, in the manner of flighty.com. The user rejected a generic SaaS card layout and a chat-thread concept as "AI sloppy" / "terrible".

## Evidence on Hand

- Real app screens: welcome screen `public/welcome.png`; full app screens from Liajlehum's user guide in `public/screens/` (`request-filled.jpg`, `map-confirm.jpg`, `status-requester.jpg`, `who-request.jpg`, `who-volunteer.jpg`, `vol-apply.jpg`, `vol-contact.jpg`, `vol-requests.jpg`; the older App Store crops were removed 2026-11-10); app icon `public/icon.png`; store badges in `public/badges/` (Apple badge English only).
- Liajlehum is registered with the Ministry of Human Resources and Social Development, licence 1053. Neither the registration nor the licence number is shown on the site (user decisions, 2026-11-10).
- Association contact facts (source https://www.liajlehum.org.sa and /contact/, checked 2026-11-10): phone 920019904 (matches the app's) and a second number 0557989071 (not used); email info@liajlehum.org.sa; head office "الرياض- الغزالة, حي الشميسي 12745". No working hours and no Google Maps link are published.
- Association offices (source https://www.liajlehum.org.sa/pages/فروع-الجمعية/, 2026-11-10): Tabuk, Dammam (Eastern Province) and Abha (Southern Province); the page gives no street address, phone or hours for them.
- Association social accounts, as linked from its own site footer (2026-11-10): X https://twitter.com/Liajlehum; Instagram https://www.instagram.com/liajlehum/; YouTube https://www.youtube.com/channel/UCYbzyRSeP_ypOln2L_sLsLg; Facebook https://m.facebook.com/liajlehum.sa. No LinkedIn, TikTok, Snapchat or WhatsApp is linked.
- Association site pages linked from the footer (2026-11-10): /about/, /services/, /news/, /chances/ (volunteer opportunities), /projects/ (donate), /contact/, /pages/فروع-الجمعية/.
- The association's app guide «دليل استخدام تطبيق رفيقي» (27-page PDF, shared by the user 2026-11-10; local copy `~/Downloads/دليل_استخدام_تطبيق_رفيقي.pdf`, not in the repo). It states: the «من نحن» definition now on the site; two account paths (people with disabilities create and follow requests, volunteers browse and accept); sign-in through Nafath, personal details pulled from Nafath and not editable, account deletion in the account page; events (فعاليات) added by Liajlehum, and a request can be created from an event; a new request in four steps (details, set location, confirm location, confirm request); statuses جديد، أخذه متطوع، المتطوع وصل، مكتملة، ملغية, and a request returns to جديد if the volunteer withdraws; volunteers sort requests by soonest, newest and nearest (distance needs location access) and can withdraw unless it is the same day; volunteers see the requester's contact and first name after accepting; a screen-reader setup section for VoiceOver and TalkBack. Two of its screens are on the site: `public/screens/who-request.jpg` (guide p10, «اختر ماذا تريد») and `public/screens/who-volunteer.jpg` (guide p16, «كل الطلبات المتاحة»). The guide's setup section is not a claim that the app works well with screen readers; the rule below still holds.
- Site copy applied from the guide on 2026-11-10: the app's status names جديد، أخذه متطوع، المتطوع وصل، مكتملة، ملغية and the return to «جديد» on withdrawal (p13); the four request steps and the «تأكيد الموقع» button (p11); the app's ministries category «رفيقي في الوزارات» (p10); the volunteer button «تقديم على الطلب» and its same-day warning (p18); the three sort pills (p17); events (p08, p09, p19); Nafath sign-in and non-editable personal details (p06, p14, p15); account deletion (p14). Screens cropped from the guide: `public/screens/request-filled.jpg` (p11-4), `map-confirm.jpg` (p11-3) and `status-requester.jpg` (p12-1); the older `*-crop.png` files are superseded. Hero tour screens, full-size copies from the guide (2026-11-11): `public/screens/tour-request.jpg` (p11-4, 738×1600), `tour-location.jpg` (p11-3, 738×1600, dim backdrop kept), `tour-requests.jpg` (p12-1, 720×1560); the «اختر ماذا تريد» step reuses `who-request.jpg` (p10-1, same image). Not applied, awaiting the association: who starts the request on the volunteer's arrival (p12–13) and whether an expired request becomes «ملغية».
- Absent and never to be fabricated: user counts, volunteer counts, ratings, testimonials, partner logos, press, and any claim that the app works with screen readers (a public review says it does not).

## Product Principles

1. Understood in seconds: what it is, who it is for, how to get it.
2. The beneficiary's path leads; the volunteer's path is always one step away.
3. Show the real app doing its job rather than describing it.
4. Every claim is one the app or the association can stand behind.
5. Usable by the people it serves: nothing that works only with a mouse, perfect sight, or full motion.

## Accessibility & Inclusion

WCAG 2.2 AA with cheap AAA: body text at least 7:1, large text at least 4.5:1, targets at least 44px, plain language, no meaning by colour alone, reduced motion and large text respected, no overlay widget. Layout must reflow at 320px and at 200% text.

Known exception (user decision, 2026-10-27): the meeting map and the request-status track loop with no pause control. This fails WCAG 2.2.2 (Pause, Stop, Hide); the user chose it knowingly over a play-once alternative. Reduced motion still shows both finished and still. On 2026-11-09 the user chose the same for the hero chips and notifications; on 2026-11-11 those were replaced: the floating chips and the notifications are gone, and a line under the headline («يساعدك في …») rotates through the six kinds of help. The phone also swipes through five app screens from the guide. The user chose (2026-11-11) that hovering does not pause either loop; keyboard focus inside the hero pauses both, which is the pause mechanism for WCAG 2.2.2 for keyboard users. Mouse users have no pause control (a partial 2.2.2 exception, user decision). Reduced motion shows the first kind, still.

On 2026-11-10 the user asked for «لمن رفيقي؟» to switch on its own, on a timer, between the disability view and the volunteer view, with both views' text always shown and a line timer beside the selected one, and to let people pick either one. Picking one stops the switching for good. It also pauses while the pointer or focus is on it and while the section is out of view, and it never runs with reduced motion. A screen reader is not told about automatic switches. The user also asked (2026-11-10) for the unselected view's text to be colourless and fainter: it drops from the 7:1 target to the WCAG AA floor (3:1 for its large heading, 4.5:1 for its other text) and comes back to full colour on hover or focus. The same day the user asked for an interactive dot grid across the whole hero, under the text too: the dots react to the pointer everywhere, so under the hero copy contrast drops from the 7:1 target to the WCAG AA floor (4.5:1 for the lead, proof and button, 3:1 for the headline), also at the strongest moment of a reaction. Reduced motion and touch show the dots still.

The website itself serves two audiences, people with disabilities and volunteers, and must be fully accessible to both. Every part of the page, including the beneficiary path and the volunteer path, is held to the requirements above and reviewed against them.
