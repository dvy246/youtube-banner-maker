import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_DATA } from './template-manifest-data.mjs';

const previewsDir = path.resolve('public/previews');
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

const templatesDir = path.resolve('src/data/templates');
const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'));

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getColors(json) {
  const bg = json.scene?.background || {};
  let bg1 = '#07090E';
  let bg2 = '#141A29';
  let bg3 = '#07090E';

  if (bg.type === 'solid') {
    bg1 = bg.color || '#07090E';
    bg2 = bg1;
    bg3 = bg1;
  } else if (bg.type === 'gradient') {
    if (Array.isArray(bg.stops) && bg.stops.length >= 2) {
      bg1 = bg.stops[0];
      bg2 = bg.stops[Math.floor(bg.stops.length / 2)] || bg.stops[bg.stops.length - 1];
      bg3 = bg.stops[bg.stops.length - 1];
    } else {
      bg1 = bg.from || '#07090E';
      bg2 = bg.to || '#141A29';
      bg3 = bg.from || '#07090E';
    }
  }

  const titleLayer = json.scene?.layers?.find((l) => l.role === 'title' || (l.type === 'text' && (l.size ?? 50) >= 40));
  const taglineLayer = json.scene?.layers?.find((l) => l.role === 'tagline' || (l.type === 'text' && l !== titleLayer));
  const shapeLayer = json.scene?.layers?.find((l) => l.type === 'shape');

  const titleColor = titleLayer?.color || '#FFFFFF';
  const tagColor = taglineLayer?.color || '#94A3B8';
  const accentColor = shapeLayer?.color || '#38BDF8';

  return { bg1, bg2, bg3, titleColor, tagColor, accentColor };
}

/**
 * Renders a high-fidelity vector avatar portrait inside a circular photo frame.
 */
function renderVectorAvatar(id, seed, cx, cy, r, borderW = 12, borderColor = '#FFFFFF') {
  const clipId = `av-clip-${id}`;
  const gradId = `av-grad-${id}`;

  const skinTones = ['#FAD8C0', '#F3C5A0', '#E5A67D', '#D18E66'];
  const hairColors = ['#231610', '#3D2314', '#1A1A1A', '#A35223', '#4A3B32', '#6B21A8'];
  const clothesColors = ['#881337', '#1E3A8A', '#065F46', '#312E81', '#B45309', '#18181B', '#BE185D'];

  const skin = skinTones[seed % skinTones.length];
  const hair = hairColors[(seed >> 2) % hairColors.length];
  const clothes = clothesColors[(seed >> 4) % clothesColors.length];
  const hasGlasses = (seed % 2) === 0;

  return `
    <g transform="translate(${cx}, ${cy})">
      <defs>
        <clipPath id="${clipId}">
          <circle cx="0" cy="0" r="${r - borderW / 2}" />
        </clipPath>
        <radialGradient id="${gradId}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#E2E8F0" />
        </radialGradient>
      </defs>

      <!-- Frame Outer Drop Shadow & Ring -->
      <circle cx="0" cy="0" r="${r}" fill="none" stroke="${borderColor}" stroke-width="${borderW}" filter="drop-shadow(0 14px 28px rgba(0,0,0,0.32))" />

      <!-- Clipped Portrait -->
      <g clip-path="url(#${clipId})">
        <!-- Studio Background -->
        <rect x="-${r}" y="-${r}" width="${r * 2}" height="${r * 2}" fill="url(#${gradId})" />

        <!-- Torso / Shoulders -->
        <path d="M -${r * 0.92} ${r} C -${r * 0.75} ${r * 0.3}, -${r * 0.3} ${r * 0.12}, 0 ${r * 0.16} C ${r * 0.3} ${r * 0.12}, ${r * 0.75} ${r * 0.3}, ${r * 0.92} ${r} Z" fill="${clothes}" />

        <!-- Collar / Neck -->
        <path d="M -${r * 0.22} ${r * 0.18} L 0 ${r * 0.36} L ${r * 0.22} ${r * 0.18} L ${r * 0.18} -${r * 0.05} L -${r * 0.18} -${r * 0.05} Z" fill="${skin}" />

        <!-- Head / Face -->
        <ellipse cx="0" cy="-${r * 0.12}" rx="${r * 0.35}" ry="${r * 0.44}" fill="${skin}" />

        <!-- Hair -->
        <path d="M -${r * 0.38} -${r * 0.15} C -${r * 0.44} -${r * 0.65}, ${r * 0.44} -${r * 0.65}, ${r * 0.38} -${r * 0.15} C ${r * 0.34} -${r * 0.5}, -${r * 0.34} -${r * 0.5}, -${r * 0.38} -${r * 0.15} Z" fill="${hair}" />
        <ellipse cx="0" cy="-${r * 0.42}" rx="${r * 0.34}" ry="${r * 0.22}" fill="${hair}" />

        <!-- Eyes -->
        <ellipse cx="-${r * 0.13}" cy="-${r * 0.14}" rx="${r * 0.038}" ry="${r * 0.048}" fill="#0F172A" />
        <ellipse cx="${r * 0.13}" cy="-${r * 0.14}" rx="${r * 0.038}" ry="${r * 0.048}" fill="#0F172A" />

        <!-- Friendly Smile -->
        <path d="M -${r * 0.13} ${r * 0.07} Q 0 ${r * 0.17} ${r * 0.13} ${r * 0.07}" fill="none" stroke="#78350F" stroke-width="${Math.max(2, r * 0.024)}" stroke-linecap="round" />

        ${hasGlasses ? `
          <!-- Glasses -->
          <rect x="-${r * 0.25}" y="-${r * 0.22}" width="${r * 0.21}" height="${r * 0.16}" rx="${r * 0.04}" fill="none" stroke="#0F172A" stroke-width="${Math.max(2, r * 0.032)}" />
          <rect x="${r * 0.04}" y="-${r * 0.22}" width="${r * 0.21}" height="${r * 0.16}" rx="${r * 0.04}" fill="none" stroke="#0F172A" stroke-width="${Math.max(2, r * 0.032)}" />
          <line x1="-${r * 0.04}" y1="-${r * 0.14}" x2="${r * 0.04}" y2="-${r * 0.14}" stroke="#0F172A" stroke-width="${Math.max(2, r * 0.032)}" />
        ` : ''}
      </g>
    </g>
  `;
}

/**
 * Renders the YouTube Subscribe button with notification bell and animated clicking cursor hand.
 */
function renderAnimatedSubscribeBtn(x, y, btnColor = '#E60000', scale = 1.0) {
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <!-- Subscribe Pill Button with Tap Animation -->
      <g class="anim-btn">
        <rect width="280" height="66" rx="33" fill="${btnColor}" filter="drop-shadow(0 8px 18px rgba(0,0,0,0.32))" />
        <text x="116" y="41" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="1.5px" text-anchor="middle">SUBSCRIBE</text>
      </g>

      <!-- Ringing Notification Bell -->
      <g class="anim-bell" transform="translate(225, 33)">
        <path d="M 0 -13 C -5 -13, -8 -8, -8 0 L -11 9 L 11 9 L 8 0 C 8 -8, 5 -13, 0 -13 Z" fill="#FFFFFF" />
        <circle cx="0" cy="12" r="3" fill="#FFFFFF" />
      </g>

      <!-- Animated Clicking Pointer Hand Cursor -->
      <g class="anim-cursor" transform="translate(235, 42)">
        <path d="M 0 0 L 0 28 L 7 21 L 13 33 L 18 30 L 12 18 L 20 18 Z" fill="#FFFFFF" stroke="#111827" stroke-width="2.5" stroke-linejoin="round" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.45))" />
      </g>
    </g>
  `;
}

const ARCHETYPE_MAP = {
  // Business (12)
  'biz-authority': 'frame_center_card',   // Richard Manuel Finance Academy style
  'biz-freelance': 'frame_left_modern',    // Samuel Waterson style
  'biz-agency': 'frame_ribbon_vlog',       // Hannah Porter ribbon style
  'biz-pitch': 'frame_center_card',
  'biz-nomad': 'frame_left_modern',
  'biz-founder': 'sketch_doodle',
  'biz-ecommerce': 'gradient_mesh',
  'biz-director': 'deco_luxe',
  'biz-marketing': 'watercolor_bloom',
  'biz-product': 'swiss_clean',
  'biz-realestate': 'deco_luxe',
  'biz-venture': 'bold_split',

  // Tech (11)
  'tech-clean': 'frame_left_modern',
  'tech-cloud': 'frame_center_card',
  'tech-mobile': 'frame_ribbon_vlog',
  'tech-terminal': 'neon_glow',
  'tech-quantum': 'neon_glow',
  'tech-hardware': 'rgb_glitch',
  'tech-security': 'rgb_glitch',
  'tech-data': 'bold_split',
  'tech-saas': 'bold_split',
  'tech-neural': 'gradient_mesh',
  'white-minimal': 'swiss_clean',

  // Gaming (13)
  'gaming-esports': 'frame_left_modern',
  'gaming-tactical': 'frame_left_modern',
  'meme-cookie': 'frame_ribbon_vlog',
  'gaming-anime': 'halftone_pop',
  'gaming-retro': 'halftone_pop',
  'gaming-neon': 'neon_glow',
  'anime-cyber': 'neon_glow',
  'gaming-scifi': 'neon_glow',
  'black-stealth': 'rgb_glitch',
  'gaming-stealth': 'rgb_glitch',
  'gaming-speedrun': 'velocity_stripe',
  'gaming-voxel': 'sketch_doodle',
  'gaming-rpg': 'paint_stroke',

  // Vlog (10)
  'vlog-golden-hour': 'frame_ribbon_vlog',  // Hannah Porter style
  'vlog-coast': 'frame_ribbon_vlog',
  'vlog-editorial': 'frame_center_card',    // Richard Manuel style
  'vlog-wanderlust': 'frame_left_modern',   // Samuel Waterson style
  'vlog-tokyo': 'neon_glow',
  'vlog-alpine': 'torn_collage',
  'vlog-vanlife': 'torn_collage',
  'vlog-analog': 'film_noir',
  'vlog-cinema': 'film_noir',
  'vlog-urban': 'bold_split',

  // Lifestyle (11)
  'aesthetic-pastel': 'frame_ribbon_vlog',
  'life-glow': 'frame_center_card',
  'life-fashion': 'frame_left_modern',
  'life-ceramic': 'frame_ribbon_vlog',
  'life-grooming': 'frame_left_modern',
  'life-coffee': 'botanical_frame',
  'life-botanical': 'botanical_frame',
  'life-jewelry': 'deco_luxe',
  'life-japandi': 'swiss_clean',
  'life-minimalist': 'swiss_clean',
  'life-monochrome': 'bold_split',

  // Fitness (10)
  'fitness-titan': 'frame_center_card',
  'fitness-calisthenics': 'frame_left_modern',
  'fitness-flow': 'frame_ribbon_vlog',
  'fitness-run': 'frame_left_modern',
  'fitness-boxing': 'velocity_stripe',
  'fitness-crossfit': 'velocity_stripe',
  'fitness-kettlebell': 'velocity_stripe',
  'fitness-grind': 'bold_split',
  'fitness-raw': 'bold_split',
  'fitness-mobility': 'watercolor_bloom',

  // Food (12)
  'food-chef': 'frame_center_card',
  'food-italian': 'frame_center_card',
  'food-pastry': 'frame_ribbon_vlog',
  'food-ramen': 'frame_left_modern',
  'food-sushi': 'frame_left_modern',
  'food-bakery': 'botanical_frame',
  'food-farm': 'botanical_frame',
  'food-roastery': 'botanical_frame',
  'food-plant': 'botanical_frame',
  'food-cocktail': 'deco_luxe',
  'food-bbq': 'paint_stroke',
  'food-street': 'bold_split',

  // Music (10)
  'music-acoustic': 'frame_left_modern',
  'music-neosoul': 'frame_center_card',
  'music-bass': 'wave_pattern',
  'music-ambient': 'gradient_mesh',
  'music-lofi': 'gradient_mesh',
  'music-cybersynth': 'neon_glow',
  'music-synthwave': 'neon_glow',
  'music-vinyl': 'film_noir',
  'music-neoclassical': 'swiss_clean',
  'music-trap': 'bold_split',

  // Podcast (10)
  'podcast-dialogue': 'frame_center_card',
  'podcast-studio': 'frame_center_card',
  'podcast-roundtable': 'frame_left_modern',
  'podcast-comedy': 'frame_ribbon_vlog',
  'podcast-mindful': 'watercolor_bloom',
  'podcast-diffuser': 'wave_pattern',
  'podcast-crime': 'film_noir',
  'podcast-noir': 'film_noir',
  'podcast-fireside': 'torn_collage',
  'podcast-minimal': 'swiss_clean',

  // Education (10)
  'edu-finance': 'frame_center_card',       // Direct match: Richard Manuel Finance Academy
  'edu-academic': 'frame_center_card',
  'edu-modern': 'frame_left_modern',
  'edu-bio': 'botanical_frame',
  'edu-literary': 'sketch_doodle',
  'edu-chalkboard': 'sketch_doodle',
  'edu-history': 'torn_collage',
  'edu-cosmos': 'gradient_mesh',
  'edu-code': 'rgb_glitch',
  'edu-philosophy': 'swiss_clean',
};

let generatedCount = 0;

for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf-8'));
  const meta = TEMPLATE_DATA[json.id] || {};

  const style = ARCHETYPE_MAP[json.id] || meta.archetype || meta.style || 'swiss_clean';
  const palette = meta.previewPalette || {};
  const jsonColors = getColors(json);

  const bg1 = palette.bg1 || jsonColors.bg1;
  const bg2 = palette.bg2 || jsonColors.bg2;
  const bg3 = palette.bg3 || jsonColors.bg3;
  const titleColor = palette.titleColor || jsonColors.titleColor;
  const tagColor = palette.tagColor || jsonColors.tagColor;
  const accentColor = palette.accentColor || jsonColors.accentColor;

  const titleLayer = json.scene?.layers?.find((l) => l.role === 'title' || (l.type === 'text' && (l.size ?? 50) >= 40));
  const taglineLayer = json.scene?.layers?.find((l) => l.role === 'tagline' || (l.type === 'text' && l !== titleLayer));

  const titleText = titleLayer?.text || json.name || 'TITLE TEXT';
  const taglineText = taglineLayer?.text || json.description || 'Channel Art & Production';
  const kickerText = meta.kicker || json.niche.toUpperCase();

  const seed = hashString(json.id);

  let bodySvg = '';
  let defsSvg = '';

  // =========================================================================
  // ARCHETYPE 1: FRAME CENTER CARD (Richard Manuel style)
  // =========================================================================
  if (style === 'frame_center_card') {
    bodySvg = `
      <!-- Soft Office/Studio Blurred Elements -->
      <g opacity="0.18">
        <rect x="200" y="100" width="400" height="260" rx="16" fill="#FFFFFF" />
        <rect x="1960" y="140" width="380" height="240" rx="16" fill="#FFFFFF" />
        <circle cx="2100" cy="1100" r="180" fill="#FFFFFF" />
        <rect x="260" y="1080" width="340" height="200" rx="12" fill="#FFFFFF" />
      </g>

      <!-- Center White Card Breaking Safe Area -->
      <g transform="translate(480, 480)">
        <rect width="1600" height="490" rx="20" fill="#FFFFFF" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.22))" />

        <!-- Bold Condensed Name -->
        <text x="800" y="210" fill="#111827" font-family="'Impact', 'Arial Black', -apple-system, sans-serif" font-size="115" font-weight="900" letter-spacing="4px" text-anchor="middle">${escapeXml(titleText)}</text>

        <!-- Spaced Subtitle / Category -->
        <text x="800" y="280" fill="#4B5563" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" letter-spacing="8px" text-anchor="middle">${escapeXml(taglineText.toUpperCase())}</text>
      </g>

      <!-- Avatar Photo Frame Breaking Out of Top Edge of the Card -->
      ${renderVectorAvatar(json.id, seed, 1280, 480, 160, 14, '#FFFFFF')}

      <!-- Bottom Subscribe Button with Animated Pointer Hand & Bell -->
      ${renderAnimatedSubscribeBtn(1140, 855, '#E60000', 1.0)}
    `;
  }

  // =========================================================================
  // ARCHETYPE 2: FRAME LEFT MODERN (Samuel Waterson style)
  // =========================================================================
  else if (style === 'frame_left_modern') {
    const badgeW = Math.min(600, Math.max(240, taglineText.length * 16 + 50));
    bodySvg = `
      <!-- Diagonal Split Overlay in Bottom-Left -->
      <polygon points="0,960 560,1440 0,1440" fill="#0F172A" opacity="0.65" />

      <!-- Left Prominent Avatar Frame -->
      ${renderVectorAvatar(json.id, seed, 640, 720, 200, 16, '#FFFFFF')}

      <!-- Right Name & Badge Stack -->
      <g transform="translate(900, 720)">
        <!-- Name -->
        <text x="0" y="-35" fill="#FFFFFF" font-family="'Impact', 'Arial Black', -apple-system, sans-serif" font-size="120" font-weight="900" letter-spacing="3px">${escapeXml(titleText)}</text>

        <!-- Category Framed Badge Box -->
        <rect x="0" y="10" width="${badgeW}" height="48" rx="8" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
        <text x="${badgeW / 2}" y="42" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="20" font-weight="800" letter-spacing="4px" text-anchor="middle">${escapeXml(taglineText.toUpperCase())}</text>
      </g>

      <!-- Red Subscribe Button on Left Bottom -->
      ${renderAnimatedSubscribeBtn(500, 1010, '#E60000', 0.95)}

      <!-- Website URL Center Bottom -->
      <text x="1350" y="1050" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="22" letter-spacing="4px" text-anchor="middle">www.${json.id}.com</text>
    `;
  }

  // =========================================================================
  // ARCHETYPE 3: FRAME RIBBON VLOG (Hannah Porter style)
  // =========================================================================
  else if (style === 'frame_ribbon_vlog') {
    bodySvg = `
      <!-- Full-Width Horizontal White Safe-Area Ribbon -->
      <rect x="0" y="508.5" width="2560" height="423" fill="#FFFFFF" filter="drop-shadow(0 12px 28px rgba(0,0,0,0.18))" />

      <!-- Decorative Geometric Accents -->
      <g transform="translate(640, 570)">
        <polygon points="0,0 40,25 0,50" fill="#111827" />
        <polygon points="12,6 48,25 12,44" fill="${accentColor}" opacity="0.6" />
      </g>
      <g transform="translate(1820, 835)">
        <polygon points="0,20 25,0 25,40" fill="none" stroke="${accentColor}" stroke-width="3" />
        <polygon points="20,20 45,0 45,40" fill="none" stroke="${accentColor}" stroke-width="3" />
        <polygon points="40,20 65,0 65,40" fill="none" stroke="${accentColor}" stroke-width="3" />
      </g>

      <!-- Avatar Photo Frame Overlapping the Ribbon -->
      ${renderVectorAvatar(json.id, seed, 880, 720, 210, 14, accentColor || '#0D9488')}

      <!-- Content on Right Side of Ribbon -->
      <g transform="translate(1160, 720)">
        <!-- Kicker Author -->
        <text x="0" y="-80" fill="#4B5563" font-family="Georgia, serif" font-size="28" font-style="italic">${escapeXml(kickerText)}</text>

        <!-- Bold Main Title -->
        <text x="0" y="10" fill="#111827" font-family="'Impact', 'Arial Black', -apple-system, sans-serif" font-size="110" font-weight="900" letter-spacing="2px">${escapeXml(titleText)}</text>

        <!-- Tagline / Motto -->
        <text x="0" y="60" fill="#6B7280" font-family="Georgia, serif" font-size="28" font-style="italic">${escapeXml(taglineText)}</text>

        <!-- Subscribe Pill Button -->
        <g transform="translate(0, 100)">
          <rect class="anim-btn" width="220" height="52" rx="26" fill="${accentColor || '#0D9488'}" />
          <text x="110" y="33" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="17" font-weight="900" letter-spacing="2px" text-anchor="middle">SUBSCRIBE</text>
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 4: SKETCH DOODLE (Handcrafted Notebook with Polaroid Frame)
  // =========================================================================
  else if (style === 'sketch_doodle') {
    bodySvg = `
      <!-- Hand-Drawn Dashed Border Frame -->
      <rect x="100" y="100" width="2360" height="1240" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="14 10" />

      <!-- Floating Doodles & Stars -->
      <g class="anim-float">
        <path d="M 160 160 L 180 130 L 200 160 L 230 180 L 200 200 L 180 230 L 160 200 L 130 180 Z" fill="none" stroke="${titleColor}" stroke-width="3.5" />
        <path d="M 2390 160 L 2410 130 L 2430 160 L 2460 180 L 2430 200 L 2410 230 L 2390 200 L 2360 180 Z" fill="none" stroke="${titleColor}" stroke-width="3.5" />
        <path d="M 160 1280 L 180 1250 L 200 1280 L 230 1300 L 200 1320 L 180 1350 L 160 1320 L 130 1300 Z" fill="none" stroke="${titleColor}" stroke-width="3.5" />
        <path d="M 2390 1280 L 2410 1250 L 2430 1280 L 2460 1300 L 2430 1320 L 2410 1350 L 2390 1320 L 2360 1300 Z" fill="none" stroke="${titleColor}" stroke-width="3.5" />
      </g>

      <!-- Polaroid Photo Frame on Left -->
      <g transform="translate(620, 720) rotate(-3)">
        <rect x="-190" y="-230" width="380" height="460" rx="8" fill="#FFFFFF" filter="drop-shadow(0 16px 30px rgba(0,0,0,0.18))" stroke="#E2E8F0" stroke-width="2" />
        <!-- Tape at top of polaroid -->
        <rect x="-60" y="-250" width="120" height="36" fill="#FEF08A" opacity="0.85" rx="4" transform="rotate(2)" />
        <!-- Sketched Avatar Inside Polaroid -->
        ${renderVectorAvatar(json.id, seed, 0, -30, 140, 8, '#E2E8F0')}
        <text x="0" y="190" fill="#334155" font-family="'Comic Sans MS', cursive, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">@${json.id}</text>
      </g>

      <!-- Center-Right Typography -->
      <g transform="translate(1380, 720)" text-anchor="middle">
        <text x="0" y="-30" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-size="120" font-weight="bold">${escapeXml(titleText)}</text>
        <!-- Wavy Hand-Drawn Underline -->
        <path d="M -380 5 Q -190 35 0 0 T 380 5" fill="none" stroke="${accentColor}" stroke-width="6" stroke-linecap="round" />
        <text x="0" y="75" fill="${tagColor}" font-family="system-ui, sans-serif" font-size="34">${escapeXml(taglineText)}</text>

        <!-- Animated Hand-Drawn Arrow -->
        <path d="M -160 115 Q -100 170 -40 145" fill="none" stroke="${accentColor}" stroke-width="4" />
        <path d="M -48 132 L -40 145 L -56 148" fill="none" stroke="${accentColor}" stroke-width="4" />

        <g transform="translate(-140, 140)">
          ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 0.9)}
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 5: WATERCOLOR BLOOM (Pastel Organic Frame)
  // =========================================================================
  else if (style === 'watercolor_bloom') {
    let splatter = '';
    for (let i = 0; i < 14; i++) {
      const cx = 120 + ((seed * i * 19) % 2320);
      const cy = 120 + ((seed * i * 31) % 1200);
      const r = 6 + ((seed * i) % 18);
      splatter += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accentColor}" opacity="0.35" />`;
    }
    bodySvg = `
      <ellipse cx="600" cy="500" rx="700" ry="500" fill="${accentColor}" opacity="0.22" />
      <ellipse cx="1400" cy="900" rx="600" ry="700" fill="${accentColor}" opacity="0.16" />
      <circle cx="2000" cy="400" r="500" fill="${accentColor}" opacity="0.25" />
      ${splatter}

      <!-- Prominent Floral Circular Photo Frame -->
      ${renderVectorAvatar(json.id, seed, 680, 720, 210, 14, '#FFFFFF')}

      <!-- Center-Right Elegant Serif Type -->
      <g transform="translate(1000, 720)">
        <text x="0" y="-40" fill="${titleColor}" font-family="Georgia, serif" font-size="115" font-weight="bold">${escapeXml(titleText)}</text>
        <text x="0" y="30" fill="${tagColor}" font-family="Georgia, serif" font-size="38" font-style="italic">${escapeXml(taglineText)}</text>
        <g transform="translate(0, 70)">
          ${renderAnimatedSubscribeBtn(0, 0, accentColor || '#E11D48', 0.95)}
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 6: NEON GLOW (Cyberpunk Arcade Perspective Grid)
  // =========================================================================
  else if (style === 'neon_glow') {
    defsSvg += `
      <filter id="glow-${json.id}">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id="scanlines-${json.id}" width="4" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="4" y2="0" stroke="#FFFFFF" stroke-width="1" opacity="0.05" />
      </pattern>
    `;
    let grid = '';
    for (let i = 0; i <= 2560; i += 128) {
      grid += `<line x1="${i}" y1="1440" x2="1280" y2="720" stroke="${accentColor}" stroke-width="1" opacity="0.32" />`;
    }
    for (let i = 720; i <= 1440; i += 80) {
      grid += `<line x1="0" y1="${i}" x2="2560" y2="${i}" stroke="${accentColor}" stroke-width="1" opacity="0.32" />`;
    }
    bodySvg = `
      ${grid}
      <!-- Pulsing Neon Outer Frame -->
      <rect class="anim-glow" x="100" y="100" width="2360" height="1240" fill="none" stroke="${accentColor}" stroke-width="4" filter="url(#glow-${json.id})" />
      <path d="M 80 120 L 80 80 L 120 80" fill="none" stroke="${accentColor}" stroke-width="6" />
      <path d="M 2480 120 L 2480 80 L 2440 80" fill="none" stroke="${accentColor}" stroke-width="6" />
      <path d="M 80 1320 L 80 1360 L 120 1360" fill="none" stroke="${accentColor}" stroke-width="6" />
      <path d="M 2480 1320 L 2480 1360 L 2440 1360" fill="none" stroke="${accentColor}" stroke-width="6" />

      <!-- Glowing Center Typography -->
      <text class="anim-glow" x="1280" y="660" fill="${titleColor}" font-family="system-ui, sans-serif" font-size="135" font-weight="900" text-anchor="middle" filter="url(#glow-${json.id})">${escapeXml(titleText)}</text>
      <text x="1280" y="760" fill="${tagColor}" font-family="system-ui, sans-serif" font-size="38" text-anchor="middle">${escapeXml(taglineText)}</text>

      <g transform="translate(1140, 830)">
        ${renderAnimatedSubscribeBtn(0, 0, accentColor || '#00FF88', 0.95)}
      </g>

      <rect width="2560" height="1440" fill="url(#scanlines-${json.id})" pointer-events="none" />
    `;
  }

  // =========================================================================
  // ARCHETYPE 7: HALFTONE POP (Pop-Art Comics with Comic Frame)
  // =========================================================================
  else if (style === 'halftone_pop') {
    let halftone = '';
    for (let row = 0; row < 18; row++) {
      for (let col = 0; col < 18; col++) {
        const r = 24 - (row + col) * 0.65;
        if (r > 0) {
          halftone += `<circle cx="${col * 42 + 100}" cy="${row * 42 + 100}" r="${r}" fill="${accentColor}" opacity="0.32" />`;
        }
      }
    }
    bodySvg = `
      ${halftone}

      <!-- Pop-Art Comic Avatar Frame on Left -->
      <g transform="translate(640, 720)">
        <circle cx="10" cy="10" r="190" fill="${accentColor}" />
        ${renderVectorAvatar(json.id, seed, 0, 0, 190, 14, '#111827')}
      </g>

      <!-- Center-Right Comic Typography -->
      <g transform="translate(1000, 720)">
        <rect x="0" y="-140" width="280" height="46" rx="23" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))" />
        <text x="140" y="-110" fill="#111827" font-family="system-ui" font-size="22" font-weight="900" text-anchor="middle">${escapeXml(kickerText)}</text>

        <!-- Pop-Art Double Offset Title -->
        <text x="6" y="-10" fill="${accentColor}" font-family="system-ui, -apple-system, sans-serif" font-size="130" font-weight="900">${escapeXml(titleText)}</text>
        <text x="0" y="-16" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-size="130" font-weight="900">${escapeXml(titleText)}</text>

        <text x="0" y="60" fill="${tagColor}" font-family="system-ui, sans-serif" font-size="36" font-weight="bold">${escapeXml(taglineText)}</text>

        <g transform="translate(0, 95)">
          ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 0.95)}
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 8: BOLD SPLIT (High-Impact Editorial Split)
  // =========================================================================
  else if (style === 'bold_split') {
    bodySvg = `
      <polygon points="0,0 1400,0 1200,1440 0,1440" fill="${bg1}" />
      <polygon points="1400,0 2560,0 2560,1440 1200,1440" fill="${bg2}" />
      <line x1="1400" y1="0" x2="1200" y2="1440" stroke="${accentColor}" stroke-width="5" />

      <g transform="translate(180, 720)">
        <rect x="0" y="-170" width="220" height="42" rx="21" fill="${accentColor}" />
        <text x="110" y="-142" fill="#000000" font-family="system-ui" font-size="19" font-weight="900" text-anchor="middle">${escapeXml(kickerText)}</text>
        <text x="0" y="-15" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-size="140" font-weight="900" letter-spacing="-2px">${escapeXml(titleText)}</text>
        <text x="0" y="60" fill="${tagColor}" font-family="system-ui, sans-serif" font-size="38" font-weight="600">${escapeXml(taglineText)}</text>
      </g>

      <g transform="translate(1800, 700)">
        ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 1.0)}
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 9: TORN COLLAGE (Travel Scrapbook with Taped Photo Frame)
  // =========================================================================
  else if (style === 'torn_collage') {
    bodySvg = `
      <!-- Tilted Photo Cards with Drop Shadows -->
      <g transform="translate(480, 720) rotate(-4)">
        <rect x="-240" y="-280" width="480" height="560" rx="8" fill="#FFFFFF" filter="drop-shadow(0 18px 36px rgba(0,0,0,0.22))" />
        <rect x="-80" y="-300" width="160" height="44" fill="#FEF3C7" opacity="0.85" rx="4" transform="rotate(4)" />
        <!-- Avatar Photo Inside Taped Frame -->
        ${renderVectorAvatar(json.id, seed, 0, -30, 170, 10, '#E2E8F0')}
        <text x="0" y="210" fill="#1E293B" font-family="'Brush Script MT', cursive, serif" font-size="32" text-anchor="middle">Our Journey</text>
      </g>

      <!-- Center-Right Collage Notes -->
      <g transform="translate(1100, 720)">
        <rect x="0" y="-160" width="1200" height="340" rx="16" fill="#FFFFFF" opacity="0.92" filter="drop-shadow(0 12px 24px rgba(0,0,0,0.14))" />
        <circle cx="60" cy="-120" r="14" fill="#EF4444" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.3))" />
        <text x="60" y="-40" fill="${titleColor}" font-family="Georgia, serif" font-size="110" font-weight="bold">${escapeXml(titleText)}</text>
        <text x="60" y="35" fill="${tagColor}" font-family="Georgia, serif" font-size="34" font-style="italic">${escapeXml(taglineText)}</text>

        <g transform="translate(60, 75)">
          ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 0.95)}
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 10: BOTANICAL FRAME (Organic Wreath Frame)
  // =========================================================================
  else if (style === 'botanical_frame') {
    const drawLeaf = (cx, cy, rot) => `
      <g transform="translate(${cx}, ${cy}) rotate(${rot})">
        <path d="M 0 0 C 20 -40, 80 -40, 100 0 C 80 40, 20 40, 0 0 Z" fill="${accentColor}" opacity="0.65" />
        <line x1="0" y1="0" x2="90" y2="0" stroke="${bg1}" stroke-width="2" />
      </g>
    `;
    bodySvg = `
      <rect x="100" y="100" width="2360" height="1240" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.5" />
      ${drawLeaf(100, 100, 45)} ${drawLeaf(100, 100, 0)} ${drawLeaf(100, 100, 90)}
      ${drawLeaf(2460, 100, 135)} ${drawLeaf(2460, 100, 90)} ${drawLeaf(2460, 100, 180)}
      ${drawLeaf(100, 1340, -45)} ${drawLeaf(100, 1340, 0)} ${drawLeaf(100, 1340, -90)}
      ${drawLeaf(2460, 1340, -135)} ${drawLeaf(2460, 1340, -90)} ${drawLeaf(2460, 1340, -180)}

      <!-- Center Avatar Inside Botanical Seal -->
      ${renderVectorAvatar(json.id, seed, 1280, 520, 150, 12, '#FFFFFF')}

      <text x="1280" y="760" fill="${titleColor}" font-family="Georgia, serif" font-size="120" font-weight="bold" text-anchor="middle">${escapeXml(titleText)}</text>
      <text x="1280" y="830" fill="${tagColor}" font-family="Georgia, serif" font-size="34" text-anchor="middle">${escapeXml(taglineText)}</text>

      <g transform="translate(1140, 890)">
        ${renderAnimatedSubscribeBtn(0, 0, accentColor || '#D97706', 0.95)}
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 11: RGB GLITCH (Cyber Glitch Screen)
  // =========================================================================
  else if (style === 'rgb_glitch') {
    let noise = '';
    for (let i = 0; i < 20; i++) {
      const cx = ((seed * i * 19) % 2560);
      const cy = ((seed * i * 31) % 1440);
      noise += `<rect x="${cx}" y="${cy}" width="4" height="4" fill="${titleColor}" opacity="0.5" />`;
    }
    let lines = '';
    for (let i = 0; i < 6; i++) {
      const cy = ((seed * i * 17) % 1440);
      lines += `<rect x="0" y="${cy}" width="2560" height="4" fill="${accentColor}" opacity="0.18" />`;
    }
    bodySvg = `
      ${lines}
      ${noise}
      <g class="anim-glitch">
        <text x="1280" y="600" fill="${accentColor}" font-family="monospace" font-size="24" text-anchor="middle" letter-spacing="4px">${escapeXml(kickerText)}</text>
        <text x="1274" y="717" fill="#FF000080" font-family="system-ui" font-size="135" font-weight="900" text-anchor="middle">${escapeXml(titleText)}</text>
        <text x="1284" y="722" fill="#00FF0060" font-family="system-ui" font-size="135" font-weight="900" text-anchor="middle">${escapeXml(titleText)}</text>
        <text x="1280" y="720" fill="${titleColor}" font-family="system-ui" font-size="135" font-weight="900" text-anchor="middle">${escapeXml(titleText)}</text>
        <text x="1280" y="830" fill="${tagColor}" font-family="monospace" font-size="32" text-anchor="middle">${escapeXml(taglineText)}</text>
      </g>

      <g transform="translate(1140, 890)">
        ${renderAnimatedSubscribeBtn(0, 0, '#DC2626', 0.95)}
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 12: WAVE PATTERN (Audio Equalizer with Animated Jumping Bars)
  // =========================================================================
  else if (style === 'wave_pattern') {
    let eq = '';
    for (let i = 0; i < 16; i++) {
      const h = 25 + ((seed * (i + 1) * 19) % 75);
      const animClass = (i % 3 === 0) ? 'anim-eq1' : (i % 3 === 1) ? 'anim-eq2' : 'anim-eq3';
      eq += `<rect class="${animClass}" x="${i * 22}" y="-${h}" width="14" height="${h}" rx="6" fill="${accentColor}" />`;
    }
    bodySvg = `
      <path d="M 0 720 C 400 400, 800 1000, 1280 720 C 1760 400, 2160 1000, 2560 720" fill="none" stroke="${accentColor}" stroke-width="8" opacity="0.8" />
      <path d="M 0 720 C 400 600, 800 800, 1280 720 C 1760 600, 2160 800, 2560 720" fill="none" stroke="${tagColor}" stroke-width="4" opacity="0.5" />

      <!-- Concentric Vinyl Turntable Disc -->
      <g transform="translate(2050, 720)">
        <circle cx="0" cy="0" r="220" fill="#111111" stroke="${accentColor}" stroke-width="4" />
        <circle cx="0" cy="0" r="170" fill="none" stroke="#262626" stroke-width="2" />
        <circle cx="0" cy="0" r="120" fill="none" stroke="#262626" stroke-width="2" />
        <circle cx="0" cy="0" r="70" fill="${accentColor}" />
      </g>

      <!-- Left Typography & Jumping Equalizer -->
      <g transform="translate(360, 720)">
        <text x="0" y="-30" fill="${titleColor}" font-family="system-ui, -apple-system, sans-serif" font-size="120" font-weight="bold">${escapeXml(titleText)}</text>
        <text x="0" y="30" fill="${tagColor}" font-family="system-ui, sans-serif" font-size="34">${escapeXml(taglineText)}</text>
        <g transform="translate(0, 90)">
          ${eq}
        </g>
        <g transform="translate(420, 50)">
          ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 0.9)}
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 13: VELOCITY STRIPE (High-Energy Sports Lines)
  // =========================================================================
  else if (style === 'velocity_stripe') {
    let lines = '';
    for (let i = 0; i < 20; i++) {
      const y = i * 80;
      lines += `<line x1="0" y1="${y}" x2="2560" y2="${y - 1280}" stroke="#FFFFFF" stroke-width="2" opacity="0.1" />`;
    }
    bodySvg = `
      ${lines}
      <polygon points="1200,1440 1600,0 1800,0 1400,1440" fill="${accentColor}" opacity="0.9" />
      <polygon points="1500,1440 1900,0 2050,0 1650,1440" fill="${accentColor}" opacity="0.6" />
      <polygon points="1750,1440 2150,0 2250,0 1850,1440" fill="${accentColor}" opacity="0.3" />

      <g transform="translate(240, 720)">
        <text x="0" y="-20" fill="${titleColor}" font-family="Impact, system-ui" font-size="140" font-weight="900" letter-spacing="3px">${escapeXml(titleText)}</text>
        <text x="0" y="60" fill="${accentColor}" font-family="system-ui" font-size="42" font-weight="bold">${escapeXml(taglineText)}</text>

        <g transform="translate(0, 110)">
          ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 1.0)}
        </g>
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 14: DECO LUXE (1920s Gold Art Deco)
  // =========================================================================
  else if (style === 'deco_luxe') {
    bodySvg = `
      <g stroke="#D4AF37" stroke-width="2" opacity="0.45">
        <path d="M 1280 0 L 100 400 M 1280 0 L 300 400 M 1280 0 L 500 400 M 1280 0 L 700 400 M 1280 0 L 900 400 M 1280 0 L 1100 400" />
        <path d="M 1280 0 L 2460 400 M 1280 0 L 2260 400 M 1280 0 L 2060 400 M 1280 0 L 1860 400 M 1280 0 L 1660 400 M 1280 0 L 1460 400" />
      </g>

      <rect x="100" y="100" width="2360" height="1240" fill="none" stroke="#D4AF37" stroke-width="4" />
      <rect x="120" y="120" width="2320" height="1200" fill="none" stroke="#D4AF37" stroke-width="1.5" />

      <line x1="800" y1="560" x2="1760" y2="560" stroke="#D4AF37" stroke-width="3" />
      <line x1="800" y1="860" x2="1760" y2="860" stroke="#D4AF37" stroke-width="3" />
      <polygon points="1280,545 1295,560 1280,575 1265,560" fill="#D4AF37" />
      <polygon points="1280,845 1295,860 1280,875 1265,860" fill="#D4AF37" />

      <text x="1280" y="730" fill="#D4AF37" font-family="Georgia, serif" font-size="120" text-anchor="middle">${escapeXml(titleText)}</text>
      <text x="1280" y="800" fill="${tagColor}" font-family="system-ui" font-size="28" letter-spacing="6px" text-anchor="middle">${escapeXml(taglineText.toUpperCase())}</text>
    `;
  }

  // =========================================================================
  // ARCHETYPE 15: FILM NOIR (Cinematic Anamorphic)
  // =========================================================================
  else if (style === 'film_noir') {
    let holes = '';
    for (let y = 40; y < 1440; y += 60) {
      holes += `<rect x="40" y="${y}" width="20" height="10" rx="3" fill="#000000" />`;
    }
    bodySvg = `
      <rect x="0" y="0" width="2560" height="200" fill="#000000" />
      <rect x="0" y="1240" width="2560" height="200" fill="#000000" />
      ${holes}
      <text x="2400" y="110" fill="#FFFFFF" font-family="monospace" font-size="20" text-anchor="end">35MM · 5600K</text>

      <text x="1280" y="710" fill="#D4AF37" font-family="Georgia, serif" font-size="120" text-anchor="middle">${escapeXml(titleText)}</text>
      <text x="1280" y="800" fill="${tagColor}" font-family="system-ui" font-size="30" text-anchor="middle" letter-spacing="6px">${escapeXml(taglineText.toUpperCase())}</text>

      <g transform="translate(1140, 870)">
        ${renderAnimatedSubscribeBtn(0, 0, '#E60000', 0.95)}
      </g>
    `;
  }

  // =========================================================================
  // ARCHETYPE 16: GRADIENT MESH / SWISS CLEAN / FALLBACK
  // =========================================================================
  else if (style === 'gradient_mesh') {
    defsSvg += `
      <radialGradient id="mesh1-${json.id}" cx="20%" cy="20%" r="70%">
        <stop offset="0%" stop-color="${bg1}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${bg2}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="mesh2-${json.id}" cx="80%" cy="80%" r="70%">
        <stop offset="0%" stop-color="${bg2}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${bg3}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="mesh3-${json.id}" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
      </radialGradient>
    `;
    bodySvg = `
      <circle cx="500" cy="300" r="900" fill="url(#mesh1-${json.id})" />
      <circle cx="2000" cy="1100" r="900" fill="url(#mesh2-${json.id})" />
      <circle cx="1280" cy="720" r="900" fill="url(#mesh3-${json.id})" />

      <text x="1280" y="700" fill="${titleColor}" font-family="Georgia, serif" font-size="125" text-anchor="middle" font-weight="bold">${escapeXml(titleText)}</text>
      <text x="1280" y="780" fill="${tagColor}" font-family="Georgia, serif" font-size="36" text-anchor="middle">${escapeXml(taglineText)}</text>

      <g transform="translate(1140, 840)">
        ${renderAnimatedSubscribeBtn(0, 0, accentColor || '#E60000', 0.95)}
      </g>
    `;
  } else {
    // Swiss Clean default
    bodySvg = `
      <text x="1280" y="660" fill="${titleColor}" font-family="Georgia, serif" font-size="170" font-weight="bold" text-anchor="middle">${escapeXml(titleText)}</text>
      <line x1="1080" y1="740" x2="1480" y2="740" stroke="${accentColor}" stroke-width="3" />
      <text x="1280" y="800" fill="${tagColor}" font-family="system-ui" font-size="26" text-anchor="middle" letter-spacing="6px">${escapeXml(kickerText)}</text>
    `;
  }

  // Master SVG Assembly with Embedded CSS Micro-Animations
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <style>
      @keyframes cursorClick {
        0%, 100% { transform: translate(235px, 42px) scale(1); }
        38% { transform: translate(230px, 36px) scale(1); }
        46% { transform: translate(228px, 34px) scale(0.85); }
        54% { transform: translate(230px, 36px) scale(1); }
      }
      @keyframes btnTap {
        0%, 100% { transform: scale(1); }
        46% { transform: scale(0.97); }
        54% { transform: scale(1); }
      }
      @keyframes bellWiggle {
        0%, 42%, 68%, 100% { transform: translate(225px, 33px) rotate(0deg); }
        46% { transform: translate(225px, 33px) rotate(-20deg); }
        50% { transform: translate(225px, 33px) rotate(20deg); }
        54% { transform: translate(225px, 33px) rotate(-14deg); }
        58% { transform: translate(225px, 33px) rotate(10deg); }
        62% { transform: translate(225px, 33px) rotate(-4deg); }
      }
      @keyframes neonGlow {
        0%, 100% { opacity: 0.88; filter: drop-shadow(0 0 8px currentColor); }
        50% { opacity: 1; filter: drop-shadow(0 0 26px currentColor); }
      }
      @keyframes floatGently {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-14px); }
      }
      @keyframes eqBounce1 { 0%, 100% { height: 25px; y: -25px; } 50% { height: 75px; y: -75px; } }
      @keyframes eqBounce2 { 0%, 100% { height: 65px; y: -65px; } 50% { height: 20px; y: -20px; } }
      @keyframes eqBounce3 { 0%, 100% { height: 35px; y: -35px; } 50% { height: 85px; y: -85px; } }
      @keyframes glitchTwitch {
        0%, 88%, 100% { transform: translate(0, 0); }
        90% { transform: translate(-6px, 2px); }
        93% { transform: translate(5px, -2px); }
        96% { transform: translate(-2px, 1px); }
      }
      .anim-cursor { animation: cursorClick 2.6s ease-in-out infinite; transform-origin: 0 0; }
      .anim-btn { animation: btnTap 2.6s ease-in-out infinite; transform-origin: center; }
      .anim-bell { animation: bellWiggle 2.6s ease-in-out infinite; transform-origin: 0 -12px; }
      .anim-glow { animation: neonGlow 2.2s ease-in-out infinite; }
      .anim-float { animation: floatGently 3.5s ease-in-out infinite; }
      .anim-eq1 { animation: eqBounce1 0.8s ease-in-out infinite; }
      .anim-eq2 { animation: eqBounce2 1.1s ease-in-out infinite; }
      .anim-eq3 { animation: eqBounce3 0.9s ease-in-out infinite; }
      .anim-glitch { animation: glitchTwitch 3.5s step-end infinite; }
    </style>
    <linearGradient id="bg-${json.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="50%" stop-color="${bg2}" />
      <stop offset="100%" stop-color="${bg3}" />
    </linearGradient>
    ${defsSvg}
  </defs>

  <rect width="2560" height="1440" fill="url(#bg-${json.id})" />
  ${bodySvg}
</svg>`;

  fs.writeFileSync(path.join(previewsDir, `${json.id}.svg`), svg.trim() + '\n');
  generatedCount++;
}

console.log(`✓ Successfully generated ${generatedCount} animated, frame-rich preview SVGs in public/previews/`);
