/* ============================================================
   Travee — data.js
   All app content lives here as plain JS data (no hardcoded copy).
   ============================================================ */
(function () {
  'use strict';

  var CATEGORIES = {
    luzon:      { label: 'Luzon',       gradient: 'var(--grad-city)',      icon: '🏙' },
    visayas:    { label: 'Visayas',     gradient: 'var(--grad-beach)',     icon: '🏝' },
    mindanao:   { label: 'Mindanao',    gradient: 'var(--grad-mountain)',  icon: '🏔' },
    asia:       { label: 'Asia',        gradient: 'var(--grad-cultural)',  icon: '🏯' },
    europe:     { label: 'Europe',      gradient: 'var(--grad-mountain)',  icon: '🏛' },
    middleeast: { label: 'Middle East', gradient: 'var(--grad-adventure)', icon: '🏙' },
    oceania:    { label: 'Oceania',     gradient: 'var(--grad-beach)',     icon: '🌊' }
  };

  var DESTINATIONS = [
    /* ---------- Domestic — flights from Manila within the Philippines ---------- */
    { id: 'cebu', name: 'Cebu', city: 'Cebu City', country: 'Philippines', scope: 'domestic', cat: 'visayas', code: 'CEB', rating: 4.8, price: 2450, duration: 75, pop: 100, airline: 'PAL · Cebu Pacific', art: '🏙',
      photo: 'images/cebu.jpg',
      tagline: 'White-sand islands, diving and lechon — the Queen City of the South.',
      description: 'Fly under an hour from Manila and dive straight into Cebu’s island life — from the whale sharks of Oslob to the historical heart of Cebu City.',
      highlights: ['Kawasan Falls canyoneering', 'Whale-shark watching in Oslob', 'Moalboal sardine run & diving', 'Cebu City lechon food tour'],
      bestSeason: 'Year-round' },
    { id: 'boracay', name: 'Boracay', city: 'Kalibo', country: 'Philippines', scope: 'domestic', cat: 'visayas', code: 'KLO', rating: 4.9, price: 2800, duration: 70, pop: 96, airline: 'Cebu Pacific · Philippine Airlines', art: '🏖',
      photo: 'images/boracay.jpg',
      tagline: 'Powder-white sand, crystal water and famous sunsets.',
      description: 'The Philippines’ most famous beach island — fly to Kalibo, longboat over to White Beach and stay for the legendary sunset.',
      highlights: ['White Beach sunset cruise', 'Island hopping around the island', 'Helmet diving & water sports', 'Puka Shell Beach chill'],
      bestSeason: 'November – May' },
    { id: 'palawan', name: 'Puerto Princesa', city: 'Puerto Princesa', country: 'Philippines', scope: 'domestic', cat: 'luzon', code: 'PPS', rating: 4.9, price: 3100, duration: 75, pop: 90, airline: 'PAL · Cebu Pacific', art: '🌴',
      photo: 'images/palawan.jpg',
      tagline: 'Underground rivers, limestone cliffs and jungle beaches.',
      description: 'Gateway to Palawan’s natural wonders — paddle through the Puerto Princesa Underground River, then set sail for the lagoons of Honda Bay.',
      highlights: ['Puerto Princesa Underground River', 'Honda Bay island hopping', 'Firefly-watching river cruise', 'Iwahig nature & wildlife'],
      bestSeason: 'November – May' },
    { id: 'siargao', name: 'Siargao', city: 'Dapa', country: 'Philippines', scope: 'domestic', cat: 'visayas', code: 'IAO', rating: 4.9, price: 4200, duration: 115, pop: 93, airline: 'Cebu Pacific · Philippine Airlines', art: '🏄',
      photo: 'images/siargao.jpg',
      tagline: 'Cloud 9 barrels, coconut islands and barefoot island time.',
      description: 'The surfing capital of the Philippines — chase the famous Cloud 9 break, explore the Sugba Lagoon and live laid-back island time in General Luna.',
      highlights: ['Cloud 9 surf break', 'Sugba Lagoon & Magpupungko pools', 'Guyam & Daku island hopping', 'General Luna island-hopping day'],
      bestSeason: 'August – November' },
    { id: 'bohol', name: 'Bohol', city: 'Tagbilaran', country: 'Philippines', scope: 'domestic', cat: 'visayas', code: 'TAG', rating: 4.7, price: 2600, duration: 75, pop: 85, airline: 'Cebu Pacific · Philippines AirAsia', art: '🐒',
      photo: 'images/bohol.jpg',
      tagline: 'Chocolate Hills, tarsiers and river cruises through the jungle.',
      description: 'Land in Tagbilaran and spend the day hopping between the Chocolate Hills, the tiny tarsiers and a Loboc River cruise — a classic Visayas day trip.',
      highlights: ['Chocolate Hills viewpoint', 'Philippine tarsier sanctuary', 'Loboc River cruise', 'Bohol countryside ATV'],
      bestSeason: 'Year-round' },

    { id: 'davao', name: 'Davao', city: 'Davao City', country: 'Philippines', scope: 'domestic', cat: 'mindanao', code: 'DVO', rating: 4.6, price: 3400, duration: 105, pop: 80, airline: 'PAL · Cebu Pacific', art: '🐯',
      photo: 'images/davao.jpg',
      tagline: 'Mount Apo, the durian capital and a taste of Mindanao.',
      description: 'The biggest city on Mindanao — gateway to Mount Apo, the Philippine Eagle Center and the island shores of Samal just across the bay.',
      highlights: ['Mount Apo trekking', 'Philippine Eagle Center', 'Samal Island beach hop', 'Durian & Kadayawan food tour'],
      bestSeason: 'October – April' },
    { id: 'iloilo', name: 'Iloilo', city: 'Iloilo City', country: 'Philippines', scope: 'domestic', cat: 'visayas', code: 'ILO', rating: 4.5, price: 2700, duration: 65, pop: 72, airline: 'PAL · Cebu Pacific', art: '🏛',
      photo: 'images/iloilo.jpg',
      tagline: 'Old churches, heritage mansions and the sweetest mangoes.',
      description: 'A short hop from Manila into the heart of Panay — Spanish-era churches, heritage streets and the gateway to the Gigantes islands.',
      highlights: ['Molo & Jaro heritage churches', 'Iloilo River Esplanade', 'Gigantes Islands day trip', 'La Paz batchoy food crawl'],
      bestSeason: 'Year-round' },
    { id: 'cagayan-de-oro', name: 'Cagayan de Oro', city: 'Cagayan de Oro', country: 'Philippines', scope: 'domestic', cat: 'mindanao', code: 'CGY', rating: 4.5, price: 3300, duration: 95, pop: 68, airline: 'Cebu Pacific · Philippine Airlines', art: '🌊',
      photo: 'images/cagayan-de-oro.jpg',
      tagline: 'The white-water rafting capital of the Philippines.',
      description: 'The City of Golden Friendship — raft the Cagayan River rapids, then chase the waterfalls of Bukidnon just a short drive away.',
      highlights: ['Cagayan de Oro white-water rafting', 'Seven Seas Waterpark', 'Del Monte pineapple country', 'Hagpa khagangan viewpoint'],
      bestSeason: 'June – November' },
    { id: 'laoag', name: 'Laoag', city: 'Laoag', country: 'Philippines', scope: 'domestic', cat: 'luzon', code: 'LAO', rating: 4.4, price: 2900, duration: 70, pop: 58, airline: 'Cebu Pacific · Philippines AirAsia', art: '🏍',
      photo: 'images/laoag.jpg',
      tagline: 'Ilocos dunes, windmills and a sip of Spanish history.',
      description: 'Land in Ilocos Norte — barrel down the La Paz sand dunes, stand under the Bangui windmills and trace the heritage of Paoay Church and Vigan.',
      highlights: ['La Paz sand dunes', 'Bangui windmills', 'Paoay Church & Malacañang of the North', 'Vigan heritage day trip'],
      bestSeason: 'November – April' },

    /* ---------- International — flights from Manila to the world ---------- */
    { id: 'tokyo', name: 'Tokyo', city: 'Tokyo', country: 'Japan', scope: 'international', cat: 'asia', code: 'NRT', rating: 4.9, price: 12800, duration: 270, pop: 97, airline: 'PAL · ANA · JAL', art: '🗼',
      photo: 'images/tokyo.jpg',
      tagline: 'Neon districts, ancient shrines and impeccable ramen.',
      description: 'A direct hop from Manila to the world’s most extraordinary city — bullet trains to lantern-lit shrines, Michelin street food and robot cafés.',
      highlights: ['Shibuya Crossing & neon nights', 'Senso-ji temple in Asakusa', 'TeamLab & Harajuku streets', 'Shinjuku ramen crawl'],
      bestSeason: 'March – May, Oct – Dec' },
    { id: 'bangkok', name: 'Bangkok', city: 'Bangkok', country: 'Thailand', scope: 'international', cat: 'asia', code: 'BKK', rating: 4.7, price: 8900, duration: 210, pop: 88, airline: 'PAL · Thai Airways', art: '⛩',
      photo: 'images/bangkok.jpg',
      tagline: 'Grand palaces, floating markets and street-food royalty.',
      description: 'A few hours from Manila into Southeast Asia’s buzzing capital — golden temples by day and an unrivaled street-food scene by night.',
      highlights: ['Grand Palace & Wat Pho', 'Chatuchak weekend market', 'Chao Phraya river cruise', 'Chinatown street food'],
      bestSeason: 'November – February' },
    { id: 'singapore', name: 'Singapore', city: 'Singapore', country: 'Singapore', scope: 'international', cat: 'asia', code: 'SIN', rating: 4.8, price: 7200, duration: 200, pop: 91, airline: 'Singapore Airlines · Scoot', art: '🦁',
      photo: 'images/singapore.jpg',
      tagline: 'Skyline gardens, hawker heaven and Marina Bay lights.',
      description: 'The region’s cleanest, greenest city-state — Gardens by the Bay, hawker centers and a Marina Bay skyline that steals the show at night.',
      highlights: ['Gardens by the Bay', 'Marina Bay Sands skyline', 'Sentosa island day', 'Hawker food safari'],
      bestSeason: 'Year-round' },
    { id: 'dubai', name: 'Dubai', city: 'Dubai', country: 'UAE', scope: 'international', cat: 'middleeast', code: 'DXB', rating: 4.7, price: 18500, duration: 540, pop: 82, airline: 'Emirates · PAL', art: '🌆',
      photo: 'images/dubai.jpg',
      tagline: 'Desert skylines, gold souks and record-breaking everything.',
      description: 'From Manila’s longest-haul gateway — see the Burj Khalifa from the desert, cruise the Marina and haggle at the gold souk.',
      highlights: ['Burj Khalifa observation deck', 'Desert safari & dune bashing', 'Dubai Marina & Palm cruise', 'Gold & spice souks'],
      bestSeason: 'November – March' },
    { id: 'paris', name: 'Paris', city: 'Paris', country: 'France', scope: 'international', cat: 'europe', code: 'CDG', rating: 4.8, price: 32000, duration: 960, pop: 79, airline: 'PAL · Air France', art: '🗼',
      photo: 'images/paris.jpg',
      tagline: 'Café terraces, museums and the light on the Seine.',
      description: 'A long-haul flight to the City of Light — stroll boulevards made for wandering, lose an afternoon in the Louvre and save a sunset for Montmartre.',
      highlights: ['Eiffel Tower & Seine cruise', 'Louvre & Musée d’Orsay', 'Montmartre & Sacré-Cœur', 'Le Marais café hopping'],
      bestSeason: 'April – June, Sep – Oct' },
    { id: 'sydney', name: 'Sydney', city: 'Sydney', country: 'Australia', scope: 'international', cat: 'oceania', code: 'SYD', rating: 4.7, price: 14500, duration: 480, pop: 76, airline: 'Qantas · PAL', art: '🦘',
      photo: 'images/sydney.jpg',
      tagline: 'Harbour icons, beach life and southern-sky sunsets.',
      description: 'Fly Manila to the Harbour City — Opera House sails, Bondi surf and coastal walks that make Sydney endlessly photogenic.',
      highlights: ['Sydney Opera House & Harbour', 'Bondi to Coogee coastal walk', 'Blue Mountains day trip', 'Taronga Zoo & harbour ferry'],
      bestSeason: 'September – November' }
  ];

  /* Packages offered on the detail page. */
  var PACKAGES = [
    { id: 'economy',  label: 'Economy',         sub: 'Standard seat',    mult: 1.0 },
    { id: 'premium',  label: 'Premium Economy', sub: 'Extra legroom',    mult: 1.45 },
    { id: 'business', label: 'Business',        sub: 'Lie-flat comfort', mult: 2.1 }
  ];

  /* Loyalty tiers keyed off lifetime points. */
  var TIERS = [
    { name: 'Explorer', threshold: 0 },
    { name: 'Wanderer', threshold: 600 },
    { name: 'Voyager',  threshold: 1500 },
    { name: 'Legend',   threshold: 3000 }
  ];

  /* Demo discounts user can apply in the cart. */
  var COUPONS = {
    TRAVEE10:  { type: 'percent', value: 0.10, label: '10% off' },
    EXPLORE50: { type: 'flat',    value: 50,   label: '$50 off' }
  };

  function getCategory(cat) { return CATEGORIES[cat] || { label: cat, gradient: 'var(--grad-city)', icon: '🌍' }; }
  function getDestination(id) {
    for (var i = 0; i < DESTINATIONS.length; i++) if (DESTINATIONS[i].id === id) return DESTINATIONS[i];
    return null;
  }
  function sameCategoryDestinations(d) {
    return DESTINATIONS.filter(function (x) { return x.cat === d.cat && x.id !== d.id; });
  }
  function packagePrice(base, mult) { return Math.round((base * mult) / 10) * 10; }

  /* List of upcoming departure dates (weekly, starting next week). */
  function upcomingDates(howMany) {
    var out = [], now = new Date();
    for (var i = 1; i <= howMany; i++) {
      var d = new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }

  window.TraveeData = {
    CATEGORIES: CATEGORIES,
    DESTINATIONS: DESTINATIONS,
    PACKAGES: PACKAGES,
    TIERS: TIERS,
    COUPONS: COUPONS,
    getCategory: getCategory,
    getDestination: getDestination,
    sameCategoryDestinations: sameCategoryDestinations,
    packagePrice: packagePrice,
    upcomingDates: upcomingDates
  };
})();

