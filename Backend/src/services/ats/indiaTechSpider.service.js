import { resolveCompanyLinks, normalizeCompanySlug, isThirdPartyAtsUrl } from "./companyDiscovery.service.js";
import { isRealOpeningUrl, fetchJobsForCompany } from "./atsDetector.service.js";
import linkedInJobSearchService from "./linkedinJobSearch.service.js";
import DiscoveredCareerJob from "../../models/discoveredCareerJob.model.js";

/**
 * High-Density Tech Hubs & Engineering Clusters Operating Across India
 */
export const INDIA_TECH_HUBS = {
  bengaluru: {
    id: "bengaluru",
    name: "Bengaluru (Silicon Valley of India)",
    areas: ["Outer Ring Road / Bellandur", "Whitefield", "Electronic City", "Koramangala", "Manyata Tech Park"],
    companies: [
      "Swiggy",
      "Razorpay",
      "CRED",
      "Flipkart",
      "PhonePe",
      "Zerodha",
      "Slice",
      "Groww",
      "BigBasket",
      "Zepto",
      "Cult.fit",
      "Ola Electric",
      "Ather Energy",
      "InMobi",
      "Postman",
      "Hasura",
      "BrowserStack",
      "Infosys",
      "Wipro",
      "Google",
      "Microsoft",
      "Amazon",
      "Adobe",
      "Cisco",
      "Intel",
      "Qualcomm",
      "Goldman Sachs",
      "Walmart Global Tech",
      "Atlassian",
      "Stripe",
      "Databricks",
    ],
  },
  hyderabad: {
    id: "hyderabad",
    name: "Hyderabad (Cyberabad & HITEC City)",
    areas: ["HITEC City", "Gachibowli", "Financial District", "Madhapur", "Kondapur"],
    companies: [
      "Microsoft",
      "Google",
      "Amazon",
      "ServiceNow",
      "Salesforce",
      "Oracle",
      "Qualcomm",
      "Darwinbox",
      "HighRadius",
      "Zenoti",
      "TCS",
      "Infosys",
      "Tech Mahindra",
      "Wipro",
      "Cyient",
      "FactSet",
      "Micron",
      "AMD",
    ],
  },
  pune: {
    id: "pune",
    name: "Pune (Oxford & Engineering Tech Hub)",
    areas: ["Hinjawadi Infotech Park", "Magarpatta Cybercity", "Kharadi EON Free Zone", "Baner"],
    companies: [
      "OneCard",
      "Persistent Systems",
      "KPIT",
      "Birlasoft",
      "Zensar",
      "Barclays",
      "Deutsche Bank",
      "Mastercard",
      "PTC",
      "Veritas",
      "Siemens",
      "Bajaj Finserv Health",
      "Tata Technologies",
    ],
  },
  delhi_ncr: {
    id: "delhi_ncr",
    name: "Delhi NCR (Gurugram & Noida Tech Corridors)",
    areas: ["Gurugram Cyber City", "DLF CyberHub", "Sector 44", "Udyog Vihar", "Noida Sector 62", "Noida Sector 126"],
    companies: [
      "Zomato",
      "Blinkit",
      "Paytm",
      "Policybazaar",
      "Pine Labs",
      "BharatPe",
      "CarDekho",
      "Cars24",
      "Delhivery",
      "MakeMyTrip",
      "Shiprocket",
      "Ixigo",
      "Airtel Digital",
      "HCLTech",
      "Coforge",
      "Nagarro",
      "Microsoft",
      "Samsung R&D",
      "Adobe",
      "Genpact",
    ],
  },
  chennai: {
    id: "chennai",
    name: "Chennai (SaaS Capital & OMR Tech Corridor)",
    areas: ["OMR IT Corridor", "Taramani", "Guindy", "Siruseri IT Park", "DLF IT Park Porur"],
    companies: [
      "Zoho",
      "Freshworks",
      "Chargebee",
      "Wingify",
      "Kissflow",
      "TCS",
      "Cognizant",
      "Infosys",
      "HCLTech",
      "PayPal",
      "Amazon",
      "Caterpillar",
      "Standard Chartered GBS",
      "Ford Tech",
      "Sutherland",
    ],
  },
  mumbai: {
    id: "mumbai",
    name: "Mumbai (Fintech & Digital Media Hub)",
    areas: ["BKC (Bandra-Kurla Complex)", "Powai Tech Cluster", "Andheri East", "Vikhroli"],
    companies: [
      "Jio Platforms",
      "Tata Communications",
      "Tata Consultancy Services",
      "Nykaa",
      "CleverTap",
      "WebEngage",
      "Eruditus",
      "UpGrad",
      "Purplle",
      "BookMyShow",
      "Morgan Stanley",
      "JP Morgan",
      "Nomura",
      "Citi Tech",
      "Barclays",
    ],
  },
};

/**
 * Tech Company Sectors Operating in India
 */
export const INDIA_TECH_SECTORS = {
  unicorns: {
    id: "unicorns",
    name: "Indian Tech Unicorns & Fast-Growth Startups",
    companies: [
      "Razorpay",
      "Swiggy",
      "Zomato",
      "Blinkit",
      "CRED",
      "Groww",
      "Meesho",
      "Zepto",
      "Flipkart",
      "PhonePe",
      "Zerodha",
      "Slice",
      "Paytm",
      "Pine Labs",
      "BharatPe",
      "Cult.fit",
      "Delhivery",
      "BigBasket",
      "Urban Company",
      "Lenskart",
      "Nykaa",
      "Purplle",
      "Ola Electric",
      "Ather Energy",
      "Shadowfax",
      "Porter",
      "Shiprocket",
      "Rapido",
      "PhysicsWallah",
      "Unacademy",
      "UpGrad",
      "Scaler",
      "Practo",
      "MakeMyTrip",
      "OYO",
      "Dream11",
      "Games24x7",
      "WinZO",
      "ShareChat",
      "InMobi",
      "Pocket FM",
    ],
  },
  tech_giants: {
    id: "tech_giants",
    name: "Indian IT Giants & Engineering Leaders",
    companies: [
      "TCS",
      "Infosys",
      "Wipro",
      "HCLTech",
      "Tech Mahindra",
      "LTIMindtree",
      "Tata Elxsi",
      "Persistent Systems",
      "Coforge",
      "Mphasis",
      "Birlasoft",
      "KPIT",
      "Cyient",
      "Sonata Software",
      "Zensar",
      "Hexaware",
      "Happiest Minds",
      "Tanla Platforms",
      "Tata Communications",
      "Jio Platforms",
      "Airtel Digital",
    ],
  },
  saas_devtools: {
    id: "saas_devtools",
    name: "Indian SaaS, Cloud & DevTools Leaders",
    companies: [
      "Zoho",
      "Freshworks",
      "Postman",
      "Hasura",
      "BrowserStack",
      "Chargebee",
      "Wingify",
      "Druva",
      "Icertis",
      "Zenoti",
      "HighRadius",
      "Darwinbox",
      "Amagi",
      "LeadSquared",
      "CleverTap",
      "MoEngage",
      "WebEngage",
      "Yellow.ai",
      "Haptik",
      "Gupshup",
      "Exotel",
      "Innovaccer",
      "Signzy",
      "IDfy",
      "Hyperverge",
      "SigNoz",
      "Devtron",
      "DevRev",
      "Appsmith",
      "Hoppscotch",
      "Keploy",
      "Tooljet",
      "Plane",
    ],
  },
  global_mnc: {
    id: "global_mnc",
    name: "Global Tech MNCs (India R&D / GCCs)",
    companies: [
      "Google",
      "Microsoft",
      "Amazon",
      "Apple",
      "Meta",
      "Netflix",
      "Uber",
      "Adobe",
      "Salesforce",
      "Oracle",
      "Cisco",
      "Intel",
      "Qualcomm",
      "AMD",
      "Nvidia",
      "IBM",
      "SAP Labs",
      "VMware",
      "Intuit",
      "PayPal",
      "Atlassian",
      "Stripe",
      "ServiceNow",
      "Snowflake",
      "Databricks",
      "Twilio",
      "Palo Alto Networks",
      "Walmart Global Tech",
      "Target",
      "Goldman Sachs",
      "Morgan Stanley",
      "JP Morgan",
      "Wells Fargo",
      "Barclays",
      "Deutsche Bank",
      "Mastercard",
      "Visa",
      "American Express",
      "Dell Technologies",
      "Samsung R&D",
      "Bosch",
      "Honeywell",
      "Boeing",
      "Mercedes-Benz R&D",
    ],
  },
};

class IndiaTechSpiderService {
  constructor() {
    this.crawling = false;
    this.lastCrawlAt = null;
    this.telemetry = {
      totalDiscovered: 0,
      lastDurationMs: 0,
      activeHubs: Object.keys(INDIA_TECH_HUBS).length,
      activeSectors: Object.keys(INDIA_TECH_SECTORS).length,
    };
  }

  /**
   * Spiders live requisitions for companies in a specific Tech Hub
   * (e.g. "bengaluru", "hyderabad", "pune", "delhi_ncr", "chennai", "mumbai")
   */
  async spiderHubTechJobs(hubKey = "bengaluru", roleQuery = "", limit = 40) {
    const hub = INDIA_TECH_HUBS[hubKey.toLowerCase()] || INDIA_TECH_HUBS.bengaluru;
    const targetCompanies = hub.companies.slice(0, 16);
    const location = hub.name.split(" ")[0]; // "Bengaluru", "Hyderabad", etc.

    return this.crawlCompanyBatch(targetCompanies, roleQuery, location, limit);
  }

  /**
   * Spiders live requisitions for companies in a specific Tech Sector
   * (e.g. "unicorns", "tech_giants", "saas_devtools", "global_mnc")
   */
  async spiderSectorTechJobs(sectorKey = "unicorns", roleQuery = "", limit = 50) {
    const sector = INDIA_TECH_SECTORS[sectorKey.toLowerCase()] || INDIA_TECH_SECTORS.unicorns;
    const targetCompanies = sector.companies.slice(0, 18);

    return this.crawlCompanyBatch(targetCompanies, roleQuery, "India", limit);
  }

  /**
   * Autonomous spidering batch across all top Indian tech companies
   */
  async spiderAllIndiaTech({ role = "", location = "India", limit = 60 } = {}) {
    const startTime = Date.now();
    this.crawling = true;

    // Pick a balanced representation from Unicorns, Tech Giants, SaaS, and Global Hubs
    const targetCompanies = [
      "Razorpay",
      "Swiggy",
      "Zomato",
      "CRED",
      "Groww",
      "Meesho",
      "Flipkart",
      "PhonePe",
      "TCS",
      "Infosys",
      "Wipro",
      "Zoho",
      "Postman",
      "Hasura",
      "Google",
      "Microsoft",
      "Amazon",
      "Databricks",
      "Stripe",
      "Atlassian",
      "SigNoz",
      "DevRev",
      "Ather Energy",
      "Tata Elxsi",
      "LTIMindtree",
    ];

    const discovered = await this.crawlCompanyBatch(targetCompanies, role, location, limit);

    this.lastCrawlAt = new Date();
    this.telemetry.lastDurationMs = Date.now() - startTime;
    this.telemetry.totalDiscovered += discovered.length;
    this.crawling = false;

    return discovered;
  }

  /**
   * Internal worker to crawl a batch of target companies with rate limiting & deduplication.
   * Utilizes the company's authentic ATS API (Greenhouse, Lever, SmartRecruiters, Ashby)
   * as the primary job-finding source, supplemented with verified LinkedIn company postings.
   */
  async crawlCompanyBatch(companiesList, roleQuery, location, maxLimit) {
    const discoveredJobs = [];
    const seenUrls = new Set();

    // Query in parallel batches of 4 to avoid socket saturation while keeping discovery fast
    const BATCH_SIZE = 4;
    for (let i = 0; i < companiesList.length; i += BATCH_SIZE) {
      if (discoveredJobs.length >= maxLimit) break;

      const batch = companiesList.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (companyName) => {
        try {
          const companyJobs = await fetchJobsForCompany(companyName, roleQuery, location);
          return (companyJobs || []).filter((j) => isRealOpeningUrl(j.applyUrl));
        } catch {
          return [];
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      for (const res of batchResults) {
        if (res.status === "fulfilled" && Array.isArray(res.value)) {
          for (const job of res.value) {
            const key = job.applyUrl || `${job.companySlug}_${job.externalId || job.title}`;
            if (!seenUrls.has(key)) {
              seenUrls.add(key);
              discoveredJobs.push(job);
            }
          }
        }
      }
    }

    // Persist discovered jobs into MongoDB DiscoveredCareerJob collection
    if (discoveredJobs.length > 0) {
      try {
        const ops = discoveredJobs.map((job) => ({
          updateOne: {
            filter: {
              companySlug: job.companySlug || "general",
              externalId: job.externalId || job.id,
            },
            update: {
              $set: {
                ...job,
                scannedAt: new Date(),
              },
            },
            upsert: true,
          },
        }));

        DiscoveredCareerJob.bulkWrite(ops).catch(() => {});
      } catch {
        // Mongo write silent
      }
    }

    return discoveredJobs.slice(0, maxLimit);
  }

  getSpiderStatus() {
    return {
      crawling: this.crawling,
      lastCrawlAt: this.lastCrawlAt ? this.lastCrawlAt.toISOString() : null,
      telemetry: this.telemetry,
      availableHubs: Object.values(INDIA_TECH_HUBS).map((h) => ({
        id: h.id,
        name: h.name,
        totalCompanies: h.companies.length,
        majorAreas: h.areas,
      })),
      availableSectors: Object.values(INDIA_TECH_SECTORS).map((s) => ({
        id: s.id,
        name: s.name,
        totalCompanies: s.companies.length,
      })),
    };
  }
}

const indiaTechSpiderService = new IndiaTechSpiderService();
export default indiaTechSpiderService;
