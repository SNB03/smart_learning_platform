import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Globe, UserCheck, Key,
  MonitorPlay, GraduationCap, Phone, Heart,
  Shield, Smartphone, MapPin, Clock, MousePointerClick,
  Menu, X
} from 'lucide-react';

const translations = {
  en: {
    schoolName: "Saraswati Vidyalaya",
    navGuide: "How to Login",
    navBenefits: "Benefits",
    loginBtn: "Login",
    heroBadge: "Community Education Initiative",
    heroTitle: "Welcome to our Digital Classroom!",
    heroSub: "A free, easy-to-use learning platform for our students. Study from home with trusted materials provided directly by our school teachers.",
    guideTitle: "Parent Guide: How to use this website",
    guideSub: "Follow these 3 simple steps to help your child start learning.",
    step1Title: "1. Get your ID Paper",
    step1Desc: "Your child's class teacher will give them a physical paper. Keep it safe! It contains their personal Student Email and Password.",
    step2Title: "2. Click the Login Button",
    step2Desc: "Open this website on your phone or computer. Tap the blue 'Login' button.",
    step3Title: "3. Enter Details & Learn",
    step3Desc: "Type the exact Email and Password from the paper into the boxes and tap Secure Login. Your child's dashboard will open automatically!",
    benefitsTitle: "What will students gain?",
    benefitsSub: "Everything your child needs to succeed, in one safe place.",
    feat1Title: "Read Lesson Summaries",
    feat1Desc: "Easy-to-read notes for every chapter taught in school.",
    feat2Title: "Take Practice Tests",
    feat2Desc: "Small quizzes to help them prepare for their real exams without fear.",
    feat3Title: "Learn on Any Device",
    feat3Desc: "Access study materials from a mobile phone or computer at any time.",
    feat4Title: "Safe & Ad-Free",
    feat4Desc: "A secure environment with zero advertisements or outside links.",
    footerAddress: "School Address",
    footerAddressText: "123 Education Lane, Pune, Maharashtra 411001",
    footerTime: "Office Timings",
    footerTimeText: "Monday to Saturday: 9:00 AM - 4:00 PM",
    helpText: "Need help? Call us at +91 98765 43210",
    footerRights: "A Community Education Project."
  },
  mr: {
    schoolName: "सरस्वती विद्यालय",
    navGuide: "लॉग इन कसे करावे",
    navBenefits: "फायदे",
    loginBtn: "लॉग इन",
    heroBadge: "सामुदायिक शिक्षण उपक्रम",
    heroTitle: "आमच्या डिजिटल वर्गात आपले स्वागत आहे!",
    heroSub: "आमच्या विद्यार्थ्यांसाठी मोफत आणि सोपे शिक्षण मंच. शाळेच्या शिक्षकांनी दिलेल्या साहित्यासह घरबसल्या सुरक्षितपणे अभ्यास करा.",
    guideTitle: "पालकांसाठी मार्गदर्शक: ही वेबसाइट कशी वापरावी",
    guideSub: "तुमच्या पाल्याला शिकण्यास मदत करण्यासाठी या ३ सोप्या पायऱ्या फॉलो करा.",
    step1Title: "१. ओळखपत्र मिळवा",
    step1Desc: "तुमच्या पाल्याचे वर्गशिक्षक त्यांना एक कागद देतील. तो सुरक्षित ठेवा! त्यात त्यांचा विद्यार्थी ईमेल आणि पासवर्ड आहे.",
    step2Title: "२. लॉग इन बटणावर क्लिक करा",
    step2Desc: "तुमच्या फोनवर ही वेबसाइट उघडा. निळ्या 'लॉग इन' बटणावर टॅप करा.",
    step3Title: "३. माहिती भरा आणि शिका",
    step3Desc: "कागदावरील अचूक ईमेल आणि पासवर्ड बॉक्समध्ये टाइप करा आणि सुरक्षित लॉग इन वर टॅप करा. तुमच्या पाल्याचा डॅशबोर्ड आपोआप उघडेल!",
    benefitsTitle: "विद्यार्थ्यांना काय फायदा होईल?",
    benefitsSub: "तुमच्या पाल्याच्या यशासाठी आवश्यक असलेले सर्व काही, एका सुरक्षित ठिकाणी.",
    feat1Title: "धड्यांचे सारांश वाचा",
    feat1Desc: "शाळेत शिकवल्या जाणाऱ्या प्रत्येक धड्यासाठी वाचण्यास सोप्या नोट्स.",
    feat2Title: "सराव चाचण्या द्या",
    feat2Desc: "खऱ्या परीक्षेची भीती न बाळगता तयारी करण्यासाठी छोट्या चाचण्या.",
    feat3Title: "कोणत्याही उपकरणावर शिका",
    feat3Desc: "मोबाईल किंवा संगणकावरून कधीही अभ्यासाचे साहित्य मिळवा.",
    feat4Title: "सुरक्षित आणि जाहिरातमुक्त",
    feat4Desc: "कोणत्याही जाहिराती किंवा बाहेरील लिंक्स नसलेले १००% सुरक्षित वातावरण.",
    footerAddress: "शाळेचा पत्ता",
    footerAddressText: "१२३ एज्युकेशन लेन, पुणे, महाराष्ट्र ४११००१",
    footerTime: "कार्यालयाची वेळ",
    footerTimeText: "सोमवार ते शनिवार: सकाळी ९:०० - संध्याकाळी ४:००",
    helpText: "मदत हवी आहे? आम्हाला +91 98765 43210 वर कॉल करा",
    footerRights: "एक सामुदायिक शिक्षण प्रकल्प."
  },
  hi: {
    schoolName: "सरस्वती विद्यालय",
    navGuide: "लॉग इन कैसे करें",
    navBenefits: "लाभ",
    loginBtn: "लॉग इन",
    heroBadge: "सामुदायिक शिक्षा पहल",
    heroTitle: "हमारे डिजिटल कक्षा में आपका स्वागत है!",
    heroSub: "हमारे छात्रों के लिए एक मुफ्त और आसान शिक्षण मंच। स्कूल के शिक्षकों द्वारा दी गई सामग्री से घर बैठे सुरक्षित रूप से पढ़ाई करें।",
    guideTitle: "अभिभावक गाइड: इस वेबसाइट का उपयोग कैसे करें",
    guideSub: "अपने बच्चे को सीखने में मदद करने के लिए इन 3 सरल चरणों का पालन करें।",
    step1Title: "1. अपना आईडी पेपर प्राप्त करें",
    step1Desc: "आपके बच्चे के कक्षा शिक्षक उन्हें एक कागज देंगे। इसे सुरक्षित रखें! इसमें उनका छात्र ईमेल और पासवर्ड है।",
    step2Title: "2. लॉग इन बटन पर क्लिक करें",
    step2Desc: "अपने फोन पर यह वेबसाइट खोलें। नीले 'लॉग इन' बटन पर टैप करें।",
    step3Title: "3. विवरण दर्ज करें और सीखें",
    step3Desc: "कागज से सटीक ईमेल और पासवर्ड बॉक्स में टाइप करें और सुरक्षित लॉग इन पर टैप करें। आपके बच्चे का डैशबोर्ड अपने आप खुल जाएगा!",
    benefitsTitle: "छात्रों को क्या लाभ होगा?",
    benefitsSub: "आपके बच्चे की सफलता के लिए आवश्यक सब कुछ, एक सुरक्षित स्थान पर।",
    feat1Title: "पाठ सारांश पढ़ें",
    feat1Desc: "स्कूल में पढ़ाए जाने वाले हर अध्याय के लिए आसानी से पढ़े जाने वाले नोट्स।",
    feat2Title: "अभ्यास परीक्षा दें",
    feat2Desc: "बिना डरे असली परीक्षा की तैयारी के लिए छोटे क्विज़।",
    feat3Title: "किसी भी उपकरण पर सीखें",
    feat3Desc: "मोबाइल या कंप्यूटर से किसी भी समय अध्ययन सामग्री प्राप्त करें।",
    feat4Title: "सुरक्षित और विज्ञापन-मुक्त",
    feat4Desc: "बिना किसी विज्ञापन या बाहरी लिंक के 100% सुरक्षित वातावरण।",
    footerAddress: "स्कूल का पता",
    footerAddressText: "123 एजुकेशन लेन, पुणे, महाराष्ट्र 411001",
    footerTime: "कार्यालय का समय",
    footerTimeText: "सोमवार से शनिवार: सुबह 9:00 - शाम 4:00",
    helpText: "मदद चाहिए? हमें +91 98765 43210 पर कॉल करें",
    footerRights: "एक सामुदायिक शिक्षा परियोजना।"
  }
};

const Home = () => {
  const [lang, setLang] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang];

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">

      {/* 1. Mobile-First Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex justify-between items-center">

          {/* Logo - Scales well on mobile */}
          <div className="flex items-center gap-2 md:gap-3 z-50">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg md:text-2xl font-extrabold text-gray-900 tracking-tight leading-none">{t.schoolName}</h1>
              <span className="text-[10px] md:text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5 hidden sm:block">{t.heroBadge}</span>
            </div>
          </div>

          {/* Right Side Controls (Visible on all screens) */}
          <div className="flex items-center gap-3 md:gap-6 z-50">

            {/* Language Switcher - NOW ALWAYS VISIBLE */}
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1.5 md:px-3 md:py-2 rounded-lg border border-gray-200 cursor-pointer">
              <Globe className="w-3 h-3 md:w-4 md:h-4 text-gray-600 hidden sm:block" />
              <select
                className="bg-transparent text-[11px] md:text-sm font-bold text-gray-700 border-none focus:ring-0 cursor-pointer outline-none"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            {/* Desktop Only Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#guide" className="text-sm font-bold text-gray-600 hover:text-blue-600">{t.navGuide}</a>
              <a href="#benefits" className="text-sm font-bold text-gray-600 hover:text-blue-600">{t.navBenefits}</a>
              <Link to="/login" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                {t.loginBtn} <Key className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Hamburger Button - NOW BLACK */}
            <button
              className="md:hidden p-2 text-white bg-black hover:bg-gray-800 rounded-lg shadow-sm transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Overlay - NOW BLACK */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[64px] bg-black z-40 flex flex-col p-6 border-t border-gray-800 animate-fade-in">
            <div className="flex flex-col gap-6 text-center mt-4">
              <a href="#guide" onClick={closeMenu} className="text-lg font-bold text-white py-4 border-b border-gray-800">{t.navGuide}</a>
              <a href="#benefits" onClick={closeMenu} className="text-lg font-bold text-white py-4 border-b border-gray-800">{t.navBenefits}</a>

              <Link to="/login" onClick={closeMenu} className="bg-blue-600 text-white font-bold text-lg px-6 py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 mt-6">
                {t.loginBtn} <Key className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Warm Hero Section (Optimized for Mobile padding & text sizing) */}
      <header className="relative max-w-5xl mx-auto px-4 py-12 md:py-24 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-blue-100 rounded-full blur-[80px] opacity-50 -z-10"></div>

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight tracking-tight px-2">
          {t.heroTitle}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.heroSub}
        </p>
        <Link to="/login" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
          {t.loginBtn} <Key className="w-5 h-5" />
        </Link>
      </header>

      {/* 3. VISUAL Parent Guide Section (Responsive Stacking) */}
      <section id="guide" className="bg-white py-12 md:py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 md:mb-4">{t.guideTitle}</h3>
            <p className="text-gray-500 text-base md:text-lg font-medium">{t.guideSub}</p>
          </div>

          <div className="flex flex-col gap-16 md:gap-24 relative">
            <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-1 bg-blue-50 -translate-x-1/2 z-0"></div>

            {/* STEP 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 relative z-10">
              <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3 md:mb-4 text-xl md:text-2xl font-black text-amber-600">1</div>
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{t.step1Title}</h4>
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-w-md">{t.step1Desc}</p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-start w-full">
                {/* Mobile-Friendly Mockup */}
                <div className="bg-amber-50 p-5 md:p-6 rounded-lg border-2 border-dashed border-amber-300 shadow-md transform md:rotate-2 w-full max-w-[280px] sm:max-w-xs">
                  <div className="flex items-center gap-2 border-b border-amber-200 pb-2 mb-4">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                    <span className="font-bold text-gray-800 text-xs md:text-sm">{t.schoolName}</span>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Student Access Card</p>
                  <div className="space-y-3 font-mono text-xs md:text-sm">
                    <div>
                      <p className="text-gray-500 text-[10px] md:text-xs">Email ID:</p>
                      <p className="font-bold text-blue-700 bg-white px-2 py-1.5 border border-gray-200 rounded break-all">rahul@school.com</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] md:text-xs">Password:</p>
                      <p className="font-bold text-gray-800 bg-white px-2 py-1.5 border border-gray-200 rounded">rahul123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-16 relative z-10">
              <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3 md:mb-4 text-xl md:text-2xl font-black text-blue-600">2</div>
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{t.step2Title}</h4>
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-w-md">{t.step2Desc}</p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end w-full">
                {/* Mobile-Friendly Mockup */}
                <div className="bg-gray-100 rounded-xl border border-gray-200 shadow-lg overflow-hidden w-full max-w-[280px] sm:max-w-xs">
                  <div className="bg-gray-200 px-3 py-2 flex gap-1.5 border-b border-gray-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="bg-white p-4 flex justify-between items-center relative">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
                    <div className="relative">
                      <div className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        {t.loginBtn}
                      </div>
                      <MousePointerClick className="w-6 h-6 md:w-8 md:h-8 text-slate-800 absolute -bottom-3 -right-2 animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16 relative z-10">
              <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-3 md:mb-4 text-xl md:text-2xl font-black text-emerald-600">3</div>
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{t.step3Title}</h4>
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-w-md">{t.step3Desc}</p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-start w-full">
                {/* Mobile-Friendly Mockup */}
                <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-xl w-full max-w-[280px] sm:max-w-xs">
                  <div className="flex justify-center mb-3 md:mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Key className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="h-1.5 w-10 bg-gray-200 rounded mb-1"></div>
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-[10px] md:text-xs px-2 py-2 rounded-md font-mono flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <UserCheck className="w-3 h-3 text-blue-400 flex-shrink-0" /> rahul@school.com
                      </div>
                    </div>
                    <div>
                      <div className="h-1.5 w-14 bg-gray-200 rounded mb-1"></div>
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-[10px] md:text-xs px-2 py-2 rounded-md font-mono flex items-center gap-2">
                        <Key className="w-3 h-3 text-blue-400 flex-shrink-0" /> ••••••••
                      </div>
                    </div>
                    <div className="w-full bg-blue-600 text-white text-[10px] md:text-xs font-bold py-2 rounded-md text-center mt-3 shadow-sm">
                      Secure Login
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Expanded Benefits Grid (Mobile Stacking) */}
      <section id="benefits" className="py-12 md:py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 md:mb-4">{t.benefitsTitle}</h3>
            <p className="text-gray-500 text-base md:text-lg font-medium">{t.benefitsSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              <div className="bg-purple-100 p-3 md:p-4 rounded-xl flex-shrink-0"><BookOpen className="text-purple-600 w-6 h-6 md:w-7 md:h-7" /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-1 md:mb-2">{t.feat1Title}</h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{t.feat1Desc}</p>
              </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              <div className="bg-emerald-100 p-3 md:p-4 rounded-xl flex-shrink-0"><MonitorPlay className="text-emerald-600 w-6 h-6 md:w-7 md:h-7" /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-1 md:mb-2">{t.feat2Title}</h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{t.feat2Desc}</p>
              </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              <div className="bg-amber-100 p-3 md:p-4 rounded-xl flex-shrink-0"><Smartphone className="text-amber-600 w-6 h-6 md:w-7 md:h-7" /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-1 md:mb-2">{t.feat3Title}</h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{t.feat3Desc}</p>
              </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              <div className="bg-blue-100 p-3 md:p-4 rounded-xl flex-shrink-0"><Shield className="text-blue-600 w-6 h-6 md:w-7 md:h-7" /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-1 md:mb-2">{t.feat4Title}</h4>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{t.feat4Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comprehensive School Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center md:text-left mb-10 border-b border-gray-800 pb-10">

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{t.schoolName}</h2>
            </div>
            <p className="text-gray-400 text-sm md:text-base font-medium mb-6">
              {t.footerRights}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs md:text-sm mb-4 md:mb-6">{t.footerAddress}</h4>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 md:mt-1 hidden md:block" />
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-[250px]">{t.footerAddressText}</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs md:text-sm mb-4 md:mb-6">{t.footerTime}</h4>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 mb-4 md:mb-6">
              <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 md:mt-0.5 hidden md:block" />
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{t.footerTimeText}</p>
            </div>
            <div className="flex justify-center md:justify-start items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <Phone className="w-4 h-4 text-emerald-400" />
              <p className="text-white font-bold text-sm">{t.helpText.split('? ')[1]}</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 text-center text-xs md:text-sm text-gray-500 font-medium">
          © {new Date().getFullYear()} {t.schoolName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;