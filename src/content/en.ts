import type { Content } from "./ar";

export const en: Content = {
  meta: {
    title: "Rafiqi | A verified companion for every outing",
    description:
      "Rafiqi connects people with disabilities to volunteers verified through Nafath. Free on iPhone, iPad and Android.",
  },
  skip: "Skip to content",
  navLabel: "Main",
  menu: "Menu",
  language: "Language",
  languages: [
    { lang: "en", label: "EN", name: "English" },
    { lang: "ar", label: "AR", name: "العربية" },
  ],
  download: "Download",
  hero: {
    title: "A verified companion for every outing",
    lead: "Ask for a volunteer to go with you on a walk, shopping, to the hospital or to a government office.",
    volunteer: "I want to volunteer",
    proof: [
      { icon: "verified", text: "Volunteers verified through Nafath" },
      { icon: "association", text: "By Liajlehum · licence 1053" },
    ],
    phoneAlt: "Rafiqi home screen: the list of available requests sorted by closest to you; the first is a dental appointment 2.5 km away",
    notes: [
      { icon: "check", title: "A volunteer accepted your request", text: "Dental appointment · 10:20 PM" },
      { icon: "association", title: "New request near you", text: "2.5 km from you" },
      { icon: "pin", title: "Meeting point", text: "Dr. Sulaiman Al-Habib Hospital, Al Olaya" },
      { icon: "arrived", title: "The volunteer has arrived", text: "At the meeting point now" },
    ],
  },
  stores: {
    appStore: { alt: "Download on the App Store", lang: "en" },
    googlePlay: { alt: "Get it on Google Play", lang: "en", src: "/badges/google-play-en.png" },
  },
  phases: {
    label: "Parts of the journey",
    items: [
      { id: "before", label: "Ask", icon: "chat", sections: ["before"] },
      { id: "way", label: "On the way", icon: "pin", sections: ["way"] },
      { id: "meet", label: "At the meeting", icon: "check", sections: ["meet"] },
      { id: "volunteers", label: "Volunteer", icon: "association", sections: ["trust", "volunteers"] },
    ],
  },
  help: {
    items: [
      { icon: "walk", title: "Walking", place: "King Abdullah Park, Al Malaz" },
      { icon: "shopping", title: "Shopping", place: "Riyadh Park, Al Aqiq" },
      { icon: "hospital", title: "Hospital", place: "Dr. Sulaiman Al-Habib Hospital, Al Olaya" },
      { icon: "gov", title: "Government offices", place: "Civil Affairs office, Al Malaz" },
      { icon: "transport", title: "Getting around", place: "Olaya metro station" },
      { icon: "other", title: "Other needs", place: "Kingdom Tower, Al Olaya" },
    ],
  },
  manifesto: "Not a ride. Not a carer. A verified person from your community who meets you where you choose, and goes with you.",
  before: {
    title: "Ask for a companion in a minute",
    lead: "Pick the kind of help, the date and time, and say what you need.",
    panelTitle: "What do you need company for?",
    screen: {
      src: "/screens/request-crop.png",
      w: 787,
      h: 1115,
      alt: "Rafiqi request form for the kind of help picked: meeting date, start and end time, request name and description, location, and a confirm button",
    },
  },
  way: {
    title: "Set the meeting point",
    lead: "Search for a place or use your current location, so the volunteer knows where to meet you.",
    panelTitle: "Two routes, one meeting point",
    meeting: "Meeting point",
    away: "km from you",
    screen: {
      src: "/screens/map-crop.png",
      w: 784,
      h: 1048,
      alt: "A search for “Al Habib hospital” with place suggestions, and a Riyadh map with the meeting pin and a use-my-location button",
    },
  },
  meet: {
    title: "Follow your request until your companion arrives",
    lead: "See every status, and contact your volunteer directly.",
    steps: [
      { label: "New", text: "You send your request." },
      { label: "Accepted", text: "A verified volunteer accepts it, and you get their contact details, like their mobile number." },
      { label: "Volunteer arrived", text: "They reach the meeting point." },
    ],
    arrived: "The volunteer has arrived",
    screen: {
      src: "/screens/status-crop.png",
      w: 785,
      h: 468,
      alt: "Request #481, a work meeting, with the status “volunteer arrived”, the requester, type, place and time",
    },
  },
  trust: {
    title: "Who will go with you?",
    licence: "1053",
    items: [
      { icon: "verified", title: "Identity verified through Nafath", text: "Every volunteer is verified before they can accept a request." },
      { icon: "chat", title: "Contact after acceptance", text: "Once they accept, you get their mobile number and can message them in the app." },
      {
        icon: "association",
        title: "By Liajlehum",
        text: "A charity registered with the Ministry of Human Resources and Social Development, licence no. 1053.",
      },
    ],
  },
  volunteers: {
    title: "Volunteer as a companion",
    lead: "Help someone with a disability get where they're going, at a time that suits you.",
    points: [
      "Browse requests near you.",
      "Accept one that suits you, and it's yours straight away.",
      "Get the requester's contact details, like their mobile number, and plan the outing together.",
    ],
    hours: "Your volunteer hours count and show up in Absher.",
    screen: {
      src: "/screens/requests-crop.png",
      w: 804,
      h: 554,
      alt: "Requests sorted by closest to you; the first, a dental appointment at Dr. Sulaiman Al-Habib Hospital, is 2.5 km away",
    },
  },
  faq: {
    title: "Common questions",
    help: "Didn't find your answer? Call Liajlehum on",
    items: [
      { q: "Is the app free?", a: "Yes. Rafiqi is free on iPhone, iPad and Android." },
      { q: "Who are the volunteers?", a: "People from your community, each verified through Nafath." },
      {
        q: "What can I ask for help with?",
        a: "Walking, shopping, hospital visits, government offices, getting around, and other needs.",
      },
      { q: "Which phones does it work on?", a: "iPhone and iPad with iOS 13 or later, and Android phones." },
      { q: "How do I become a volunteer?", a: "Download the app, verify your identity through Nafath, then browse requests and accept one that suits you." },
      { q: "Do volunteer hours count?", a: "Yes. Your volunteer hours count and show up in Absher." },
    ],
  },
  close: {
    title: "Get Rafiqi",
    qrHint: "Or scan with your phone's camera:",
    qrAppStore: "QR code that opens Rafiqi on the App Store",
    qrGooglePlay: "QR code that opens Rafiqi on Google Play",
    text: "Free on iPhone, iPad and Android.",
    screenAlt: "Rafiqi welcome screen: the Rafiqi logo above blue waves",
  },
  footer: {
    label: "App links",
    contact: "Contact Liajlehum",
    phone: "920019904",
    by: "The Rafiqi app is made by Liajlehum Association for Disability.",
    association: "Liajlehum website",
    concept: "This is a concept page. It is not affiliated with Liajlehum Association.",
    privacy: "Privacy policy",
  },
};
