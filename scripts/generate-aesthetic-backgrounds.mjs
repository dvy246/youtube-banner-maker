import fs from 'node:fs';
import path from 'node:path';

const bgDir = path.resolve('public/backgrounds');
if (!fs.existsSync(bgDir)) {
  fs.mkdirSync(bgDir, { recursive: true });
}

// 7. Sky Rainbow Dream (Inspired by User Ref Images 1-3)
const skyRainbowDream = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D5584" />
      <stop offset="40%" stop-color="#4B77A8" />
      <stop offset="70%" stop-color="#7B9DC2" />
      <stop offset="100%" stop-color="#AEC4DB" />
    </linearGradient>
    <linearGradient id="cloudPink" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="60%" stop-color="#F5D0E3" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#E2B4D3" stop-opacity="0.6" />
    </linearGradient>
    <linearGradient id="rainbow1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF9AA2" />
      <stop offset="20%" stop-color="#FFB7B2" />
      <stop offset="40%" stop-color="#FFDAC1" />
      <stop offset="60%" stop-color="#E2F0CB" />
      <stop offset="80%" stop-color="#B5EAD7" />
      <stop offset="100%" stop-color="#C7CEEA" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#skyGrad)" />
  <!-- Dreamy Soft Cloud Masses -->
  <g fill="url(#cloudPink)">
    <ellipse cx="480" cy="520" rx="420" ry="240" />
    <ellipse cx="260" cy="620" rx="340" ry="200" />
    <ellipse cx="640" cy="440" rx="360" ry="220" />
    <ellipse cx="2080" cy="500" rx="440" ry="260" />
    <ellipse cx="2320" cy="620" rx="360" ry="220" />
    <ellipse cx="1900" cy="420" rx="380" ry="220" />
    <ellipse cx="1280" cy="1100" rx="900" ry="320" />
    <ellipse cx="600" cy="1180" rx="600" ry="280" />
    <ellipse cx="1960" cy="1180" rx="600" ry="280" />
  </g>
  <!-- Minimalist Pastel Rainbow (Mobile Safe Area Center) -->
  <g transform="translate(1280, 680)">
    <path d="M -70 0 A 70 70 0 0 1 70 0" fill="none" stroke="#FF9AA2" stroke-width="6" stroke-linecap="round" />
    <path d="M -58 0 A 58 58 0 0 1 58 0" fill="none" stroke="#FFB7B2" stroke-width="6" stroke-linecap="round" />
    <path d="M -46 0 A 46 46 0 0 1 46 0" fill="none" stroke="#FFDAC1" stroke-width="6" stroke-linecap="round" />
    <path d="M -34 0 A 34 34 0 0 1 34 0" fill="none" stroke="#E2F0CB" stroke-width="6" stroke-linecap="round" />
    <path d="M -22 0 A 22 22 0 0 1 22 0" fill="none" stroke="#B5EAD7" stroke-width="6" stroke-linecap="round" />
    <path d="M -10 0 A 10 10 0 0 1 10 0" fill="none" stroke="#C7CEEA" stroke-width="6" stroke-linecap="round" />
  </g>
  <!-- Twinkle Stars -->
  <g fill="#FFFFFF" opacity="0.9">
    <path d="M 1060 760 Q 1065 765, 1070 765 Q 1065 765, 1065 770 Q 1065 765, 1060 765 Q 1065 765, 1065 760 Z" transform="scale(3) translate(-700,-500)" />
    <path d="M 1500 730 Q 1505 735, 1510 735 Q 1505 735, 1505 740 Q 1505 735, 1500 735 Q 1505 735, 1505 730 Z" transform="scale(3) translate(-990,-480)" />
    <circle cx="820" cy="420" r="3" />
    <circle cx="1740" cy="460" r="3.5" />
    <circle cx="1620" cy="840" r="2.5" />
    <circle cx="940" cy="820" r="2.5" />
  </g>
</svg>`;

// 8. Floral Rose Gold Frame (Inspired by User Ref Image 4)
const floralRoseGoldFrame = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="silkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCECEF" />
      <stop offset="50%" stop-color="#F7D3DA" />
      <stop offset="100%" stop-color="#EDB8C3" />
    </linearGradient>
    <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8B4B8" />
      <stop offset="50%" stop-color="#B76E79" />
      <stop offset="100%" stop-color="#8E4A55" />
    </linearGradient>
    <radialGradient id="marbleTexture" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#F9F5F6" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#F0E4E7" stop-opacity="0.95" />
    </radialGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#silkBg)" />
  <!-- Center Safe-Area Frame (1546 x 423 px proportioned) -->
  <g transform="translate(1280, 720)">
    <!-- Outer Marble Backplate -->
    <rect x="-773" y="-211.5" width="1546" height="423" rx="16" fill="url(#marbleTexture)" stroke="url(#roseGold)" stroke-width="4" />
    <!-- Inner Accent Frame -->
    <rect x="-750" y="-190" width="1500" height="380" rx="8" fill="none" stroke="url(#roseGold)" stroke-width="2" stroke-dasharray="8 6" />
    <!-- Inner Focus Frame for Channel Name -->
    <rect x="-420" y="-110" width="840" height="220" rx="10" fill="#FFFFFF" fill-opacity="0.75" stroke="#1A0A10" stroke-width="3" />
  </g>
  <!-- Botanical Roses on Left & Right Corners of the Inner Box -->
  <g fill="#1A0A10" opacity="0.9">
    <!-- Left Rose Blossom -->
    <path d="M 800 660 C 820 630, 860 640, 870 670 C 880 700, 850 730, 810 720 C 780 710, 780 680, 800 660 Z" />
    <path d="M 780 730 Q 820 780, 850 820 Q 860 770, 840 730 Z" />
    <circle cx="835" cy="675" r="12" fill="#FFFFFF" />
    <!-- Right Rose Blossom -->
    <path d="M 1760 660 C 1740 630, 1700 640, 1690 670 C 1680 700, 1710 730, 1750 720 C 1780 710, 1780 680, 1760 660 Z" />
    <path d="M 1780 730 Q 1740 780, 1710 820 Q 1700 770, 1720 730 Z" />
    <circle cx="1725" cy="675" r="12" fill="#FFFFFF" />
  </g>
  <!-- Rose Gold Shimmer Polka Dots on Marble Band -->
  <g fill="url(#roseGold)" opacity="0.6">
    <circle cx="620" cy="640" r="14" />
    <circle cx="680" cy="700" r="10" />
    <circle cx="730" cy="650" r="12" />
    <circle cx="660" cy="780" r="16" />
    <circle cx="1880" cy="640" r="14" />
    <circle cx="1940" cy="700" r="10" />
    <circle cx="1830" cy="760" r="12" />
    <circle cx="1900" cy="800" r="16" />
  </g>
</svg>`;

// 9. Boho Sun Terracotta (Inspired by User Ref Image 5)
const bohoSunTerracotta = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="bohoPaper" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBF7EE" />
      <stop offset="100%" stop-color="#F5ECE1" />
    </linearGradient>
    <linearGradient id="clay" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97A53" />
      <stop offset="100%" stop-color="#B85532" />
    </linearGradient>
    <linearGradient id="warmOchre" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5AF77" />
      <stop offset="100%" stop-color="#CB8D4D" />
    </linearGradient>
    <linearGradient id="dustyPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E9B9A6" />
      <stop offset="100%" stop-color="#D69984" />
    </linearGradient>
  </defs>
  <!-- Linen Paper Canvas -->
  <rect width="2560" height="1440" fill="url(#bohoPaper)" />
  <!-- Outer Frame Color (Reference background) -->
  <rect x="0" y="0" width="2560" height="260" fill="#CB7C66" />
  <rect x="0" y="1180" width="2560" height="260" fill="#CB7C66" />
  <!-- Organic Blob Shapes in Safe Zone -->
  <path d="M 260 520 C 440 480, 560 620, 620 780 C 680 940, 420 1060, 260 1020 Z" fill="url(#dustyPink)" opacity="0.85" />
  <path d="M 1800 380 C 1980 340, 2220 420, 2260 560 C 2300 700, 2120 780, 1940 760 Z" fill="url(#dustyPink)" opacity="0.85" />
  <!-- Terracotta Rainbow Arch (Bottom Right) -->
  <g transform="translate(1820, 1180)">
    <path d="M -240 0 A 240 240 0 0 1 240 0" fill="none" stroke="#9E5948" stroke-width="45" />
    <path d="M -170 0 A 170 170 0 0 1 170 0" fill="none" stroke="#D97A53" stroke-width="35" />
    <path d="M -110 0 A 110 110 0 0 1 110 0" fill="none" stroke="#E5AF77" stroke-width="30" />
  </g>
  <!-- Minimalist Sunburst with Radiating Rays -->
  <g transform="translate(1780, 680)">
    <circle cx="0" cy="0" r="50" fill="url(#clay)" />
    <g stroke="#3A2823" stroke-width="2.5" opacity="0.75">
      <line x1="0" y1="-80" x2="0" y2="-120" />
      <line x1="56" y1="-56" x2="85" y2="-85" />
      <line x1="80" y1="0" x2="120" y2="0" />
      <line x1="56" y1="56" x2="85" y2="85" />
      <line x1="0" y1="80" x2="0" y2="120" />
      <line x1="-56" y1="56" x2="-85" y2="85" />
      <line x1="-80" y1="0" x2="-120" y2="0" />
      <line x1="-56" y1="-56" x2="-85" y2="-85" />
    </g>
  </g>
  <!-- Botanical Leaf Branch (Left) -->
  <g fill="#4A342E" stroke="#4A342E" stroke-width="3">
    <path d="M 280 940 Q 420 800, 360 620" fill="none" />
    <ellipse cx="330" cy="850" rx="26" ry="14" transform="rotate(-35 330 850)" />
    <ellipse cx="385" cy="790" rx="26" ry="14" transform="rotate(35 385 790)" />
    <ellipse cx="360" cy="710" rx="26" ry="14" transform="rotate(-30 360 710)" />
    <ellipse cx="400" cy="650" rx="26" ry="14" transform="rotate(30 400 650)" />
    <ellipse cx="365" cy="590" rx="26" ry="14" transform="rotate(-20 365 590)" />
  </g>
  <!-- Terrazzo Pebble Cluster -->
  <g fill="#8E4638">
    <ellipse cx="880" cy="880" rx="14" ry="10" transform="rotate(15 880 880)" />
    <ellipse cx="920" cy="860" rx="12" ry="8" transform="rotate(-25 920 860)" />
    <ellipse cx="900" cy="910" rx="16" ry="11" transform="rotate(45 900 910)" />
    <ellipse cx="940" cy="900" rx="10" ry="7" transform="rotate(10 940 900)" />
    <ellipse cx="970" cy="875" rx="14" ry="9" transform="rotate(-15 970 875)" />
    <ellipse cx="950" cy="935" rx="12" ry="8" transform="rotate(30 950 935)" />
  </g>
</svg>`;

// 10. Dark Crimson Plate (Inspired by Latest Uploaded Image 1)
const darkCrimsonPlate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="darkStone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141619" />
      <stop offset="50%" stop-color="#0E1012" />
      <stop offset="100%" stop-color="#08090A" />
    </linearGradient>
    <linearGradient id="crackedRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E61E2B" />
      <stop offset="50%" stop-color="#B8141F" />
      <stop offset="100%" stop-color="#730B12" />
    </linearGradient>
    <filter id="plateShadow">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>
  <rect width="2560" height="1440" fill="url(#darkStone)" />
  <!-- Crimson Weathered Plate in Center Safe Area -->
  <g transform="translate(1280, 720)" filter="url(#plateShadow)">
    <rect x="-680" y="-140" width="1360" height="280" rx="36" fill="url(#crackedRed)" stroke="#4A060A" stroke-width="8" />
    <!-- Plate Cracks & Fractures -->
    <path d="M -380 -140 L -360 -40 L -380 40 L -350 140" stroke="#1A0204" stroke-width="6" fill="none" />
    <path d="M 0 -140 L 20 -20 L -10 60 L 15 140" stroke="#1A0204" stroke-width="7" fill="none" />
    <path d="M 360 -140 L 340 -50 L 370 30 L 350 140" stroke="#1A0204" stroke-width="6" fill="none" />
    <!-- 3D Play Button Icon -->
    <polygon points="-580,-60 -580,60 -480,0" fill="#0D0E10" stroke="#25272B" stroke-width="4" />
  </g>
  <!-- Ambient Crimson Berry Particles -->
  <g fill="#D91825">
    <circle cx="520" cy="480" r="16" />
    <circle cx="590" cy="420" r="10" />
    <circle cx="640" cy="520" r="12" />
    <circle cx="1980" cy="460" r="14" />
    <circle cx="2060" cy="520" r="10" />
    <circle cx="1920" cy="540" r="12" />
    <circle cx="1280" cy="440" r="8" />
  </g>
</svg>`;

// 11. Grunge Red Splatter (Inspired by Latest Uploaded Image 2)
const grungeRedSplatter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="grungeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0A0B" />
      <stop offset="50%" stop-color="#141416" />
      <stop offset="100%" stop-color="#070708" />
    </linearGradient>
    <linearGradient id="redSlash" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF0033" />
      <stop offset="100%" stop-color="#80001A" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#grungeBg)" />
  <!-- Center Viewport Band (2560 x 423 px crop) -->
  <rect y="508.5" width="2560" height="423" fill="#000000" />
  <!-- Dynamic Red Blood & Brush Paint Splatters -->
  <path d="M 0 510 L 620 510 L 880 930 L 0 930 Z" fill="url(#redSlash)" opacity="0.9" />
  <path d="M 2560 510 L 1940 510 L 1680 930 L 2560 930 Z" fill="url(#redSlash)" opacity="0.9" />
  <!-- Grunge Splatter Particles & Streaks -->
  <g fill="#FF0033">
    <ellipse cx="940" cy="560" rx="40" ry="12" transform="rotate(-25 940 560)" />
    <ellipse cx="1020" cy="530" rx="24" ry="8" transform="rotate(-15 1020 530)" />
    <circle cx="860" cy="620" r="8" />
    <circle cx="880" cy="670" r="14" />
    <circle cx="910" cy="740" r="10" />
    <ellipse cx="1620" cy="880" rx="50" ry="14" transform="rotate(-20 1620 880)" />
    <ellipse cx="1540" cy="910" rx="30" ry="9" transform="rotate(-10 1540 910)" />
    <circle cx="1700" cy="820" r="8" />
    <circle cx="1680" cy="760" r="12" />
  </g>
  <!-- YouTube Play and Bell Red Accents in Safe Area -->
  <g transform="translate(420, 720)">
    <rect x="-70" y="-45" width="140" height="90" rx="20" fill="#FF0033" />
    <polygon points="-15,-25 -15,25 25,0" fill="#FFFFFF" />
  </g>
  <g transform="translate(2140, 720)">
    <circle cx="0" cy="0" r="50" fill="#FF0033" />
    <path d="M -20 15 C -20 15, -20 -15, 0 -22 C 20 -15, 20 15, 20 15 L 25 20 L -25 20 Z" fill="#FFFFFF" />
    <circle cx="0" cy="26" r="6" fill="#FFFFFF" />
  </g>
</svg>`;

// 12. Neon Growth Chart (Inspired by Latest Uploaded Image 3)
const neonGrowthChart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="charcoalDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141416" />
      <stop offset="100%" stop-color="#0A0A0C" />
    </linearGradient>
    <linearGradient id="crimsonBottom" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D90429" />
      <stop offset="40%" stop-color="#99001A" />
      <stop offset="100%" stop-color="#4D000D" />
    </linearGradient>
    <filter id="neonRedGlow">
      <feGaussianBlur stdDeviation="16" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Dark Slate Background -->
  <rect width="2560" height="1440" fill="url(#charcoalDark)" />
  <!-- Red Ascending Chart Polygon -->
  <polygon points="0,1440 0,1380 180,1320 280,1360 380,1280 480,1330 760,1120 900,1210 1180,980 1360,1080 1660,820 1840,860 2200,840 2560,0 2560,1440" fill="url(#crimsonBottom)" />
  <!-- Electric Neon Red Ascending Edge Line -->
  <polyline points="0,1380 180,1320 280,1360 380,1280 480,1330 760,1120 900,1210 1180,980 1360,1080 1660,820 1840,860 2200,840 2560,0" fill="none" stroke="#FF1A35" stroke-width="12" filter="url(#neonRedGlow)" stroke-linejoin="round" />
  <polyline points="0,1380 180,1320 280,1360 380,1280 480,1330 760,1120 900,1210 1180,980 1360,1080 1660,820 1840,860 2200,840 2560,0" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
  <!-- Grid Lines Subtly Underlying Finance Theme -->
  <g stroke="#FFFFFF" stroke-width="1" opacity="0.04">
    <line x1="0" y1="360" x2="2560" y2="360" />
    <line x1="0" y1="720" x2="2560" y2="720" />
    <line x1="0" y1="1080" x2="2560" y2="1080" />
    <line x1="640" y1="0" x2="640" y2="1440" />
    <line x1="1280" y1="0" x2="1280" y2="1440" />
    <line x1="1920" y1="0" x2="1920" y2="1440" />
  </g>
</svg>`;

const files = {
  'sky-rainbow-dream.svg': skyRainbowDream,
  'floral-rose-gold-frame.svg': floralRoseGoldFrame,
  'boho-sun-terracotta.svg': bohoSunTerracotta,
  'dark-crimson-plate.svg': darkCrimsonPlate,
  'grunge-red-splatter.svg': grungeRedSplatter,
  'neon-growth-chart.svg': neonGrowthChart,
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(bgDir, filename), content.trim());
  console.log('Created: ' + filename);
}
