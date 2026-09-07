export const dictionaries = {
  en: {
    nav: { features:"Features", creators:"For Creators", businesses:"For Businesses", pricing:"Pricing", explore:"Explore", signIn:"Sign in", getStarted:"Get started" },
    hero: { eyebrow:"Built for Ethiopia. Ready for everywhere.", title:"Everything you are. One beautiful link.", body:"Create your digital identity, share everything you do, grow your audience, and connect with people from one beautiful link.", primary:"Get Started Free", secondary:"Explore Profiles" },
    dashboard: { overview:"Overview", links:"Links", appearance:"Appearance", store:"Store", analytics:"Analytics", payments:"Payments", qr:"QR Code", settings:"Settings", workspace:"Workspace", publicPage:"View public page", creatorWorkspace:"Creator workspace" },
    publicProfile: { shop:"Shop", digitalProducts:"Digital products", buy:"Buy now", create:"Create your own page with Linqo", secureCheckout:"Secure checkout", checkoutBody:"Linqo creates the transaction on the server and redirects you to the configured payment provider.", purchaseEmail:"Email for purchase access", firstName:"First name", lastName:"Last name", continuePayment:"Continue to payment", close:"Close" },
    common: { language:"Language", english:"English", amharic:"አማርኛ", save:"Save", cancel:"Cancel", delete:"Delete", enabled:"Enabled", disabled:"Disabled" }
  },
  am: {
    nav: { features:"ባህሪያት", creators:"ለፈጣሪዎች", businesses:"ለንግዶች", pricing:"ዋጋ", explore:"ያስሱ", signIn:"ይግቡ", getStarted:"ይጀምሩ" },
    hero: { eyebrow:"ለኢትዮጵያ የተገነባ። ለዓለም ዝግጁ።", title:"እርስዎ ያሉት ሁሉ። በአንድ ውብ ሊንክ።", body:"ዲጂታል ማንነትዎን ይፍጠሩ፣ ስራዎችዎን ያጋሩ፣ ታዳሚዎን ያሳድጉ እና ከሰዎች ጋር በአንድ ውብ ሊንክ ይገናኙ።", primary:"በነጻ ይጀምሩ", secondary:"ፕሮፋይሎችን ያስሱ" },
    dashboard: { overview:"አጠቃላይ", links:"ሊንኮች", appearance:"ገጽታ", store:"መደብር", analytics:"ትንታኔ", payments:"ክፍያዎች", qr:"QR ኮድ", settings:"ቅንብሮች", workspace:"የስራ ቦታ", publicPage:"የህዝብ ገጽ ይመልከቱ", creatorWorkspace:"የፈጣሪ የስራ ቦታ" },
    publicProfile: { shop:"መደብር", digitalProducts:"ዲጂታል ምርቶች", buy:"ይግዙ", create:"የራስዎን ገጽ በLinqo ይፍጠሩ", secureCheckout:"ደህንነቱ የተጠበቀ ክፍያ", checkoutBody:"Linqo ግብይቱን በሰርቨር ላይ ይፈጥራል እና ወደ ተዋቀረው የክፍያ አቅራቢ ይመራዎታል።", purchaseEmail:"ለግዢ መዳረሻ ኢሜይል", firstName:"ስም", lastName:"የአባት ስም", continuePayment:"ወደ ክፍያ ይቀጥሉ", close:"ዝጋ" },
    common: { language:"ቋንቋ", english:"English", amharic:"አማርኛ", save:"አስቀምጥ", cancel:"ሰርዝ", delete:"አጥፋ", enabled:"ንቁ", disabled:"የተዘጋ" }
  }
} as const;
export type Locale = keyof typeof dictionaries;
export function getDictionary(locale: Locale) { return dictionaries[locale]; }
