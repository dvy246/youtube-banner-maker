import { CANVAS } from '../../lib/spec';
import type { Translations } from './en';

export const fr: Translations = {
  common: {
    brandName: 'YouTube Banner Maker',
    tagline: 'Dans le navigateur · zéro envoi',
    skipToContent: 'Aller au contenu principal',
    privacyBadge: 'Confidentialité 100% Côté Client',
    noAccountBadge: 'Sans Inscription ni Compte',
    noWatermarkBadge: 'Sans Filigrane',
    launchResizer: 'Lancer le Redimensionneur',
    openMobileMenu: 'Ouvrir le menu de navigation',
    selectLanguage: 'Choisir la langue',
    languages: 'Langues',
    allRightsReserved: 'Tous droits réservés.',
  },
  nav: {
    fixBanner: 'Ajuster Bannière',
    checker: 'Vérificateur',
    maker: 'Créateur',
    templates: 'Modèles',
    sizeGuide: 'Guide des Tailles',
    safeAreaGuide: 'Guide Zone de Sécurité',
  },
  footer: {
    brandDesc:
      'Utilitaire d\'illustration de chaîne YouTube dans le navigateur. Redimensionnement, vérification de recadrage et diagnostic de zone sécurisée avec HTML5 Canvas.',
    colTools: 'Outils',
    resizer: 'Redimensionneur de Bannière (Ajuster)',
    checker: 'Vérificateur de Zone Sécurisée (Vérifier)',
    generator: 'Générateur de Bannière (Créer)',
    templateGallery: 'Galerie de Modèles de Bannières',
    colGuides: 'Guides',
    guideSize: 'Tailles et Formats de Bannières YouTube',
    guideSafeArea: 'Zone de Sécurité & Règles de Rognage',
    colTrust: 'Confiance & Légal',
    about: 'À Propos & Méthodologie',
    contact: 'Contact & Support',
    privacy: 'Politique de Confidentialité',
    terms: 'Conditions d\'Utilisation',
    colSpecs: 'Spécifications Officielles',
    specRecommended: 'Recommandé',
    specSafeArea: 'Zone Sécurisée (Mobile)',
    specMaxFileSize: 'Taille Maximale',
    specAspectRatio: 'Format d\'Image',
    zeroTransmitted:
      'Aucun octet d\'image transmis sur le réseau. Sans filigrane. Sans création de compte.',
    trademark:
      'YouTube est une marque déposée de Google LLC. Cet outil est développé de façon indépendante.',
  },
  home: {
    metaTitle: 'Taille Bannière YouTube: Créateur & Modèles Gratuits',
    metaDesc:
      `La taille officielle de bannière YouTube est ${CANVAS.width}×${CANVAS.height} px. Redimensionnez et créez des bannières adaptées aux mobiles, PC et TV sans coupure.`,
    badgePrivacy: 'Confidentialité 100% Côté Client',
    badgeNoAccount: 'Sans Inscription ni Compte',
    badgeNoWatermark: 'Sans Filigrane',
    heroTitlePre: 'Créateur de Bannières YouTube Adapté à',
    heroTitleAccent: 'Tous les Écrans',
    heroSubtitle:
      'Redimensionnez, recadrez et vérifiez vos bannières pour mobiles, tablettes, ordinateurs et TV. Rendu local 100% privé dans votre navigateur avec HTML5 Canvas sans délai de téléversement.',
    ctaFix: 'Lancer le Redimensionneur',
    ctaTemplates: 'Voir les Modèles Gratuits',
    ctaCheck: 'Vérifier la Zone Sécurisée',
    telemetrySafe: 'Rognage Sécurisé Automatique',
    telemetryUniversal: 'Optimisé pour TV et Mobile',
    telemetryExport: `Export Haute Définition en ${CANVAS.width}×${CANVAS.height}`,
    simHeading: 'Simulateur Multi-Écrans en Direct',
    simSub: 'Basculez entre les écrans pour vérifier comment YouTube affiche votre bannière sur chaque appareil.',
    showcaseTitle: 'Une Illustration de Chaîne Professionnelle sur Tout Support',
    showcaseDesc:
      'YouTube recadre les bannières différemment selon le smartphone, la tablette ou l\'écran d\'ordinateur. Notre outil garantit que votre logo et vos textes clés restent parfaitement centrés.',
    specsTitle: 'Dimensions Officielles des Bannières YouTube',
    specsDesc: 'Spécifications techniques vérifiées d\'après la documentation de YouTube Studio.',
    faqTitle: 'Foire Aux Questions (FAQ)',
    faqDesc: 'Tout ce que vous devez savoir sur les dimensions, le recadrage et l\'exportation des bannières YouTube.',
  },
  about: {
    metaTitle: 'À Propos de YouTube Banner Maker: Confidentialité',
    metaDesc:
      'Découvrez YouTube Banner Maker: outil 100% navigateur, aucun téléversement vers un serveur, rendu local HTML5 Canvas et zéro inscription.',
    title: 'À Propos de YouTube Banner Maker',
    subtitle: 'Un outil de niveau professionnel respectueux de votre vie privée, pensé pour les créateurs YouTube.',
    missionTitle: 'Notre Mission & Notre Éthique',
    missionP1:
      'La plupart des outils en ligne imposent une inscription, diffusent des publicités agressives ou envoient vos fichiers personnels sur des serveurs distants. Nous avons développé YouTube Banner Maker pour prouver qu\'un outil créatif professionnel peut être instantané, gratuit, transparent et totalement confidentiel.',
    missionP2:
      'Chaque opération — décodage, redimensionnement, rendu Canvas, application du masque de zone sécurisée et export PNG/JPEG — se déroule localement sur votre machine. Aucun octet d\'image ne transite sur Internet.',
    valuesTitle: 'Nos Principes Techniques',
    val1Title: 'Traitement 100% Côté Client',
    val1Desc: 'Tout le rendu s\'effectue via les APIs HTML5 Canvas locales. Vos images ne touchent jamais nos serveurs.',
    val2Title: 'Honnêteté des Spécifications',
    val2Desc: 'Aucune fausse promesse. Nous expliquons les contraintes réelles de pixellisation et les règles mathématiques exactes de YouTube.',
    val3Title: 'Zéro Contrainte',
    val3Desc: 'Pas de compte, pas de formulaire e-mail, aucun filigrane et aucun frais. Un outil opérationnel en moins de 10 secondes.',
  },
  contact: {
    metaTitle: 'Contact & Support: YouTube Banner Maker',
    metaDesc:
      'Contactez l\'équipe de YouTube Banner Maker pour toute question technique, rapport de bug ou suggestion. Réponse rapide et directe.',
    title: 'Contact & Support',
    subtitle: 'Une question, un problème technique ou une idée de modèle à proposer ? Écrivez-nous directement.',
    getInTouchTitle: 'Nous Joindre',
    emailLabel: 'Support Direct par E-mail',
    emailDesc: 'Pour vos retours, questions et signalements de dysfonctionnements :',
    githubLabel: 'Communauté Open Source',
    githubDesc: 'Signalez une anomalie ou consultez le code sur GitHub :',
    responseTime: 'Délai de réponse habituel : entre 24 et 48 heures.',
  },
  privacy: {
    metaTitle: 'Politique de Confidentialité: 100% Côté Client',
    metaDesc:
      'Vos créations restent sur votre appareil. Traitement 100% local via HTML5 Canvas, aucun envoi vers des serveurs et aucun cookie tiers.',
    title: 'Politique de Confidentialité',
    subtitle: 'Vos images ne quittent jamais votre appareil. C\'est notre engagement technique.',
    zeroUploadTitle: 'Garantie de Zéro Envoi vers un Serveur',
    zeroUploadP1:
      'YouTubeBannerMaker.com est conçu dès sa genèse comme une application web exécutée exclusivement dans votre navigateur. Lorsque vous glissez une image dans nos outils, celle-ci est traitée uniquement dans la mémoire vive de votre appareil.',
    zeroUploadP2:
      'Nos serveurs d\'hébergement ne reçoivent, ne stockent, n\'inspectent et ne tracent aucune image, aucun texte, aucun logo ni aucun fichier que vous utilisez.',
    dataCollectionTitle: 'Ce Que Nous Ne Collectons Pas',
    noImages: 'Aucune image ni aucun fichier graphique téléversé',
    noPii: 'Aucune donnée personnelle, nom ou adresse e-mail',
    noCookies: 'Aucun cookie de pistage publicitaire tiers',
    localStorageTitle: 'Stockage Local du Navigateur',
    localStorageDesc:
      'Nous utilisons uniquement le localStorage de votre navigateur pour mémoriser vos préférences d\'interface (mode clair/sombre et palette de couleurs). Ces données restent strictement sur votre appareil.',
  },
  terms: {
    metaTitle: 'Conditions d\'Utilisation: Outil Bannière YouTube',
    metaDesc:
      'Conditions d\'utilisation de YouTube Banner Maker. Gratuit pour usage personnel et commercial. Mentions relatives aux marques de Google LLC.',
    title: 'Conditions d\'Utilisation',
    subtitle: 'Des règles claires pour un utilitaire de création gratuit et respectueux de la vie privée.',
    usageTitle: 'Usage Autorisé & Droits',
    usageP1:
      'YouTube Banner Maker est mis à disposition gratuitement pour la création d\'illustrations de chaîne, tant pour un usage privé que commercial. Vous demeurez le propriétaire exclusif de toutes les bannières créées et exportées avec cet outil.',
    disclaimerTitle: 'Avis Relatif aux Marques Déposées',
    disclaimerP1:
      'YouTube est une marque déposée de Google LLC. YouTube Banner Maker est un outil indépendant qui n\'est ni affilié, ni approuvé, ni sponsorisé par YouTube ou Google LLC.',
    liabilityTitle: 'Limitation de Responsabilité',
    liabilityP1:
      'Cet outil est fourni "en l\'état". Nous nous efforçons de proposer la reproduction mathématique la plus rigoureuse des spécifications officielles de YouTube Studio.',
  },
  guideSize: {
    metaTitle: 'Taille Bannière YouTube: 2560x1440 & Zone de Sécurité',
    metaDesc:
      `Guide complet des dimensions de bannière YouTube: ${CANVAS.width}×${CANVAS.height} px, zone sécurisée mobile, limite de 6 Mo et conseils contre les coupures.`,
    title: 'Guide Taille Bannière YouTube: Dimensions & Zone Sécurisée',
    subtitle:
      `Le guide technique de référence sur le standard ${CANVAS.width}×${CANVAS.height} px de YouTube, les fenêtres d\'affichage et la géométrie de sécurité.`,
    quickAnswerTitle: 'Aide-Mémoire : Dimensions Officielles de YouTube',
    fullCanvas: 'Dimensions Totales du Canvas',
    safeArea: 'Zone Sécurisée pour Mobile',
    minUpload: 'Dimensions Minimales Requises',
    maxFileSize: 'Poids Maximal du Fichier',
    aspectRatio: 'Ratio d\'Affichage',
  },
  guideSafeArea: {
    metaTitle: 'Zone de Sécurité Bannière YouTube: Dimensions & Règles',
    metaDesc:
      'Comprendre la zone de sécurité YouTube. Découvrez comment centrer textes et logos pour qu\'ils restent visibles sur smartphone et ordinateur.',
    title: 'Zone de Sécurité Bannière YouTube: Calculs & Recadrage',
    subtitle:
      'Comprendre pourquoi les bannières sont tronquées sur mobile et comment placer textes et logos dans la zone centrale protégée.',
    mathTitle: 'La Géométrie de la Zone de Sécurité Expliquée',
    mobileVsDesktop: 'Zone Visible sur Mobile vs Ordinateur',
  },
  guide1024: {
    metaTitle: 'Bannière YouTube 1024x576: Pourquoi Erreur et Solution',
    metaDesc:
      `Pourquoi YouTube refuse les bannières 1024×576 px. Explications du ratio 16:9, minimum 2048×1152 et comment convertir en ${CANVAS.width}×${CANVAS.height} gratuitement.`,
    title: 'Pourquoi YouTube Rejette les Bannières 1024×576 & Solutions',
    subtitle:
      `Comprendre la contrainte minimale de 2048×1152 px et comment redimensionner votre image 16:9 vers ${CANVAS.width}×${CANVAS.height} px proprement.`,
  },
  templatesHub: {
    metaTitle: 'Modèles de Bannière YouTube: Templates Gratuits',
    metaDesc:
      'Collection de modèles de bannière YouTube conformes à la zone sécurisée mobile. Templates pour gaming, tech, podcast, musique et vlogs.',
    title: 'Modèles de Bannières pour YouTube',
    subtitle:
      'Explorez nos designs testés en studio et calibrés pour la zone de sécurité de chaque appareil. Personnalisez et exportez gratuitement.',
    filterAll: 'Toutes les Thématiques',
    browseNiche: 'Explorer par Thématique',
    customizeBtn: 'Personnaliser ce Modèle →',
  },
  tools: {
    resizer: {
      metaTitle: 'Redimensionner Bannière YouTube: 2560x1440 Gratuit',
      metaDesc:
        `Ajustez vos images aux dimensions exactes de ${CANVAS.width}×${CANVAS.height} px pour YouTube. Outil en ligne gratuit avec aperçu de zone de sécurité pour mobile.`,
      title: 'Redimensionneur de Bannière YouTube (Ajuster)',
      intro:
        `Glissez n\'importe quelle image pour la recadrer et l\'exporter aux dimensions idéales de ${CANVAS.width}×${CANVAS.height} px en quelques secondes.`,
    },
    checker: {
      metaTitle: 'Vérificateur de Bannière YouTube: Test Zone Sécurisée',
      metaDesc:
        'Testez l\'affichage de votre bannière YouTube sur mobile, tablette et TV avant de la publier. Diagnostic immédiat de la zone de sécurité.',
      title: 'Vérificateur de Zone Sécurisée de Bannière (Vérifier)',
      intro:
        'Chargez votre bannière actuelle pour vérifier que le nom de votre chaîne et vos icônes sociales s\'affichent sans coupure sur smartphone.',
      handoffTitle: 'Ajustement en Un Clic',
      handoffDesc:
        'Besoin de repositionner des éléments ou de corriger un texte hors zone ? Ouvrez votre bannière directement dans le redimensionneur.',
      handoffBtn: 'Corriger dans le Redimensionneur →',
    },
    maker: {
      metaTitle: 'Créateur de Bannière YouTube: Outil Gratuit en Ligne',
      metaDesc:
        'Créez une bannière YouTube professionnelle avec repères de zone de sécurité. Modèles gratuits, typographie moderne et sans filigrane.',
      title: 'Créateur de Bannière YouTube (Générer)',
      intro:
        'Concevez des bannières remarquables avec une typographie personnalisée, des dégradés de couleurs et des repères de zone sécurisée.',
    },
    cdnAdvisoryTitle: 'Information sur le Cache CDN de YouTube',
    cdnAdvisoryText:
      'Lorsque vous téléversez une nouvelle bannière sur YouTube Studio, la mise à jour peut demander jusqu\'à 24 heures pour se propager sur tous les serveurs et l\'application mobile. Si l\'ancienne bannière s\'affiche toujours, videz le cache de votre navigateur.',
    reencodeTitle: 'Comprendre la Recompression Automatique de YouTube',
    reencodeText:
      'YouTube recompresse automatiquement toute image de bannière à environ 134 Ko sur ordinateur et selon des quotas encore plus réduits sur mobile. Ce traitement étant incontournable, notre simulateur vous aide à vérifier la netteté de vos textes avant mise en ligne.',
  },
  niches: {
    gaming: {
      name: 'Jeux Vidéo & Gaming',
      title: 'Modèles de Bannière YouTube Gaming: Gratuits & Sécurisés',
      desc: `Bannières pour streamers et équipes d'esports. Testées pour la zone sécurisée mobile, modification rapide et export en ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Modèles de Bannières Gaming pour YouTube',
      heroDesc:
        'Conçus pour les équipes esports, les streamers et les créateurs de gameplay. Vos pseudos, plannings de live et sponsors restent bien au centre de la zone sécurisée mobile.',
      designNotes:
        'Les bannières de jeux souffrent régulièrement de découpes gênantes quand les logos sont placés dans les coins. Nos modèles s\'appuient sur des grilles cyber et des cadres HUD tactiques.',
      cropAdvice:
        'Conservez les noms de joueurs et horaires de diffusion au centre de l\'image. Les illustrations et paysages d\'arrière-plan peuvent s\'étendre vers les marges pour les téléviseurs.',
    },
    tech: {
      name: 'Technologie & IT',
      title: 'Modèles de Bannière Tech pour YouTube: Épurés & Sécurisés',
      desc: 'Bannières pour développeurs et chaînes d\'actualité informatique. Graphisme soigné, respect de la zone de sécurité et sans filigrane.',
      heroTitle: 'Modèles de Bannières Tech pour YouTube',
      heroDesc:
        'Destinés aux développeurs, testeurs de matériel et pédagogues de l\'informatique. Typographie monospace et hiérarchie visuelle claire pour valoriser vos publications.',
      designNotes:
        'Les chaînes technologiques demandent rigueur et clarté. Nos modèles intègrent des tonalités de terminal sombre pour conserver une netteté remarquable sur grand écran et smartphone.',
      cropAdvice:
        'Lignes de code et noms de projets doivent être situés dans la zone centrale sécurisée afin d\'éviter qu\'un utilisateur mobile ne voie qu\'un fond sans contenu.',
    },
    podcast: {
      name: 'Podcasts & Émissions',
      title: 'Modèles de Bannière Podcast sur YouTube: Rendu Pro',
      desc: `Templates pour podcasts vidéo et tables rondes. Typographie contrastée et téléchargement gratuit en ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Modèles de Bannières pour Podcasts YouTube',
      heroDesc:
        'Créés pour les émissions filmées, interviews et talk-shows. Une typographie percutante met en valeur le titre de l\'émission et les animateurs dans la zone sûre.',
      designNotes:
        'Un podcast vidéo requiert une identification immédiate. Ces compositions apportent des points de repère visuels équilibrés sans risque de rognage.',
      cropAdvice:
        'Le titre du podcast et les jours de diffusion doivent être centrés dans la zone sécurisée. Les photos de micros de studio peuvent habiller tout le cadre 16:9.',
    },
    vlog: {
      name: 'Vlog & Lifestyle',
      title: 'Modèles de Bannière Vlog pour YouTube: Look Cinéma',
      desc: `Bannières élégantes pour vlogs de voyage et lifestyle. Cadrage optimal sur mobile et PC avec téléchargement en ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Modèles de Bannières Vlog et Lifestyle pour YouTube',
      heroDesc:
        'Pensés pour les vidéastes de voyage et documentaristes du quotidien. Un rendu cinématographique et des polices choisies pour séduire vos nouveaux visiteurs.',
      designNotes:
        'Les chaînes personnelles séduisent par leur atmosphère. Nos templates emploient des tons chauds et des espaces équilibrés pour sublimer vos photos.',
      cropAdvice:
        'Portraits et titres signature doivent figurer dans la zone sécurisée centrale. Les panoramas et paysages peuvent déborder sur les côtés pour les écrans de télévision.',
    },
    music: {
      name: 'Musique & Producteurs',
      title: 'Modèles de Bannière Musique sur YouTube: Lo-Fi & Beats',
      desc: 'Illustrations personnalisées pour beatmakers, musiciens et streams Lo-Fi. Compositions adaptées à tous les écrans sans inscription.',
      heroTitle: 'Modèles de Bannières Musique pour YouTube',
      heroDesc:
        'Dédiés aux compositeurs, lives Lo-Fi et artistes solos. Des palettes envoûtantes qui affirment votre univers sonore avec des mentions bien lisibles sur mobile.',
      designNotes:
        'L\'identité musicale demande une belle nuance visuelle. Ondes sonores, rendu vinyle et typographies d\'album résistent au recadrage appliqué par YouTube.',
      cropAdvice:
        'Logos de label, liens Spotify/Apple Music et dates de sortie doivent être verrouillés dans la zone centrale. Les motifs de synthétiseur peuvent garnir les extrémités.',
    },
    fitness: {
      name: 'Fitness & Musculation',
      title: 'Modèles de Bannière Fitness sur YouTube: Punchy & Soigné',
      desc: 'Bannières percutantes pour coachs et athlètes. Typographie puissante située dans la zone de sécurité YouTube pour mobile et TV.',
      heroTitle: 'Modèles de Bannières Fitness pour YouTube',
      heroDesc:
        'Pensés pour les coachs sportifs et athlètes. Une mise en page dynamique qui encourage les abonnés tout en gardant les plannings d\'entraînement visibles sur smartphone.',
      designNotes:
        'Les chaînes de sport exigent force et vitalité. Ces modèles proposent des découpes diagonales et des chiffres contrastés loin des zones de rognage.',
      cropAdvice:
        'Plannings et badges d\'applications doivent demeurer au centre. Les photos dynamiques de salle de sport peuvent s\'étendre sur les côtés.',
    },
    education: {
      name: 'Éducation & Savoir',
      title: 'Modèles de Bannière Éducative pour YouTube: Clairs & Pro',
      desc: 'Bannières de chaîne pour enseignants, vulgarisateurs et tutoriels. Mise en page structurée assurant la lisibilité de vos titres sur tout appareil.',
      heroTitle: 'Modèles de Bannières Éducation pour YouTube',
      heroDesc:
        'Conçus pour les vulgarisateurs scientifiques, historiens et formateurs. Des grilles équilibrées qui inspirent confiance et clarté sur n\'importe quel écran.',
      designNotes:
        'Les chaînes éducatives reposent sur la crédibilité. Nos mises en page allient titres à empattements et sous-titres épurés pour une excellente lisibilité.',
      cropAdvice:
        'Matières et titres de cours doivent rester rigoureusement centrés. Schémas et textures de papier peuvent habiller les bordures extérieures de la TV.',
    },
    lifestyle: {
      name: 'Art de Vivre & Bien-Être',
      title: 'Modèles de Bannière Minimalistes pour YouTube: Déco & Zen',
      desc: 'Bannières épurées pour chaînes de bien-être et d\'intérieur. Typographie raffinée centrée dans la zone protégée pour smartphone.',
      heroTitle: 'Modèles de Bannières Lifestyle et Bien-Être',
      heroDesc:
        'Pour les coachs de vie, chaînes de décoration et quotidien apaisé. Des teintes douces et une disposition aérée créent un en-tête chaleureux et inspirant.',
      designNotes:
        'Le minimalisme se distingue par la maîtrise du vide. Ces modèles mettent en avant des tonalités calmes pour laisser respirer l\'esprit de votre chaîne.',
      cropAdvice:
        'Slogan et rythme de publication doivent être confinés dans la zone sécurisée. Les ombres végétales peuvent s\'étirer doucement vers les bordures larges.',
    },
    food: {
      name: 'Cuisine & Recettes',
      title: 'Modèles de Bannière Cuisine pour YouTube: Gourmandise',
      desc: 'Bannières chaleureuses pour créateurs culinaires et pâtissiers. Typographie gourmande vérifiée pour téléphones et ordinateurs.',
      heroTitle: 'Modèles de Bannières Cuisine et Recettes',
      heroDesc:
        'Imaginés pour les cuisiniers amateurs, pâtissiers et critiques de restaurants. Des tons généreux qui mettent en appétit avec les jours de publication bien visibles.',
      designNotes:
        'La gastronomie nécessite de la chaleur. Les modèles reprennent l\'ambiance des bistrots et boulangeries de quartier avec des repères bien ordonnés.',
      cropAdvice:
        'Gardez les rendez-vous de recettes au centre. Les gros plans d\'ingrédients et plans de travail en marbre peuvent occuper tout le format 16:9.',
    },
    business: {
      name: 'Business & Finance',
      title: 'Modèles de Bannière Business pour YouTube: Entreprise',
      desc: 'Bannières statutaires pour agences, consultants, agents immobiliers et entrepreneurs. Mises en page centrées sans barrière payante.',
      heroTitle: 'Modèles de Bannières Business et Entreprise',
      heroDesc:
        'Élaborés pour les entrepreneurs, agences et conseillers. Une allure soignée qui renforce votre autorité et valorise vos services sur tous les écrans.',
      designNotes:
        'Les chaînes professionnelles exigent une présentation rigoureuse. Nos modèles hiérarchisent les propositions de valeur et coordonnées professionnelles.',
      cropAdvice:
        'Offres clés et liens de site web doivent figurer dans la zone sécurisée. Les textures graphiques sobres peuvent couvrir les abords pour les téléviseurs 4K.',
    },
  },
  notFound: {
    title: '404: Page Introuvable',
    subtitle: 'La page demandée n\'existe pas ou a été déplacée.',
    homeBtn: 'Retourner à l\'Accueil de YouTube Banner Maker →',
  },
};
