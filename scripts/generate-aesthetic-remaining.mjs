import fs from 'node:fs';
import path from 'node:path';

const bgDir = path.resolve('public/backgrounds');

// 13. Sky Cotton Candy
const skyCottonCandy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="candySky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#C5D9F8" />
      <stop offset="40%" stop-color="#E2D4F0" />
      <stop offset="75%" stop-color="#F9CEE2" />
      <stop offset="100%" stop-color="#FEDAC2" />
    </linearGradient>
    <radialGradient id="cloudGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="80%" stop-color="#FDE8F1" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#E8D5EC" stop-opacity="0.4" />
    </radialGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#candySky)" />
  <g fill="url(#cloudGlow)">
    <circle cx="340" cy="820" r="320" />
    <circle cx="680" cy="880" r="280" />
    <circle cx="1020" cy="940" r="240" />
    <circle cx="1540" cy="920" r="260" />
    <circle cx="1920" cy="860" r="300" />
    <circle cx="2280" cy="800" r="340" />
    <ellipse cx="1280" cy="1120" rx="900" ry="280" fill="#FFFFFF" fill-opacity="0.6" />
  </g>
  <!-- Twinkle Stars -->
  <g fill="#FFFFFF" opacity="0.85">
    <circle cx="620" cy="420" r="3" />
    <circle cx="940" cy="360" r="2" />
    <circle cx="1280" cy="480" r="4" />
    <circle cx="1680" cy="380" r="2.5" />
    <circle cx="2040" cy="440" r="3.5" />
  </g>
</svg>`;

// 14. Sky Golden Hour
const skyGoldenHour = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="goldenSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D173E" />
      <stop offset="35%" stop-color="#6B2956" />
      <stop offset="65%" stop-color="#B84A53" />
      <stop offset="85%" stop-color="#F28E4B" />
      <stop offset="100%" stop-color="#FED064" />
    </linearGradient>
    <radialGradient id="goldenSun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
      <stop offset="30%" stop-color="#FFF3B0" stop-opacity="0.8" />
      <stop offset="70%" stop-color="#F28E4B" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#B84A53" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#goldenSky)" />
  <circle cx="1280" cy="820" r="420" fill="url(#goldenSun)" />
  <!-- Dramatic Golden Cloud Pillars -->
  <g fill="#42183D" opacity="0.65">
    <ellipse cx="400" cy="980" rx="520" ry="220" />
    <ellipse cx="2160" cy="980" rx="520" ry="220" />
    <ellipse cx="1280" cy="1160" rx="800" ry="240" />
  </g>
</svg>`;

// 15. Sky Starry Lavender
const skyStarryLavender = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="lavenderSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0E091E" />
      <stop offset="45%" stop-color="#21153B" />
      <stop offset="75%" stop-color="#3D2963" />
      <stop offset="100%" stop-color="#5E428C" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#lavenderSky)" />
  <!-- Crescent Moon in Center Safe Zone -->
  <g transform="translate(1280, 560)">
    <circle cx="0" cy="0" r="60" fill="#FFFBE6" />
    <circle cx="22" cy="-10" r="55" fill="#21153B" />
  </g>
  <!-- Constellation sparkle points -->
  <g fill="#EAD9FF">
    <circle cx="820" cy="540" r="3" />
    <circle cx="940" cy="620" r="2" />
    <circle cx="1060" cy="560" r="3.5" />
    <circle cx="1500" cy="560" r="3.5" />
    <circle cx="1620" cy="620" r="2" />
    <circle cx="1740" cy="540" r="3" />
    <circle cx="480" cy="420" r="2" />
    <circle cx="2080" cy="420" r="2" />
  </g>
</svg>`;

// 16. Sky Dreamy Aura
const skyDreamyAura = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <radialGradient id="auraPink" cx="30%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#FFA8CC" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FEEFF5" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="auraCyan" cx="70%" cy="60%" r="60%">
      <stop offset="0%" stop-color="#99E8F5" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FEEFF5" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="2560" height="1440" fill="#FFF2F7" />
  <rect width="2560" height="1440" fill="url(#auraPink)" />
  <rect width="2560" height="1440" fill="url(#auraCyan)" />
  <ellipse cx="1280" cy="720" rx="600" ry="240" fill="#FFFFFF" fill-opacity="0.4" />
</svg>`;

// 17. Floral Blush Silk
const floralBlushSilk = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="silkFlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF0F2" />
      <stop offset="35%" stop-color="#F5DCE2" />
      <stop offset="70%" stop-color="#EBBBC6" />
      <stop offset="100%" stop-color="#DF9DAE" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#silkFlow)" />
  <!-- Wave Folds -->
  <path d="M 0 340 C 600 480, 900 220, 1600 380 C 2100 480, 2300 320, 2560 400 L 2560 1440 L 0 1440 Z" fill="#EBBBC6" opacity="0.35" />
  <path d="M 0 680 C 800 820, 1200 580, 1800 740 C 2200 840, 2400 700, 2560 760 L 2560 1440 L 0 1440 Z" fill="#DF9DAE" opacity="0.3" />
  <!-- Sparkles -->
  <g fill="#FFFFFF" opacity="0.8">
    <circle cx="820" cy="680" r="3" />
    <circle cx="1280" cy="620" r="4" />
    <circle cx="1740" cy="680" r="3" />
  </g>
</svg>`;

// 18. Floral Vintage Peony
const floralVintagePeony = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#FAF7F5" />
  <g stroke="#3A2227" stroke-width="2.5" fill="none" opacity="0.6">
    <!-- Left floral branch -->
    <path d="M 0 720 Q 340 680, 480 720" />
    <circle cx="380" cy="660" r="40" />
    <circle cx="440" cy="650" r="30" />
    <circle cx="420" cy="740" r="35" />
    <!-- Right floral branch -->
    <path d="M 2560 720 Q 2220 680, 2080 720" />
    <circle cx="2180" cy="660" r="40" />
    <circle cx="2120" cy="650" r="30" />
    <circle cx="2140" cy="740" r="35" />
  </g>
  <!-- Framing Border in Safe Zone -->
  <rect x="507" y="508.5" width="1546" height="423" rx="12" fill="none" stroke="#D89EAA" stroke-width="2" stroke-dasharray="6 6" />
</svg>`;

// 19. Floral White Marble Gold
const floralWhiteMarbleGold = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="goldVein" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5BA73" />
      <stop offset="50%" stop-color="#C59B4B" />
      <stop offset="100%" stop-color="#8C6826" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="#F8F9FA" />
  <!-- Organic Gold Marble Veins framing corners -->
  <path d="M 0 120 Q 400 240, 700 180 T 1200 140" fill="none" stroke="url(#goldVein)" stroke-width="4" opacity="0.7" />
  <path d="M 120 0 Q 240 400, 180 700 T 140 1200" fill="none" stroke="url(#goldVein)" stroke-width="3" opacity="0.6" />
  <path d="M 2560 1320 Q 2160 1200, 1860 1260 T 1360 1300" fill="none" stroke="url(#goldVein)" stroke-width="4" opacity="0.7" />
  <!-- Center Safe Card -->
  <rect x="507" y="508.5" width="1546" height="423" rx="16" fill="#FFFFFF" stroke="url(#goldVein)" stroke-width="3" fill-opacity="0.9" />
</svg>`;

// 20. Floral Botanical Arch
const floralBotanicalArch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#FDFBF9" />
  <!-- Double Pill Arch in Safe Center -->
  <rect x="640" y="540" width="1280" height="360" rx="180" fill="none" stroke="#D19C97" stroke-width="3" />
  <rect x="660" y="560" width="1240" height="320" rx="160" fill="none" stroke="#E3B7B3" stroke-width="1.5" />
  <!-- Eucalyptus Line Sprigs -->
  <g stroke="#4A5844" stroke-width="2" fill="none" opacity="0.7">
    <path d="M 600 720 Q 560 620, 520 540" />
    <circle cx="560" cy="620" r="14" fill="#C5D3C1" fill-opacity="0.5" />
    <circle cx="530" cy="570" r="12" fill="#C5D3C1" fill-opacity="0.5" />
    <path d="M 1960 720 Q 2000 620, 2040 540" />
    <circle cx="2000" cy="620" r="14" fill="#C5D3C1" fill-opacity="0.5" />
    <circle cx="2030" cy="570" r="12" fill="#C5D3C1" fill-opacity="0.5" />
  </g>
</svg>`;

// 21. Boho Desert Arch
const bohoDesertArch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#FAF5ED" />
  <!-- Desert Dunes -->
  <path d="M 0 920 Q 640 820, 1280 880 T 2560 840 L 2560 1440 L 0 1440 Z" fill="#E3A882" />
  <path d="M 0 1060 Q 820 960, 1640 1020 T 2560 980 L 2560 1440 L 0 1440 Z" fill="#C87A54" />
  <!-- Sandstone Arches Center Left -->
  <path d="M 400 920 A 180 180 0 0 1 760 920 Z" fill="#C87A54" opacity="0.8" />
  <circle cx="1280" cy="720" r="180" fill="#F4CB9A" opacity="0.6" />
</svg>`;

// 22. Boho Minimal Botanical
const bohoMinimalBotanical = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#F7F3EC" />
  <!-- Terracotta Sun Accent -->
  <circle cx="1280" cy="720" r="160" fill="#E89B7D" opacity="0.65" />
  <!-- Single-line Palm Leaf Left & Right -->
  <g stroke="#3D2E2B" stroke-width="3" fill="none" opacity="0.75">
    <path d="M 400 900 Q 560 760, 520 540" />
    <path d="M 520 540 Q 640 560, 680 620" />
    <path d="M 480 640 Q 620 680, 650 740" />
    <path d="M 2160 900 Q 2000 760, 2040 540" />
    <path d="M 2040 540 Q 1920 560, 1880 620" />
    <path d="M 2080 640 Q 1940 680, 1910 740" />
  </g>
</svg>`;

// 23. Boho Earthen Waves
const bohoEarthenWaves = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#FAF6EE" />
  <g fill="none" stroke="#BA6C4D" stroke-width="4" opacity="0.5">
    <path d="M 0 540 C 600 480, 1200 620, 1800 520 T 2560 560" />
    <path d="M 0 600 C 600 540, 1200 680, 1800 580 T 2560 620" />
    <path d="M 0 660 C 600 600, 1200 740, 1800 640 T 2560 680" />
    <path d="M 0 720 C 600 660, 1200 800, 1800 700 T 2560 740" />
    <path d="M 0 780 C 600 720, 1200 860, 1800 760 T 2560 800" />
  </g>
</svg>`;

// 24. Boho Terrazzo Luxe
const bohoTerrazzoLuxe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#F8F4EE" />
  <!-- Clean Safe Area Plate -->
  <rect x="507" y="508.5" width="1546" height="423" rx="16" fill="#FFFFFF" fill-opacity="0.95" stroke="#E3D7C5" stroke-width="2" />
  <!-- Terrazzo Stones Scattered Outside Safe Center -->
  <g opacity="0.7">
    <ellipse cx="280" cy="380" rx="30" ry="18" fill="#C87A54" transform="rotate(25 280 380)" />
    <ellipse cx="380" cy="460" rx="22" ry="14" fill="#6B8168" transform="rotate(-35 380 460)" />
    <ellipse cx="2280" cy="380" rx="30" ry="18" fill="#C87A54" transform="rotate(-25 2280 380)" />
    <ellipse cx="2180" cy="460" rx="22" ry="14" fill="#6B8168" transform="rotate(35 2180 460)" />
    <ellipse cx="320" cy="1080" rx="35" ry="20" fill="#E2A66C" transform="rotate(15 320 1080)" />
    <ellipse cx="2240" cy="1080" rx="35" ry="20" fill="#E2A66C" transform="rotate(-15 2240 1080)" />
  </g>
</svg>`;

// 25. Anime Cozy Rain
const animeCozyRain = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="rainNight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#060814" />
      <stop offset="50%" stop-color="#12182B" />
      <stop offset="100%" stop-color="#1E2742" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#rainNight)" />
  <!-- Neon Bokeh Orbs Outside Window -->
  <circle cx="480" cy="620" r="160" fill="#FF5E8E" fill-opacity="0.25" />
  <circle cx="720" cy="740" r="140" fill="#00E5FF" fill-opacity="0.2" />
  <circle cx="1840" cy="640" r="180" fill="#FFD15C" fill-opacity="0.2" />
  <circle cx="2120" cy="720" r="150" fill="#B388FF" fill-opacity="0.25" />
  <!-- Diagonal Rain Streaks -->
  <g stroke="#FFFFFF" stroke-width="1.5" opacity="0.35">
    <line x1="200" y1="0" x2="100" y2="1440" />
    <line x1="600" y1="0" x2="500" y2="1440" />
    <line x1="1000" y1="0" x2="900" y2="1440" />
    <line x1="1400" y1="0" x2="1300" y2="1440" />
    <line x1="1800" y1="0" x2="1700" y2="1440" />
    <line x1="2200" y1="0" x2="2100" y2="1440" />
  </g>
</svg>`;

// 26. Anime Vapor Gradient
const animeVaporGradient = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="vaporGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180033" />
      <stop offset="40%" stop-color="#4C0070" />
      <stop offset="70%" stop-color="#8F0075" />
      <stop offset="100%" stop-color="#FF6B6B" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#vaporGrad)" />
  <!-- Minimalist Japanese Aesthetic Geometric Frame -->
  <rect x="507" y="508.5" width="1546" height="423" rx="8" fill="none" stroke="#00F0FF" stroke-width="2" stroke-opacity="0.6" />
  <text x="1280" y="740" font-family="'Inter', sans-serif" font-size="140" font-weight="900" fill="#FFFFFF" fill-opacity="0.05" text-anchor="middle">新東京</text>
</svg>`;

// 27. Zen Bamboo Mist
const zenBambooMist = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="mistBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8EFEA" />
      <stop offset="50%" stop-color="#D2DFD5" />
      <stop offset="100%" stop-color="#BACDC0" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#mistBg)" />
  <!-- Bamboo Silhouettes Left & Right -->
  <g fill="#2B3D30" opacity="0.6">
    <rect x="240" y="0" width="18" height="1440" />
    <rect x="320" y="0" width="14" height="1440" opacity="0.4" />
    <rect x="2240" y="0" width="18" height="1440" />
    <rect x="2320" y="0" width="14" height="1440" opacity="0.4" />
  </g>
  <circle cx="1280" cy="720" r="180" fill="#FFFFFF" fill-opacity="0.5" />
</svg>`;

// 28. Zen Glassmorphic Prism
const zenGlassmorphicPrism = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F4E9FD" />
      <stop offset="35%" stop-color="#E1ECFD" />
      <stop offset="70%" stop-color="#DDF8F5" />
      <stop offset="100%" stop-color="#FAF1E6" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#prismGrad)" />
  <!-- Frosted Glass Plate -->
  <rect x="507" y="508.5" width="1546" height="423" rx="24" fill="#FFFFFF" fill-opacity="0.65" stroke="#FFFFFF" stroke-width="3" />
</svg>`;

// 29. Zen Monochrome Sand
const zenMonochromeSand = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <rect width="2560" height="1440" fill="#F4F1EA" />
  <!-- Concentric Zen Sand Ripples around Stone Left -->
  <g fill="none" stroke="#D3CCC0" stroke-width="3">
    <circle cx="380" cy="720" r="80" />
    <circle cx="380" cy="720" r="140" />
    <circle cx="380" cy="720" r="200" />
    <circle cx="2180" cy="720" r="80" />
    <circle cx="2180" cy="720" r="140" />
    <circle cx="2180" cy="720" r="200" />
  </g>
  <ellipse cx="380" cy="720" rx="45" ry="35" fill="#423E37" />
  <ellipse cx="2180" cy="720" rx="45" ry="35" fill="#423E37" />
</svg>`;

// 30. Zen Midnight Noir
const zenMidnightNoir = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <radialGradient id="noirSpot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1F242D" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#090A0D" stop-opacity="1" />
    </radialGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#noirSpot)" />
  <!-- Clean Titanium Hairline Safe Frame -->
  <rect x="507" y="508.5" width="1546" height="423" rx="16" fill="none" stroke="#2B323F" stroke-width="2" />
  <line x1="507" y1="720" x2="567" y2="720" stroke="#00F0FF" stroke-width="3" />
  <line x1="1993" y1="720" x2="2053" y2="720" stroke="#00F0FF" stroke-width="3" />
</svg>`;

const remainingFiles = {
  'sky-cotton-candy.svg': skyCottonCandy,
  'sky-golden-hour.svg': skyGoldenHour,
  'sky-starry-lavender.svg': skyStarryLavender,
  'sky-dreamy-aura.svg': skyDreamyAura,
  'floral-blush-silk.svg': floralBlushSilk,
  'floral-vintage-peony.svg': floralVintagePeony,
  'floral-white-marble-gold.svg': floralWhiteMarbleGold,
  'floral-botanical-arch.svg': floralBotanicalArch,
  'boho-desert-arch.svg': bohoDesertArch,
  'boho-minimal-botanical.svg': bohoMinimalBotanical,
  'boho-earthen-waves.svg': bohoEarthenWaves,
  'boho-terrazzo-luxe.svg': bohoTerrazzoLuxe,
  'anime-cozy-rain.svg': animeCozyRain,
  'anime-vapor-gradient.svg': animeVaporGradient,
  'zen-bamboo-mist.svg': zenBambooMist,
  'zen-glassmorphic-prism.svg': zenGlassmorphicPrism,
  'zen-monochrome-sand.svg': zenMonochromeSand,
  'zen-midnight-noir.svg': zenMidnightNoir,
};

for (const [filename, content] of Object.entries(remainingFiles)) {
  fs.writeFileSync(path.join(bgDir, filename), content.trim());
  console.log('Created: ' + filename);
}
