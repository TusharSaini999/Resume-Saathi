export const COMPANY_CATEGORIES = {
  INDIAN_STARTUPS: "Indian Startups & Unicorns",
  SMALL_STARTUPS: "Small Startups & Emerging Tech",
  INDIAN_TECH_LEADERS: "Indian Tech Giants & IT Leaders",
  BIG_MNC_INDIA: "Big MNCs (India R&D Hubs)",
  AI_CLOUD: "AI, Cloud & Deep Tech",
  // Backwards compatibility alias
  INDIAN_UNICORNS: "Indian Startups & Unicorns",
};

export const COMPANIES_REGISTRY = [
  // ─── Indian Startups & High-Growth Unicorns ──────────────────────────────
  {
    id: "razorpay",
    name: "Razorpay",
    slug: "razorpaysoftwareprivatelimited",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://razorpay.com/favicon.ico",
    website: "https://razorpay.com",
    officialPortalUrl: "https://boards.greenhouse.io/razorpaysoftwareprivatelimited",
    headquarters: "Bengaluru, India",
    description: "Leading fintech unicorn providing payment gateway, neo-banking, and checkout infrastructure.",
    tags: ["Fintech", "Payments", "Unicorn", "Bengaluru"],
  },
  {
    id: "swiggy",
    name: "Swiggy",
    slug: "swiggy",
    provider: "smartrecruiters",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.swiggy.com/favicon.ico",
    website: "https://www.swiggy.com",
    officialPortalUrl: "https://careers.swiggy.com",
    headquarters: "Bengaluru, India",
    description: "India's premier on-demand food delivery, Instamart quick-commerce, and logistics platform.",
    tags: ["FoodTech", "QuickCommerce", "Unicorn", "Bengaluru"],
  },
  {
    id: "meesho",
    name: "Meesho",
    slug: "meesho",
    provider: "lever",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.meesho.com/favicon.ico",
    website: "https://www.meesho.com",
    officialPortalUrl: "https://jobs.lever.co/meesho",
    headquarters: "Bengaluru, India",
    description: "India's fastest growing social e-commerce marketplace democratizing internet commerce.",
    tags: ["E-Commerce", "Unicorn", "Bengaluru"],
  },
  {
    id: "paytm",
    name: "Paytm",
    slug: "paytm",
    provider: "lever",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://paytm.com/favicon.ico",
    website: "https://paytm.com",
    officialPortalUrl: "https://jobs.lever.co/paytm",
    headquarters: "Noida, India",
    description: "India's pioneer digital payments, QR soundbox network, and financial services company.",
    tags: ["Fintech", "Payments", "Noida"],
  },
  {
    id: "cred",
    name: "CRED",
    slug: "cred",
    provider: "lever",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://cred.club/favicon.ico",
    website: "https://cred.club",
    officialPortalUrl: "https://jobs.lever.co/cred",
    headquarters: "Bengaluru, India",
    description: "High-trust credit score and premium rewards financial network founded by Kunal Shah.",
    tags: ["Fintech", "Rewards", "Unicorn", "Bengaluru"],
  },
  {
    id: "groww",
    name: "Groww",
    slug: "groww",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://groww.in/favicon.ico",
    website: "https://groww.in",
    officialPortalUrl: "https://boards.greenhouse.io/groww",
    headquarters: "Bengaluru, India",
    description: "India's largest investment, mutual funds, stocks, and wealth management platform.",
    tags: ["WealthTech", "Fintech", "Unicorn", "Bengaluru"],
  },
  {
    id: "zeta",
    name: "Zeta",
    slug: "zeta",
    provider: "lever",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.zeta.tech/favicon.ico",
    website: "https://www.zeta.tech",
    officialPortalUrl: "https://jobs.lever.co/zeta",
    headquarters: "Bengaluru, India",
    description: "Next-generation cloud-native core banking and fintech platform for global financial institutions.",
    tags: ["BankingTech", "Cloud", "Unicorn", "Bengaluru"],
  },
  {
    id: "inmobi",
    name: "InMobi",
    slug: "inmobi",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.inmobi.com/favicon.ico",
    website: "https://www.inmobi.com",
    officialPortalUrl: "https://boards.greenhouse.io/inmobi",
    headquarters: "Bengaluru, India",
    description: "India's first tech unicorn, global leader in mobile marketing and Glance smart lockscreen.",
    tags: ["AdTech", "AI", "Lockscreen", "Bengaluru"],
  },
  {
    id: "zomato",
    name: "Zomato & Blinkit",
    slug: "zomato",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.zomato.com/favicon.ico",
    website: "https://www.zomato.com/careers",
    officialPortalUrl: "https://www.zomato.com/careers",
    headquarters: "Gurugram, India",
    description: "Food discovery leader and quick-commerce pioneer via Blinkit with deep micro-service tech.",
    tags: ["FoodTech", "QuickCommerce", "PublicTech", "Gurugram"],
  },
  {
    id: "zepto",
    name: "Zepto",
    slug: "zepto",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.zeptonow.com/favicon.ico",
    website: "https://www.zeptonow.com",
    officialPortalUrl: "https://www.zeptonow.com/careers",
    headquarters: "Bengaluru / Mumbai, India",
    description: "Hyper-growth 10-minute quick commerce unicorn operating dark stores with intelligent routing algorithms.",
    tags: ["QuickCommerce", "Logistics", "Unicorn", "Bengaluru"],
  },
  {
    id: "postman",
    name: "Postman",
    slug: "postman",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.postman.com/favicon.ico",
    website: "https://www.postman.com/careers",
    officialPortalUrl: "https://www.postman.com/careers",
    headquarters: "Bengaluru & San Francisco",
    description: "The world's leading API collaboration and development platform trusted by 30M+ developers.",
    tags: ["DevTools", "SaaS", "Unicorn", "Bengaluru"],
  },
  {
    id: "browserstack",
    name: "BrowserStack",
    slug: "browserstack",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.browserstack.com/favicon.ico",
    website: "https://www.browserstack.com/careers",
    officialPortalUrl: "https://www.browserstack.com/careers",
    headquarters: "Mumbai & Global",
    description: "Global cloud web and mobile app testing infrastructure unicorn powering CI/CD pipelines.",
    tags: ["DevTools", "CloudTesting", "Unicorn", "Mumbai"],
  },
  {
    id: "flipkart",
    name: "Flipkart",
    slug: "flipkart",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.flipkart.com/favicon.ico",
    website: "https://www.flipkartcareers.com",
    officialPortalUrl: "https://www.flipkartcareers.com",
    headquarters: "Bengaluru, India",
    description: "India's homegrown e-commerce marketplace giant powering commerce for hundreds of millions.",
    tags: ["E-Commerce", "WalmartSubsidiary", "Bengaluru"],
  },
  {
    id: "phonepe",
    name: "PhonePe",
    slug: "phonepe",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.phonepe.com/favicon.ico",
    website: "https://www.phonepe.com/careers",
    officialPortalUrl: "https://www.phonepe.com/careers",
    headquarters: "Bengaluru, India",
    description: "Market leader in UPI payments, mutual funds, insurance, and merchant payment devices.",
    tags: ["Fintech", "UPI", "Payments", "Bengaluru"],
  },
  {
    id: "zerodha",
    name: "Zerodha",
    slug: "zerodha",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://zerodha.com/static/images/favicon.png",
    website: "https://zerodha.com/careers",
    officialPortalUrl: "https://zerodha.com/careers",
    headquarters: "Bengaluru, India",
    description: "India's biggest stockbroker and pioneer of zero-brokerage trading, famous for open source and FOSS tech culture.",
    tags: ["Fintech", "FOSS", "Bootstrapped", "Bengaluru"],
  },
  {
    id: "urbancompany",
    name: "Urban Company",
    slug: "urbancompany",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.urbancompany.com/favicon.ico",
    website: "https://www.urbancompany.com",
    officialPortalUrl: "https://boards.greenhouse.io/urbancompany",
    headquarters: "Gurugram, India",
    description: "Asia's largest home services marketplace unicorn offering beauty, wellness, and appliance repairs.",
    tags: ["GigEconomy", "HomeServices", "Unicorn", "Gurugram"],
  },
  {
    id: "ola",
    name: "Ola & Ola Electric",
    slug: "ola",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.olacabs.com/favicon.ico",
    website: "https://www.olacabs.com/careers",
    officialPortalUrl: "https://www.olacabs.com/careers",
    headquarters: "Bengaluru, India",
    description: "Indian mobility and EV technology company driving electric scooters and intelligent urban transport.",
    tags: ["EV", "Mobility", "Bengaluru"],
  },
  {
    id: "physicswallah",
    name: "PhysicsWallah (PW)",
    slug: "physicswallah",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_STARTUPS,
    logo: "https://www.pw.live/favicon.ico",
    website: "https://www.pw.live/careers",
    officialPortalUrl: "https://www.pw.live/careers",
    headquarters: "Noida, India",
    description: "India's premier high-impact edtech unicorn providing affordable learning and test preparation.",
    tags: ["EdTech", "Unicorn", "Noida"],
  },

  // ─── Small Startups & Emerging Tech (LinkedIn, Fast-Growing, Seed/Series A/B) ───
  {
    id: "pocketfm",
    name: "Pocket FM",
    slug: "pocketfm",
    provider: "lever",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://images.pocketfm.com/favicon.ico",
    website: "https://pocketfm.com",
    officialPortalUrl: "https://jobs.lever.co/pocketfm",
    headquarters: "Bengaluru, India",
    description: "Leading audio OTT and serialized storytelling platform with global reach and high-scale streaming engineering.",
    tags: ["AudioTech", "OTT", "FastGrowing", "Bengaluru"],
  },
  {
    id: "slice",
    name: "Slice",
    slug: "slice",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://sliceit.com/favicon.ico",
    website: "https://sliceit.com",
    officialPortalUrl: "https://slice.careers",
    headquarters: "Bengaluru, India",
    description: "Modern digital banking, consumer payments, and credit platform transforming everyday financial journeys in India.",
    tags: ["Fintech", "Banking", "Bengaluru"],
  },
  {
    id: "devrev",
    name: "DevRev",
    slug: "devrev",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://devrev.ai/favicon.ico",
    website: "https://devrev.ai",
    officialPortalUrl: "https://devrev.ai/careers",
    headquarters: "Bengaluru & Silicon Valley",
    description: "AI-native developer CRM and customer intelligence engine connecting developers directly with end-users.",
    tags: ["AI", "CRM", "DevTools", "Bengaluru"],
  },
  {
    id: "signoz",
    name: "SigNoz",
    slug: "signoz",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://signoz.io/favicon.ico",
    website: "https://signoz.io",
    officialPortalUrl: "https://signoz.io/careers/",
    headquarters: "Bengaluru / Remote",
    description: "Open-source application performance monitoring (APM) and observability platform (YC backed).",
    tags: ["OpenSource", "Observability", "YC", "Remote"],
  },
  {
    id: "devtron",
    name: "Devtron",
    slug: "devtron",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://devtron.ai/favicon.ico",
    website: "https://devtron.ai",
    officialPortalUrl: "https://devtron.ai/careers",
    headquarters: "Gurugram / Remote",
    description: "Open-source software delivery workflow and Kubernetes deployment platform for cloud-native teams.",
    tags: ["Kubernetes", "DevOps", "OpenSource", "Gurugram"],
  },
  {
    id: "appsmith",
    name: "Appsmith",
    slug: "appsmith",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://www.appsmith.com/favicon.ico",
    website: "https://www.appsmith.com",
    officialPortalUrl: "https://www.appsmith.com/careers",
    headquarters: "Bengaluru / Remote",
    description: "Leading open-source low-code internal tool framework trusted by thousands of engineering teams globally.",
    tags: ["OpenSource", "LowCode", "DevTools", "Remote"],
  },
  {
    id: "hasura",
    name: "Hasura",
    slug: "hasura",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://hasura.io/favicon.ico",
    website: "https://hasura.io",
    officialPortalUrl: "https://hasura.io/careers/",
    headquarters: "Bengaluru & San Francisco",
    description: "Instant GraphQL and REST API engine on Postgres and databases with sub-millisecond query execution.",
    tags: ["GraphQL", "Databases", "DevTools", "Bengaluru"],
  },
  {
    id: "plum",
    name: "Plum",
    slug: "plum",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://www.plumhq.com/favicon.ico",
    website: "https://www.plumhq.com",
    officialPortalUrl: "https://www.plumhq.com/careers",
    headquarters: "Bengaluru, India",
    description: "Modern employee health insurance, comprehensive telehealth, and automated corporate wellness benefits.",
    tags: ["InsurTech", "HealthTech", "Bengaluru"],
  },
  {
    id: "kula",
    name: "Kula",
    slug: "kula",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://www.kula.ai/favicon.ico",
    website: "https://www.kula.ai",
    officialPortalUrl: "https://www.kula.ai/careers",
    headquarters: "Bengaluru & Singapore",
    description: "AI recruitment automation and outbound candidate pipeline platform for top tech teams.",
    tags: ["HRTech", "AI", "SaaS", "Bengaluru"],
  },
  {
    id: "classplus",
    name: "Classplus",
    slug: "classplus",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://classplusapp.com/favicon.ico",
    website: "https://classplusapp.com",
    officialPortalUrl: "https://classplusapp.com/careers",
    headquarters: "Noida, India",
    description: "Mobile-first SaaS platform powering educators, coaching institutions, and content creators.",
    tags: ["EdTech", "SaaS", "Noida"],
  },
  {
    id: "fampay",
    name: "FamPay",
    slug: "fampay",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://famapp.in/favicon.ico",
    website: "https://famapp.in",
    officialPortalUrl: "https://famapp.in/careers",
    headquarters: "Bengaluru, India",
    description: "Fintech for teens and digital-first Gen Z providing numberless cards, UPI payments, and savings.",
    tags: ["Fintech", "GenZ", "YC", "Bengaluru"],
  },
  {
    id: "jar",
    name: "Jar",
    slug: "jar",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://www.myjar.app/favicon.ico",
    website: "https://www.myjar.app",
    officialPortalUrl: "https://www.myjar.app/careers",
    headquarters: "Bengaluru, India",
    description: "Automated daily micro-savings and digital gold investment app democratizing financial habits in India.",
    tags: ["Fintech", "MicroSavings", "Bengaluru"],
  },
  {
    id: "sprinto",
    name: "Sprinto",
    slug: "sprinto",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.SMALL_STARTUPS,
    logo: "https://sprinto.com/favicon.ico",
    website: "https://sprinto.com",
    officialPortalUrl: "https://sprinto.com/careers/",
    headquarters: "Bengaluru, India",
    description: "Security compliance automation platform helping SaaS and cloud startups obtain SOC 2, ISO 27001, and HIPAA.",
    tags: ["Security", "Compliance", "SaaS", "Bengaluru"],
  },

  // ─── Indian Tech Giants & IT Leaders ──────────────────────────────
  {
    id: "tcs",
    name: "Tata Consultancy Services (TCS)",
    slug: "tcs",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.tcs.com/favicon.ico",
    website: "https://www.tcs.com",
    officialPortalUrl: "https://ibegin.tcs.com/iBegin/",
    headquarters: "Mumbai, India",
    description: "India's largest multinational IT services and consulting powerhouse, flagship tech company of the Tata Group.",
    tags: ["ITServices", "TataGroup", "Enterprise", "Mumbai"],
  },
  {
    id: "infosys",
    name: "Infosys",
    slug: "infosys",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.infosys.com/favicon.ico",
    website: "https://www.infosys.com",
    officialPortalUrl: "https://career.infosys.com/",
    headquarters: "Bengaluru, India",
    description: "Global leader in next-generation digital services, consulting, AI platforms (Topaz), and enterprise engineering.",
    tags: ["ITServices", "Cloud", "AI", "Bengaluru"],
  },
  {
    id: "wipro",
    name: "Wipro",
    slug: "wipro",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.wipro.com/favicon.ico",
    website: "https://www.wipro.com",
    officialPortalUrl: "https://careers.wipro.com/",
    headquarters: "Bengaluru, India",
    description: "Leading technology services and consulting company focused on innovative cloud, engineering, and cybersecurity.",
    tags: ["ITServices", "Consulting", "Bengaluru"],
  },
  {
    id: "hcltech",
    name: "HCLTech",
    slug: "hcltech",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.hcltech.com/favicon.ico",
    website: "https://www.hcltech.com",
    officialPortalUrl: "https://www.hcltech.com/careers",
    headquarters: "Noida, India",
    description: "Global technology enterprise powering digital, engineering, and cloud solutions across 60 countries.",
    tags: ["ITServices", "Engineering", "Noida"],
  },
  {
    id: "zoho",
    name: "Zoho Corporation",
    slug: "zoho",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.zoho.com/favicon.ico",
    website: "https://www.zoho.com",
    officialPortalUrl: "https://www.zoho.com/careers/",
    headquarters: "Chennai, India",
    description: "World-renowned bootstrapped Indian SaaS pioneer with 55+ business applications and 100M+ global users.",
    tags: ["SaaS", "Bootstrapped", "Chennai", "ProductCompany"],
  },
  {
    id: "jio",
    name: "Jio Platforms",
    slug: "jio",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.jio.com/favicon.ico",
    website: "https://www.jio.com",
    officialPortalUrl: "https://careers.jio.com/",
    headquarters: "Mumbai, India",
    description: "Reliance Jio's technology platform driving India's 5G revolution, cloud infrastructure, AI models, and digital services.",
    tags: ["Telecom", "5G", "Cloud", "Mumbai"],
  },
  {
    id: "ltimindtree",
    name: "LTIMindtree",
    slug: "ltimindtree",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.ltimindtree.com/favicon.ico",
    website: "https://www.ltimindtree.com",
    officialPortalUrl: "https://www.ltimindtree.com/careers/",
    headquarters: "Mumbai / Bengaluru, India",
    description: "Global digital solutions and technology consulting giant under Larsen & Toubro.",
    tags: ["ITServices", "Consulting", "L&TGroup"],
  },
  {
    id: "techmahindra",
    name: "Tech Mahindra",
    slug: "techmahindra",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.techmahindra.com/favicon.ico",
    website: "https://www.techmahindra.com",
    officialPortalUrl: "https://careers.techmahindra.com/",
    headquarters: "Pune, India",
    description: "Digital transformation, consulting, 5G enterprise networks, and business re-engineering services company.",
    tags: ["ITServices", "5G", "Telecom", "Pune"],
  },
  {
    id: "persistent",
    name: "Persistent Systems",
    slug: "persistent",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.persistent.com/favicon.ico",
    website: "https://www.persistent.com",
    officialPortalUrl: "https://www.persistent.com/careers/",
    headquarters: "Pune, India",
    description: "Global software engineering leader building digital products for healthcare, life sciences, and banking.",
    tags: ["ProductEngineering", "Cloud", "Pune"],
  },
  {
    id: "tataelxsi",
    name: "Tata Elxsi",
    slug: "tataelxsi",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.INDIAN_TECH_LEADERS,
    logo: "https://www.tataelxsi.com/favicon.ico",
    website: "https://www.tataelxsi.com",
    officialPortalUrl: "https://www.tataelxsi.com/careers",
    headquarters: "Bengaluru, India",
    description: "Pioneering design and engineering company for autonomous vehicles, IoT, smart devices, and digital healthcare.",
    tags: ["Design", "Automotive", "IoT", "Bengaluru"],
  },

  // ─── Big MNCs with Large India R&D Hubs ─────────────────────────
  {
    id: "google",
    name: "Google India",
    slug: "google",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.google.com/favicon.ico",
    website: "https://careers.google.com",
    officialPortalUrl: "https://careers.google.com/jobs/results/?location=India",
    headquarters: "Bengaluru, Hyderabad, Gurugram, Pune",
    description: "Global tech giant with massive engineering hubs in India working on Search, Android, Cloud, and AI.",
    tags: ["MNC", "Search", "Cloud", "AI"],
  },
  {
    id: "microsoft",
    name: "Microsoft India",
    slug: "microsoft",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.microsoft.com/favicon.ico",
    website: "https://careers.microsoft.com",
    officialPortalUrl: "https://careers.microsoft.com/us/en/search-results?q=India",
    headquarters: "Hyderabad, Bengaluru, Noida",
    description: "India Development Center (IDC) is Microsoft's largest engineering hub outside Redmond, driving Azure, Windows, and AI.",
    tags: ["MNC", "Azure", "Cloud", "AI"],
  },
  {
    id: "amazon",
    name: "Amazon India",
    slug: "amazon",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.amazon.in/favicon.ico",
    website: "https://www.amazon.jobs/en",
    officialPortalUrl: "https://www.amazon.jobs/en/locations/bangalore-india",
    headquarters: "Bengaluru, Hyderabad, Chennai, Delhi-NCR",
    description: "Cloud computing (AWS), e-commerce infrastructure, and Alexa core engineering teams based in India.",
    tags: ["MNC", "AWS", "E-Commerce", "Cloud"],
  },
  {
    id: "uber",
    name: "Uber India Tech",
    slug: "uber",
    provider: "ai_search",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.uber.com/favicon.ico",
    website: "https://www.uber.com/careers",
    officialPortalUrl: "https://www.uber.com/careers/list/?location=IND--Bangalore",
    headquarters: "Bengaluru, Hyderabad",
    description: "Uber's twin Indian tech centers drive core mobility, maps, infrastructure, and fintech systems globally.",
    tags: ["MNC", "Mobility", "HighScale"],
  },
  {
    id: "stripe",
    name: "Stripe",
    slug: "stripe",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://stripe.com/favicon.ico",
    website: "https://stripe.com/jobs",
    officialPortalUrl: "https://boards.greenhouse.io/stripe",
    headquarters: "Bengaluru / Global",
    description: "Financial infrastructure for the internet, expanding engineering presence rapidly in Bengaluru.",
    tags: ["Fintech", "Payments", "MNC"],
  },
  {
    id: "figma",
    name: "Figma",
    slug: "figma",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.figma.com/favicon.ico",
    website: "https://www.figma.com/careers",
    officialPortalUrl: "https://boards.greenhouse.io/figma",
    headquarters: "San Francisco / Remote & India",
    description: "Collaborative interface design tool transforming modern product engineering with deep web graphics technology.",
    tags: ["Design", "WebAssembly", "MNC"],
  },
  {
    id: "databricks",
    name: "Databricks",
    slug: "databricks",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://databricks.com/favicon.ico",
    website: "https://databricks.com/company/careers",
    officialPortalUrl: "https://boards.greenhouse.io/databricks",
    headquarters: "Bengaluru / Global",
    description: "Data intelligence and Lakehouse platform founded by the creators of Apache Spark.",
    tags: ["Data", "AI", "Spark", "MNC"],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    slug: "cloudflare",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.cloudflare.com/favicon.ico",
    website: "https://www.cloudflare.com/careers",
    officialPortalUrl: "https://boards.greenhouse.io/cloudflare",
    headquarters: "Bengaluru / Global",
    description: "Global security, performance, and CDN infrastructure powering 20%+ of the internet.",
    tags: ["Security", "Networking", "CDN", "MNC"],
  },
  {
    id: "gitlab",
    name: "GitLab",
    slug: "gitlab",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://gitlab.com/favicon.ico",
    website: "https://about.gitlab.com/jobs",
    officialPortalUrl: "https://boards.greenhouse.io/gitlab",
    headquarters: "All-Remote / India",
    description: "The comprehensive AI-powered DevSecOps platform built on open core principles.",
    tags: ["DevSecOps", "Remote", "MNC"],
  },
  {
    id: "airbnb",
    name: "Airbnb",
    slug: "airbnb",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.airbnb.com/favicon.ico",
    website: "https://careers.airbnb.com",
    officialPortalUrl: "https://boards.greenhouse.io/airbnb",
    headquarters: "Gurugram / Bengaluru / Global",
    description: "Global community marketplace for travel, accommodations, and unique stays.",
    tags: ["Travel", "Hospitality", "MNC"],
  },
  {
    id: "rubrik",
    name: "Rubrik",
    slug: "rubrik",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.rubrik.com/favicon.ico",
    website: "https://www.rubrik.com/careers",
    officialPortalUrl: "https://boards.greenhouse.io/rubrik",
    headquarters: "Bengaluru, India / Global",
    description: "Zero-trust cyber resilience and data security cloud platform with huge R&D in Bengaluru.",
    tags: ["Cybersecurity", "Cloud", "MNC"],
  },
  {
    id: "coinbase",
    name: "Coinbase",
    slug: "coinbase",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.coinbase.com/favicon.ico",
    website: "https://www.coinbase.com/careers",
    officialPortalUrl: "https://boards.greenhouse.io/coinbase",
    headquarters: "Hyderabad / Remote / Global",
    description: "Leading crypto economy exchange and Web3 platform building financial freedom.",
    tags: ["Crypto", "Web3", "MNC"],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    slug: "pinterest",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.pinterest.com/favicon.ico",
    website: "https://www.pinterestcareers.com",
    officialPortalUrl: "https://boards.greenhouse.io/pinterest",
    headquarters: "Bengaluru / Global",
    description: "Visual discovery and inspiration platform with large Bengaluru tech center.",
    tags: ["Social", "MachineLearning", "MNC"],
  },
  {
    id: "palantir",
    name: "Palantir Technologies",
    slug: "palantir",
    provider: "lever",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.palantir.com/favicon.ico",
    website: "https://www.palantir.com/careers",
    officialPortalUrl: "https://jobs.lever.co/palantir",
    headquarters: "Global",
    description: "Enterprise big data analytics and AI defense/commercial platforms (Foundry, AIP).",
    tags: ["BigData", "AI", "Enterprise"],
  },
  {
    id: "spotify",
    name: "Spotify",
    slug: "spotify",
    provider: "lever",
    category: COMPANY_CATEGORIES.BIG_MNC_INDIA,
    logo: "https://www.spotify.com/favicon.ico",
    website: "https://www.lifeatspotify.com",
    officialPortalUrl: "https://jobs.lever.co/spotify",
    headquarters: "Mumbai / Global",
    description: "World's most popular audio streaming subscription service.",
    tags: ["Audio", "Streaming", "MNC"],
  },

  // ─── AI, Cloud & Deep Tech ────────────────────────────────
  {
    id: "mongodb",
    name: "MongoDB",
    slug: "mongodb",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.AI_CLOUD,
    logo: "https://www.mongodb.com/favicon.ico",
    website: "https://www.mongodb.com/careers",
    officialPortalUrl: "https://boards.greenhouse.io/mongodb",
    headquarters: "Bengaluru, Gurugram / Global",
    description: "Leading modern developer data platform built on document database architecture.",
    tags: ["Database", "NoSQL", "Cloud"],
  },
  {
    id: "elastic",
    name: "Elastic",
    slug: "elastic",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.AI_CLOUD,
    logo: "https://www.elastic.co/favicon.ico",
    website: "https://www.elastic.co/about/careers",
    officialPortalUrl: "https://boards.greenhouse.io/elastic",
    headquarters: "Bengaluru / Distributed",
    description: "Creators of Elasticsearch and Kibana for search, observability, and security.",
    tags: ["Search", "Observability", "Elasticsearch"],
  },
  {
    id: "okta",
    name: "Okta",
    slug: "okta",
    provider: "greenhouse",
    category: COMPANY_CATEGORIES.AI_CLOUD,
    logo: "https://www.okta.com/favicon.ico",
    website: "https://www.okta.com/company/careers",
    officialPortalUrl: "https://boards.greenhouse.io/okta",
    headquarters: "Bengaluru, India / Global",
    description: "Leading independent identity and access management cloud provider.",
    tags: ["Identity", "Security", "Cloud"],
  },
  {
    "id": "dream11",
    "name": "Dream11",
    "slug": "dream11",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://about.dream11.in/favicon.ico",
    "website": "https://about.dream11.in",
    "officialPortalUrl": "https://about.dream11.in/careers",
    "headquarters": "Mumbai, India",
    "description": "India's biggest fantasy sports and interactive gaming platform with 150+ million users.",
    "tags": [
      "Gaming",
      "Fantasy Sports",
      "High Scale",
      "Unicorn"
    ]
  },
  {
    "id": "dropbox",
    "name": "Dropbox",
    "slug": "dropbox",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.dropbox.com/favicon.ico",
    "website": "https://www.dropbox.com",
    "officialPortalUrl": "https://www.dropbox.com/jobs",
    "headquarters": "San Francisco, CA / Virtual First / India",
    "description": "Global collaboration platform providing smart cloud storage, file sharing, and electronic signatures.",
    "tags": [
      "Cloud Storage",
      "Productivity",
      "Virtual First"
    ]
  },
  {
    "id": "druva",
    "name": "Druva",
    "slug": "druva",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.druva.com/favicon.ico",
    "website": "https://www.druva.com",
    "officialPortalUrl": "https://www.druva.com/about/careers/",
    "headquarters": "Sunnyvale, CA / Pune, India",
    "description": "SaaS-based cloud data protection and cyber resilience unicorn, founded originally in Pune.",
    "tags": [
      "Cloud Backup",
      "SaaS",
      "Cybersecurity",
      "Unicorn",
      "Pune"
    ]
  },
  {
    "id": "dxc",
    "name": "DXC Technology",
    "slug": "dxc",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://dxc.com/favicon.ico",
    "website": "https://dxc.com",
    "officialPortalUrl": "https://dxc.com/us/en/careers",
    "headquarters": "Ashburn, VA / Bengaluru, Chennai & Noida, India",
    "description": "Global Fortune 500 IT services provider managing mission-critical enterprise systems and cloud services.",
    "tags": [
      "IT Services",
      "Cloud",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "ebay",
    "name": "eBay",
    "slug": "ebay",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.ebay.com/favicon.ico",
    "website": "https://www.ebay.com",
    "officialPortalUrl": "https://jobs.ebayinc.com/us/en",
    "headquarters": "San Jose, CA / Bengaluru, India",
    "description": "Pioneering global e-commerce marketplace connecting millions of buyers and sellers worldwide.",
    "tags": [
      "E-Commerce",
      "Marketplace",
      "Bengaluru"
    ]
  },
  {
    "id": "ecom-express",
    "name": "Ecom Express",
    "slug": "ecom-express",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://ecomexpress.in/favicon.ico",
    "website": "https://ecomexpress.in",
    "officialPortalUrl": "https://ecomexpress.in/careers/",
    "headquarters": "Gurugram, India",
    "description": "Tech-enabled logistics solutions provider serving e-commerce enterprises across all Indian pin codes.",
    "tags": [
      "Logistics",
      "SupplyChain",
      "E-Commerce"
    ]
  },
  {
    "id": "elastic",
    "name": "Elastic",
    "slug": "elastic",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.elastic.co/favicon.ico",
    "website": "https://www.elastic.co",
    "officialPortalUrl": "https://boards.greenhouse.io/elastic",
    "headquarters": "Mountain View, CA / Bengaluru / Distributed",
    "description": "Creators of Elasticsearch and Kibana for search, observability, and cybersecurity telemetry.",
    "tags": [
      "Search",
      "Observability",
      "Elasticsearch",
      "Cloud"
    ]
  },
  {
    "id": "ea",
    "name": "Electronic Arts (EA)",
    "slug": "ea",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.ea.com/favicon.ico",
    "website": "https://www.ea.com",
    "officialPortalUrl": "https://www.ea.com/careers",
    "headquarters": "Redwood City, CA / Hyderabad, India",
    "description": "Global interactive entertainment and video game publishing titan (FIFA/EA Sports FC, Apex Legends, Battlefield).",
    "tags": [
      "Gaming",
      "3D Graphics",
      "C++",
      "Hyderabad"
    ]
  },
  {
    "id": "ericsson",
    "name": "Ericsson",
    "slug": "ericsson",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.ericsson.com/favicon.ico",
    "website": "https://www.ericsson.com",
    "officialPortalUrl": "https://www.ericsson.com/en/careers",
    "headquarters": "Stockholm, Sweden / Gurugram & Chennai, India",
    "description": "World leader in 5G mobile communications infrastructure, telecom networks, and cloud software.",
    "tags": [
      "5G",
      "Telecom",
      "IoT",
      "Gurugram"
    ]
  },
  {
    "id": "ey",
    "name": "Ernst & Young (EY)",
    "slug": "ey",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.ey.com/favicon.ico",
    "website": "https://www.ey.com",
    "officialPortalUrl": "https://www.ey.com/en_in/careers",
    "headquarters": "London, UK / Mumbai, Gurugram & Bengaluru, India",
    "description": "Big Four accounting, strategy, technology consulting, and AI implementation global powerhouse.",
    "tags": [
      "Consulting",
      "Big Four",
      "Audit",
      "Technology"
    ]
  },
  {
    "id": "eruditus",
    "name": "Eruditus / Emeritus",
    "slug": "eruditus",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://eruditus.com/favicon.ico",
    "website": "https://eruditus.com",
    "officialPortalUrl": "https://eruditus.com/careers/",
    "headquarters": "Singapore / Mumbai, India",
    "description": "Global EdTech unicorn partnering with top universities (MIT, Harvard, INSEAD) for executive education.",
    "tags": [
      "EdTech",
      "Higher Education",
      "Unicorn",
      "Mumbai"
    ]
  },
  {
    "id": "expedia",
    "name": "Expedia Group",
    "slug": "expedia",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.expediagroup.com/favicon.ico",
    "website": "https://www.expediagroup.com",
    "officialPortalUrl": "https://careers.expediagroup.com/",
    "headquarters": "Seattle, WA / Gurugram & Bengaluru, India",
    "description": "Global travel technology leader powering Expedia, Hotels.com, Vrbo, and Trivago.",
    "tags": [
      "TravelTech",
      "E-Commerce",
      "Gurugram",
      "High Scale"
    ]
  },
  {
    "id": "factset",
    "name": "FactSet",
    "slug": "factset",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.factset.com/favicon.ico",
    "website": "https://www.factset.com",
    "officialPortalUrl": "https://www.factset.com/careers",
    "headquarters": "Norwalk, CT / Hyderabad, India",
    "description": "Leading financial data analytics and investment workstation technology company.",
    "tags": [
      "Fintech",
      "Data Analytics",
      "Capital Markets",
      "Hyderabad"
    ]
  },
  {
    "id": "fampay",
    "name": "FamPay",
    "slug": "fampay",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://fampay.in/favicon.ico",
    "website": "https://fampay.in",
    "officialPortalUrl": "https://fampay.in/careers",
    "headquarters": "Bengaluru, India",
    "description": "India's first smart UPI neo-banking app and prepaid card designed for teenagers and families.",
    "tags": [
      "Fintech",
      "UPI",
      "Youth",
      "YC"
    ]
  },
  {
    "id": "fidelity",
    "name": "Fidelity Investments",
    "slug": "fidelity",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.fidelity.com/favicon.ico",
    "website": "https://www.fidelity.com",
    "officialPortalUrl": "https://jobs.fidelity.com/",
    "headquarters": "Boston, MA / Bengaluru & Chennai, India",
    "description": "One of the world's most diversified financial services firms with huge digital wealth engineering teams.",
    "tags": [
      "Fintech",
      "Wealth Management",
      "Bengaluru",
      "Chennai"
    ]
  },
  {
    "id": "figma",
    "name": "Figma",
    "slug": "figma",
    "provider": "greenhouse",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.figma.com/favicon.ico",
    "website": "https://www.figma.com",
    "officialPortalUrl": "https://boards.greenhouse.io/figma",
    "headquarters": "San Francisco, CA / Remote",
    "description": "Leading web-first collaborative design, UI/UX prototyping, and FigJam digital whiteboard tool.",
    "tags": [
      "Design",
      "WebAssembly",
      "Collaboration",
      "SaaS"
    ]
  },
  {
    "id": "firstsource",
    "name": "Firstsource Solutions",
    "slug": "firstsource",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.firstsource.com/favicon.ico",
    "website": "https://www.firstsource.com",
    "officialPortalUrl": "https://www.firstsource.com/careers/",
    "headquarters": "Mumbai, India",
    "description": "Leading business process management and AI automation solutions provider, an RP-Sanjiv Goenka Group company.",
    "tags": [
      "BPO",
      "IT Services",
      "Mumbai",
      "BSE Listed"
    ]
  },
  {
    "id": "fiserv",
    "name": "Fiserv",
    "slug": "fiserv",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.fiserv.com/favicon.ico",
    "website": "https://www.fiserv.com",
    "officialPortalUrl": "https://www.careers.fiserv.com/",
    "headquarters": "Brookfield, WI / Noida, Pune, Bengaluru & Chennai",
    "description": "Global fintech and payments processing powerhouse serving thousands of financial institutions.",
    "tags": [
      "Fintech",
      "Core Banking",
      "Payments",
      "Noida"
    ]
  },
  {
    "id": "flipkart",
    "name": "Flipkart",
    "slug": "flipkart",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.flipkart.com/favicon.ico",
    "website": "https://www.flipkartcareers.com",
    "officialPortalUrl": "https://www.flipkartcareers.com/",
    "headquarters": "Bengaluru, India",
    "description": "India's homegrown e-commerce pioneer, part of the Walmart group, serving millions of shoppers.",
    "tags": [
      "E-Commerce",
      "Supply Chain",
      "Walmart",
      "Bengaluru"
    ]
  },
  {
    "id": "ford",
    "name": "Ford Motor Company",
    "slug": "ford",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.ford.com/favicon.ico",
    "website": "https://www.ford.com",
    "officialPortalUrl": "https://careers.ford.com/",
    "headquarters": "Dearborn, MI / Chennai & Coimbatore, India",
    "description": "Automotive icon operating massive global technology and software innovation centers in India.",
    "tags": [
      "Automotive",
      "Connected Vehicle",
      "IoT",
      "Chennai"
    ]
  },
  {
    "id": "fortinet",
    "name": "Fortinet",
    "slug": "fortinet",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.fortinet.com/favicon.ico",
    "website": "https://www.fortinet.com",
    "officialPortalUrl": "https://www.fortinet.com/corporate/careers",
    "headquarters": "Sunnyvale, CA / Bengaluru, India",
    "description": "Global leader in broad, integrated, and automated cybersecurity solutions and next-gen firewalls.",
    "tags": [
      "Cybersecurity",
      "Network Security",
      "Cloud"
    ]
  },
  {
    "id": "fractal",
    "name": "Fractal Analytics",
    "slug": "fractal",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://fractal.ai/favicon.ico",
    "website": "https://fractal.ai",
    "officialPortalUrl": "https://fractal.ai/careers/",
    "headquarters": "New York, NY / Mumbai & Bengaluru, India",
    "description": "Global AI and advanced data analytics unicorn powering decisions for Fortune 500 enterprises.",
    "tags": [
      "AI",
      "Analytics",
      "Machine Learning",
      "Unicorn"
    ]
  },
  {
    "id": "gartner",
    "name": "Gartner",
    "slug": "gartner",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.gartner.com/favicon.ico",
    "website": "https://jobs.gartner.com",
    "officialPortalUrl": "https://jobs.gartner.com/",
    "headquarters": "Stamford, CT / Gurugram & Chennai, India",
    "description": "The world's leading research and advisory company providing business insights and IT analysis.",
    "tags": [
      "Research",
      "Consulting",
      "Analytics",
      "Gurugram"
    ]
  },
  {
    "id": "ge",
    "name": "GE (General Electric)",
    "slug": "ge",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.ge.com/favicon.ico",
    "website": "https://www.ge.com",
    "officialPortalUrl": "https://jobs.gecareers.com/global/en",
    "headquarters": "Boston, MA / Bengaluru (John F. Welch Tech Centre)",
    "description": "High-tech industrial multinational pioneering aviation engines, healthcare imaging, and renewable energy.",
    "tags": [
      "Industrial IoT",
      "Healthcare",
      "Aviation",
      "Bengaluru"
    ]
  },
  {
    "id": "genpact",
    "name": "Genpact",
    "slug": "genpact",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.genpact.com/favicon.ico",
    "website": "https://www.genpact.com",
    "officialPortalUrl": "https://www.genpact.com/careers",
    "headquarters": "New York, NY / Gurugram & Hyderabad, India",
    "description": "Global professional services firm delivering digital business operations and AI transformation at scale.",
    "tags": [
      "IT Services",
      "AI",
      "Digital Operations",
      "Gurugram"
    ]
  },
  {
    "id": "github",
    "name": "GitHub",
    "slug": "github",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://github.com/favicon.ico",
    "website": "https://github.com",
    "officialPortalUrl": "https://github.com/about/careers",
    "headquarters": "San Francisco, CA / Remote",
    "description": "The world's largest developer platform for code hosting, CI/CD actions, Copilot AI, and open source.",
    "tags": [
      "Developer Tools",
      "AI",
      "Open Source",
      "Microsoft"
    ]
  },
  {
    "id": "gitlab",
    "name": "GitLab",
    "slug": "gitlab",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://gitlab.com/favicon.ico",
    "website": "https://gitlab.com",
    "officialPortalUrl": "https://boards.greenhouse.io/gitlab",
    "headquarters": "San Francisco, CA / All-Remote",
    "description": "The comprehensive AI-powered DevSecOps platform for software development, CI/CD, and security.",
    "tags": [
      "DevSecOps",
      "CI/CD",
      "All-Remote",
      "Cloud"
    ]
  },
  {
    "id": "globallogic",
    "name": "GlobalLogic (Hitachi)",
    "slug": "globallogic",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.globallogic.com/favicon.ico",
    "website": "https://www.globallogic.com",
    "officialPortalUrl": "https://www.globallogic.com/careers/",
    "headquarters": "San Jose, CA / Noida, Gurugram & Bengaluru, India",
    "description": "Digital product engineering leader integrating software architecture, design, and cloud systems.",
    "tags": [
      "Product Engineering",
      "Cloud",
      "Digital",
      "Hitachi"
    ]
  },
  {
    "id": "godaddy",
    "name": "GoDaddy",
    "slug": "godaddy",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.godaddy.com/favicon.ico",
    "website": "https://careers.godaddy.com",
    "officialPortalUrl": "https://careers.godaddy.com/",
    "headquarters": "Tempe, AZ / Gurugram & Hyderabad, India",
    "description": "Empowering everyday entrepreneurs with domain registration, website building, and cloud hosting.",
    "tags": [
      "Cloud",
      "SaaS",
      "Domains",
      "Web"
    ]
  },
  {
    "id": "goldmansachs",
    "name": "Goldman Sachs",
    "slug": "goldmansachs",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.goldmansachs.com/favicon.ico",
    "website": "https://www.goldmansachs.com",
    "officialPortalUrl": "https://www.goldmansachs.com/careers/",
    "headquarters": "New York, NY / Bengaluru & Hyderabad, India",
    "description": "Leading global investment banking, securities, asset management, and quantitative finance firm.",
    "tags": [
      "Investment Banking",
      "Quantitative Finance",
      "Fintech"
    ]
  },
  {
    "id": "goldman-sachs",
    "name": "Goldman Sachs",
    "slug": "goldman-sachs",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.goldmansachs.com/favicon.ico",
    "website": "https://www.goldmansachs.com",
    "officialPortalUrl": "https://www.goldmansachs.com/careers/",
    "headquarters": "New York, NY / Bengaluru & Hyderabad, India",
    "description": "World-renowned investment banking, securities, and asset management firm with premier engineering teams in India.",
    "tags": [
      "Investment Banking",
      "Fintech",
      "High Frequency",
      "Bengaluru"
    ]
  },
  {
    "id": "google",
    "name": "Google (Alphabet)",
    "slug": "google",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.google.com/favicon.ico",
    "website": "https://careers.google.com",
    "officialPortalUrl": "https://careers.google.com/locations/india/",
    "headquarters": "Mountain View, CA / Bengaluru, Hyderabad & Gurugram, India",
    "description": "Global technological trailblazer in Internet search, Android, Google Cloud, YouTube, and Gemini AI.",
    "tags": [
      "Big Tech",
      "AI",
      "Cloud",
      "Search"
    ]
  },
  {
    "id": "groww",
    "name": "Groww",
    "slug": "groww",
    "provider": "greenhouse",
    "category": "Indian Startups & Unicorns",
    "logo": "https://groww.in/favicon.ico",
    "website": "https://groww.in",
    "officialPortalUrl": "https://boards.greenhouse.io/groww",
    "headquarters": "Bengaluru, India",
    "description": "India's largest online investment platform for mutual funds, stocks, US investing, and credit.",
    "tags": [
      "WealthTech",
      "Fintech",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "guidewire",
    "name": "Guidewire Software",
    "slug": "guidewire",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.guidewire.com/favicon.ico",
    "website": "https://www.guidewire.com",
    "officialPortalUrl": "https://careers.guidewire.com/",
    "headquarters": "San Mateo, CA / Bengaluru & Chennai, India",
    "description": "The industry platform for property and casualty insurers to engage, innovate, and grow efficiently.",
    "tags": [
      "InsurTech",
      "SaaS",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "hackerrank",
    "name": "HackerRank",
    "slug": "hackerrank",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.hackerrank.com/favicon.ico",
    "website": "https://www.hackerrank.com",
    "officialPortalUrl": "https://www.hackerrank.com/careers/",
    "headquarters": "Mountain View, CA / Bengaluru, India",
    "description": "The market-leading technical hiring and developer skills assessment platform used by 3,000+ tech companies.",
    "tags": [
      "HRTech",
      "Developer Skills",
      "Assessment",
      "Bengaluru"
    ]
  },
  {
    "id": "hashicorp",
    "name": "HashiCorp",
    "slug": "hashicorp",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.hashicorp.com/favicon.ico",
    "website": "https://www.hashicorp.com",
    "officialPortalUrl": "https://boards.greenhouse.io/hashicorp",
    "headquarters": "San Francisco, CA / Global Remote",
    "description": "Pioneering multi-cloud infrastructure automation software (Terraform, Vault, Consul, Nomad).",
    "tags": [
      "Terraform",
      "Cloud Automation",
      "DevOps",
      "Open Source"
    ]
  },
  {
    "id": "hasura",
    "name": "Hasura",
    "slug": "hasura",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://hasura.io/favicon.ico",
    "website": "https://hasura.io",
    "officialPortalUrl": "https://hasura.io/careers",
    "headquarters": "San Francisco / Bengaluru, India",
    "description": "Instant GraphQL and REST APIs on PostgreSQL, MySQL, and Snowflake with sub-millisecond latency.",
    "tags": [
      "GraphQL",
      "Database",
      "Developer Tools"
    ]
  },
  {
    "id": "hcltech",
    "name": "HCLTech",
    "slug": "hcltech",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.hcltech.com/favicon.ico",
    "website": "https://www.hcltech.com",
    "officialPortalUrl": "https://www.hcltech.com/careers",
    "headquarters": "Noida, India",
    "description": "Global IT technology and software enterprise engineering engineering solutions for Fortune 500 firms.",
    "tags": [
      "IT Services",
      "Engineering",
      "Enterprise",
      "Noida"
    ]
  },
  {
    "id": "hdfc-bank",
    "name": "HDFC Bank",
    "slug": "hdfc-bank",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.hdfcbank.com/favicon.ico",
    "website": "https://www.hdfcbank.com",
    "officialPortalUrl": "https://www.hdfcbank.com/personal/about-us/careers",
    "headquarters": "Mumbai & Bengaluru, India",
    "description": "India's largest private bank by assets, driving high-volume digital transactions, UPI, and PayZapp.",
    "tags": [
      "Banking",
      "Payments",
      "Fintech",
      "Mumbai"
    ]
  },
  {
    "id": "hpe",
    "name": "Hewlett Packard Enterprise (HPE)",
    "slug": "hpe",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.hpe.com/favicon.ico",
    "website": "https://careers.hpe.com",
    "officialPortalUrl": "https://careers.hpe.com/",
    "headquarters": "Houston, TX / Bengaluru, India",
    "description": "Edge-to-cloud platform company helping organizations accelerate outcomes through hybrid cloud and HPC.",
    "tags": [
      "Cloud",
      "GreenLake",
      "Storage",
      "Enterprise"
    ]
  },
  {
    "id": "hexaware",
    "name": "Hexaware Technologies",
    "slug": "hexaware",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://hexaware.com/favicon.ico",
    "website": "https://hexaware.com",
    "officialPortalUrl": "https://jobs.hexaware.com/",
    "headquarters": "Mumbai & Navi Mumbai, India",
    "description": "Global IT services and automation-led digital consulting company.",
    "tags": [
      "IT Services",
      "Cloud",
      "Automation",
      "Mumbai"
    ]
  },
  {
    "id": "hitachi",
    "name": "Hitachi Vantara",
    "slug": "hitachi",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.hitachivantara.com/favicon.ico",
    "website": "https://www.hitachivantara.com",
    "officialPortalUrl": "https://www.hitachivantara.com/en-us/company/careers.html",
    "headquarters": "Santa Clara, CA / Bengaluru & Hyderabad, India",
    "description": "Data storage, industrial IoT, digital infrastructure, and hybrid cloud solutions leader.",
    "tags": [
      "Data Infrastructure",
      "Cloud",
      "Storage",
      "IoT"
    ]
  },
  {
    "id": "honeywell",
    "name": "Honeywell",
    "slug": "honeywell",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.honeywell.com/favicon.ico",
    "website": "https://careers.honeywell.com",
    "officialPortalUrl": "https://careers.honeywell.com/us/en",
    "headquarters": "Charlotte, NC / Bengaluru, Hyderabad & Pune, India",
    "description": "Industrial software conglomerate inventing technologies in aerospace, building automation, and quantum tech.",
    "tags": [
      "Industrial Software",
      "IoT",
      "Aerospace",
      "Bengaluru"
    ]
  },
  {
    "id": "hp",
    "name": "HP Inc.",
    "slug": "hp",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.hp.com/favicon.ico",
    "website": "https://jobs.hp.com",
    "officialPortalUrl": "https://jobs.hp.com/",
    "headquarters": "Palo Alto, CA / Bengaluru & Chennai, India",
    "description": "Global personal systems, printing innovation, and 3D manufacturing technology leader.",
    "tags": [
      "Hardware",
      "Personal Systems",
      "IoT"
    ]
  },
  {
    "id": "hsbc",
    "name": "HSBC",
    "slug": "hsbc",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.hsbc.com/favicon.ico",
    "website": "https://www.hsbc.com",
    "officialPortalUrl": "https://mycareer.hsbc.com/en_GB/external",
    "headquarters": "London, UK / Pune, Hyderabad, Bengaluru & Kolkata",
    "description": "One of the world's largest banking and financial services organizations with major India tech hubs.",
    "tags": [
      "Banking",
      "Fintech",
      "Wealth",
      "Pune"
    ]
  },
  {
    "id": "hubspot",
    "name": "HubSpot",
    "slug": "hubspot",
    "provider": "greenhouse",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.hubspot.com/favicon.ico",
    "website": "https://www.hubspot.com",
    "officialPortalUrl": "https://www.hubspot.com/careers",
    "headquarters": "Cambridge, MA / Remote",
    "description": "Leading CRM and inbound marketing, sales, and customer service software platform.",
    "tags": [
      "CRM",
      "MarTech",
      "SaaS",
      "Remote"
    ]
  },
  {
    "id": "ibm",
    "name": "IBM",
    "slug": "ibm",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.ibm.com/favicon.ico",
    "website": "https://www.ibm.com",
    "officialPortalUrl": "https://www.ibm.com/careers/in-en",
    "headquarters": "Armonk, NY / Bengaluru & Hyderabad, India",
    "description": "Pioneering technology leader in hybrid cloud solutions with Red Hat, enterprise AI (watsonx), and mainframe systems.",
    "tags": [
      "Cloud",
      "AI",
      "Enterprise",
      "Red Hat"
    ]
  },
  {
    "id": "icici-bank",
    "name": "ICICI Bank",
    "slug": "icici-bank",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.icicibank.com/favicon.ico",
    "website": "https://www.icicibank.com",
    "officialPortalUrl": "https://www.icicicareers.com/",
    "headquarters": "Mumbai & Hyderabad, India",
    "description": "Leading private sector Indian bank with cutting-edge mobile iMobile Pay, digital API banking, and fintech.",
    "tags": [
      "Banking",
      "Fintech",
      "Mumbai",
      "BFSI"
    ]
  },
  {
    "id": "indiamart",
    "name": "IndiaMART",
    "slug": "indiamart",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.indiamart.com/favicon.ico",
    "website": "https://www.indiamart.com",
    "officialPortalUrl": "https://corporate.indiamart.com/careers/",
    "headquarters": "Noida, India",
    "description": "India's largest online B2B marketplace connecting buyers with suppliers across 100+ million products.",
    "tags": [
      "B2B",
      "E-Commerce",
      "Public Tech",
      "Noida"
    ]
  },
  {
    "id": "indusind-bank",
    "name": "IndusInd Bank",
    "slug": "indusind-bank",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.indusind.com/favicon.ico",
    "website": "https://www.indusind.com",
    "officialPortalUrl": "https://www.indusind.com/in/en/personal/careers.html",
    "headquarters": "Pune & Mumbai, India",
    "description": "Pioneering commercial bank offering modern digital banking products, trade finance, and cards.",
    "tags": [
      "Banking",
      "Fintech",
      "Pune",
      "Mumbai"
    ]
  },
  {
    "id": "naukri",
    "name": "Info Edge (Naukri / Jeevansathi)",
    "slug": "naukri",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.naukri.com/favicon.ico",
    "website": "https://www.infoedge.in",
    "officialPortalUrl": "https://www.infoedge.in/careers.html",
    "headquarters": "Noida, India",
    "description": "India's premier internet classifieds pioneer operating Naukri.com, 99acres, Jeevansathi, and Shiksha.",
    "tags": [
      "HRTech",
      "Internet",
      "Public Tech",
      "Noida"
    ]
  },
  {
    "id": "informatica",
    "name": "Informatica",
    "slug": "informatica",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.informatica.com/favicon.ico",
    "website": "https://www.informatica.com",
    "officialPortalUrl": "https://www.informatica.com/about-us/careers.html",
    "headquarters": "Redwood City, CA / Bengaluru, India",
    "description": "Enterprise cloud data management and AI-powered data integration leader (CLAIRE).",
    "tags": [
      "Data Integration",
      "Cloud",
      "ETL",
      "Bengaluru"
    ]
  },
  {
    "id": "infosys",
    "name": "Infosys",
    "slug": "infosys",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.infosys.com/favicon.ico",
    "website": "https://career.infosys.com",
    "officialPortalUrl": "https://career.infosys.com/",
    "headquarters": "Bengaluru, India",
    "description": "Global leader in next-generation digital services, consulting, AI, and enterprise cloud solutions.",
    "tags": [
      "IT Services",
      "Consulting",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "inmobi",
    "name": "InMobi",
    "slug": "inmobi",
    "provider": "greenhouse",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.inmobi.com/favicon.ico",
    "website": "https://www.inmobi.com",
    "officialPortalUrl": "https://boards.greenhouse.io/inmobi",
    "headquarters": "Bengaluru, India",
    "description": "India's first tech unicorn, global leader in mobile marketing, ad-tech, and Glance smart lockscreen.",
    "tags": [
      "AdTech",
      "AI",
      "Lockscreen",
      "Bengaluru"
    ]
  },
  {
    "id": "innovaccer",
    "name": "Innovaccer",
    "slug": "innovaccer",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://innovaccer.com/favicon.ico",
    "website": "https://innovaccer.com",
    "officialPortalUrl": "https://innovaccer.com/careers",
    "headquarters": "San Francisco, CA / Noida, India",
    "description": "Leading digital health cloud unicorn connecting patient data to improve healthcare outcomes.",
    "tags": [
      "HealthTech",
      "Cloud",
      "Unicorn",
      "Noida"
    ]
  },
  {
    "id": "intel",
    "name": "Intel",
    "slug": "intel",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.intel.com/favicon.ico",
    "website": "https://jobs.intel.com",
    "officialPortalUrl": "https://jobs.intel.com/",
    "headquarters": "Santa Clara, CA / Bengaluru, India",
    "description": "World leader in microprocessor innovation, silicon foundries, data center hardware, and autonomous driving.",
    "tags": [
      "Semiconductors",
      "Hardware",
      "Silicon",
      "Big Tech"
    ]
  },
  {
    "id": "intuit",
    "name": "Intuit",
    "slug": "intuit",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.intuit.com/favicon.ico",
    "website": "https://www.intuit.com",
    "officialPortalUrl": "https://jobs.intuit.com/",
    "headquarters": "Mountain View, CA / Bengaluru, India",
    "description": "Financial technology platform powering TurboTax, QuickBooks, Mint, and Mailchimp.",
    "tags": [
      "Fintech",
      "TaxTech",
      "AI",
      "Bengaluru"
    ]
  },
  {
    "id": "itc-infotech",
    "name": "ITC Infotech",
    "slug": "itc-infotech",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.itcinfotech.com/favicon.ico",
    "website": "https://www.itcinfotech.com",
    "officialPortalUrl": "https://www.itcinfotech.com/careers/",
    "headquarters": "Bengaluru, India",
    "description": "Global technology services and digital solutions provider, a wholly-owned subsidiary of ITC Limited.",
    "tags": [
      "IT Services",
      "Digital",
      "Bengaluru"
    ]
  },
  {
    "id": "jar",
    "name": "Jar",
    "slug": "jar",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://myjar.app/favicon.ico",
    "website": "https://myjar.app",
    "officialPortalUrl": "https://myjar.app/careers",
    "headquarters": "Bengaluru, India",
    "description": "Automated digital gold micro-savings and investment platform for young Indians.",
    "tags": [
      "Fintech",
      "MicroSavings",
      "Consumer"
    ]
  },
  {
    "id": "jio",
    "name": "Jio Platforms",
    "slug": "jio",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.jio.com/favicon.ico",
    "website": "https://careers.jio.com",
    "officialPortalUrl": "https://careers.jio.com/",
    "headquarters": "Navi Mumbai, India",
    "description": "India's digital connectivity, 5G telecom, cloud, and digital services powerhouse under Reliance Industries.",
    "tags": [
      "Telecom",
      "5G",
      "Cloud",
      "Reliance"
    ]
  },
  {
    "id": "johnson-and-johnson",
    "name": "Johnson & Johnson",
    "slug": "johnson-and-johnson",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.jnj.com/favicon.ico",
    "website": "https://www.jnj.com",
    "officialPortalUrl": "https://jobs.jnj.com/",
    "headquarters": "New Brunswick, NJ / Mumbai & Bengaluru, India",
    "description": "Global healthcare and medical technology leader driving robotics surgery and digital health.",
    "tags": [
      "HealthTech",
      "MedTech",
      "Robotics",
      "Bengaluru"
    ]
  },
  {
    "id": "jpmorgan",
    "name": "JPMorgan Chase",
    "slug": "jpmorgan",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.jpmorganchase.com/favicon.ico",
    "website": "https://careers.jpmorgan.com",
    "officialPortalUrl": "https://careers.jpmorgan.com/global/en/home",
    "headquarters": "New York, NY / Mumbai, Bengaluru & Hyderabad, India",
    "description": "The largest bank in the US investing over $15 billion annually in software and cloud engineering.",
    "tags": [
      "Investment Banking",
      "Fintech",
      "High Scale",
      "Bengaluru"
    ]
  },
  {
    "id": "junglee-games",
    "name": "Junglee Games (Flutter)",
    "slug": "junglee-games",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.jungleegames.com/favicon.ico",
    "website": "https://www.jungleegames.com",
    "officialPortalUrl": "https://www.jungleegames.com/careers",
    "headquarters": "San Mateo, CA / Gurugram, India",
    "description": "Pioneering Indian mobile gaming studio reaching over 100 million players worldwide.",
    "tags": [
      "Gaming",
      "Mobile",
      "Gurugram"
    ]
  },
  {
    "id": "juniper",
    "name": "Juniper Networks",
    "slug": "juniper",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.juniper.net/favicon.ico",
    "website": "https://www.juniper.net",
    "officialPortalUrl": "https://careers.juniper.net/",
    "headquarters": "Sunnyvale, CA / Bengaluru, India",
    "description": "Industry innovator in AI-native cloud networking, routing, switching, and Mist AI cybersecurity.",
    "tags": [
      "Networking",
      "AI-Native",
      "Cloud",
      "Bengaluru"
    ]
  },
  {
    "id": "jupiter-money",
    "name": "Jupiter Money",
    "slug": "jupiter-money",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://jupiter.money/favicon.ico",
    "website": "https://jupiter.money",
    "officialPortalUrl": "https://jupiter.money/careers/",
    "headquarters": "Bengaluru, India",
    "description": "Leading Indian 1-app neobank offering 100% digital savings accounts, UPI, and wealth insights.",
    "tags": [
      "Neobank",
      "Fintech",
      "UPI",
      "Bengaluru"
    ]
  },
  {
    "id": "keka",
    "name": "Keka HR",
    "slug": "keka",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.keka.com/favicon.ico",
    "website": "https://www.keka.com",
    "officialPortalUrl": "https://www.keka.com/careers",
    "headquarters": "Hyderabad, India",
    "description": "India's modern employee experience and HR payroll software platform.",
    "tags": [
      "HRTech",
      "SaaS",
      "Payroll",
      "Hyderabad"
    ]
  },
  {
    "id": "khatabook",
    "name": "Khatabook",
    "slug": "khatabook",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://khatabook.com/favicon.ico",
    "website": "https://khatabook.com",
    "officialPortalUrl": "https://khatabook.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Digital ledger and bookkeeping app for small and medium businesses across India.",
    "tags": [
      "MSME",
      "Fintech",
      "SaaS",
      "Bengaluru"
    ]
  },
  {
    "id": "kla",
    "name": "KLA Corporation",
    "slug": "kla",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.kla.com/favicon.ico",
    "website": "https://www.kla.com",
    "officialPortalUrl": "https://www.kla.com/careers",
    "headquarters": "Milpitas, CA / Chennai, India",
    "description": "Global leader in process control and yield management systems for the semiconductor industry.",
    "tags": [
      "Semiconductors",
      "DeepTech",
      "Optics",
      "Chennai"
    ]
  },
  {
    "id": "kotak-bank",
    "name": "Kotak Mahindra Bank",
    "slug": "kotak-bank",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.kotak.com/favicon.ico",
    "website": "https://www.kotak.com",
    "officialPortalUrl": "https://www.kotak.com/en/careers.html",
    "headquarters": "Mumbai & Bengaluru, India",
    "description": "Leading private Indian bank pioneering digital zero-balance accounts (Kotak 811) and wealth management.",
    "tags": [
      "Banking",
      "Kotak811",
      "Fintech",
      "Mumbai"
    ]
  },
  {
    "id": "kpmg",
    "name": "KPMG India",
    "slug": "kpmg",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://kpmg.com/favicon.ico",
    "website": "https://kpmg.com/in",
    "officialPortalUrl": "https://kpmg.com/in/en/home/careers.html",
    "headquarters": "Amstelveen, Netherlands / Mumbai, Gurugram & Bengaluru",
    "description": "Big Four professional services firm offering audit, tax, technology advisory, and cyber consulting.",
    "tags": [
      "Consulting",
      "Big Four",
      "Audit",
      "Digital"
    ]
  },
  {
    "id": "kula",
    "name": "Kula",
    "slug": "kula",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://www.kula.ai/favicon.ico",
    "website": "https://www.kula.ai",
    "officialPortalUrl": "https://www.kula.ai/careers",
    "headquarters": "Bengaluru / San Francisco",
    "description": "AI-driven recruiting and candidate outreach platform for hypergrowth tech teams.",
    "tags": [
      "HRTech",
      "AI",
      "SaaS"
    ]
  },
  {
    "id": "kyndryl",
    "name": "Kyndryl",
    "slug": "kyndryl",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.kyndryl.com/favicon.ico",
    "website": "https://www.kyndryl.com",
    "officialPortalUrl": "https://www.kyndryl.com/us/en/careers",
    "headquarters": "New York, NY / Bengaluru, India",
    "description": "The world's largest IT infrastructure services provider, spun out of IBM, operating in 60+ countries.",
    "tags": [
      "Infrastructure",
      "Cloud",
      "Enterprise IT",
      "Bengaluru"
    ]
  },
  {
    "id": "lam-research",
    "name": "Lam Research",
    "slug": "lam-research",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.lamresearch.com/favicon.ico",
    "website": "https://www.lamresearch.com",
    "officialPortalUrl": "https://careers.lamresearch.com/",
    "headquarters": "Fremont, CA / Bengaluru, India",
    "description": "Global supplier of innovative wafer fabrication equipment to the worldwide semiconductor industry.",
    "tags": [
      "Semiconductors",
      "DeepTech",
      "Nanotech",
      "Bengaluru"
    ]
  },
  {
    "id": "larsen-toubro",
    "name": "Larsen & Toubro (L&T)",
    "slug": "larsen-toubro",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.larsentoubro.com/favicon.ico",
    "website": "https://www.larsentoubro.com",
    "officialPortalUrl": "https://www.larsentoubro.com/corporate/careers/",
    "headquarters": "Mumbai, India",
    "description": "Indian multinational conglomerate operating in technology, engineering, construction, and manufacturing.",
    "tags": [
      "Engineering",
      "Infrastructure",
      "Defense",
      "Mumbai"
    ]
  },
  {
    "id": "leadsquared",
    "name": "LeadSquared",
    "slug": "leadsquared",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.leadsquared.com/favicon.ico",
    "website": "https://www.leadsquared.com",
    "officialPortalUrl": "https://www.leadsquared.com/careers/",
    "headquarters": "Bengaluru, India",
    "description": "Leading sales execution and marketing automation CRM unicorn.",
    "tags": [
      "CRM",
      "SaaS",
      "MarTech",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "lenovo",
    "name": "Lenovo",
    "slug": "lenovo",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.lenovo.com/favicon.ico",
    "website": "https://www.lenovo.com",
    "officialPortalUrl": "https://jobs.lenovo.com/",
    "headquarters": "Hong Kong / Bengaluru, India",
    "description": "World's #1 PC manufacturer and datacenter server infrastructure provider.",
    "tags": [
      "Hardware",
      "Personal Computing",
      "Servers",
      "Bengaluru"
    ]
  },
  {
    "id": "lenskart",
    "name": "Lenskart",
    "slug": "lenskart",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.lenskart.com/favicon.ico",
    "website": "https://www.lenskart.com",
    "officialPortalUrl": "https://www.lenskart.com/careers",
    "headquarters": "Gurugram, India",
    "description": "Omnichannel eyewear retailer revolutionizing vision health with AR try-on and automated manufacturing.",
    "tags": [
      "Omnichannel",
      "Retail",
      "Unicorn",
      "AR"
    ]
  },
  {
    "id": "lg",
    "name": "LG Electronics",
    "slug": "lg",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.lg.com/favicon.ico",
    "website": "https://www.lg.com/in",
    "officialPortalUrl": "https://www.lg.com/in/about-lg/careers",
    "headquarters": "Seoul, South Korea / Noida & Bengaluru, India",
    "description": "Global consumer electronics innovator driving webOS smart TVs, appliances, and vehicle component solutions.",
    "tags": [
      "Consumer Electronics",
      "webOS",
      "IoT",
      "Noida"
    ]
  },
  {
    "id": "lowes",
    "name": "Lowe's India",
    "slug": "lowes",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.lowes.co.in/favicon.ico",
    "website": "https://www.lowes.co.in",
    "officialPortalUrl": "https://www.lowes.co.in/careers/",
    "headquarters": "Mooresville, NC / Bengaluru, India",
    "description": "Fortune 50 home improvement retailer building omni-channel e-commerce and AI supply chain in Bengaluru.",
    "tags": [
      "RetailTech",
      "E-Commerce",
      "Supply Chain",
      "Bengaluru"
    ]
  },
  {
    "id": "ltimindtree",
    "name": "LTIMindtree",
    "slug": "ltimindtree",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.ltimindtree.com/favicon.ico",
    "website": "https://www.ltimindtree.com",
    "officialPortalUrl": "https://www.ltimindtree.com/careers/",
    "headquarters": "Mumbai & Bengaluru, India",
    "description": "Global technology consulting and digital solutions company formed by the merger of L&T Infotech and Mindtree.",
    "tags": [
      "IT Services",
      "Consulting",
      "Enterprise"
    ]
  },
  {
    "id": "makemytrip",
    "name": "MakeMyTrip",
    "slug": "makemytrip",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.makemytrip.com/favicon.ico",
    "website": "https://careers.makemytrip.com",
    "officialPortalUrl": "https://careers.makemytrip.com/",
    "headquarters": "Gurugram, India",
    "description": "India's pioneer online travel agency booking flights, hotels, trains, and experiential holiday packages.",
    "tags": [
      "TravelTech",
      "E-Commerce",
      "Public Tech"
    ]
  },
  {
    "id": "mastercard",
    "name": "Mastercard",
    "slug": "mastercard",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.mastercard.com/favicon.ico",
    "website": "https://careers.mastercard.com",
    "officialPortalUrl": "https://careers.mastercard.com/us/en",
    "headquarters": "Purchase, NY / Pune & Gurugram, India",
    "description": "Global payment processing network connecting consumers, banks, and merchants across 210 countries.",
    "tags": [
      "Payments",
      "Fintech",
      "Cybersecurity",
      "Pune"
    ]
  },
  {
    "id": "mckinsey",
    "name": "McKinsey & Company",
    "slug": "mckinsey",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.mckinsey.com/favicon.ico",
    "website": "https://www.mckinsey.com",
    "officialPortalUrl": "https://www.mckinsey.com/careers/home",
    "headquarters": "New York, NY / Gurugram, Mumbai & Bengaluru, India",
    "description": "Global management consulting firm and creator of QuantumBlack AI labs.",
    "tags": [
      "Management Consulting",
      "QuantumBlack",
      "AI",
      "Strategy"
    ]
  },
  {
    "id": "meesho",
    "name": "Meesho",
    "slug": "meesho",
    "provider": "lever",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.meesho.com/favicon.ico",
    "website": "https://www.meesho.com",
    "officialPortalUrl": "https://jobs.lever.co/meesho",
    "headquarters": "Bengaluru, India",
    "description": "India's fastest growing social e-commerce marketplace democratizing internet commerce for Bharat.",
    "tags": [
      "E-Commerce",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "meta",
    "name": "Meta (Facebook)",
    "slug": "meta",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.meta.com/favicon.ico",
    "website": "https://www.metacareers.com",
    "officialPortalUrl": "https://www.metacareers.com/locations/india/",
    "headquarters": "Menlo Park, CA / Gurugram & Hyderabad, India",
    "description": "Social technology pioneer connecting billions via Facebook, Instagram, WhatsApp, Meta Quest, and Llama AI.",
    "tags": [
      "Social Media",
      "AI",
      "Big Tech",
      "Metaverse"
    ]
  },
  {
    "id": "micron",
    "name": "Micron Technology",
    "slug": "micron",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.micron.com/favicon.ico",
    "website": "https://www.micron.com",
    "officialPortalUrl": "https://jobs.micron.com/",
    "headquarters": "Boise, ID / Hyderabad, Bengaluru & Sanand, India",
    "description": "Industry leader in memory (DRAM) and storage (NAND) semiconductor solutions investing billions in India.",
    "tags": [
      "Semiconductors",
      "DRAM",
      "Hardware",
      "Hyderabad"
    ]
  },
  {
    "id": "microsoft",
    "name": "Microsoft",
    "slug": "microsoft",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.microsoft.com/favicon.ico",
    "website": "https://careers.microsoft.com",
    "officialPortalUrl": "https://careers.microsoft.com/professionals/us/en/l-india",
    "headquarters": "Redmond, WA / Hyderabad, Bengaluru & Noida, India",
    "description": "Global technological titan behind Windows, Azure cloud, Office 365, Copilot AI, Surface, and Xbox.",
    "tags": [
      "Big Tech",
      "Cloud",
      "Azure",
      "AI"
    ]
  },
  {
    "id": "moengage",
    "name": "MoEngage",
    "slug": "moengage",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.moengage.com/favicon.ico",
    "website": "https://www.moengage.com",
    "officialPortalUrl": "https://www.moengage.com/careers/",
    "headquarters": "San Francisco, CA / Bengaluru, India",
    "description": "Insights-led customer engagement platform empowering consumer brands with personalized omnichannel campaigns.",
    "tags": [
      "MarTech",
      "SaaS",
      "Analytics",
      "Bengaluru"
    ]
  },
  {
    "id": "mongodb",
    "name": "MongoDB",
    "slug": "mongodb",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.mongodb.com/favicon.ico",
    "website": "https://www.mongodb.com",
    "officialPortalUrl": "https://boards.greenhouse.io/mongodb",
    "headquarters": "New York, NY / Bengaluru & Gurugram, India",
    "description": "Leading modern developer data platform built on document database architecture and vector search.",
    "tags": [
      "Database",
      "NoSQL",
      "Cloud",
      "Vector Search"
    ]
  },
  {
    "id": "morganstanley",
    "name": "Morgan Stanley",
    "slug": "morganstanley",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.morganstanley.com/favicon.ico",
    "website": "https://www.morganstanley.com",
    "officialPortalUrl": "https://www.morganstanley.com/about-us/careers",
    "headquarters": "New York, NY / Mumbai & Bengaluru, India",
    "description": "Global financial services firm providing investment banking, wealth management, and securities services.",
    "tags": [
      "Investment Banking",
      "Fintech",
      "Finance"
    ]
  },
  {
    "id": "morgan-stanley",
    "name": "Morgan Stanley",
    "slug": "morgan-stanley",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.morganstanley.com/favicon.ico",
    "website": "https://www.morganstanley.com",
    "officialPortalUrl": "https://www.morganstanley.com/about-us/careers",
    "headquarters": "New York, NY / Mumbai & Bengaluru, India",
    "description": "Premier global investment bank and wealth management leader building low-latency trading engines.",
    "tags": [
      "Investment Banking",
      "Fintech",
      "Algorithmic Trading",
      "Mumbai"
    ]
  },
  {
    "id": "motorola",
    "name": "Motorola Solutions",
    "slug": "motorola",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.motorolasolutions.com/favicon.ico",
    "website": "https://www.motorolasolutions.com",
    "officialPortalUrl": "https://motorolasolutions.wd5.myworkdayjobs.com/Careers",
    "headquarters": "Chicago, IL / Bengaluru & Kolkata, India",
    "description": "Global leader in mission-critical communications, video security, and command center software.",
    "tags": [
      "Telecom",
      "Public Safety",
      "Video Analytics"
    ]
  },
  {
    "id": "mphasis",
    "name": "Mphasis",
    "slug": "mphasis",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.mphasis.com/favicon.ico",
    "website": "https://www.mphasis.com",
    "officialPortalUrl": "https://careers.mphasis.com/",
    "headquarters": "Bengaluru, India",
    "description": "Global applied tech services provider specializing in cloud migration, cognitive solutions, and BFSI.",
    "tags": [
      "IT Services",
      "BFSI",
      "Cloud",
      "Bengaluru"
    ]
  },
  {
    "id": "myntra",
    "name": "Myntra",
    "slug": "myntra",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.myntra.com/favicon.ico",
    "website": "https://www.myntra.com",
    "officialPortalUrl": "https://careers.myntra.com/",
    "headquarters": "Bengaluru, India",
    "description": "India's leading fashion, beauty, and lifestyle e-commerce platform, a Flipkart Group company.",
    "tags": [
      "FashionTech",
      "E-Commerce",
      "Flipkart",
      "Bengaluru"
    ]
  },
  {
    "id": "natwest",
    "name": "NatWest Group",
    "slug": "natwest",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.natwestgroup.com/favicon.ico",
    "website": "https://jobs.natwestgroup.com",
    "officialPortalUrl": "https://jobs.natwestgroup.com/",
    "headquarters": "Edinburgh, UK / Gurugram, Bengaluru & Chennai",
    "description": "Major UK commercial and investment banking group with leading digital banking innovation labs in India.",
    "tags": [
      "Banking",
      "Fintech",
      "Gurugram",
      "Chennai"
    ]
  },
  {
    "id": "navi",
    "name": "Navi Technologies",
    "slug": "navi",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://navi.com/favicon.ico",
    "website": "https://navi.com",
    "officialPortalUrl": "https://navi.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Fast-growing digital financial services unicorn founded by Sachin Bansal, offering loans, UPI, and health insurance.",
    "tags": [
      "Fintech",
      "Lending",
      "UPI",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "netapp",
    "name": "NetApp",
    "slug": "netapp",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.netapp.com/favicon.ico",
    "website": "https://www.netapp.com",
    "officialPortalUrl": "https://careers.netapp.com/",
    "headquarters": "San Jose, CA / Bengaluru, India",
    "description": "Intelligent data infrastructure company combining unified data storage with cloud automation services.",
    "tags": [
      "Storage",
      "Cloud Data",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "netflix",
    "name": "Netflix",
    "slug": "netflix",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.netflix.com/favicon.ico",
    "website": "https://jobs.netflix.com",
    "officialPortalUrl": "https://jobs.netflix.com/",
    "headquarters": "Los Gatos, CA / Mumbai, India",
    "description": "World's leading subscription video streaming entertainment service with 260+ million paid members.",
    "tags": [
      "Streaming",
      "Distributed Systems",
      "Entertainment"
    ]
  },
  {
    "id": "nike",
    "name": "Nike Technology",
    "slug": "nike",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.nike.com/favicon.ico",
    "website": "https://jobs.nike.com",
    "officialPortalUrl": "https://jobs.nike.com/",
    "headquarters": "Beaverton, OR / Bengaluru, India",
    "description": "World leader in athletic footwear, apparel, and sport-tech innovation platforms.",
    "tags": [
      "RetailTech",
      "E-Commerce",
      "Bengaluru"
    ]
  },
  {
    "id": "nokia",
    "name": "Nokia",
    "slug": "nokia",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.nokia.com/favicon.ico",
    "website": "https://www.nokia.com",
    "officialPortalUrl": "https://www.nokia.com/about-us/careers/",
    "headquarters": "Espoo, Finland / Bengaluru, Noida & Chennai, India",
    "description": "B2B technology innovation leader in 5G mobile, optical networks, and cloud telecom infrastructure.",
    "tags": [
      "5G",
      "Telecom",
      "Cloud",
      "Noida"
    ]
  },
  {
    "id": "ntt-data",
    "name": "NTT Data",
    "slug": "ntt-data",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.nttdata.com/favicon.ico",
    "website": "https://www.nttdata.com",
    "officialPortalUrl": "https://careers.services.global.ntt/",
    "headquarters": "Tokyo, Japan / Bengaluru, Hyderabad & Noida, India",
    "description": "Top 10 global IT services provider delivering consulting, cloud computing, and systems integration.",
    "tags": [
      "IT Services",
      "Consulting",
      "Cloud",
      "Bengaluru"
    ]
  },
  {
    "id": "nutanix",
    "name": "Nutanix",
    "slug": "nutanix",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.nutanix.com/favicon.ico",
    "website": "https://www.nutanix.com",
    "officialPortalUrl": "https://www.nutanix.com/company/careers",
    "headquarters": "San Jose, CA / Bengaluru & Pune, India",
    "description": "Pioneer in hyperconverged infrastructure (HCI) and cloud software enabling unified hybrid multi-cloud operations.",
    "tags": [
      "HCI",
      "Cloud",
      "Virtualization",
      "Bengaluru"
    ]
  },
  {
    "id": "nvidia",
    "name": "NVIDIA",
    "slug": "nvidia",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.nvidia.com/favicon.ico",
    "website": "https://www.nvidia.com",
    "officialPortalUrl": "https://www.nvidia.com/en-us/about-nvidia/careers/",
    "headquarters": "Santa Clara, CA / Pune, Bengaluru & Hyderabad, India",
    "description": "The world leader in accelerated computing, GPU architecture, CUDA developer stack, and AI datacenters.",
    "tags": [
      "GPU",
      "AI",
      "Semiconductors",
      "Deep Learning"
    ]
  },
  {
    "id": "nykaa",
    "name": "Nykaa",
    "slug": "nykaa",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.nykaa.com/favicon.ico",
    "website": "https://www.nykaa.com",
    "officialPortalUrl": "https://www.nykaa.com/careers",
    "headquarters": "Mumbai & Gurugram, India",
    "description": "India's premier lifestyle and beauty e-commerce destination with omnichannel retail presence.",
    "tags": [
      "BeautyTech",
      "E-Commerce",
      "Public Tech",
      "Mumbai"
    ]
  },
  {
    "id": "okta",
    "name": "Okta",
    "slug": "okta",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.okta.com/favicon.ico",
    "website": "https://www.okta.com",
    "officialPortalUrl": "https://boards.greenhouse.io/okta",
    "headquarters": "San Francisco, CA / Bengaluru, India",
    "description": "The leading independent identity provider and zero-trust cloud security software platform.",
    "tags": [
      "Identity",
      "Cybersecurity",
      "Zero Trust",
      "Cloud"
    ]
  },
  {
    "id": "ola",
    "name": "Ola (ANI Technologies)",
    "slug": "ola",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.olacabs.com/favicon.ico",
    "website": "https://www.olacabs.com",
    "officialPortalUrl": "https://www.olacabs.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Pioneering Indian ride-hailing transportation platform, EV mobility, and battery gigafactory.",
    "tags": [
      "Mobility",
      "Ride-Hailing",
      "EV",
      "Unicorn"
    ]
  },
  {
    "id": "onecard",
    "name": "OneCard (FPL Technologies)",
    "slug": "onecard",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.getonecard.app/favicon.ico",
    "website": "https://www.getonecard.app",
    "officialPortalUrl": "https://www.getonecard.app/careers/",
    "headquarters": "Pune, India",
    "description": "India's mobile-first metal credit card fintech unicorn giving users complete app-based card control.",
    "tags": [
      "Fintech",
      "CreditCard",
      "Unicorn",
      "Pune"
    ]
  },
  {
    "id": "opentext",
    "name": "OpenText",
    "slug": "opentext",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.opentext.com/favicon.ico",
    "website": "https://www.opentext.com",
    "officialPortalUrl": "https://careers.opentext.com/",
    "headquarters": "Waterloo, Canada / Bengaluru & Hyderabad, India",
    "description": "The information company: world leader in Enterprise Information Management (EIM) and cloud software.",
    "tags": [
      "EIM",
      "Enterprise",
      "Cloud",
      "Hyderabad"
    ]
  },
  {
    "id": "optum",
    "name": "Optum (UnitedHealth Group)",
    "slug": "optum",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.optum.com/favicon.ico",
    "website": "https://careers.unitedhealthgroup.com",
    "officialPortalUrl": "https://careers.unitedhealthgroup.com/location/india-jobs/238/1269750/2",
    "headquarters": "Eden Prairie, MN / Gurugram, Hyderabad & Bengaluru",
    "description": "Information and technology-enabled health services business of Fortune 5 giant UnitedHealth Group.",
    "tags": [
      "HealthTech",
      "Healthcare",
      "Data Science",
      "Hyderabad"
    ]
  },
  {
    "id": "oracle",
    "name": "Oracle",
    "slug": "oracle",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.oracle.com/favicon.ico",
    "website": "https://www.oracle.com",
    "officialPortalUrl": "https://www.oracle.com/corporate/careers/",
    "headquarters": "Austin, TX / Bengaluru & Hyderabad, India",
    "description": "Global enterprise software and cloud infrastructure giant specializing in database systems and ERP.",
    "tags": [
      "Database",
      "Cloud",
      "ERP",
      "Enterprise"
    ]
  },
  {
    "id": "palantir",
    "name": "Palantir Technologies",
    "slug": "palantir",
    "provider": "lever",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.palantir.com/favicon.ico",
    "website": "https://www.palantir.com",
    "officialPortalUrl": "https://jobs.lever.co/palantir",
    "headquarters": "Denver, CO / Global",
    "description": "Developer of enterprise data fusion platforms (Gotham, Foundry, AIP) for mission-critical operations.",
    "tags": [
      "Big Data",
      "AI",
      "Enterprise",
      "Defense"
    ]
  },
  {
    "id": "palo-alto",
    "name": "Palo Alto Networks",
    "slug": "palo-alto",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.paloaltonetworks.com/favicon.ico",
    "website": "https://jobs.paloaltonetworks.com",
    "officialPortalUrl": "https://jobs.paloaltonetworks.com/",
    "headquarters": "Santa Clara, CA / Bengaluru, India",
    "description": "Global cybersecurity leader continually delivering AI-driven security across cloud, network, and endpoint.",
    "tags": [
      "Cybersecurity",
      "Network Security",
      "AI",
      "Cloud"
    ]
  },
  {
    "id": "paypal",
    "name": "PayPal",
    "slug": "paypal",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.paypal.com/favicon.ico",
    "website": "https://careers.pypl.com",
    "officialPortalUrl": "https://careers.pypl.com/home/",
    "headquarters": "San Jose, CA / Chennai & Bengaluru, India",
    "description": "Global digital payments pioneer supporting online money transfers across 200+ markets worldwide.",
    "tags": [
      "Fintech",
      "Payments",
      "Risk",
      "Chennai"
    ]
  },
  {
    "id": "paytm",
    "name": "Paytm (One97 Communications)",
    "slug": "paytm",
    "provider": "lever",
    "category": "Indian Startups & Unicorns",
    "logo": "https://paytm.com/favicon.ico",
    "website": "https://paytm.com",
    "officialPortalUrl": "https://jobs.lever.co/paytm",
    "headquarters": "Noida, India",
    "description": "India's pioneer digital payments, QR soundbox network, and financial services company.",
    "tags": [
      "Fintech",
      "Payments",
      "Noida",
      "Public Tech"
    ]
  },
  {
    "id": "persistent",
    "name": "Persistent Systems",
    "slug": "persistent",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.persistent.com/favicon.ico",
    "website": "https://www.persistent.com",
    "officialPortalUrl": "https://careers.persistent.com/",
    "headquarters": "Pune, India",
    "description": "Global digital engineering and enterprise modernization solutions leader with over 22,000 employees.",
    "tags": [
      "Digital Engineering",
      "Cloud",
      "Healthcare",
      "Pune"
    ]
  },
  {
    "id": "pharmeasy",
    "name": "PharmEasy",
    "slug": "pharmeasy",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://pharmeasy.in/favicon.ico",
    "website": "https://pharmeasy.in",
    "officialPortalUrl": "https://pharmeasy.in/careers",
    "headquarters": "Mumbai, India",
    "description": "Leading online consumer healthcare, medicine delivery, and diagnostic test booking platform in India.",
    "tags": [
      "HealthTech",
      "E-Commerce",
      "Pharma",
      "Mumbai"
    ]
  },
  {
    "id": "philips",
    "name": "Philips Innovation",
    "slug": "philips",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.philips.com/favicon.ico",
    "website": "https://careers.philips.com",
    "officialPortalUrl": "https://careers.philips.com/global/en",
    "headquarters": "Amsterdam, Netherlands / Bengaluru, India",
    "description": "Health technology leader improving people's health and enabling better outcomes across the health continuum.",
    "tags": [
      "HealthTech",
      "MedTech",
      "AI",
      "Bengaluru"
    ]
  },
  {
    "id": "phonepe",
    "name": "PhonePe",
    "slug": "phonepe",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.phonepe.com/favicon.ico",
    "website": "https://www.phonepe.com",
    "officialPortalUrl": "https://www.phonepe.com/careers/",
    "headquarters": "Bengaluru, India",
    "description": "India's #1 digital payments network processing billions of monthly transactions across UPI, insurance, and wealth.",
    "tags": [
      "UPI",
      "Fintech",
      "Payments",
      "Unicorn"
    ]
  },
  {
    "id": "physicswallah",
    "name": "PhysicsWallah (PW)",
    "slug": "physicswallah",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.pw.live/favicon.ico",
    "website": "https://www.pw.live",
    "officialPortalUrl": "https://www.pw.live/careers",
    "headquarters": "Noida, India",
    "description": "Leading affordable EdTech unicorn democratizing education for millions of students across Bharat.",
    "tags": [
      "EdTech",
      "Education",
      "Unicorn"
    ]
  },
  {
    "id": "pinelabs",
    "name": "Pine Labs",
    "slug": "pinelabs",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.pinelabs.com/favicon.ico",
    "website": "https://www.pinelabs.com",
    "officialPortalUrl": "https://www.pinelabs.com/careers",
    "headquarters": "Noida, India",
    "description": "Leading omnichannel merchant commerce, point-of-sale hardware, and payments platform.",
    "tags": [
      "Fintech",
      "POS",
      "Payments",
      "Unicorn"
    ]
  },
  {
    "id": "pinterest",
    "name": "Pinterest",
    "slug": "pinterest",
    "provider": "greenhouse",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.pinterest.com/favicon.ico",
    "website": "https://careers.pinterest.com",
    "officialPortalUrl": "https://careers.pinterest.com/",
    "headquarters": "San Francisco, CA / Remote",
    "description": "Visual discovery engine for finding ideas like recipes, home and style inspiration, and digital commerce.",
    "tags": [
      "Visual Search",
      "Machine Learning",
      "Social",
      "Remote"
    ]
  },
  {
    "id": "plum",
    "name": "Plum",
    "slug": "plum",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://www.plumhq.com/favicon.ico",
    "website": "https://www.plumhq.com",
    "officialPortalUrl": "https://www.plumhq.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Modern employee health insurance and wellness platform for forward-thinking organizations.",
    "tags": [
      "InsurTech",
      "B2B",
      "SaaS"
    ]
  },
  {
    "id": "pocketfm",
    "name": "Pocket FM",
    "slug": "pocketfm",
    "provider": "lever",
    "category": "Indian Startups & Unicorns",
    "logo": "https://pocketfm.com/favicon.ico",
    "website": "https://pocketfm.com",
    "officialPortalUrl": "https://jobs.lever.co/pocketfm",
    "headquarters": "Bengaluru, India",
    "description": "Audio entertainment and audio series platform pioneering bite-sized storytelling for millions worldwide.",
    "tags": [
      "AudioTech",
      "Entertainment",
      "Bengaluru"
    ]
  },
  {
    "id": "policybazaar",
    "name": "Policybazaar (PB Fintech)",
    "slug": "policybazaar",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.policybazaar.com/favicon.ico",
    "website": "https://www.policybazaar.com",
    "officialPortalUrl": "https://www.policybazaar.com/careers/",
    "headquarters": "Gurugram, India",
    "description": "India's largest online insurance aggregator and marketplace, a listed public fintech.",
    "tags": [
      "InsurTech",
      "Fintech",
      "Public Tech",
      "Gurugram"
    ]
  },
  {
    "id": "postman",
    "name": "Postman",
    "slug": "postman",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.postman.com/favicon.ico",
    "website": "https://www.postman.com",
    "officialPortalUrl": "https://www.postman.com/company/careers/",
    "headquarters": "San Francisco / Bengaluru, India",
    "description": "The world's leading API platform used by 30+ million developers to build, test, and document APIs.",
    "tags": [
      "API",
      "Developer Tools",
      "SaaS",
      "Unicorn"
    ]
  },
  {
    "id": "publicis-sapient",
    "name": "Publicis Sapient",
    "slug": "publicis-sapient",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.publicissapient.com/favicon.ico",
    "website": "https://www.publicissapient.com",
    "officialPortalUrl": "https://careers.publicissapient.com/",
    "headquarters": "Boston, MA / Gurugram & Bengaluru, India",
    "description": "Digital business transformation company connecting enterprise strategy, experience design, and engineering.",
    "tags": [
      "Digital Transformation",
      "Consulting",
      "Engineering"
    ]
  },
  {
    "id": "pure-storage",
    "name": "Pure Storage",
    "slug": "pure-storage",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.purestorage.com/favicon.ico",
    "website": "https://www.purestorage.com",
    "officialPortalUrl": "https://boards.greenhouse.io/purestorage",
    "headquarters": "Mountain View, CA / Bengaluru, India",
    "description": "Pioneer in all-flash enterprise data storage and cloud data management services.",
    "tags": [
      "Flash Storage",
      "Cloud",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "pwc",
    "name": "PwC (PricewaterhouseCoopers)",
    "slug": "pwc",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.pwc.in/favicon.ico",
    "website": "https://www.pwc.in",
    "officialPortalUrl": "https://www.pwc.in/careers.html",
    "headquarters": "London / Kolkata & Bengaluru, India",
    "description": "Global professional services network delivering assurance, tax, and technology advisory consulting.",
    "tags": [
      "Consulting",
      "Finance",
      "Advisory",
      "Big 4"
    ]
  },
  {
    "id": "qualcomm",
    "name": "Qualcomm",
    "slug": "qualcomm",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.qualcomm.com/favicon.ico",
    "website": "https://www.qualcomm.com",
    "officialPortalUrl": "https://www.qualcomm.com/company/careers",
    "headquarters": "San Diego, CA / Hyderabad & Bengaluru, India",
    "description": "World leader in wireless 5G communications, Snapdragon processors, and mobile chipsets.",
    "tags": [
      "Semiconductors",
      "5G",
      "Snapdragon",
      "Hardware"
    ]
  },
  {
    "id": "quantiphi",
    "name": "Quantiphi",
    "slug": "quantiphi",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://quantiphi.com/favicon.ico",
    "website": "https://quantiphi.com",
    "officialPortalUrl": "https://quantiphi.com/careers/",
    "headquarters": "Marlborough, MA / Mumbai & Bengaluru, India",
    "description": "Applied AI and big data software and services company solving complex business problems.",
    "tags": [
      "Applied AI",
      "GenAI",
      "Cloud",
      "Mumbai"
    ]
  },
  {
    "id": "quest-global",
    "name": "Quest Global",
    "slug": "quest-global",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.quest-global.com/favicon.ico",
    "website": "https://www.quest-global.com",
    "officialPortalUrl": "https://www.quest-global.com/careers/",
    "headquarters": "Singapore / Bengaluru & Thiruvananthapuram, India",
    "description": "Global product engineering services firm serving aerospace, medical, automotive, and energy.",
    "tags": [
      "Product Engineering",
      "Embedded",
      "Aerospace"
    ]
  },
  {
    "id": "quora",
    "name": "Quora",
    "slug": "quora",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.quora.com/favicon.ico",
    "website": "https://www.quora.com",
    "officialPortalUrl": "https://www.quora.com/careers",
    "headquarters": "Mountain View, CA / Remote-First",
    "description": "Knowledge sharing platform and creator of the Poe AI chatbot ecosystem.",
    "tags": [
      "Knowledge",
      "Poe AI",
      "Remote First"
    ]
  },
  {
    "id": "rakuten",
    "name": "Rakuten India",
    "slug": "rakuten",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.rakuten.com/favicon.ico",
    "website": "https://rakuten.co.in",
    "officialPortalUrl": "https://rakuten.co.in/careers/",
    "headquarters": "Tokyo, Japan / Bengaluru, India",
    "description": "Japanese electronic commerce and online fintech giant with major global engineering center in Bengaluru.",
    "tags": [
      "E-Commerce",
      "Fintech",
      "Telecom",
      "Bengaluru"
    ]
  },
  {
    "id": "rapido",
    "name": "Rapido",
    "slug": "rapido",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.rapido.bike/favicon.ico",
    "website": "https://www.rapido.bike",
    "officialPortalUrl": "https://www.rapido.bike/careers",
    "headquarters": "Bengaluru, India",
    "description": "India's largest bike-taxi and auto-rickshaw aggregator app delivering millions of rides daily.",
    "tags": [
      "Mobility",
      "RideHailing",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "razorpay",
    "name": "Razorpay",
    "slug": "razorpaysoftwareprivatelimited",
    "provider": "greenhouse",
    "category": "Indian Startups & Unicorns",
    "logo": "https://razorpay.com/favicon.ico",
    "website": "https://razorpay.com",
    "officialPortalUrl": "https://boards.greenhouse.io/razorpaysoftwareprivatelimited",
    "headquarters": "Bengaluru, India",
    "description": "Leading fintech unicorn providing payment gateway, neo-banking, and checkout infrastructure.",
    "tags": [
      "Fintech",
      "Payments",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "redbus",
    "name": "redBus (MakeMyTrip)",
    "slug": "redbus",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.redbus.in/favicon.ico",
    "website": "https://www.redbus.in",
    "officialPortalUrl": "https://www.redbus.in/careers",
    "headquarters": "Bengaluru, India",
    "description": "The world's largest online bus ticketing platform and pioneering inter-city mobility solution.",
    "tags": [
      "TravelTech",
      "Ticketing",
      "Bengaluru"
    ]
  },
  {
    "id": "reddit",
    "name": "Reddit",
    "slug": "reddit",
    "provider": "greenhouse",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.redditinc.com/favicon.ico",
    "website": "https://www.redditinc.com",
    "officialPortalUrl": "https://boards.greenhouse.io/reddit",
    "headquarters": "San Francisco, CA / Remote",
    "description": "The front page of the internet, home to thousands of dynamic communities and authentic discussions.",
    "tags": [
      "Social",
      "Community",
      "High Scale"
    ]
  },
  {
    "id": "reliance",
    "name": "Reliance Industries",
    "slug": "reliance",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.ril.com/favicon.ico",
    "website": "https://www.ril.com",
    "officialPortalUrl": "https://careers.ril.com/",
    "headquarters": "Mumbai, India",
    "description": "India's largest company by market cap spanning Jio telecommunications, Reliance Retail, and energy.",
    "tags": [
      "Conglomerate",
      "Jio",
      "Retail",
      "Mumbai"
    ]
  },
  {
    "id": "rivian",
    "name": "Rivian",
    "slug": "rivian",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://rivian.com/favicon.ico",
    "website": "https://rivian.com",
    "officialPortalUrl": "https://careers.rivian.com/",
    "headquarters": "Irvine, CA / India Hub",
    "description": "Electric adventure vehicle manufacturer designing high-performance trucks, SUVs, and delivery vans.",
    "tags": [
      "EV",
      "Automotive",
      "CleanTech",
      "Embedded"
    ]
  },
  {
    "id": "rubrik",
    "name": "Rubrik",
    "slug": "rubrik",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.rubrik.com/favicon.ico",
    "website": "https://www.rubrik.com",
    "officialPortalUrl": "https://boards.greenhouse.io/rubrik",
    "headquarters": "Palo Alto, CA / Bengaluru, India",
    "description": "Pioneering Zero Trust Data Security enterprise platform delivering ransomware recovery and cloud resilience.",
    "tags": [
      "Cybersecurity",
      "Cloud",
      "Zero Trust",
      "Public Tech"
    ]
  },
  {
    "id": "salesforce",
    "name": "Salesforce",
    "slug": "salesforce",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.salesforce.com/favicon.ico",
    "website": "https://careers.salesforce.com",
    "officialPortalUrl": "https://careers.salesforce.com/en/",
    "headquarters": "San Francisco, CA / Hyderabad & Bengaluru, India",
    "description": "The global CRM cloud giant empowering customer relationship management with Einstein AI.",
    "tags": [
      "CRM",
      "SaaS",
      "Enterprise",
      "Big Tech"
    ]
  },
  {
    "id": "samsung",
    "name": "Samsung R&D Institute India",
    "slug": "samsung",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.samsung.com/favicon.ico",
    "website": "https://www.samsung.com/in",
    "officialPortalUrl": "https://research.samsung.com/sri-b",
    "headquarters": "Seoul, South Korea / Bengaluru & Noida, India",
    "description": "Samsung's largest R&D facility outside Korea, pioneering mobile AI (Galaxy AI), 5G networks, and semiconductors.",
    "tags": [
      "Consumer Tech",
      "Galaxy AI",
      "5G",
      "Bengaluru"
    ]
  },
  {
    "id": "sap",
    "name": "SAP",
    "slug": "sap",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.sap.com/favicon.ico",
    "website": "https://jobs.sap.com",
    "officialPortalUrl": "https://jobs.sap.com/",
    "headquarters": "Walldorf, Germany / Bengaluru & Gurugram, India",
    "description": "Market leader in enterprise application software, supply chain ERP, and business AI solutions.",
    "tags": [
      "ERP",
      "Enterprise",
      "Cloud",
      "B2B"
    ]
  },
  {
    "id": "scaler",
    "name": "Scaler (InterviewBit)",
    "slug": "scaler",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.scaler.com/favicon.ico",
    "website": "https://www.scaler.com",
    "officialPortalUrl": "https://www.scaler.com/careers/",
    "headquarters": "Bengaluru, India",
    "description": "Transformative tech education and upskilling academy helping software engineers accelerate careers.",
    "tags": [
      "EdTech",
      "Tech Education",
      "Upskilling",
      "Bengaluru"
    ]
  },
  {
    "id": "shadowfax",
    "name": "Shadowfax",
    "slug": "shadowfax",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.shadowfax.in/favicon.ico",
    "website": "https://www.shadowfax.in",
    "officialPortalUrl": "https://www.shadowfax.in/careers",
    "headquarters": "Bengaluru, India",
    "description": "Leading tech-enabled on-demand logistics network for instant hyperlocal and e-commerce deliveries.",
    "tags": [
      "Logistics",
      "Hyperlocal",
      "GigEconomy",
      "Bengaluru"
    ]
  },
  {
    "id": "sharechat",
    "name": "ShareChat (Mohalla Tech)",
    "slug": "sharechat",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://sharechat.com/favicon.ico",
    "website": "https://sharechat.com",
    "officialPortalUrl": "https://careers.sharechat.com/",
    "headquarters": "Bengaluru, India",
    "description": "India's leading social media and short video platform (ShareChat & Moj) supporting 15 Indian languages.",
    "tags": [
      "Social Media",
      "Short Video",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "shiprocket",
    "name": "Shiprocket",
    "slug": "shiprocket",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.shiprocket.in/favicon.ico",
    "website": "https://www.shiprocket.in",
    "officialPortalUrl": "https://www.shiprocket.in/careers/",
    "headquarters": "New Delhi & Gurugram, India",
    "description": "Leading e-commerce shipping and enablement platform unicorn serving over 100,000 online merchants.",
    "tags": [
      "Logistics",
      "SaaS",
      "E-Commerce",
      "Unicorn"
    ]
  },
  {
    "id": "siemens",
    "name": "Siemens India",
    "slug": "siemens",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.siemens.com/favicon.ico",
    "website": "https://www.siemens.com",
    "officialPortalUrl": "https://jobs.siemens.com/",
    "headquarters": "Munich, Germany / Bengaluru, Mumbai & Pune, India",
    "description": "Global industrial engineering technology powerhouse focused on smart infrastructure and healthcare.",
    "tags": [
      "Industrial Automation",
      "Smart Grid",
      "IoT",
      "AI"
    ]
  },
  {
    "id": "signoz",
    "name": "SigNoz",
    "slug": "signoz",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://signoz.io/favicon.ico",
    "website": "https://signoz.io",
    "officialPortalUrl": "https://signoz.io/careers",
    "headquarters": "Bengaluru / Remote",
    "description": "Open-source APM and observability platform using OpenTelemetry and ClickHouse for metrics and traces.",
    "tags": [
      "Open Source",
      "Observability",
      "DevOps"
    ]
  },
  {
    "id": "slack",
    "name": "Slack (Salesforce)",
    "slug": "slack",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://slack.com/favicon.ico",
    "website": "https://slack.com",
    "officialPortalUrl": "https://slack.com/careers",
    "headquarters": "San Francisco, CA / Bengaluru, India",
    "description": "The AI-powered productivity platform that brings all your team conversations, apps, and workflows together.",
    "tags": [
      "Productivity",
      "Chat",
      "Collaboration",
      "Salesforce"
    ]
  },
  {
    "id": "slice",
    "name": "Slice",
    "slug": "slice",
    "provider": "greenhouse",
    "category": "Indian Startups & Unicorns",
    "logo": "https://sliceit.com/favicon.ico",
    "website": "https://sliceit.com",
    "officialPortalUrl": "https://boards.greenhouse.io/slice",
    "headquarters": "Bengaluru, India",
    "description": "Fast-growing consumer payments, credit line card, and unified banking network for young Indians.",
    "tags": [
      "Fintech",
      "Banking",
      "Payments",
      "Unicorn"
    ]
  },
  {
    "id": "snap",
    "name": "Snap Inc. (Snapchat)",
    "slug": "snap",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.snapchat.com/favicon.ico",
    "website": "https://careers.snap.com",
    "officialPortalUrl": "https://careers.snap.com/",
    "headquarters": "Santa Monica, CA / Mumbai & Bengaluru, India",
    "description": "Camera company revolutionizing augmented reality (AR), visual communication, and social media.",
    "tags": [
      "AR",
      "Augmented Reality",
      "Camera",
      "Social"
    ]
  },
  {
    "id": "sony",
    "name": "Sony India Software Centre",
    "slug": "sony",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.sony.com/favicon.ico",
    "website": "https://www.sony.com",
    "officialPortalUrl": "https://www.sony.co.in/careers",
    "headquarters": "Tokyo, Japan / Bengaluru, India",
    "description": "Global entertainment and sensor technology leader developing PlayStation, camera, and audio software.",
    "tags": [
      "Gaming",
      "Camera",
      "Sensors",
      "Bengaluru"
    ]
  },
  {
    "id": "spinny",
    "name": "Spinny",
    "slug": "spinny",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.spinny.com/favicon.ico",
    "website": "https://www.spinny.com",
    "officialPortalUrl": "https://www.spinny.com/careers/",
    "headquarters": "Gurugram, India",
    "description": "Used-car retail platform providing transparency, quality assurance, and digital financing.",
    "tags": [
      "AutoTech",
      "E-Commerce",
      "Unicorn",
      "Gurugram"
    ]
  },
  {
    "id": "spotify",
    "name": "Spotify",
    "slug": "spotify",
    "provider": "lever",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.spotify.com/favicon.ico",
    "website": "https://www.spotify.com",
    "officialPortalUrl": "https://jobs.lever.co/spotify",
    "headquarters": "Stockholm, Sweden / Mumbai, India",
    "description": "The world's most popular audio streaming subscription service with hundreds of millions of tracks.",
    "tags": [
      "Audio",
      "Streaming",
      "Consumer Tech"
    ]
  },
  {
    "id": "sprinklr",
    "name": "Sprinklr",
    "slug": "sprinklr",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.sprinklr.com/favicon.ico",
    "website": "https://www.sprinklr.com",
    "officialPortalUrl": "https://www.sprinklr.com/careers/",
    "headquarters": "New York, NY / Gurugram & Bengaluru, India",
    "description": "Unified Customer Experience Management (Unified-CXM) AI software platform for the modern enterprise.",
    "tags": [
      "MarTech",
      "CXM",
      "GenAI",
      "Gurugram"
    ]
  },
  {
    "id": "sprinto",
    "name": "Sprinto",
    "slug": "sprinto",
    "provider": "ai_search",
    "category": "Small Startups & Emerging Tech",
    "logo": "https://sprinto.com/favicon.ico",
    "website": "https://sprinto.com",
    "officialPortalUrl": "https://sprinto.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Automated information security compliance platform helping fast-growing SaaS companies get SOC 2 and ISO.",
    "tags": [
      "Cybersecurity",
      "Compliance",
      "SaaS"
    ]
  },
  {
    "id": "standard-chartered",
    "name": "Standard Chartered (SC Ventures)",
    "slug": "standard-chartered",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.sc.com/favicon.ico",
    "website": "https://www.sc.com",
    "officialPortalUrl": "https://www.sc.com/en/careers/",
    "headquarters": "London, UK / Chennai & Bengaluru, India",
    "description": "Leading international banking group with major Global Business Services technology centers in India.",
    "tags": [
      "Banking",
      "Fintech",
      "Capital Markets",
      "Chennai"
    ]
  },
  {
    "id": "standardchartered",
    "name": "Standard Chartered Bank",
    "slug": "standardchartered",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.sc.com/favicon.ico",
    "website": "https://www.sc.com",
    "officialPortalUrl": "https://www.sc.com/en/careers/",
    "headquarters": "London / Chennai & Bengaluru, India",
    "description": "Leading international banking group with extensive digital banking technology centers in India.",
    "tags": [
      "Banking",
      "Fintech",
      "Global"
    ]
  },
  {
    "id": "sbi",
    "name": "State Bank of India (SBI Digital)",
    "slug": "sbi",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.sbi.co.in/favicon.ico",
    "website": "https://www.sbi.co.in",
    "officialPortalUrl": "https://sbi.co.in/web/careers",
    "headquarters": "Mumbai, India",
    "description": "India's largest public bank operating YONO digital banking with hundreds of millions of users.",
    "tags": [
      "Banking",
      "YONO",
      "Public Sector",
      "Mumbai"
    ]
  },
  {
    "id": "stripe",
    "name": "Stripe",
    "slug": "stripe",
    "provider": "greenhouse",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://stripe.com/favicon.ico",
    "website": "https://stripe.com",
    "officialPortalUrl": "https://boards.greenhouse.io/stripe",
    "headquarters": "San Francisco, CA / Bengaluru / Remote",
    "description": "Financial infrastructure provider powering millions of internet businesses and payments worldwide.",
    "tags": [
      "Fintech",
      "Payments",
      "Developer Tools",
      "Big Tech"
    ]
  },
  {
    "id": "stripe-india",
    "name": "Stripe",
    "slug": "stripe",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://stripe.com/favicon.ico",
    "website": "https://stripe.com",
    "officialPortalUrl": "https://stripe.com/jobs",
    "headquarters": "San Francisco & Dublin / Bengaluru, India",
    "description": "Financial infrastructure platform building payment acceptance and global money movement for the internet.",
    "tags": [
      "Fintech",
      "Developer API",
      "Payments",
      "Remote"
    ]
  },
  {
    "id": "swiggy",
    "name": "Swiggy",
    "slug": "swiggy",
    "provider": "smartrecruiters",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.swiggy.com/favicon.ico",
    "website": "https://www.swiggy.com",
    "officialPortalUrl": "https://careers.swiggy.com",
    "headquarters": "Bengaluru, India",
    "description": "India's premier on-demand food delivery, Instamart quick-commerce, and logistics platform.",
    "tags": [
      "FoodTech",
      "QuickCommerce",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "synopsys",
    "name": "Synopsys",
    "slug": "synopsys",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.synopsys.com/favicon.ico",
    "website": "https://www.synopsys.com",
    "officialPortalUrl": "https://synopsys.wd1.myworkdayjobs.com/Synopsys_Careers",
    "headquarters": "Sunnyvale, CA / Bengaluru, Noida & Hyderabad, India",
    "description": "World leader in electronic design automation (EDA) software and semiconductor intellectual property.",
    "tags": [
      "EDA",
      "Semiconductors",
      "VLSI",
      "Silicon"
    ]
  },
  {
    "id": "target",
    "name": "Target India",
    "slug": "target",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.target.com/favicon.ico",
    "website": "https://india.target.com",
    "officialPortalUrl": "https://india.target.com/careers",
    "headquarters": "Minneapolis, MN / Bengaluru, India",
    "description": "Massive retail technology and data analytics innovation hub powering Target's stores and e-commerce.",
    "tags": [
      "RetailTech",
      "Supply Chain",
      "AI",
      "Bengaluru"
    ]
  },
  {
    "id": "tata-1mg",
    "name": "Tata 1mg",
    "slug": "tata-1mg",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.1mg.com/favicon.ico",
    "website": "https://www.1mg.com",
    "officialPortalUrl": "https://www.1mg.com/jobs",
    "headquarters": "Gurugram, India",
    "description": "India's leading digital healthcare platform for online medicines, lab tests, and doctor consultations.",
    "tags": [
      "HealthTech",
      "Tata",
      "E-Commerce",
      "Gurugram"
    ]
  },
  {
    "id": "tcs",
    "name": "Tata Consultancy Services (TCS)",
    "slug": "tcs",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.tcs.com/favicon.ico",
    "website": "https://www.tcs.com",
    "officialPortalUrl": "https://www.tcs.com/careers",
    "headquarters": "Mumbai, India",
    "description": "India's largest IT services and business solutions enterprise with 600,000+ engineers globally.",
    "tags": [
      "IT Services",
      "Consulting",
      "Enterprise",
      "Tata"
    ]
  },
  {
    "id": "tataelxsi",
    "name": "Tata Elxsi",
    "slug": "tataelxsi",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.tataelxsi.com/favicon.ico",
    "website": "https://www.tataelxsi.com",
    "officialPortalUrl": "https://www.tataelxsi.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Global design and technology services leader in automotive, healthcare, broadcast, and IoT.",
    "tags": [
      "Design",
      "Automotive",
      "IoT",
      "Tata"
    ]
  },
  {
    "id": "tata-motors",
    "name": "Tata Motors",
    "slug": "tata-motors",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.tatamotors.com/favicon.ico",
    "website": "https://www.tatamotors.com",
    "officialPortalUrl": "https://www.tatamotors.com/careers/",
    "headquarters": "Mumbai & Pune, India",
    "description": "Leading automotive manufacturer pioneering electric vehicle mobility and commercial transit in India.",
    "tags": [
      "Automotive",
      "EV",
      "CleanTech",
      "Pune"
    ]
  },
  {
    "id": "techmahindra",
    "name": "Tech Mahindra",
    "slug": "techmahindra",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.techmahindra.com/favicon.ico",
    "website": "https://www.techmahindra.com",
    "officialPortalUrl": "https://careers.techmahindra.com/",
    "headquarters": "Pune, India",
    "description": "Leading digital transformation, 5G engineering, consulting, and business re-engineering solutions company.",
    "tags": [
      "IT Services",
      "5G",
      "Telecom",
      "Consulting"
    ]
  },
  {
    "id": "teradata",
    "name": "Teradata",
    "slug": "teradata",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.teradata.com/favicon.ico",
    "website": "https://www.teradata.com",
    "officialPortalUrl": "https://careers.teradata.com/",
    "headquarters": "San Diego, CA / Hyderabad & Mumbai, India",
    "description": "Connected multi-cloud data analytics software platform for enterprise data warehouses.",
    "tags": [
      "Data Warehousing",
      "Analytics",
      "Cloud",
      "Hyderabad"
    ]
  },
  {
    "id": "tesco",
    "name": "Tesco Bengaluru",
    "slug": "tesco",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.tescobengaluru.com/favicon.ico",
    "website": "https://www.tescobengaluru.com",
    "officialPortalUrl": "https://www.tescobengaluru.com/careers/",
    "headquarters": "Welwyn Garden City, UK / Bengaluru, India",
    "description": "Technology and retail operations center for one of the world's largest grocery and merchandise retailers.",
    "tags": [
      "RetailTech",
      "Supply Chain",
      "Cloud",
      "Bengaluru"
    ]
  },
  {
    "id": "texas-instruments",
    "name": "Texas Instruments (TI)",
    "slug": "texas-instruments",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.ti.com/favicon.ico",
    "website": "https://careers.ti.com",
    "officialPortalUrl": "https://careers.ti.com/",
    "headquarters": "Dallas, TX / Bengaluru, India",
    "description": "Global semiconductor company designing analog and embedded processing chips, operating in Bengaluru since 1985.",
    "tags": [
      "Semiconductors",
      "Analog",
      "Embedded",
      "Bengaluru"
    ]
  },
  {
    "id": "tracxn",
    "name": "Tracxn",
    "slug": "tracxn",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://tracxn.com/favicon.ico",
    "website": "https://tracxn.com",
    "officialPortalUrl": "https://tracxn.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Market intelligence platform tracking startup investments, venture capital deals, and emerging sectors.",
    "tags": [
      "Fintech",
      "Market Intelligence",
      "SaaS",
      "Bengaluru"
    ]
  },
  {
    "id": "truecaller",
    "name": "Truecaller",
    "slug": "truecaller",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.truecaller.com/favicon.ico",
    "website": "https://careers.truecaller.com",
    "officialPortalUrl": "https://careers.truecaller.com/",
    "headquarters": "Stockholm, Sweden / Bengaluru & Gurugram, India",
    "description": "Global caller identification, spam blocking, and communications platform serving over 350 million active users.",
    "tags": [
      "Mobile",
      "Spam Protection",
      "High Scale",
      "Bengaluru"
    ]
  },
  {
    "id": "twilio",
    "name": "Twilio",
    "slug": "twilio",
    "provider": "greenhouse",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.twilio.com/favicon.ico",
    "website": "https://www.twilio.com",
    "officialPortalUrl": "https://boards.greenhouse.io/twilio",
    "headquarters": "San Francisco, CA / Bengaluru, India",
    "description": "Customer engagement and cloud communication platform enabling programmable SMS, voice, and video APIs.",
    "tags": [
      "APIs",
      "Communications",
      "Cloud",
      "SaaS"
    ]
  },
  {
    "id": "uber",
    "name": "Uber",
    "slug": "uber",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.uber.com/favicon.ico",
    "website": "https://www.uber.com",
    "officialPortalUrl": "https://www.uber.com/in/en/careers/",
    "headquarters": "San Francisco, CA / Hyderabad & Bengaluru, India",
    "description": "Global mobility technology giant moving millions via rides, Uber Eats delivery, and freight routing.",
    "tags": [
      "Mobility",
      "High Scale",
      "Distributed Systems"
    ]
  },
  {
    "id": "udaan",
    "name": "Udaan",
    "slug": "udaan",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://udaan.com/favicon.ico",
    "website": "https://udaan.com",
    "officialPortalUrl": "https://udaan.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "India's largest B2B e-commerce platform connecting manufacturers and brands with millions of retailers.",
    "tags": [
      "B2B",
      "Supply Chain",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "uipath",
    "name": "UiPath",
    "slug": "uipath",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.uipath.com/favicon.ico",
    "website": "https://www.uipath.com",
    "officialPortalUrl": "https://www.uipath.com/company/careers",
    "headquarters": "New York, NY / Bengaluru & Hyderabad, India",
    "description": "Global enterprise automation and AI-powered Robotic Process Automation (RPA) software pioneer.",
    "tags": [
      "RPA",
      "Automation",
      "AI",
      "Enterprise"
    ]
  },
  {
    "id": "unacademy",
    "name": "Unacademy",
    "slug": "unacademy",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://unacademy.com/favicon.ico",
    "website": "https://unacademy.com",
    "officialPortalUrl": "https://unacademy.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "India's largest online learning and competitive examination preparation educational network.",
    "tags": [
      "EdTech",
      "Education",
      "Bengaluru"
    ]
  },
  {
    "id": "unity",
    "name": "Unity Technologies",
    "slug": "unity",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://unity.com/favicon.ico",
    "website": "https://careers.unity.com",
    "officialPortalUrl": "https://careers.unity.com/",
    "headquarters": "San Francisco, CA / Bengaluru, India",
    "description": "The world's leading real-time 3D development platform powering over 50% of mobile, PC, and console games.",
    "tags": [
      "Game Engine",
      "3D",
      "C#",
      "AR/VR"
    ]
  },
  {
    "id": "upgrad",
    "name": "upGrad",
    "slug": "upgrad",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.upgrad.com/favicon.ico",
    "website": "https://www.upgrad.com",
    "officialPortalUrl": "https://www.upgrad.com/careers/",
    "headquarters": "Mumbai, India",
    "description": "South Asia's largest higher education and professional upskilling EdTech unicorn.",
    "tags": [
      "EdTech",
      "Higher Education",
      "Unicorn",
      "Mumbai"
    ]
  },
  {
    "id": "upstox",
    "name": "Upstox (RKSV)",
    "slug": "upstox",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://upstox.com/favicon.ico",
    "website": "https://upstox.com",
    "officialPortalUrl": "https://upstox.com/careers/",
    "headquarters": "Mumbai & Bengaluru, India",
    "description": "Fast-growing Indian discount stock broking and wealth investment platform unicorn backed by Ratan Tata.",
    "tags": [
      "Fintech",
      "Trading",
      "Unicorn",
      "Mumbai"
    ]
  },
  {
    "id": "urbancompany",
    "name": "Urban Company",
    "slug": "urbancompany",
    "provider": "greenhouse",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.urbancompany.com/favicon.ico",
    "website": "https://www.urbancompany.com",
    "officialPortalUrl": "https://www.urbancompany.com/careers",
    "headquarters": "Gurugram, India",
    "description": "Asia's largest home services marketplace offering beauty, appliance repairs, and cleaning at home.",
    "tags": [
      "GigEconomy",
      "Marketplace",
      "Unicorn"
    ]
  },
  {
    "id": "ust-global",
    "name": "UST (UST Global)",
    "slug": "ust-global",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.ust.com/favicon.ico",
    "website": "https://www.ust.com",
    "officialPortalUrl": "https://www.ust.com/en/careers",
    "headquarters": "Aliso Viejo, CA / Thiruvananthapuram, Bengaluru & Kochi",
    "description": "Leading digital transformation solutions provider with over 30,000 technologists in 30 countries.",
    "tags": [
      "IT Services",
      "Digital",
      "Kerala",
      "Bengaluru"
    ]
  },
  {
    "id": "vedantu",
    "name": "Vedantu",
    "slug": "vedantu",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.vedantu.com/favicon.ico",
    "website": "https://www.vedantu.com",
    "officialPortalUrl": "https://www.vedantu.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "Pioneering Indian live interactive online tutoring and K-12 EdTech platform unicorn.",
    "tags": [
      "EdTech",
      "Live Tutoring",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "veeam",
    "name": "Veeam Software",
    "slug": "veeam",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.veeam.com/favicon.ico",
    "website": "https://www.veeam.com",
    "officialPortalUrl": "https://careers.veeam.com/",
    "headquarters": "Kirkland, WA / Global Remote",
    "description": "#1 global leader in data resilience, backup, and hybrid cloud recovery solutions.",
    "tags": [
      "Data Backup",
      "Cloud",
      "Ransomware Recovery"
    ]
  },
  {
    "id": "virtusa",
    "name": "Virtusa",
    "slug": "virtusa",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.virtusa.com/favicon.ico",
    "website": "https://www.virtusa.com",
    "officialPortalUrl": "https://www.virtusa.com/careers",
    "headquarters": "Southborough, MA / Hyderabad, Chennai & Pune, India",
    "description": "Global provider of digital business strategy, digital engineering, and IT services.",
    "tags": [
      "IT Services",
      "Digital Engineering",
      "Hyderabad"
    ]
  },
  {
    "id": "visa",
    "name": "Visa",
    "slug": "visa",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.visa.co.in/favicon.ico",
    "website": "https://corporate.visa.com",
    "officialPortalUrl": "https://corporate.visa.com/en/careers.html",
    "headquarters": "Foster City, CA / Bengaluru & Mumbai, India",
    "description": "World leader in digital payments, processing hundreds of billions in financial transactions.",
    "tags": [
      "Payments",
      "Fintech",
      "Cybersecurity",
      "Bengaluru"
    ]
  },
  {
    "id": "vmware",
    "name": "VMware (Broadcom)",
    "slug": "vmware",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.vmware.com/favicon.ico",
    "website": "https://www.broadcom.com",
    "officialPortalUrl": "https://www.broadcom.com/company/careers",
    "headquarters": "Palo Alto, CA / Bengaluru, India",
    "description": "Pioneer in cloud virtualization, multi-cloud software, and software-defined datacenter architectures.",
    "tags": [
      "Virtualization",
      "Cloud",
      "Enterprise"
    ]
  },
  {
    "id": "vodafone-idea",
    "name": "Vodafone Idea (Vi)",
    "slug": "vodafone-idea",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.myvi.in/favicon.ico",
    "website": "https://www.myvi.in",
    "officialPortalUrl": "https://www.myvi.in/careers",
    "headquarters": "Mumbai & Gandhinagar, India",
    "description": "One of India's top telecom network operators delivering 4G/5G mobile voice and data services.",
    "tags": [
      "Telecom",
      "5G",
      "Mobile",
      "Mumbai"
    ]
  },
  {
    "id": "wazirx",
    "name": "WazirX",
    "slug": "wazirx",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://wazirx.com/favicon.ico",
    "website": "https://wazirx.com",
    "officialPortalUrl": "https://wazirx.com/careers",
    "headquarters": "Mumbai, India",
    "description": "India's prominent cryptocurrency and digital asset trading platform.",
    "tags": [
      "Crypto",
      "Web3",
      "Fintech",
      "Mumbai"
    ]
  },
  {
    "id": "wellsfargo",
    "name": "Wells Fargo",
    "slug": "wellsfargo",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.wellsfargo.com/favicon.ico",
    "website": "https://www.wellsfargo.com",
    "officialPortalUrl": "https://www.wellsfargo.com/about/careers/",
    "headquarters": "San Francisco, CA / Bengaluru & Hyderabad, India",
    "description": "Leading multinational financial services corporation with major technology and engineering hubs in India.",
    "tags": [
      "Banking",
      "Fintech",
      "Finance"
    ]
  },
  {
    "id": "wells-fargo",
    "name": "Wells Fargo India",
    "slug": "wells-fargo",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.wellsfargo.com/favicon.ico",
    "website": "https://www.wellsfargo.com",
    "officialPortalUrl": "https://www.wellsfargojobs.com/en/locations/india/",
    "headquarters": "San Francisco, CA / Bengaluru & Hyderabad, India",
    "description": "One of the Big Four banks in the United States with massive technology and analytics teams in India.",
    "tags": [
      "Banking",
      "Fintech",
      "Cybersecurity",
      "Hyderabad"
    ]
  },
  {
    "id": "western-digital",
    "name": "Western Digital",
    "slug": "western-digital",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.westerndigital.com/favicon.ico",
    "website": "https://careers.westerndigital.com",
    "officialPortalUrl": "https://careers.westerndigital.com/",
    "headquarters": "San Jose, CA / Bengaluru, India",
    "description": "Global data storage solutions provider (SanDisk, WD) enabling digital content creation and storage.",
    "tags": [
      "Storage",
      "Flash Memory",
      "Hardware",
      "Bengaluru"
    ]
  },
  {
    "id": "whatfix",
    "name": "Whatfix",
    "slug": "whatfix",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://whatfix.com/favicon.ico",
    "website": "https://whatfix.com",
    "officialPortalUrl": "https://whatfix.com/careers/",
    "headquarters": "San Jose, CA / Bengaluru, India",
    "description": "Digital Adoption Platform (DAP) empowering global enterprises to accelerate software adoption.",
    "tags": [
      "DAP",
      "SaaS",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "wipro",
    "name": "Wipro",
    "slug": "wipro",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.wipro.com/favicon.ico",
    "website": "https://careers.wipro.com",
    "officialPortalUrl": "https://careers.wipro.com/",
    "headquarters": "Bengaluru, India",
    "description": "Leading global information technology, consulting, and business process services company.",
    "tags": [
      "IT Services",
      "Consulting",
      "Enterprise",
      "Bengaluru"
    ]
  },
  {
    "id": "workday",
    "name": "Workday",
    "slug": "workday",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.workday.com/favicon.ico",
    "website": "https://www.workday.com",
    "officialPortalUrl": "https://www.workday.com/en-us/company/careers.html",
    "headquarters": "Pleasanton, CA / Pune & Bengaluru, India",
    "description": "Leading enterprise cloud software provider for financial management and human capital management (HCM).",
    "tags": [
      "HCM",
      "ERP",
      "Cloud",
      "Enterprise"
    ]
  },
  {
    "id": "xiaomi",
    "name": "Xiaomi India",
    "slug": "xiaomi",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.mi.com/favicon.ico",
    "website": "https://www.mi.com/in",
    "officialPortalUrl": "https://www.mi.com/in/careers/",
    "headquarters": "Beijing / Bengaluru, India",
    "description": "Consumer electronics and smart manufacturing company with smartphones and smart IoT hardware at its core.",
    "tags": [
      "Smartphones",
      "IoT",
      "Consumer Tech",
      "Bengaluru"
    ]
  },
  {
    "id": "xoriant",
    "name": "Xoriant",
    "slug": "xoriant",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.xoriant.com/favicon.ico",
    "website": "https://www.xoriant.com",
    "officialPortalUrl": "https://www.xoriant.com/careers",
    "headquarters": "Sunnyvale, CA / Pune & Mumbai, India",
    "description": "Digital engineering and technology services firm delivering high-reliability enterprise solutions.",
    "tags": [
      "Digital Engineering",
      "Cloud",
      "Pune",
      "Mumbai"
    ]
  },
  {
    "id": "xpressbees",
    "name": "Xpressbees",
    "slug": "xpressbees",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.xpressbees.com/favicon.ico",
    "website": "https://www.xpressbees.com",
    "officialPortalUrl": "https://www.xpressbees.com/careers",
    "headquarters": "Pune, India",
    "description": "Fastest-growing e-commerce logistics service provider unicorn in India.",
    "tags": [
      "Logistics",
      "SupplyChain",
      "Unicorn",
      "Pune"
    ]
  },
  {
    "id": "yahoo",
    "name": "Yahoo",
    "slug": "yahoo",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.yahoo.com/favicon.ico",
    "website": "https://www.yahooinc.com",
    "officialPortalUrl": "https://www.yahooinc.com/careers/",
    "headquarters": "Sunnyvale, CA / Bengaluru, India",
    "description": "Global media and tech brand operating Yahoo Finance, Sports, Mail, and ad tech platforms.",
    "tags": [
      "MediaTech",
      "AdTech",
      "High Scale",
      "Bengaluru"
    ]
  },
  {
    "id": "yatra",
    "name": "Yatra Online",
    "slug": "yatra",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.yatra.com/favicon.ico",
    "website": "https://www.yatra.com",
    "officialPortalUrl": "https://www.yatra.com/careers",
    "headquarters": "Gurugram, India",
    "description": "Leading corporate and leisure travel services provider and online travel agency in India.",
    "tags": [
      "TravelTech",
      "E-Commerce",
      "Public Tech",
      "Gurugram"
    ]
  },
  {
    "id": "yellow-ai",
    "name": "Yellow.ai",
    "slug": "yellow-ai",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://yellow.ai/favicon.ico",
    "website": "https://yellow.ai",
    "officialPortalUrl": "https://yellow.ai/careers/",
    "headquarters": "San Mateo, CA / Bengaluru, India",
    "description": "Enterprise conversational AI platform automating customer service across voice and chat.",
    "tags": [
      "Conversational AI",
      "GenAI",
      "SaaS",
      "Bengaluru"
    ]
  },
  {
    "id": "yulu",
    "name": "Yulu",
    "slug": "yulu",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.yulu.bike/favicon.ico",
    "website": "https://www.yulu.bike",
    "officialPortalUrl": "https://www.yulu.bike/careers/",
    "headquarters": "Bengaluru, India",
    "description": "India's largest shared electric micro-mobility platform for sustainable first and last mile transit.",
    "tags": [
      "EV",
      "MicroMobility",
      "CleanTech",
      "Bengaluru"
    ]
  },
  {
    "id": "zendesk",
    "name": "Zendesk",
    "slug": "zendesk",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://www.zendesk.com/favicon.ico",
    "website": "https://www.zendesk.com",
    "officialPortalUrl": "https://www.zendesk.com/careers/",
    "headquarters": "San Francisco, CA / Bengaluru, India",
    "description": "Customer service and CRM software platform helping businesses build deep customer relationships.",
    "tags": [
      "Customer Service",
      "CRM",
      "SaaS"
    ]
  },
  {
    "id": "zensar",
    "name": "Zensar Technologies",
    "slug": "zensar",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.zensar.com/favicon.ico",
    "website": "https://www.zensar.com",
    "officialPortalUrl": "https://www.zensar.com/careers/",
    "headquarters": "Pune, India",
    "description": "Technology consulting and services enterprise, an RPG Group company with global presence.",
    "tags": [
      "IT Services",
      "Digital",
      "RPG Group",
      "Pune"
    ]
  },
  {
    "id": "zepto",
    "name": "Zepto",
    "slug": "zepto",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.zeptonow.com/favicon.ico",
    "website": "https://www.zeptonow.com",
    "officialPortalUrl": "https://www.zeptonow.com/careers",
    "headquarters": "Mumbai, India",
    "description": "India's fastest growing 10-minute quick commerce grocery and essential delivery unicorn.",
    "tags": [
      "QuickCommerce",
      "Hyperlocal",
      "Unicorn"
    ]
  },
  {
    "id": "zerodha",
    "name": "Zerodha",
    "slug": "zerodha",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://zerodha.com/favicon.ico",
    "website": "https://zerodha.com",
    "officialPortalUrl": "https://zerodha.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "India's largest bootstrapped stockbroker and financial technology platform, creators of Kite and Coin.",
    "tags": [
      "Fintech",
      "Bootstrapped",
      "Trading",
      "Bengaluru"
    ]
  },
  {
    "id": "zeta",
    "name": "Zeta",
    "slug": "zeta",
    "provider": "lever",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.zeta.tech/favicon.ico",
    "website": "https://www.zeta.tech",
    "officialPortalUrl": "https://jobs.lever.co/zeta",
    "headquarters": "Bengaluru, India",
    "description": "Next-generation cloud-native core banking and fintech platform for global financial institutions.",
    "tags": [
      "BankingTech",
      "Cloud",
      "Unicorn",
      "Bengaluru"
    ]
  },
  {
    "id": "zoho",
    "name": "Zoho",
    "slug": "zoho",
    "provider": "ai_search",
    "category": "IT Services & Tech Leaders",
    "logo": "https://www.zoho.com/favicon.ico",
    "website": "https://www.zoho.com",
    "officialPortalUrl": "https://www.zoho.com/careers/",
    "headquarters": "Chennai & Tenkasi, India",
    "description": "World leader in bootstrapped cloud business applications, CRM, mail, and productivity software.",
    "tags": [
      "SaaS",
      "Bootstrapped",
      "CRM",
      "Chennai"
    ]
  },
  {
    "id": "zomato",
    "name": "Zomato",
    "slug": "zomato",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.zomato.com/favicon.ico",
    "website": "https://www.zomato.com",
    "officialPortalUrl": "https://www.zomato.com/careers",
    "headquarters": "Gurugram, India",
    "description": "India's leading restaurant discovery, online food ordering, and dining-out technology network.",
    "tags": [
      "FoodTech",
      "Public Tech",
      "Gurugram"
    ]
  },
  {
    "id": "zoom",
    "name": "Zoom Video Communications",
    "slug": "zoom",
    "provider": "ai_search",
    "category": "Global Tech Giants & MNCs",
    "logo": "https://zoom.us/favicon.ico",
    "website": "https://zoom.us",
    "officialPortalUrl": "https://careers.zoom.us/",
    "headquarters": "San Jose, CA / Bengaluru & Mumbai, India",
    "description": "Frictionless video communications and AI-powered collaboration workplace platform.",
    "tags": [
      "Video",
      "Unified Communications",
      "AI"
    ]
  },
  {
    "id": "zoomcar",
    "name": "Zoomcar",
    "slug": "zoomcar",
    "provider": "ai_search",
    "category": "Indian Startups & Unicorns",
    "logo": "https://www.zoomcar.com/favicon.ico",
    "website": "https://www.zoomcar.com",
    "officialPortalUrl": "https://www.zoomcar.com/careers",
    "headquarters": "Bengaluru, India",
    "description": "India's premier marketplace for car sharing and peer-to-peer self-drive vehicle rentals.",
    "tags": [
      "CarSharing",
      "Marketplace",
      "Public Tech",
      "Bengaluru"
    ]
  },
  {
    "id": "zs-associates",
    "name": "ZS Associates",
    "slug": "zs-associates",
    "provider": "ai_search",
    "category": "Consulting & Financial Services",
    "logo": "https://www.zs.com/favicon.ico",
    "website": "https://www.zs.com",
    "officialPortalUrl": "https://www.zs.com/careers",
    "headquarters": "Evanston, IL / Pune, Gurugram & Bengaluru, India",
    "description": "Management consulting and technology firm focused on transforming global healthcare and commercial strategy.",
    "tags": [
      "Management Consulting",
      "Healthcare",
      "Analytics",
      "Pune"
    ]
  },
  {
    "id": "zscaler",
    "name": "Zscaler",
    "slug": "zscaler",
    "provider": "ai_search",
    "category": "AI, Cloud & Data Infrastructure",
    "logo": "https://www.zscaler.com/favicon.ico",
    "website": "https://www.zscaler.com",
    "officialPortalUrl": "https://www.zscaler.com/careers",
    "headquarters": "San Jose, CA / Bengaluru, Pune & Chandigarh, India",
    "description": "Pioneer in Zero Trust cloud security and secure access service edge (SASE).",
    "tags": [
      "Zero Trust",
      "Cybersecurity",
      "SASE",
      "Cloud"
    ]
  }
];

export function findCompanyByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const normalized = idOrSlug.trim().toLowerCase();
  return (
    COMPANIES_REGISTRY.find(
      (c) =>
        c.id.toLowerCase() === normalized ||
        c.slug.toLowerCase() === normalized ||
        c.name.toLowerCase() === normalized ||
        c.name.toLowerCase().includes(normalized)
    ) || null
  );
}
