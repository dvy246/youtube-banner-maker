import { CANVAS } from '../../lib/spec';

export const en = {
  common: {
    brandName: 'YouTube Banner Maker',
    tagline: 'Client-side · zero uploads',
    skipToContent: 'Skip to content',
    privacyBadge: '100% Client-Side Privacy',
    noAccountBadge: 'No Sign-Up or Accounts',
    noWatermarkBadge: 'No Watermark',
    launchResizer: 'Launch Resizer',
    openMobileMenu: 'Open mobile navigation menu',
    selectLanguage: 'Select language',
    languages: 'Languages',
    allRightsReserved: 'All rights reserved.',
  },
  nav: {
    fixBanner: 'Fix Banner',
    checker: 'Checker',
    maker: 'Maker',
    templates: 'Templates',
    sizeGuide: 'Size Guide',
    safeAreaGuide: 'Safe Area Guide',
  },
  footer: {
    brandDesc:
      'Browser-first channel art utility. Resizing, crop verification, and safe-area diagnostics powered entirely by local HTML5 Canvas.',
    colTools: 'Tools',
    resizer: 'Banner Resizer (Fix Door)',
    checker: 'Safe Area Checker (Check Door)',
    generator: 'Banner Generator (Create Door)',
    templateGallery: 'Curated Template Gallery',
    colGuides: 'Guides',
    guideSize: 'YouTube Banner Size & Specs',
    guideSafeArea: 'Safe Area Math & Crop Rules',
    colTrust: 'Trust & Legal',
    about: 'About & Methodology',
    contact: 'Contact & Support',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    colSpecs: 'Key Specifications',
    specRecommended: 'Recommended',
    specSafeArea: 'Safe Area (Mobile)',
    specMaxFileSize: 'Max File Size',
    specAspectRatio: 'Aspect Ratio',
    zeroTransmitted:
      'Zero image bytes transmitted over network. No watermark. No account required.',
    trademark:
      'YouTube is a registered trademark of Google LLC. This tool is independently built.',
  },
  home: {
    metaTitle: 'YouTube Banner Size: Free Maker, Resizer & Templates',
    metaDesc:
      `The official YouTube banner size is ${CANVAS.width}×${CANVAS.height} px. Resize, check safe areas, and create free channel art that fits every device without cropping.`,
    badgePrivacy: '100% Client-Side Privacy',
    badgeNoAccount: 'No Sign-Up or Accounts',
    badgeNoWatermark: 'No Watermark',
    heroTitlePre: 'Free YouTube Banner Maker That Fits',
    heroTitleAccent: 'Every Screen',
    heroSubtitle:
      'Resize, crop, and verify channel art against official YouTube mobile, tablet, desktop, and TV dimensions. 100% private in-browser canvas processing with zero upload delay.',
    ctaFix: 'Open Resizer Tool',
    ctaTemplates: 'Browse Free Templates',
    ctaCheck: 'Check Safe Area',
    telemetrySafe: 'Instant Safe Zone Crop',
    telemetryUniversal: 'Universal TV & Mobile Output',
    telemetryExport: `Clean ${CANVAS.width}×${CANVAS.height} Export`,
    simHeading: 'Live Multi-Device Crop Simulator',
    simSub: 'Toggle device viewports to see how YouTube displays your banner across hardware.',
    showcaseTitle: 'Studio-Grade Channel Art for Every Device',
    showcaseDesc:
      'YouTube crops banners differently across phones, tablets, laptops, and smart TVs. Our tool ensures your branding, typography, and logos stay centered in the safe zone.',
    specsTitle: 'Official YouTube Channel Banner Dimensions',
    specsDesc: 'Reference specifications verified against YouTube Studio documentation.',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Everything you need to know about YouTube banner dimensions, cropping, and export.',
  },
  about: {
    metaTitle: 'About YouTubeBannerMaker — Browser-First Channel Art Utility',
    metaDesc:
      'Learn how YouTubeBannerMaker was built to solve banner crop issues and compression artifacts using 100% in-browser HTML5 Canvas execution.',
    title: 'About YouTube Banner Maker',
    subtitle: 'A privacy-first, studio-grade utility engineered specifically for YouTube channel art.',
    missionTitle: 'Our Mission & Philosophy',
    missionP1:
      'Most online banner tools force you to register, watch ads, pay subscriptions, or upload your private artwork to their servers. We built YouTube Banner Maker to prove that professional creative tools can be instant, free, honest, and entirely private.',
    missionP2:
      'Every single pixel operation — decoding, scaling, canvas rendering, safe-zone masking, and PNG/JPEG export — executes locally inside your web browser. Zero image bytes are ever transmitted across a network.',
    valuesTitle: 'Core Engineering Invariants',
    val1Title: '100% Client-Side Processing',
    val1Desc: 'All image rendering uses local HTML5 Canvas APIs. Your designs never touch our servers.',
    val2Title: 'Copy Honesty',
    val2Desc: 'No hype or false promises. We explain real rasterization constraints and exact YouTube cropping mathematics.',
    val3Title: 'Zero Friction',
    val3Desc: 'No accounts, no email gates, no watermarks, and no paywalls. Instant creative utility in under 10 seconds.',
  },
  contact: {
    metaTitle: 'Contact & Support — YouTubeBannerMaker',
    metaDesc:
      'Get in touch with the YouTubeBannerMaker team for support, bug reports, and creator feature requests. Expected response time under 24 hours.',
    title: 'Contact & Support',
    subtitle: 'Have questions, found a bug, or want to suggest a template? Reach out directly.',
    getInTouchTitle: 'Get in Touch',
    emailLabel: 'Direct Email Support',
    emailDesc: 'For bug reports, technical inquiries, and feedback:',
    githubLabel: 'Open Source Community',
    githubDesc: 'Report issues or inspect source code on GitHub:',
    responseTime: 'Typical response time: within 24 to 48 hours.',
  },
  privacy: {
    metaTitle: 'Privacy Policy — YouTubeBannerMaker',
    metaDesc:
      'Our privacy policy: Zero image bytes are ever transmitted over the network. 100% client-side processing, sessionStorage usage, and advertising disclosures.',
    title: 'Privacy Policy',
    subtitle: 'Your artwork never leaves your device. Here is our mathematical guarantee.',
    zeroUploadTitle: 'Zero Server Upload Guarantee',
    zeroUploadP1:
      'YouTubeBannerMaker.com is architected from the ground up as a purely client-side web application. When you drop an image into the resizer, checker, or maker tools, that file is decoded and processed strictly in your local device memory.',
    zeroUploadP2:
      'Our application servers do not receive, store, inspect, or log any images, text, logos, or graphic assets you work with.',
    dataCollectionTitle: 'Information We Do Not Collect',
    noImages: 'No uploaded images, artwork, or graphics',
    noPii: 'No personal identification information, names, or emails',
    noCookies: 'No third-party advertising tracking cookies',
    localStorageTitle: 'Local Browser Storage',
    localStorageDesc:
      'We use standard browser localStorage solely to save your local UI preferences (such as light/dark mode and color theme selection). This data never leaves your browser.',
  },
  terms: {
    metaTitle: 'Terms of Service — YouTubeBannerMaker',
    metaDesc:
      'Terms of Service for YouTubeBannerMaker. Free for personal and commercial channel branding. Creators retain 100% ownership of their artwork.',
    title: 'Terms of Service',
    subtitle: 'Transparent terms for a free, privacy-first creative utility.',
    usageTitle: 'Acceptable Use & License',
    usageP1:
      'YouTube Banner Maker is provided completely free of charge for both personal and commercial YouTube channel art production. You own 100% of all banners, graphics, and exports you create using this tool.',
    disclaimerTitle: 'Trademark Disclaimer',
    disclaimerP1:
      'YouTube is a registered trademark of Google LLC. YouTube Banner Maker is an independent utility and is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC.',
    liabilityTitle: 'Limitation of Liability',
    liabilityP1:
      'This tool is provided "as is" without warranty of any kind. We strive to provide the most accurate mathematical representation of YouTube Studio banner specifications.',
  },
  guideSize: {
    metaTitle: 'YouTube Banner Size: 2560×1440, Safe Area & Device Crops',
    metaDesc:
      `The correct YouTube banner size is ${CANVAS.width}×${CANVAS.height} px (min 2048×1152), max 6 MB. Safe area details, device crops, and why channel art gets cut off.`,
    title: 'YouTube Banner Size Guide: Dimensions & Safe Area',
    subtitle:
      `The definitive technical guide to the ${CANVAS.width}×${CANVAS.height} px YouTube channel art standard, multi-device viewports, and safe-area geometry.`,
    quickAnswerTitle: 'Quick Reference: Official YouTube Banner Dimensions',
    fullCanvas: 'Full Canvas Size',
    safeArea: 'Mobile Safe Area',
    minUpload: 'Minimum Upload Size',
    maxFileSize: 'Maximum File Size',
    aspectRatio: 'Aspect Ratio',
  },
  guideSafeArea: {
    metaTitle: 'YouTube Banner Safe Area Dimensions & Device Crop Guide',
    metaDesc:
      'Understand the YouTube banner safe area. See the math proving that both official safe area numbers describe the exact same centered viewing area.',
    title: 'YouTube Banner Safe Area Guide: Math & Device Crops',
    subtitle:
      'Why YouTube banners get cut off on mobile devices, and how to position text and logos safely inside the centered crop zone.',
    mathTitle: 'The Safe Area Geometry Explained',
    mobileVsDesktop: 'Mobile vs. Desktop Viewing Areas',
  },
  guide1024: {
    metaTitle: 'YouTube Banner 1024x576: Why Upload Fails & Correct Size',
    metaDesc:
      `Why YouTube rejects 1024×576 banners. Learn the 16:9 ratio math, minimum 2048×1152 requirements, and how to upscale safely to ${CANVAS.width}×${CANVAS.height} for free.`,
    title: 'Why YouTube Rejects 1024×576 Banners & How to Fix',
    subtitle:
      `Understand YouTube's minimum 2048×1152 px requirement and how to upscale your 16:9 artwork to ${CANVAS.width}×${CANVAS.height} px.`,
  },
  templatesHub: {
    metaTitle: 'Free YouTube Banner Templates: Tested for Mobile Safe Area',
    metaDesc:
      'Explore free, customizable YouTube banner templates designed for mobile safe area compliance. Filter by gaming, tech, podcast, music, and more.',
    title: 'Curated YouTube Banner Templates',
    subtitle:
      'Explore studio-tested layouts engineered for perfect multi-device safe area compliance. Free to customize and export.',
    filterAll: 'All Niches',
    browseNiche: 'Browse by Niche',
    customizeBtn: 'Customize Template →',
  },
  tools: {
    resizer: {
      metaTitle: 'YouTube Banner Resizer: Resize to 2560x1440 Free Online',
      metaDesc:
        `Resize and crop any image to the exact ${CANVAS.width}×${CANVAS.height} YouTube banner size. Free online tool, 100% client-side privacy, mobile safe area preview.`,
      title: 'YouTube Banner Resizer (Fix Door)',
      intro:
        `Drop any image to resize, reposition, and export a safe ${CANVAS.width}×${CANVAS.height} px YouTube channel banner in seconds.`,
    },
    checker: {
      metaTitle: 'YouTube Banner Checker: Safe Area Simulator & Crop Test',
      metaDesc:
        'Test your YouTube channel banner across mobile, tablet, desktop, and TV viewports before uploading. Instant safe area diagnostic tool.',
      title: 'YouTube Banner Safe Area Checker (Check Door)',
      intro:
        'Upload your existing banner to verify that your channel name, social icons, and artwork stay safely inside the mobile view zone.',
      handoffTitle: 'One-Click Fix Handoff',
      handoffDesc:
        'Need to reposition your artwork or fix safe area cutoffs? Open your uploaded banner directly in the resizer editor with your image preserved.',
      handoffBtn: 'Fix in Resizer Editor →',
    },
    maker: {
      metaTitle: 'YouTube Banner Maker: Free Online Channel Art Creator',
      metaDesc:
        'Create YouTube channel banners online with safe-area guides. Clean typography, customizable templates, 100% browser-based with no watermark.',
      title: 'YouTube Banner Maker (Create Door)',
      intro:
        'Design professional YouTube banners with custom typography, gradients, and layout templates with built-in safe area validation.',
    },
    cdnAdvisoryTitle: 'YouTube CDN Cache Advisory',
    cdnAdvisoryText:
      'When you upload your corrected banner to YouTube Studio, changes may take up to 24 hours to appear across all edge networks, caching layers, and mobile apps. If your previous banner appears to linger, clear your browser cache or test in a private browsing window.',
    reencodeTitle: "Understanding YouTube's Automatic Re-Encoding",
    reencodeText:
      "YouTube automatically re-compresses every uploaded channel art image down to approximately 134 KB for desktop devices and smaller budgets for mobile screens. This re-encoding cannot be bypassed, which is why testing your banner with our simulation mode helps verify text contrast before uploading.",
  },
  niches: {
    gaming: {
      name: 'Gaming',
      title: 'Gaming YouTube Banner Templates: Free & Safe for Mobile',
      desc: `Free gaming YouTube channel banner templates. Tested against real mobile safe area crops, instant browser editing, and clean ${CANVAS.width}×${CANVAS.height} export.`,
      heroTitle: 'Gaming YouTube Banner Templates',
      heroDesc:
        'Built for competitive esports rosters, retro speedrunners, and variety streamers. Each layout keeps your gamer tag, streaming schedule, and sponsor logos centered inside the mobile safe area, so your channel branding never gets cropped on mobile devices. Edit colors, swap gradients, or drop in your character art with zero sign-up.',
      designNotes:
        'High-energy gaming banners frequently suffer from clipping when creator tags or team logos are pushed toward the corners. These gaming templates utilize centered cyber grids, retro arcade framing, and tactical HUD aesthetics engineered to remain crisp on 4K TVs while preserving core channel identity on mobile screens.',
      cropAdvice:
        'Esports banners and gaming streams frequently feature team rosters, stream schedules, and sponsor logos. Positioning sponsor logos and broadcast times strictly within the centered safe area ensures mobile viewers never miss your stream start times. Let background concept art, game world maps, or character silhouettes bleed outward into the desktop and TV zones to deliver immersive widescreen framing without sacrificing mobile legibility.',
    },
    tech: {
      name: 'Tech',
      title: 'Tech YouTube Banner Templates: Minimal & Mobile-Safe',
      desc: 'Clean tech channel banner templates. Modern developer and hardware aesthetic, verified safe-area geometry, zero watermark or sign-up needed.',
      heroTitle: 'Tech YouTube Banner Templates',
      heroDesc:
        'Engineered for software developers, hardware reviewers, and tech educators. Clean terminal prompts, monospace accents, and disciplined visual hierarchies that present your publishing cadence and technical focus clearly across desktop and smartphone viewports.',
      designNotes:
        'Developer and technology channels require structured precision. Our tech templates feature dark terminal themes, clean gridlines, and balanced typography calibrated to stay sharp on high-DPI desktop screens while remaining legible on smaller phone screens.',
      cropAdvice:
        'Software architecture diagrams, code syntax, and terminal commands must be positioned inside the safe area so mobile developers can read repository names and tech stacks. Avoid placing GitHub URLs or framework icons in the extreme horizontal margins where desktop-only cropping leaves mobile visitors looking at empty backgrounds.',
    },
    podcast: {
      name: 'Podcast',
      title: 'Podcast YouTube Banner Templates: Free Safe Layouts',
      desc: `Professional podcast YouTube banner templates. Centered safe-area typography, high contrast studio designs, and instant free ${CANVAS.width}×${CANVAS.height} download.`,
      heroTitle: 'Podcast YouTube Banner Templates',
      heroDesc:
        'Crafted for video podcasters, interview series, and roundtable shows. High-contrast typography emphasizes your show title, co-host names, and episode release cadence in the central safe zone, ensuring your banner looks authoritative whether viewed on a 4K TV or mobile app.',
      designNotes:
        'Video podcasts need immediate brand recognition and clear release schedules. These studio-tested layouts provide balanced focal points for show names, episode frequency, and audio network syndication badges without risking crop cutoff on narrower screens.',
      cropAdvice:
        'Podcast banners require immediate host identification and syndication awareness. Keep host monikers, co-host names, episode drop days, and network badges centered in the safe area so mobile listeners instantly recognize the show. High-resolution studio mic photography or acoustic panel patterns can bleed out to the full 16:9 canvas for a polished smart TV appearance.',
    },
    vlog: {
      name: 'Vlog & Lifestyle',
      title: 'Vlog YouTube Banner Templates: Aesthetic Channel Art',
      desc: `Curated lifestyle and vlog banner templates. Cinematic typography, perfect mobile and desktop framing, and instant browser-based ${CANVAS.width}×${CANVAS.height} export.`,
      heroTitle: 'Vlog & Lifestyle Channel Art Templates',
      heroDesc:
        'Designed for travel vloggers, daily creators, and lifestyle documentarians. Cinematic framing and editorial typography create an inviting first impression for new subscribers while keeping channel names and upload schedules centered inside the safe viewing area.',
      designNotes:
        'Personal vlogging channels connect through mood and aesthetic tone. Our vlog templates feature golden-hour palettes, magazine-style editorial typography, and spacious layouts designed to complement creator photography without compromising text visibility.',
      cropAdvice:
        'For vloggers and lifestyle documentarians, creator portraits and signature hand-lettered titles should sit directly inside the safe zone. Scenic travel landscapes, city skylines, and ambient textures should fill the surrounding canvas so desktop and TV viewers enjoy wide cinematic depth while phone screens retain a personal, centered connection.',
    },
    music: {
      name: 'Music & Producer',
      title: 'Music YouTube Banner Templates: Lo-Fi, Synth & Acoustic',
      desc: 'Custom channel banners for musicians, producers, and beats channels. Balanced compositions tested across all screen crops with zero sign-up.',
      heroTitle: 'Music & Producer YouTube Banner Templates',
      heroDesc:
        'Curated for independent beatmakers, lo-fi stream hosts, synthwave artists, and acoustic musicians. Atmospheric color palettes and distinct musical typography establish your sound identity while keeping your artist moniker and release dates safe on every screen.',
      designNotes:
        'Audio branding requires atmospheric restraint. Our music channel templates prioritize moody waveforms, analog tape aesthetics, and high-legibility album typography calibrated to survive aggressive YouTube mobile crops.',
      cropAdvice:
        'Keep record label insignias, Spotify/Apple Music release badges, and tour dates locked in the central safe area. Synthwave wireframes, vinyl textures, and studio lighting patterns should bleed freely to the perimeter.',
    },
    fitness: {
      name: 'Fitness',
      title: 'Fitness YouTube Banner Templates: Bold & High-Contrast',
      desc: 'High-impact fitness and coaching banner templates. Bold typography positioned inside YouTube’s safe area for flawless mobile and TV rendering.',
      heroTitle: 'Fitness & Training YouTube Banner Templates',
      heroDesc:
        'Built for personal trainers, bodybuilding coaches, and workout creators. High-energy typography and dynamic framing motivate subscribers while ensuring your training schedule stays fully visible on smartphones.',
      designNotes:
        'Athletic channel art demands strength and urgency. These templates incorporate bold diagonal cuts, high-contrast numerals for weekly splits, and disciplined focal points positioned safely away from device crop boundaries.',
      cropAdvice:
        'Workout schedules, app download badges, and transformation challenges must remain centered. Let dynamic gym photography and motivational textures extend into desktop margins.',
    },
    education: {
      name: 'Education',
      title: 'Education YouTube Banner Templates: Academic & Modern',
      desc: 'Authoritative channel art for educators and tutorial creators. Clean layouts designed to keep all text and branding visible on any device.',
      heroTitle: 'Education & Tutorial YouTube Banner Templates',
      heroDesc:
        'Designed for science communicators, history educators, and tutorial channels. Balanced grid structures communicate authority and clarity across all screen sizes.',
      designNotes:
        'Educational channels rely on trust and structure. Our academic layouts balance serif headlines with modern sans-serif subtitles, keeping subject topics and publication frequencies clearly readable.',
      cropAdvice:
        'Course topics, university credentials, and lecture series titles must be strictly centered. Diagrammatic sketches, historical maps, and subtle paper textures can fill the TV canvas.',
    },
    lifestyle: {
      name: 'Lifestyle',
      title: 'Lifestyle YouTube Banner Templates: Minimalist Art',
      desc: 'Understated, minimal lifestyle channel banners. Elegant serif and sans typography framed perfectly inside the mobile safe area.',
      heroTitle: 'Lifestyle & Wellness YouTube Banner Templates',
      heroDesc:
        'Engineered for wellness coaches, interior design channels, and mindful living creators. Serene palettes and spacious typography create an inspiring channel header.',
      designNotes:
        'Minimalist lifestyle art thrives on white space and subtle tones. These templates use airy layouts and refined typography to let your channel aesthetic speak for itself without clutter.',
      cropAdvice:
        'Channel mottos and upload cadences should reside comfortably inside the mobile safe boundaries. Soft neutral backgrounds, botanical shadows, and architectural textures should expand gracefully to desktop dimensions.',
    },
    food: {
      name: 'Food & Culinary',
      title: 'Food YouTube Banner Templates: Cooking & Restaurant Art',
      desc: 'Curated food and cooking channel banners. Appetizing typography and culinary layout elements verified safe across mobile and desktop displays.',
      heroTitle: 'Cooking & Culinary YouTube Banner Templates',
      heroDesc:
        'Crafted for home chefs, baking channels, and restaurant reviewers. Warm palettes and appetizing design accents showcase your culinary passion while keeping your recipe schedule centered.',
      designNotes:
        'Food channels require warmth and personality. These templates feature artisan bakery and modern bistro aesthetics with clear focal points for your upload schedule.',
      cropAdvice:
        'Keep recipe release days and specialty dish highlights inside the safe area. High-resolution ingredient textures, marble counter backdrops, and rustic kitchen accents can spill out to 16:9 widescreen.',
    },
    business: {
      name: 'Business',
      title: 'Business YouTube Banner Templates: Agency & Creator Art',
      desc: 'High-authority channel banners for real estate agents, agencies, and business creators. Centered safe-area layouts with zero paywalls.',
      heroTitle: 'Business & Agency YouTube Banner Templates',
      heroDesc:
        'Engineered for entrepreneurs, marketing agencies, and real estate professionals. Polished executive aesthetics establish credibility and highlight value propositions safely across devices.',
      designNotes:
        'Corporate and agency channels require executive authority. These layouts provide structured typography hierarchies for client value propositions, consulting schedules, and accreditation badges.',
      cropAdvice:
        'Value propositions, agency phone/web links, and call-to-action prompts must remain strictly inside the central safe zone. Geometric architectural patterns and subtle corporate gradients can expand to 4K TV boundaries.',
    },
  },
  notFound: {
    title: '404: Page Not Found',
    subtitle: 'The page you requested could not be located.',
    homeBtn: 'Return to YouTube Banner Maker Home →',
  },
};

export type Translations = typeof en;
