import { CANVAS } from '../../lib/spec';
import type { Translations } from './en';

export const ptBr: Translations = {
  common: {
    brandName: 'YouTube Banner Maker',
    tagline: 'No navegador · zero uploads',
    skipToContent: 'Pular para o conteúdo principal',
    privacyBadge: 'Privacidade 100% no Navegador',
    noAccountBadge: 'Sem Cadastro ou Login',
    noWatermarkBadge: 'Sem Marca d\'Água',
    launchResizer: 'Abrir Redimensionador',
    openMobileMenu: 'Abrir menu de navegação',
    selectLanguage: 'Selecionar idioma',
    languages: 'Idiomas',
    allRightsReserved: 'Todos os direitos reservados.',
  },
  nav: {
    fixBanner: 'Ajustar Banner',
    checker: 'Verificador',
    maker: 'Criador',
    templates: 'Templates',
    sizeGuide: 'Guia de Tamanho',
    safeAreaGuide: 'Guia de Área Segura',
  },
  footer: {
    brandDesc:
      'Ferramenta para arte de canal do YouTube no navegador. Redimensionamento, verificação de cortes e diagnóstico de área segura via HTML5 Canvas.',
    colTools: 'Ferramentas',
    resizer: 'Redimensionador de Banner (Ajustar)',
    checker: 'Verificador de Área Segura (Checar)',
    generator: 'Gerador de Banner (Criar)',
    templateGallery: 'Galeria de Templates de Banner',
    colGuides: 'Guias',
    guideSize: 'Tamanho e Dimensões de Banner',
    guideSafeArea: 'Área Segura e Regras de Corte',
    colTrust: 'Transparência e Legal',
    about: 'Sobre e Metodologia',
    contact: 'Contato e Suporte',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Serviço',
    colSpecs: 'Especificações Oficiais',
    specRecommended: 'Recomendado',
    specSafeArea: 'Área Segura (Celular)',
    specMaxFileSize: 'Tamanho Máximo',
    specAspectRatio: 'Proporção',
    zeroTransmitted:
      'Zero bytes de imagem enviados a servidores. Sem marca d\'água. Sem cadastro obrigatório.',
    trademark:
      'YouTube é marca registrada da Google LLC. Esta ferramenta é um projeto independente.',
  },
  home: {
    metaTitle: 'Tamanho de Banner do YouTube: Criador e Templates Grátis',
    metaDesc:
      `Tamanho oficial de banner do YouTube é ${CANVAS.width}×${CANVAS.height} px. Redimensione e crie capas seguras para celular, PC e TV sem cortes.`,
    badgePrivacy: 'Privacidade 100% no Navegador',
    badgeNoAccount: 'Sem Cadastro ou Login',
    badgeNoWatermark: 'Sem Marca d\'Água',
    heroTitlePre: 'Criador de Banner do YouTube Que Cabe em',
    heroTitleAccent: 'Qualquer Tela',
    heroSubtitle:
      'Redimensione, corte e verifique sua arte para celular, tablet, computador e TV. Processamento 100% local no navegador com Canvas sem demora de upload.',
    ctaFix: 'Abrir Redimensionador',
    ctaTemplates: 'Ver Templates Grátis',
    ctaCheck: 'Checar Área Segura',
    telemetrySafe: 'Corte Seguro Automático',
    telemetryUniversal: 'Compatível com TV e Celular',
    telemetryExport: `Exportação Limpa em ${CANVAS.width}×${CANVAS.height}`,
    simHeading: 'Simulador de Corte Multi-Dispositivo',
    simSub: 'Alterne entre visualizações para ver como o YouTube exibe seu banner em cada aparelho.',
    showcaseTitle: 'Arte de Canal de Alto Nível para Todas as Telas',
    showcaseDesc:
      'O YouTube corta os banners de forma diferente em celulares, tablets, computadores e Smart TVs. Nossa ferramenta garante que sua marca e textos fiquem sempre na área segura.',
    specsTitle: 'Dimensões Oficiais do Banner do Canal no YouTube',
    specsDesc: 'Especificações técnicas verificadas com base na documentação do YouTube Studio.',
    faqTitle: 'Perguntas Frequentes',
    faqDesc: 'Tudo o que você precisa saber sobre dimensões, corte e exportação de banners do YouTube.',
  },
  about: {
    metaTitle: 'Sobre o YouTube Banner Maker: Privacidade e Tecnologia',
    metaDesc:
      'Conheça o YouTube Banner Maker: ferramenta 100% no navegador, processamento local com Canvas, sem uploads para servidores e sem cadastro.',
    title: 'Sobre o YouTube Banner Maker',
    subtitle: 'Uma ferramenta profissional e focada em privacidade, feita sob medida para criadores do YouTube.',
    missionTitle: 'Nossa Missão e Filosofia',
    missionP1:
      'A maioria das ferramentas online força cadastro, exibe anúncios invasivos, cobra assinaturas ou envia suas imagens privadas para servidores externos. Criamos o YouTube Banner Maker para provar que utilitários criativos profissionais podem ser instantâneos, gratuitos, transparentes e totalmente privados.',
    missionP2:
      'Cada operação — decodificação, redimensionamento, renderização de canvas, máscara de área segura e exportação em PNG/JPEG — é executada localmente no seu navegador. Zero bytes de imagem trafegam pela rede.',
    valuesTitle: 'Pilares de Engenharia',
    val1Title: 'Processamento 100% no Navegador',
    val1Desc: 'Toda a renderização usa APIs do HTML5 Canvas. Suas imagens nunca tocam nossos servidores.',
    val2Title: 'Honestidade Técnica',
    val2Desc: 'Sem promessas falsas. Explicamos os limites reais de pixel e a matemática exata de corte do YouTube.',
    val3Title: 'Zero Fricção',
    val3Desc: 'Sem contas, sem formulários de e-mail, sem marcas d\'água e sem cobranças. Utilidade criativa em menos de 10 segundos.',
  },
  contact: {
    metaTitle: 'Contato e Suporte: YouTube Banner Maker',
    metaDesc:
      'Fale com a equipe do YouTube Banner Maker para suporte técnico, sugestões de recursos ou relatos de bugs. Resposta rápida e direta.',
    title: 'Contato e Suporte',
    subtitle: 'Dúvidas, sugestões ou problemas técnicos? Fale conosco diretamente.',
    getInTouchTitle: 'Entre em Contato',
    emailLabel: 'Suporte Direto por E-mail',
    emailDesc: 'Para dúvidas técnicas, relatos de erro e sugestões:',
    githubLabel: 'Comunidade e Código Aberto',
    githubDesc: 'Abra issues ou confira o código no GitHub:',
    responseTime: 'Tempo médio de resposta: de 24 a 48 horas.',
  },
  privacy: {
    metaTitle: 'Política de Privacidade: Processamento 100% Local',
    metaDesc:
      'Sua arte nunca sai do seu dispositivo. Processamento 100% local via HTML5 Canvas, zero uploads para servidores e sem cookies de rastreamento.',
    title: 'Política de Privacidade',
    subtitle: 'Sua arte nunca sai do seu dispositivo. Este é nosso compromisso técnico.',
    zeroUploadTitle: 'Garantia de Zero Uploads para Servidor',
    zeroUploadP1:
      'O YouTubeBannerMaker.com foi desenvolvido como uma aplicação estritamente client-side. Ao arrastar uma imagem para o redimensionador, verificador ou gerador, o arquivo é processado apenas na memória do seu aparelho.',
    zeroUploadP2:
      'Nossos servidores não recebem, não armazenam, não inspecionam e não registram nenhuma imagem, texto, logo ou arquivo com o qual você trabalha.',
    dataCollectionTitle: 'Informações Que Não Coletamos',
    noImages: 'Nenhuma imagem ou arte enviada',
    noPii: 'Nenhum dado pessoal, nome ou e-mail',
    noCookies: 'Nenhum cookie de rastreamento publicitário',
    localStorageTitle: 'Armazenamento Local no Navegador',
    localStorageDesc:
      'Usamos apenas o localStorage padrão para salvar suas preferências de tema (modo claro/escuro e paleta de cores). Esses dados nunca saem do seu navegador.',
  },
  terms: {
    metaTitle: 'Termos de Uso: Ferramenta de Arte para YouTube',
    metaDesc:
      'Termos de uso do YouTube Banner Maker. Gratuito para uso pessoal e comercial. Aviso sobre marcas registradas do YouTube e Google LLC.',
    title: 'Termos de Serviço',
    subtitle: 'Termos transparentes para uma ferramenta criativa gratuita e focada em privacidade.',
    usageTitle: 'Uso Permitido e Licença',
    usageP1:
      'O YouTube Banner Maker é disponibilizado gratuitamente para produção de capas de canal tanto pessoais quanto comerciais. Você detém 100% dos direitos autorais sobre todas as imagens e banners que criar ou exportar.',
    disclaimerTitle: 'Aviso Sobre Marcas Registradas',
    disclaimerP1:
      'YouTube é marca registrada da Google LLC. O YouTube Banner Maker é uma ferramenta independente e não possui afiliação, patrocínio ou endosso por parte do YouTube ou da Google LLC.',
    liabilityTitle: 'Limitação de Responsabilidade',
    liabilityP1:
      'Esta ferramenta é oferecida "como está", sem garantias adicionais. Nosso compromisso é fornecer a representação matemática mais fiel das especificações do YouTube Studio.',
  },
  guideSize: {
    metaTitle: 'Tamanho do Banner do YouTube: 2560x1440 e Área Segura',
    metaDesc:
      `Guia definitivo do tamanho de banner do YouTube: ${CANVAS.width}×${CANVAS.height} px, área segura para celular, limite de 6 MB e dicas contra cortes.`,
    title: 'Guia de Tamanho de Banner do YouTube: Dimensões e Área Segura',
    subtitle:
      `O guia técnico completo sobre o padrão ${CANVAS.width}×${CANVAS.height} px do YouTube, telas de múltiplos dispositivos e geometria da área segura.`,
    quickAnswerTitle: 'Referência Rápida: Dimensões Oficiais do YouTube',
    fullCanvas: 'Tamanho Total da Imagem',
    safeArea: 'Área Segura para Celular',
    minUpload: 'Tamanho Mínimo de Envio',
    maxFileSize: 'Tamanho Máximo do Arquivo',
    aspectRatio: 'Proporção da Imagem',
  },
  guideSafeArea: {
    metaTitle: 'Área Segura do Banner YouTube: Guia e Dimensões',
    metaDesc:
      'Entenda a área segura do banner do YouTube. Veja como posicionar textos e logotipos para nunca serem cortados em celulares ou desktops.',
    title: 'Área Segura do Banner do YouTube: Regras de Corte e Matemática',
    subtitle:
      'Por que os banners do YouTube são cortados em smartphones e como posicionar textos e marcas dentro da área segura central.',
    mathTitle: 'A Geometria da Área Segura Explicada',
    mobileVsDesktop: 'Área Visível em Celular vs. Computador',
  },
  guide1024: {
    metaTitle: 'Banner YouTube 1024x576: Por Que Falha e Como Ajustar',
    metaDesc:
      `Por que o YouTube rejeita banners 1024×576 px. Entenda a proporção 16:9, mínimo de 2048×1152 e como redimensionar para ${CANVAS.width}×${CANVAS.height} grátis.`,
    title: 'Por Que o YouTube Rejeita Banners 1024×576 e Como Corrigir',
    subtitle:
      `Entenda a exigência mínima de 2048×1152 px do YouTube e aprenda a ajustar sua arte 16:9 para ${CANVAS.width}×${CANVAS.height} px sem distorção.`,
  },
  templatesHub: {
    metaTitle: 'Templates de Banner para YouTube: Modelos Grátis',
    metaDesc:
      'Modelos gratuitos de banner para YouTube ajustados para a área segura mobile. Templates para games, tecnologia, podcasts, música e vlogs.',
    title: 'Modelos de Banner para YouTube',
    subtitle:
      'Explore designs testados em estúdio e dimensionados para a área segura de qualquer aparelho. Personalize e exporte de graça.',
    filterAll: 'Todos os Nichos',
    browseNiche: 'Explorar por Categoria',
    customizeBtn: 'Personalizar Modelo →',
  },
  tools: {
    resizer: {
      metaTitle: 'Redimensionar Banner YouTube: Ajuste para 2560x1440 Grátis',
      metaDesc:
        `Redimensione e ajuste imagens para o tamanho exato de ${CANVAS.width}×${CANVAS.height} px do YouTube. Ferramenta online grátis com prévia de área segura.`,
      title: 'Redimensionador de Banner do YouTube (Ajustar)',
      intro:
        `Arraste qualquer imagem para redimensionar, reposicionar e exportar um banner em ${CANVAS.width}×${CANVAS.height} px sem cortes no celular.`,
    },
    checker: {
      metaTitle: 'Verificador de Banner YouTube: Teste de Área Segura',
      metaDesc:
        'Verifique se seu banner do YouTube é exibido corretamente no celular, tablet e TV antes de enviar. Ferramenta de teste de área segura.',
      title: 'Verificador de Área Segura de Banner (Checar)',
      intro:
        'Envie seu banner atual para confirmar se o nome do canal, ícones sociais e elementos principais ficam visíveis na tela do celular.',
      handoffTitle: 'Ajuste em Um Clique',
      handoffDesc:
        'Precisa reposicionar elementos ou corrigir cortes da área segura? Abra seu banner diretamente no editor do redimensionador mantendo a imagem.',
      handoffBtn: 'Ajustar no Redimensionador →',
    },
    maker: {
      metaTitle: 'Criador de Banner para YouTube Grátis: Arte do Canal',
      metaDesc:
        'Crie banners profissionais para YouTube online. Modelos personalizáveis, guias de área segura e processamento direto no navegador sem marcas.',
      title: 'Criador de Banner do YouTube (Gerador)',
      intro:
        'Crie banners atraentes para YouTube com tipografia personalizada, gradientes e modelos prontos com área segura validada.',
    },
    cdnAdvisoryTitle: 'Aviso Sobre o Cache de CDN do YouTube',
    cdnAdvisoryText:
      'Após enviar o novo banner no YouTube Studio, as alterações podem levar até 24 horas para sincronizar em todos os servidores, caches e aplicativos móveis. Se o banner antigo continuar aparecendo, limpe o cache do navegador ou teste em aba anônima.',
    reencodeTitle: 'Como Funciona a Recompressão Automática do YouTube',
    reencodeText:
      'O YouTube recomprime automaticamente qualquer imagem de banner para aproximadamente 134 KB no computador e limites menores no celular. Essa recompressão é padrão da plataforma, por isso testar com nosso modo de simulação ajuda a verificar o contraste dos textos antes de fazer o envio.',
  },
  niches: {
    gaming: {
      name: 'Games',
      title: 'Templates de Banner para YouTube Gamer: Grátis e Seguros',
      desc: `Templates de banner gamer para YouTube. Testados para a área segura de celular, edição instantânea no navegador e exportação em ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Templates de Banner para YouTube Gamer',
      heroDesc:
        'Criados para equipes de esports, streamers de variedades e criadores de gameplay. Mantenha sua gamertag, horários de live e logos de patrocinadores protegidos na área segura móvel sem cortes em smartphones.',
      designNotes:
        'Canais gamers frequentemente perdem elementos importantes quando logos ou tags são colocados perto das bordas. Nossos modelos usam alinhamento centralizado com estilo cyber e HUD tático.',
      cropAdvice:
        'Posicione nomes de jogadores, horários de live e redes sociais estritamente na área central. Deixe ilustrações de fundo e mapas preencherem as laterais para criar imersão em telas maiores.',
    },
    tech: {
      name: 'Tecnologia',
      title: 'Templates de Banner para YouTube Tech: Minimalistas',
      desc: 'Banners elegantes para canais de tecnologia e programação. Visual limpo, geometria segura e exportação sem marcas d\'água.',
      heroTitle: 'Templates de Banner Tech para YouTube',
      heroDesc:
        'Desenvolvidos para programadores, analistas de hardware e educadores de tecnologia. Tipografia monoespaçada, hierarquia clara e visual profissional que valoriza seu canal em qualquer tela.',
      designNotes:
        'Canais de tecnologia exigem precisão. Nossos templates utilizam estética de terminal escuro e linhas de grade equilibradas para manter a nitidez tanto em monitores quanto em telas menores.',
      cropAdvice:
        'Comandos de código e nomes de repositórios devem ficar dentro da área segura central. Evite ícones de linguagens nas pontas para que visitantes no celular não vejam apenas fundos vazios.',
    },
    podcast: {
      name: 'Podcasts',
      title: 'Templates de Banner para Podcasts no YouTube: Grátis',
      desc: `Templates de banner para mesacasts e programas de entrevista no YouTube. Tipografia de alto contraste e exportação grátis em ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Templates de Banner para Podcast no YouTube',
      heroDesc:
        'Perfeito para videocasts, entrevistas e programas de debate. Tipografia marcante destaca o nome do show, apresentadores e periodicidade de episódios sem riscos de cortes em celulares.',
      designNotes:
        'Podcasts em vídeo necessitam de identificação visual imediata. Nossos layouts garantem equilíbrio visual para o nome do programa e marcas de áudio parceiras.',
      cropAdvice:
        'Mantenha o título do podcast, dias de lançamento e nomes dos apresentadores centralizados na área segura. Fotos do estúdio ou padrões acústicos podem preencher todo o formato 16:9.',
    },
    vlog: {
      name: 'Vlog e Estilo de Vida',
      title: 'Templates de Banner para Vlogs no YouTube: Elegantes',
      desc: `Banners modernos para canais de vlog e viagens. Tipografia refinada, enquadramento perfeito para celular e computador e download em ${CANVAS.width}×${CANVAS.height}.`,
      heroTitle: 'Templates de Banner para Vlog e Dia a Dia',
      heroDesc:
        'Desenvolvidos para criadores de conteúdo de viagem, rotina e lifestyle. Composições cinematográficas que causam ótima impressão em novos inscritos com foco na área central segura.',
      designNotes:
        'Canais pessoais se conectam pela atmosfera visual. Os modelos de vlog utilizam tons elegantes e espaçamentos equilibrados para valorizar fotografias do criador.',
      cropAdvice:
        'Retratos do criador e assinaturas devem ficar centrados na área segura. Fotos de paisagens e viagens podem preencher o espaço ao redor para quem assiste na TV ou PC.',
    },
    music: {
      name: 'Música e Produtores',
      title: 'Templates de Banner para Música no YouTube: Lo-Fi e Synth',
      desc: 'Banners personalizados para produtores musicais, canais de beats e artistas independentes. Composições testadas para todas as telas sem cadastro.',
      heroTitle: 'Templates de Banner para Canais de Música',
      heroDesc:
        'Criados para beatmakers, transmissões de lo-fi, synthwave e músicos solo. Paletas envolventes que transmitem a identidade do seu som com nomes e lançamentos seguros no celular.',
      designNotes:
        'A identidade visual musical requer equilíbrio atmosférico. Nossos layouts priorizam ondas sonoras, visual analógico e tipografia legível mesmo com cortes do aplicativo móvel.',
      cropAdvice:
        'Selo da gravadora, ícones do Spotify/Apple Music e datas de lançamento devem ficar centralizados. Texturas de vinil e iluminação de palco podem se estender pelas bordas.',
    },
    fitness: {
      name: 'Fitness e Treino',
      title: 'Templates de Banner Fitness para YouTube: Alto Impacto',
      desc: 'Modelos vibrantes para canais de treino e vida saudável. Tipografia forte posicionada na área segura do YouTube para celular e TV.',
      heroTitle: 'Templates de Banner Fitness e Esportes',
      heroDesc:
        'Criados para personal trainers, atletas e canais de exercícios. Tipografia enérgica que motiva os inscritos e mantém seus horários de treino legíveis em telas de celular.',
      designNotes:
        'Artes para canais esportivos transmitem dinamismo e determinação. Estes templates contam com cortes diagonais e números destacados posicionados longe dos limites de corte.',
      cropAdvice:
        'Dias de treino, chamadas para aplicativos e desafios devem ficar na área central. Imagens de academia e texturas dinâmicas podem ocupar os lados.',
    },
    education: {
      name: 'Educação',
      title: 'Templates de Banner Educativos para YouTube: Modernos',
      desc: 'Artes de canal com credibilidade para professores, cientistas e criadores de tutoriais. Estrutura limpa que mantém textos legíveis em qualquer aparelho.',
      heroTitle: 'Templates de Banner para Canais de Educação',
      heroDesc:
        'Feitos para divulgadores científicos, canais de história e professores. Grades equilibradas que comunicam seriedade e clareza para estudantes em celulares e monitores.',
      designNotes:
        'Canais educativos dependem de clareza e autoridade. Nossos modelos combinam títulos serifados elegantes com subtítulos modernos fáceis de ler.',
      cropAdvice:
        'Disciplinas, credenciais acadêmicas e títulos de cursos devem ficar estritamente no centro. Diagramas e texturas suaves podem preencher o restante da tela 16:9.',
    },
    lifestyle: {
      name: 'Estilo de Vida',
      title: 'Templates de Banner Minimalistas para YouTube: Zen e Casa',
      desc: 'Capas discretas e minimalistas para canais de bem-estar, decoração e rotina. Tipografia elegante centralizada na área segura.',
      heroTitle: 'Templates de Banner para Lifestyle e Bem-Estar',
      heroDesc:
        'Perfeito para criadores de meditação, decoração de interiores e rotina consciente. Paletas suaves e tipografia espaçosa criam um cabeçalho acolhedor para o canal.',
      designNotes:
        'O minimalismo se destaca pelo uso do espaço em branco. Esses modelos usam tons neutros para valorizar a proposta do canal sem poluição visual.',
      cropAdvice:
        'O lema do canal e os dias de vídeo devem ficar confortavelmente dentro da área segura. Sombras botânicas e texturas suaves podem se estender para computadores.',
    },
    food: {
      name: 'Culinária e Gastronomia',
      title: 'Templates de Banner de Culinária para YouTube: Receitas',
      desc: 'Modelos acolhedores para canais de receitas, confeitaria e gastronomia. Tipografia apetitosa testada para celular e computador.',
      heroTitle: 'Templates de Banner para Canais de Culinária',
      heroDesc:
        'Criados para chefs caseiros, confeiteiros e canais de dicas gastronômicas. Tons quentes que destacam sua paixão pela comida mantendo os dias de receita no centro.',
      designNotes:
        'Canais de gastronomia pedem proximidade e calor. Os modelos trazem estética de bistrô e padaria artesanal com pontos de foco bem definidos.',
      cropAdvice:
        'Mantenha dias de receitas novas e especialidades dentro da área segura. Fotos de ingredientes em alta resolução e bancadas de mármore podem preencher todo o formato.',
    },
    business: {
      name: 'Negócios e Finanças',
      title: 'Templates de Banner de Negócios para YouTube: Finanças',
      desc: 'Banners executivos para corretores, agências, empreendedores e consultores. Layouts centralizados com foco em autoridade e sem custos.',
      heroTitle: 'Templates de Banner de Negócios e Empreendedorismo',
      heroDesc:
        'Desenhados para empreendedores, profissionais do mercado imobiliário e consultores. Visual sofisticado que passa segurança aos clientes e potenciais inscritos.',
      designNotes:
        'Canais corporativos exigem profissionalismo. Estes modelos oferecem hierarquia tipográfica precisa para propostas de valor e contatos profissionais.',
      cropAdvice:
        'Propostas de valor, sites e chamadas para ação devem ficar na área segura central. Texturas corporativas e gradientes sutis podem preencher telas de TV e PC.',
    },
  },
  notFound: {
    title: '404: Página Não Encontrada',
    subtitle: 'A página que você tentou acessar não foi localizada.',
    homeBtn: 'Voltar para a Página Inicial do YouTube Banner Maker →',
  },
};
