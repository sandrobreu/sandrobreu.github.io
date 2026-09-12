(() => {
  'use strict';

  // Progressive enhancement: content must remain visible even if a later
  // JavaScript feature or remote request fails.
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

  const brandMark = document.querySelector('.brand-mark');
  if (brandMark) {
    brandMark.textContent = '';
    brandMark.style.padding = '0';
    brandMark.style.overflow = 'hidden';
    brandMark.style.background = 'none';
    brandMark.style.border = '1px solid rgba(255,255,255,.14)';

    const profileImage = document.createElement('img');
    profileImage.src = 'img/main_photo.webp';
    profileImage.alt = 'Sandro Breu';
    profileImage.width = 42;
    profileImage.height = 42;
    profileImage.style.width = '100%';
    profileImage.style.height = '100%';
    profileImage.style.objectFit = 'cover';
    profileImage.style.display = 'block';
    brandMark.appendChild(profileImage);
  }

  const translations = {
    en: {
      'nav.about': 'About', 'nav.experience': 'Experience', 'nav.skills': 'Skills', 'nav.projects': 'Projects', 'nav.blog': 'Blog', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Data · AI · Finance',
      'hero.intro': 'I connect business, data engineering and applied AI to build pragmatic solutions that work in real operating environments.',
      'hero.about': 'About me', 'hero.projects': 'View projects', 'hero.location': 'Mels, Switzerland · Schaan, Liechtenstein',
      'about.eyebrow': 'Profile', 'about.title': 'About me',
      'about.lead': 'I work at the intersection of digital transformation, data engineering and applied AI, with a strong background in banking and finance.',
      'about.body': 'My focus is on turning business requirements into reliable data products, automation and AI-enabled solutions. In 2026, I completed the MAS in Data Science at ZHAW School of Engineering.',
      'about.transformation': 'Connecting business needs with modern technology, automation and scalable delivery.',
      'about.engineering': 'Designing data models, pipelines and platforms with reliability and maintainability in mind.',
      'about.ai': 'Bringing machine learning and generative AI into operational processes with a pragmatic MLOps mindset.',
      'about.finance': 'Combining technology skills with hands-on experience from banking and financial services.',
      'experience.eyebrow': 'Background', 'experience.title': 'Experience & education', 'experience.work': 'Experience', 'experience.education': 'Education',
      'experience.unifinanz': 'Digital transformation and data engineering initiatives connecting business requirements with data, automation and AI solutions.',
      'experience.oekk': 'Data pipelines, data warehouse operations and delivery of data products for business teams.',
      'experience.gkbTitle': 'Assistant Corporate Clients, Syndicated Loans',
      'experience.raiffeisenTitle': 'Banking apprenticeship & private client advisory',
      'experience.mas': 'Advanced studies in data engineering, data science, machine learning and MLOps.', 'experience.bsc': 'Specialization in Banking.',
      'skills.eyebrow': 'Capabilities', 'skills.title': 'Skills',
      'projects.title': 'Projects', 'projects.intro': 'Selected recent public repositories across data engineering, machine learning and technology.', 'projects.loading': 'Loading repositories…', 'projects.all': 'View all repositories ↗',
      'blog.eyebrow': 'Writing', 'blog.title': 'Blog', 'blog.intro': 'Recent articles on data, AI and technology.', 'blog.loading': 'Loading articles…', 'blog.all': 'View all articles ↗',
      'contact.eyebrow': 'Get in touch', 'contact.title': 'Contact', 'contact.intro': 'For professional exchange, collaboration or consulting enquiries, feel free to get in touch.',
      'contact.email': 'Your email', 'contact.name': 'Your name', 'contact.subject': 'Subject', 'contact.message': 'Message', 'contact.send': 'Send',
      'footer.top': 'Back to top ↑'
    },
    de: {
      'nav.about': 'Über mich', 'nav.experience': 'Erfahrung', 'nav.skills': 'Skills', 'nav.projects': 'Projekte', 'nav.blog': 'Blog', 'nav.contact': 'Kontakt',
      'hero.eyebrow': 'Data · AI · Finance',
      'hero.intro': 'Ich verbinde Business, Data Engineering und angewandte AI, um pragmatische Lösungen zu entwickeln, die im operativen Alltag funktionieren.',
      'hero.about': 'Über mich', 'hero.projects': 'Projekte ansehen', 'hero.location': 'Mels, Schweiz · Schaan, Liechtenstein',
      'about.eyebrow': 'Profil', 'about.title': 'Über mich',
      'about.lead': 'Ich arbeite an der Schnittstelle von Digital Transformation, Data Engineering und angewandter AI und bringe einen starken Hintergrund aus Banking und Finance mit.',
      'about.body': 'Mein Fokus liegt darauf, fachliche Anforderungen in zuverlässige Datenprodukte, Automatisierungen und AI-gestützte Lösungen zu übersetzen. 2026 habe ich den MAS Data Science an der ZHAW School of Engineering abgeschlossen.',
      'about.transformation': 'Verbindung fachlicher Anforderungen mit moderner Technologie, Automatisierung und skalierbarer Umsetzung.',
      'about.engineering': 'Konzeption von Datenmodellen, Pipelines und Platforms mit Fokus auf Zuverlässigkeit und Wartbarkeit.',
      'about.ai': 'Integration von Machine Learning und Generative AI in operative Prozesse mit einem pragmatischen MLOps-Ansatz.',
      'about.finance': 'Verbindung technischer Kompetenzen mit praktischer Erfahrung aus Banking und Financial Services.',
      'experience.eyebrow': 'Hintergrund', 'experience.title': 'Erfahrung & Ausbildung', 'experience.work': 'Berufserfahrung', 'experience.education': 'Ausbildung',
      'experience.unifinanz': 'Digital-Transformation- und Data-Engineering-Initiativen, welche fachliche Anforderungen mit Daten-, Automatisierungs- und AI-Lösungen verbinden.',
      'experience.oekk': 'Data Pipelines, stabiler Betrieb des Data Warehouse und Bereitstellung von Datenprodukten für die Fachbereiche.',
      'experience.gkbTitle': 'Assistent Firmenkunden Konsortialkredite',
      'experience.raiffeisenTitle': 'Banklehre & Privatkundenberatung',
      'experience.mas': 'Weiterführendes Studium in Data Engineering, Data Science, Machine Learning und MLOps.', 'experience.bsc': 'Vertiefung Banking.',
      'skills.eyebrow': 'Kompetenzen', 'skills.title': 'Skills',
      'projects.title': 'Projekte', 'projects.intro': 'Ausgewählte aktuelle öffentliche Repositories aus Data Engineering, Machine Learning und Technologie.', 'projects.loading': 'Repositories werden geladen…', 'projects.all': 'Alle Repositories ansehen ↗',
      'blog.eyebrow': 'Beiträge', 'blog.title': 'Blog', 'blog.intro': 'Aktuelle Beiträge zu Data, AI und Technology.', 'blog.loading': 'Beiträge werden geladen…', 'blog.all': 'Alle Beiträge ansehen ↗',
      'contact.eyebrow': 'Kontakt', 'contact.title': 'Kontakt', 'contact.intro': 'Für fachlichen Austausch, Zusammenarbeit oder Consulting-Anfragen kannst du mich gerne kontaktieren.',
      'contact.email': 'E-Mail', 'contact.name': 'Name', 'contact.subject': 'Betreff', 'contact.message': 'Nachricht', 'contact.send': 'Senden',
      'footer.top': 'Nach oben ↑'
    }
  };

  const getLang = () => localStorage.getItem('modernSiteLanguage') || ((navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en');
  let currentLang = getLang();
  let projectGrid;
  let articleGrid;

  function applyLanguage(lang) {
    currentLang = translations[lang] ? lang : 'en';
    document.documentElement.lang = currentLang;
    localStorage.setItem('modernSiteLanguage', currentLang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = translations[currentLang][el.dataset.i18n];
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === currentLang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderProjects(window.__projects || []);
    renderArticles(window.__articles || []);
  }

  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.language)));
  applyLanguage(currentLang);

  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });

  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  menuButton?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const currentYear = document.querySelector('[data-current-year]');
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  projectGrid = document.querySelector('[data-project-grid]');
  articleGrid = document.querySelector('[data-article-grid]');

  function renderProjects(repos) {
    if (!projectGrid || !repos.length) return;
    projectGrid.innerHTML = repos.map(repo => `
      <a class="project-card reveal visible" href="${escapeAttr(repo.html_url)}" target="_blank" rel="noopener noreferrer">
        <div class="card-meta"><span>${escapeHtml(repo.language || 'Code')}</span><span>★ ${Number(repo.stargazers_count || 0)}</span></div>
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || (currentLang === 'de' ? 'Öffentliches GitHub-Repository.' : 'Public GitHub repository.'))}</p>
        <span class="card-link">GitHub ↗</span>
      </a>`).join('');
  }

  function resolveImageSource(image) {
    const source = String(image || 'img/linkedin_2.png').trim();
    if (/^https?:\/\//i.test(source) || source.startsWith('/')) return source;
    return `/${source}`;
  }

  function renderArticles(posts) {
    if (!articleGrid || !posts.length) return;
    articleGrid.innerHTML = posts.slice(0, 6).map(post => {
      const date = new Date(`${post.published}T12:00:00`).toLocaleDateString(currentLang === 'de' ? 'de-CH' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const imageSource = resolveImageSource(post.image);
      return `<a class="article-card reveal visible" href="${escapeAttr(post.url)}" target="_blank" rel="noopener noreferrer">
        <img src="${escapeAttr(imageSource)}" alt="${escapeAttr(post.title)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='/img/linkedin_2.png';">
        <div class="article-body"><div class="card-meta"><span>${date}</span><span>LinkedIn ↗</span></div><h3>${escapeHtml(post.title)}</h3><span class="card-link">${currentLang === 'de' ? 'Beitrag lesen ↗' : 'Read article ↗'}</span></div>
      </a>`;
    }).join('');
  }

  fetch('https://api.github.com/users/sandrobreu/repos?sort=updated&per_page=12')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(repos => {
      window.__projects = repos.filter(repo => !repo.fork).slice(0, 6);
      renderProjects(window.__projects);
    })
    .catch(() => {
      if (projectGrid) projectGrid.innerHTML = `<div class="loading-card">${currentLang === 'de' ? 'Repositories konnten nicht geladen werden.' : 'Repositories could not be loaded.'}</div>`;
    });

  fetch('/data/newsletter.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(posts => {
      window.__articles = posts.filter(p => p && p.title && p.url && p.published).sort((a,b) => new Date(b.published) - new Date(a.published));
      renderArticles(window.__articles);
    })
    .catch(() => {
      if (articleGrid) articleGrid.innerHTML = `<div class="loading-card">${currentLang === 'de' ? 'Beiträge konnten nicht geladen werden.' : 'Articles could not be loaded.'}</div>`;
    });

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }
  function escapeAttr(value = '') { return escapeHtml(value); }
})();