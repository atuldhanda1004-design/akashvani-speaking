export const FALLBACK_NEWS = [
  {
    id: 'h1',
    slug: 'haryana-heavy-rain-orange-alert-ncr',
    headline: 'हरियाणा में मानसून का कहर: गुरुग्राम-फरीदाबाद में ऑरेंज अलर्ट, रातभर बारिश से सड़कें जलमग्न',
    subheadline: 'मौसम विभाग ने अगले 48 घंटों के लिए जारी की चेतावनी, स्कूलों में छुट्टी घोषित',
    points: [
      'गुरुग्राम के सोहना रोड और गोल्फ कोर्स रोड पर 3 फीट तक पानी भरा, कई जगह लंबा जाम लगा।',
      'प्रशासन ने सुरक्षा के मद्देनजर कक्षा 1 से 8वीं तक के सभी स्कूलों की छुट्टी घोषित की।',
      'मौसम विभाग (IMD) ने करनाल, पानीपत, रोहतक और सोनीपत में भारी बारिश का अलर्ट दिया है।',
      'कृषि विशेषज्ञों के अनुसार, यह बारिश धान उत्पादक किसानों के लिए वरदान साबित होगी।'
    ],
    category: 'हरियाणा',
    featured_image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1000&auto=format&fit=crop&q=80',
    is_trending: true,
    is_breaking: true,
    published_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
  },
  {
    id: 'h2',
    slug: 'one-nation-one-election-cabinet-approval-india',
    headline: 'कैबिनेट का बड़ा फैसला: "वन नेशन, वन इलेक्शन" प्रस्ताव को मिली मंजूरी, संसद में पेश होगा बिल',
    subheadline: 'रामनाथ कोविंद कमेटी की सिफारिशों को केंद्र सरकार ने स्वीकारा',
    points: [
      'मोदी कैबिनेट ने एक देश, एक चुनाव के प्रस्ताव को सर्वसम्मति से मंजूरी दे दी है।',
      'पूर्व राष्ट्रपति रामनाथ कोविंद की अध्यक्षता वाली कमेटी ने सौंपी थी विस्तृत रिपोर्ट।',
      'इस कानून के लागू होने से लोकसभा और राज्यों के विधानसभा चुनाव एक साथ कराए जा सकेंगे।',
      'विपक्ष ने इस फैसले का विरोध करते हुए इसे संघीय ढांचे पर हमला बताया है।'
    ],
    category: 'राजनीति',
    featured_image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1000&auto=format&fit=crop&q=80',
    is_trending: true,
    is_breaking: true,
    published_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 min ago
  },
  {
    id: 'h3',
    slug: 'ind-vs-aus-rohit-sharma-century-india-win',
    headline: 'IND vs AUS: रोहित शर्मा का ऐतिहासिक शतक, भारत ने ऑस्ट्रेलिया को दूसरे टेस्ट में 8 विकेट से रौंदा',
    subheadline: 'रोहित ने जड़ा करियर का 13वां टेस्ट शतक, अश्विन ने झटके 6 विकेट',
    points: [
      'भारतीय टीम ने बॉर्डर-गावस्कर ट्रॉफी के दूसरे मुकाबले में ऑस्ट्रेलिया को करारी शिकस्त दी।',
      'कप्तान रोहित शर्मा ने दूसरी पारी में 120 रनों की धमाकेदार नाबाद पारी खेली।',
      'रविचंद्रन अश्विन ने खतरनाक गेंदबाजी करते हुए मैच में कुल 8 विकेट अपने नाम किए।',
      'इस जीत के साथ ही भारत ने 5 मैचों की टेस्ट सीरीज में 2-0 की बढ़त बना ली है।'
    ],
    category: 'खेल',
    featured_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&auto=format&fit=crop&q=80',
    is_trending: true,
    is_breaking: false,
    published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hr ago
  },
  {
    id: 'h4',
    slug: 'delhi-panipat-rapid-rail-corridor-approved-haryana',
    headline: 'हरियाणा को बड़ी सौगात: दिल्ली-पानीपत रैपिड रेल प्रोजेक्ट को मंजूरी, अब सिर्फ 40 मिनट में सफर',
    subheadline: '₹21,000 करोड़ के इस प्रोजेक्ट से लाखों यात्रियों को सीधा फायदा',
    points: [
      'केंद्र और हरियाणा सरकार ने दिल्ली-पानीपत रैपिड रेल कॉरिडोर के बजट को मंजूरी दी।',
      'यह ट्रेन 160 किमी/घंटे की रफ्तार से दौड़ेगी, जिससे यात्रा का समय आधा हो जाएगा।',
      'कॉरिडोर के बीच कुल 17 स्टेशन होंगे, जिनमें कुंडली, मुरथल और समालखा प्रमुख हैं।',
      'प्रोजेक्ट का निर्माण कार्य इसी साल के अंत तक शुरू होने की उम्मीद है।'
    ],
    category: 'हरियाणा',
    featured_image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1000&auto=format&fit=crop&q=80',
    is_trending: false,
    is_breaking: false,
    published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hr ago
  },
  {
    id: 'h5',
    slug: 'gold-price-heavy-drop-wedding-season-india',
    headline: 'सोने की कीमतों में भारी गिरावट: प्रति 10 ग्राम ₹2,200 सस्ता हुआ सोना, शादियों के सीजन में भीड़',
    subheadline: 'अंतरराष्ट्रीय बाजार में कमजोरी के चलते भारतीय सर्राफा बाजार में आई गिरावट',
    points: [
      'शादियों के सीजन के बीच सोने और चांदी की कीमतों में भारी नरमी देखी जा रही है।',
      '24 कैरेट सोने का भाव गिरकर ₹72,500 प्रति 10 ग्राम के स्तर पर आ गया है।',
      'चांदी की कीमतों में भी ₹3,000 प्रति किलो की बड़ी गिरावट दर्ज की गई।',
      'बाजार विश्लेषकों के अनुसार, खरीदारी करने का यह सबसे सही समय है।'
    ],
    category: 'व्यापार',
    featured_image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80',
    is_trending: false,
    is_breaking: false,
    published_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hr ago
  },
  {
    id: 'h6',
    slug: 'oscars-2025-laapataa-ladies-india-official-entry',
    headline: 'Oscars 2025: किरण राव की फिल्म "लापता लेडीज" ऑस्कर के लिए भारत की आधिकारिक एंट्री घोषित',
    subheadline: 'फिल्म फेडरेशन ऑफ इंडिया ने 29 फिल्मों को पछाड़कर किया चयन',
    points: [
      'आमिर खान प्रोडक्शंस की कॉमेडी-ड्रामा फिल्म "लापता लेडीज" ऑस्कर की रेस में शामिल हुई।',
      'फिल्म के देहाती और संवेदनशील कथानक ने जूरी सदस्यों का दिल जीता।',
      'निर्देशक किरण राव ने देश के दर्शकों को धन्यवाद देते हुए खुशी जाहिर की।',
      'यह फिल्म ग्रामीण भारत में घूंघट और पहचान की उलझन को खूबसूरती से दिखाती है।'
    ],
    category: 'मनोरंजन',
    featured_image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80',
    is_trending: false,
    is_breaking: false,
    published_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7 hr ago
  },
  {
    id: 'h7',
    slug: 'haryana-police-major-cyber-fraud-gang-busted',
    headline: 'हरियाणा पुलिस की बड़ी कामयाबी: ₹50 करोड़ की ठगी करने वाले अंतरराज्यीय साइबर गिरोह का पर्दाफाश',
    subheadline: 'फरीदाबाद से 8 हाई-टेक ठग गिरफ्तार, 150 से अधिक मोबाइल बरामद',
    points: [
      'फरीदाबाद साइबर सेल ने गुप्त सूचना के आधार पर छापेमारी कर गिरोह को दबोचा।',
      'ये ठग बिजली बिल अपडेट करने और लॉटरी के नाम पर लोगों को शिकार बनाते थे।',
      'इनके बैंक खातों से ₹12 करोड़ की संदिग्ध राशि को फ्रीज कर दिया गया है।',
      'हरियाणा पुलिस ने नागरिकों को किसी भी संदिग्ध लिंक पर क्लिक न करने की हिदायत दी है।'
    ],
    category: 'हरियाणा',
    featured_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
    is_trending: false,
    is_breaking: false,
    published_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hr ago
  },
  {
    id: 'h8',
    slug: 'haryana-cm-announcement-farmers-tube-well-subsidy',
    headline: 'हरियाणा के मुख्यमंत्री का बड़ा ऐलान: किसानों को ट्यूबवेल कनेक्शन पर मिलेगी 50% की बंपर सब्सिडी',
    subheadline: 'राज्य के 2 लाख से अधिक किसान परिवारों को सीधे तौर पर मिलेगा फायदा',
    points: [
      'मुख्यमंत्री ने राज्य के कृषि क्षेत्र को बढ़ावा देने के लिए नई योजना को मंजूरी दी।',
      'सौर ऊर्जा चालित ट्यूबवेल लगवाने वाले सीमांत किसानों को प्राथमिकता मिलेगी।',
      'योजना के आवेदन अगले सप्ताह से सरल पोर्टल पर शुरू कर दिए जाएंगे।',
      'इस कदम से किसानों की सिंचाई लागत आधी हो जाएगी और फसल उत्पादन बढ़ेगा।'
    ],
    category: 'हरियाणा',
    featured_image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1000&auto=format&fit=crop&q=80',
    is_trending: false,
    is_breaking: false,
    published_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hr ago
  }
];