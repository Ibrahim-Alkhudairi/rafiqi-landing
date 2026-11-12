import type { Content } from "./ar";

export const en: Content = {
  meta: {
    title: "Rafiqi | A volunteer companion for people with disabilities",
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
    title: "A volunteer companion\nfor people with disabilities",
    lead: "Ask in the app for someone to go with you to the hospital, the shops or any errand, and a verified volunteer meets you where you choose. Free.",
    helps: "Helps you with",
    helpsAll: "Helps you with walks, shopping, hospital visits, ministry visits, getting around and anything else.",
    tour: [
      { src: "/welcome.png", w: 1242, h: 2148 },
      { src: "/screens/who-request.jpg", w: 720, h: 1560 },
      { src: "/screens/tour-request.jpg", w: 738, h: 1600 },
      { src: "/screens/tour-location.jpg", w: 738, h: 1600 },
      { src: "/screens/tour-requests.jpg", w: 720, h: 1560 },
    ],
    tourAlt: "Screens from the Rafiqi app, changing one after another: the welcome screen, choosing the kind of help, the request details, confirming the meeting place, then your requests and their status.",
    volunteer: "I want to volunteer",
    proof: [
      { icon: "verified", text: "Every volunteer's identity verified through Nafath" },
      { icon: "association", text: "By Liajlehum" },
    ],
  },
  about: {
    title: "About us",
    text: "Rafiqi is a community app from Liajlehum that serves people with disabilities. It aims to strengthen independence and inclusion in the community by connecting people with disabilities with identity-verified volunteers who provide companionship and support.",
    link: "Visit Liajlehum's website",
    tags: [
      { icon: "association", text: "By Liajlehum" },
      { icon: "verified", text: "Verified through Nafath" },
    ],
  },
  who: {
    title: "Who is Rafiqi for?",
    you: {
      label: "People with disabilities",
      title: "If you have a disability",
      text: "Ask for someone to go with you to the hospital, the shops, a government office or on a walk, or to one of the association's events.",
      tags: [
        { icon: "verified", text: "Volunteers verified through Nafath" },
        { icon: "", text: "Free" },
        { icon: "pin", text: "You choose the time and place" },
      ],
    },
    give: {
      label: "Volunteers",
      title: "If you want to volunteer",
      sticker: { title: "New request" },
      text: "Help a person with a disability on their errand, when it suits you.",
      tags: [
        { icon: "", text: "Requests near you" },
        { icon: "", text: "Your volunteer hours count" },
        { icon: "", text: "Apply for what fits your time" },
      ],
    },
  },
  stores: {
    appStore: { alt: "Download on the App Store", lang: "en" },
    googlePlay: { alt: "Get it on Google Play", lang: "en", src: "/badges/google-play-en.png" },
  },
  phases: {
    label: "Page sections",
    items: [
      { id: "about", label: "About us", icon: "read", sections: ["about"] },
      { id: "who", label: "Who it's for", icon: "walk", sections: ["who"] },
      { id: "journey", label: "How it works", icon: "pin", sections: ["journey", "before", "way", "matched", "meet"] },
      { id: "volunteers", label: "Volunteering", icon: "association", sections: ["volunteers"] },
      { id: "faq", label: "FAQ", icon: "chat", sections: ["faq"] },
    ],
  },
  help: {
    items: [
      { icon: "walk", title: "Walking", app: "رفيقي في المشي", place: "King Abdullah Park, Al Malaz", phrase: "walks" },
      { icon: "shopping", title: "Shopping", app: "رفيقي في التسوق", place: "Riyadh Park, Al Aqiq", phrase: "shopping" },
      { icon: "hospital", title: "Hospital", app: "رفيقي في المستشفى", place: "Dr. Sulaiman Al-Habib Hospital, Al Olaya", phrase: "hospital visits" },
      { icon: "gov", title: "Ministries and government offices", app: "رفيقي في الوزارات", short: "Ministries", place: "Civil Affairs office, Al Malaz", phrase: "ministry visits" },
      { icon: "transport", title: "Getting around", app: "رفيقي في التنقل", place: "Olaya metro station", phrase: "getting around" },
      { icon: "other", title: "Other needs", app: "احتياجات أخرى", place: "Kingdom Tower, Al Olaya", phrase: "anything else" },
    ],
  },
  manifesto: "Not a ride. Not a carer. A verified person from your community who meets you where you choose, and goes with you.",
  journey: {
    title: "Your journey with Rafiqi",
    lead: "From your request to meeting your companion, in four steps.",
    steps: ["Ask", "Set the meeting point", "A volunteer takes it", "You meet"],
  },
  before: {
    title: "Pick the kind of help and ask",
    lead: "Pick the kind of help, then fill in the request details: date, time, name and description.",
    panelTitle: "What do you need company for?",
    screen: {
      src: "/screens/request-filled.jpg",
      w: 738,
      h: 1050,
      alt: "The “Rafiqi at the hospital” request form filled in: meeting date, start and end time, request name and description, the chosen meeting place, and a Confirm request button",
    },
  },
  way: {
    title: "Set the meeting point and confirm it",
    lead: "Search for a place or use your current location, then confirm it so the volunteer knows where to meet you. Last, you confirm the request.",
    panelTitle: "Two routes, one meeting point",
    meeting: "Meeting point",
    away: "km from you",
    screen: {
      src: "/screens/map-confirm.jpg",
      w: 738,
      h: 1298,
      alt: "Add request location: a place search with suggestions, a map with the meeting pin, and below it the selected address and a Confirm location button",
    },
  },
  meet: {
    title: "Follow your request until you meet",
    lead: "Know your request's status as it changes, and contact the volunteer directly.",
    steps: [
      { label: "New", text: "You send your request." },
      { label: "Volunteer assigned", text: "A verified volunteer is assigned, and you see a way to contact them." },
      { label: "Volunteer arrived", text: "They reach the meeting point." },
    ],
    after: "It becomes “Completed” when it ends, or “Cancelled” if you cancel it. If the volunteer withdraws, your request goes back to “New” and other volunteers see it.",
    arrived: "The volunteer has arrived",
    screen: {
      src: "/screens/status-requester.jpg",
      w: 720,
      h: 392,
      alt: "My requests sorted by status (All, In progress, Completed, Cancelled or rejected), with a “Medical injection appointment” request marked “New” below",
    },
  },
  matched: {
    title: "Who will go with you?",
    answer: "A verified volunteer from your community",
    points: [
      { icon: "verified", title: "Identity verified through Nafath", text: "Everyone signs in with their ID number through Nafath, and every volunteer is verified before they can accept a request." },
      { icon: "chat", title: "Contact after acceptance", text: "Once they accept, you see an option to contact the volunteer, with their first name." },
      {
        icon: "association",
        title: "By Liajlehum",
        text: "A charity that serves people with disabilities.",
      },
    ],
  },
  volunteers: {
    title: "Volunteer as a companion",
    steps: [
      { title: "Browse requests", text: "Sort them by soonest, newest or nearest to you (nearest needs location access).", screen: { src: "/screens/who-volunteer.jpg", w: 591, h: 1280, alt: "The volunteer home screen: association announcements, “All available requests” with the sort buttons (soonest, newest, nearest to you), and request cards below" } },
      { title: "Apply for a request", text: "Apply for the request that suits you, and it's assigned to you straight away. You can't withdraw from a request dated today.", screen: { src: "/screens/vol-apply.jpg", w: 591, h: 1280, alt: "Details of request #550, a medical injection appointment marked “New”, a notice that you can't withdraw from a request dated today, and an “Apply for the request” button" } },
      { title: "Contact the requester", text: "You see an option to contact them, with their first name, and agree on the details of the outing.", screen: { src: "/screens/vol-contact.jpg", w: 348, h: 755, alt: "Request #481, a work meeting marked “Volunteer assigned”, with “Contact the requester” by first name, the request type and the meeting place" } },
      { title: "Meet", text: "You meet them where they chose, and your volunteer hours count on the National Volunteering Platform.", screen: { src: "/screens/vol-requests.jpg", w: 348, h: 755, alt: "The volunteer's My requests: “Received” and “Applied” tabs, with a medical injection appointment marked “Volunteer assigned”, its date and time" } },
    ],
    hoursShort: "Your hours count on the National Volunteering Platform",
    hours: "Your volunteer hours count on the National Volunteering Platform.",
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
        q: "What types of accounts are there?",
        a: "There are two main paths: an account for people with disabilities, to create and follow requests for accompaniment, and an account for volunteers, to browse and accept the available requests. The home page and the options change with the account type you pick, so choose the one that matches your actual role and complete the details it asks for.",
      },
      {
        q: "How do I know a volunteer is verified or approved?",
        a: "A volunteer is a registered user whose identity has been checked through Nafath, and the contact details linked to them are shown to the person who made the request once the request is assigned.",
      },
      {
        q: "Can other users see my personal data?",
        a: "All personal data is visible only to the user themselves, except the contact number and first name once a request is accepted.",
      },
      {
        q: "When do the contact details appear for both sides?",
        a: "Once a volunteer accepts the request and its status becomes “Volunteer assigned”, the requester sees an option to contact the volunteer, and the volunteer sees an option to contact the requester.",
      },
      {
        q: "Is the service free?",
        a: "All services inside Rafiqi are available at no charge. Outside costs tied to the activity itself—such as an entry ticket or parking—aren't automatically included in the service unless the event's organisers or the person who made the request say otherwise.",
      },
      {
        q: "Can I use the app in any city?",
        a: "You can set a request's location on the map in any city or area the map covers, inside or outside Saudi Arabia. But a request is only accepted if volunteers are nearby and available, so response times can differ from one area to another.",
      },
    ],
    more: "See all questions",
    page: {
      metaTitle: "FAQ | Rafiqi",
      title: "All questions",
      lead: "Search for your question, or browse the questions by category.",
      search: "Search the questions",
      placeholder: "For example: is it free?",
      count: "Matching questions:",
      none: "No questions match your search. Try another word, or call Liajlehum on",
      clear: "Clear search",
      all: "All questions",
      filter: "Filter by category",
      home: "Back to home",
    },
    topics: [
      {
        title: "General questions",
        groups: [
          {
            title: "",
            items: [
              {
                q: "What is Rafiqi, and how does it help?",
                a: "Rafiqi connects people with disabilities to volunteers who accompany them for a specific request, such as going to a hospital, an event or an appointment. The app organises the request, the contact and the follow-up, but it can't guarantee a request will be accepted. A response depends on a volunteer being available at that place and time.",
              },
              {
                q: "What types of accounts are there?",
                a: "There are two main paths: an account for people with disabilities, to create and follow requests for accompaniment, and an account for volunteers, to browse and accept the available requests. The home page and the options change with the account type you pick, so choose the one that matches your actual role and complete the details it asks for.",
              },
              {
                q: "How do I know a volunteer is verified or approved?",
                a: "A volunteer is a registered user whose identity has been checked through Nafath, and the contact details linked to them are shown to the person who made the request once the request is assigned.",
              },
              {
                q: "Can other users see my personal data?",
                a: "All personal data is visible only to the user themselves, except the contact number and first name once a request is accepted.",
              },
              {
                q: "When do the contact details appear for both sides?",
                a: "Once a volunteer accepts the request and its status becomes “Volunteer assigned”, the requester sees an option to contact the volunteer, and the volunteer sees an option to contact the requester.",
              },
              {
                q: "Is the service free?",
                a: "All services inside Rafiqi are available at no charge. Outside costs tied to the activity itself—such as an entry ticket or parking—aren't automatically included in the service unless the event's organisers or the person who made the request say otherwise.",
              },
              {
                q: "Can I use the app in any city?",
                a: "You can set a request's location on the map in any city or area the map covers, inside or outside Saudi Arabia. But a request is only accepted if volunteers are nearby and available, so response times can differ from one area to another.",
              },
              {
                q: "Is the app compatible with a screen reader?",
                a: "Yes, but the experience can vary with your device type, operating system version and accessibility settings.",
              },
              {
                q: "Can I use the app without help from another person?",
                a: "The core experiences are designed to be completed independently. Some users may need to adjust the screen reader, text size or location permissions on the device.",
              },
              {
                q: "Which languages are available in the app?",
                a: "Arabic and English are available. You can change the language from the account page.",
              },
            ],
          },
        ],
      },
      {
        title: "Questions for people with disabilities",
        groups: [
          {
            title: "Creating a request",
            items: [
              {
                q: "Can I choose the kind of help I need?",
                a: "Yes. Creating a request starts by choosing the right category or service, then writing a clear name for the request and a short description of the need.",
              },
              {
                q: "What is the request name? Is it the address?",
                a: "The request name is a short description of the task, not the street address; for example: “Accompany me to a meeting”. The location is added afterwards, from “Add request location”.",
              },
              {
                q: "What should I write in the description?",
                a: "Write details that help carry it out, such as the nature of the accompaniment, the meeting point inside the venue, the expected duration, or any practical preparation. Don't include your ID number or detailed health information the volunteer doesn't need.",
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
                a: "Yes. “Add request location” opens a map you can move, zoom in and zoom out, and you can search by place name or choose “Use my current location”. Place the map pin on the exact meeting point, then tap Save to attach the location to the request. What matters most is that the saved location is the real meeting point the volunteer can reach.",
              },
              {
                q: "What if I deny location permission?",
                a: "You can still choose the request location by searching or moving the map by hand, but the “My current location” button and some distance features won't work accurately without permission. To turn them on later, open your device settings and allow Rafiqi to access your location while you use the app.",
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
                q: "What happens after I send a request?",
                a: "The request starts as “New” and stays visible to volunteers while it's still valid. When the first volunteer taps to accept the request, it's assigned to them straight away, the status changes to “Volunteer assigned”, and it then disappears from the public list of requests. In the current flow, there's no step where a volunteer waits for manual approval.",
              },
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
                a: "Yes, but only after the request is assigned. The request card shows an option to call the volunteer, and the volunteer sees a “Contact the requester” option with the requester's first name.",
              },
              {
                q: "Can I see the status of my request?",
                a: "Yes. The status appears on the “My requests” page and on the request card. It moves from “New” to “Volunteer assigned”, then to “Volunteer arrived” when the service begins, and finally to “Request completed” once it's closed. You may get notifications when it changes, but the status inside the app is the reference if a notification is late.",
              },
              {
                q: "What happens if the request time passes and no volunteer was assigned?",
                a: "Once the end time passes, the request's status changes to Cancelled on your requests page, and it disappears from the volunteers' view.",
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
        title: "Questions for volunteers",
        groups: [
          {
            title: "Joining and getting ready",
            items: [
              {
                q: "How do I get started as a volunteer?",
                a: "Sign in through Nafath, choose the “Volunteer” account type, then fill in the details your profile asks for. Use accurate, up-to-date information, especially your phone number, because it becomes the way to reach the requester once the request is assigned. Don't accept a request until you're sure you can do that kind of help, at that time and place.",
              },
              {
                q: "Does accepting a request mean I've only applied, or that it's assigned to me?",
                a: "Currently, accepting a request assigns it to you straight away. It isn't a request waiting for later approval. The status changes to “Volunteer assigned” and the request disappears from the public list.",
              },
              {
                q: "Can two volunteers accept the same request?",
                a: "No. A request is assigned to one volunteer. If several volunteers try to accept at about the same time, the first acceptance to reach the system succeeds and the other sees that the request is no longer available.",
              },
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
                a: "The default order is “Soonest”, and it starts with the earliest start time from the current time within the same day.",
              },
              {
                q: "How does “Closest to you” work?",
                a: "When you allow the app to access your location, it calculates the distance between where you are and each request's coordinates, then sorts the requests from nearest to farthest. The distance appears on the request card in kilometres.",
              },
              {
                q: "When does an expired request disappear from the public list?",
                a: "After the request's set end date and time has passed, not as soon as the day ends. It also disappears the moment a volunteer accepts it.",
              },
              {
                q: "How do I contact the requester after accepting?",
                a: "Once the request's status is “Volunteer assigned”, a green call option with the requester's first name appears under its title.",
              },
              {
                q: "Can I open the request location in a maps app?",
                a: "Yes. You can tap the meeting place in the request details to open it in the maps service available on your device.",
              },
              {
                q: "Can I accept more than one request?",
                a: "The app may show other requests, but it's the volunteer's responsibility not to accept overlapping requests or ones that can't actually be carried out. Check travel times and the expected duration of each request; accepting is an instant commitment, and withdrawing repeatedly may lead to your account being restricted or banned.",
              },
            ],
          },
          {
            title: "Withdrawing from a request",
            items: [
              {
                q: "Can I withdraw after accepting a request?",
                a: "You can withdraw from an assigned request before the date of the request. Withdrawal isn't available on the day of the request itself, even if the appointment is later that day.",
              },
              {
                q: "What happens when I withdraw?",
                a: "Your assignment is removed and the requester is notified, and the request may go back to the public list, if it's still valid, for another volunteer to accept. There's no guarantee a replacement will be available, so withdrawing can affect the requester and their plans. Note: withdrawing repeatedly after accepting requests may lead to your account being restricted or banned.",
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
  footer: {
    label: "App links",
    phone: "920019904",
    by: "The Rafiqi app is made by Liajlehum Association for Disability.",
    association: "Liajlehum website",
    groups: { app: "The app", sections: "Quick links", association: "Liajlehum", follow: "Follow us", contact: "Contact and locations" },
    pages: {
      about: "About us",
      services: "E-services",
      volunteer: "Volunteer opportunities",
      donate: "Donate",
      contact: "Write to us",
      branches: "Branches",
    },
    social: {
      x: "Liajlehum on X",
      instagram: "Liajlehum on Instagram",
      youtube: "Liajlehum on YouTube",
      facebook: "Liajlehum on Facebook",
    },
    locations: [
      { name: "Head office", address: "Al Ghazalah, Al Shumaisi district, Riyadh 12745" },
      { name: "Tabuk office", address: "Tabuk" },
      { name: "Dammam office", address: "Dammam, Eastern Province" },
      { name: "Abha office", address: "Abha, Southern Province" },
    ],
    email: "info@liajlehum.org.sa",
  },
};
