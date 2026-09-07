import { CANVAS } from '../../lib/spec';
import type { Translations } from './en';

export const de: Translations = {
  common: {
    brandName: 'YouTube Banner Maker',
    tagline: 'Im Browser · null Uploads',
    skipToContent: 'Zum Hauptinhalt springen',
    privacyBadge: '100% Client-Datenschutz im Browser',
    noAccountBadge: 'Ohne Registrierung & Account',
    noWatermarkBadge: 'Ohne Wasserzeichen',
    launchResizer: 'Resizer Starten',
    openMobileMenu: 'Navigationsmenü öffnen',
    selectLanguage: 'Sprache wählen',
    languages: 'Sprachen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
  },
  nav: {
    fixBanner: 'Banner Anpassen',
    checker: 'Prüfer',
    maker: 'Ersteller',
    templates: 'Vorlagen',
    sizeGuide: 'Größen-Guide',
    safeAreaGuide: 'Safe-Area-Leitfaden',
  },
  footer: {
    brandDesc:
      'Browser-basiertes YouTube-Kanalbild-Werkzeug. Größenanpassung, Zuschnittsprüfung und Sicherheitsbereich-Diagnose mit lokalem HTML5 Canvas.',
    colTools: 'Werkzeuge',
    resizer: 'Banner-Größenanpassung (Anpassen)',
    checker: 'Sicherheitsbereich-Prüfer (Checken)',
    generator: 'Banner-Ersteller (Neu erstellen)',
    templateGallery: 'Kuratierte Vorlagen-Galerie',
    colGuides: 'Leitfäden',
    guideSize: 'YouTube Banner Maße & Richtlinien',
    guideSafeArea: 'Sicherheitsbereich & Zuschnittregeln',
    colTrust: 'Transparenz & Rechtliches',
    about: 'Über uns & Methodik',
    contact: 'Kontakt & Support',
    privacy: 'Datenschutzerklärung',
    terms: 'Nutzungsbedingungen',
    colSpecs: 'Offizielle Spezifikationen',
    specRecommended: 'Empfohlene Maße',
    specSafeArea: 'Sicherheitsbereich (Mobil)',
    specMaxFileSize: 'Max. Dateigröße',
    specAspectRatio: 'Seitenverhältnis',
    zeroTransmitted:
      'Keine Bilddaten über das Netzwerk übertragen. Ohne Wasserzeichen. Ohne Registrierung.',
    trademark:
      'YouTube ist eine eingetragene Marke von Google LLC. Dieses Tool ist unabhängig entwickelt.',
  },
  home: {
    metaTitle: 'YouTube Banner Größe: Kostenloser Maker & Vorlagen',
    metaDesc:
      `Die offizielle YouTube Banner Größe ist ${CANVAS.width}×${CANVAS.height} px. Passe Kanalbilder kostenlos an und erstelle sichere Designs ohne mobile Zuschnitte.`,
    badgePrivacy: '100% Client-Datenschutz im Browser',
    badgeNoAccount: 'Ohne Registrierung & Account',
    badgeNoWatermark: 'Ohne Wasserzeichen',
    heroTitlePre: 'Kostenloser YouTube Banner Maker Für',
    heroTitleAccent: 'Jeden Bildschirm',
    heroSubtitle:
      'Größe anpassen, zuschneiden und Kanalbilder für Smartphones, Tablets, Desktops und Fernseher prüfen. 100% private Canvas-Berechnung direkt im Browser ohne Upload-Wartezeit.',
    ctaFix: 'Resizer Starten',
    ctaTemplates: 'Kostenlose Vorlagen',
    ctaCheck: 'Sicherheitsbereich Prüfen',
    telemetrySafe: 'Automatischer Schutzbereich',
    telemetryUniversal: 'Optimiert für TV & Smartphone',
    telemetryExport: `Export in ${CANVAS.width}×${CANVAS.height}`,
    simHeading: 'Live Multi-Geräte Zuschnitt-Simulator',
    simSub: 'Wechsle zwischen Geräten und prüfe sofort, wie YouTube dein Kanalbild auf jedem Display darstellt.',
    showcaseTitle: 'Studio-Kanalbilder für Alle Bildschirme',
    showcaseDesc:
      'YouTube schneidet Banner je nach Smartphone, Tablet, PC und Smart-TV unterschiedlich ab. Unser Werkzeug sorgt dafür, dass dein Logo und wichtige Texte stets im sicheren Bereich bleiben.',
    specsTitle: 'Offizielle YouTube-Kanalbild Spezifikationen',
    specsDesc: 'Referenzmaße verifiziert anhand der Dokumentation von YouTube Studio.',
    faqTitle: 'Häufig Gestellte Fragen (FAQ)',
    faqDesc: 'Alles Wissenswerte über YouTube Banner Abmessungen, Zuschnitte und Bildexporte.',
  },
  about: {
    metaTitle: 'Über YouTube Banner Maker: Datenschutz & Methodik',
    metaDesc:
      'Erfahre, warum YouTube Banner Maker zu 100% im Browser läuft: keine Server-Uploads, lokale Canvas-Berechnung und echte Spezifikationstreue.',
    title: 'Über YouTube Banner Maker',
    subtitle: 'Ein datenschutzorientiertes Werkzeug in Studioqualität, speziell für YouTube-Kreative entwickelt.',
    missionTitle: 'Unsere Mission & Philosophie',
    missionP1:
      'Die meisten Online-Banner-Generatoren verlangen Registrierungen, blenden aufdringliche Werbung ein, fordern teure Abonnements oder laden deine privaten Entwürfe auf entfernte Server hoch. Wir haben YouTube Banner Maker entwickelt, um zu beweisen, dass professionelle Kreativwerkzeuge sofort, gratis, transparent und vollständig privat sein können.',
    missionP2:
      'Jede Bildoperation — Dekodierung, Skalierung, Canvas-Darstellung, Sicherheitsbereich-Maskierung und PNG/JPEG-Export — läuft lokal in deinem Webbrowser ab. Kein einziges Byte deiner Bilder wird über ein Netzwerk übertragen.',
    valuesTitle: 'Technische Leitprinzipien',
    val1Title: '100% Clientseitige Verarbeitung',
    val1Desc: 'Die gesamte Bildverarbeitung nutzt lokale HTML5 Canvas APIs. Deine Entwürfe berühren unsere Server nicht.',
    val2Title: 'Ehrliche Spezifikationen',
    val2Desc: 'Keine leeren Versprechen. Wir erklären die echten Grenzen der Rasterung und die exakte Zuschnittmathematik von YouTube.',
    val3Title: 'Reibungsloser Ablauf',
    val3Desc: 'Keine Accounts, keine E-Mail-Schranken, keine Wasserzeichen und keine Kosten. Kreative Werkzeuge in unter 10 Sekunden.',
  },
  contact: {
    metaTitle: 'Kontakt & Support: YouTube Banner Maker',
    metaDesc:
      'Kontaktiere das Team von YouTube Banner Maker für technischen Support, Fehlerberichte oder Vorlagenwünsche. Schnelle Rückmeldung garantiert.',
    title: 'Kontakt & Support',
    subtitle: 'Hast du Fragen, einen Fehler gefunden oder einen Vorlagenwunsch? Schreib uns direkt.',
    getInTouchTitle: 'Kontakt Aufnehmen',
    emailLabel: 'Direkter E-Mail-Support',
    emailDesc: 'Für technische Fragen, Fehlerberichte und Feedback:',
    githubLabel: 'Open-Source-Gemeinschaft',
    githubDesc: 'Issues einreichen oder Quellcode auf GitHub einsehen:',
    responseTime: 'Reguläre Antwortzeit: innerhalb von 24 bis 48 Stunden.',
  },
  privacy: {
    metaTitle: 'Datenschutzerklärung: 100% Lokal Ohne Server-Upload',
    metaDesc:
      'Deine Bilder verlassen dein Gerät nie. Lokale HTML5 Canvas Verarbeitung ohne Uploads, ohne Tracking-Cookies und ohne Datenspeicherung.',
    title: 'Datenschutzerklärung',
    subtitle: 'Deine Designs verlassen dein Gerät niemals. Unser technisches Versprechen.',
    zeroUploadTitle: 'Garantie: Null Server-Uploads',
    zeroUploadP1:
      'YouTubeBannerMaker.com ist von Grund auf als reine Client-seitige Webanwendung konzipiert. Wenn du ein Bild in das Werkzeug ziehst, wird die Datei ausschließlich im Arbeitsspeicher deines Geräts verarbeitet.',
    zeroUploadP2:
      'Unsere Anwendungsserver empfangen, speichern, analysieren oder protokollieren zu keinem Zeitpunkt deine Bilder, Schriften, Logos oder grafischen Elemente.',
    dataCollectionTitle: 'Daten, Die Wir Nicht Sammeln',
    noImages: 'Keine hochgeladenen Bilder oder Grafiken',
    noPii: 'Keine personenbezogenen Daten, Namen oder E-Mails',
    noCookies: 'Keine Werbe-Tracking-Cookies von Drittanbietern',
    localStorageTitle: 'Lokaler Speicher des Browsers',
    localStorageDesc:
      'Wir nutzen den standardmäßigen localStorage deines Browsers ausschließlich zum Speichern deiner Schnittstelleneinstellungen (wie Hell-/Dunkelmodus und Farbthema). Diese Daten verlassen deinen Browser nie.',
  },
  terms: {
    metaTitle: 'Nutzungsbedingungen: YouTube Kanalbild Tool',
    metaDesc:
      'Nutzungsbedingungen für YouTube Banner Maker. Kostenlos für private und gewerbliche Nutzung. Hinweise zu Marken von Google LLC und YouTube.',
    title: 'Nutzungsbedingungen',
    subtitle: 'Transparente Bedingungen für ein kostenloses, privates Kreativwerkzeug.',
    usageTitle: 'Zulässige Nutzung & Lizenz',
    usageP1:
      'YouTube Banner Maker wird sowohl für persönliche als auch gewerbliche YouTube-Kanalbilder vollkommen kostenlos bereitgestellt. Du besitzt 100% der Urheberrechte an allen mit diesem Tool erstellten oder exportierten Bannern.',
    disclaimerTitle: 'Hinweis zu Markenzeichen',
    disclaimerP1:
      'YouTube ist eine eingetragene Marke von Google LLC. YouTube Banner Maker ist ein unabhängiges Dienstprogramm und steht in keiner Verbindung zu YouTube oder Google LLC und wird von diesen weder unterstützt noch gesponsert.',
    liabilityTitle: 'Haftungsbeschränkung',
    liabilityP1:
      'Dieses Werkzeug wird "wie besehen" bereitgestellt. Wir streben danach, die präziseste mathematische Nachbildung der Vorgaben von YouTube Studio anzubieten.',
  },
  guideSize: {
    metaTitle: 'YouTube Banner Größe: 2560x1440 & Sicherheitsbereich',
    metaDesc:
      `Der umfassende Leitfaden zur YouTube Banner Größe (${CANVAS.width}×${CANVAS.height} px, min. 2048×1152, max. 6 MB). Alle Gerätemaße und Tipps gegen Abschneiden.`,
    title: 'YouTube Banner Größen-Leitfaden: Maße & Sicherheitsbereich',
    subtitle:
      `Der maßgebliche technische Leitfaden zum ${CANVAS.width}×${CANVAS.height} px YouTube-Kanalbildstandard, Multi-Geräte-Ansichten und sicheren Zonen.`,
    quickAnswerTitle: 'Kurzübersicht: Offizielle YouTube-Abmessungen',
    fullCanvas: 'Vollständige Bildgröße',
    safeArea: 'Sicherheitsbereich (Mobil)',
    minUpload: 'Minimale Upload-Größe',
    maxFileSize: 'Maximale Dateigröße',
    aspectRatio: 'Seitenverhältnis',
  },
  guideSafeArea: {
    metaTitle: 'YouTube Banner Sicherheitsbereich: Maße & Zuschnitt',
    metaDesc:
      'Verstehe den YouTube Sicherheitsbereich. Lerne, wie Texte und Logos zentriert platziert werden, damit sie auf Smartphones nicht abgeschnitten werden.',
    title: 'YouTube Banner Sicherheitsbereich: Mathematik & Zuschnitte',
    subtitle:
      'Warum YouTube-Banner auf Smartphones oft abgeschnitten werden und wie du Text und Grafiken sicher in der zentrierten Zone anordnest.',
    mathTitle: 'Die Geometrie des Sicherheitsbereichs Erklärt',
    mobileVsDesktop: 'Mobil- vs. Desktop-Anzeigebereich',
  },
  guide1024: {
    metaTitle: 'YouTube Banner 1024x576: Fehlergrund & Richtige Maße',
    metaDesc:
      `Warum YouTube 1024×576 px Banner ablehnt. Die 16:9-Mathematik, die 2048×1152 Mindestanforderung und wie du kostenlos auf ${CANVAS.width}×${CANVAS.height} skalierst.`,
    title: 'Warum YouTube 1024×576 Banner Ablehnt & Die Lösung',
    subtitle:
      `Verstehe die Mindestanforderung von 2048×1152 px und lerne, wie du dein 16:9-Bild sauber auf ${CANVAS.width}×${CANVAS.height} px hochskalierst.`,
  },
  templatesHub: {
    metaTitle: 'YouTube Banner Vorlagen: Kostenlose Kanalbilder',
    metaDesc:
      'Entdecke kostenlose YouTube Banner Vorlagen mit geprüftem Sicherheitsbereich für Mobilgeräte. Vorlagen für Gaming, Tech, Podcast, Musik und Vlogs.',
    title: 'Kuratierte YouTube Banner Vorlagen',
    subtitle:
      'Entdecke studio-geprüfte Layouts, die auf jedem Gerät im sicheren Bereich bleiben. Kostenlos anpassen und exportieren.',
    filterAll: 'Alle Kategorien',
    browseNiche: 'Nach Thema Stöbern',
    customizeBtn: 'Vorlage Anpassen →',
  },
  tools: {
    resizer: {
      metaTitle: 'YouTube Banner anpassen: 2560x1440 online skalieren',
      metaDesc:
        `Bilder auf die exakte YouTube-Größe von ${CANVAS.width}×${CANVAS.height} px zuschneiden und anpassen. Kostenlos, 100% im Browser mit Sicherheitsbereich-Vorschau.`,
      title: 'YouTube Banner Größenanpassung (Anpassen)',
      intro:
        `Ziehe ein Bild hinein, um in Sekunden ein sicheres Kanalbild mit ${CANVAS.width}×${CANVAS.height} px für YouTube zuzuschneiden und zu exportieren.`,
    },
    checker: {
      metaTitle: 'YouTube Banner Prüfer: Sicherheitsbereich Testen',
      metaDesc:
        'Teste dein YouTube-Kanalbild auf Smartphone, Tablet und TV vor dem Upload. Sofortige Sicherheitsbereich-Prüfung ohne Datenübertragung.',
      title: 'YouTube Sicherheitsbereich-Prüfer (Checken)',
      intro:
        'Lade dein bestehendes Banner hoch, um zu überprüfen, ob Kanalname, Links und Hauptgrafiken auf Mobilgeräten vollständig sichtbar bleiben.',
      handoffTitle: 'Mit Einem Klick Anpassen',
      handoffDesc:
        'Möchtest du Bildausschnitte korrigieren oder Texte verschieben? Öffne dein Banner direkt im Resizer-Editor unter Beibehaltung deines Bildes.',
      handoffBtn: 'Im Resizer Korrigieren →',
    },
    maker: {
      metaTitle: 'YouTube Banner Erstellen: Gratis Kanalbild Maker',
      metaDesc:
        'Erstelle professionelle YouTube-Banner online mit Sicherheitsbereich-Hilfslinien. Kostenlose Vorlagen, moderne Typografie und ohne Wasserzeichen.',
      title: 'YouTube Banner Generator (Erstellen)',
      intro:
        'Gestalte ausdrucksstarke YouTube-Kanalbilder mit individueller Typografie, Farbverläufen und Vorlagen mit integrierter Sicherheitsbereich-Prüfung.',
    },
    cdnAdvisoryTitle: 'Hinweis zum YouTube CDN-Cache',
    cdnAdvisoryText:
      'Wenn du ein neues Banner in YouTube Studio hochlädst, kann es bis zu 24 Stunden dauern, bis die Änderung auf allen Servern und in der mobilen App sichtbar wird. Wird weiterhin das alte Bild angezeigt, leere den Browser-Cache oder prüfe in einem privaten Fenster.',
    reencodeTitle: 'Die Automatische Neukomprimierung von YouTube',
    reencodeText:
      'YouTube komprimiert jedes hochgeladene Banner automatisch auf etwa 134 KB für PCs und noch stärkere Limits auf Handys. Diese Neukomprimierung lässt sich nicht umgehen, weshalb ein Test mit unserem Simulationsmodus hilft, den Textkontrast vorab zu prüfen.',
  },
  niches: {
    gaming: {
      name: 'Gaming',
      title: 'Gaming YouTube Banner Vorlagen: Kostenlos & Mobil-Sicher',
      desc: `Gaming-Kanalbilder für YouTube. Geprüft für den mobilen Sicherheitsbereich, sofortige Browser-Bearbeitung und Export in ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Gaming YouTube Banner Vorlagen',
      heroDesc:
        'Entwickelt für E-Sport-Teams, Streamer und Gameplay-Kanäle. Platziere Gamertag, Stream-Zeiten und Sponsorenlogos zentriert im sicheren Bereich, damit auf Handys nichts verloren geht.',
      designNotes:
        'Gaming-Banner verlieren oft wichtige Details, wenn Logos in die Ecken geschoben werden. Unsere Designs setzen auf Cyber-Grids und taktische HUD-Rahmen im Zentrum.',
      cropAdvice:
        'Halte Spielernamen, Sendezeiten und Social-Links strikt im mittleren Sicherheitsbereich. Hintergrundgrafiken und Effekte können sich frei auf Desktop- und TV-Breite ausdehnen.',
    },
    tech: {
      name: 'Technologie',
      title: 'Tech YouTube Banner Vorlagen: Minimalistisch & Sicher',
      desc: 'Moderne Vorlagen für Software- und Hardware-Kanäle. Saubere Terminal-Ästhetik, exakter Sicherheitsbereich und ohne Wasserzeichen.',
      heroTitle: 'Technologie & IT YouTube Banner Vorlagen',
      heroDesc:
        'Für Programmierer, Hardware-Reviewer und IT-Dozenten. Monospace-Akzente und klare visuelle Hierarchien stellen deine Themenschwerpunkte auf jedem Bildschirm präzise dar.',
      designNotes:
        'Tech-Kanäle erfordern strukturierte Genauigkeit. Unsere Vorlagen nutzen dunkle Terminal-Farben und ausgewogene Rasterlinien für maximale Schärfe auf Bildschirmen.',
      cropAdvice:
        'Code-Zeilen und GitHub-Namen gehören in den zentralen Sicherheitsbereich. Vermeide Icons an den Außenrändern, wo Mobilnutzer sonst nur leeren Hintergrund sehen.',
    },
    podcast: {
      name: 'Podcasts',
      title: 'Podcast YouTube Banner Vorlagen: Klare Studio-Designs',
      desc: `Studio-Layouts für Videopodcasts und Talkformate. Kontrastreiche Typografie und kostenloser Download in ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Podcast YouTube Banner Vorlagen',
      heroDesc:
        'Konzipiert für Videopodcasts, Interviews und Talkrunden. Klare Typografie rückt Sendungstitel, Moderatoren und Veröffentlichungstage zentriert ins Blickfeld.',
      designNotes:
        'Podcasts brauchen sofortige Wiedererkennung. Diese Vorlagen bieten ausgewogene Schwerpunkte für Show-Namen und Audio-Netzwerk-Badges ohne Abschneide-Risiko.',
      cropAdvice:
        'Sendungsname und Episodentage müssen in der sicheren Zone liegen. Fotos von Studiomikrofonen oder Akustikelementen können das gesamte 16:9-Format füllen.',
    },
    vlog: {
      name: 'Vlog & Lifestyle',
      title: 'Vlog YouTube Banner Vorlagen: Ästhetisch & Filmisch',
      desc: `Stilvolle Banner für Reise- und Alltags-Vlogger. Perfekter Bildausschnitt für Smartphone und PC mit schnellem ${CANVAS.width}×${CANVAS.height} Export.`,
      heroTitle: 'Vlog & Lifestyle YouTube Banner Vorlagen',
      heroDesc:
        'Für Reise-Vlogger, Alltags-Kreative und Dokumentarfilmer. Filmische Bildgestaltung und elegante Schriftzüge hinterlassen einen bleibenden ersten Eindruck bei neuen Abonnenten.',
      designNotes:
        'Persönliche Kanäle überzeugen durch Atmosphäre. Unsere Vorlagen nutzen warme Farbpaletten und großzügige Abstände, um Fotografien optimal hervorzuheben.',
      cropAdvice:
        'Porträts und handgeschriebene Kanaltitel gehören in die Sicherheitszone. Landschaftsaufnahmen können die umliegenden Ränder für TV-Zuschauer füllen.',
    },
    music: {
      name: 'Musik & Produzenten',
      title: 'Musik YouTube Banner Vorlagen: Lo-Fi, Synth & Beats',
      desc: 'Maßgeschneiderte Kanalbilder für Musiker und Beatmaker. Harmonische Kompositionen für alle Bildschirme ohne störende Registrierung.',
      heroTitle: 'Musik & Produzenten YouTube Banner Vorlagen',
      heroDesc:
        'Für Beatmaker, Lo-Fi-Streams und Singer-Songwriter. Stimmungsvolle Farbpaletten und musikalische Typografie definieren deinen Sound mit sicheren Texten auf jedem Display.',
      designNotes:
        'Musik-Branding lebt von stimmungsvoller Zurückhaltung. Wellenformen, analoge Kassettenoptik und kontrastreiche Schriften trotzen dem Zuschnitt der YouTube-App.',
      cropAdvice:
        'Label-Logos, Streaming-Badges (Spotify/Apple Music) und Veröffentlichungstermine im zentralen Bereich fixieren. Synthesizer-Muster können zum Rand hin auslaufen.',
    },
    fitness: {
      name: 'Fitness & Sport',
      title: 'Fitness YouTube Banner Vorlagen: Dynamisch & Kraftvoll',
      desc: 'Ausdrucksstarke Kanalbilder für Trainer und Athleten. Kräftige Typografie im YouTube-Sicherheitsbereich für Mobilgeräte und Fernseher.',
      heroTitle: 'Fitness & Training YouTube Banner Vorlagen',
      heroDesc:
        'Für Personal Trainer, Bodybuilder und Workout-Kanäle. Energetische Schriften motivieren Abonnenten und halten Trainingspläne auf Smartphone-Displays sichtbar.',
      designNotes:
        'Sport-Kanalbilder verlangen Dynamik. Diese Vorlagen bieten markante diagonale Schnitte und kontraststarke Ziffern, die sicher innerhalb der Begrenzungen liegen.',
      cropAdvice:
        'Trainingszeiten und App-Badges müssen im Zentrum bleiben. Dynamische Fotos aus dem Gym können sich auf die Desktop-Fläche erstrecken.',
    },
    education: {
      name: 'Bildung',
      title: 'Bildungs-Kanalbilder für YouTube: Seriös & Modern',
      desc: 'Layouts für Lernkanäle, Wissenschaftler und Tutorials. Aufgeräumte Strukturen für beste Lesbarkeit auf jedem Endgerät.',
      heroTitle: 'Bildung & Wissenskanäle YouTube Banner Vorlagen',
      heroDesc:
        'Für Wissenschafts-Kommunikatoren, Historiker und Tutorial-Macher. Strukturierte Gitter vermitteln Kompetenz und Übersicht auf allen Displays.',
      designNotes:
        'Lernkanäle leben von Vertrauen. Unsere Vorlagen verbinden klassische Überschriften mit modernen Untertiteln für beste Lesbarkeit auch auf kleinen Bildschirmen.',
      cropAdvice:
        'Kursthemen und akademische Bezeichnungen gehören ins Zentrum. Diagramme, Skizzen und Papiertexturen können die TV-Leinwand schmücken.',
    },
    lifestyle: {
      name: 'Lifestyle & Wohnen',
      title: 'Minimalistische YouTube Banner Vorlagen: Ästhetisch',
      desc: 'Dezente Vorlagen für Wellness-, Einrichtungs- und Achtsamkeits-Kanäle. Elegante Typografie im mobilen Schutzbereich.',
      heroTitle: 'Lifestyle & Wellness YouTube Banner Vorlagen',
      heroDesc:
        'Für Wellness-Coaches, Interior-Design-Kanäle und achtsames Leben. Sanfte Paletten und luftige Typografie schaffen einen einladenden Kanalkopf.',
      designNotes:
        'Minimalismus lebt von Freiräumen. Diese Vorlagen nutzen neutrale Farbtöne und zurückhaltende Schriften, um deinen Kanalinhalt für sich sprechen zu lassen.',
      cropAdvice:
        'Motto und Video-Rhythmus sollten mittig in der sicheren Zone liegen. Botanische Schatten und textile Texturen dürfen die Desktop-Ränder füllen.',
    },
    food: {
      name: 'Kochen & Kulinarik',
      title: 'Koch-Kanalbilder für YouTube: Rezepte & Gastronomie',
      desc: 'Appetitliche Banner für Food-Blogger, Bäcker und Restaurants. Warme Farbtöne und geprüfter Sicherheitsbereich für PC und Handy.',
      heroTitle: 'Kochen & Rezepte YouTube Banner Vorlagen',
      heroDesc:
        'Für Hobbyköche, Backkanäle und Restaurantkritiker. Warme Paletten spiegeln deine kulinarische Leidenschaft wider und halten Rezepttermine im Fokus.',
      designNotes:
        'Food-Kanäle brauchen Herzlichkeit. Die Vorlagen verbinden handwerklichen Bistro-Charme mit klaren Blickpunkten für deine Upload-Tage.',
      cropAdvice:
        'Rezept-Termine und Spezialitäten in der sicheren Zone platzieren. Hochauflösende Zutatenfotos und Küchenmotive können das 16:9-Format füllen.',
    },
    business: {
      name: 'Business & Finanzen',
      title: 'Business YouTube Banner Vorlagen: Professionell & Seriös',
      desc: 'Hochwertige Kanalbilder für Immobilienmakler, Agenturen, Berater und Finanzen. Zentrierte Layouts ohne Bezahlschranke.',
      heroTitle: 'Business & Agentur YouTube Banner Vorlagen',
      heroDesc:
        'Für Unternehmer, Marketingagenturen und Finanzexperten. Seriöse Vorlagen schaffen Vertrauen und stellen Nutzenversprechen geräteübergreifend dar.',
      designNotes:
        'Unternehmenskanäle erfordern professionelle Autorität. Diese Designs bieten durchdachte Typografie-Hierarchien für Kundenvorteile und Kontaktdaten.',
      cropAdvice:
        'Nutzenversprechen und Web-Links gehören zentriert in den Sicherheitsbereich. Architektonische Muster und dezente Farbverläufe können bis an die 4K-TV-Ränder reichen.',
    },
  },
  notFound: {
    title: '404: Seite Nicht Gefunden',
    subtitle: 'Die von dir angeforderte Seite konnte leider nicht gefunden werden.',
    homeBtn: 'Zurück zur Startseite von YouTube Banner Maker →',
  },
};
