import type { Lang, OrderStatus } from "./coddz";

export interface TranslationBundle {
  common: {
    loading: string;
    empty: string;
    loadMore: string;
    save: string;
    cancel: string;
    close: string;
    search: string;
    all: string;
    view: string;
    call: string;
    confirm: string;
    postpone: string;
    refuse: string;
    noAnswer: string;
    add: string;
    edit: string;
    delete: string;
    create: string;
    back: string;
    next: string;
    skip: string;
    finish: string;
    yes: string;
    no: string;
  };
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    faq: string;
    dashboard: string;
    orders: string;
    customers: string;
    products: string;
    overview: string;
    signIn: string;
    signOut: string;
    startFree: string;
    landing: string;
    home: string;
    confirmation: string;
    delivery: string;
    shipments: string;
    inventory: string;
    analytics: string;
    expenses: string;
    team: string;
    integrations: string;
    settings: string;
    live: string;
    reconnecting: string;
    offline: string;
    comingSoon: string;
    comingSoonSub: string;
    yourStore: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statOrders: string;
    statWilayas: string;
    statCarriers: string;
  };
  landing: {
    featuresTitle: string;
    featuresSub: string;
    stepsTitle: string;
    carriersTitle: string;
    carriersSub: string;
    pricingTitle: string;
    pricingSub: string;
    testimonialsTitle: string;
    faqTitle: string;
    footerNote: string;
    monthly: string;
    popular: string;
    choosePlan: string;
  };
  status: Record<OrderStatus, string>;
  dashboard: {
    title: string;
    subtitle: string;
    todayOrders: string;
    revenue: string;
    awaitingConfirmation: string;
    inDelivery: string;
    confirmRate: string;
    deliveryRate: string;
    returnRate: string;
    noData: string;
    chartTitle: string;
    day: string;
    week: string;
    month: string;
    topProducts: string;
    recentOrders: string;
    viewAll: string;
    unitsSold: string;
  };
  orders: {
    title: string;
    subtitle: string;
    newOrder: string;
    confirmAndSend: string;
    searchPlaceholder: string;
    allStatuses: string;
    allWilayas: string;
    allCarriers: string;
    bulkMark: string;
    exportSelected: string;
    selected: string;
    customer: string;
    phone: string;
    wilaya: string;
    product: string;
    amount: string;
    carrier: string;
    statusCol: string;
    date: string;
    actions: string;
    call: string;
    whatsapp: string;
    details: string;
    notes: string;
    notesPlaceholder: string;
    timeline: string;
    save: string;
    cancel: string;
    emptyTitle: string;
    emptySub: string;
    invalidPhone: string;
    whatsappTemplate: string;
  };
  products: {
    title: string;
    subtitle: string;
    addProduct: string;
    editProduct: string;
    searchPlaceholder: string;
    allCategories: string;
    name: string;
    price: string;
    cost: string;
    margin: string;
    stock: string;
    category: string;
    sku: string;
    variants: string;
    image: string;
    lowStock: string;
    inStock: string;
    delete: string;
    edit: string;
    save: string;
    cancel: string;
    emptyTitle: string;
    emptySub: string;
  };
  delivery: {
    title: string;
    subtitle: string;
    avg: string;
    connected: string;
    ready: string;
    noShipments: string;
  };
  shipments: {
    title: string;
    subtitle: string;
    new: string;
    order: string;
    carrier: string;
    tracking: string;
    cod: string;
    status: string;
    actions: string;
    create: string;
    selectOrder: string;
    trackingNumber: string;
    codAmount: string;
    createBtn: string;
    cancel: string;
    noShipments: string;
    pending: string;
    shipped: string;
    inTransit: string;
    delivered: string;
    returned: string;
    canceled: string;
    ship: string;
    deliver: string;
    return: string;
    chooseOrder: string;
  };
  expenses: {
    title: string;
    subtitle: string;
    totalExpenses: string;
    totalAds: string;
    addExpense: string;
    amount: string;
    note: string;
    add: string;
    category: string;
    date: string;
    noExpenses: string;
    addCampaign: string;
    platform: string;
    noCampaigns: string;
  };
  confirmation: {
    title: string;
    pendingCalls: string;
    confirmedToday: string;
    confirmRate: string;
    noPending: string;
    confirm: string;
    postpone: string;
    noAnswer: string;
    refuse: string;
    attempt: string;
  };
  analytics: {
    title: string;
    netRevenue: string;
    deliveryRate: string;
    returnRate: string;
    avgOrder: string;
    netProfit: string;
    monthlySales: string;
    last6Months: string;
    topWilayas: string;
    returns: string;
    noData: string;
  };
  team: {
    title: string;
    totalMembers: string;
    activeAgents: string;
    pendingInvites: string;
    invite: string;
    all: string;
    phone: string;
    phoneConfirm: string;
    shipping: string;
    inviteSent: string;
    inviteMember: string;
    storeManager: string;
    agent: string;
    stockKeeper: string;
    active: string;
    pending: string;
  };
  settings: {
    title: string;
    subtitle: string;
    storeIdentity: string;
    verified: string;
    saveChanges: string;
    basicData: string;
    storeName: string;
    defaultWilaya: string;
    supportPhone: string;
    preferences: string;
    autoConfirm: string;
    autoConfirmHint: string;
    smsOnDelivery: string;
    smsOnDeliveryHint: string;
    lowStockAlert: string;
    lowStockAlertHint: string;
    accountMgmt: string;
    accountMgmtSub: string;
    pauseStore: string;
  };
  inventory: {
    title: string;
    subtitle: string;
    totalProducts: string;
    lowStock: string;
    stockValue: string;
    searchPlaceholder: string;
    all: string;
    low: string;
    out: string;
    addProduct: string;
    sku: string;
    product: string;
    category: string;
    available: string;
    price: string;
    status: string;
    actions: string;
    inStock: string;
    lowStockLabel: string;
    outOfStock: string;
    products: string;
    movements: string;
    noProducts: string;
    noMovements: string;
    adjustStock: string;
    change: string;
    reason: string;
    time: string;
    adjustTitle: string;
    invalidQty: string;
    stockAdjusted: string;
    error: string;
  };
  integrations: {
    title: string;
    subtitle: string;
    notAuthorized: string;
    notAuthorizedSub: string;
    api: string;
    shopify: string;
    woocommerce: string;
    logs: string;
    intakeLogs: string;
    endpoint: string;
    copy: string;
    apiKeys: string;
    createKey: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
    status: string;
    actions: string;
    revoked: string;
    active: string;
    revoke: string;
    noKeys: string;
    keyName: string;
    keyNameRequired: string;
    keyCreated: string;
    keyWarning: string;
    close: string;
    create: string;
    cancel: string;
    error: string;
    docs: string;
    docsIntro: string;
    fields: string;
    field: string;
    type: string;
    required: string;
    description: string;
    yes: string;
    no: string;
    customerName: string;
    phone: string;
    phoneDesc: string;
    wilaya: string;
    wilayaDesc: string;
    commune: string;
    address: string;
    deliveryType: string;
    deliveryPrice: string;
    notes: string;
    items: string;
    externalId: string;
    webhookUrl: string;
    state: string;
    activeStatus: string;
    paused: string;
    signingSecret: string;
    pasteSecret: string;
    saveSecret: string;
    secretSaved: string;
    secretRequired: string;
    setupSteps: string;
    step1Shopify: string;
    step2Shopify: string;
    step3Shopify: string;
    step4Shopify: string;
    step1Woo: string;
    step2Woo: string;
    step3Woo: string;
    step4Woo: string;
    noLogs: string;
    source: string;
    logStatus: string;
    logError: string;
    logTime: string;
    details: string;
    payload: string;
    accepted: string;
    rejected: string;
    duplicate: string;
  };
  onboarding: {
    title: string;
    storeInfo: string;
    storeName: string;
    storeNameRequired: string;
    selectWilaya: string;
    searchWilaya: string;
    deliveryCompanies: string;
    optional: string;
    saveError: string;
    phone: string;
    invalidPhone: string;
    businessType: string;
    selectBusinessType: string;
    salesChannels: string;
    monthlyOrders: string;
    selectMonthlyOrders: string;
    team: string;
    solo: string;
    withTeam: string;
    agentsCount: string;
    logo: string;
    chooseImage: string;
    defaultDelivery: string;
    homeDelivery: string;
    deskDelivery: string;
    preparing: string;
    preparingSub: string;
    steps: string[];
  };
  auth: {
    signInTitle: string;
    signUpTitle: string;
    forgotTitle: string;
    resetTitle: string;
    email: string;
    password: string;
    newPassword: string;
    displayName: string;
    storeName: string;
    signInBtn: string;
    signUpBtn: string;
    continueWithGoogle: string;
    sendResetBtn: string;
    updatePasswordBtn: string;
    forgotLink: string;
    noAccount: string;
    hasAccount: string;
    backToSignIn: string;
    checkEmail: string;
    resetSent: string;
    passwordUpdated: string;
    recoveryMissing: string;
  };
}

const ar: TranslationBundle = {
  common: {
    loading: "جارٍ التحميل...",
    empty: "لا توجد بيانات",
    loadMore: "تحميل المزيد",
    save: "حفظ",
    cancel: "إلغاء",
    close: "إغلاق",
    search: "بحث",
    all: "الكل",
    view: "عرض",
    call: "اتصال",
    confirm: "تأكيد",
    postpone: "تأجيل",
    refuse: "إلغاء",
    noAnswer: "لا يرد",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    create: "إنشاء",
    back: "رجوع",
    next: "التالي",
    skip: "تخطي",
    finish: "إنهاء",
    yes: "نعم",
    no: "لا",
  },
  nav: {
    features: "المميزات",
    howItWorks: "كيف يعمل",
    pricing: "الأسعار",
    faq: "الأسئلة الشائعة",
    dashboard: "لوحة التحكم",
    orders: "الطلبات",
    customers: "الزبائن",
    products: "المنتجات",
    overview: "نظرة عامة",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    startFree: "ابدأ مجاناً",
    landing: "الصفحة الرئيسية",
    home: "الرئيسية",
    confirmation: "التأكيد",
    delivery: "التوصيل",
    shipments: "الشحنات",
    inventory: "المخزون",
    analytics: "الإحصائيات",
    expenses: "المصاريف",
    team: "الفريق",
    integrations: "الربط",
    settings: "الإعدادات",
    live: "مباشر",
    reconnecting: "إعادة الاتصال",
    offline: "غير متصل",
    comingSoon: "قريبًا",
    comingSoonSub: "هذه الصفحة قيد التطوير. سنضيفها قريبًا.",
    yourStore: "متجرك",
  },
  hero: {
    eyebrow: "مصمم خصيصاً للتجارة الإلكترونية في الجزائر",
    title: "أدر متجرك وطلبات الدفع عند الاستلام من مكان واحد",
    subtitle: "من إنشاء صفحة المنتج إلى تأكيد الطلبات، الربط مع شركات التوصيل في 58 ولاية، تتبع المرتجعات وحساب أرباحك الصافية بالدينار الجزائري.",
    ctaPrimary: "ابدأ مجاناً",
    ctaSecondary: "كيف يعمل",
    statOrders: "تأكيد أسرع للطلبات",
    statWilayas: "ولاية مغطاة",
    statCarriers: "شركات توصيل جزائرية",
  },
  landing: {
    featuresTitle: "كل ما يحتاجه تاجر الدفع عند الاستلام",
    featuresSub: "أدوات عملية تختصر ساعات من العمل اليدوي وتقلل نسبة المرتجعات.",
    stepsTitle: "ابدأ البيع في 3 خطوات بسيطة",
    carriersTitle: "متوافق مع أشهر شركات التوصيل في الجزائر",
    carriersSub: "أرسل الطرود بنقرة واحدة، اطبع البوليصة وتابع حالة التوصيل تلقائياً.",
    pricingTitle: "خطط شفافة تناسب حجم متجرك",
    pricingSub: "ابدأ مجاناً وقم بالترقية مع نمو طلباتك اليومية.",
    testimonialsTitle: "ثقة تجار جزائريين في مختلف الولايات",
    faqTitle: "الأسئلة الشائعة",
    footerNote: "منصة جزائرية متكاملة لإدارة التجارة الإلكترونية والدفع عند الاستلام.",
    monthly: "/ شهرياً",
    popular: "الأكثر طلباً",
    choosePlan: "اختر الخطة",
  },
  status: {
    new: "جديد",
    confirmed: "مؤكد",
    shipped: "قيد التوصيل",
    delivered: "تم التوصيل",
    returned: "مرتجع",
    canceled: "ملغى",
  },
  dashboard: {
    title: "نظرة عامة",
    subtitle: "ملخص أداء متجرك اليومي ونسب التأكيد والتوصيل",
    todayOrders: "طلبات اليوم",
    revenue: "المبيعات",
    awaitingConfirmation: "بانتظار التأكيد",
    inDelivery: "قيد التوصيل",
    confirmRate: "نسبة التأكيد",
    deliveryRate: "نسبة التوصيل",
    returnRate: "نسبة المرتجعات",
    noData: "لا توجد بيانات بعد. أضف طلبًا أو منتجًا للبدء.",
    chartTitle: "تطور الطلبات والمبيعات",
    day: "يومي",
    week: "أسبوعي",
    month: "شهري",
    topProducts: "أكثر المنتجات مبيعاً",
    recentOrders: "أحدث الطلبات",
    viewAll: "عرض الكل",
    unitsSold: "طلب",
  },
  orders: {
    title: "إدارة الطلبات",
    subtitle: "تأكيد الطلبات، التصفية حسب الولاية وشركة التوصيل، والتواصل السريع",
    newOrder: "طلب جديد",
    confirmAndSend: "تأكيد وإرسال",
    searchPlaceholder: "ابحث بالاسم، الهاتف أو رقم الطلب...",
    allStatuses: "كل الحالات",
    allWilayas: "كل الولايات",
    allCarriers: "كل شركات التوصيل",
    bulkMark: "تحديث الحالة المحددة",
    selected: "محدد",
    exportSelected: "تصدير المحدد",
    customer: "الزبون",
    phone: "الهاتف",
    wilaya: "الولاية",
    product: "المنتج",
    amount: "المبلغ",
    carrier: "التوصيل",
    statusCol: "الحالة",
    date: "التاريخ",
    actions: "إجراءات",
    call: "اتصال",
    whatsapp: "واتساب",
    details: "التفاصيل",
    notes: "ملاحظات داخلية",
    notesPlaceholder: "مثال: الزبون طلب التوصيل بعد الساعة 17:00...",
    timeline: "سجل الطلب",
    save: "حفظ التغييرات",
    cancel: "إلغاء",
    emptyTitle: "لا توجد طلبات مطابقة",
    emptySub: "جرّب تغيير الفلاتر أو أضف أول طلب لمتجرك الآن.",
    invalidPhone: "أدخل رقم هاتف جزائري صحيح (05 / 06 / 07 أو +213)",
    whatsappTemplate: "مرحباً {name}، نؤكد معك طلبك رقم {number} ({product}) بمبلغ {amount} إلى ولاية {wilaya}.",
  },
  products: {
    title: "المنتجات والمخزون",
    subtitle: "أدر أسعار البيع والتكلفة، المخزون، والمتغيرات لمتجرك",
    addProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    searchPlaceholder: "ابحث باسم المنتج أو رمز SKU...",
    allCategories: "كل التصنيفات",
    name: "اسم المنتج",
    price: "سعر البيع (DA)",
    cost: "سعر التكلفة (DA)",
    margin: "الهامش",
    stock: "المخزون",
    category: "التصنيف",
    sku: "رمز SKU",
    variants: "المتغيرات (مقاس / لون)",
    image: "صورة المنتج",
    lowStock: "مخزون منخفض",
    inStock: "متوفر",
    delete: "حذف",
    edit: "تعديل",
    save: "حفظ المنتج",
    cancel: "إلغاء",
    emptyTitle: "لا توجد منتجات بعد",
    emptySub: "أضف منتجك الأول لتبدأ استقبال طلبات الدفع عند الاستلام.",
  },
  delivery: {
    title: "التوصيل",
    subtitle: "أداء التسليم حسب شركة التوصيل",
    avg: "متوسط",
    connected: "متصل",
    ready: "جاهز للربط",
    noShipments: "لا توجد شحنات",
  },
  shipments: {
    title: "الشحنات",
    subtitle: "تتبع شحناتك وشركات التوصيل",
    new: "شحنة جديدة",
    order: "الطلب",
    carrier: "الناقل",
    tracking: "رقم التتبع",
    cod: "COD",
    status: "الحالة",
    actions: "إجراءات",
    create: "إنشاء",
    selectOrder: "اختر طلبًا",
    trackingNumber: "رقم التتبع",
    codAmount: "مبلغ COD",
    createBtn: "إنشاء",
    cancel: "إلغاء",
    noShipments: "لا توجد شحنات",
    pending: "قيد الانتظار",
    shipped: "تم الشحن",
    inTransit: "قيد التوصيل",
    delivered: "تم التسليم",
    returned: "مرتجع",
    canceled: "ملغى",
    ship: "شحن",
    deliver: "تسليم",
    return: "إرجاع",
    chooseOrder: "اختر طلبًا",
  },
  expenses: {
    title: "المصاريف والحملات",
    subtitle: "تتبع المصاريف وإعلاناتك",
    totalExpenses: "إجمالي المصاريف",
    totalAds: "إجمالي الإعلانات",
    addExpense: "إضافة مصروف",
    amount: "المبلغ",
    note: "ملاحظة",
    add: "إضافة",
    category: "التصنيف",
    date: "التاريخ",
    noExpenses: "لا توجد مصاريف",
    addCampaign: "إضافة حملة إعلانية",
    platform: "المنصة",
    noCampaigns: "لا توجد حملات",
  },
  confirmation: {
    title: "التأكيد",
    pendingCalls: "بانتظار الاتصال",
    confirmedToday: "مؤكدة اليوم",
    confirmRate: "معدل التأكيد",
    noPending: "لا توجد طلبات بانتظار التأكيد",
    confirm: "تأكيد الطلب",
    postpone: "تأجيل",
    noAnswer: "لا يرد",
    refuse: "إلغاء",
    attempt: "المحاولة",
  },
  analytics: {
    title: "الإحصائيات",
    netRevenue: "صافي المداخيل (الشهر)",
    deliveryRate: "نسبة التسليم الناجح",
    returnRate: "نسبة المرتجعات",
    avgOrder: "متوسط قيمة الطلب",
    netProfit: "صافي الربح",
    monthlySales: "تطور المبيعات الشهرية",
    last6Months: "آخر 6 أشهر",
    topWilayas: "أعلى الولايات طلبًا",
    returns: "المرتجعات",
    noData: "لا توجد بيانات",
  },
  team: {
    title: "الفريق",
    totalMembers: "إجمالي الأعضاء",
    activeAgents: "فريق التأكيد النشط",
    pendingInvites: "دعوات معلقة",
    invite: "دعوة عضو جديد",
    all: "الكل",
    phone: "التأكيد الهاتفي",
    phoneConfirm: "التأكيد الهاتفي",
    shipping: "تجهيز الشحنات",
    inviteSent: "سيتم إرسال دعوة بالبريد الإلكتروني.",
    inviteMember: "دعوة عضو جديد",
    storeManager: "مدير المتجر",
    agent: "تأكيد الطلبات",
    stockKeeper: "تجهيز الشحنات",
    active: "نشط",
    pending: "دعوة معلقة",
  },
  settings: {
    title: "الإعدادات",
    subtitle: "تخصيص بيانات متجرك وتفضيلات التأكيد والشحن",
    storeIdentity: "متجرك",
    verified: "حساب موثق",
    saveChanges: "حفظ التغييرات",
    basicData: "البيانات الأساسية",
    storeName: "اسم المتجر",
    defaultWilaya: "ولاية الانطلاق الافتراضية",
    supportPhone: "رقم هاتف الدعم",
    preferences: "تفضيلات التأكيد والتوصيل",
    autoConfirm: "تأكيد تلقائي للعملاء الموثوقين",
    autoConfirmHint: "تجاوز الاتصال الهاتفي للعملاء بنسبة استلام 100%",
    smsOnDelivery: "إشعار SMS عند تسليم الطرد للناقل",
    smsOnDeliveryHint: "إرسال رقم التتبع تلقائيًا عبر الرسائل القصيرة",
    lowStockAlert: "تنبيه انخفاض المخزون",
    lowStockAlertHint: "إرسال إشعار عند وصول الكمية إلى أقل من 10 قطع",
    accountMgmt: "إدارة الحساب والبيانات",
    accountMgmtSub: "تعطيل استقبال الطلبات مؤقتًا أو إغلاق المتجر",
    pauseStore: "إيقاف المتجر مؤقتًا",
  },
  inventory: {
    title: "المخزون",
    subtitle: "أدر المخزون والحركات",
    totalProducts: "إجمالي المنتجات",
    lowStock: "مخزون منخفض",
    stockValue: "قيمة المخزون الحالية",
    searchPlaceholder: "ابحث باسم المنتج أو رمز SKU...",
    all: "الكل",
    low: "منخفض",
    out: "نفذت الكمية",
    addProduct: "إضافة منتج",
    sku: "رمز SKU",
    product: "المنتج",
    category: "التصنيف",
    available: "المتوفر",
    price: "سعر البيع",
    status: "الحالة",
    actions: "إجراءات",
    inStock: "متوفر",
    lowStockLabel: "مخزون منخفض",
    outOfStock: "نفذت الكمية",
    products: "المنتجات",
    movements: "الحركات",
    noProducts: "لا توجد منتجات",
    noMovements: "لا توجد حركات",
    adjustStock: "تعديل المخزون",
    change: "التغيير",
    reason: "السبب",
    time: "الوقت",
    adjustTitle: "تعديل المخزون",
    invalidQty: "أدخل كمية صحيحة",
    stockAdjusted: "تم تعديل المخزون",
    error: "خطأ",
  },
  integrations: {
    title: "الربط",
    subtitle: "ربط المتجر بقنوات البيع وAPI",
    notAuthorized: "غير مصرح",
    notAuthorizedSub: "هذه الصفحة للمدراء فقط",
    api: "API",
    shopify: "Shopify",
    woocommerce: "WooCommerce",
    logs: "السجلات",
    endpoint: "نقطة النهاية (Endpoint)",
    copy: "نسخ",
    apiKeys: "مفاتيح API",
    createKey: "إنشاء مفتاح",
    name: "الاسم",
    prefix: "البادئة",
    created: "الإنشاء",
    lastUsed: "آخر استخدام",
    status: "الحالة",
    actions: "إجراءات",
    revoked: "ملغى",
    active: "نشط",
    revoke: "إلغاء",
    noKeys: "لا توجد مفاتيح",
    keyName: "اسم المفتاح",
    keyNameRequired: "اسم المفتاح مطلوب",
    keyCreated: "تم إنشاء المفتاح",
    keyWarning: "انسخ هذا المفتاح الآن. لن يتم عرضه مرة أخرى.",
    close: "إغلاق",
    create: "إنشاء",
    cancel: "إلغاء",
    error: "خطأ",
    docs: "التوثيق",
    docsIntro: "أرسل POST إلى نقطة النهاية مع رأس x-api-key.",
    fields: "الحقول",
    field: "الحقل",
    type: "النوع",
    required: "مطلوب",
    description: "الوصف",
    yes: "نعم",
    no: "لا",
    customerName: "اسم الزبون",
    phone: "رقم هاتف جزائري",
    phoneDesc: "رقم هاتف جزائري",
    wilaya: "اسم أو رمز الولاية",
    wilayaDesc: "اسم أو رمز الولاية",
    commune: "البلدية",
    address: "العنوان",
    deliveryType: "نوع التوصيل (افتراضي home)",
    deliveryPrice: "سعر التوصيل",
    notes: "ملاحظات",
    items: "المنتجات",
    externalId: "معرّف خارجي",
    webhookUrl: "عنوان الـ Webhook",
    state: "الحالة",
    activeStatus: "نشط",
    paused: "متوقف",
    signingSecret: "سر التوقيع (Signing secret)",
    pasteSecret: "الصق السر هنا",
    saveSecret: "حفظ السر",
    secretSaved: "تم حفظ السر",
    secretRequired: "السر مطلوب",
    setupSteps: "خطوات الإعداد",
    step1Shopify: "في Shopify، اذهب إلى Settings → Notifications → Webhooks.",
    step2Shopify: "أنشئ webhook جديدًا: Event = Order creation.",
    step3Shopify: "Format = JSON، URL = عنوان الـ webhook أعلاه.",
    step4Shopify: "انسخ signing secret والصقه هنا، ثم فعّل التكامل.",
    step1Woo: "في WooCommerce، اذهب إلى Settings → Advanced → Webhooks.",
    step2Woo: "أضف webhook جديدًا: Topic = Order created.",
    step3Woo: "Delivery URL = عنوان الـ webhook أعلاه.",
    step4Woo: "Secret = أي نص، انسخه والصقه هنا، ثم فعّل التكامل.",
    intakeLogs: "سجلات الاستقبال",
    noLogs: "لا توجد سجلات",
    source: "المصدر",
    logStatus: "الحالة",
    logError: "الخطأ",
    logTime: "الوقت",
    details: "التفاصيل",
    payload: "الحمولة (Payload)",
    accepted: "مقبول",
    rejected: "مرفوض",
    duplicate: "مكرر",
  },
  onboarding: {
    title: "إعداد متجرك",
    storeInfo: "معلومات متجرك",
    storeName: "اسم المتجر",
    storeNameRequired: "اسم المتجر مطلوب",
    selectWilaya: "يرجى اختيار الولاية",
    searchWilaya: "ابحث عن ولاية...",
    deliveryCompanies: "شركات التوصيل (اختياري)",
    optional: "اختياري",
    saveError: "خطأ في حفظ شركات التوصيل",
    phone: "رقم الهاتف (WhatsApp)",
    invalidPhone: "رقم هاتف غير صالح",
    businessType: "نوع النشاط",
    selectBusinessType: "يرجى اختيار نوع النشاط",
    salesChannels: "قنوات البيع (اختيار متعدد)",
    monthlyOrders: "عدد الطلبات شهريًا",
    selectMonthlyOrders: "يرجى اختيار حجم الطلبات",
    team: "فريق العمل",
    solo: "أنا فقط",
    withTeam: "مع فريق",
    agentsCount: "عدد الموظفين",
    logo: "شعار المتجر (اختياري)",
    chooseImage: "اختر صورة",
    defaultDelivery: "نوع التوصيل الافتراضي",
    homeDelivery: "توصيل للمنزل",
    deskDelivery: "توصيل للمكتب",
    preparing: "جارٍ إعداد مساحة عملك",
    preparingSub: "يرجى الانتظار قليلاً...",
    steps: ["إعداد متجرك", "تجهيز المنتجات", "ربط التوصيل", "تخصيص لوحة التحكم"],
  },
  auth: {
    signInTitle: "تسجيل الدخول إلى متجرك",
    signUpTitle: "إنشاء حساب تاجر مجاني",
    forgotTitle: "استعادة كلمة المرور",
    resetTitle: "تعيين كلمة مرور جديدة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    displayName: "الاسم الكامل",
    storeName: "اسم المتجر",
    signInBtn: "دخول",
    signUpBtn: "إنشاء الحساب",
    continueWithGoogle: "المتابعة بـ Google",
    sendResetBtn: "إرسال رابط الاستعادة",
    updatePasswordBtn: "تحديث كلمة المرور",
    forgotLink: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟ أنشئ متجرك",
    hasAccount: "لديك حساب بالفعل؟ سجّل الدخول",
    backToSignIn: "العودة لتسجيل الدخول",
    checkEmail: "تحقق من بريدك الإلكتروني لتأكيد حسابك ثم سجّل الدخول.",
    resetSent: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
    passwordUpdated: "تم تحديث كلمة المرور بنجاح.",
    recoveryMissing: "رابط الاستعادة غير صالح أو منتهي الصلاحية. اطلب رابطاً جديداً.",
  },
};

const fr: TranslationBundle = {
  common: {
    loading: "Chargement...",
    empty: "Aucune donnée",
    loadMore: "Charger plus",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    search: "Rechercher",
    all: "Tous",
    view: "Voir",
    call: "Appeler",
    confirm: "Confirmer",
    postpone: "Reporter",
    refuse: "Refuser",
    noAnswer: "Pas de réponse",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    create: "Créer",
    back: "Retour",
    next: "Suivant",
    skip: "Passer",
    finish: "Terminer",
    yes: "Oui",
    no: "Non",
  },
  nav: {
    features: "Fonctionnalités",
    howItWorks: "Comment ça marche",
    pricing: "Tarifs",
    faq: "FAQ",
    dashboard: "Tableau de bord",
    orders: "Commandes",
    customers: "Clients",
    products: "Produits",
    overview: "Aperçu",
    signIn: "Connexion",
    signOut: "Déconnexion",
    startFree: "Commencer gratuitement",
    landing: "Accueil",
    home: "Accueil",
    confirmation: "Confirmation",
    delivery: "Livraison",
    shipments: "Expéditions",
    inventory: "Stock",
    analytics: "Statistiques",
    expenses: "Dépenses",
    team: "Équipe",
    integrations: "Intégrations",
    settings: "Paramètres",
    live: "En direct",
    reconnecting: "Reconnexion",
    offline: "Hors ligne",
    comingSoon: "Bientôt",
    comingSoonSub: "Cette page est en cours de développement. Elle arrivera bientôt.",
    yourStore: "Votre boutique",
  },
  hero: {
    eyebrow: "Conçu pour l’e-commerce COD en Algérie",
    title: "Gérez votre boutique et vos commandes COD au même endroit",
    subtitle: "Pages produits, confirmation d’appels, expédition dans les 58 wilayas, suivi des retours et marge nette en Dinar Algérien.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Comment ça marche",
    statOrders: "Confirmation plus rapide",
    statWilayas: "Wilayas couvertes",
    statCarriers: "Transporteurs algériens",
  },
  landing: {
    featuresTitle: "Tout pour piloter votre activité COD",
    featuresSub: "Des outils concrets pour confirmer plus vite et réduire vos retours.",
    stepsTitle: "Lancez-vous en 3 étapes simples",
    carriersTitle: "Prêt pour les transporteurs algériens",
    carriersSub: "Expédiez en un clic, suivez les colis et réconciliez vos encaissements.",
    pricingTitle: "Des forfaits clairs en Dinar Algérien",
    pricingSub: "Démarrez gratuitement puis évoluez selon votre volume.",
    testimonialsTitle: "Adopté par des marchands partout en Algérie",
    faqTitle: "Questions fréquentes",
    footerNote: "Plateforme tout-en-un dédiée au e-commerce Cash-on-Delivery en Algérie.",
    monthly: "/ mois",
    popular: "Populaire",
    choosePlan: "Choisir ce plan",
  },
  status: {
    new: "Nouveau",
    confirmed: "Confirmé",
    shipped: "Expédié",
    delivered: "Livré",
    returned: "Retour",
    canceled: "Annulé",
  },
  dashboard: {
    title: "Aperçu",
    subtitle: "Suivez vos commandes du jour, revenus et taux de livraison",
    todayOrders: "Commandes du jour",
    revenue: "Chiffre d’affaires",
    awaitingConfirmation: "En attente de confirmation",
    inDelivery: "En cours de livraison",
    confirmRate: "Taux de confirmation",
    deliveryRate: "Taux de livraison",
    returnRate: "Taux de retour",
    noData: "Aucune donnée pour le moment. Ajoutez une commande ou un produit.",
    chartTitle: "Évolution des commandes et revenus",
    day: "Jour",
    week: "Semaine",
    month: "Mois",
    topProducts: "Meilleures ventes",
    recentOrders: "Dernières commandes",
    viewAll: "Voir tout",
    unitsSold: "cmd",
  },
  orders: {
    title: "Commandes",
    subtitle: "Confirmez, filtrez par wilaya ou transporteur et suivez chaque colis",
    newOrder: "Nouvelle commande",
    confirmAndSend: "Confirmer et envoyer",
    searchPlaceholder: "Rechercher par nom, téléphone ou n°...",
    allStatuses: "Tous les statuts",
    allWilayas: "Toutes les wilayas",
    allCarriers: "Tous les transporteurs",
    bulkMark: "Appliquer à la sélection",
    selected: "sélectionné(s)",
    exportSelected: "Exporter la sélection",
    customer: "Client",
    phone: "Téléphone",
    wilaya: "Wilaya",
    product: "Produit",
    amount: "Montant",
    carrier: "Transporteur",
    statusCol: "Statut",
    date: "Date",
    actions: "Actions",
    call: "Appeler",
    whatsapp: "WhatsApp",
    details: "Détails",
    notes: "Notes internes",
    notesPlaceholder: "Ex : le client préfère une livraison après 17h...",
    timeline: "Historique",
    save: "Enregistrer",
    cancel: "Annuler",
    emptyTitle: "Aucune commande trouvée",
    emptySub: "Modifiez vos filtres ou créez une nouvelle commande.",
    invalidPhone: "Numéro algérien invalide (05 / 06 / 07 ou +213)",
    whatsappTemplate: "Bonjour {name}, nous confirmons votre commande {number} ({product}) de {amount} vers {wilaya}.",
  },
  products: {
    title: "Produits & Stock",
    subtitle: "Gérez vos prix en DA, marges, quantités et variantes",
    addProduct: "Ajouter un produit",
    editProduct: "Modifier le produit",
    searchPlaceholder: "Rechercher par nom ou SKU...",
    allCategories: "Toutes catégories",
    name: "Nom du produit",
    price: "Prix de vente (DA)",
    cost: "Prix d’achat (DA)",
    margin: "Marge",
    stock: "Stock",
    category: "Catégorie",
    sku: "SKU",
    variants: "Variantes (taille / couleur)",
    image: "Image produit",
    lowStock: "Stock faible",
    inStock: "En stock",
    delete: "Supprimer",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    emptyTitle: "Aucun produit pour le moment",
    emptySub: "Ajoutez votre premier produit pour démarrer votre catalogue.",
  },
  delivery: { title: "Livraison", subtitle: "Performance par transporteur", avg: "Moyenne", connected: "Connecté", ready: "Prêt", noShipments: "Aucune expédition" },
  shipments: { title: "Expéditions", subtitle: "Suivez vos expéditions", new: "Nouvelle", order: "Commande", carrier: "Transporteur", tracking: "Suivi", cod: "COD", status: "Statut", actions: "Actions", create: "Créer", selectOrder: "Choisir", trackingNumber: "N° de suivi", codAmount: "Montant COD", createBtn: "Créer", cancel: "Annuler", noShipments: "Aucune", pending: "En attente", shipped: "Expédié", inTransit: "En transit", delivered: "Livré", returned: "Retourné", canceled: "Annulé", ship: "Expédier", deliver: "Livrer", return: "Retourner", chooseOrder: "Choisir" },
  expenses: { title: "Dépenses et campagnes", subtitle: "Suivez vos dépenses", totalExpenses: "Total dépenses", totalAds: "Total pubs", addExpense: "Ajouter dépense", amount: "Montant", note: "Note", add: "Ajouter", category: "Catégorie", date: "Date", noExpenses: "Aucune", addCampaign: "Ajouter campagne", platform: "Plateforme", noCampaigns: "Aucune" },
  confirmation: { title: "Confirmation", pendingCalls: "En attente", confirmedToday: "Confirmées", confirmRate: "Taux", noPending: "Aucune en attente", confirm: "Confirmer", postpone: "Reporter", noAnswer: "Pas de réponse", refuse: "Refuser", attempt: "Tentative" },
  analytics: { title: "Statistiques", netRevenue: "Revenus nets", deliveryRate: "Taux livraison", returnRate: "Taux retour", avgOrder: "Panier moyen", netProfit: "Bénéfice net", monthlySales: "Ventes mensuelles", last6Months: "6 mois", topWilayas: "Top wilayas", returns: "Retours", noData: "Aucune donnée" },
  team: { title: "Équipe", totalMembers: "Membres", activeAgents: "Agents actifs", pendingInvites: "Invitations", invite: "Inviter", all: "Tous", phone: "Téléphone", phoneConfirm: "Confirmation", shipping: "Préparation", inviteSent: "Invitation envoyée.", inviteMember: "Inviter", storeManager: "Gérant", agent: "Agent", stockKeeper: "Stock", active: "Actif", pending: "En attente" },
  settings: { title: "Paramètres", subtitle: "Personnalisez", storeIdentity: "Boutique", verified: "Vérifié", saveChanges: "Enregistrer", basicData: "Données", storeName: "Nom", defaultWilaya: "Wilaya", supportPhone: "Téléphone", preferences: "Préférences", autoConfirm: "Confirmation auto", autoConfirmHint: "Ignorer l'appel", smsOnDelivery: "SMS livraison", smsOnDeliveryHint: "Envoyer le suivi", lowStockAlert: "Alerte stock", lowStockAlertHint: "Notifier", accountMgmt: "Compte", accountMgmtSub: "Désactiver", pauseStore: "Mettre en pause" },
  inventory: { title: "Stock", subtitle: "Gérez le stock", totalProducts: "Produits", lowStock: "Stock faible", stockValue: "Valeur", searchPlaceholder: "Rechercher...", all: "Tous", low: "Faible", out: "Rupture", addProduct: "Ajouter", sku: "SKU", product: "Produit", category: "Catégorie", available: "Disponible", price: "Prix", status: "Statut", actions: "Actions", inStock: "En stock", lowStockLabel: "Stock faible", outOfStock: "Rupture", products: "Produits", movements: "Mouvements", noProducts: "Aucun", noMovements: "Aucun", adjustStock: "Ajuster", change: "Changement", reason: "Raison", time: "Heure", adjustTitle: "Ajuster", invalidQty: "Quantité invalide", stockAdjusted: "Ajusté", error: "Erreur" },
  integrations: { title: "Intégrations", subtitle: "Connectez", notAuthorized: "Non autorisé", notAuthorizedSub: "Réservé", api: "API", shopify: "Shopify", woocommerce: "WooCommerce", logs: "Logs", endpoint: "Endpoint", copy: "Copier", apiKeys: "Clés", createKey: "Créer", name: "Nom", prefix: "Préfixe", created: "Créé", lastUsed: "Dernière utilisation", status: "Statut", actions: "Actions", revoked: "Révoquée", active: "Actif", revoke: "Révoquer", noKeys: "Aucune", keyName: "Nom", keyNameRequired: "Nom requis", keyCreated: "Créée", keyWarning: "Copiez maintenant", close: "Fermer", create: "Créer", cancel: "Annuler", error: "Erreur", docs: "Docs", docsIntro: "POST avec x-api-key", fields: "Champs", field: "Champ", type: "Type", required: "Requis", description: "Description", yes: "Oui", no: "Non", customerName: "Client", phone: "Tél algérien", phoneDesc: "Tél algérien", wilaya: "Wilaya", wilayaDesc: "Wilaya", commune: "Commune", address: "Adresse", deliveryType: "Type livraison", deliveryPrice: "Frais", notes: "Notes", items: "Produits", externalId: "ID externe", webhookUrl: "URL webhook", state: "Statut", activeStatus: "Actif", paused: "Pause", signingSecret: "Secret", pasteSecret: "Collez", saveSecret: "Enregistrer", secretSaved: "Enregistré", secretRequired: "Secret requis", setupSteps: "Étapes", step1Shopify: "Shopify settings", step2Shopify: "Créer webhook", step3Shopify: "Format JSON", step4Shopify: "Copier secret", step1Woo: "Woo settings", step2Woo: "Ajouter webhook", step3Woo: "Delivery URL", step4Woo: "Secret", intakeLogs: "Logs", noLogs: "Aucun", source: "Source", logStatus: "Statut", logError: "Erreur", logTime: "Heure", details: "Détails", payload: "Payload", accepted: "Accepté", rejected: "Rejeté", duplicate: "Doublon" },
  onboarding: { title: "Configuration", storeInfo: "Infos boutique", storeName: "Nom", storeNameRequired: "Nom requis", selectWilaya: "Choisir wilaya", searchWilaya: "Rechercher...", deliveryCompanies: "Transporteurs", optional: "Optionnel", saveError: "Erreur", phone: "Téléphone", invalidPhone: "Invalide", businessType: "Type", selectBusinessType: "Choisir", salesChannels: "Canaux", monthlyOrders: "Commandes/mois", selectMonthlyOrders: "Choisir", team: "Équipe", solo: "Seul", withTeam: "Avec équipe", agentsCount: "Agents", logo: "Logo", chooseImage: "Choisir", defaultDelivery: "Livraison par défaut", homeDelivery: "Domicile", deskDelivery: "Bureau", preparing: "Préparation", preparingSub: "Patientez...", steps: ["Préparation", "Produits", "Livraison", "Tableau"] },
  auth: {
    signInTitle: "Connexion à votre boutique",
    signUpTitle: "Créer un compte marchand",
    forgotTitle: "Mot de passe oublié",
    resetTitle: "Nouveau mot de passe",
    email: "Adresse e-mail",
    password: "Mot de passe",
    newPassword: "Nouveau mot de passe",
    displayName: "Nom complet",
    storeName: "Nom de la boutique",
    signInBtn: "Se connecter",
    signUpBtn: "Créer le compte",
    continueWithGoogle: "Continuer avec Google",
    sendResetBtn: "Envoyer le lien",
    updatePasswordBtn: "Mettre à jour",
    forgotLink: "Mot de passe oublié ?",
    noAccount: "Nouveau ici ? Créer un compte",
    hasAccount: "Déjà inscrit ? Se connecter",
    backToSignIn: "Retour à la connexion",
    checkEmail: "Vérifiez votre boîte mail pour confirmer votre compte.",
    resetSent: "Lien de réinitialisation envoyé par e-mail.",
    passwordUpdated: "Mot de passe mis à jour avec succès.",
    recoveryMissing: "Lien de récupération invalide ou expiré.",
  },
};

const en: TranslationBundle = {
  common: {
    loading: "Loading...",
    empty: "No data",
    loadMore: "Load more",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    search: "Search",
    all: "All",
    view: "View",
    call: "Call",
    confirm: "Confirm",
    postpone: "Postpone",
    refuse: "Cancel",
    noAnswer: "No answer",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    create: "Create",
    back: "Back",
    next: "Next",
    skip: "Skip",
    finish: "Finish",
    yes: "Yes",
    no: "No",
  },
  nav: {
    features: "Features",
    howItWorks: "How it works",
    pricing: "Pricing",
    faq: "FAQ",
    dashboard: "Dashboard",
    orders: "Orders",
    customers: "Customers",
    products: "Products",
    overview: "Overview",
    signIn: "Sign in",
    signOut: "Sign out",
    startFree: "Start free",
    landing: "Home",
    home: "Home",
    confirmation: "Confirmation",
    delivery: "Delivery",
    shipments: "Shipments",
    inventory: "Inventory",
    analytics: "Analytics",
    expenses: "Expenses",
    team: "Team",
    integrations: "Integrations",
    settings: "Settings",
    live: "Live",
    reconnecting: "Reconnecting",
    offline: "Offline",
    comingSoon: "Coming soon",
    comingSoonSub: "This page is under development. It will be available soon.",
    yourStore: "Your store",
  },
  hero: {
    eyebrow: "Built for Algerian Cash-on-Delivery merchants",
    title: "Run your entire COD store from one workspace",
    subtitle: "Product pages, fast order confirmation, 58-wilaya carrier shipping, return tracking, and real profit metrics in Algerian Dinars.",
    ctaPrimary: "Start free",
    ctaSecondary: "How it works",
    statOrders: "Faster order confirmation",
    statWilayas: "Wilayas covered",
    statCarriers: "Algerian carriers",
  },
  landing: {
    featuresTitle: "Everything an Algerian COD merchant needs",
    featuresSub: "Cut manual spreadsheet work and keep return rates under control.",
    stepsTitle: "Go live in 3 simple steps",
    carriersTitle: "Built for top Algerian delivery carriers",
    carriersSub: "Dispatch parcels in one click and track every COD payout.",
    pricingTitle: "Clear plans in Algerian Dinars",
    pricingSub: "Start free and upgrade as your daily order volume grows.",
    testimonialsTitle: "Trusted by merchants across Algeria",
    faqTitle: "Frequently asked questions",
    footerNote: "All-in-one Cash-on-Delivery e-commerce platform for Algerian merchants.",
    monthly: "/ month",
    popular: "Most popular",
    choosePlan: "Choose plan",
  },
  status: {
    new: "New",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    returned: "Returned",
    canceled: "Canceled",
  },
  dashboard: {
    title: "Overview",
    subtitle: "Daily orders, revenue in DA, confirmation and delivery performance",
    todayOrders: "Today's orders",
    revenue: "Revenue",
    awaitingConfirmation: "Awaiting confirmation",
    inDelivery: "In delivery",
    confirmRate: "Confirmation rate",
    deliveryRate: "Delivery rate",
    returnRate: "Return rate",
    noData: "No data yet. Add an order or product to get started.",
    chartTitle: "Orders & revenue trend",
    day: "Day",
    week: "Week",
    month: "Month",
    topProducts: "Best-selling products",
    recentOrders: "Recent orders",
    viewAll: "View all",
    unitsSold: "orders",
  },
  orders: {
    title: "Orders",
    subtitle: "Confirm calls, filter by wilaya or carrier, and update delivery status",
    newOrder: "New order",
    confirmAndSend: "Confirm and send",
    searchPlaceholder: "Search by name, phone, or order #...",
    allStatuses: "All statuses",
    allWilayas: "All wilayas",
    allCarriers: "All carriers",
    bulkMark: "Update selected",
    selected: "selected",
    exportSelected: "Export selected",
    customer: "Customer",
    phone: "Phone",
    wilaya: "Wilaya",
    product: "Product",
    amount: "Amount",
    carrier: "Carrier",
    statusCol: "Status",
    date: "Date",
    actions: "Actions",
    call: "Call",
    whatsapp: "WhatsApp",
    details: "Details",
    notes: "Internal notes",
    notesPlaceholder: "e.g. Customer asked for delivery after 5 PM...",
    timeline: "Order timeline",
    save: "Save changes",
    cancel: "Cancel",
    emptyTitle: "No matching orders",
    emptySub: "Adjust your filters or add a new order to get started.",
    invalidPhone: "Enter a valid Algerian phone (05 / 06 / 07 or +213)",
    whatsappTemplate: "Hello {name}, confirming your order {number} ({product}) for {amount} to {wilaya}.",
  },
  products: {
    title: "Products & Stock",
    subtitle: "Manage DA pricing, margins, stock levels, and variants",
    addProduct: "Add product",
    editProduct: "Edit product",
    searchPlaceholder: "Search by product name or SKU...",
    allCategories: "All categories",
    name: "Product name",
    price: "Selling price (DA)",
    cost: "Cost price (DA)",
    margin: "Margin",
    stock: "Stock",
    category: "Category",
    sku: "SKU",
    variants: "Variants (size / color)",
    image: "Product image",
    lowStock: "Low stock",
    inStock: "In stock",
    delete: "Delete",
    edit: "Edit",
    save: "Save product",
    cancel: "Cancel",
    emptyTitle: "No products yet",
    emptySub: "Add your first product to start taking COD orders.",
  },
  delivery: { title: "Delivery", subtitle: "Delivery performance by carrier", avg: "Average", connected: "Connected", ready: "Ready", noShipments: "No shipments" },
  shipments: { title: "Shipments", subtitle: "Track your shipments and carriers", new: "New shipment", order: "Order", carrier: "Carrier", tracking: "Tracking", cod: "COD", status: "Status", actions: "Actions", create: "Create", selectOrder: "Select order", trackingNumber: "Tracking number", codAmount: "COD amount", createBtn: "Create", cancel: "Cancel", noShipments: "No shipments", pending: "Pending", shipped: "Shipped", inTransit: "In transit", delivered: "Delivered", returned: "Returned", canceled: "Canceled", ship: "Ship", deliver: "Deliver", return: "Return", chooseOrder: "Choose order" },
  expenses: { title: "Expenses & campaigns", subtitle: "Track your expenses and ads", totalExpenses: "Total expenses", totalAds: "Total ads", addExpense: "Add expense", amount: "Amount", note: "Note", add: "Add", category: "Category", date: "Date", noExpenses: "No expenses", addCampaign: "Add campaign", platform: "Platform", noCampaigns: "No campaigns" },
  confirmation: { title: "Confirmation", pendingCalls: "Pending calls", confirmedToday: "Confirmed today", confirmRate: "Confirmation rate", noPending: "No pending orders", confirm: "Confirm", postpone: "Postpone", noAnswer: "No answer", refuse: "Refuse", attempt: "Attempt" },
  analytics: { title: "Analytics", netRevenue: "Net revenue (month)", deliveryRate: "Delivery rate", returnRate: "Return rate", avgOrder: "Avg order value", netProfit: "Net profit", monthlySales: "Monthly sales", last6Months: "Last 6 months", topWilayas: "Top wilayas", returns: "Returns", noData: "No data" },
  team: { title: "Team", totalMembers: "Total members", activeAgents: "Active agents", pendingInvites: "Pending invites", invite: "Invite member", all: "All", phone: "Phone", phoneConfirm: "Phone confirmation", shipping: "Shipping prep", inviteSent: "An invitation will be sent by email.", inviteMember: "Invite member", storeManager: "Store manager", agent: "Agent", stockKeeper: "Stock keeper", active: "Active", pending: "Pending" },
  settings: { title: "Settings", subtitle: "Customize your store", storeIdentity: "Your store", verified: "Verified", saveChanges: "Save changes", basicData: "Basic data", storeName: "Store name", defaultWilaya: "Default wilaya", supportPhone: "Support phone", preferences: "Confirmation & delivery preferences", autoConfirm: "Auto-confirm trusted customers", autoConfirmHint: "Skip call for 100% delivery customers", smsOnDelivery: "SMS on delivery", smsOnDeliveryHint: "Send tracking via SMS", lowStockAlert: "Low stock alert", lowStockAlertHint: "Notify under 10 units", accountMgmt: "Account management", accountMgmtSub: "Temporarily disable or close", pauseStore: "Pause store" },
  inventory: { title: "Inventory", subtitle: "Manage stock and movements", totalProducts: "Total products", lowStock: "Low stock", stockValue: "Stock value", searchPlaceholder: "Search by name or SKU...", all: "All", low: "Low", out: "Out of stock", addProduct: "Add product", sku: "SKU", product: "Product", category: "Category", available: "Available", price: "Selling price", status: "Status", actions: "Actions", inStock: "In stock", lowStockLabel: "Low stock", outOfStock: "Out of stock", products: "Products", movements: "Movements", noProducts: "No products", noMovements: "No movements", adjustStock: "Adjust stock", change: "Change", reason: "Reason", time: "Time", adjustTitle: "Adjust stock", invalidQty: "Invalid quantity", stockAdjusted: "Stock adjusted", error: "Error" },
  integrations: { title: "Integrations", subtitle: "Connect your store to sales channels", notAuthorized: "Not authorized", notAuthorizedSub: "Managers only", api: "API", shopify: "Shopify", woocommerce: "WooCommerce", logs: "Logs", endpoint: "Endpoint", copy: "Copy", apiKeys: "API keys", createKey: "Create key", name: "Name", prefix: "Prefix", created: "Created", lastUsed: "Last used", status: "Status", actions: "Actions", revoked: "Revoked", active: "Active", revoke: "Revoke", noKeys: "No keys", keyName: "Key name", keyNameRequired: "Name required", keyCreated: "Key created", keyWarning: "Copy this key now. It won't be shown again.", close: "Close", create: "Create", cancel: "Cancel", error: "Error", docs: "Docs", docsIntro: "POST to endpoint with x-api-key header.", fields: "Fields", field: "Field", type: "Type", required: "Required", description: "Description", yes: "Yes", no: "No", customerName: "Customer name", phone: "Algerian phone", phoneDesc: "Algerian phone", wilaya: "Wilaya (name or code)", wilayaDesc: "Wilaya (name or code)", commune: "Commune", address: "Address", deliveryType: "Delivery type (default home)", deliveryPrice: "Delivery price", notes: "Notes", items: "Items", externalId: "External ID", webhookUrl: "Webhook URL", state: "Status", activeStatus: "Active", paused: "Paused", signingSecret: "Signing secret", pasteSecret: "Paste secret here", saveSecret: "Save secret", secretSaved: "Secret saved", secretRequired: "Secret required", setupSteps: "Setup steps", step1Shopify: "In Shopify, go to Settings → Notifications → Webhooks.", step2Shopify: "Create webhook: Event = Order creation.", step3Shopify: "Format = JSON, URL = webhook URL above.", step4Shopify: "Copy signing secret and paste here, then activate.", step1Woo: "In WooCommerce, go to Settings → Advanced → Webhooks.", step2Woo: "Add webhook: Topic = Order created.", step3Woo: "Delivery URL = webhook URL above.", step4Woo: "Secret = any text, copy here and activate.", intakeLogs: "Intake logs", noLogs: "No logs", source: "Source", logStatus: "Status", logError: "Error", logTime: "Time", details: "Details", payload: "Payload", accepted: "Accepted", rejected: "Rejected", duplicate: "Duplicate" },
  onboarding: { title: "Onboarding", storeInfo: "Store info", storeName: "Store name", storeNameRequired: "Name required", selectWilaya: "Select wilaya", searchWilaya: "Search wilaya...", deliveryCompanies: "Carriers (optional)", optional: "Optional", saveError: "Save error", phone: "Phone (WhatsApp)", invalidPhone: "Invalid phone", businessType: "Business type", selectBusinessType: "Select type", salesChannels: "Sales channels (multi)", monthlyOrders: "Monthly orders", selectMonthlyOrders: "Select range", team: "Team", solo: "Solo", withTeam: "With team", agentsCount: "Agents count", logo: "Logo (optional)", chooseImage: "Choose image", defaultDelivery: "Default delivery", homeDelivery: "Home", deskDelivery: "Desk", preparing: "Preparing your workspace", preparingSub: "Please wait...", steps: ["Prepare", "Products", "Delivery", "Dashboard"] },
  auth: {
    signInTitle: "Sign in to your store",
    signUpTitle: "Create a free merchant account",
    forgotTitle: "Reset your password",
    resetTitle: "Set a new password",
    email: "Email address",
    password: "Password",
    newPassword: "New password",
    displayName: "Full name",
    storeName: "Store name",
    signInBtn: "Sign in",
    signUpBtn: "Create account",
    continueWithGoogle: "Continue with Google",
    sendResetBtn: "Send reset link",
    updatePasswordBtn: "Update password",
    forgotLink: "Forgot password?",
    noAccount: "New here? Create your store",
    hasAccount: "Already have an account? Sign in",
    backToSignIn: "Back to sign in",
    checkEmail: "Check your email to confirm your account before signing in.",
    resetSent: "Password reset link sent to your email.",
    passwordUpdated: "Your password has been updated.",
    recoveryMissing: "This recovery link is invalid or expired. Request a new one.",
  },
};

export const TRANSLATIONS: Record<Lang, TranslationBundle> = { ar, fr, en };