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
    lead: "Ask for a volunteer, verified through Nafath, to go with you on a walk, shopping, to a hospital visit or to a government office.",
    platforms: "Free on iPhone, iPad and Android",
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
    lead: "Choose the kind of help, set the date with a start and end time, and say what you need.",
    panelTitle: "What do you need company for?",
    panelText: "Six kinds of help, from a short walk to a government office.",
    screen: {
      src: "/screens/request-crop.png",
      w: 787,
      h: 1115,
      alt: "Rafiqi request form for the kind of help picked: meeting date, start and end time, request name and description, location, and a confirm button",
    },
  },
  way: {
    title: "Set the meeting point",
    lead: "Search for the place or use your current location, so the volunteer knows where to meet you and how far away you are.",
    panelTitle: "Two routes, one meeting point",
    panelText: "You and the volunteer both head to the place you chose.",
    meeting: "Meeting point",
    away: "km from you",
    pause: "Pause the map animation",
    screen: {
      src: "/screens/map-crop.png",
      w: 784,
      h: 1048,
      alt: "A search for “Al Habib hospital” with place suggestions, and a Riyadh map with the meeting pin and a use-my-location button",
    },
  },
  meet: {
    title: "Follow your request until your companion arrives",
    lead: "A verified volunteer accepts your request. Follow its status step by step and contact them directly.",
    panelTitle: "Every status in front of you",
    panelText: "From “new” to “volunteer arrived”, and you message each other in the app.",
    steps: [
      { label: "New", text: "You send your request." },
      { label: "Accepted", text: "A verified volunteer accepts it, and it’s assigned to them." },
      { label: "Volunteer arrived", text: "They reach the meeting point, and you message each other in the app." },
    ],
    arrived: "The volunteer has arrived",
    pause: "Pause the track animation",
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
      { icon: "verified", title: "Identity verified through Nafath", text: "Every Rafiqi volunteer has verified their identity through Nafath." },
      { icon: "chat", title: "Messaging after acceptance", text: "You chat with a volunteer once they accept your request." },
      {
        icon: "association",
        title: "Provided by Liajlehum",
        text: "A charity registered with the Ministry of Human Resources and Social Development, licence no. 1053.",
      },
    ],
  },
  volunteers: {
    title: "Volunteer as a companion",
    lead: "Help someone with a disability get where they're going, at a time that suits you.",
    points: [
      "Browse nearby requests, sorted by closest to you, newest or soonest.",
      "Accept the one that suits you and it's assigned to you straight away.",
      "Contact the requester and agree on the details.",
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
      { q: "Who are the volunteers?", a: "People from the community, each with their identity verified through Nafath." },
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
    text: "Your companion is on the way. Free on iPhone, iPad and Android.",
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
