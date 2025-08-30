import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "parking": "Parking",
      "wallet": "Wallet",
      "profile": "Profile",
      "logout": "Logout",
      "login": "Login",
      "signup": "Sign Up",
      
      // Hero Section
      "hero.title": "Smart Parking Made Simple",
      "hero.subtitle": "Find, book, and pay for parking spots instantly. Earn rewards with every booking!",
      "hero.cta": "Find Parking Now",
      
      // Features
      "features.booking": "Quick Booking",
      "features.booking.desc": "Book parking spots in advance",
      "features.wallet": "Digital Wallet",
      "features.wallet.desc": "Earn points and rewards",
      "features.live": "Live Availability",
      "features.live.desc": "Real-time parking updates",
      
      // Wallet
      "wallet.balance": "Wallet Balance",
      "wallet.points": "Points",
      "wallet.transactions": "Transactions",
      "wallet.addMoney": "Add Money",
      "wallet.tier": "Tier",
      
      // Authentication
      "auth.email": "Email Address",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.name": "Full Name",
      "auth.phone": "Phone Number",
      "auth.loginTitle": "Welcome Back",
      "auth.signupTitle": "Create Account",
      "auth.forgotPassword": "Forgot Password?",
      "auth.rememberMe": "Remember me",
      "auth.switchToSignup": "Don't have an account? Sign up",
      "auth.switchToLogin": "Already have an account? Login",
      
      // Chatbot
      "chat.title": "Park Sarthi Assistant",
      "chat.greeting": "Hi! I'm your Park Sarthi assistant. How can I help you today?",
      "chat.placeholder": "Type your message...",
      "chat.send": "Send",
      "chat.thinking": "Thinking...",
      "chat.error": "I'm sorry, I'm having trouble responding right now. Please try again.",
      "chat.uploadImage": "Upload Image",
      "chat.supportedFormats": "Supported: JPG, PNG, GIF (max 5MB)",
      "chat.imageUploaded": "Image uploaded successfully",
      "chat.askAboutImage": "What would you like to know about this image?",
      "chat.selectLanguage": "Select Language",
      
      // Common
      "loading": "Loading...",
      "save": "Save",
      "cancel": "Cancel",
      "success": "Success",
      "error": "Error",
      "confirm": "Confirm",
      "book": "Book Now",
      "available": "Available",
      "occupied": "Occupied",
      "points": "points",
      "rupees": "₹"
    }
  },
  hi: {
    translation: {
      // Navigation
      "home": "होम",
      "parking": "पार्किंग",
      "wallet": "वॉलेट",
      "profile": "प्रोफाइल",
      "logout": "लॉगआउट",
      "login": "लॉगिन",
      "signup": "साइन अप",
      
      // Hero Section
      "hero.title": "स्मार्ट पार्किंग आसान बनाया गया",
      "hero.subtitle": "तुरंत पार्किंग स्पॉट खोजें, बुक करें और भुगतान करें। हर बुकिंग के साथ रिवॉर्ड अर्जित करें!",
      "hero.cta": "अभी पार्किंग खोजें",
      
      // Features
      "features.booking": "त्वरित बुकिंग",
      "features.booking.desc": "पहले से पार्किंग स्पॉट बुक करें",
      "features.wallet": "डिजिटल वॉलेट",
      "features.wallet.desc": "पॉइंट्स और रिवॉर्ड कमाएं",
      "features.live": "लाइव उपलब्धता",
      "features.live.desc": "रियल-टाइम पार्किंग अपडेट",
      
      // Wallet
      "wallet.balance": "वॉलेट बैलेंस",
      "wallet.points": "पॉइंट्स",
      "wallet.transactions": "लेन-देन",
      "wallet.addMoney": "पैसे जोड़ें",
      "wallet.tier": "टियर",
      
      // Authentication
      "auth.email": "ईमेल पता",
      "auth.password": "पासवर्ड",
      "auth.confirmPassword": "पासवर्ड की पुष्टि करें",
      "auth.name": "पूरा नाम",
      "auth.phone": "फोन नंबर",
      "auth.loginTitle": "वापस स्वागत है",
      "auth.signupTitle": "खाता बनाएं",
      "auth.forgotPassword": "पासवर्ड भूल गए?",
      "auth.rememberMe": "मुझे याद रखें",
      "auth.switchToSignup": "कोई खाता नहीं है? साइन अप करें",
      "auth.switchToLogin": "पहले से खाता है? लॉगिन करें",
      
      // Chatbot
      "chat.title": "पार्क सारथी सहायक",
      "chat.greeting": "नमस्ते! मैं आपका पार्क सारथी सहायक हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      "chat.placeholder": "अपना संदेश टाइप करें...",
      "chat.send": "भेजें",
      "chat.thinking": "सोच रहा हूं...",
      "chat.error": "क्षमा करें, मुझे अभी जवाब देने में परेशानी हो रही है। कृपया फिर से कोशिश करें।",
      "chat.uploadImage": "इमेज अपलोड करें",
      "chat.supportedFormats": "समर्थित: JPG, PNG, GIF (अधिकतम 5MB)",
      "chat.imageUploaded": "इमेज सफलतापूर्वक अपलोड हुई",
      "chat.askAboutImage": "आप इस इमेज के बारे में क्या जानना चाहते हैं?",
      "chat.selectLanguage": "भाषा चुनें",
      
      // Common
      "loading": "लोड हो रहा है...",
      "save": "सेव करें",
      "cancel": "रद्द करें",
      "success": "सफलता",
      "error": "त्रुटि",
      "confirm": "पुष्टि करें",
      "book": "अभी बुक करें",
      "available": "उपलब्ध",
      "occupied": "कब्जे में",
      "points": "पॉइंट्स",
      "rupees": "₹"
    }
  },
  ta: {
    translation: {
      // Navigation
      "home": "முகப்பு",
      "parking": "நிறுத்துமிடம்",
      "wallet": "பணப்பை",
      "profile": "சுயவிவரம்",
      "logout": "வெளியேறு",
      "login": "உள்நுழை",
      "signup": "பதிவு செய்",
      
      // Hero Section
      "hero.title": "ஸ்மார்ட் பார்க்கிங் எளிதாக்கப்பட்டது",
      "hero.subtitle": "உடனடியாக பார்க்கிங் இடங்களைக் கண்டுபிடித்து, முன்பதிவு செய்து, பணம் செலுத்துங்கள்!",
      "hero.cta": "இப்போது பார்க்கிங் கண்டுபிடி",
      
      // Features
      "features.booking": "விரைவு முன்பதிவு",
      "features.booking.desc": "முன்கூட்டியே பார்க்கிங் இடங்களை முன்பதிவு செய்யுங்கள்",
      "features.wallet": "டிஜிட்டல் வாலட்",
      "features.wallet.desc": "புள்ளிகள் மற்றும் வெகுமதிகளைப் பெறுங்கள்",
      "features.live": "நேரடி கிடைப்பு",
      "features.live.desc": "நிகழ்நேர பார்க்கிங் புதுப்பிப்புகள்",
      
      // Wallet
      "wallet.balance": "பணப்பை இருப்பு",
      "wallet.points": "புள்ளிகள்",
      "wallet.transactions": "பரிவர்த்தனைகள்",
      "wallet.addMoney": "பணம் சேர்",
      "wallet.tier": "அடுக்கு",
      
      // Authentication
      "auth.email": "மின்னஞ்சல் முகவரி",
      "auth.password": "கடவுச்சொல்",
      "auth.confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      "auth.name": "முழு பெயர்",
      "auth.phone": "தொலைபேசி எண்",
      "auth.loginTitle": "மீண்டும் வரவேற்கிறோம்",
      "auth.signupTitle": "கணக்கை உருவாக்கவும்",
      "auth.forgotPassword": "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
      "auth.rememberMe": "என்னை நினைவில் வைத்துக் கொள்ளுங்கள்",
      "auth.switchToSignup": "கணக்கு இல்லையா? பதிவு செய்யுங்கள்",
      "auth.switchToLogin": "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையுங்கள்",
      
      // Chatbot
      "chat.title": "பார்க் சாரதி உதவியாளர்",
      "chat.greeting": "வணக்கம்! நான் உங்கள் பார்க் சாரதி உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
      "chat.placeholder": "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...",
      "chat.send": "அனுப்பு",
      "chat.thinking": "யோசித்து கொண்டிருக்கிறேன்...",
      "chat.error": "மன்னிக்கவும், எனக்கு இப்போது பதில் அளிப்பதில் சிக்கல் உள்ளது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      "chat.uploadImage": "படம் பதிவேற்று",
      "chat.supportedFormats": "ஆதரிக்கப்படுபவை: JPG, PNG, GIF (அதிகபட்சம் 5MB)",
      "chat.imageUploaded": "படம் வெற்றிகரமாக பதிவேற்றப்பட்டது",
      "chat.askAboutImage": "இந்த படத்தைப் பற்றி நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
      "chat.selectLanguage": "மொழியைத் தேர்ந்தெடுக்கவும்",
      
      // Common
      "loading": "ஏற்றுகிறது...",
      "save": "சேமி",
      "cancel": "ரத்து செய்",
      "success": "வெற்றி",
      "error": "பிழை",
      "confirm": "உறுதிப்படுத்தவும்",
      "book": "இப்போது முன்பதிவு செய்யுங்கள்",
      "available": "கிடைக்கிறது",
      "occupied": "ஆக்கிரமிக்கப்பட்டது",
      "points": "புள்ளிகள்",
      "rupees": "₹"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;