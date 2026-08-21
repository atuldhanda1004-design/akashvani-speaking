export const dummyCategories = [
  { id: 1, name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
  { id: 2, name: 'देश', slug: 'national', icon: '🇮🇳' },
  { id: 3, name: 'राजनीति', slug: 'politics', icon: '🗳️' },
  { id: 4, name: 'अपराध', slug: 'crime', icon: '🚔' },
  { id: 5, name: 'खेल', slug: 'sports', icon: '🏏' },
  { id: 6, name: 'शिक्षा', slug: 'education', icon: '📚' },
  { id: 7, name: 'बिजनेस', slug: 'business', icon: '💼' },
  { id: 8, name: 'मनोरंजन', slug: 'entertainment', icon: '🎬' },
]

export const dummyTrendingNews = [
  {
    id: 1,
    slug: 'dgp-strict-orders-police',
    headline: 'हरियाणा में डीजीपी ने पुलिस प्रशासन को दिए सख्त आदेश',
    subheadline: 'हरियाणा के डीजीपी ने कानून-व्यवस्था को और मजबूत करने के लिए पुलिस प्रशासन को सख्त दिशा-निर्देश जारी किए।',
    points: [
      'पुलिस कर्मचारी रिश्वत लेने से पहले 100 बार सोचें!',
      'जांच में ढिलाई हुई तो सस्पेंशन पक्का',
      'पुलिस कर्मचारी गोल्डन शब्द का इस्तेमाल करें',
      'समय पर ड्यूटी ज्वाइन करें',
      'लोगों का समाधान निजी स्तर पर करने की कोशिश करें',
      'पंचायत के आदेशों की पालना करें',
    ],
    featured_image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    location: 'पंचकूला',
    published_at: '2024-08-18T15:19:00Z',
    is_trending: true,
    is_breaking: true,
    category_id: 1,
    categories: { name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
    users: { full_name: 'Sumit Sheoran', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [
      { time: '3:25 PM', text: 'डीजीपी ने सभी जिलों के SP को निर्देश - जांच में पारदर्शिता और तेजी लाएं।' },
      { time: '3:10 PM', text: 'पुलिस महानिदेशक ने कहा - लापरवाही बर्दाश्त नहीं होगी।' },
      { time: '2:45 PM', text: 'हरियाणा पुलिस मुख्यालय में उच्च स्तरीय बैठक शुरू।' },
    ],
  },
  {
    id: 2,
    slug: 'farmers-toll-plaza-protest',
    headline: 'किसानों ने टोल प्लाज़ा पर लगाया धरना, 3 घंटे टोल बंद',
    subheadline: 'जींद जिले में किसानों ने टोल प्लाज़ा पर धरना देकर 3 घंटे तक टोल वसूली बंद करवा दी।',
    points: [
      'टुकड़ा लेकर बैठे किसान',
      '3 घंटे के लिए टोल वसूली रोक',
      'प्रशासन से बातचीत जारी',
      'किसान नेताओं ने दी चेतावनी',
    ],
    featured_image: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=800&q=80',
    location: 'जींद',
    published_at: '2024-08-14T12:00:00Z',
    is_trending: true,
    is_breaking: false,
    category_id: 1,
    categories: { name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
    users: { full_name: 'Rakesh Poonia', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
  {
    id: 3,
    slug: 'haryana-security-flag-march',
    headline: 'हरियाणा में सुरक्षा व्यवस्था सख्त, फ्लैग मार्च जारी',
    subheadline: 'संवेदनशील इलाकों में बढ़ाई गई सुरक्षा, पुलिस बल तैनात।',
    points: [
      'संवेदनशील इलाकों में बढ़ाई गई सुरक्षा',
      'पुलिस बल तैनात, शांति की अपील',
      'प्रशासन ने जारी की एडवाइजरी',
      'सभी थानों में हाई अलर्ट',
    ],
    featured_image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80',
    location: 'रोहतक',
    published_at: '2024-08-14T14:30:00Z',
    is_trending: true,
    is_breaking: false,
    category_id: 1,
    categories: { name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
    users: { full_name: 'Deepak Sharma', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
]

export const dummyLatestNews = [
  {
    id: 4,
    slug: 'manisha-case-cbi-report',
    headline: 'मनीषा मामले में सीबीआई ने अदालत में की जांच रिपोर्ट पेश',
    subheadline: 'मनीषा मामले में सीबीआई ने अदालत में अपनी जांच रिपोर्ट पेश की।',
    points: [
      'परिवार जांच से खुश नहीं',
      'मनीषा के पिता ने बताई अपने समाज की पंचायत',
      'देखिए क्या लिखा है रिपोर्ट में',
    ],
    featured_image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    location: 'भिवानी',
    published_at: '2024-08-14T10:00:00Z',
    is_trending: false,
    is_breaking: false,
    category_id: 4,
    categories: { name: 'अपराध', slug: 'crime', icon: '🚔' },
    users: { full_name: 'Sumit Sheoran', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
  {
    id: 5,
    slug: 'rain-alert-haryana-districts',
    headline: 'हरियाणा के कई जिलों में बारिश का अलर्ट जारी',
    subheadline: 'मौसम विभाग ने हरियाणा के कई जिलों में भारी बारिश का अलर्ट जारी किया है।',
    points: [
      'अगले 24 घंटों में भारी बारिश की संभावना',
      'किसानों को सतर्क रहने की सलाह',
      'जलभराव से बचने के लिए प्रशासन तैयार',
      'स्कूलों में छुट्टी का फैसला संभव',
    ],
    featured_image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
    location: 'करनाल',
    published_at: '2024-08-14T08:30:00Z',
    is_trending: false,
    is_breaking: false,
    category_id: 1,
    categories: { name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
    users: { full_name: 'Amit Kumar', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
  {
    id: 6,
    slug: 'panchkula-traffic-changes',
    headline: 'पंचकूला में ट्रैफिक व्यवस्था में बदलाव',
    subheadline: 'पंचकूला प्रशासन ने शहर में ट्रैफिक व्यवस्था में बड़े बदलाव किए हैं।',
    points: [
      'नए ट्रैफिक नियम लागू',
      'वन-वे रोड का विस्तार',
      'पार्किंग ज़ोन में बदलाव',
      'उल्लंघन पर भारी जुर्माना',
    ],
    featured_image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    location: 'पंचकूला',
    published_at: '2024-08-14T07:15:00Z',
    is_trending: false,
    is_breaking: false,
    category_id: 1,
    categories: { name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
    users: { full_name: 'Rajesh Verma', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
  {
    id: 7,
    slug: 'kurukshetra-geeta-jayanti',
    headline: 'कुरुक्षेत्र में गीता जयंती की तैयारियां तेज',
    subheadline: 'कुरुक्षेत्र में गीता जयंती समारोह की तैयारियां जोरों पर हैं।',
    points: [
      'भव्य समारोह की तैयारी',
      'देश-विदेश से आएंगे विद्वान',
      'सुरक्षा के पुख्ता इंतजाम',
      'सांस्कृतिक कार्यक्रमों की भरमार',
    ],
    featured_image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80',
    location: 'कुरुक्षेत्र',
    published_at: '2024-08-14T06:00:00Z',
    is_trending: false,
    is_breaking: false,
    category_id: 1,
    categories: { name: 'हरियाणा', slug: 'haryana', icon: '🏛️' },
    users: { full_name: 'Priya Singh', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
  {
    id: 8,
    slug: 'education-board-new-rules',
    headline: 'शिक्षा बोर्ड ने लागू किए नए नियम, छात्रों को मिलेगी राहत',
    subheadline: 'हरियाणा शिक्षा बोर्ड ने परीक्षा पैटर्न में बदलाव किए हैं।',
    points: [
      'परीक्षा पैटर्न में बड़ा बदलाव',
      'ऑब्जेक्टिव प्रश्नों का वेटेज बढ़ा',
      'प्रैक्टिकल परीक्षा अब ऑनलाइन',
      'रिजल्ट जल्दी आएगा',
    ],
    featured_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    location: 'चंडीगढ़',
    published_at: '2024-08-13T16:00:00Z',
    is_trending: false,
    is_breaking: false,
    category_id: 6,
    categories: { name: 'शिक्षा', slug: 'education', icon: '📚' },
    users: { full_name: 'Neha Yadav', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
  {
    id: 9,
    slug: 'cricket-haryana-team-wins',
    headline: 'हरियाणा क्रिकेट टीम ने रणजी ट्रॉफी में शानदार जीत दर्ज की',
    subheadline: 'हरियाणा ने रणजी ट्रॉफी के मैच में शानदार प्रदर्शन किया।',
    points: [
      'हरियाणा ने 5 विकेट से जीता मैच',
      'कप्तान ने खेली शानदार पारी',
      'गेंदबाजों ने किया कमाल',
      'अगला मैच अगले हफ्ते',
    ],
    featured_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    location: 'रोहतक',
    published_at: '2024-08-13T14:00:00Z',
    is_trending: false,
    is_breaking: false,
    category_id: 5,
    categories: { name: 'खेल', slug: 'sports', icon: '🏏' },
    users: { full_name: 'Vikram Jangra', avatar_url: null },
    video_url: null,
    video_type: null,
    live_updates: [],
  },
]

export const dummyLiveUpdates = [
  {
    id: 1,
    time: '10:30 AM',
    headline: 'हरियाणा के कई जिलों में बारिश का अलर्ट जारी',
    slug: 'rain-alert-haryana-districts',
  },
  {
    id: 2,
    time: '09:45 AM',
    headline: 'कुरुक्षेत्र में गीता जयंती की तैयारियां तेज',
    slug: 'kurukshetra-geeta-jayanti',
  },
  {
    id: 3,
    time: '09:15 AM',
    headline: 'पंचकूला में ट्रैफिक व्यवस्था में बदलाव',
    slug: 'panchkula-traffic-changes',
  },
  {
    id: 4,
    time: '08:30 AM',
    headline: 'डीजीपी ने पुलिस अधिकारियों को दिए सख्त निर्देश',
    slug: 'dgp-strict-orders-police',
  },
  {
    id: 5,
    time: '07:45 AM',
    headline: 'हरियाणा में शिक्षा बोर्ड ने बदले नियम',
    slug: 'education-board-new-rules',
  },
]

export const dummyShortNews = [
  {
    id: 1,
    headline: 'हरियाणा सरकार ने बढ़ाई पेंशन',
    summary: 'राज्य सरकार ने बुजुर्ग पेंशन में ₹500 की बढ़ोतरी की घोषणा की।',
    category: 'हरियाणा',
    time: '2 घंटे पहले',
  },
  {
    id: 2,
    headline: 'दिल्ली-मुंबई एक्सप्रेसवे का काम तेज',
    summary: 'हरियाणा से गुजरने वाले एक्सप्रेसवे का 70% काम पूरा हो चुका है।',
    category: 'देश',
    time: '3 घंटे पहले',
  },
  {
    id: 3,
    headline: 'हरियाणा बोर्ड 10वीं का रिजल्ट जल्द',
    summary: 'बोर्ड ने कहा अगले हफ्ते तक रिजल्ट जारी किया जाएगा।',
    category: 'शिक्षा',
    time: '4 घंटे पहले',
  },
  {
    id: 4,
    headline: 'किसानों को मिलेगा बोनस',
    summary: 'सरकार ने गेहूं पर ₹200 प्रति क्विंटल बोनस का ऐलान किया।',
    category: 'हरियाणा',
    time: '5 घंटे पहले',
  },
  {
    id: 5,
    headline: 'नई मेट्रो लाइन का ऐलान',
    summary: 'गुरुग्राम से फरीदाबाद तक नई मेट्रो लाइन बनेगी।',
    category: 'हरियाणा',
    time: '6 घंटे पहले',
  },
]

export function formatDate(dateString) {
  const date = new Date(dateString)
  const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
  return `${date.getDate()} ${months[date.getMonth()]}`
}

export function formatTime(dateString) {
  const date = new Date(dateString)
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${hours}:${minutes} ${ampm}`
}

export function timeAgo(dateString) {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'अभी'
  if (diffMins < 60) return `${diffMins} मिनट पहले`
  if (diffHours < 24) return `${diffHours} घंटे पहले`
  if (diffDays < 7) return `${diffDays} दिन पहले`
  return formatDate(dateString)
}