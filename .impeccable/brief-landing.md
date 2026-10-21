# Surface brief: landing page (/ar, /en)

Scope: the single advertising landing page, Arabic first (/ar) with English (/en). Mode: Persuade.
Audience and action: people with disabilities and their families understand Rafiqi in seconds and download it; volunteers find their path one step away. The page must be fully accessible to both audiences.
Proof on hand: real app screens (request list, request form, map picker, request status, request list card, welcome screen), the six real help categories, Nafath verification, Liajlehum licence 1053. Illustrative notifications use only real app states.
Constraints: light only, the app's colours, real app screens, the route-and-meeting-pin idea, WCAG 2.2 AA with 7:1 body text, 320px and 200% text reflow, reduced motion and no-JS fallbacks.

## Direction contract

THESIS: User-pinned direction (replaces the conversation-thread build the user rejected): a minimalist, product-first page in the manner of flighty.com, telling Rafiqi as a journey (ask, on the way, at the meeting, volunteer, download) instead of a feature grid.

OWN-WORLD: White ground, Readex Pro in one heavy display weight, huge centred statements, soft lavender (#F6F1F8) panels with 32px corners where real app screens break out of the bottom edge, crisp white notification cards, the app's blue only for accents and the yellow (#FFC93C) only for the active phase and "volunteer arrived", category colours only on the help chips. No card grids, no icon tiles.

STORY: The visitor reads one promise, sees the real app among its real notifications, walks the three phases with the real screens, learns who comes, sees the volunteer side, and downloads.

FIRST VIEWPORT: Desktop 1440x900: header; centred two-line headline, lead, store badges, proof row (Nafath, licence 1053), volunteer link; the phone with the real request list rising from the bottom, two notification cards beside it; the dark journey bar pinned at the bottom. Mobile: the same stack, two notifications overlapping the phone's edges, no journey bar.

FORM: Pinned by the user (flighty.com as primary reference; lapa.ninja minimal/app categories reviewed: Luffu and Granola rejected for photography dependence and palette). Seed bff3d74a's roll is superseded by this pin. Signature interaction: the journey bar marks the phase on screen (aria-current) while notifications rise in on load and panels rise on scroll; the meeting map's two routes draw to the pin when it appears. Reduced motion shows everything at once.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
