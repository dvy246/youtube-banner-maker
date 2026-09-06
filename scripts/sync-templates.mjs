import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_DATA } from './template-manifest-data.mjs';

const templatesDir = path.resolve('src/data/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));

const AVATAR_MAP = {
  finance: '/avatars/avatar-finance-male-thumb.jpg',
  tech: '/avatars/avatar-tech-glasses-thumb.jpg',
  vlog: '/avatars/avatar-vlog-female-thumb.jpg',
  business: '/avatars/avatar-business-female-thumb.jpg',
  fitness: '/avatars/avatar-fitness-trainer-thumb.jpg',
  creative: '/avatars/avatar-creative-male-thumb.jpg',
  chef: '/avatars/avatar-chef-food-thumb.jpg',
  gaming: '/avatars/avatar-gaming-streamer-thumb.jpg',
  podcast: '/avatars/avatar-podcast-host-thumb.jpg',
  beauty: '/avatars/avatar-beauty-creator-thumb.jpg',
};

function getAvatarPath(id, niche) {
  const specific = {
    'biz-authority': 'finance',
    'biz-pitch': 'finance',
    'edu-finance': 'finance',
    'edu-academic': 'finance',
    'tech-clean': 'tech',
    'tech-cloud': 'tech',
    'tech-mobile': 'tech',
    'edu-modern': 'tech',
    'tech-neural': 'tech',
    'tech-quantum': 'tech',
    'vlog-golden-hour': 'vlog',
    'vlog-coast': 'vlog',
    'vlog-editorial': 'vlog',
    'aesthetic-pastel': 'vlog',
    'food-pastry': 'vlog',
    'food-bakery': 'vlog',
    'biz-agency': 'business',
    'biz-freelance': 'business',
    'biz-nomad': 'business',
    'life-glow': 'business',
    'life-fashion': 'business',
    'biz-marketing': 'business',
    'fitness-titan': 'fitness',
    'fitness-calisthenics': 'fitness',
    'fitness-flow': 'fitness',
    'fitness-run': 'fitness',
    'fitness-boxing': 'fitness',
    'fitness-mobility': 'fitness',
    'vlog-wanderlust': 'creative',
    'life-grooming': 'creative',
    'gaming-voxel': 'creative',
    'biz-founder': 'creative',
    'edu-literary': 'creative',
    'edu-chalkboard': 'creative',
    'edu-history': 'creative',
    'food-chef': 'chef',
    'food-italian': 'chef',
    'food-ramen': 'chef',
    'food-sushi': 'chef',
    'food-farm': 'chef',
    'food-roastery': 'chef',
    'food-plant': 'chef',
    'gaming-esports': 'gaming',
    'gaming-tactical': 'gaming',
    'meme-cookie': 'gaming',
    'gaming-anime': 'gaming',
    'gaming-retro': 'gaming',
    'podcast-dialogue': 'podcast',
    'podcast-studio': 'podcast',
    'podcast-roundtable': 'podcast',
    'podcast-comedy': 'podcast',
    'music-neosoul': 'podcast',
    'music-acoustic': 'podcast',
    'life-ceramic': 'beauty',
    'life-botanical': 'beauty',
    'life-coffee': 'beauty',
  };
  const key = specific[id] || (
    niche === 'food' ? 'chef' :
    niche === 'fitness' ? 'fitness' :
    niche === 'gaming' ? 'gaming' :
    niche === 'podcast' ? 'podcast' :
    niche === 'tech' ? 'tech' :
    niche === 'business' ? 'finance' :
    niche === 'lifestyle' ? 'beauty' :
    niche === 'education' ? 'finance' :
    niche === 'vlog' ? 'vlog' :
    niche === 'music' ? 'podcast' : 'business'
  );
  return AVATAR_MAP[key] || AVATAR_MAP.business;
}

// Track niche template index to apply variant 0 vs variant 1
const styleNicheCounter = {};

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  const tmpl = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const meta = TEMPLATE_DATA[tmpl.id] || {};
  const palette = meta.previewPalette || {};
  const style = meta.style || 'swiss_clean';
  const avatarPath = getAvatarPath(tmpl.id, tmpl.niche);

  const counterKey = `${tmpl.niche}::${style}`;
  const variant = (styleNicheCounter[counterKey] || 0);
  styleNicheCounter[counterKey] = variant + 1;

  // Preserve background image if file exists in public/
  let hasValidBgImage = false;
  if (tmpl.scene.background?.type === 'image' && tmpl.scene.background?.src) {
    const bgImgPath = path.resolve('public', tmpl.scene.background.src.replace(/^\//, ''));
    if (fs.existsSync(bgImgPath)) {
      hasValidBgImage = true;
    }
  }

  // 1. Update background to vibrant palette gradient if no valid image
  if (!hasValidBgImage && palette.bg1) {
    tmpl.scene.background = {
      type: 'gradient',
      angle: 135,
      stops: [palette.bg1, palette.bg2 || palette.bg1, palette.bg3 || palette.bg1],
      from: palette.bg1,
      to: palette.bg3 || palette.bg1
    };
  }

  // Find existing title & tagline texts
  const existingTitle = tmpl.scene.layers.find(l => l.role === 'title' || (l.type === 'text' && (l.size ?? 50) >= 38));
  const existingTagline = tmpl.scene.layers.find(l => l.role === 'tagline' || (l.type === 'text' && l !== existingTitle));

  const titleText = existingTitle?.text || tmpl.name;
  const taglineText = existingTagline?.text || tmpl.description;

  // Archetype-specific layout sync
  if (style === 'frame_center_card') {
    if (variant === 0) {
      tmpl.scene.layers = [
        {
          id: 'center-card',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.1875,
          y: 0.3333,
          w: 0.625,
          h: 0.3402,
          color: '#FFFFFF',
          borderRadius: 20,
          opacity: 1
        },
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'circle',
          src: avatarPath,
          x: 0.5,
          y: 0.425,
          w: 0.08,
          h: 0.14,
          borderWidth: 5,
          borderColor: '#FFFFFF',
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 48,
          color: '#111827',
          align: 'center',
          position: { x: 0.5, y: 0.515 },
          x: 0.5,
          y: 0.515,
          safeAreaConstrained: true
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 15,
          color: '#4B5563',
          align: 'center',
          position: { x: 0.5, y: 0.56 },
          x: 0.5,
          y: 0.56,
          safeAreaConstrained: true
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.5,
          y: 0.61,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
    } else {
      tmpl.scene.layers = [
        {
          id: 'center-card',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.22,
          y: 0.34,
          w: 0.56,
          h: 0.33,
          color: '#FFFFFF',
          borderRadius: 16,
          opacity: 1
        },
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'circle',
          src: avatarPath,
          x: 0.5,
          y: 0.44,
          w: 0.075,
          h: 0.13,
          borderWidth: 4,
          borderColor: '#FFFFFF',
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 38,
          color: '#111827',
          align: 'center',
          position: { x: 0.5, y: 0.53 },
          x: 0.5,
          y: 0.53,
          safeAreaConstrained: true
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 14,
          color: '#4B5563',
          align: 'center',
          position: { x: 0.5, y: 0.575 },
          x: 0.5,
          y: 0.575,
          safeAreaConstrained: true
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.5,
          y: 0.62,
          scale: 0.7,
          safeAreaConstrained: true
        }
      ];
    }

    tmpl.editable = ['title', 'tagline', 'avatar', 'background.gradient'];
    tmpl.protected = ['center-card', 'subscribe-badge'];
  }
  else if (style === 'frame_ribbon_vlog') {
    if (variant === 0) {
      tmpl.scene.layers = [
        {
          id: 'ribbon-card',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.0,
          y: 0.353125,
          w: 1.0,
          h: 0.29375,
          color: '#FFFFFF',
          opacity: 1
        },
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'circle',
          src: avatarPath,
          x: 0.33,
          y: 0.5,
          w: 0.09,
          h: 0.16,
          borderWidth: 6,
          borderColor: palette.accentColor || '#0D9488',
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 42,
          color: '#111827',
          align: 'left',
          position: { x: 0.43, y: 0.47 },
          x: 0.43,
          y: 0.47,
          safeAreaConstrained: true
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 15,
          color: '#6B7280',
          align: 'left',
          position: { x: 0.43, y: 0.53 },
          x: 0.43,
          y: 0.53,
          safeAreaConstrained: true
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.48,
          y: 0.59,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
    } else {
      tmpl.scene.layers = [
        {
          id: 'ribbon-card',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.0,
          y: 0.36,
          w: 1.0,
          h: 0.28,
          color: '#FFFFFF',
          opacity: 1
        },
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'circle',
          src: avatarPath,
          x: 0.36,
          y: 0.5,
          w: 0.085,
          h: 0.15,
          borderWidth: 6,
          borderColor: palette.accentColor || '#0D9488',
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 46,
          color: '#111827',
          align: 'left',
          position: { x: 0.46, y: 0.46 },
          x: 0.46,
          y: 0.46,
          safeAreaConstrained: true
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 15,
          color: '#6B7280',
          align: 'left',
          position: { x: 0.46, y: 0.52 },
          x: 0.46,
          y: 0.52,
          safeAreaConstrained: true
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.51,
          y: 0.58,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
    }

    tmpl.editable = ['title', 'tagline', 'avatar', 'background.gradient'];
    tmpl.protected = ['ribbon-card', 'subscribe-badge'];
  }
  else if (style === 'frame_left_modern') {
    if (variant === 0) {
      tmpl.scene.layers = [
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'circle',
          src: avatarPath,
          x: 0.31,
          y: 0.5,
          w: 0.09,
          h: 0.16,
          borderWidth: 6,
          borderColor: '#FFFFFF',
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 44,
          color: palette.titleColor || '#FFFFFF',
          align: 'left',
          position: { x: 0.42, y: 0.46 },
          x: 0.42,
          y: 0.46,
          safeAreaConstrained: true
        },
        {
          id: 'category-box',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.42,
          y: 0.505,
          w: 0.22,
          h: 0.032,
          borderRadius: 6,
          color: palette.accentColor || '#38BDF8',
          opacity: 0.35
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 13,
          color: palette.tagColor || '#CBD5E1',
          align: 'left',
          position: { x: 0.43, y: 0.521 },
          x: 0.43,
          y: 0.521,
          safeAreaConstrained: true
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.47,
          y: 0.59,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
      tmpl.protected = ['category-box', 'subscribe-badge'];
    } else {
      tmpl.scene.layers = [
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'circle',
          src: avatarPath,
          x: 0.34,
          y: 0.5,
          w: 0.09,
          h: 0.16,
          borderWidth: 6,
          borderColor: '#FFFFFF',
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 48,
          color: palette.titleColor || '#FFFFFF',
          align: 'left',
          position: { x: 0.45, y: 0.45 },
          x: 0.45,
          y: 0.45,
          safeAreaConstrained: true
        },
        {
          id: 'category-box',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.45,
          y: 0.515,
          w: 0.24,
          h: 0.035,
          borderRadius: 6,
          color: palette.accentColor || '#38BDF8',
          opacity: 0.35
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 14,
          color: palette.tagColor || '#CBD5E1',
          align: 'left',
          position: { x: 0.46, y: 0.532 },
          x: 0.46,
          y: 0.532,
          safeAreaConstrained: true
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.50,
          y: 0.60,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
      tmpl.protected = ['category-box', 'subscribe-badge'];
    }

    tmpl.editable = ['title', 'tagline', 'avatar', 'background.gradient'];
  }
  else if (style === 'sketch_doodle') {
    if (variant === 0) {
      tmpl.scene.layers = [
        {
          id: 'sketch-box',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.22,
          y: 0.38,
          w: 0.56,
          h: 0.24,
          color: palette.accentColor || '#D97706',
          opacity: 0.25
        },
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'rect',
          src: avatarPath,
          x: 0.29,
          y: 0.5,
          w: 0.08,
          h: 0.14,
          borderWidth: 5,
          borderColor: '#FFFFFF',
          borderRadius: 8,
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 42,
          color: palette.titleColor || '#1E293B',
          align: 'left',
          position: { x: 0.39, y: 0.46 },
          x: 0.39,
          y: 0.46,
          safeAreaConstrained: true
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 15,
          color: palette.tagColor || '#475569',
          align: 'left',
          position: { x: 0.39, y: 0.53 },
          x: 0.39,
          y: 0.53,
          safeAreaConstrained: true
        },
        {
          id: 'doodle-star',
          role: 'shape',
          type: 'shape',
          shape: 'circle',
          x: 0.72,
          y: 0.46,
          w: 0.02,
          h: 0.035,
          color: palette.accentColor || '#F59E0B',
          opacity: 0.8
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.45,
          y: 0.60,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
    } else {
      tmpl.scene.layers = [
        {
          id: 'sketch-box',
          role: 'shape',
          type: 'shape',
          shape: 'rect',
          x: 0.24,
          y: 0.39,
          w: 0.54,
          h: 0.23,
          color: palette.accentColor || '#D97706',
          opacity: 0.25
        },
        {
          id: 'avatar',
          role: 'avatar',
          type: 'frame',
          shape: 'rect',
          src: avatarPath,
          x: 0.31,
          y: 0.5,
          w: 0.075,
          h: 0.13,
          borderWidth: 5,
          borderColor: '#FFFFFF',
          borderRadius: 8,
          safeAreaConstrained: true
        },
        {
          id: 'title',
          role: 'title',
          type: 'text',
          text: titleText,
          font: 'inter-700',
          size: 46,
          color: palette.titleColor || '#1E293B',
          align: 'left',
          position: { x: 0.41, y: 0.45 },
          x: 0.41,
          y: 0.45,
          safeAreaConstrained: true
        },
        {
          id: 'tagline',
          role: 'tagline',
          type: 'text',
          text: taglineText,
          font: 'inter-500',
          size: 14,
          color: palette.tagColor || '#475569',
          align: 'left',
          position: { x: 0.41, y: 0.52 },
          x: 0.41,
          y: 0.52,
          safeAreaConstrained: true
        },
        {
          id: 'doodle-star',
          role: 'shape',
          type: 'shape',
          shape: 'circle',
          x: 0.71,
          y: 0.45,
          w: 0.02,
          h: 0.035,
          color: palette.accentColor || '#F59E0B',
          opacity: 0.8
        },
        {
          id: 'subscribe-badge',
          role: 'badge',
          type: 'badge',
          variant: 'subscribe-pill',
          colorScheme: 'youtube-red',
          x: 0.47,
          y: 0.59,
          scale: 0.75,
          safeAreaConstrained: true
        }
      ];
    }

    tmpl.editable = ['title', 'tagline', 'avatar', 'background.gradient'];
    tmpl.protected = ['sketch-box', 'doodle-star', 'subscribe-badge'];
  }
  else {
    // Other archetypes: ensure any frame has avatarPath, update text colors
    for (const l of tmpl.scene.layers) {
      if (l.type === 'frame' || l.role === 'frame' || l.role === 'avatar') {
        if (!l.src) l.src = avatarPath;
      } else if (l.role === 'title' || (l.type === 'text' && l === existingTitle)) {
        if (palette.titleColor) l.color = palette.titleColor;
      } else if (l.role === 'tagline' || (l.type === 'text' && l === existingTagline)) {
        if (palette.tagColor) l.color = palette.tagColor;
      }
    }
  }

  // Deduplicate editable array and ensure no overlap with protected
  tmpl.editable = [...new Set(tmpl.editable)].filter(e => !tmpl.protected.includes(e));

  // Write updated template
  fs.writeFileSync(filePath, JSON.stringify(tmpl, null, 2) + '\n');
}

console.log('✓ Successfully synchronized all 109 template JSONs with variant differentiation');
