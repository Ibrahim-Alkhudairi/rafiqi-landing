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
      { icon: "check", title: "A volunteer accepted your request", text: "Dental appointment · 10:12 PM" },
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
      alt: "The app's place search with suggestions, above a Riyadh map with the meeting pin and a use-my-location button",
    },
  },
  meet: {
    title: "Follow your request until your companion arrives",
    lead: "Know your request's status as it changes, and contact the volunteer directly.",
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
      alt: "Request #481, a work meeting, with the status “volunteer arrived”, a contact row for the requester, the request type and the meeting place",
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
    lead: "Help someone with a disability on their outing, at a time that suits you.",
    points: [
      "Browse requests near you.",
      "Accept one that suits you, and it's yours straight away.",
      "Get the requester's contact details, like their mobile number, and plan the outing together.",
    ],
    hours: "Your volunteer hours are counted with the National Center for Non-Profit Sector (NCNP).",
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
      {
        q: "What is Rafiqi, and how does it help?",
        a: "Rafiqi connects people with disabilities to volunteers who accompany them for a specific request, such as going to a hospital, an event or an appointment. The app organises the request, the contact and the follow-up, but it can't guarantee a request will be accepted. A response depends on a volunteer being available at that place and time.",
      },
      {
        q: "Is it free?",
        a: "Yes. Rafiqi is free on iPhone, iPad and Android, and every service inside it is free of charge. Outside costs tied to the activity itself, such as an entry ticket or parking, aren't automatically included in the service unless the event's organisers or the person who made the request say otherwise.",
      },
      {
        q: "How do I know a volunteer is verified?",
        a: "Every volunteer is a registered user whose identity has been checked through Nafath. Their contact details are shown to the person who made the request once the request is assigned.",
      },
      {
        q: "Does the app work with a screen reader?",
        a: "Yes, though the experience can vary with your device, its operating system version and your accessibility settings.",
      },
      {
        q: "Can I use the app in any city?",
        a: "You can set a request's location on the map in any city or area the map covers, inside or outside Saudi Arabia. But a request is only accepted if volunteers are nearby and available, so response times can differ from one area to another.",
      },
      {
        q: "What happens after I send a request?",
        a: "The request starts as \"New\" and stays visible to volunteers while it's still valid. When the first volunteer taps accept, it's assigned to them straight away, the status changes to \"Volunteer assigned\", and it disappears from the public list. In the current flow, there's no step where a volunteer waits for manual approval.",
      },
      {
        q: "How do I get started as a volunteer?",
        a: "Sign in through Nafath, choose the \"Volunteer\" account type, then fill in the details your profile asks for. Use accurate, up-to-date information, especially your phone number, because it becomes the way the requester reaches you once the request is assigned. Don't accept a request until you're sure you can do that kind of help, at that time and place.",
      },
    ],
    top: "Most asked",
    topics: [
      {
        title: "General",
        groups: [
          {
            title: "About the app",
            items: [
              {
                q: "What types of accounts are there?",
                a: "There are two main paths: an account for people with disabilities, to create and follow requests for accompaniment, and an account for volunteers, to browse and accept the available requests. The home page and the options change with the account type you pick, so choose the one that matches your actual role and complete the details it asks for.",
              },
              { q: "Which languages does the app support?", a: "Arabic and English. You can change the language from the account page." },
              { q: "Which devices does it work on?", a: "iPhone and iPad with iOS 13 or later, and Android phones." },
            ],
          },
          {
            title: "Verification and privacy",
            items: [
              {
                q: "Can other users see my personal data?",
                a: "Your personal data is visible only to you, except your phone number and first name once a request is accepted.",
              },
              {
                q: "When do the requester and the volunteer see each other's contact details?",
                a: "Once a volunteer accepts the request and its status becomes \"Volunteer assigned\", the requester sees an option to contact the volunteer, and the volunteer sees an option to contact the requester.",
              },
            ],
          },
          {
            title: "Accessibility",
            items: [
              {
                q: "Can I use the app without someone else's help?",
                a: "The core tasks are designed so you can complete them on your own. Some users may need to adjust their screen reader, text size or location permissions on the device.",
              },
            ],
          },
        ],
      },
      {
        title: "For people with disabilities",
        groups: [
          {
            title: "Creating a request",
            items: [
              {
                q: "Can I choose the kind of help I need?",
                a: "Yes. You start a request by choosing the right category or service: walking, shopping, a hospital visit, government offices, getting around, or other needs. Then give the request a clear name and a short description of what you need.",
              },
              {
                q: "What is the request name? Is it the address?",
                a: "The request name is a short description of the task, not a street address. For example: \"Accompany me to a meeting\". The location is added afterwards, from \"Add request location\".",
              },
              {
                q: "What should I write in the description?",
                a: "Write details that help the volunteer carry it out, such as what kind of accompaniment you need, the meeting point inside the venue, the expected duration, or any practical preparation. Don't include your ID number or detailed health information the volunteer doesn't need.",
              },
              {
                q: "Can one request include more than one appointment?",
                a: "No. Each request is tied to a single date and one time slot, from a start time to an end time. If you have different or recurring appointments, create a separate request for each so the status and assignment of each stay clear.",
              },
              {
                q: "Can I edit a request after sending it?",
                a: "There's no editing once a request is created. If you notice a significant mistake before the service starts, cancel the request and create a new one with the right details. If it has already started, contact the other person rather than making a change they haven't agreed to.",
              },
            ],
          },
          {
            title: "Choosing a location and using the map",
            items: [
              {
                q: "Is it easy to set the location?",
                a: "Yes. \"Add request location\" opens a map you can move, zoom in and zoom out, and you can search by place name or choose \"Use my current location\". Drop the pin on the exact meeting point, then tap Save to attach the location to the request. What matters most is that the saved location is the real meeting point the volunteer can reach.",
              },
              {
                q: "What if I deny location permission?",
                a: "You can still choose the request location by searching or moving the map by hand, but the \"My current location\" button and some distance features won't work accurately without permission. To turn them on later, open your device settings and allow Rafiqi to access your location while you use the app.",
              },
              {
                q: "Why might a short place name differ from the full address?",
                a: "Search usually shows the well-known name of the place and a specific result. When you move the pin by hand, the address comes from whatever the map service returns for the spot you picked.",
              },
              {
                q: "Are places I searched for before shown?",
                a: "Yes. The location picker shows up to five recent places so you can pick them again easily, and you can collapse the list to give the map more room.",
              },
            ],
          },
          {
            title: "Assignment and volunteer details",
            items: [
              {
                q: "Can I choose a male or female volunteer?",
                a: "No. The request goes to the first qualified volunteer who accepts it. If you have an essential need linked to the kind of help, state it clearly in the description so the volunteer can decide whether they're suitable before accepting.",
              },
              {
                q: "Can I change the volunteer after the request is accepted?",
                a: "There's no direct button to swap the volunteer for another one. Before the service starts, you can cancel the request and create a new one.",
              },
              {
                q: "Can I contact the volunteer before they arrive?",
                a: "Yes, but only after the request is assigned. The request card shows an option to call the volunteer, and the volunteer sees a \"Contact the requester\" option with the requester's first name.",
              },
              {
                q: "Can I see the status of my request?",
                a: "Yes. The status appears on the \"My requests\" page and on the request card. It moves from \"New\" to \"Volunteer assigned\", then to \"Volunteer arrived\" when the service begins, and finally to \"Request completed\" once it's closed. You may get notifications when it changes, but the status inside the app is the reference if a notification is late.",
              },
              {
                q: "What happens if the request time passes and no volunteer was assigned?",
                a: "Once the end time passes, the request's status changes to \"Cancelled\" on your requests page, and it disappears from the volunteers' view.",
              },
              {
                q: "Can I cancel a request after sending it?",
                a: "You can cancel as long as the request hasn't actually started.",
              },
            ],
          },
        ],
      },
      {
        title: "For volunteers",
        groups: [
          {
            title: "Joining and getting ready",
            items: [
              {
                q: "Does accepting a request mean I've only applied, or that it's assigned to me?",
                a: "Currently, accepting a request assigns it to you straight away. It isn't an application waiting for later approval. The status changes to \"Volunteer assigned\" and the request disappears from the public list.",
              },
              {
                q: "Can two volunteers accept the same request?",
                a: "No. A request is assigned to one volunteer. If several volunteers try to accept at about the same time, the first acceptance to reach the system succeeds and the others see that the request is no longer available.",
              },
              { q: "Do volunteer hours count?", a: "Yes. Your volunteer hours are counted with the National Center for Non-Profit Sector (NCNP)." },
            ],
          },
          {
            title: "Browsing requests and sorting by location",
            items: [
              {
                q: "Which requests appear on the volunteer home page?",
                a: "New, unassigned requests whose end time hasn't passed. Requests another volunteer has accepted don't appear, and the ones you accept move to your requests page.",
              },
              {
                q: "How are requests sorted by default?",
                a: "By \"Soonest\". It starts with the request whose start time is closest to the current time within the same day.",
              },
              {
                q: "How does \"Closest to you\" work?",
                a: "When you allow the app to access your location, it calculates the distance between where you are and each request's coordinates, then sorts the requests from nearest to farthest. The distance appears on the request card in kilometres.",
              },
              {
                q: "When does an expired request disappear from the public list?",
                a: "After the request's set end date and time has passed, not as soon as the day ends. It also disappears the moment a volunteer accepts it.",
              },
              {
                q: "How do I contact the requester after accepting?",
                a: "Once the request's status is \"Volunteer assigned\", a green call option with the requester's first name appears under its title.",
              },
              {
                q: "Can I open the request location in a maps app?",
                a: "Yes. Tap the meeting point in the request details to open it in the maps service available on your device.",
              },
              {
                q: "Can I accept more than one request?",
                a: "The app may show other requests, but it's the volunteer's responsibility not to accept overlapping requests or ones they can't actually carry out. Check travel times and the expected duration of each request. Accepting is an instant commitment, and withdrawing repeatedly may lead to your account being restricted or banned.",
              },
            ],
          },
          {
            title: "Withdrawing from a request",
            items: [
              {
                q: "Can I withdraw after accepting a request?",
                a: "You can withdraw from an assigned request before the day of the request. Withdrawal isn't available on the day itself, even if the appointment is later that day.",
              },
              {
                q: "What happens when I withdraw?",
                a: "Your assignment is removed and the requester is notified. The request may go back to the public list, if it's still valid, for another volunteer to accept. There's no guarantee a replacement will be found, so withdrawing can affect the requester and their plans. Note that withdrawing repeatedly after accepting requests may lead to your account being restricted or banned.",
              },
              {
                q: "Why is there no withdraw button on the day of the request?",
                a: "Because withdrawing on the same day may not leave enough time to find a replacement volunteer. The app shows a notice about this rule before you accept.",
              },
            ],
          },
        ],
      },
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
    privacy: "Privacy policy",
  },
};
