import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Link, matchPath } from 'react-router-dom';
import { Star, MapPin, Briefcase, Phone, Menu, X, Search, Globe, MessageSquare, LogOut, ArrowRight, ArrowLeft, Edit2, Trash2, Camera, Save, XCircle, Facebook, Instagram, Link as LinkIcon, Award, Map, Settings, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, serverTimestamp, query, where, orderBy, updateDoc, increment, deleteDoc, limit, startAfter } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAm1EjJ4nsoHXA9kfh3K11F-5wfsZAuQes",
  authDomain: "afffora-621c8.firebaseapp.com",
  projectId: "afffora-621c8",
  storageBucket: "afffora-621c8.appspot.com",
  messagingSenderId: "62575837562",
  appId: "1:62575837562:web:c7d6fc5612055a055496c3",
  measurementId: "G-8RTMWSL97F"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
const auth = getAuth(app);
const storage = getStorage(app);
storage.maxUploadRetryTime = 5000; // 5 seconds timeout for uploads
storage.maxOperationRetryTime = 5000; // 5 seconds timeout for other operations

const TRANSLATIONS = {
  ar: {
    brand: "أفورا",
    home: "الرئيسية",
    artisans: "الحرفيين",
    howItWorks: "كيف نعمل",
    contact: "اتصل بنا",
    register: "سجل كحرفي",
    heroTitle: "اكتشف أحسن المعلمية في مدينتك بكل ثقة",
    heroDesc: "وفر وقتك ومجهودك. قلب على الحرفي اللي محتاج، قارن بيناتهم، وتواصل معاه مباشرة بلا وسيط.",
    profession: "المهنة",
    city: "المدينة",
    search: "بحث",
    all: "الكل",
    plumber: "بلومبي",
    electrician: "تريسيان",
    carpenter: "نجار",
    painter: "صباغ",
    builder: "بناء",
    welder: "سدور",
    plasterer: "جباص",
    mechanic: "ميكانيكي",
    casablanca: "الدار البيضاء",
    fez: "فاس",
    rabat: "الرباط",
    marrakech: "مراكش",
    tangier: "طنجة",
    agadir: "أكادير",
    meknes: "مكناس",
    oujda: "وجدة",
    kenitra: "القنيطرة",
    tetouan: "تطوان",
    khouribga: "خريبكة",
    temara: "تمارة",
    laayoune: "العيون",
    safi: "آسفي",
    beniMellal: "بني ملال",
    eljadida: "الجديدة",
    taza: "تازة",
    nador: "الناظور",
    settat: "سطات",
    ksarElKebir: "القصر الكبير",
    larache: "العرائش",
    khemisset: "الخميسات",
    tiznit: "تزنيت",
    berrechid: "برشيد",
    ouedZem: "وادي زم",
    fqihBenSalah: "الفقيه بنصالح",
    taourirt: "تاوريرت",
    berkane: "بركان",
    sidiSlimane: "سيدي سليمان",
    errachidia: "الراشيدية",
    sidiKacem: "سيدي قاسم",
    khenifra: "خنيفرة",
    tiflet: "تيفلت",
    essaouira: "الصويرة",
    taroudant: "تارودانت",
    kelaatSraghna: "قلعة السراغنة",
    ouledTeima: "اولاد التايمة",
    youssoufia: "اليوسفية",
    sefrou: "صفرو",
    benguerir: "بنجرير",
    tantan: "طانطان",
    ouazzane: "وزان",
    guercif: "جرسيف",
    ouarzazate: "ورزازات",
    alhoceima: "الحسيمة",
    jerada: "جرادة",
    chefchaouen: "شفشاون",
    fnideq: "الفنيدق",
    soukSebt: "سوق السبت أولاد النمة",
    salaAlJadida: "سلا الجديدة",
    howItWorksTitle: "كيف نعمل؟",
    step1Title: "1. ابحث",
    step1Desc: "حدد المهنة والمدينة اللي كتقلب فيها.",
    step2Title: "2. اختر الحرفي",
    step2Desc: "شوف شحال من واحد تواصل مع الحرفي باش تختار الأحسن بكل ثقة.",
    step3Title: "3. تواصل",
    step3Desc: "اتصل بالحرفي مباشرة عبر واتساب أو مكالمة عادية.",
    availableArtisans: "الحرفيين المتاحين",
    found: "لقينا",
    matching: "حرفي كيناسبو طلبك",
    noResults: "مالقينا حتى حرفي بهاد المواصفات",
    reviews: "تقييم",
    contactBtn: "تواصل",
    noResultsTitle: "لا يوجد نتائج",
    noResultsDesc: "جرب تبدل المهنة أو المدينة باش تلقى حرفيين آخرين.",
    clearFilters: "مسح الفلاتر",
    registerTitle: "سجل كحرفي",
    nameLabel: "الاسم الكامل",
    phoneLabel: "رقم الهاتف",
    submitBtn: "تأكيد التسجيل",
    contactTitle: "اتصل بنا",
    emailLabel: "البريد الإلكتروني",
    messageLabel: "الرسالة",
    sendBtn: "إرسال",
    footerDesc: "أحسن الحرفيين في المغرب، بين يديك.",
    terms: "الشروط والأحكام",
    privacy: "سياسة الخصوصية",
    about: "من نحن",
    rights: "أفورا. جميع الحقوق محفوظة.",
    phoneError: "رقم الهاتف يجب أن يتكون من 10 أرقام ويبدأ بـ 06 أو 07",
    emptyError: "المرجو ملء جميع الحقول",
    successMsg: "تمت العملية بنجاح!",
    successTitle: "شكراً لك!",
    successDesc: "توصلنا بطلبك، سنتصل بك قريباً.",
    closeBtn: "إغلاق",
    passwordLabel: "كلمة المرور",
    logout: "تسجيل الخروج",
    contactInfo: "معلومات الاتصال",
    loadingProfile: "جاري تحميل الملف الشخصي...",
    login: "تسجيل الدخول",
    loginTitle: "تسجيل الدخول",
    uploadProfilePicTitle: "صورة الملف الشخصي",
    uploadProfilePicDesc: "أضف صورة لملفك الشخصي لزيادة الثقة.",
    uploadBtn: "رفع صورة",
    skipBtn: "تخطي",
    saveBtn: "حفظ",
    verifyEmailMsg: "المرجو مراجعة بريدك الإلكتروني لتأكيد حسابك.",
    verifyEmailWarning: "حسابك غير مفعل. المرجو مراجعة بريدك الإلكتروني.",
    loginError: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    contactOptionsTitle: "خيارات التواصل",
    whatsapp: "واتساب",
    phoneCall: "اتصال عادي",
    contactedBy: "تواصل معه",
    people: "شخص",
    errPhoneInUse: "رقم الهاتف هذا مسجل مسبقاً.",
    errInvalidPhone: "رقم الهاتف غير صالح.",
    errWeakPassword: "كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.",
    errUserNotFound: "لم يتم العثور على حساب بهذا الرقم.",
    errWrongPassword: "كلمة المرور غير صحيحة.",
    errInvalidCredential: "رقم الهاتف أو كلمة المرور غير صحيحة.",
    errTooManyRequests: "تم حظر الحساب مؤقتاً بسبب محاولات كثيرة خاطئة. يرجى المحاولة لاحقاً.",
    errNetwork: "خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.",
    errDefault: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    editProfile: "تعديل الملف الشخصي",
    saveChanges: "حفظ التغييرات",
    deletePicture: "حذف الصورة",
    updatePicture: "تحديث الصورة",
    cancel: "إلغاء",
    personalInfo: "المعلومات الشخصية",
    backToHome: "العودة للرئيسية",
    aboutMe: "نبذة عني",
    shopLocation: "موقع المحل",
    socialMedia: "وسائل التواصل الاجتماعي",
    certificates: "الشواهد",
    addCertificate: "إضافة شهادة",
    uploading: "جاري الرفع...",
    facebook: "فيسبوك",
    instagram: "انستغرام",
    tiktok: "تيك توك",
    website: "الموقع الإلكتروني",
    noCertificates: "لا توجد شواهد",
    bioPlaceholder: "اكتب نبذة عنك وعن خبرتك...",
    locationPlaceholder: "عنوان المحل (اختياري)...",
    linkPlaceholder: "رابط الحساب..."
  },
  fr: {
    brand: "Lmoqaf",
    home: "Accueil",
    artisans: "Artisans",
    howItWorks: "Comment ça marche",
    contact: "Contact",
    register: "S'inscrire",
    heroTitle: "Découvrez les meilleurs artisans de votre ville en toute confiance.",
    heroDesc: "Gagnez du temps et de l'énergie. Cherchez l'artisan dont vous avez besoin, comparez-les et contactez-les directement sans intermédiaire.",
    profession: "Métier",
    city: "Ville",
    search: "Rechercher",
    all: "Tous",
    plumber: "Plombier",
    electrician: "Électricien",
    carpenter: "Menuisier",
    painter: "Peintre",
    builder: "Maçon",
    welder: "Soudeur",
    plasterer: "Plâtrier",
    mechanic: "Mécanicien",
    casablanca: "Casablanca",
    fez: "Fès",
    rabat: "Rabat",
    marrakech: "Marrakech",
    tangier: "Tanger",
    agadir: "Agadir",
    meknes: "Meknès",
    oujda: "Oujda",
    kenitra: "Kénitra",
    tetouan: "Tétouan",
    khouribga: "Khouribga",
    temara: "Témara",
    laayoune: "Laâyoune",
    safi: "Safi",
    beniMellal: "Béni Mellal",
    eljadida: "El Jadida",
    taza: "Taza",
    nador: "Nador",
    settat: "Settat",
    ksarElKebir: "Ksar El Kébir",
    larache: "Larache",
    khemisset: "Khémisset",
    tiznit: "Tiznit",
    berrechid: "Berrechid",
    ouedZem: "Oued Zem",
    fqihBenSalah: "Fkih Ben Salah",
    taourirt: "Taourirt",
    berkane: "Berkane",
    sidiSlimane: "Sidi Slimane",
    errachidia: "Errachidia",
    sidiKacem: "Sidi Kacem",
    khenifra: "Khénifra",
    tiflet: "Tiflet",
    essaouira: "Essaouira",
    taroudant: "Taroudant",
    kelaatSraghna: "El Kelaâ des Sraghna",
    ouledTeima: "Oulad Teïma",
    youssoufia: "Youssoufia",
    sefrou: "Sefrou",
    benguerir: "Ben Guerir",
    tantan: "Tan-Tan",
    ouazzane: "Ouezzane",
    guercif: "Guercif",
    ouarzazate: "Ouarzazate",
    alhoceima: "Al Hoceïma",
    jerada: "Jerada",
    chefchaouen: "Chefchaouen",
    fnideq: "Fnideq",
    soukSebt: "Souk Sebt Oulad Nema",
    salaAlJadida: "Sala Al Jadida",
    howItWorksTitle: "Comment ça marche ?",
    step1Title: "1. Recherchez",
    step1Desc: "Sélectionnez le métier et la ville.",
    step2Title: "2. Choisissez l'artisan",
    step2Desc: "Voyez combien de personnes ont contacté l'artisan pour choisir le meilleur en toute confiance.",
    step3Title: "3. Contactez",
    step3Desc: "Contactez l'artisan directement via WhatsApp ou appel normal.",
    availableArtisans: "Artisans Disponibles",
    found: "Nous avons trouvé",
    matching: "artisan(s) correspondant(s)",
    noResults: "Aucun artisan trouvé avec ces critères",
    reviews: "avis",
    contactBtn: "Contacter",
    noResultsTitle: "Aucun résultat",
    noResultsDesc: "Essayez de changer le métier ou la ville pour trouver d'autres artisans.",
    clearFilters: "Effacer les filtres",
    registerTitle: "S'inscrire comme artisan",
    nameLabel: "Nom complet",
    phoneLabel: "Numéro de téléphone",
    submitBtn: "Confirmer l'inscription",
    contactTitle: "Contactez-nous",
    emailLabel: "Adresse e-mail",
    messageLabel: "Message",
    sendBtn: "Envoyer",
    footerDesc: "Les meilleurs artisans du Maroc, à portée de main.",
    terms: "Conditions",
    privacy: "Confidentialité",
    about: "À propos",
    rights: "Lmoqaf. Tous droits réservés.",
    phoneError: "Le numéro doit comporter 10 chiffres et commencer par 06 ou 07",
    emptyError: "Veuillez remplir tous les champs",
    successMsg: "Opération réussie !",
    successTitle: "Merci !",
    successDesc: "Nous avons reçu votre demande, nous vous contacterons bientôt.",
    closeBtn: "Fermer",
    passwordLabel: "Mot de passe",
    logout: "Déconnexion",
    contactInfo: "Coordonnées",
    loadingProfile: "Chargement du profil...",
    login: "Connexion",
    loginTitle: "Connexion",
    uploadProfilePicTitle: "Photo de profil",
    uploadProfilePicDesc: "Ajoutez une photo de profil pour augmenter la confiance.",
    uploadBtn: "Télécharger une photo",
    skipBtn: "Ignorer",
    saveBtn: "Enregistrer",
    verifyEmailMsg: "Veuillez vérifier votre e-mail pour confirmer votre compte.",
    verifyEmailWarning: "Votre compte n'est pas vérifié. Veuillez vérifier votre e-mail.",
    loginError: "E-mail ou mot de passe incorrect",
    contactOptionsTitle: "Options de contact",
    whatsapp: "WhatsApp",
    phoneCall: "Appel téléphonique",
    contactedBy: "Contacté par",
    people: "personne(s)",
    errPhoneInUse: "Ce numéro de téléphone est déjà enregistré.",
    errInvalidPhone: "Numéro de téléphone invalide.",
    errWeakPassword: "Le mot de passe est trop faible. Il doit comporter au moins 6 caractères.",
    errUserNotFound: "Aucun compte trouvé avec ce numéro.",
    errWrongPassword: "Mot de passe incorrect.",
    errInvalidCredential: "Numéro de téléphone ou mot de passe incorrect.",
    errTooManyRequests: "Le compte a été temporairement bloqué en raison de trop nombreuses tentatives infructueuses. Veuillez réessayer plus tard.",
    errNetwork: "Erreur de connexion réseau. Veuillez vérifier votre connexion Internet.",
    errDefault: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    editProfile: "Modifier le profil",
    saveChanges: "Enregistrer les modifications",
    deletePicture: "Supprimer la photo",
    updatePicture: "Mettre à jour la photo",
    cancel: "Annuler",
    personalInfo: "Informations personnelles",
    backToHome: "Retour à l'accueil",
    aboutMe: "À propos de moi",
    shopLocation: "Emplacement de l'atelier",
    socialMedia: "Réseaux sociaux",
    certificates: "Certificats",
    addCertificate: "Ajouter un certificat",
    uploading: "Téléchargement...",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    website: "Site web",
    noCertificates: "Aucun certificat",
    bioPlaceholder: "Écrivez sur vous et votre expérience...",
    locationPlaceholder: "Adresse de l'atelier (optionnel)...",
    linkPlaceholder: "Lien du profil..."
  },
  en: {
    brand: "Lmoqaf",
    home: "Home",
    artisans: "Artisans",
    howItWorks: "How it works",
    contact: "Contact",
    register: "Register",
    heroTitle: "Discover the best artisans in your city with confidence.",
    heroDesc: "Save time and effort. Find the artisan you need, compare them, and get in touch directly without any middlemen.",
    profession: "Profession",
    city: "City",
    search: "Search",
    all: "All",
    plumber: "Plumber",
    electrician: "Electrician",
    carpenter: "Carpenter",
    painter: "Painter",
    builder: "Builder",
    welder: "Welder",
    plasterer: "Plasterer",
    mechanic: "Mechanic",
    casablanca: "Casablanca",
    fez: "Fez",
    rabat: "Rabat",
    marrakech: "Marrakech",
    tangier: "Tangier",
    agadir: "Agadir",
    meknes: "Meknes",
    oujda: "Oujda",
    kenitra: "Kenitra",
    tetouan: "Tetouan",
    khouribga: "Khouribga",
    temara: "Temara",
    laayoune: "Laayoune",
    safi: "Safi",
    beniMellal: "Beni Mellal",
    eljadida: "El Jadida",
    taza: "Taza",
    nador: "Nador",
    settat: "Settat",
    ksarElKebir: "Ksar El Kebir",
    larache: "Larache",
    khemisset: "Khemisset",
    tiznit: "Tiznit",
    berrechid: "Berrechid",
    ouedZem: "Oued Zem",
    fqihBenSalah: "Fkih Ben Salah",
    taourirt: "Taourirt",
    berkane: "Berkane",
    sidiSlimane: "Sidi Slimane",
    errachidia: "Errachidia",
    sidiKacem: "Sidi Kacem",
    khenifra: "Khenifra",
    tiflet: "Tiflet",
    essaouira: "Essaouira",
    taroudant: "Taroudant",
    kelaatSraghna: "El Kelaa des Sraghna",
    ouledTeima: "Oulad Teima",
    youssoufia: "Youssoufia",
    sefrou: "Sefrou",
    benguerir: "Ben Guerir",
    tantan: "Tan-Tan",
    ouazzane: "Ouezzane",
    guercif: "Guercif",
    ouarzazate: "Ouarzazate",
    alhoceima: "Al Hoceima",
    jerada: "Jerada",
    chefchaouen: "Chefchaouen",
    fnideq: "Fnideq",
    soukSebt: "Souk Sebt Oulad Nema",
    salaAlJadida: "Sala Al Jadida",
    howItWorksTitle: "How it works?",
    step1Title: "1. Search",
    step1Desc: "Select the profession and city you are looking in.",
    step2Title: "2. Choose the Artisan",
    step2Desc: "See how many people contacted the artisan to choose the best with confidence.",
    step3Title: "3. Contact",
    step3Desc: "Contact the artisan directly via WhatsApp or a normal call.",
    availableArtisans: "Available Artisans",
    found: "We found",
    matching: "matching artisan(s)",
    noResults: "No artisans found with these criteria",
    reviews: "reviews",
    contactBtn: "Contact",
    noResultsTitle: "No results",
    noResultsDesc: "Try changing the profession or city to find other artisans.",
    clearFilters: "Clear filters",
    registerTitle: "Register as Artisan",
    nameLabel: "Full Name",
    phoneLabel: "Phone Number",
    submitBtn: "Confirm Registration",
    contactTitle: "Contact Us",
    emailLabel: "Email Address",
    messageLabel: "Message",
    sendBtn: "Send",
    footerDesc: "The best artisans in Morocco, at your fingertips.",
    terms: "Terms",
    privacy: "Privacy",
    about: "About",
    rights: "Lmoqaf. All rights reserved.",
    phoneError: "Phone number must be 10 digits and start with 06 or 07",
    emptyError: "Please fill in all fields",
    successMsg: "Operation successful!",
    successTitle: "Thank you!",
    successDesc: "We received your request, we will contact you soon.",
    closeBtn: "Close",
    passwordLabel: "Password",
    logout: "Logout",
    contactInfo: "Contact Information",
    loadingProfile: "Loading profile...",
    login: "Login",
    loginTitle: "Login",
    uploadProfilePicTitle: "Profile Picture",
    uploadProfilePicDesc: "Add a profile picture to increase trust.",
    uploadBtn: "Upload Picture",
    skipBtn: "Skip",
    saveBtn: "Save",
    verifyEmailMsg: "Please check your email to verify your account.",
    verifyEmailWarning: "Your account is not verified. Please check your email.",
    loginError: "Incorrect email or password",
    contactOptionsTitle: "Contact Options",
    whatsapp: "WhatsApp",
    phoneCall: "Phone Call",
    contactedBy: "Contacted by",
    people: "people",
    errPhoneInUse: "This phone number is already registered.",
    errInvalidPhone: "Invalid phone number.",
    errWeakPassword: "Password is too weak. It must be at least 6 characters.",
    errUserNotFound: "No account found with this number.",
    errWrongPassword: "Incorrect password.",
    errInvalidCredential: "Incorrect phone number or password.",
    errTooManyRequests: "Account temporarily blocked due to too many failed attempts. Please try again later.",
    errNetwork: "Network connection error. Please check your internet connection.",
    errDefault: "An unexpected error occurred. Please try again.",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    deletePicture: "Delete Picture",
    updatePicture: "Update Picture",
    cancel: "Cancel",
    personalInfo: "Personal Information",
    backToHome: "Back to Home",
    aboutMe: "About Me",
    shopLocation: "Shop Location",
    socialMedia: "Social Media",
    certificates: "Certificates",
    addCertificate: "Add Certificate",
    uploading: "Uploading...",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    website: "Website",
    noCertificates: "No certificates",
    bioPlaceholder: "Write about yourself and your experience...",
    locationPlaceholder: "Shop address (optional)...",
    linkPlaceholder: "Profile link..."
  }
};

const PROFESSIONS = ['all', 'plumber', 'electrician', 'carpenter', 'painter', 'builder', 'welder', 'plasterer', 'mechanic'];
const CITIES = ['all', 'casablanca', 'fez', 'rabat', 'marrakech', 'tangier', 'agadir', 'meknes', 'oujda', 'kenitra', 'tetouan', 'khouribga', 'temara', 'laayoune', 'safi', 'beniMellal', 'eljadida', 'taza', 'nador', 'settat', 'ksarElKebir', 'larache', 'khemisset', 'tiznit', 'berrechid', 'ouedZem', 'fqihBenSalah', 'taourirt', 'berkane', 'sidiSlimane', 'errachidia', 'sidiKacem', 'khenifra', 'tiflet', 'essaouira', 'taroudant', 'kelaatSraghna', 'ouledTeima', 'youssoufia', 'sefrou', 'benguerir', 'tantan', 'ouazzane', 'guercif', 'ouarzazate', 'alhoceima', 'jerada', 'chefchaouen', 'fnideq', 'soukSebt', 'salaAlJadida'];

const ARTISANS_FALLBACK = [
  { id: 1, name: { ar: "أحمد الصالحي", fr: "Ahmed Salhi", en: "Ahmed Salhi" }, professionKey: "plumber", cityKey: "casablanca", contactCount: 124, image: "https://picsum.photos/seed/ahmed/150/150" },
  { id: 2, name: { ar: "يوسف بنسعيد", fr: "Youssef Bensaid", en: "Youssef Bensaid" }, professionKey: "electrician", cityKey: "rabat", contactCount: 89, image: "https://picsum.photos/seed/youssef/150/150" },
  { id: 3, name: { ar: "حسن النجار", fr: "Hassan Nejjar", en: "Hassan Nejjar" }, professionKey: "carpenter", cityKey: "marrakech", contactCount: 210, image: "https://picsum.photos/seed/hassan/150/150" },
  { id: 4, name: { ar: "كريم العمراني", fr: "Karim Amrani", en: "Karim Amrani" }, professionKey: "painter", cityKey: "tangier", contactCount: 45, image: "https://picsum.photos/seed/karim/150/150" },
  { id: 5, name: { ar: "عمر الفاسي", fr: "Omar Fassi", en: "Omar Fassi" }, professionKey: "plumber", cityKey: "agadir", contactCount: 156, image: "https://picsum.photos/seed/omar/150/150" },
  { id: 6, name: { ar: "سعيد التازي", fr: "Said Tazi", en: "Said Tazi" }, professionKey: "electrician", cityKey: "casablanca", contactCount: 112, image: "https://picsum.photos/seed/said/150/150" },
  { id: 7, name: { ar: "محمد البنا", fr: "Mohammed Banna", en: "Mohammed Banna" }, professionKey: "builder", cityKey: "fez", contactCount: 78, image: "https://picsum.photos/seed/mohammed/150/150" },
  { id: 8, name: { ar: "رشيد الحداد", fr: "Rachid Haddad", en: "Rachid Haddad" }, professionKey: "welder", cityKey: "meknes", contactCount: 134, image: "https://picsum.photos/seed/rachid/150/150" },
  { id: 9, name: { ar: "عبد الله الجباص", fr: "Abdellah Jebbas", en: "Abdellah Jebbas" }, professionKey: "plasterer", cityKey: "oujda", contactCount: 201, image: "https://picsum.photos/seed/abdellah/150/150" },
  { id: 10, name: { ar: "طارق الميكانيكي", fr: "Tariq Mecanici", en: "Tariq Mecanici" }, professionKey: "mechanic", cityKey: "kenitra", contactCount: 56, image: "https://picsum.photos/seed/tariq/150/150" },
  { id: 11, name: { ar: "ياسين النجار", fr: "Yassine Nejjar", en: "Yassine Nejjar" }, professionKey: "carpenter", cityKey: "tetouan", contactCount: 145, image: "https://picsum.photos/seed/yassine/150/150" },
  { id: 12, name: { ar: "هشام الصباغ", fr: "Hicham Sabbagh", en: "Hicham Sabbagh" }, professionKey: "painter", cityKey: "khouribga", contactCount: 92, image: "https://picsum.photos/seed/hicham/150/150" },
  { id: 13, name: { ar: "مصطفى البلومبي", fr: "Mustapha Plombier", en: "Mustapha Plombier" }, professionKey: "plumber", cityKey: "laayoune", contactCount: 118, image: "https://picsum.photos/seed/mustapha/150/150" },
  { id: 14, name: { ar: "خالد التريسيان", fr: "Khalid Electricien", en: "Khalid Electricien" }, professionKey: "electrician", cityKey: "safi", contactCount: 167, image: "https://picsum.photos/seed/khalid/150/150" },
  { id: 15, name: { ar: "عزيز البناء", fr: "Aziz Banna", en: "Aziz Banna" }, professionKey: "builder", cityKey: "beniMellal", contactCount: 84, image: "https://picsum.photos/seed/aziz/150/150" }
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<'ar' | 'fr' | 'en'>('ar');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const isLoginModalOpen = location.pathname === '/login';
  const isRegisterModalOpen = location.pathname === '/register';
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Form states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regProfession, setRegProfession] = useState('plumber');
  const [regCity, setRegCity] = useState('casablanca');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [isProfessionDropdownOpen, setIsProfessionDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');

  const [artisans, setArtisans] = useState<any[]>([]);
  const [isFetchingArtisans, setIsFetchingArtisans] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const artisanMatch = matchPath("/artisan/:id", location.pathname);
  const artisanId = artisanMatch?.params?.id;

  const [fetchedArtisan, setFetchedArtisan] = useState<any>(null);
  const [isFetchingSingleArtisan, setIsFetchingSingleArtisan] = useState(false);

  useEffect(() => {
    if (artisanId) {
      const foundInState = artisans.find(a => a.id.toString() === artisanId) || ARTISANS_FALLBACK.find(a => a.id.toString() === artisanId);
      if (foundInState) {
        setFetchedArtisan(foundInState);
      } else if (fetchedArtisan?.id?.toString() !== artisanId) {
        const fetchSingleArtisan = async () => {
          setIsFetchingSingleArtisan(true);
          try {
            const docRef = doc(db, "artisans", artisanId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setFetchedArtisan({ id: docSnap.id, ...docSnap.data() });
            } else {
              setFetchedArtisan(null);
            }
          } catch (error) {
            console.error("Error fetching single artisan:", error);
            setFetchedArtisan(null);
          } finally {
            setIsFetchingSingleArtisan(false);
          }
        };
        fetchSingleArtisan();
      }
    } else {
      setFetchedArtisan(null);
    }
  }, [artisanId, artisans, fetchedArtisan]);

  const selectedArtisanProfile = fetchedArtisan;

  const [profileData, setProfileData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editProfession, setEditProfession] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSocial, setEditSocial] = useState({ facebook: '', instagram: '', tiktok: '', website: '' });
  const [editCertificates, setEditCertificates] = useState<string[]>([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const professionDropdownRef = React.useRef<HTMLDivElement>(null);
  const cityDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (professionDropdownRef.current && !professionDropdownRef.current.contains(e.target as Node)) {
        setIsProfessionDropdownOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scrolling logic matching the requested behavior
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');

    // Check if the link is an internal anchor (starts with # and isn't just an empty #)
    if (href && href.startsWith('#') && href.length > 1) {
      // Prevent default ONLY for anchor links
      e.preventDefault();

      if (location.pathname !== '/') {
        navigate('/' + href);
        setTimeout(() => {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    }
    // If the href does NOT start with '#', the script does nothing.
    // The browser will naturally navigate to other pages.
  };

  const [contactModalArtisan, setContactModalArtisan] = useState<any | null>(null);

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchArtisans = async (isLoadMore = false) => {
    if (isLoadMore) {
      if (!lastVisible || !hasMore || isLoadingMore) return;
      setIsLoadingMore(true);
    } else {
      setIsFetchingArtisans(true);
      setArtisans([]);
      setLastVisible(null);
      setHasMore(true);
    }

    try {
      const queryConstraints: any[] = [];

      if (selectedProfession !== 'all') {
        queryConstraints.push(where("professionKey", "==", selectedProfession));
      }
      if (selectedCity !== 'all') {
        queryConstraints.push(where("cityKey", "==", selectedCity));
      }

      // Only order by createdAt if there are no filters to avoid requiring composite indexes
      if (queryConstraints.length === 0) {
        queryConstraints.push(orderBy("createdAt", "desc"));
      }

      if (isLoadMore && lastVisible) {
        queryConstraints.push(startAfter(lastVisible));
      }

      const fetchLimit = isLoadMore ? 12 : 20;
      queryConstraints.push(limit(fetchLimit));

      const q = query(collection(db, "artisans"), ...queryConstraints);
      const querySnapshot = await getDocs(q);

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      setHasMore(querySnapshot.docs.length === fetchLimit);

      let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client-side filter for isPublished
      data = data.filter((d: any) => d.isPublished !== false);

      if (isLoadMore) {
        setArtisans(prev => [...prev, ...data]);
      } else {
        setArtisans(data.length > 0 ? data : ARTISANS_FALLBACK);
      }
    } catch (error) {
      console.error("Error fetching artisans: ", error);
      if (!isLoadMore) {
        setArtisans(ARTISANS_FALLBACK);
      }
      setHasMore(false);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsFetchingArtisans(false);
      }
    }
  };

  const loadMoreArtisans = () => fetchArtisans(true);

  useEffect(() => {
    fetchArtisans();
  }, [selectedProfession, selectedCity]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "artisans", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
        // Do not automatically switch to profile view
      } else {
        navigate('/');
        setProfileData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const filteredArtisans = useMemo(() => {
    return artisans.filter(artisan => {
      const matchProfession = selectedProfession === 'all' || artisan.professionKey === selectedProfession;
      const matchCity = selectedCity === 'all' || artisan.cityKey === selectedCity;
      return matchProfession && matchCity;
    });
  }, [artisans, selectedProfession, selectedCity]);

  const handleModalClick = (e: React.MouseEvent, action: any) => {
    if (e.target === e.currentTarget) {
      if (typeof action === 'function') action(false);
    }
  };

  const getFirebaseErrorMessage = (error: any) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return t.errPhoneInUse;
      case 'auth/invalid-email':
        return t.errInvalidPhone;
      case 'auth/weak-password':
        return t.errWeakPassword;
      case 'auth/user-not-found':
        return t.errUserNotFound;
      case 'auth/wrong-password':
        return t.errWrongPassword;
      case 'auth/invalid-credential':
        return t.errInvalidCredential;
      case 'auth/too-many-requests':
        return t.errTooManyRequests;
      case 'auth/network-request-failed':
        return t.errNetwork;
      default:
        return error.message || t.errDefault;
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError(t.emptyError);
      return;
    }

    const phoneRegex = /^0[67]\d{8}$/;
    if (!phoneRegex.test(regPhone)) {
      setRegError(t.phoneError);
      return;
    }

    try {
      const authEmail = regPhone.trim() + "@lmoqaf.ma";
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, regPassword);
      const newUser = userCredential.user;

      await setDoc(doc(db, "artisans", newUser.uid), {
        name: { ar: regName, fr: regName, en: regName },
        professionKey: regProfession,
        cityKey: regCity,
        phone: regPhone,
        contactCount: 0,
        image: "/default-avatar.svg", // Will be updated if they upload one
        createdAt: serverTimestamp(),
        isPublished: true
      });

      navigate('/');
      setRegName('');
      setRegPhone('');
      setRegPassword('');
      setIsProfilePicModalOpen(true);
    } catch (error: any) {
      setRegError(getFirebaseErrorMessage(error));
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfilePicSubmit = async () => {
    if (!user) return;
    setIsUploadingPic(true);

    try {
      let imageUrl = "/default-avatar.svg";

      if (profilePicFile) {
        try {
          // Try uploading to Firebase Storage first
          const storageRef = ref(storage, `profile_pictures/${user.uid}`);
          await uploadBytes(storageRef, profilePicFile);
          imageUrl = await getDownloadURL(storageRef);
        } catch (storageError) {
          console.warn("Firebase Storage failed, falling back to base64 in Firestore:", storageError);
          // Fallback: Compress and store as base64 string
          imageUrl = await compressImage(profilePicFile);
        }
      }

      await updateDoc(doc(db, "artisans", user.uid), {
        image: imageUrl
      });

      setIsProfilePicModalOpen(false);
      setProfilePicFile(null);
      setProfilePicPreview(null);
      navigate('/');
      fetchArtisans();
      showToast(t.successMsg, 'success');
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setIsUploadingPic(false);
    }
  };

  const handleProfilePicSkip = async () => {
    if (!user) return;
    setIsUploadingPic(true);

    try {
      await updateDoc(doc(db, "artisans", user.uid), {
        image: "/default-avatar.svg"
      });

      setIsProfilePicModalOpen(false);
      setProfilePicFile(null);
      setProfilePicPreview(null);
      navigate('/');
      fetchArtisans();
      showToast(t.successMsg, 'success');
    } catch (error: any) {
      console.error("Error skipping profile picture:", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setIsUploadingPic(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setLoginError(t.emptyError);
      return;
    }

    try {
      const authEmail = loginPhone.trim() + "@lmoqaf.ma";
      await signInWithEmailAndPassword(auth, authEmail, loginPassword);
      navigate('/');
      setLoginPhone('');
      setLoginPassword('');
      showToast(t.successMsg || "تم تسجيل الدخول بنجاح", 'success');
    } catch (error: any) {
      setLoginError(getFirebaseErrorMessage(error));
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactError('');

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError(t.emptyError);
      return;
    }

    try {
      await addDoc(collection(db, "contacts"), {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        timestamp: new Date()
      });
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      showToast(t.successMsg, 'success');
      setIsContactModalOpen(false);
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    }
  };

  const handleWhatsApp = async (artisan: any) => {
    let formatted = artisan.phone;
    if (formatted.startsWith('0')) {
      formatted = '212' + formatted.substring(1);
    }

    // Increment contact count
    try {
      if (artisan.id && typeof artisan.id === 'string') {
        await updateDoc(doc(db, "artisans", artisan.id), {
          contactCount: increment(1)
        });
      }
    } catch (error) {
      console.error("Error incrementing contact count:", error);
    }

    window.open(`https://wa.me/${formatted}`, '_blank');
    setContactModalArtisan(null);
  };

  const handlePhoneCall = async (artisan: any) => {
    // Increment contact count
    try {
      if (artisan.id && typeof artisan.id === 'string') {
        await updateDoc(doc(db, "artisans", artisan.id), {
          contactCount: increment(1)
        });
      }
    } catch (error) {
      console.error("Error incrementing contact count:", error);
    }

    window.location.href = `tel:${artisan.phone}`;
    setContactModalArtisan(null);
  };

  const openRegisterModal = () => {
    navigate('/register');
  };

  const openLoginModal = () => {
    navigate('/login');
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast(t.successMsg || "تم تسجيل الخروج بنجاح", 'success');
      navigate('/');
    } catch (error: any) {
      console.error("Error signing out: ", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(isRtl ? "هل أنت متأكد أنك تريد حذف حسابك نهائياً؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to permanently delete your account? This action cannot be undone.");

    if (confirmDelete) {
      setIsUpdatingProfile(true);
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "artisans", user.uid));

        // Delete from Auth
        await user.delete();

        showToast(isRtl ? "تم حذف الحساب بنجاح" : "Account deleted successfully", 'success');
        navigate('/');
      } catch (error: any) {
        console.error("Error deleting account: ", error);

        // Handle specific error when user needs to re-authenticate before deleting
        if (error.code === 'auth/requires-recent-login') {
          showToast(isRtl ? "يرجى تسجيل الدخول مرة أخرى لحذف حسابك لأسباب أمنية." : "Please log in again to delete your account for security reasons.", 'error');
          await signOut(auth);
          navigate('/');
        } else {
          showToast(getFirebaseErrorMessage(error), 'error');
        }
      } finally {
        setIsUpdatingProfile(false);
      }
    }
  };

  const startEditingProfile = () => {
    if (profileData) {
      setEditName(profileData.name.ar || profileData.name[lang]);
      setEditPhone(profileData.phone);
      setEditProfession(profileData.professionKey);
      setEditCity(profileData.cityKey);
      setEditBio(profileData.bio || '');
      setEditLocation(profileData.location || '');
      setEditSocial(profileData.socialLinks || { facebook: '', instagram: '', tiktok: '', website: '' });
      setEditCertificates(profileData.certificates || []);
      setIsEditingProfile(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      const updatedData = {
        name: { ar: editName, fr: editName, en: editName },
        phone: editPhone,
        professionKey: editProfession,
        cityKey: editCity,
        bio: editBio,
        location: editLocation,
        socialLinks: editSocial,
        certificates: editCertificates
      };

      await updateDoc(doc(db, "artisans", user.uid), updatedData);

      setProfileData({
        ...profileData,
        ...updatedData
      });

      showToast(t.successMsg, 'success');
      setIsEditingProfile(false);
      fetchArtisans();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "artisans", user.uid), {
        image: "/default-avatar.svg"
      });
      setProfileData({ ...profileData, image: "/default-avatar.svg" });
      showToast(t.successMsg, 'success');
      fetchArtisans();
    } catch (error: any) {
      console.error("Error deleting picture:", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    }
  };

  const handleUpdatePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUpdatingProfile(true);

    try {
      let imageUrl = "/default-avatar.svg";
      try {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      } catch (storageError) {
        console.warn("Firebase Storage failed, falling back to base64 in Firestore:", storageError);
        imageUrl = await compressImage(file);
      }

      await updateDoc(doc(db, "artisans", user.uid), {
        image: imageUrl
      });

      setProfileData({ ...profileData, image: imageUrl });
      showToast(t.successMsg, 'success');
      fetchArtisans();
    } catch (error: any) {
      console.error("Error updating picture:", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddCertificate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUpdatingProfile(true);

    try {
      let certUrl = "";
      try {
        const certId = Date.now().toString();
        const storageRef = ref(storage, `certificates/${user.uid}/${certId}`);
        await uploadBytes(storageRef, file);
        certUrl = await getDownloadURL(storageRef);
      } catch (storageError) {
        console.warn("Firebase Storage failed, falling back to base64 in Firestore:", storageError);
        certUrl = await compressImage(file);
      }

      const updatedCertificates = [...editCertificates, certUrl];
      setEditCertificates(updatedCertificates);

      // We don't save to firestore immediately, we wait for the user to click "Save Changes"
      // But we could if we wanted to. For now, let's keep it in local state until save.
      showToast(t.successMsg, 'success');
    } catch (error: any) {
      console.error("Error uploading certificate:", error);
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteCertificate = (indexToDelete: number) => {
    const updatedCertificates = editCertificates.filter((_, index) => index !== indexToDelete);
    setEditCertificates(updatedCertificates);
  };

  if (artisanMatch) {
    if (isFetchingArtisans || isFetchingSingleArtisan) {
      return (
        <div className="min-h-screen flex items-center justify-center font-sans" style={{ background: "var(--color-sand-100)" }}>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full animate-spin mx-auto mb-4" style={{ border: "3px solid var(--color-sand-200)", borderTopColor: "var(--color-clay-500)" }}></div>
            <p className="font-medium" style={{ color: "var(--color-olive-600)" }}>{isRtl ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      );
    }

    if (!selectedArtisanProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center font-sans" style={{ background: "var(--color-sand-100)" }}>
          <div className="text-center">
            <XCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "var(--color-sand-300)" }} />
            <p className="font-medium mb-4" style={{ color: "var(--color-olive-600)" }}>{isRtl ? 'لم يتم العثور على الحرفي' : 'Artisan not found'}</p>
            <button onClick={() => navigate('/')} className="font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--color-clay-500)" }}>
              {isRtl ? 'العودة للرئيسية' : 'Back to home'}
            </button>
          </div>
        </div>
      );
    }

    const SharedLogoSVG = () => (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="#2E2E20" stroke="#B86B52" strokeWidth="5" />
        <path d="M28 66 L28 36 L50 54 L72 36 L72 66" fill="none" stroke="#C97D63" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="36" r="4.5" fill="#EAEAE0" />
        <circle cx="72" cy="36" r="4.5" fill="#EAEAE0" />
        <circle cx="50" cy="54" r="4.5" fill="#EAEAE0" />
      </svg>
    );

    return (
      <div className="min-h-screen font-sans" style={{ background: "var(--color-sand-100)", color: "var(--color-olive-900)" }}>
        {/* Navbar */}
        <nav className="navbar-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="hover:opacity-60 transition-opacity" style={{ color: "var(--color-olive-600)" }}>
                  {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                  <SharedLogoSVG />
                  <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.2rem", letterSpacing: "0.04em", color: "var(--color-olive-900)" }}>Lmoqaf</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile Hero Banner */}
        <div className="relative py-16 px-4 text-center" style={{ background: "var(--color-olive-900)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 50% 120%, rgba(184,107,82,0.18) 0%, transparent 70%)", pointerEvents: "none" }}></div>
          <div className="relative z-10">
            <div className="relative inline-block mb-5">
              <div className="w-28 h-28 rounded-full overflow-hidden cursor-pointer shadow-xl" style={{ border: "3px solid rgba(184,107,82,0.5)" }} onClick={() => setSelectedImage(selectedArtisanProfile.image)}>
                <img src={selectedArtisanProfile.image} alt={selectedArtisanProfile.name[lang] || selectedArtisanProfile.name.ar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "var(--color-sand-100)", marginBottom: "0.5rem" }}>
              {selectedArtisanProfile.name[lang] || selectedArtisanProfile.name.ar || selectedArtisanProfile.name}
            </h1>
            <div className="flex justify-center items-center gap-5 text-sm" style={{ color: "rgba(235,230,220,0.6)" }}>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" style={{ color: "var(--color-clay-400)" }} />
                <span>{(t as any)[selectedArtisanProfile.professionKey]}</span>
              </div>
              <div className="w-1 h-1 rounded-full" style={{ background: "rgba(235,230,220,0.3)" }}></div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" style={{ color: "var(--color-clay-400)" }} />
                <span>{(t as any)[selectedArtisanProfile.cityKey]}</span>
              </div>
            </div>
            {selectedArtisanProfile.socialLinks && (selectedArtisanProfile.socialLinks.facebook || selectedArtisanProfile.socialLinks.instagram || selectedArtisanProfile.socialLinks.tiktok || selectedArtisanProfile.socialLinks.website) && (
              <div className="flex justify-center items-center gap-3 mt-5">
                {selectedArtisanProfile.socialLinks.facebook && (
                  <a href={selectedArtisanProfile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(235,230,220,0.8)" }}>
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {selectedArtisanProfile.socialLinks.instagram && (
                  <a href={selectedArtisanProfile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(235,230,220,0.8)" }}>
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {selectedArtisanProfile.socialLinks.tiktok && (
                  <a href={selectedArtisanProfile.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(235,230,220,0.8)" }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  </a>
                )}
                {selectedArtisanProfile.socialLinks.website && (
                  <a href={selectedArtisanProfile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(235,230,220,0.8)" }}>
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <main className="max-w-3xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Contact Card */}
            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid var(--color-sand-200)" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem", color: "var(--color-olive-900)" }}>
                <Phone className="w-4 h-4" style={{ color: "var(--color-clay-500)" }} />
                {t.contactInfo}
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2.5" style={{ color: "var(--color-olive-800)" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-clay-400)" }} />
                  <span dir="ltr" className="font-medium text-sm">{selectedArtisanProfile.phone}</span>
                </div>
                {selectedArtisanProfile.email && (
                  <div className="flex items-center gap-2.5" style={{ color: "var(--color-olive-800)" }}>
                    <MessageSquare className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-clay-400)" }} />
                    <span dir="ltr" className="text-sm">{selectedArtisanProfile.email}</span>
                  </div>
                )}
                {selectedArtisanProfile.location && (
                  <div className="flex items-start gap-2.5 pt-3" style={{ color: "var(--color-olive-700)", borderTop: "1px solid var(--color-sand-200)" }}>
                    <Map className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-clay-400)" }} />
                    <span className="text-sm leading-relaxed">{selectedArtisanProfile.location}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs mb-5" style={{ color: "var(--color-olive-600)" }}>
                <Phone className="w-3 h-3" />
                <span>{selectedArtisanProfile.contactCount || 0} {t.people} {isRtl ? 'تواصلو معاه' : lang === 'fr' ? 'personnes ont contacté' : 'people contacted'}</span>
              </div>
              <button onClick={() => setContactModalArtisan(selectedArtisanProfile)} className="btn-primary w-full flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{t.contactBtn}</span>
              </button>
            </div>

            {/* Bio Card */}
            <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid var(--color-sand-200)" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem", color: "var(--color-olive-900)" }}>
                <Star className="w-4 h-4" style={{ color: "var(--color-clay-500)" }} />
                {t.aboutMe}
              </h3>
              {selectedArtisanProfile.bio ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-olive-700)" }}>
                  {selectedArtisanProfile.bio}
                </p>
              ) : (
                <p className="text-sm italic" style={{ color: "var(--color-sand-300)" }}>
                  {isRtl ? 'لم يتم إضافة نبذة بعد' : 'No bio added yet'}
                </p>
              )}
            </div>
          </div>

          {/* Certificates */}
          {selectedArtisanProfile.certificates && selectedArtisanProfile.certificates.length > 0 && (
            <div className="mt-5 rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid var(--color-sand-200)" }} dir={isRtl ? 'rtl' : 'ltr'}>
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem", color: "var(--color-olive-900)" }}>
                <Award className="w-4 h-4" style={{ color: "var(--color-clay-500)" }} />
                {t.certificates}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedArtisanProfile.certificates.map((cert: string, index: number) => (
                  <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer" style={{ border: "1px solid var(--color-sand-200)" }} onClick={() => setSelectedImage(cert)}>
                    <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(46,46,32,0.5)" }}>
                      <Search className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Shared footer */}
        <footer className="text-center py-12 mt-8" style={{ background: "#1a1a10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2.5 mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <SharedLogoSVG />
              <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.15rem", color: "var(--color-sand-100)", letterSpacing: "0.04em" }}>Lmoqaf</span>
            </div>
            <p className="text-sm mb-6" style={{ color: "rgba(235,230,220,0.35)" }}>{t.footerDesc}</p>
            <div className="flex justify-center gap-6 text-sm" style={{ color: "rgba(235,230,220,0.4)" }}>
              <Link to="/terms" className="hover:opacity-80 transition-opacity">{t.terms}</Link>
              <Link to="/privacy" className="hover:opacity-80 transition-opacity">{t.privacy}</Link>
              <Link to="/about" className="hover:opacity-80 transition-opacity">{t.about}</Link>
            </div>
            <div className="mt-6 pt-6 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(235,230,220,0.2)" }}>
              &copy; {new Date().getFullYear()} {t.rights}
            </div>
          </div>
        </footer>

        {/* Contact Options Modal */}
        {contactModalArtisan && (
          <div className="fixed inset-0 backdrop-blur-sm z-[100] flex items-center justify-center p-4" style={{ background: "rgba(46,46,32,0.5)" }} onClick={(e) => handleModalClick(e, () => setContactModalArtisan(null))}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200" style={{ border: "1px solid var(--color-sand-200)" }}>
              <div className="flex justify-between items-center p-5" style={{ borderBottom: "1px solid var(--color-sand-200)" }}>
                <h3 className="font-semibold" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem", color: "var(--color-olive-900)" }}>{t.contactOptionsTitle}</h3>
                <button onClick={() => setContactModalArtisan(null)} className="hover:opacity-60 transition-opacity" style={{ color: "var(--color-olive-600)" }}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-3">
                <button onClick={() => handleWhatsApp(contactModalArtisan)} className="w-full text-white font-medium py-3 rounded-xl transition-opacity hover:opacity-90 flex justify-center items-center gap-2" style={{ background: "#25D366" }}>
                  <MessageSquare className="w-4 h-4" />{t.whatsapp}
                </button>
                <button onClick={() => handlePhoneCall(contactModalArtisan)} className="w-full font-medium py-3 rounded-xl flex justify-center items-center gap-2 btn-primary">
                  <Phone className="w-4 h-4" />{t.phoneCall}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 rounded-full p-2"><X className="w-7 h-7" /></button>
            <img src={selectedImage} alt="Full size" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} referrerPolicy="no-referrer" />
          </div>
        )}
      </div>
    );
  }

  if (location.pathname === '/about' || location.pathname === '/terms' || location.pathname === '/privacy') {
    let title = '';
    let icon = null;
    let content = null;

    const SharedLogoSVG2 = () => (
      <svg viewBox="0 0 100 100" className="w-8 h-8">
        <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="#2E2E20" stroke="#B86B52" strokeWidth="5" />
        <path d="M28 66 L28 36 L50 54 L72 36 L72 66" fill="none" stroke="#C97D63" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="36" r="4.5" fill="#EAEAE0" />
        <circle cx="72" cy="36" r="4.5" fill="#EAEAE0" />
        <circle cx="50" cy="54" r="4.5" fill="#EAEAE0" />
      </svg>
    );

    if (location.pathname === '/about') {
      title = 'من نحن';
      icon = '🏛️';
      content = (
        <div className="space-y-5 leading-relaxed text-base" dir="rtl" style={{ color: "var(--color-olive-700)" }}>
          <p>
            منصة "الموقف" هي فكرة مغربية 100%، جات باش تعصرن قطاع الحرف في المغرب. الهدف ديالنا هو نسهلو على المواطن يلقى حرفي ثقة وقريب ليه (بلومبي، نجار، صباغ...)، وفي نفس الوقت نعاونو الحرايفية يبانو كتر ويجيبو كليان جديد.
          </p>
          <p>
            حنا كنآمنو باللي الوقت غالي، وداكشي علاش درنا هاد المنصة باش تلقى المعلم اللي بغيتي فجوج دقايق بكل سهولة.
          </p>
        </div>
      );
    } else if (location.pathname === '/terms') {
      title = 'الشروط والأحكام';
      icon = '📋';
      content = (
        <div className="space-y-6 leading-relaxed" dir="rtl" style={{ color: "var(--color-olive-700)" }}>
          {[
            { t: 'الوساطة فقط:', b: 'منصة الموقف هي وساطة تقنية كتربط الزبون بالحرفي. حنا ماشي شركة ديال البناء ولا الصيانة، وماكنتحملوش مسؤولية الجودة ديال الخدمة أو الثمن اللي تفاهمتو عليه.' },
            { t: 'الاستخدام المسؤول:', b: 'ممنوع على الحرايفية يحطو معلومات غالطة، أرقام هواتف ديال ناس خرين، أو صور ماشي ديالهم. يجب احترام الزبناء وتقديم خدمة في المستوى.' },
            { t: 'إلغاء الحساب:', b: 'إدارة المنصة عندها الحق الكامل تمسح أو توقف أي حساب ديال شي حرفي تشتكاو منو الناس بزاف أو خالف قوانين الاستخدام، دون سابق إنذار.' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl" style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)" }}>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem", color: "var(--color-olive-900)" }}>{item.t}</h3>
              <p className="text-sm leading-relaxed">{item.b}</p>
            </div>
          ))}
        </div>
      );
    } else if (location.pathname === '/privacy') {
      title = 'سياسة الخصوصية';
      icon = '🔒';
      content = (
        <div className="space-y-6 leading-relaxed" dir="rtl" style={{ color: "var(--color-olive-700)" }}>
          {[
            { t: 'جمع المعلومات:', b: 'باش تخدم المنصة، كنطلبو من الحرفي فقط المعلومات الأساسية: الاسم، رقم الهاتف، المهنة، المدينة، وصورة شخصية.' },
            { t: 'استعمال المعلومات:', b: 'رقم الهاتف والمعلومات الشخصية كيبانو للزبناء باش يقدرو يتواصلو معاك. حنا كنحاميو على الداتا ديالك وماكنبيعوش المعلومات ديالك لشركات الإعلانات أو أطراف خارجية.' },
            { t: 'حذف الحساب:', b: 'أي حرفي عندو الحق يمسح الحساب ديالو والمعلومات ديالو بصفة نهائية من الموقع فأي وقت من خلال إعدادات الملف الشخصي.' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl" style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)" }}>
              <h3 className="font-semibold mb-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.1rem", color: "var(--color-olive-900)" }}>{item.t}</h3>
              <p className="text-sm leading-relaxed">{item.b}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="min-h-screen font-sans flex flex-col" style={{ background: "var(--color-sand-100)", color: "var(--color-olive-900)" }}>
        {/* Navbar */}
        <nav className="navbar-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                <SharedLogoSVG2 />
                <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.2rem", letterSpacing: "0.04em", color: "var(--color-olive-900)" }}>Lmoqaf</span>
              </div>
              <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "var(--color-clay-500)" }}>
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Page Header */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--color-olive-900)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</div>
          <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "var(--color-sand-100)" }} dir="rtl">{title}</h1>
        </div>

        {/* Content */}
        <main className="flex-grow max-w-3xl mx-auto px-4 py-10 w-full">
          <div className="rounded-2xl p-7 md:p-10" style={{ background: "#FFFFFF", border: "1px solid var(--color-sand-200)" }}>
            {content}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-12 mt-auto" style={{ background: "#1a1a10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2.5 mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <SharedLogoSVG2 />
              <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.15rem", color: "var(--color-sand-100)", letterSpacing: "0.04em" }}>Lmoqaf</span>
            </div>
            <p className="text-sm mb-6" style={{ color: "rgba(235,230,220,0.35)" }}>{t.footerDesc}</p>
            <div className="flex justify-center gap-6 text-sm" style={{ color: "rgba(235,230,220,0.4)" }}>
              <Link to="/terms" className="hover:opacity-80 transition-opacity">{t.terms}</Link>
              <Link to="/privacy" className="hover:opacity-80 transition-opacity">{t.privacy}</Link>
              <Link to="/about" className="hover:opacity-80 transition-opacity">{t.about}</Link>
            </div>
            <div className="mt-6 pt-6 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(235,230,220,0.2)" }}>
              &copy; {new Date().getFullYear()} {t.rights}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (location.pathname === '/profile') {
    return (
      <div className="min-h-screen font-sans" style={{ background: "var(--color-sand-100)", color: "var(--color-olive-900)" }}>
        <nav className="navbar-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="hover:opacity-60 transition-opacity" style={{ color: "var(--color-olive-600)" }}>
                  {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 100 100" className="w-8 h-8">
                    <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="#2E2E20" stroke="#B86B52" strokeWidth="5" />
                    <path d="M28 66 L28 36 L50 54 L72 36 L72 66" fill="none" stroke="#C97D63" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="28" cy="36" r="4.5" fill="#EAEAE0" />
                    <circle cx="72" cy="36" r="4.5" fill="#EAEAE0" />
                    <circle cx="50" cy="54" r="4.5" fill="#EAEAE0" />
                  </svg>
                  <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.2rem", letterSpacing: "0.04em", color: "var(--color-olive-900)" }}>Lmoqaf</span>
                </div>
              </div>
              <div className="flex items-center gap-4 relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-2 rounded-full hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-olive-600)", background: "var(--color-sand-200)" }}
                >
                  <Settings className="w-5 h-5" />
                </button>

                {isSettingsOpen && (
                  <div className={`absolute top-full mt-2 w-52 rounded-xl shadow-xl py-2 z-50 ${isRtl ? 'left-0' : 'right-0'}`} style={{ background: "white", border: "1px solid var(--color-sand-200)" }}>
                    <button onClick={() => { setIsSettingsOpen(false); startEditingProfile(); }} className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors hover:opacity-70" dir={isRtl ? 'rtl' : 'ltr'} style={{ color: "var(--color-olive-800)" }}>
                      <Edit2 className="w-4 h-4" style={{ color: "var(--color-clay-500)" }} />
                      <span>{t.editProfile}</span>
                    </button>
                    <button onClick={() => { setIsSettingsOpen(false); handleDeleteAccount(); }} className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors hover:opacity-70" dir={isRtl ? 'rtl' : 'ltr'} style={{ color: "#C0392B" }}>
                      <Trash2 className="w-4 h-4" />
                      <span>{isRtl ? 'حذف الحساب' : 'Delete Account'}</span>
                    </button>
                    <div className="h-px my-1" style={{ background: "var(--color-sand-200)" }}></div>
                    <button onClick={() => { setIsSettingsOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors hover:opacity-70" dir={isRtl ? 'rtl' : 'ltr'} style={{ color: "var(--color-olive-700)" }}>
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 py-10">
          <div className="rounded-2xl p-7 md:p-10 text-center" style={{ background: "#FFFFFF", border: "1px solid var(--color-sand-200)" }}>
            {profileData ? (
              isEditingProfile ? (
                <div className="text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{t.editProfile}</h2>
                    <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.nameLabel || "الاسم الكامل"}</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all"
                        dir={isRtl ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.phoneLabel || "رقم الهاتف"}</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.profession}</label>
                      <select
                        value={editProfession}
                        onChange={(e) => setEditProfession(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all"
                        dir={isRtl ? 'rtl' : 'ltr'}
                      >
                        {PROFESSIONS.filter(p => p !== 'all').map(prof => (
                          <option key={prof} value={prof}>{(t as any)[prof]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.city}</label>
                      <select
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all"
                        dir={isRtl ? 'rtl' : 'ltr'}
                      >
                        {CITIES.filter(c => c !== 'all').map(city => (
                          <option key={city} value={city}>{(t as any)[city]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.aboutMe}</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder={t.bioPlaceholder}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all resize-none h-24"
                        dir={isRtl ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.shopLocation}</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder={t.locationPlaceholder}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all"
                        dir={isRtl ? 'rtl' : 'ltr'}
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-2">
                      <h3 className="font-medium text-slate-800 mb-3">{t.socialMedia}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Facebook className="w-5 h-5 text-[#B86B52]" />
                          <input
                            type="url"
                            value={editSocial.facebook}
                            onChange={(e) => setEditSocial({ ...editSocial, facebook: e.target.value })}
                            placeholder={t.linkPlaceholder}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Instagram className="w-5 h-5 text-pink-600" />
                          <input
                            type="url"
                            value={editSocial.instagram}
                            onChange={(e) => setEditSocial({ ...editSocial, instagram: e.target.value })}
                            placeholder={t.linkPlaceholder}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                          <input
                            type="url"
                            value={editSocial.tiktok}
                            onChange={(e) => setEditSocial({ ...editSocial, tiktok: e.target.value })}
                            placeholder={t.linkPlaceholder}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-slate-500" />
                          <input
                            type="url"
                            value={editSocial.website}
                            onChange={(e) => setEditSocial({ ...editSocial, website: e.target.value })}
                            placeholder={t.linkPlaceholder}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-0 focus:border-slate-300 outline-none transition-all text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-2">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-slate-800">{t.certificates}</h3>
                        <label className="cursor-pointer text-[#B86B52] hover:opacity-70 text-sm font-medium flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          <span>{t.addCertificate}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleAddCertificate} disabled={isUpdatingProfile} />
                        </label>
                      </div>

                      {editCertificates && editCertificates.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {editCertificates.map((cert: string, index: number) => (
                            <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 group">
                              <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteCertificate(index);
                                  }}
                                  className="text-white hover:text-red-400 p-2"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                          <p className="text-slate-500 text-sm">{t.noCertificates}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isUpdatingProfile}
                        className="flex-1 btn-primary flex justify-center items-center gap-2 disabled:opacity-70"
                      >
                        {isUpdatingProfile ? (
                          <div className="w-4 h-4 rounded-full animate-spin" style={{ border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white" }}></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>{t.saveChanges}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isUpdatingProfile}
                        className="flex-1 font-medium py-2.5 rounded-full transition-opacity hover:opacity-70"
                        style={{ background: "var(--color-sand-100)", border: "1.5px solid var(--color-sand-200)", color: "var(--color-olive-700)" }}
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative inline-block mb-6 group">
                    <img
                      src={profileData.image}
                      alt="Profile"
                      className="w-32 h-32 rounded-full mx-auto object-cover cursor-pointer"
                      style={{ border: "3px solid var(--color-clay-400)" }}
                      onClick={() => setSelectedImage(profileData.image)}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none" style={{ background: "rgba(46,46,32,0.55)" }}>
                      <label className="cursor-pointer text-white hover:opacity-80 transition-opacity flex items-center gap-1 text-xs px-2 py-1 rounded-full pointer-events-auto" style={{ background: "rgba(0,0,0,0.4)" }}>
                        <Camera className="w-3.5 h-3.5" />
                        <span>{t.updatePicture}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpdatePicture} disabled={isUpdatingProfile} />
                      </label>
                      {profileData.image !== "/default-avatar.svg" && (
                        <button onClick={handleDeletePicture} disabled={isUpdatingProfile} className="text-white hover:opacity-80 transition-opacity flex items-center gap-1 text-xs px-2 py-1 rounded-full pointer-events-auto" style={{ background: "rgba(0,0,0,0.4)" }}>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.deletePicture}</span>
                        </button>
                      )}
                    </div>
                    {isUpdatingProfile && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.7)" }}>
                        <div className="w-7 h-7 rounded-full animate-spin" style={{ border: "3px solid var(--color-sand-200)", borderTopColor: "var(--color-clay-500)" }}></div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center items-center gap-2 mb-2">
                    <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.8rem", color: "var(--color-olive-900)" }}>{profileData.name[lang] || profileData.name.ar}</h1>
                  </div>

                  <div className="flex justify-center items-center gap-5 mb-6 text-sm" style={{ color: "var(--color-olive-600)" }}>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" style={{ color: "var(--color-clay-400)" }} />
                      <span>{(t as any)[profileData.professionKey]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" style={{ color: "var(--color-clay-400)" }} />
                      <span>{(t as any)[profileData.cityKey]}</span>
                    </div>
                  </div>

                  {profileData.socialLinks && (profileData.socialLinks.facebook || profileData.socialLinks.instagram || profileData.socialLinks.tiktok || profileData.socialLinks.website) && (
                    <div className="flex justify-center items-center gap-3 mb-7">
                      {profileData.socialLinks.facebook && (
                        <a href={profileData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)", color: "var(--color-olive-700)" }}>
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {profileData.socialLinks.instagram && (
                        <a href={profileData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)", color: "var(--color-clay-500)" }}>
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {profileData.socialLinks.tiktok && (
                        <a href={profileData.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)", color: "var(--color-olive-900)" }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                        </a>
                      )}
                      {profileData.socialLinks.website && (
                        <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)", color: "var(--color-olive-700)" }}>
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                    <div className="rounded-xl p-5" style={{ background: "var(--color-sand-50)", border: "1px solid var(--color-sand-200)" }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.05rem", color: "var(--color-olive-900)" }}>
                        <Phone className="w-4 h-4" style={{ color: "var(--color-clay-500)" }} />
                        {t.contactInfo}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5" style={{ color: "var(--color-olive-700)" }}>
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-clay-400)" }} />
                          <span dir="ltr" className="font-medium text-sm">{profileData.phone}</span>
                        </div>
                        {profileData.email && (
                          <div className="flex items-center gap-2.5" style={{ color: "var(--color-olive-700)" }}>
                            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-clay-400)" }} />
                            <span dir="ltr" className="text-sm">{profileData.email}</span>
                          </div>
                        )}
                        {profileData.location && (
                          <div className="flex items-start gap-2.5 pt-3" style={{ color: "var(--color-olive-700)", borderTop: "1px solid var(--color-sand-200)" }}>
                            <Map className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-clay-400)" }} />
                            <span className="text-sm leading-relaxed">{profileData.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl p-5" style={{ background: "var(--color-sand-50)", border: "1px solid var(--color-sand-200)" }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "1.05rem", color: "var(--color-olive-900)" }}>
                        <Star className="w-4 h-4" style={{ color: "var(--color-clay-500)" }} />
                        {t.aboutMe}
                      </h3>
                      {profileData.bio ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-olive-700)" }}>
                          {profileData.bio}
                        </p>
                      ) : (
                        <p className="text-sm italic" style={{ color: "var(--color-sand-300)" }}>
                          {isRtl ? 'لم يتم إضافة نبذة بعد' : 'No bio added yet'}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="py-16 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full animate-spin mb-3" style={{ border: "3px solid var(--color-sand-200)", borderTopColor: "var(--color-clay-500)" }}></div>
                <p className="text-sm" style={{ color: "var(--color-olive-600)" }}>{t.loadingProfile}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--color-sand-100)", color: "var(--color-olive-900))" }}>
      {/* Navbar */}
      <nav className="navbar-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2.5">
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="#2E2E20" stroke="#B86B52" strokeWidth="5" />
                <path d="M28 66 L28 36 L50 54 L72 36 L72 66" fill="none" stroke="#C97D63" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="28" cy="36" r="4.5" fill="#EAEAE0" />
                <circle cx="72" cy="36" r="4.5" fill="#EAEAE0" />
                <circle cx="50" cy="54" r="4.5" fill="#EAEAE0" />
              </svg>
              <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.25rem", letterSpacing: "0.04em", color: "#2E2E20" }}>Lmoqaf</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: "#B86B52", fontWeight: 500 }} className="transition-colors">{t.home}</a>
              <a href="#how-it-works" onClick={handleSmoothScroll} style={{ color: "#575741" }} className="hover:opacity-70 transition-opacity font-medium">{t.howItWorks}</a>
              <button onClick={openContactModal} style={{ color: "#575741" }} className="hover:opacity-70 transition-opacity font-medium">{t.contact}</button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="relative flex items-center" style={{ color: "#6B6B4E" }}>
                <Globe className="w-4 h-4 absolute mx-2" />
                <select
                  className={`appearance-none rounded-lg py-1.5 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-sm focus:outline-none`}
                  style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)", color: "var(--color-olive-800)" }}
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                >
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
              {!user ? (
                <>
                  <button onClick={openRegisterModal} className="btn-primary">
                    {t.register}
                  </button>
                  <button onClick={openLoginModal} className="btn-outline">
                    {t.login}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden border-2 hover:opacity-80 transition-opacity" style={{ borderColor: "var(--color-clay-500)" }}>
                    <img src={profileData?.image || "https://picsum.photos/seed/default/150/150"} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                  <button onClick={handleLogout} className="hover:opacity-60 transition-opacity font-medium" style={{ color: "var(--color-clay-500)" }} title={t.logout}>
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <select
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-0"
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
              >
                <option value="ar">AR</option>
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-slate-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-3 space-y-1 sm:px-3" id="mobileMenu">
            <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block px-3 py-2 rounded-md text-base font-medium text-[#B86B52] bg-[#F5F5F0] mobile-link">{t.home}</a>
            <a href="#how-it-works" onClick={handleSmoothScroll} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 mobile-link">{t.howItWorks}</a>
            <button onClick={() => { openContactModal(); setIsMobileMenuOpen(false); }} className={`block w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 mobile-link`}>{t.contact}</button>

            {!user ? (
              <>
                <button onClick={() => { openLoginModal(); setIsMobileMenuOpen(false); }} className={`block w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2 rounded-md text-base font-medium text-[#B86B52] hover:opacity-70 hover:bg-slate-50`}>{t.login}</button>
                <button onClick={() => { openRegisterModal(); setIsMobileMenuOpen(false); }} className="w-full text-center mt-4 px-3 py-2 rounded-full font-medium" style={{ background: "var(--color-clay-500)", color: "white" }}>
                  {t.register}
                </button>
              </>
            ) : (
              <div className="pt-4 pb-2 border-t border-slate-100">
                <div className="flex items-center px-3 mb-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-[#D8D8CA] cursor-pointer"
                      src={profileData?.image || "https://picsum.photos/seed/default/150/150"}
                      alt="Profile"
                      onClick={() => setSelectedImage(profileData?.image || "https://picsum.photos/seed/default/150/150")}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className={`ml-3 ${isRtl ? 'mr-3 ml-0' : ''}`}>
                    <div className="text-base font-medium text-slate-800">{profileData?.name?.[lang] || profileData?.name?.ar || 'User'}</div>
                  </div>
                </div>
                <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className={`block w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50`}>الملف الشخصي</button>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={`block w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-slate-50`}>{t.logout}</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      {(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') && (
        <>
          {/* Hero Section */}
          <div className="hero-bg text-white py-24 px-4 relative">
            {/* Decorative ring */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div style={{ position: "absolute", top: "-120px", right: "-120px", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(184,107,82,0.12)", pointerEvents: "none" }}></div>
              <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(184,107,82,0.08)", pointerEvents: "none" }}></div>
            </div>

            <div className="max-w-3xl mx-auto text-center relative z-20">
              <div className="hero-badge">
                <span>🇲🇦</span>
                <span>{isRtl ? "الدليل الوطني للحرفيين" : lang === 'fr' ? "L'annuaire national des artisans" : "Morocco's Artisan Directory"}</span>
              </div>
              <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "clamp(2.4rem, 5vw, 3.8rem)", lineHeight: 1.15, marginBottom: "1.25rem", letterSpacing: "-0.01em" }}>
                {t.heroTitle}
              </h1>
              <p style={{ fontSize: "1.05rem", color: "rgba(235,230,220,0.75)", maxWidth: "580px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
                {t.heroDesc}
              </p>

              {/* Search & Filter Section */}
              <div className={`search-box p-5 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="flex-1 relative" ref={professionDropdownRef}>
                  <label className={`block text-xs font-semibold mb-1.5 ${isRtl ? 'pr-1' : 'pl-1'}`} style={{ color: "#6B6B4E", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.7rem" }}>{t.profession}</label>
                  <div className="relative">
                    <Briefcase className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-4 w-4 z-10`} style={{ color: "#B86B52" }} />
                    <div
                      className={`w-full rounded-xl py-3 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'} cursor-pointer flex items-center justify-between focus:outline-none text-sm font-medium`}
                      style={{ background: "var(--color-sand-100)", border: "1.5px solid var(--color-sand-200)", color: "var(--color-olive-900)" }}
                      onClick={() => { setIsProfessionDropdownOpen(!isProfessionDropdownOpen); setIsCityDropdownOpen(false); }}
                    >
                      <span className="truncate">{(t as any)[selectedProfession]}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform`} style={{ color: "#B86B52", transform: isProfessionDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </div>

                    {isProfessionDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 max-h-60 flex flex-col overflow-hidden" style={{ border: "1px solid var(--color-sand-200)" }}>
                        <div className="overflow-y-auto flex-1 py-1 text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                          {PROFESSIONS.map(prof => (
                            <div
                              key={prof}
                              className={`px-4 py-2 cursor-pointer text-sm transition-colors`}
                              style={{ background: selectedProfession === prof ? "rgba(184,107,82,0.08)" : "transparent", color: selectedProfession === prof ? "var(--color-clay-500)" : "var(--color-olive-800)", fontWeight: selectedProfession === prof ? 600 : 400 }}
                              onMouseEnter={e => { if (selectedProfession !== prof) (e.currentTarget as HTMLElement).style.background = "var(--color-sand-100)"; }}
                              onMouseLeave={e => { if (selectedProfession !== prof) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              onClick={() => {
                                setSelectedProfession(prof);
                                setIsProfessionDropdownOpen(false);
                              }}
                            >
                              {(t as any)[prof]}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:block w-px my-2" style={{ background: "var(--color-sand-200)" }}></div>

                <div className="flex-1 relative" ref={cityDropdownRef}>
                  <label className={`block text-xs font-semibold mb-1.5 ${isRtl ? 'pr-1' : 'pl-1'}`} style={{ color: "#6B6B4E", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.7rem" }}>{t.city}</label>
                  <div className="relative">
                    <MapPin className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-4 w-4 z-10`} style={{ color: "#B86B52" }} />
                    <div
                      className={`w-full rounded-xl py-3 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'} cursor-pointer flex items-center justify-between focus:outline-none text-sm font-medium`}
                      style={{ background: "var(--color-sand-100)", border: "1.5px solid var(--color-sand-200)", color: "var(--color-olive-900)" }}
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    >
                      <span className="truncate">{(t as any)[selectedCity]}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform`} style={{ color: "#B86B52", transform: isCityDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </div>

                    {isCityDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 max-h-60 flex flex-col overflow-hidden" style={{ border: "1px solid var(--color-sand-200)" }}>
                        <div className="p-2 border-b" style={{ borderColor: "var(--color-sand-200)" }}>
                          <div className="relative">
                            <Search className={`absolute ${isRtl ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 h-4 w-4`} style={{ color: "#B86B52" }} />
                            <input
                              type="text"
                              className={`w-full rounded-lg py-2 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-sm focus:outline-none`}
                              style={{ background: "var(--color-sand-100)", border: "1px solid var(--color-sand-200)", color: "var(--color-olive-900)" }}
                              placeholder={t.search}
                              value={citySearchQuery}
                              onChange={(e) => setCitySearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {CITIES.filter(city => (t as any)[city].toLowerCase().includes(citySearchQuery.toLowerCase())).map(city => (
                            <div
                              key={city}
                              className={`px-4 py-2 cursor-pointer text-sm transition-colors`}
                              style={{ background: selectedCity === city ? "rgba(184,107,82,0.08)" : "transparent", color: selectedCity === city ? "var(--color-clay-500)" : "var(--color-olive-800)", fontWeight: selectedCity === city ? 600 : 400 }}
                              onMouseEnter={e => { if (selectedCity !== city) (e.currentTarget as HTMLElement).style.background = "var(--color-sand-100)"; }}
                              onMouseLeave={e => { if (selectedCity !== city) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                              onClick={() => {
                                setSelectedCity(city);
                                setIsCityDropdownOpen(false);
                                setCitySearchQuery('');
                              }}
                            >
                              {(t as any)[city]}
                            </div>
                          ))}
                          {CITIES.filter(city => (t as any)[city].toLowerCase().includes(citySearchQuery.toLowerCase())).length === 0 && (
                            <div className="px-4 py-3 text-sm text-center" style={{ color: "#6B6B4E" }}>
                              {t.noResults}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="section-label">{isRtl ? "الحرفيون" : lang === 'fr' ? "Artisans" : "Artisans"}</span>
                <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "2rem", color: "var(--color-olive-900)", marginBottom: "0.25rem" }}>{t.availableArtisans}</h2>
                <p style={{ color: "var(--color-olive-600)", fontSize: "0.9rem" }}>
                  {filteredArtisans.length > 0
                    ? `${t.found} ${filteredArtisans.length} ${t.matching}`
                    : t.noResults}
                </p>
              </div>
            </div>

            {filteredArtisans.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredArtisans.map(artisan => (
                    <div key={artisan.id} className="artisan-card">
                      <div className="artisan-card-accent"></div>
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <img
                            src={artisan.image}
                            alt={artisan.name[lang]}
                            className="w-14 h-14 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                            style={{ border: "2px solid var(--color-sand-200)" }}
                            onClick={() => {
                              navigate('/artisan/' + artisan.id);
                              window.scrollTo(0, 0);
                            }}
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold mb-1 cursor-pointer truncate transition-colors hover:opacity-70"
                              style={{ color: "var(--color-olive-900)", fontSize: "1rem" }}
                              onClick={() => {
                                navigate('/artisan/' + artisan.id);
                                window.scrollTo(0, 0);
                              }}
                            >
                              {artisan.name[lang] || artisan.name.ar || artisan.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mb-1" style={{ color: "var(--color-olive-600)", fontSize: "0.82rem" }}>
                              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{(t as any)[artisan.professionKey]}</span>
                            </div>
                            <div className="flex items-center gap-1.5" style={{ color: "var(--color-olive-600)", fontSize: "0.82rem" }}>
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{(t as any)[artisan.cityKey]}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3 flex justify-between items-center" style={{ borderTop: "1px solid var(--color-sand-200)", background: "var(--color-sand-50)" }}>
                        <div className="flex items-center gap-1.5" style={{ color: "var(--color-olive-600)", fontSize: "0.78rem" }}>
                          <Phone className="w-3 h-3" />
                          <span>{artisan.contactCount || 0} {isRtl ? "تواصل" : "contacts"}</span>
                        </div>
                        <button onClick={() => setContactModalArtisan(artisan)} className="btn-contact">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t.contactBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="mt-12 flex justify-center">
                  {hasMore ? (
                    <button
                      onClick={loadMoreArtisans}
                      disabled={isLoadingMore}
                      className="btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-clay-500)", borderTopColor: "transparent" }}></div>
                          {isRtl ? 'جاري التحميل...' : 'Loading...'}
                        </>
                      ) : (
                        isRtl ? 'عرض المزيد' : 'Load More'
                      )}
                    </button>
                  ) : (
                    <p className="font-medium px-6 py-2 rounded-full text-sm" style={{ color: "var(--color-olive-600)", background: "var(--color-sand-200)" }}>
                      {isRtl ? 'نهاية القائمة' : 'End of list'}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 rounded-2xl border-2 border-dashed" style={{ background: "white", borderColor: "var(--color-sand-200)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--color-sand-100)" }}>
                  <Search className="w-8 h-8" style={{ color: "var(--color-clay-400)" }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: "var(--color-olive-900)" }}>{t.noResultsTitle}</h3>
                <p className="max-w-md mx-auto text-sm" style={{ color: "var(--color-olive-600)" }}>
                  {t.noResultsDesc}
                </p>
                <button
                  onClick={() => {
                    setSelectedProfession('all');
                    setSelectedCity('all');
                  }}
                  className="mt-6 font-medium hover:opacity-70 transition-opacity text-sm"
                  style={{ color: "var(--color-clay-500)" }}
                >
                  {t.clearFilters}
                </button>
              </div>
            )}
          </main>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-24" style={{ background: "var(--color-olive-900)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="section-label" style={{ color: "var(--color-clay-400)" }}>
                  {isRtl ? "كيف نعمل" : lang === 'fr' ? "Comment ça marche" : "How It Works"}
                </span>
                <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "clamp(2rem,4vw,3rem)", color: "var(--color-sand-100)", marginTop: "0.25rem" }}>
                  {t.howItWorksTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="step-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="step-icon" style={{ background: "rgba(184,107,82,0.15)" }}>
                    <Search className="w-7 h-7" style={{ color: "var(--color-clay-400)" }} />
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.3rem", color: "var(--color-sand-100)", marginBottom: "0.6rem" }}>{t.step1Title}</div>
                  <p style={{ color: "rgba(235,230,220,0.6)", fontSize: "0.9rem", lineHeight: 1.65 }}>{t.step1Desc}</p>
                </div>

                <div className="step-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="step-icon" style={{ background: "rgba(201,168,76,0.15)" }}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.3rem", color: "var(--color-sand-100)", marginBottom: "0.6rem" }}>{t.step2Title}</div>
                  <p style={{ color: "rgba(235,230,220,0.6)", fontSize: "0.9rem", lineHeight: 1.65 }}>{t.step2Desc}</p>
                </div>

                <div className="step-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="step-icon" style={{ background: "rgba(107,184,107,0.15)" }}>
                    <Phone className="w-7 h-7" style={{ color: "#6BC47E" }} />
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.3rem", color: "var(--color-sand-100)", marginBottom: "0.6rem" }}>{t.step3Title}</div>
                  <p style={{ color: "rgba(235,230,220,0.6)", fontSize: "0.9rem", lineHeight: 1.65 }}>{t.step3Desc}</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="text-center py-14" style={{ background: "#1a1a10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="#2E2E20" stroke="#B86B52" strokeWidth="5" />
              <path d="M28 66 L28 36 L50 54 L72 36 L72 66" fill="none" stroke="#C97D63" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="36" r="4.5" fill="#EAEAE0" />
              <circle cx="72" cy="36" r="4.5" fill="#EAEAE0" />
              <circle cx="50" cy="54" r="4.5" fill="#EAEAE0" />
            </svg>
            <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 600, fontSize: "1.25rem", color: "var(--color-sand-100)", letterSpacing: "0.04em" }}>Lmoqaf</span>
          </div>
          <p className="mb-8 text-sm" style={{ color: "rgba(235,230,220,0.45)" }}>{t.footerDesc}</p>
          <div className="flex justify-center gap-6 text-sm" style={{ color: "rgba(235,230,220,0.4)" }}>
            <Link to="/terms" className="hover:opacity-80 transition-opacity">{t.terms}</Link>
            <Link to="/privacy" className="hover:opacity-80 transition-opacity">{t.privacy}</Link>
            <Link to="/about" className="hover:opacity-80 transition-opacity">{t.about}</Link>
          </div>
          <div className="mt-8 pt-6 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(235,230,220,0.25)" }}>
            &copy; {new Date().getFullYear()} {t.rights}
          </div>
        </div>
      </footer>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 bg-[rgba(46,46,32,0.5)] backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => handleModalClick(e, () => navigate('/'))}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{t.registerTitle}</h3>
              <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleRegisterSubmit}>
              {regError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {regError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  name="name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.phoneLabel}</label>
                <input
                  type="tel"
                  name="phone"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.profession}</label>
                <select
                  name="profession"
                  value={regProfession}
                  onChange={(e) => setRegProfession(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0 bg-white"
                >
                  {PROFESSIONS.filter(p => p !== 'all').map(prof => (
                    <option key={prof} value={prof}>{(t as any)[prof]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.city}</label>
                <select
                  name="city"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0 bg-white"
                >
                  {CITIES.filter(c => c !== 'all').map(city => (
                    <option key={city} value={city}>{(t as any)[city]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.passwordLabel}</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    name="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className={`w-full border border-slate-200 rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-0 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'}`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none`}
                  >
                    {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary font-medium py-3 rounded-lg transition-colors mt-6">
                {t.submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {isProfilePicModalOpen && (
        <div
          className="fixed inset-0 bg-[rgba(46,46,32,0.5)] backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleProfilePicSkip();
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{t.uploadProfilePicTitle}</h3>
              <button onClick={handleProfilePicSkip} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6 text-center">
              <p className="text-slate-600">{t.uploadProfilePicDesc}</p>

              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="10" r="3"></circle>
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicInput"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePicFile(file);
                      setProfilePicPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <label
                  htmlFor="profilePicInput"
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-0"
                >
                  {t.uploadBtn}
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleProfilePicSkip}
                  disabled={isUploadingPic}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {t.skipBtn}
                </button>
                <button
                  type="button"
                  onClick={handleProfilePicSubmit}
                  disabled={isUploadingPic || !profilePicFile}
                  className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center"
                >
                  {isUploadingPic ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    t.saveBtn
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 bg-[rgba(46,46,32,0.5)] backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => handleModalClick(e, () => navigate('/'))}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{t.loginTitle}</h3>
              <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {loginError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.phoneLabel}</label>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.passwordLabel}</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`w-full border border-slate-200 rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-0 ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'}`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none`}
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary font-medium py-3 rounded-lg transition-colors mt-6">
                {t.login}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div
          className="fixed inset-0 bg-[rgba(46,46,32,0.5)] backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => handleModalClick(e, setIsContactModalOpen)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{t.contactTitle}</h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleContactSubmit}>
              {contactError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {contactError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  name="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  name="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.messageLabel}</label>
                <textarea
                  rows={4}
                  name="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-0 resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full btn-primary font-medium py-3 rounded-lg transition-colors mt-6 flex justify-center items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t.sendBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Options Modal */}
      {contactModalArtisan && (
        <div
          className="fixed inset-0 bg-[rgba(46,46,32,0.5)] backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => handleModalClick(e, () => setContactModalArtisan(null))}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{t.contactOptionsTitle}</h3>
              <button onClick={() => setContactModalArtisan(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => handleWhatsApp(contactModalArtisan)}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                {t.whatsapp}
              </button>
              <button
                onClick={() => handlePhoneCall(contactModalArtisan)}
                className="w-full btn-primary font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {t.phoneCall}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg font-medium text-white z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-[#3D8B5E]' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}