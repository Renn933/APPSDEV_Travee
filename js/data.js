/* ============================================================
   Travee — data.js
   All app content lives here as plain JS data (no hardcoded copy).
   ============================================================ */
(function () {
  'use strict';

  var CATEGORIES = {
    beach:     { label: 'Beach',      gradient: 'var(--grad-beach)',      icon: '🏖' },
    mountain:  { label: 'Mountain',   gradient: 'var(--grad-mountain)',   icon: '🏔' },
    city:      { label: 'City',       gradient: 'var(--grad-city)',       icon: '🏙' },
    cultural:  { label: 'Cultural',   gradient: 'var(--grad-cultural)',   icon: '🏛' },
    adventure: { label: 'Adventure',  gradient: 'var(--grad-adventure)',  icon: '🧗' },
    wildlife:  { label: 'Wildlife',   gradient: 'var(--grad-wildlife)',   icon: '🦁' }
  };

  var DESTINATIONS = [
    { id: 'santorini', name: 'Santorini',   country: 'Greece',    cat: 'beach',     rating: 4.9, price: 1890, duration: 6,  art: '🌊', pop: 100,
      tagline: 'Whitewashed villages, caldera sunsets and the deepest blue sea.',
      description: 'Drift between cliff-top villages, sail a glowing caldera at sunset and swim in the Aegean’s impossibly blue waters. Santorini is the postcard that keeps on giving.',
      highlights: ['Sunset catamaran cruise around the caldera', 'Oia village and blue-dome churches', 'Wine tasting at a clifftop vineyard', 'Black-sand beaches at Perissa & Kamari'],
      bestSeason: 'May – October' },
    { id: 'kyoto', name: 'Kyoto',       country: 'Japan',      cat: 'cultural',  rating: 4.8, price: 2140, duration: 7,  art: '⛩', pop: 92,
      tagline: 'A thousand temples, tea houses and cherry blossoms.',
      description: 'Step back in time among bamboo forests, tranquil zen gardens and ancient shrines. Kyoto rewards slow travellers with quiet lanes and seasonal wonder.',
      highlights: ['Fushimi Inari’s thousand torii gates', 'Arashiyama bamboo grove', 'Geisha districts of Gion', 'Seasonal kaiseki dining'],
      bestSeason: 'March – May, Oct – Nov' },
    { id: 'banff', name: 'Banff',        country: 'Canada',     cat: 'mountain',  rating: 4.8, price: 1620, duration: 5,  art: '🏔', pop: 88,
      tagline: 'Emerald lakes and snow-dusted peaks in the Rockies.',
      description: 'Turquoise glacial lakes, alpine boardwalks and wildlife-spotted trails. Banff is a mountain playground for every season.',
      highlights: ['Lake Louise & Moraine Lake', 'Gondola ride over the peaks', 'Hot springs after a day on the trail', 'Scenic Icefields Parkway drive'],
      bestSeason: 'June – Sep, Dec – Mar' },
    { id: 'bali', name: 'Bali',          country: 'Indonesia',  cat: 'beach',     rating: 4.7, price: 1240, duration: 8,  art: '🌺', pop: 94,
      tagline: 'Rice terraces, surf breaks and island temple magic.',
      description: 'From Ubud’s jungle studios to Uluwatu’s clifftop temples, Bali blends wellness, surf and culture into one gloriously relaxed escape.',
      highlights: ['Tegallalang rice terraces', 'Uluwatu temple sunset', 'Surf at Canggu or Uluwatu', 'Balinese spa & wellness retreats'],
      bestSeason: 'April – October' },
    { id: 'serengeti', name: 'Serengeti', country: 'Tanzania',  cat: 'wildlife',  rating: 4.9, price: 3420, duration: 7,  art: '🦁', pop: 71,
      tagline: 'The great migration across the endless savannah.',
      description: 'Sleep under a million stars and wake to lions, elephants and the thundering great migration. A once-in-a-lifetime safari on the plains.',
      highlights: ['The Great Migration river crossings', 'Big Five game drives', 'Hot-air-balloon safari at dawn', 'Maasai village visits'],
      bestSeason: 'June – October' },

    { id: 'tokyo', name: 'Tokyo',        country: 'Japan',      cat: 'city',      rating: 4.7, price: 1980, duration: 6,  art: '🗼', pop: 97,
      tagline: 'Neon districts, ancient shrines and impeccable ramen.',
      description: 'A city that never decides between future and past — bullet trains to lantern-lit shrines, Michelin street food to robot cafés.',
      highlights: ['Shibuya Crossing & neon nights', 'Senso-ji temple in Asakusa', 'Tsukiji & street-food ramen tours', 'Akihabara electronics district'],
      bestSeason: 'March – May, Oct – Dec' },
    { id: 'iceland', name: 'Iceland',     country: 'Iceland',    cat: 'adventure', rating: 4.8, price: 2260, duration: 7,  art: '🌋', pop: 68,
      tagline: 'Waterfalls, glaciers and the otherworldly ring road.',
      description: 'Chase the northern lights, hike black-sand beaches and walk behind thundering waterfalls on the land of fire and ice.',
      highlights: ['Northern lights viewing', 'Blue Lagoon geothermal spa', 'Glacier hiking & ice caves', 'Golden Circle route'],
      bestSeason: 'Sep – Mar (lights), May – Aug (hikes)' },
    { id: 'paris', name: 'Paris',        country: 'France',     cat: 'city',      rating: 4.6, price: 1670, duration: 5,  art: '🗼', pop: 86,
      tagline: 'Café terraces, museums and the light on the Seine.',
      description: 'Stroll boulevards made for wandering, lose an afternoon in the Louvre, and save a sunset for Montmartre.',
      highlights: ['Eiffel Tower & Seine cruise', 'Louvre & Musée d’Orsay', 'Montmartre & Sacré-Cœur', 'Le Marais café hopping'],
      bestSeason: 'April – June, Sep – Oct' },
    { id: 'machu-picchu', name: 'Machu Picchu', country: 'Peru', cat: 'adventure', rating: 4.9, price: 2480, duration: 6, art: '🏞', pop: 64,
      tagline: 'Trek the Inca Trail to a lost citadel in the clouds.',
      description: 'Hike historic stone paths, cross breathless passes and arrive at dawn above the lost city of the Incas.',
      highlights: ['Inca trail sunrise arrival', 'Sacred Valley & Cusco', 'Rainbow Mountain day trip', 'Amazon rainforest extension'],
      bestSeason: 'May – September' },
    { id: 'amalfi', name: 'Amalfi Coast', country: 'Italy',    cat: 'beach',     rating: 4.7, price: 2030, duration: 6,  art: '🏝', pop: 76,
      tagline: 'Clifftop villages, lemon groves and the Tyrrhenian Sea.',
      description: 'Wind along hairpin cliffside roads between Positano and Amalfi, where pastel towns tumble into the sea.',
      highlights: ['Positano & Amalfi cliff towns', 'Boat day to Capri', 'Path of the Gods hike', 'Lemon groves of Ravello'],
      bestSeason: 'April – October' },
    { id: 'nyc', name: 'New York City',  country: 'USA',        cat: 'city',      rating: 4.5, price: 1850, duration: 5,  art: '🗽', pop: 89,
      tagline: 'Skyline energy, Broadway nights and five-borough bites.',
      description: 'The city that never sleeps delivers skyline views, world-class theatre and endless neighbourhoods to explore.',
      highlights: ['Top of the Rock skyline', 'Broadway show tickets', 'Central Park & High Line strolls', 'Brooklyn food crawl'],
      bestSeason: 'April – June, Sep – Nov' },
    { id: 'new-zealand', name: 'South Island, NZ', country: 'New Zealand', cat: 'adventure', rating: 4.9, price: 2740, duration: 10, art: '🥾', pop: 60,
      tagline: 'Lord-of-the-Rings scenery and adrenaline on tap.',
      description: 'Glaciers, fjords and glittering lakes — bungee, hike or just stare. The South Island is adventure’s home turf.',
      highlights: ['Milford Sound fjord cruise', 'Queenstown bungee & jet boats', 'Hooker Valley glacier trek', 'Fiordland star-gazing'],
      bestSeason: 'Nov – March' },
    { id: 'maldives', name: 'Maldives',   country: 'Maldives',  cat: 'beach',     rating: 5.0, price: 2890, duration: 5,  art: '🐠', pop: 72,
      tagline: 'Overwater villas on a ring of cobalt atolls.',
      description: 'Stay steps from coral reefs, snorkel with manta rays and unplug completely on a private overwater deck.',
      highlights: ['Overwater villa stays', 'Reef snorkelling with mantas', 'Dolphin sunset cruises', 'Private sandbank picnics'],
      bestSeason: 'Nov – April' },
    { id: 'swiss-alps', name: 'Swiss Alps', country: 'Switzerland', cat: 'mountain', rating: 4.8, price: 1990, duration: 7, art: '🚡', pop: 74,
      tagline: 'Glacier trains and villages straight out of a diorama.',
      description: 'Ride panoramic trains, hike wildflower meadows and watch Matterhorn glow pink at sunset above Zermatt.',
      highlights: ['Glacier Express panoramic train', 'Matterhorn gondola in Zermatt', 'Lucerne lake & old town', 'Alpine cheese tastings'],
      bestSeason: 'June – Sep, Dec – Mar' },
    { id: 'cape-town', name: 'Cape Town', country: 'South Africa', cat: 'city', rating: 4.6, price: 1420, duration: 7, art: '🏄', pop: 62,
      tagline: 'Table Mountain, penguin beaches and vineyard valleys.',
      description: 'A dramatic meeting of ocean and mountain, with surfing towns, winelands and a side of Big Five safaris nearby.',
      highlights: ['Table Mountain cable car', 'Boulders Beach penguins', 'Cape Winelands tours', 'Cape Point drive'],
      bestSeason: 'Nov – March' }
  ];

  /* Packages offered on the detail page. */
  var PACKAGES = [
    { id: 'economy',  label: 'Eco',     sub: 'Standard stays',      mult: 1.0 },
    { id: 'comfort',  label: 'Comfort', sub: 'Boutique hotels',     mult: 1.45 },
    { id: 'premium',  label: 'Premium', sub: 'Luxury & upgrades',   mult: 2.1 }
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

