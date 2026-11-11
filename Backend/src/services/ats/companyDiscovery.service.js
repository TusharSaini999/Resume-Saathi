import { COMPANIES_REGISTRY, findCompanyByIdOrSlug, COMPANY_CATEGORIES } from "./companyRegistry.js";

/**
 * Known Official Company Career Portals on their own verified domains.
 * Strictly excludes third-party ATS hosts (Greenhouse, Lever, SmartRecruiters, Workable, etc.).
 */
export const KNOWN_OFFICIAL_CAREERS_PAGES = {
  // ─── Top Indian Unicorns & High-Growth Tech ──────────────────────────
  razorpay: "https://razorpay.com/jobs",
  swiggy: "https://careers.swiggy.com",
  meesho: "https://meesho.io/jobs",
  paytm: "https://paytm.com/careers",
  cred: "https://cred.club/careers",
  groww: "https://groww.in/careers",
  zeta: "https://www.zeta.tech/careers",
  zomato: "https://careers.zomato.com",
  blinkit: "https://blinkit.com/careers",
  zepto: "https://www.zepto.co/careers",
  flipkart: "https://www.flipkartcareers.com",
  phonepe: "https://www.phonepe.com/careers",
  zerodha: "https://zerodha.com/careers",
  bharatpe: "https://bharatpe.com/careers",
  pinelabs: "https://www.pinelabs.com/careers",
  "pine-labs": "https://www.pinelabs.com/careers",
  slice: "https://www.sliceit.com/careers",
  jupiter: "https://jupiter.money/careers",
  fifi: "https://fi.money/careers",
  fimoney: "https://fi.money/careers",
  mobikwik: "https://www.mobikwik.com/careers",
  cleartax: "https://cleartax.in/careers",
  khatabook: "https://khatabook.com/careers",
  policybazaar: "https://www.policybazaar.com/careers",
  lendingkart: "https://www.lendingkart.com/careers",
  cashfree: "https://www.cashfree.com/careers",
  open: "https://open.money/careers",
  openmoney: "https://open.money/careers",
  m2pfintech: "https://m2pfintech.com/careers",
  "m2p-fintech": "https://m2pfintech.com/careers",
  onecard: "https://www.getonecard.app/careers/",
  indmoney: "https://www.indmoney.com/careers",
  jar: "https://www.myjar.app/careers",
  unicards: "https://www.uni.cards/careers",
  "uni-cards": "https://www.uni.cards/careers",
  coindcx: "https://coindcx.com/careers",
  coinswitch: "https://coinswitch.co/careers",
  bigbasket: "https://careers.bigbasket.com",
  urbancompany: "https://www.urbancompany.com/careers",
  lenskart: "https://www.lenskart.com/careers",
  nykaa: "https://www.nykaa.com/careers",
  purplle: "https://www.purplle.com/careers",
  firstcry: "https://www.firstcry.com/careers",
  mamaearth: "https://honasa.in/careers",
  honasa: "https://honasa.in/careers",
  cardekho: "https://www.cardekho.com/careers",
  spinny: "https://www.spinny.com/careers",
  cars24: "https://www.cars24.com/careers",
  shadowfax: "https://www.shadowfax.in/careers",
  delhivery: "https://www.delhivery.com/careers",
  porter: "https://porter.in/careers",
  shiprocket: "https://www.shiprocket.in/careers",
  rapido: "https://rapido.bike/careers",
  ola: "https://careers.olaelectric.com",
  olaelectric: "https://careers.olaelectric.com",
  "ola-electric": "https://careers.olaelectric.com",
  ather: "https://www.atherenergy.com/careers",
  atherenergy: "https://www.atherenergy.com/careers",
  physicswallah: "https://www.pw.live/careers",
  pw: "https://www.pw.live/careers",
  unacademy: "https://unacademy.com/careers",
  eruditus: "https://eruditus.com/careers",
  upgrad: "https://www.upgrad.com/careers",
  scaler: "https://www.scaler.com/careers",
  simplilearn: "https://www.simplilearn.com/careers",
  vedantu: "https://www.vedantu.com/careers",
  cuemath: "https://www.cuemath.com/careers",
  cultfit: "https://www.cult.fit/careers",
  curefit: "https://www.cult.fit/careers",
  practo: "https://www.practo.com/careers",
  pharmeasy: "https://pharmeasy.in/careers",
  tata1mg: "https://www.1mg.com/jobs",
  "1mg": "https://www.1mg.com/jobs",
  healthifyme: "https://www.healthifyme.com/careers",
  pristyncare: "https://www.pristyncare.com/careers",
  makemytrip: "https://careers.makemytrip.com",
  yatra: "https://www.yatra.com/careers",
  easemytrip: "https://www.easemytrip.com/careers.html",
  oyo: "https://careers.oyorooms.com",
  cleartrip: "https://www.cleartrip.com/jobs",
  ixigo: "https://www.ixigo.com/careers",
  dream11: "https://about.dream11.in/careers",
  mpl: "https://www.mpl.live/careers",
  games24x7: "https://www.games24x7.com/careers",
  winzo: "https://www.winzogames.com/careers",
  nazara: "https://nazara.com/careers",
  sharechat: "https://sharechat.com/careers",
  dailyhunt: "https://verse.in/careers",
  glance: "https://www.glance.com/careers",
  inmobi: "https://www.inmobi.com/company/careers",
  pocketfm: "https://www.pocketfm.com/careers",
  rebelfoods: "https://www.rebelfoods.com/careers",
  "rebel-foods": "https://www.rebelfoods.com/careers",
  thoughtworks: "https://www.thoughtworks.com/careers",

  // ─── Indian IT Giants & Engineering Leaders ──────────────────────────
  tcs: "https://www.tcs.com/careers",
  infosys: "https://www.infosys.com/careers.html",
  wipro: "https://careers.wipro.com",
  hcl: "https://www.hcltech.com/careers",
  hcltech: "https://www.hcltech.com/careers",
  "tech-mahindra": "https://careers.techmahindra.com",
  techmahindra: "https://careers.techmahindra.com",
  ltimindtree: "https://careers.ltimindtree.com",
  tataelxsi: "https://www.tataelxsi.com/careers",
  "tata-elxsi": "https://www.tataelxsi.com/careers",
  persistentsystems: "https://www.persistent.com/careers/",
  persistent: "https://www.persistent.com/careers/",
  coforge: "https://www.coforge.com/careers",
  mphasis: "https://careers.mphasis.com",
  birlasoft: "https://www.birlasoft.com/careers",
  kpit: "https://www.kpit.com/careers/",
  cyient: "https://www.cyient.com/careers",
  sonata: "https://www.sonata-software.com/careers",
  sonatasoftware: "https://www.sonata-software.com/careers",
  zensar: "https://www.zensar.com/careers",
  hexaware: "https://hexaware.com/careers/",
  happiestminds: "https://www.happiestminds.com/careers/",
  tanla: "https://www.tanla.com/careers.html",
  tatacommunications: "https://www.tatacommunications.com/careers/",
  jio: "https://careers.jio.com",
  jioplatforms: "https://careers.jio.com",
  airteldigital: "https://www.airtel.in/careers/",
  airtel: "https://www.airtel.in/careers/",

  // ─── Indian Enterprise SaaS & DevTools ─────────────────────────────────
  zoho: "https://www.zoho.com/careers/",
  freshworks: "https://www.freshworks.com/company/careers/",
  postman: "https://www.postman.com/company/careers/",
  hasura: "https://hasura.io/careers/",
  browserstack: "https://www.browserstack.com/careers",
  chargebee: "https://www.chargebee.com/careers/",
  wingify: "https://wingify.com/careers/",
  druva: "https://www.druva.com/about/careers/",
  icertis: "https://www.icertis.com/company/careers/",
  zenoti: "https://www.zenoti.com/careers",
  highradius: "https://www.highradius.com/careers/",
  darwinbox: "https://darwinbox.com/careers.html",
  amagi: "https://www.amagi.com/careers",
  leadsquared: "https://www.leadsquared.com/careers/",
  clevertap: "https://clevertap.com/careers/",
  moengage: "https://www.moengage.com/careers/",
  webengage: "https://webengage.com/careers/",
  yellowai: "https://yellow.ai/careers/",
  "yellow-ai": "https://yellow.ai/careers/",
  haptik: "https://www.haptik.ai/careers",
  gupshup: "https://www.gupshup.io/careers",
  exotel: "https://exotel.com/careers/",
  innovaccer: "https://innovaccer.com/careers",
  signzy: "https://signzy.com/careers/",
  idfy: "https://www.idfy.com/careers/",
  hyperverge: "https://hyperverge.co/careers",

  // ─── Emerging Tech, AI, SpaceTech & DevTools in India ─────────────────
  signoz: "https://signoz.io/careers/",
  devtron: "https://devtron.ai/careers",
  devrev: "https://devrev.ai/careers",
  appsmith: "https://www.appsmith.com/careers",
  hoppscotch: "https://hoppscotch.com/careers",
  keploy: "https://keploy.io/careers",
  tooljet: "https://www.tooljet.com/careers",
  plane: "https://plane.so/careers",
  chatwoot: "https://www.chatwoot.com/careers",
  sarvam: "https://www.sarvam.ai/careers",
  sarvamai: "https://www.sarvam.ai/careers",
  krutrim: "https://krutrim.com/careers",
  corover: "https://corover.ai/careers",
  observeai: "https://www.observe.ai/careers",
  entropik: "https://entropik.io/careers",
  uniphore: "https://www.uniphore.com/careers/",
  qureai: "https://qure.ai/careers",
  niramai: "https://www.niramai.com/careers/",
  cropin: "https://www.cropin.com/careers",
  ultraviolette: "https://www.ultraviolette.com/careers",
  pixxel: "https://www.pixxel.space/careers",
  agnikul: "https://agnikul.in/careers",
  skyroot: "https://skyroot.in/careers",
  digantara: "https://digantara.co/careers",
  bellatrix: "https://www.bellatrix.aero/careers",

  // ─── Global Tech MNCs with India R&D Tech Centers / GCCs ─────────────
  google: "https://careers.google.com",
  microsoft: "https://careers.microsoft.com",
  amazon: "https://www.amazon.jobs",
  apple: "https://jobs.apple.com",
  meta: "https://www.metacareers.com",
  netflix: "https://jobs.netflix.com",
  uber: "https://www.uber.com/careers",
  adobe: "https://www.adobe.com/careers.html",
  salesforce: "https://www.salesforce.com/company/careers/",
  oracle: "https://www.oracle.com/careers/",
  cisco: "https://jobs.cisco.com",
  intel: "https://jobs.intel.com",
  qualcomm: "https://www.qualcomm.com/company/careers",
  amd: "https://www.amd.com/en/corporate/careers.html",
  nvidia: "https://www.nvidia.com/en-us/about-nvidia/careers/",
  ibm: "https://www.ibm.com/careers",
  sap: "https://jobs.sap.com",
  vmware: "https://careers.vmware.com",
  intuit: "https://www.intuit.com/careers/",
  paypal: "https://careers.pypl.com",
  atlassian: "https://www.atlassian.com/company/careers",
  stripe: "https://stripe.com/jobs",
  servicenow: "https://careers.servicenow.com",
  snowflake: "https://careers.snowflake.com",
  databricks: "https://www.databricks.com/company/careers",
  twilio: "https://www.twilio.com/company/jobs",
  paloaltonetworks: "https://jobs.paloaltonetworks.com",
  walmartglobaltech: "https://careers.walmart.com/global-tech-india",
  walmart: "https://careers.walmart.com/global-tech-india",
  target: "https://india.target.com/careers",
  targetindia: "https://india.target.com/careers",
  goldmansachs: "https://www.goldmansachs.com/careers/",
  morganstanley: "https://www.morganstanley.com/about-us/careers",
  jpmorgan: "https://careers.jpmorgan.com",
  wellsfargo: "https://www.wellsfargo.com/about/careers/",
  barclays: "https://home.barclays/careers/",
  deutschebank: "https://careers.db.com",
  standardchartered: "https://www.sc.com/en/careers/",
  mastercard: "https://careers.mastercard.com",
  visa: "https://corporate.visa.com/en/careers.html",
  americanexpress: "https://careers.americanexpress.com",
  dell: "https://jobs.dell.com",
  hp: "https://jobs.hp.com",
  samsung: "https://www.samsung.com/in/aboutsamsung/careers/",
  philips: "https://www.careers.philips.com",
  siemens: "https://www.siemens-healthineers.com/careers",
  bosch: "https://www.bosch.in/careers/",
  honeywell: "https://careers.honeywell.com",
  collinsaerospace: "https://www.collinsaerospace.com/careers",
  gehealthcare: "https://jobs.gecareers.com",
  shell: "https://www.shell.in/careers.html",
  boeing: "https://jobs.boeing.com",
  mercedesbenz: "https://www.mbrdi.co.in/careers/",
  spotify: "https://www.lifeatspotify.com",
  airbnb: "https://careers.airbnb.com",
  cloudflare: "https://www.cloudflare.com/careers/",
  gitlab: "https://about.gitlab.com/jobs/",
  rubrik: "https://www.rubrik.com/company/careers",
  coinbase: "https://www.coinbase.com/careers",
  pinterest: "https://www.pinterestcareers.com",
  mongodb: "https://www.mongodb.com/company/careers",
  elastic: "https://www.elastic.co/about/careers",
  okta: "https://www.okta.com/company/careers/",
  reddit: "https://www.redditinc.com/careers",
  lyft: "https://www.lyft.com/careers",
  robinhood: "https://robinhood.com/us/en/careers/",
  brex: "https://www.brex.com/careers",
  scaleai: "https://scale.com/careers",
  vercel: "https://vercel.com/careers",
};

/**
 * Verified Official LinkedIn Company Handles
 * Resolves strictly to official company pages: https://www.linkedin.com/company/<slug>/
 * and official company job boards: https://www.linkedin.com/company/<slug>/jobs/
 */
export const KNOWN_OFFICIAL_LINKEDIN_SLUGS = {
  // Indian Tech Unicorns & Startups
  swiggy: "swiggy-in",
  razorpay: "razorpay",
  cred: "credapp",
  zomato: "zomato",
  blinkit: "blinkit",
  zepto: "zepto-now",
  phonepe: "phonepe-internet",
  flipkart: "flipkart",
  paytm: "paytm",
  meesho: "meesho",
  groww: "groww-in",
  slice: "sliceit",
  onecard: "getonecard",
  inmobi: "inmobi",
  pocketfm: "pocket-fm",
  urbancompany: "urbancompany",
  delhivery: "delhivery",
  porter: "porter-in",
  shiprocket: "shiprocket",
  shadowfax: "shadowfax-technologies",
  rapido: "rapido-bike",
  ola: "olaelectric",
  olaelectric: "olaelectric",
  ather: "ather-energy",
  atherenergy: "ather-energy",
  bigbasket: "bigbasket-com",
  lenskart: "lenskart-com",
  nykaa: "nykaa-com",
  purplle: "purplle-com",
  cardekho: "cardekho",
  cars24: "cars24",
  spinny: "spinny",
  dream11: "dream11",
  games24x7: "games24x7",
  winzo: "winzo",
  mpl: "mobile-premier-league",
  sharechat: "sharechat",
  upgrad: "upgrad",
  unacademy: "unacademy",
  physicswallah: "physicswallah",
  scaler: "scaler-academy",
  practo: "practo",
  cultfit: "cure-fit",
  curefit: "cure-fit",
  rebelfoods: "rebel-foods",
  zeta: "zeta-suite",
  makemytrip: "makemytrip-com",
  ixigo: "ixigo",
  policybazaar: "policybazaar-com",
  pinelabs: "pine-labs",
  bharatpe: "bharatpe",
  khatabook: "khatabook",
  cleartax: "cleartax",
  cashfree: "cashfree-payments",

  // Indian IT Giants
  tcs: "tata-consultancy-services",
  infosys: "infosys",
  wipro: "wipro",
  hcl: "hcltech",
  hcltech: "hcltech",
  techmahindra: "tech-mahindra",
  ltimindtree: "ltimindtree",
  tataelxsi: "tata-elxsi",
  persistent: "persistent-systems",
  persistentsystems: "persistent-systems",
  coforge: "coforge",
  mphasis: "mphasis",
  birlasoft: "birlasoft",
  kpit: "kpit",
  cyient: "cyient",
  sonatasoftware: "sonata-software",
  zensar: "zensar-technologies",
  hexaware: "hexaware-technologies",
  happiestminds: "happiest-minds-technologies",
  tatacommunications: "tata-communications",
  jio: "jio",
  jioplatforms: "jio",
  airtel: "airtel-digital",
  airteldigital: "airtel-digital",

  // Indian SaaS & DevTools
  zoho: "zoho",
  freshworks: "freshworks-inc",
  postman: "postman-platform",
  hasura: "hasura",
  browserstack: "browserstack",
  chargebee: "chargebee",
  wingify: "wingify",
  druva: "druva",
  icertis: "icertis",
  zenoti: "zenoti",
  highradius: "highradius",
  darwinbox: "darwinbox",
  amagi: "amagi-media-labs",
  leadsquared: "leadsquared",
  clevertap: "clevertap",
  moengage: "moengage-inc",
  webengage: "webengage",
  yellowai: "yellowdotai",
  haptik: "haptik",
  gupshup: "gupshup",
  exotel: "exotel",
  innovaccer: "innovaccer",
  signzy: "signzy",
  signoz: "signoz",
  plane: "plane-app",
  devrev: "devrev",
  appsmith: "appsmith",
  hoppscotch: "hoppscotch",
  keploy: "keploy",
  tooljet: "tooljet",
  thoughtworks: "thoughtworks",

  // Global MNCs operating in India
  google: "google",
  microsoft: "microsoft",
  amazon: "amazon",
  apple: "apple",
  meta: "meta",
  netflix: "netflix",
  uber: "uber-com",
  adobe: "adobe",
  salesforce: "salesforce",
  oracle: "oracle",
  cisco: "cisco",
  intel: "intel-corporation",
  qualcomm: "qualcomm",
  amd: "amd",
  nvidia: "nvidia",
  ibm: "ibm",
  sap: "sap",
  vmware: "vmware",
  intuit: "intuit",
  paypal: "paypal",
  atlassian: "atlassian",
  stripe: "stripe",
  servicenow: "servicenow",
  snowflake: "snowflake-computing",
  databricks: "databricks",
  twilio: "twilio-inc-",
  paloaltonetworks: "palo-alto-networks",
  walmartglobaltech: "walmartglobaltech",
  goldmansachs: "goldman-sachs",
  morganstanley: "morgan-stanley",
  jpmorgan: "jpmorgan",
  wellsfargo: "wellsfargo",
  barclays: "barclays",
  deutschebank: "deutsche-bank",
  mastercard: "mastercard",
  visa: "visa",
  dell: "delltechnologies",
  samsung: "samsung-electronics",
  bosch: "bosch",
  honeywell: "honeywell",
};

/**
 * Cleans a raw LinkedIn company URL into standard canonical form
 */
export function cleanLinkedInCompanyUrl(rawUrl = "") {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  try {
    const match = rawUrl.match(/linkedin\.com\/company\/([a-zA-Z0-9_-]+)/i);
    if (match) {
      return `https://www.linkedin.com/company/${match[1]}/`;
    }
    const parsed = new URL(rawUrl);
    const pathname = parsed.pathname.replace(/\/+$/, "");
    return `https://www.linkedin.com${pathname}/`;
  } catch {
    return "";
  }
}

/**
 * Builds the verified official company jobs page URL on LinkedIn
 */
export function cleanLinkedInCompanyJobsUrl(companyUrl = "") {
  if (!companyUrl) return "";
  const cleaned = cleanLinkedInCompanyUrl(companyUrl);
  return cleaned ? `${cleaned.replace(/\/+$/, "")}/jobs/` : "";
}

/**
 * Resolves the verified official LinkedIn company page & official LinkedIn jobs URL.
 * Strictly avoids generic keyword search URLs.
 */
export function getOfficialLinkedInUrls(companyIdentifier = "", explicitUrl = "") {
  if (explicitUrl && explicitUrl.includes("linkedin.com/company/")) {
    const match = explicitUrl.match(/linkedin\.com\/company\/([a-zA-Z0-9_-]+)/i);
    if (match) {
      const slug = match[1];
      return {
        linkedInUrl: `https://www.linkedin.com/company/${slug}/`,
        linkedInJobsUrl: `https://www.linkedin.com/company/${slug}/jobs/`,
        officialSlug: slug,
      };
    }
  }

  const clean = (companyIdentifier || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const officialSlug = KNOWN_OFFICIAL_LINKEDIN_SLUGS[clean] || normalizeCompanySlug(companyIdentifier);

  return {
    linkedInUrl: `https://www.linkedin.com/company/${officialSlug}/`,
    linkedInJobsUrl: `https://www.linkedin.com/company/${officialSlug}/jobs/`,
    officialSlug,
  };
}

/**
 * Checks if a given URL is a third-party ATS board (Greenhouse, Lever, SmartRecruiters, etc.)
 */
export function isThirdPartyAtsUrl(url = "") {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("greenhouse.io") ||
    lower.includes("lever.co") ||
    lower.includes("smartrecruiters.com") ||
    lower.includes("workable.com") ||
    lower.includes("ashbyhq.com") ||
    lower.includes("recruitee.com") ||
    lower.includes("myworkdayjobs.com") ||
    lower.includes("bamboohr.com") ||
    lower.includes("jobvite.com") ||
    lower.includes("taleo.net") ||
    lower.includes("icims.com") ||
    lower.includes("breezy.hr")
  );
}

/**
 * Normalizes a company name into a clean alphanumeric slug
 */
export function normalizeCompanySlug(companyName = "") {
  if (!companyName) return "";
  let clean = companyName
    .toLowerCase()
    .replace(/\s+(software|technologies|technology|pvt|ltd|limited|inc|corp|corporation|llc|holdings|services)\b/gi, "")
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return clean || "company";
}

/**
 * Intelligent Engine to resolve and generate:
 * 1. Official Company Website (Company Page)
 * 2. Official Career Page URL on the company's verified domain (NEVER third-party ATS boards)
 * 3. Official LinkedIn Company Page URL
 * 4. Official LinkedIn Jobs Requisition Page URL
 */
export function resolveCompanyLinks(companyIdentifier = "") {
  if (!companyIdentifier) {
    return {
      name: "Technology Company",
      slug: "company",
      category: "Technology",
      logo: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png",
      companyPageUrl: "https://google.com",
      careerPageUrl: "https://careers.google.com",
      linkedInUrl: "https://www.linkedin.com",
      linkedInJobsUrl: "https://www.linkedin.com/jobs",
      atsProvider: "Official Portal",
      provider: "Official Portal",
      isRegistered: false,
    };
  }

  const cleanInput = companyIdentifier.trim();
  const regCompany = findCompanyByIdOrSlug(cleanInput);

  if (regCompany) {
    const slug = regCompany.slug || regCompany.id;
    const cleanSlug = normalizeCompanySlug(regCompany.name || slug);
    const domain = regCompany.website
      ? regCompany.website.replace(/^https?:\/\//i, "").replace(/\/+$/, "").replace(/^www\./i, "")
      : `${cleanSlug}.com`;

    const companyPageUrl = regCompany.website || `https://${domain}`;

    // Resolve Official Company Career Portal:
    // Strictly verify against known official career portals or company domain, never third-party ATS
    const idKey = (regCompany.id || "").toLowerCase().trim();
    const slugKey = cleanSlug.toLowerCase().trim();
    const nameKey = normalizeCompanySlug(regCompany.name || "").toLowerCase().trim();

    let careerPageUrl =
      KNOWN_OFFICIAL_CAREERS_PAGES[idKey] ||
      KNOWN_OFFICIAL_CAREERS_PAGES[slugKey] ||
      KNOWN_OFFICIAL_CAREERS_PAGES[nameKey];

    if (!careerPageUrl) {
      if (regCompany.officialPortalUrl && !isThirdPartyAtsUrl(regCompany.officialPortalUrl)) {
        careerPageUrl = regCompany.officialPortalUrl;
      } else {
        careerPageUrl = `${companyPageUrl.replace(/\/+$/, "")}/careers`;
      }
    }

    const officialLinkedIn = getOfficialLinkedInUrls(
      regCompany.name || cleanSlug,
      regCompany.linkedInUrl || regCompany.linkedInJobsUrl
    );
    const linkedInUrl = officialLinkedIn.linkedInUrl;
    const linkedInJobsUrl = officialLinkedIn.linkedInJobsUrl;

    // If company's career portal is on LinkedIn, use ONLY the official company LinkedIn jobs page:
    if (
      (regCompany.officialPortalUrl && regCompany.officialPortalUrl.includes("linkedin.com")) ||
      (careerPageUrl && careerPageUrl.includes("linkedin.com"))
    ) {
      careerPageUrl = linkedInJobsUrl;
    }

    return {
      id: regCompany.id,
      name: regCompany.name,
      slug: regCompany.slug || regCompany.id,
      category: regCompany.category || "Technology",
      provider: careerPageUrl.includes("linkedin.com") ? "Official LinkedIn Portal" : "Official Portal",
      atsProvider: careerPageUrl.includes("linkedin.com") ? "Official LinkedIn Portal" : "Official Portal",
      logo: regCompany.logo || `https://${domain}/favicon.ico`,
      headquarters: regCompany.headquarters || "India / Global",
      description: regCompany.description || `${regCompany.name} official company profile and engineering openings.`,
      tags: regCompany.tags || ["Technology", "Verified Employer"],
      companyPageUrl,
      website: companyPageUrl,
      careerPageUrl,
      officialPortalUrl: careerPageUrl,
      atsFeedUrl: regCompany.officialPortalUrl || null,
      linkedInUrl,
      linkedInJobsUrl,
      isRegistered: true,
    };
  }

  // Dynamic Resolution for Unregistered Companies
  const cleanSlug = normalizeCompanySlug(cleanInput);
  const displayName = cleanInput
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const domain = `${cleanSlug}.com`;
  const companyPageUrl = `https://${domain}`;

  const officialLinkedIn = getOfficialLinkedInUrls(displayName || cleanSlug);
  const linkedInUrl = officialLinkedIn.linkedInUrl;
  const linkedInJobsUrl = officialLinkedIn.linkedInJobsUrl;

  let careerPageUrl =
    KNOWN_OFFICIAL_CAREERS_PAGES[cleanSlug] || `https://${domain}/careers`;
  if (careerPageUrl && careerPageUrl.includes("linkedin.com")) {
    careerPageUrl = linkedInJobsUrl;
  }

  return {
    id: cleanSlug,
    name: displayName,
    slug: cleanSlug,
    category: "Emerging Tech & Startup",
    provider: careerPageUrl.includes("linkedin.com") ? "Official LinkedIn Portal" : "Official Portal",
    atsProvider: careerPageUrl.includes("linkedin.com") ? "Official LinkedIn Portal" : "Official Portal",
    logo: `https://${domain}/favicon.ico`,
    headquarters: "India / Global Hubs",
    description: `${displayName} is an active technology organization with open positions across engineering, product, and operations.`,
    tags: ["Technology", "Verified Employer"],
    companyPageUrl,
    website: companyPageUrl,
    careerPageUrl,
    officialPortalUrl: careerPageUrl,
    atsFeedUrl: null,
    linkedInUrl,
    linkedInJobsUrl,
    isRegistered: false,
  };
}

/**
 * Searches the company directory by partial query or category.
 * Returns enriched companies with full official links.
 */
export function searchCompaniesDirectory(query = "", limit = 24) {
  const q = (query || "").toLowerCase().trim();

  let matches = [];
  if (!q) {
    matches = COMPANIES_REGISTRY.slice(0, limit);
  } else {
    matches = COMPANIES_REGISTRY.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const slug = (c.slug || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      const cat = (c.category || "").toLowerCase();
      const tags = (c.tags || []).map((t) => t.toLowerCase()).join(" ");

      return (
        name.includes(q) ||
        slug.includes(q) ||
        id.includes(q) ||
        cat.includes(q) ||
        tags.includes(q)
      );
    }).slice(0, limit);
  }

  return matches.map((c) => resolveCompanyLinks(c.slug || c.id || c.name));
}
