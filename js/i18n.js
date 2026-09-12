(function () {
  'use strict';

  const translations = {
    en: {
      home: 'Home',
      aboutNav: 'About Me',
      resumeNav: 'Resume',
      projectsNav: 'Projects',
      blogNav: 'Blog',
      contactNav: 'Contact',
      aboutTitle: 'About <span>Me</span>',
      aboutText: 'I work at the intersection of digital transformation, data engineering and applied AI, with a strong background in banking and finance. I focus on turning business requirements into pragmatic data products, automation and AI-enabled solutions. In 2026, I completed the MAS in Data Science at ZHAW School of Engineering, strengthening my expertise in data platforms, MLOps, machine learning and generative AI.',
      age: 'Age',
      residence: 'Residence',
      languages: 'Languages',
      languagesValue: 'German (Native), English (Fluent), French (Intermediate)',
      whatIDo: 'What <span>I Do</span>',
      transformationTitle: 'Digital Transformation & Data Engineering',
      transformationText: 'I design and build reliable data pipelines, models and automation solutions that connect business requirements with modern data platforms and scalable engineering practices.',
      aiTitle: 'Data Science, AI & MLOps',
      aiText: 'I develop pragmatic machine learning and AI solutions, with a focus on reproducibility, MLOps, generative AI, RAG and the operational integration of models into real-world processes.',
      leisureTitle: 'Leisure',
      leisureText: 'In my free time, I enjoy being outdoors, hiking in the mountains and swimming in the lake. I also like reading technical books on data engineering, AI, MLOps and technology.',
      resumeTitle: 'Resume',
      education: 'Education',
      experience: 'Experience',
      masDescription: 'Advanced studies in data engineering, data science, machine learning and MLOps.',
      unifinanzDescription: 'Working on digital transformation and data engineering initiatives, connecting business requirements with modern data, automation and AI solutions.',
      oekkDescription: 'Development of data pipelines, stable operation of the data warehouse and delivery of data products to business departments.',
      gkbDescription: 'Supporting the corporate clients team in the processing and administration of syndicated loans.',
      raiffeisenAdvisorDescription: 'Advising private clients on banking products, accounts, investments and loans.',
      apprenticeshipDescription: 'Banking apprenticeship with practical training in retail banking and client services.',
      skillsData: 'Data Engineering & Platforms',
      skillsAi: 'AI & MLOps',
      skillsEngineering: 'Engineering & DevOps',
      skillsBusiness: 'Business & Finance',
      blogIntro: 'Latest articles from my LinkedIn newsletter on data, AI and technology.',
      blogButton: 'View all editions on LinkedIn',
      projectsIntro: 'A selection of my latest public GitHub repositories across data engineering, machine learning and technology projects.',
      projectsButton: 'View all public GitHub repositories',
      projectsLoading: 'Loading GitHub repositories ...',
      contactTitle: 'Contact',
      availability: 'Freelance / Consulting Available',
      helpTitle: 'How Can I <span>Help You?</span>',
      emailLabel: 'Your email:',
      nameLabel: 'Your name:',
      subjectLabel: 'Subject:',
      messageLabel: 'Message:',
      send: 'Send'
    },
    de: {
      home: 'Start',
      aboutNav: 'Über mich',
      resumeNav: 'Lebenslauf',
      projectsNav: 'Projekte',
      blogNav: 'Blog',
      contactNav: 'Kontakt',
      aboutTitle: 'Über <span>mich</span>',
      aboutText: 'Ich arbeite an der Schnittstelle von Digital Transformation, Data Engineering und angewandter AI und bringe einen starken Hintergrund aus Banking und Finance mit. Mein Fokus liegt darauf, fachliche Anforderungen in pragmatische Datenprodukte, Automatisierungen und AI-gestützte Lösungen zu übersetzen. 2026 habe ich den MAS Data Science an der ZHAW School of Engineering abgeschlossen und meine Kenntnisse in Data Platforms, MLOps, Machine Learning und Generative AI vertieft.',
      age: 'Alter',
      residence: 'Wohnort',
      languages: 'Sprachen',
      languagesValue: 'Deutsch (Muttersprache), Englisch (fliessend), Französisch (Mittelstufe)',
      whatIDo: 'Was <span>ich mache</span>',
      transformationTitle: 'Digital Transformation & Data Engineering',
      transformationText: 'Ich konzipiere und entwickle zuverlässige Data Pipelines, Datenmodelle und Automatisierungslösungen, welche fachliche Anforderungen mit modernen Data Platforms und skalierbaren Engineering-Praktiken verbinden.',
      aiTitle: 'Data Science, AI & MLOps',
      aiText: 'Ich entwickle pragmatische Machine-Learning- und AI-Lösungen mit Fokus auf Reproduzierbarkeit, MLOps, Generative AI, RAG und die operative Integration von Modellen in reale Prozesse.',
      leisureTitle: 'Freizeit',
      leisureText: 'In meiner Freizeit bin ich gerne draussen, wandere in den Bergen und schwimme im See. Zudem lese ich gerne Fachbücher zu Data Engineering, AI, MLOps und Technologie.',
      resumeTitle: 'Lebenslauf',
      education: 'Ausbildung',
      experience: 'Berufserfahrung',
      masDescription: 'Weiterführendes Studium in Data Engineering, Data Science, Machine Learning und MLOps.',
      unifinanzDescription: 'Arbeit an Digital-Transformation- und Data-Engineering-Initiativen sowie Verbindung fachlicher Anforderungen mit modernen Daten-, Automatisierungs- und AI-Lösungen.',
      oekkDescription: 'Entwicklung von Data Pipelines, Sicherstellung des stabilen Betriebs des Data Warehouse und Bereitstellung von Datenprodukten für die Fachbereiche.',
      gkbDescription: 'Unterstützung des Firmenkundenteams bei der Abwicklung und Administration von Konsortialkrediten.',
      raiffeisenAdvisorDescription: 'Beratung von Privatkunden zu Bankprodukten, Konten, Anlagen und Finanzierungen.',
      apprenticeshipDescription: 'Banklehre mit praktischer Ausbildung im Retail Banking und in der Kundenberatung.',
      skillsData: 'Data Engineering & Platforms',
      skillsAi: 'AI & MLOps',
      skillsEngineering: 'Engineering & DevOps',
      skillsBusiness: 'Business & Finance',
      blogIntro: 'Aktuelle Beiträge aus meinem LinkedIn-Newsletter zu Data, AI und Technology.',
      blogButton: 'Alle Ausgaben auf LinkedIn ansehen',
      projectsIntro: 'Eine Auswahl meiner neuesten öffentlichen GitHub-Repositories aus Data Engineering, Machine Learning und Technologieprojekten.',
      projectsButton: 'Alle öffentlichen GitHub-Repositories ansehen',
      projectsLoading: 'GitHub-Repositories werden geladen ...',
      contactTitle: 'Kontakt',
      availability: 'Freelance / Consulting verfügbar',
      helpTitle: 'Wie kann ich <span>helfen?</span>',
      emailLabel: 'E-Mail:',
      nameLabel: 'Name:',
      subjectLabel: 'Betreff:',
      messageLabel: 'Nachricht:',
      send: 'Senden'
    }
  };

  const selectors = {
    home: '.main-menu a[href="#home"] .link-text',
    aboutNav: '.main-menu a[href="#about-me"] .link-text',
    resumeNav: '.main-menu a[href="#resume"] .link-text',
    projectsNav: '.main-menu a[href="#projects"] .link-text',
    blogNav: '.main-menu a[href="#blog"] .link-text',
    contactNav: '.main-menu a[href="#contact"] .link-text',
    aboutTitle: 'section[data-id="about-me"] .page-title h2',
    aboutText: '#about-summary',
    age: '#label-age',
    residence: '#label-residence',
    languages: '#label-languages',
    languagesValue: '#value-languages',
    whatIDo: '#what-i-do-title',
    transformationTitle: '#transformation-title',
    transformationText: '#transformation-text',
    aiTitle: '#ai-title',
    aiText: '#ai-text',
    leisureTitle: '#leisure-title',
    leisureText: '#leisure-text',
    resumeTitle: 'section[data-id="resume"] .page-title h2',
    education: '#education-title',
    experience: '#experience-title',
    masDescription: '#mas-description',
    unifinanzDescription: '#unifinanz-description',
    oekkDescription: '#oekk-description',
    gkbDescription: '#gkb-description',
    raiffeisenAdvisorDescription: '#raiffeisen-advisor-description',
    apprenticeshipDescription: '#apprenticeship-description',
    skillsData: '#skills-data-title',
    skillsAi: '#skills-ai-title',
    skillsEngineering: '#skills-engineering-title',
    skillsBusiness: '#skills-business-title',
    blogIntro: '#blog-intro',
    blogButton: '#blog-all-link',
    projectsIntro: '#projects-intro',
    projectsButton: '#projects-all-link',
    projectsLoading: '#github-projects-status',
    contactTitle: 'section[data-id="contact"] .page-title h2',
    availability: '#availability-text',
    helpTitle: '#contact-help-title',
    emailLabel: '#label-email',
    nameLabel: '#label-name',
    subjectLabel: '#label-subject',
    messageLabel: '#label-message',
    send: '#contact-submit'
  };

  const htmlKeys = new Set(['aboutTitle', 'whatIDo', 'helpTitle']);

  function applyLanguage(lang) {
    const activeLanguage = translations[lang] ? lang : 'en';
    const values = translations[activeLanguage];

    Object.keys(selectors).forEach(function (key) {
      const value = values[key];
      if (value == null) return;
      document.querySelectorAll(selectors[key]).forEach(function (element) {
        if (htmlKeys.has(key)) {
          element.innerHTML = value;
        } else {
          element.textContent = value;
        }
      });
    });

    document.documentElement.lang = activeLanguage;
    window.siteLanguage = activeLanguage;
    localStorage.setItem('siteLanguage', activeLanguage);

    document.querySelectorAll('.language-toggle button[data-lang]').forEach(function (button) {
      const isActive = button.dataset.lang === activeLanguage;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: activeLanguage } }));
  }

  function setup() {
    const stored = localStorage.getItem('siteLanguage');
    const browserLanguage = (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';
    const initialLanguage = stored || browserLanguage;

    document.querySelectorAll('.language-toggle button[data-lang]').forEach(function (button) {
      button.addEventListener('click', function () {
        applyLanguage(button.dataset.lang);
      });
    });

    applyLanguage(initialLanguage);
  }

  window.setSiteLanguage = applyLanguage;
  window.siteTranslations = translations;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
