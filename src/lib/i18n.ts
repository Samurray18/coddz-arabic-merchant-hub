import type { Lang, OrderStatus } from "./coddz";

export interface TranslationBundle {
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    faq: string;
    dashboard: string;
    orders: string;
    products: string;
    overview: string;
    signIn: string;
    signOut: string;
    startFree: string;
    landing: string;
    demoMode: string;
    demoBanner: string;
    saveYourStore: string;
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
    confirmRate: string;
    deliveryRate: string;
    returnRate: string;
    chartTitle: string;
    day: string;
    week: string;
    month: string;
    topProducts: string;
    recentOrders: string;
    viewAll: string;
    unitsSold: string;
    loadSample: string;
  };
  orders: {
    title: string;
    subtitle: string;
    newOrder: string;
    searchPlaceholder: string;
    allStatuses: string;
    allWilayas: string;
    allCarriers: string;
    bulkMark: string;
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
  nav: {
    features: "المميزات",
    howItWorks: "كيف يعمل",
    pricing: "الأسعار",
    faq: "الأسئلة الشائعة",
    dashboard: "لوحة التحكم",
    orders: "الطلبات",
    products: "المنتجات",
    overview: "نظرة عامة",
    signIn: "تسجيل الدخول",
    signOut: "خروج",
    startFree: "ابدأ مجاناً",
    landing: "الصفحة الرئيسية",
    demoMode: "وضع تجريبي",
    demoBanner: "تتصفح حالياً بيانات تجريبية — سجّل دخولك لحفظ متجرك وطلباتك بشكل دائم.",
    saveYourStore: "أنشئ متجرك",
  },
  hero: {
    eyebrow: "مصمم خصيصاً للتجارة الإلكترونية في الجزائر",
    title: "أدر متجرك وطلبات الدفع عند الاستلام من مكان واحد",
    subtitle: "من إنشاء صفحة المنتج إلى تأكيد الطلبات، الربط مع شركات التوصيل في 58 ولاية، تتبع المرتجعات وحساب أرباحك الصافية بالدينار الجزائري.",
    ctaPrimary: "ابدأ مجاناً",
    ctaSecondary: "جرّب لوحة التحكم",
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
    confirmRate: "نسبة التأكيد",
    deliveryRate: "نسبة التوصيل",
    returnRate: "نسبة المرتجعات",
    chartTitle: "تطور الطلبات والمبيعات",
    day: "يومي",
    week: "أسبوعي",
    month: "شهري",
    topProducts: "أكثر المنتجات مبيعاً",
    recentOrders: "أحدث الطلبات",
    viewAll: "عرض الكل",
    unitsSold: "طلب",
    loadSample: "استيراد بيانات تجريبية لمتجري",
  },
  orders: {
    title: "إدارة الطلبات",
    subtitle: "تأكيد الطلبات، التصفية حسب الولاية وشركة التوصيل، والتواصل السريع",
    newOrder: "طلب جديد",
    searchPlaceholder: "ابحث بالاسم، الهاتف أو رقم الطلب...",
    allStatuses: "كل الحالات",
    allWilayas: "كل الولايات",
    allCarriers: "كل شركات التوصيل",
    bulkMark: "تحديث الحالة المحددة",
    selected: "محدد",
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
  nav: {
    features: "Fonctionnalités",
    howItWorks: "Comment ça marche",
    pricing: "Tarifs",
    faq: "FAQ",
    dashboard: "Tableau de bord",
    orders: "Commandes",
    products: "Produits",
    overview: "Aperçu",
    signIn: "Connexion",
    signOut: "Déconnexion",
    startFree: "Commencer gratuitement",
    landing: "Accueil",
    demoMode: "Mode démo",
    demoBanner: "Vous explorez des données démo — connectez-vous pour enregistrer votre boutique.",
    saveYourStore: "Créer ma boutique",
  },
  hero: {
    eyebrow: "Conçu pour l’e-commerce COD en Algérie",
    title: "Gérez votre boutique et vos commandes COD au même endroit",
    subtitle: "Pages produits, confirmation d’appels, expédition dans les 58 wilayas, suivi des retours et marge nette en Dinar Algérien.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Essayer le tableau de bord",
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
    confirmRate: "Taux de confirmation",
    deliveryRate: "Taux de livraison",
    returnRate: "Taux de retour",
    chartTitle: "Évolution des commandes et revenus",
    day: "Jour",
    week: "Semaine",
    month: "Mois",
    topProducts: "Meilleures ventes",
    recentOrders: "Dernières commandes",
    viewAll: "Voir tout",
    unitsSold: "cmd",
    loadSample: "Importer des données d’exemple",
  },
  orders: {
    title: "Commandes",
    subtitle: "Confirmez, filtrez par wilaya ou transporteur et suivez chaque colis",
    newOrder: "Nouvelle commande",
    searchPlaceholder: "Rechercher par nom, téléphone ou n°...",
    allStatuses: "Tous les statuts",
    allWilayas: "Toutes les wilayas",
    allCarriers: "Tous les transporteurs",
    bulkMark: "Appliquer à la sélection",
    selected: "sélectionné(s)",
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
  nav: {
    features: "Features",
    howItWorks: "How it works",
    pricing: "Pricing",
    faq: "FAQ",
    dashboard: "Dashboard",
    orders: "Orders",
    products: "Products",
    overview: "Overview",
    signIn: "Sign in",
    signOut: "Sign out",
    startFree: "Start free",
    landing: "Home",
    demoMode: "Demo mode",
    demoBanner: "Exploring sample Algerian data — sign in to save your own store.",
    saveYourStore: "Create your store",
  },
  hero: {
    eyebrow: "Built for Algerian Cash-on-Delivery merchants",
    title: "Run your entire COD store from one workspace",
    subtitle: "Product pages, fast order confirmation, 58-wilaya carrier shipping, return tracking, and real profit metrics in Algerian Dinars.",
    ctaPrimary: "Start free",
    ctaSecondary: "Explore live dashboard",
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
    confirmRate: "Confirmation rate",
    deliveryRate: "Delivery rate",
    returnRate: "Return rate",
    chartTitle: "Orders & revenue trend",
    day: "Day",
    week: "Week",
    month: "Month",
    topProducts: "Best-selling products",
    recentOrders: "Recent orders",
    viewAll: "View all",
    unitsSold: "orders",
    loadSample: "Import sample Algerian data",
  },
  orders: {
    title: "Orders",
    subtitle: "Confirm calls, filter by wilaya or carrier, and update delivery status",
    newOrder: "New order",
    searchPlaceholder: "Search by name, phone, or order #...",
    allStatuses: "All statuses",
    allWilayas: "All wilayas",
    allCarriers: "All carriers",
    bulkMark: "Update selected",
    selected: "selected",
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