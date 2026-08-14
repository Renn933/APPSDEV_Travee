act as a software engineer with years of experience and prompt this:

a travel booking system named "Travee" with At least five distinct screens or views — not five sections of one page. At least three features that hold and change state — a cart, a score, a saved list, a filter, a booking. Data-driven rendering — content comes from JavaScript data, never from copy-pasted HTML. Responsive design — it works on a phone and on a laptop. Polish — empty states, input validation, confirmations, loading states, transitions, a consistent visual design.

Everything runs in the browser. There is no server, no database, and no API you control.

You can use You cannot use HTML, CSS, vanilla JavaScript A backend of any kind — Express, PHP, Laravel, .NET A JavaScript framework — React, Vue, Nuxt, Next, Svelte A real database — MySQL, PostgreSQL, MongoDB, Firebase npm packages, a build step, a dev server Server routes, API routes, or anything under server/ localStorage to save data User accounts wieth real passwords Hardcoded JSON / JS data files Payment processing Google Fonts, icon libraries, CSS frameworks A language that isn't JavaScript or TypeScript

Vanilla HTML, CSS and JavaScript is the default, and it's a completely valid choice. Every concept this course has taught you applies directly, and nothing stands between you and the code.

A JavaScript framework is allowed if someone on your team already knows it. React, Vue, Nuxt, Next, Svelte, Astro — your pick, as long as it's JavaScript or TypeScript. Declare it at the pitch.

if you use a framework

Node and npm are tooling, not a backend. A dev server and a build step are fine. server/, /api routes, Express, and database drivers are not. Nuxt and Next must be static or SPA only. No SSR against live data, no server routes. npm run generate (or next export) has to produce a folder of files that runs on its own. Add node_modules/ to .gitignore before your first push. A repo with node_modules committed is unusable for your teammates and unreadable for me. Your app must still run for me from a clean clone: npm install, one command, done. Write both commands in your README.

"Saving data" means localStorage. Your data lives in one browser on one computer, and that's fine — just be honest about it in your README. "Logging in" means a fake login screen backed by localStorage. It's a demo of the interface, not real security. Never treat it as real. "Products" or "levels" or "menu items" live in a JavaScript array of objects that you write.

Anything is fair game as long as it clears the size bar. Some directions:

Type Example What makes it semester-sized Cafe / restaurant Order system with a menu, cart, order queue, and receipt Menu browsing, customization, cart math, order history Store Online shop with categories, cart, wishlist, checkout flow Filtering, search, cart state, multi-step checkout Game Puzzle, quiz, tower defense, idle clicker, card game Game loop, scoring, levels, save state, leaderboard Booking Salon, clinic, or court reservation Calendar UI, time slots, conflict handling, confirmations Tracker Habit, budget, fitness, or study tracker Data entry, charts, history views, streaks Learning Flashcards, language drills, typing trainer Deck management, progress tracking, statistics Event Ticketing, seat picker, event listings Seat map, filtering, cart, ticket generation Bring your own idea if you have one. The best projects usually come from somebody on the team having an actual problem to solve.

