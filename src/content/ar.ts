export const ar = {
  meta: {
    title: "رفيقي | رفيق موثّق يرافقك في مشوارك",
    description:
      "تطبيق رفيقي يصل الأشخاص ذوي الإعاقة بمتطوعين موثّقة هويتهم عبر نفاذ. مجاني على iPhone وiPad وAndroid.",
  },
  skip: "تخطَّ إلى المحتوى",
  navLabel: "الرئيسية",
  menu: "القائمة",
  language: "اللغة",
  // The language switch, EN first on both pages; name is read aloud where
  // the label is only an abbreviation.
  languages: [
    { lang: "en", label: "EN", name: "English" },
    { lang: "ar", label: "عربي", name: "" },
  ],
  download: "حمّل التطبيق",
  hero: {
    title: "رفيق موثّق يرافقك في مشوارك",
    lead: "اطلب متطوعًا موثّقة هويته عبر نفاذ ليرافقك في المشي أو التسوق أو زيارة المستشفى أو مراجعة الجهات الحكومية.",
    platforms: "مجاني على iPhone وiPad وAndroid",
    volunteer: "أريد أن أتطوع",
    proof: [
      { icon: "verified", text: "متطوعون موثّقون عبر نفاذ" },
      { icon: "association", text: "من جمعية لأجلهم · ترخيص 1053" },
    ],
    phoneAlt: "شاشة رفيقي الرئيسية: قائمة الطلبات المتاحة مرتبة حسب الأقرب إليك، وأولها موعد أسنان على بُعد 2.5 كم",
    notes: [
      { icon: "check", title: "قبل متطوع طلبك", text: "موعد أسنان · 10:20 م" },
      { icon: "association", title: "طلب جديد قريب منك", text: "2.5 كم عن موقعك" },
      { icon: "pin", title: "موقع اللقاء", text: "مستشفى د. سليمان الحبيب، العليا" },
      { icon: "arrived", title: "المتطوع وصل", text: "في موقع اللقاء الآن" },
    ],
  },
  stores: {
    appStore: { alt: "Download on the App Store", lang: "en" },
    googlePlay: { alt: "احصل عليه من Google Play", lang: "ar", src: "/badges/google-play-ar.png" },
  },
  phases: {
    label: "مراحل المشوار",
    items: [
      { id: "before", label: "اطلب", icon: "chat", sections: ["before"] },
      { id: "way", label: "في الطريق", icon: "pin", sections: ["way"] },
      { id: "meet", label: "عند اللقاء", icon: "check", sections: ["meet"] },
      { id: "volunteers", label: "تطوّع", icon: "association", sections: ["trust", "volunteers"] },
    ],
  },
  help: {
    items: [
      // place: where the request form and the meeting card say you meet.
      { icon: "walk", title: "المشي", place: "حديقة الملك عبدالله، الملز" },
      { icon: "shopping", title: "التسوق", place: "الرياض بارك، العقيق" },
      { icon: "hospital", title: "المستشفى", place: "مستشفى د. سليمان الحبيب، العليا" },
      { icon: "gov", title: "الجهات الحكومية", place: "الأحوال المدنية، الملز" },
      { icon: "transport", title: "التنقل", place: "محطة مترو العليا" },
      { icon: "other", title: "احتياجات أخرى", place: "برج المملكة، العليا" },
    ],
  },
  // The promise in one sentence (PRODUCT.md positioning); its words light up on scroll.
  manifesto: "رفيقي ليس توصيلًا ولا رعاية. هو شخص موثّق من مجتمعك، يلقاك في المكان الذي تختاره، ويمشي معك.",
  before: {
    title: "اطلب رفيقًا في دقيقة",
    lead: "اختر نوع المساعدة، وحدّد التاريخ ووقت البداية والنهاية، واكتب ما تحتاجه.",
    panelTitle: "بماذا تحتاج رفيقًا؟",
    panelText: "ستة أنواع من المساعدة، من نزهة قصيرة إلى مراجعة الجهات الحكومية.",
    screen: {
      src: "/screens/request-crop.png",
      w: 787,
      h: 1115,
      alt: "نموذج طلب رفيقي لنوع المساعدة المختار: تاريخ اللقاء، ووقت البداية والنهاية، واسم الطلب ووصفه، وموقعه، وزر تأكيد الطلب",
    },
  },
  way: {
    title: "حدّد مكان اللقاء",
    lead: "ابحث عن المكان أو استخدم موقعك الحالي، فيعرف المتطوع أين يلقاك وكم يبعد عنك.",
    panelTitle: "طريقان يلتقيان عند نقطة واحدة",
    panelText: "أنت والمتطوع تصلان إلى المكان الذي اخترته.",
    meeting: "موقع اللقاء",
    away: "كم عن موقعك",
    pause: "إيقاف حركة الخريطة",
    screen: {
      src: "/screens/map-crop.png",
      w: 784,
      h: 1048,
      alt: "بحث عن «مستشفى الحبيب» مع اقتراحات للمواقع، وخريطة الرياض عليها دبوس اللقاء وزر «استخدم موقعي الحالي»",
    },
  },
  meet: {
    title: "تابع طلبك حتى يصل رفيقك",
    lead: "يقبل متطوع موثّق طلبك، فتتابع حالته خطوة بخطوة وتتواصل معه مباشرة.",
    panelTitle: "كل حالة أمامك",
    panelText: "من «جديد» إلى «المتطوع وصل»، وتتواصلان داخل التطبيق.",
    steps: [
      { label: "جديد", text: "ترسل طلبك." },
      { label: "قبول متطوع", text: "يقبله متطوع موثّق، فيُسند إليه." },
      { label: "المتطوع وصل", text: "يصل إلى نقطة اللقاء، وتتواصلان داخل التطبيق." },
    ],
    arrived: "المتطوع وصل",
    pause: "إيقاف حركة المسار",
    screen: {
      src: "/screens/status-crop.png",
      w: 785,
      h: 468,
      alt: "الطلب رقم 481 «اجتماع عمل» بحالة «المتطوع وصل»، مع صاحب الطلب ونوعه ومكانه وموعده",
    },
  },
  trust: {
    title: "من يرافقك؟",
    licence: "1053",
    items: [
      { icon: "verified", title: "هوية موثّقة عبر نفاذ", text: "كل متطوع في رفيقي موثّقة هويته عبر نفاذ." },
      { icon: "chat", title: "المراسلة بعد القبول", text: "تبدأ المحادثة مع المتطوع بعد أن يقبل طلبك." },
      {
        icon: "association",
        title: "من جمعية لأجلهم",
        text: "جمعية مسجلة لدى وزارة الموارد البشرية والتنمية الاجتماعية بترخيص رقم 1053.",
      },
    ],
  },
  volunteers: {
    title: "تطوّع وكن رفيقًا",
    lead: "ساعد شخصًا من ذوي الإعاقة في مشواره، في الوقت الذي يناسبك.",
    points: [
      "تصفّح الطلبات القريبة مرتبة حسب الأقرب إليك أو الأحدث أو الأقرب موعدًا.",
      "اقبل الطلب الذي يناسبك، فيُسند إليك مباشرة.",
      "تواصل مع صاحب الطلب واتفقا على التفاصيل.",
    ],
    hours: "تُحتسب ساعات تطوعك وتظهر في أبشر.",
    screen: {
      src: "/screens/requests-crop.png",
      w: 804,
      h: 554,
      alt: "الطلبات مرتبة حسب الأقرب إليك، وأولها «حضور موعد أسنان» في مستشفى د. سليمان الحبيب على بُعد 2.5 كم",
    },
  },
  faq: {
    title: "أسئلة شائعة",
    help: "لم تجد إجابتك؟ اتصل بجمعية لأجلهم على",
    items: [
      { q: "هل التطبيق مجاني؟", a: "نعم، رفيقي مجاني على iPhone وiPad وAndroid." },
      { q: "من هم المتطوعون؟", a: "متطوعون من المجتمع، وكل واحد منهم موثّقة هويته عبر نفاذ." },
      {
        q: "بماذا يمكنني أن أطلب المساعدة؟",
        a: "المشي، والتسوق، وزيارة المستشفى، ومراجعة الجهات الحكومية، والتنقل، واحتياجات أخرى.",
      },
      { q: "على أي أجهزة يعمل؟", a: "على iPhone وiPad بنظام iOS 13 أو أحدث، وعلى أجهزة Android." },
      { q: "كيف أصبح متطوعًا؟", a: "حمّل التطبيق، ووثّق هويتك عبر نفاذ، ثم تصفّح الطلبات واقبل ما يناسبك." },
      { q: "هل تُحتسب ساعات التطوع؟", a: "نعم، تُحتسب ساعات تطوعك وتظهر في أبشر." },
    ],
  },
  close: {
    title: "حمّل رفيقي",
    qrHint: "أو امسح الرمز بكاميرا جوالك:",
    qrAppStore: "رمز QR يفتح رفيقي في App Store",
    qrGooglePlay: "رمز QR يفتح رفيقي في Google Play",
    text: "رفيقك في الطريق. مجاني على iPhone وiPad وAndroid.",
    screenAlt: "شاشة الترحيب في تطبيق رفيقي: شعار رفيقي فوق موجات زرقاء",
  },
  footer: {
    label: "روابط التطبيق",
    contact: "تواصل مع جمعية لأجلهم",
    phone: "920019904",
    by: "تطبيق رفيقي من جمعية لأجلهم لخدمة الأشخاص ذوي الإعاقة.",
    association: "موقع جمعية لأجلهم",
    concept: "هذه صفحة تصوّر تجريبية، وليست تابعة لجمعية لأجلهم.",
    privacy: "سياسة الخصوصية",
  },
};

export type Content = typeof ar;

// The request form in the Ask chapter, filled in for each kind of help
// (its place comes from help.items). Always Arabic, like the app;
// illustrative, not real requests.
export const requestFills: Record<string, { name: string; text: string }> = {
  walk: { name: "نزهة مسائية في الحديقة", text: "أمشي نصف ساعة كل مساء وأحتاج من يرافقني" },
  shopping: { name: "شراء احتياجات الأسبوع", text: "أحتاج من يساعدني في التسوق وحمل الأغراض" },
  hospital: { name: "حضور موعد أسنان", text: "موعدي العاشرة صباحًا وأحتاج من يرافقني" },
  gov: { name: "تجديد الهوية الوطنية", text: "أحتاج من يساعدني في إنهاء الإجراءات" },
  transport: { name: "ركوب المترو إلى العمل", text: "أحتاج من يرشدني في المحطة حتى أصل" },
  other: { name: "مرافقة لحضور اجتماع", text: "اجتماع عمل وأحتاج من يرافقني إلى القاعة" },
};
