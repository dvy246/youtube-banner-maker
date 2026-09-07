import { CANVAS } from '../../lib/spec';
import type { Translations } from './en';

export const it: Translations = {
  common: {
    brandName: 'YouTube Banner Maker',
    tagline: 'Nel tuo browser · zero upload',
    skipToContent: 'Salta al contenuto principale',
    privacyBadge: 'Privacy 100% Lato Client',
    noAccountBadge: 'Nessuna Registrazione Richiesta',
    noWatermarkBadge: 'Senza Filigrana',
    launchResizer: 'Avvia il Ridimensionatore',
    openMobileMenu: 'Apri menu di navigazione',
    selectLanguage: 'Seleziona lingua',
    languages: 'Lingue',
    allRightsReserved: 'Tutti i diritti riservati.',
  },
  nav: {
    fixBanner: 'Adatta Banner',
    checker: 'Verifica',
    maker: 'Crea',
    templates: 'Modelli',
    sizeGuide: 'Guida Misure',
    safeAreaGuide: 'Guida Area Sicura',
  },
  footer: {
    brandDesc:
      'Strumento per la grafica dei canali YouTube direttamente nel browser. Ridimensionamento, controllo ritagli e diagnosi area sicura con HTML5 Canvas.',
    colTools: 'Strumenti',
    resizer: 'Ridimensionatore Banner (Adatta)',
    checker: 'Controllo Area di Sicurezza (Verifica)',
    generator: 'Generatore di Banner (Crea)',
    templateGallery: 'Galleria Modelli Selezionati',
    colGuides: 'Guide',
    guideSize: 'Misure e Specifiche Banner YouTube',
    guideSafeArea: 'Area di Sicurezza e Regole Ritaglio',
    colTrust: 'Trasparenza e Note Legali',
    about: 'Chi Siamo & Metodologia',
    contact: 'Contatti & Supporto',
    privacy: 'Informativa sulla Privacy',
    terms: 'Termini di Servizio',
    colSpecs: 'Specifiche Ufficiali',
    specRecommended: 'Consigliato',
    specSafeArea: 'Area Sicura (Mobile)',
    specMaxFileSize: 'Dimensione Massima',
    specAspectRatio: 'Rapporto di Aspetto',
    zeroTransmitted:
      'Nessun byte di immagine inviato in rete. Senza filigrana. Nessuna registrazione necessaria.',
    trademark:
      'YouTube è un marchio registrato di Google LLC. Questo strumento è stato sviluppato in modo indipendente.',
  },
  home: {
    metaTitle: 'Dimensioni Banner YouTube: Creatore e Template Gratis',
    metaDesc:
      `Le dimensioni ufficiali del banner YouTube sono ${CANVAS.width}×${CANVAS.height} px. Ridimensiona e crea copertine sicure per smartphone, PC e TV senza tagli.`,
    badgePrivacy: 'Privacy 100% Lato Client',
    badgeNoAccount: 'Nessuna Registrazione Richiesta',
    badgeNoWatermark: 'Senza Filigrana',
    heroTitlePre: 'Crea Banner per YouTube Perfetti su',
    heroTitleAccent: 'Qualsiasi Schermo',
    heroSubtitle:
      'Ridimensiona, ritaglia e controlla le tue copertine per smartphone, tablet, computer e TV. Elaborazione privata e istantanea nel browser con HTML5 Canvas senza attese di upload.',
    ctaFix: 'Apri il Ridimensionatore',
    ctaTemplates: 'Sfoglia i Modelli Gratis',
    ctaCheck: 'Verifica Area Sicura',
    telemetrySafe: 'Ritaglio Sicuro Automatico',
    telemetryUniversal: 'Ottimizzato per TV e Mobile',
    telemetryExport: `Esportazione Pulita in ${CANVAS.width}×${CANVAS.height}`,
    simHeading: 'Simulatore di Ritaglio Multi-Dispositivo',
    simSub: 'Alterna tra i diversi dispositivi per vedere in tempo reale come YouTube mostra il tuo banner su ogni schermo.',
    showcaseTitle: 'Grafica per Canali di Alto Livello per Ogni Schermo',
    showcaseDesc:
      'YouTube ritaglia i banner in modo diverso a seconda che vengano visualizzati su smartphone, tablet, laptop o Smart TV. Il nostro strumento fa sì che logo e testi restino sempre protetti al centro.',
    specsTitle: 'Dimensioni Ufficiali del Banner per il Canale YouTube',
    specsDesc: 'Specifiche tecniche verificate in base alla documentazione ufficiale di YouTube Studio.',
    faqTitle: 'Domande Frequenti (FAQ)',
    faqDesc: 'Tutto ciò che c\'è da sapere su dimensioni, ritagli ed esportazione delle copertine di YouTube.',
  },
  about: {
    metaTitle: 'Informazioni su YouTube Banner Maker: Privacy e Metodo',
    metaDesc:
      'Scopri YouTube Banner Maker: elaborazione al 100% nel browser tramite HTML5 Canvas, zero upload su server esterni e nessun account richiesto.',
    title: 'Informazioni su YouTube Banner Maker',
    subtitle: 'Uno strumento professionale orientato alla privacy pensato specificamente per i creator di YouTube.',
    missionTitle: 'La Nostra Visione & I Nostri Valori',
    missionP1:
      'La maggior parte degli strumenti online obbliga alla registrazione, inserisce pubblicità invadenti o trasferisce le tue immagini private su server esterni. Abbiamo creato YouTube Banner Maker per dimostrare che gli strumenti grafici possono essere istantanei, gratuiti, onesti e interamente confidenziali.',
    missionP2:
      'Ogni singola operazione — decodifica, scalatura, disegno su Canvas, maschera dell\'area protetta ed esportazione in PNG/JPEG — avviene localmente nel tuo browser. Nessun dato attraversa la rete.',
    valuesTitle: 'Pilastri Ingegneristici',
    val1Title: 'Elaborazione 100% Lato Client',
    val1Desc: 'Tutto il rendering sfrutta le API native di HTML5 Canvas. Le tue immagini non raggiungono mai i nostri server.',
    val2Title: 'Onestà Tecnica',
    val2Desc: 'Nessuna promessa irrealistica. Spieghiamo i vincoli effettivi di rasterizzazione e la geometria reale di YouTube.',
    val3Title: 'Zero Ostacoli',
    val3Desc: 'Niente account, niente moduli email, niente filigrane e nessun costo. Piena operatività in meno di 10 secondi.',
  },
  contact: {
    metaTitle: 'Contatti e Supporto: YouTube Banner Maker',
    metaDesc:
      'Contatta il team di YouTube Banner Maker per assistenza tecnica, suggerimenti o segnalazioni di bug. Risposta tempestiva e diretta.',
    title: 'Contatti & Supporto',
    subtitle: 'Hai domande, hai riscontrato un errore o vuoi proporre un nuovo template? Scrivici direttamente.',
    getInTouchTitle: 'Come Contattarci',
    emailLabel: 'Supporto Diretto via Email',
    emailDesc: 'Per assistenza tecnica, segnalazioni e feedback:',
    githubLabel: 'Community Open Source',
    githubDesc: 'Segnala problemi o esplora il codice sorgente su GitHub:',
    responseTime: 'Tempo medio di risposta: entro 24-48 ore lavorative.',
  },
  privacy: {
    metaTitle: 'Informativa sulla Privacy: 100% Locale Senza Upload',
    metaDesc:
      'Le tue immagini restano sul tuo dispositivo. Elaborazione locale al 100% nel browser, nessun invio verso server e nessun cookie di tracciamento.',
    title: 'Informativa sulla Privacy',
    subtitle: 'I tuoi file grafici non lasciano mai il tuo dispositivo. La nostra garanzia tecnica.',
    zeroUploadTitle: 'Garanzia di Zero Upload sui Server',
    zeroUploadP1:
      'YouTubeBannerMaker.com è stato progettato sin dal principio come un\'applicazione eseguita unicamente nel tuo browser. Quando trascini un\'immagine, essa viene elaborata solo nella memoria del tuo computer o smartphone.',
    zeroUploadP2:
      'I nostri server non ricevono, non archiviano, non ispezionano e non registrano alcuna immagine, testo, logo o risorsa grafica con cui interagisci.',
    dataCollectionTitle: 'Dati Che Non Raccogliamo',
    noImages: 'Nessuna immagine o file grafico caricato',
    noPii: 'Nessun dato personale, nome o indirizzo email',
    noCookies: 'Nessun cookie pubblicitario o di terze parti',
    localStorageTitle: 'Archiviazione Locale del Browser',
    localStorageDesc:
      'Utilizziamo esclusivamente il localStorage del tuo browser per conservare le preferenze di visualizzazione (modalità chiara/scura e tema cromatico). Questi dati non vengono mai trasmessi altrove.',
  },
  terms: {
    metaTitle: 'Termini di Servizio: Strumento Grafica YouTube',
    metaDesc:
      'Termini di utilizzo di YouTube Banner Maker. Gratuito per uso personale e commerciale. Note relative ai marchi di YouTube e Google LLC.',
    title: 'Termini di Servizio',
    subtitle: 'Regole trasparenti per uno strumento di creazione gratuito e attento alla privacy.',
    usageTitle: 'Licenza e Utilizzo Consentito',
    usageP1:
      'YouTube Banner Maker è fornito a titolo completamente gratuito per la realizzazione di grafiche sia personali che commerciali per YouTube. Mantieni la proprietà del 100% di tutti i banner esportati con questo strumento.',
    disclaimerTitle: 'Dichiarazione sui Marchi',
    disclaimerP1:
      'YouTube è un marchio registrato di Google LLC. YouTube Banner Maker è un software indipendente e non è affiliato, approvato o sponsorizzato da YouTube o Google LLC.',
    liabilityTitle: 'Limitazione di Responsabilità',
    liabilityP1:
      'Questo servizio viene fornito "così com\'è", senza garanzie aggiuntive. Ci impegniamo a fornire la riproduzione geometrica più precisa delle specifiche ufficiali di YouTube Studio.',
  },
  guideSize: {
    metaTitle: 'Dimensioni Banner YouTube: 2560x1440 & Area di Sicurezza',
    metaDesc:
      `Guida tecnica alle dimensioni del banner YouTube: ${CANVAS.width}×${CANVAS.height} px, area sicura per mobile, limite di 6 MB e consigli pratici contro i tagli.`,
    title: 'Guida Dimensioni Banner YouTube: Misure & Area Sicura',
    subtitle:
      `La guida tecnica completa allo standard di ${CANVAS.width}×${CANVAS.height} px per la grafica del canale YouTube, schermi multipli e regole di ritaglio.`,
    quickAnswerTitle: 'Riferimento Rapido: Dimensioni Ufficiali di YouTube',
    fullCanvas: 'Dimensioni Totali Canvas',
    safeArea: 'Area di Sicurezza (Mobile)',
    minUpload: 'Dimensione Minima di Upload',
    maxFileSize: 'Dimensione Massima del File',
    aspectRatio: 'Rapporto di Aspetto',
  },
  guideSafeArea: {
    metaTitle: 'Area di Sicurezza Banner YouTube: Guida ai Ritagli',
    metaDesc:
      'Comprendi l\'area di sicurezza del banner YouTube. Scopri come centrare testi e loghi per non farli mai tagliare su schermi di smartphone e PC.',
    title: 'Area di Sicurezza Banner YouTube: Geometria e Ritagli',
    subtitle:
      'Perché i banner di YouTube vengono tagliati sui telefoni e come posizionare testi e marchi al sicuro all\'interno dell\'area centrale.',
    mathTitle: 'La Geometria dell\'Area di Sicurezza',
    mobileVsDesktop: 'Area Visibile su Mobile vs Computer',
  },
  guide1024: {
    metaTitle: 'Banner YouTube 1024x576: Perché Fallisce e Soluzione',
    metaDesc:
      `Perché YouTube rifiuta i banner 1024×576 px. Il rapporto 16:9, il minimo richiesto di 2048×1152 e come ridimensionare a ${CANVAS.width}×${CANVAS.height} gratis.`,
    title: 'Perché YouTube Rifiuta Banner 1024×576 e Come Risolvere',
    subtitle:
      `Comprendi il requisito minimo di 2048×1152 px di YouTube e impara ad adattare la tua immagine 16:9 a ${CANVAS.width}×${CANVAS.height} px in modo nitido.`,
  },
  templatesHub: {
    metaTitle: 'Modelli Banner YouTube: Template Gratuiti per Canali',
    metaDesc:
      'Raccolta di template gratuiti per banner YouTube conformi all\'area di sicurezza mobile. Modelli per gaming, tecnologia, podcast, musica e vlog.',
    title: 'Modelli di Banner per YouTube',
    subtitle:
      'Esplora composizioni testate in studio e ottimizzate per l\'area sicura di ogni schermo. Personalizza e scarica gratuitamente.',
    filterAll: 'Tutte le Categorie',
    browseNiche: 'Esplora per Categoria',
    customizeBtn: 'Personalizza questo Modello →',
  },
  tools: {
    resizer: {
      metaTitle: 'Ridimensionare Banner YouTube: 2560x1440 Gratis Online',
      metaDesc:
        `Adatta e ritaglia immagini al formato esatto di ${CANVAS.width}×${CANVAS.height} px per YouTube. Strumento online gratuito con anteprima dell'area di sicurezza mobile.`,
      title: 'Ridimensionatore Banner YouTube (Adatta)',
      intro:
        `Trascina un\'immagine qualsiasi per ridimensionarla, riposizionarla ed esportare un banner per YouTube di ${CANVAS.width}×${CANVAS.height} px in pochi secondi.`,
    },
    checker: {
      metaTitle: 'Verifica Banner YouTube: Test Area di Sicurezza',
      metaDesc:
        'Controlla la resa del tuo banner YouTube su smartphone, tablet e TV prima di caricarlo. Diagnosi istantanea dell\'area di sicurezza senza invio di dati.',
      title: 'Controllo Area di Sicurezza Banner YouTube (Verifica)',
      intro:
        'Carica la tua copertina attuale per accertarti che il nome del tuo canale e i link social rimangano visibili sui telefoni senza venire tagliati.',
      handoffTitle: 'Modifica con Un Clic',
      handoffDesc:
        'Hai bisogno di spostare grafiche o correggere testi tagliati? Apri il tuo banner direttamente nell\'editor del ridimensionatore.',
      handoffBtn: 'Modifica nel Ridimensionatore →',
    },
    maker: {
      metaTitle: 'Crea Banner YouTube Gratis: Grafica Canale Online',
      metaDesc:
        'Crea online banner professionali per YouTube con guide per l\'area sicura. Modelli gratuiti personalizzabili, grafica moderna e senza filigrana.',
      title: 'Generatore di Banner per YouTube (Crea)',
      intro:
        'Realizza copertine di grande impatto per YouTube con tipografia personalizzata, gradienti e modelli verificati per l\'area di sicurezza.',
    },
    cdnAdvisoryTitle: 'Avviso sulla Cache della CDN di YouTube',
    cdnAdvisoryText:
      'Quando carichi una nuova grafica canale su YouTube Studio, la propagazione sui server e sull\'app mobile può richiedere fino a 24 ore. Se continui a visualizzare il vecchio banner, cancella la cronologia del browser o verifica in modalità anonima.',
    reencodeTitle: 'Come Funziona la Ricompressione di YouTube',
    reencodeText:
      'YouTube ricomprime in automatico ogni copertina caricata a circa 134 KB su computer e dimensioni inferiori su smartphone. Questo passaggio è inevitabile: verificare la copertina con il nostro simulatore ti aiuta a valutare la leggibilità prima del caricamento.',
  },
  niches: {
    gaming: {
      name: 'Gaming & Streamer',
      title: 'Template Banner YouTube Gaming: Gratis & Sicuri su Mobile',
      desc: `Copertine per canali gaming ed esports. Testate per l'area di sicurezza su smartphone, modifica rapida ed esportazione in ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Template Banner YouTube per il Gaming',
      heroDesc:
        'Ideati per team di esports, streamer e creator di gameplay. Mantieni gamer tag, orari di live e loghi sponsor centrati nell\'area protetta mobile senza tagli fastidiosi.',
      designNotes:
        'I banner per videogiochi presentano spesso testi tagliati se i loghi sono posizionati vicino ai margini. I nostri template sfruttano griglie cyber e cornici HUD al centro.',
      cropAdvice:
        'Posiziona nickname, orari delle dirette e sponsor rigidamente nella zona sicura centrale. Illustrazioni ed elementi ambientali possono allargarsi verso i bordi TV.',
    },
    tech: {
      name: 'Tecnologia & IT',
      title: 'Template Banner Tech per YouTube: Puliti & Minimalisti',
      desc: 'Copertine raffinate per programmatori, recensori hardware e canali tech. Grafica da terminale, geometria accurata e senza filigrana.',
      heroTitle: 'Template Banner YouTube per Canali Tech',
      heroDesc:
        'Pensati per sviluppatori software, recensori tecnologici e docenti informatici. Prompt da terminale e tipografia monospace per comunicare con autorevolezza.',
      designNotes:
        'I canali tecnologici richiedono precisione e ordine. I nostri layout utilizzano temi scuri da riga di comando per conservare una nitidezza perfetta su qualsiasi display.',
      cropAdvice:
        'Comandi e nomi di repository devono risiedere nell\'area centrale. Evita di collocare icone alle estremità per non lasciare gli utenti mobile con uno sfondo vuoto.',
    },
    podcast: {
      name: 'Podcast & Talk',
      title: 'Template Banner Podcast per YouTube: Layout da Studio',
      desc: `Grafica per video podcast e interviste su YouTube. Tipografia ad alto contrasto e download gratuito in ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Template Banner per Podcast su YouTube',
      heroDesc:
        'Studiati per video podcast, interviste e dibattiti. Una tipografia decisa evidenzia il titolo del programma e i co-conduttori all\'interno dell\'area di sicurezza.',
      designNotes:
        'I podcast video necessitano di un forte riconoscimento immediato. Queste composizioni garantiscono un bilanciamento ideale per nomi di show e loghi di rete.',
      cropAdvice:
        'Titolo del podcast e giorni di pubblicazione devono stare al centro. Fotografie di microfoni o pannelli acustici possono estendersi sull\'intero formato 16:9.',
    },
    vlog: {
      name: 'Vlog & Stile di Vita',
      title: 'Template Banner Vlog per YouTube: Atmosfere da Cinema',
      desc: `Copertine eleganti per vlogger di viaggio e di vita quotidiana. Inquadratura adatta a smartphone e PC con export in ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Template Banner per Canali Vlog e Lifestyle',
      heroDesc:
        'Pensati per travel vlogger, creator quotidiani e documentaristi. Inquadrature cinematografiche e caratteri curati per fare un\'ottima prima impressione ai nuovi iscritti.',
      designNotes:
        'I canali personali comunicano attraverso il tono emotivo. I nostri modelli usano tonalità calde e spaziature ampie per valorizzare le fotografie del creator.',
      cropAdvice:
        'Ritratti del creator e titoli firma devono collocarsi nell\'area protetta centrale. Paesaggi e scatti di viaggio possono riempire i lati visibili su TV e computer.',
    },
    music: {
      name: 'Musica & Beatmaker',
      title: 'Template Banner Musica per YouTube: Lo-Fi, Synth & Beat',
      desc: 'Copertine personalizzate per produttori musicali, artisti e live Lo-Fi. Grafica armoniosa testata per tutti gli schermi senza registrazione.',
      heroTitle: 'Template Banner Musicali per YouTube',
      heroDesc:
        'Dedicati a beatmaker, sessioni di lo-fi e musicisti solisti. Palette suggestive che esaltano la tua identità sonora con testi protetti sul cellulare.',
      designNotes:
        'Il branding musicale vive di atmosfere. Forme d\'onda, texture analogiche e tipografia ad alta leggibilità resistono perfettamente ai ritagli dell\'app YouTube.',
      cropAdvice:
        'Marchio discografico, badge Spotify/Apple Music e date dei concerti vanno posizionati al centro. Motivi grafici possono espandersi liberamente all\'esterno.',
    },
    fitness: {
      name: 'Fitness & Allenamento',
      title: 'Template Banner Fitness per YouTube: Energia & Grinta',
      desc: 'Copertine energiche per personal trainer e atleti. Tipografia decisa inserita nell\'area sicura di YouTube per smartphone e schermi TV.',
      heroTitle: 'Template Banner Fitness per YouTube',
      heroDesc:
        'Sviluppati per coach, atleti e appassionati di workout. Scelte tipografiche decise che motivano gli iscritti e lasciano sempre leggibili i piani di allenamento.',
      designNotes:
        'I canali di sport richiedono carica e vitalità. Questi modelli presentano tagli diagonali e numeri a forte contrasto posizionati lontano dai margini di ritaglio.',
      cropAdvice:
        'Schede di allenamento e app badge devono rimanere al centro. Foto dinamiche di attrezzi e texture motivazionali possono estendersi sui lati.',
    },
    education: {
      name: 'Educazione & Cultura',
      title: 'Template Banner Educativi per YouTube: Chiari & Moderni',
      desc: 'Grafica per docenti, divulgatori scientifici e tutorial. Layout ordinato studiato per mantenere tutti i testi leggibili su ogni dispositivo.',
      heroTitle: 'Template Banner per Canali di Istruzione',
      heroDesc:
        'Per divulgatori, docenti e canali storici. Griglie equilibrate che infondono autorevolezza e chiarezza agli studenti sia da smartphone che da PC.',
      designNotes:
        'I canali formativi si basano sull\'affidabilità. Le nostre grafiche accostano titoli eleganti a sottotitoli lineari per una lettura ottimale.',
      cropAdvice:
        'Materie di studio e titoli di lezioni devono essere rigorosamente centrati. Schemi e texture cartacee possono arricchire i margini per gli schermi TV.',
    },
    lifestyle: {
      name: 'Stile di Vita & Casa',
      title: 'Template Banner Minimalisti per YouTube: Sobri & Zen',
      desc: 'Copertine delicate per canali di benessere, arredamento e mindfulness. Tipografia curata e posizionata nell\'area sicura mobile.',
      heroTitle: 'Template Banner Lifestyle e Mindfulness',
      heroDesc:
        'Per coach olistici, appassionati di interior design e vita consapevole. Colori riposanti e spazi generosi creano un\'intestazione accogliente per il canale.',
      designNotes:
        'Il minimalismo valorizza lo spazio vuoto. Questi modelli adoperano tonalità neutre per far emergere lo stile autentico del tuo canale senza distrazioni.',
      cropAdvice:
        'Motto del canale e cadenza di pubblicazione devono alloggiare nell\'area sicura. Ombre botaniche e dettagli architettonici possono estendersi ai lati.',
    },
    food: {
      name: 'Cucina & Ricette',
      title: 'Template Banner Cucina per YouTube: Gusto & Sapori',
      desc: 'Copertine accattivanti per food blogger, cuochi e pasticceri. Tipografia calda ed elementi visivi verificati per cellulari e computer.',
      heroTitle: 'Template Banner per Canali di Cucina',
      heroDesc:
        'Pensati per appassionati di ricette, pasticceria e recensori gastronomici. Tonalità invitanti che trasmettono passione culinaria con orari di uscita al centro.',
      designNotes:
        'La cucina evoca calore e condivisione. I modelli richiamano l\'atmosfera di bistrot e forni artigianali con riferimenti visivi ben posizionati.',
      cropAdvice:
        'Posiziona i giorni delle nuove ricette all\'interno dell\'area di sicurezza. Scatti ravvicinati di ingredienti e piani in marmo possono coprire l\'intero 16:9.',
    },
    business: {
      name: 'Business & Finanza',
      title: 'Template Banner Business per YouTube: Canali Corporate',
      desc: 'Copertine di prestigio per consulenti, agenzie immobiliari e professionisti. Layout centrati e professionali senza barriere a pagamento.',
      heroTitle: 'Template Banner Business e Imprese',
      heroDesc:
        'Progettati per imprenditori, esperti di marketing e consulenti. Uno stile esecutivo che ispira fiducia e mette in luce le tue competenze.',
      designNotes:
        'I canali aziendali necessitano di solidità. Questi layout offrono gerarchie tipografiche limpide per recapiti professionali e proposte commerciali.',
      cropAdvice:
        'Punti di forza e siti web devono restare racchiusi nell\'area protetta. Pattern geometrici e sfumature eleganti possono allargarsi agli schermi TV 4K.',
    },
  },
  notFound: {
    title: '404: Pagina Non Trovata',
    subtitle: 'La pagina che stai cercando non è disponibile o è stata spostata.',
    homeBtn: 'Torna alla Home di YouTube Banner Maker →',
  },
};
