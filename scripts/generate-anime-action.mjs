import fs from 'node:fs';
import path from 'node:path';

const bgDir = path.resolve('public/backgrounds');

// 31. Anime Ghoul Cyan & Ink Splatter (Directly from User Upload 1)
const animeGhoulCyan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="cyanBlock" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="60%" stop-color="#00B4D8" />
      <stop offset="100%" stop-color="#0077B6" />
    </linearGradient>
    <linearGradient id="darkBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F1115" />
      <stop offset="100%" stop-color="#050608" />
    </linearGradient>
  </defs>
  <!-- Dark Background with Shadow Anime Face Silhouette -->
  <rect width="2560" height="1440" fill="url(#darkBg)" />
  <!-- Shadow Anime Hair in Background (Ghosted) -->
  <g fill="#181B22" opacity="0.4">
    <polygon points="1280,100 1120,420 1280,360 1440,420" />
    <polygon points="1060,200 920,520 1060,460" />
    <polygon points="1500,200 1640,520 1500,460" />
  </g>
  <!-- Viewport Safe Crop Band -->
  <g transform="translate(0, 508.5)">
    <!-- White Top & Bottom Hairline Borders -->
    <line x1="0" y1="0" x2="2560" y2="0" stroke="#FFFFFF" stroke-width="6" />
    <line x1="0" y1="423" x2="2560" y2="423" stroke="#FFFFFF" stroke-width="6" />
    <!-- Left Electric Cyan Block -->
    <rect x="0" y="3" width="940" height="417" fill="url(#cyanBlock)" />
    <!-- Right Black Canvas -->
    <rect x="940" y="3" width="1620" height="417" fill="#000000" />
    <!-- Cyan Paint Splatter on Black Side -->
    <g fill="#00D2FF">
      <ellipse cx="1020" cy="80" rx="35" ry="12" transform="rotate(-30 1020 80)" />
      <ellipse cx="1140" cy="140" rx="20" ry="7" transform="rotate(-15 1140 140)" />
      <circle cx="1080" cy="60" r="10" />
      <circle cx="1110" cy="90" r="6" />
      <circle cx="1220" cy="120" r="4" />
      <ellipse cx="2300" cy="120" rx="60" ry="22" transform="rotate(-40 2300 120)" />
      <circle cx="2380" cy="80" r="14" />
      <circle cx="2420" cy="140" r="8" />
      <ellipse cx="2200" cy="320" rx="80" ry="25" transform="rotate(30 2200 320)" />
      <circle cx="2320" cy="360" r="16" />
    </g>
    <!-- White-haired Anime Character Silhouette on Cyan Block -->
    <g transform="translate(680, 240)">
      <!-- Black Shirt & Collar -->
      <path d="M -160 180 L -120 70 L 120 70 L 160 180 Z" fill="#0A0B0E" />
      <!-- Skin Tone Face & Neck -->
      <path d="M -60 70 L -50 0 L 50 0 L 60 70 Z" fill="#FFE3D6" />
      <!-- Spiky White Hair -->
      <g fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2">
        <polygon points="-70,-60 -110,10 -60,0" />
        <polygon points="-50,-80 -80,-10 -30,-20" />
        <polygon points="-20,-100 -40,-20 0,-30" />
        <polygon points="10,-100 -10,-20 30,-30" />
        <polygon points="40,-85 20,-10 65,0" />
        <polygon points="65,-60 40,10 90,20" />
      </g>
      <!-- Black Eye Patch / Mask -->
      <rect x="-35" y="-10" width="30" height="24" rx="4" fill="#0D0E12" />
      <!-- Cyan Eye -->
      <circle cx="25" cy="0" r="8" fill="#00D2FF" />
      <circle cx="25" cy="0" r="4" fill="#003566" />
    </g>
  </g>
</svg>`;

// 32. Anime Ultra Instinct Focus (Directly from User Upload 2)
const animeUltraInstinct = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <radialGradient id="arenaSpot" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#E2E8F0" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#64748B" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#090D14" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="silverHair" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>
    <linearGradient id="muscleSkin" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D4A383" />
      <stop offset="50%" stop-color="#A87355" />
      <stop offset="100%" stop-color="#6B422B" />
    </linearGradient>
  </defs>
  <!-- Dark Arena with Stadium Spotlights -->
  <rect width="2560" height="1440" fill="url(#arenaSpot)" />
  <!-- Arena Lights in Background -->
  <g fill="#FFFFFF" opacity="0.3">
    <ellipse cx="480" cy="240" rx="90" ry="40" />
    <ellipse cx="780" cy="180" rx="80" ry="35" />
    <ellipse cx="1780" cy="180" rx="80" ry="35" />
    <ellipse cx="2080" cy="240" rx="90" ry="40" />
  </g>
  <!-- Muscular Back Silhouette with Outstretched Arms (Center Safe Area Hero) -->
  <g transform="translate(1280, 720)">
    <!-- Back Torso & Arms -->
    <path d="M -640 140 Q -320 80, -180 80 Q 0 100, 180 80 Q 320 80, 640 140 Q 480 340, 200 420 Q 0 440, -200 420 Q -480 340, -640 140 Z" fill="url(#muscleSkin)" stroke="#3D2114" stroke-width="4" />
    <!-- Back Spinal Musculature Lines -->
    <path d="M 0 120 L 0 400" stroke="#3D2114" stroke-width="6" opacity="0.6" />
    <path d="M -80 180 Q 0 240, -80 320" stroke="#3D2114" stroke-width="4" fill="none" opacity="0.5" />
    <path d="M 80 180 Q 0 240, 80 320" stroke="#3D2114" stroke-width="4" fill="none" opacity="0.5" />
    <!-- Spiky Ultra Instinct Silver Hair -->
    <g fill="url(#silverHair)" stroke="#64748B" stroke-width="3">
      <polygon points="0,-180 -70,-60 -20,-80" />
      <polygon points="-60,-170 -120,-40 -50,-50" />
      <polygon points="-120,-130 -160,-20 -90,-20" />
      <polygon points="0,-180 70,-60 20,-80" />
      <polygon points="60,-170 120,-40 50,-50" />
      <polygon points="120,-130 160,-20 90,-20" />
      <polygon points="-40,-120 0,-50 40,-120" fill="#FFFFFF" />
    </g>
  </g>
</svg>`;

// 33. Anime Crimson Vigilante (Directly from User Upload 3)
const animeCrimsonVigilante = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="crimsonSmoke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E50914" />
      <stop offset="40%" stop-color="#B8000A" />
      <stop offset="80%" stop-color="#540005" />
      <stop offset="100%" stop-color="#140002" />
    </linearGradient>
  </defs>
  <rect width="2560" height="1440" fill="url(#crimsonSmoke)" />
  <!-- Large Grungy Weathered Background Text Behind Hero -->
  <text x="1280" y="820" font-family="'Impact', 'Arial Black', sans-serif" font-size="340" font-weight="900" fill="#000000" fill-opacity="0.3" text-anchor="middle" letter-spacing="40">VIGILANTE</text>
  <!-- Dark Knight Cowl / Hero Silhouette Center -->
  <g transform="translate(1080, 680)" fill="#0D0B0E">
    <!-- Cape Flowing Left & Right -->
    <path d="M -300 420 Q -100 120, -50 40 Q 150 40, 350 420 Z" />
    <!-- Armored Chest Plate with Bat Symbol -->
    <polygon points="-80,120 0,60 80,120 60,240 -60,240" fill="#17141A" />
    <polygon points="0,90 -40,70 -10,130 0,110 10,130 40,70" fill="#000000" />
    <!-- Cowl / Head with Ears Profile -->
    <path d="M -50 20 L -60 -120 L -30 -40 L 0 -120 L 20 20 Z" />
    <!-- Jawline Highlight in Crimson Glow -->
    <path d="M -30 20 Q 0 50, 20 20" stroke="#E50914" stroke-width="3" fill="none" opacity="0.6" />
  </g>
</svg>`;

// 34. Anime Shadow Eyes Splatter (Directly from User Upload 4)
const animeShadowEyes = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <!-- Pure Black Canvas -->
  <rect width="2560" height="1440" fill="#000000" />
  <!-- Viewport Safe Crop Band with White Framing Lines -->
  <g transform="translate(0, 508.5)">
    <line x1="0" y1="0" x2="2560" y2="0" stroke="#FFFFFF" stroke-width="6" />
    <line x1="0" y1="423" x2="2560" y2="423" stroke="#FFFFFF" stroke-width="6" />
    <!-- Red Spray Paint Splatter Center Right -->
    <g fill="#D90429">
      <ellipse cx="1400" cy="200" rx="160" ry="120" />
      <circle cx="1320" cy="120" r="30" />
      <circle cx="1480" cy="100" r="25" />
      <circle cx="1290" cy="280" r="40" />
      <circle cx="1520" cy="260" r="35" />
      <circle cx="1240" cy="180" r="18" />
      <circle cx="1580" cy="220" r="22" />
      <!-- Spray Drops -->
      <circle cx="1340" cy="60" r="10" />
      <circle cx="1440" cy="50" r="8" />
      <circle cx="1220" cy="240" r="12" />
      <circle cx="1620" cy="180" r="10" />
    </g>
    <!-- Black Eye Mask Stencil Cutting Into Red -->
    <circle cx="1400" cy="200" r="110" fill="#000000" />
    <!-- Glowing Sharp White Anime Eyes in Center Safe Area -->
    <g fill="#FFFFFF">
      <!-- Left Eye -->
      <path d="M 1180 210 Q 1240 180, 1310 205 Q 1250 240, 1180 210 Z" />
      <!-- Right Eye -->
      <path d="M 1490 205 Q 1560 180, 1620 210 Q 1550 240, 1490 205 Z" />
    </g>
  </g>
</svg>`;

const animeFiles = {
  'anime-ghoul-cyan-splatter.svg': animeGhoulCyan,
  'anime-ultra-instinct.svg': animeUltraInstinct,
  'anime-crimson-vigilante.svg': animeCrimsonVigilante,
  'anime-shadow-eyes-splatter.svg': animeShadowEyes,
};

for (const [filename, content] of Object.entries(animeFiles)) {
  fs.writeFileSync(path.join(bgDir, filename), content.trim());
  console.log('Created anime action background: ' + filename);
}
