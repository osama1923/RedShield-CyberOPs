/* ================= CONFIG ================= */
const SITE_CONFIG = {
  company: "Red Shield CyberOps",
  email: "contact@redshieldcyberops.example",   // [ editable placeholder ]
  phone: "+1 (___) ___-____",                    // [ editable placeholder ]
  address: "[ Address to be provided ]",         // [ editable placeholder ]
  social: {
    linkedin: "",   // [ add real LinkedIn URL ]
    facebook: "",   // [ add real Facebook URL ]
    instagram: ""   // [ add real Instagram URL ]
  }
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= NAV ================= */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, {passive:true});

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ================= CUSTOM CURSOR ================= */
if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const label = document.getElementById('cursorLabel');
  window.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    label.style.left = e.clientX + 'px'; label.style.top = e.clientY + 'px';
  }, {passive:true});
  document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active');
      const txt = el.getAttribute('data-cursor') || 'ACCESS';
      label.textContent = txt;
      label.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active');
      label.classList.remove('active');
    });
  });
}

/* ================= BACKGROUND CANVAS: grid + particles + nodes ================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const PARTICLE_COUNT = reduceMotion ? 0 : 46;
const chars = '01';

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = document.documentElement.scrollHeight;
}
function initParticles(){
  particles = [];
  for(let i=0;i<PARTICLE_COUNT;i++){
    particles.push({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.15, vy:(Math.random()-0.5)*0.15,
      r: Math.random()*1.6+0.6,
      isNode: Math.random() < 0.28,
      glyph: chars[Math.floor(Math.random()*chars.length)],
      glyphFlip: Math.random()*400
    });
  }
}
resize();
initParticles();
window.addEventListener('resize', () => { resize(); initParticles(); });

function drawGrid(){
  const gap = 64;
  ctx.strokeStyle = 'rgba(229,9,20,0.05)';
  ctx.lineWidth = 1;
  const offsetY = (window.scrollY || 0) * 0.02;
  for(let x=0;x<W;x+=gap){
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }
  for(let y=(-offsetY%gap);y<H;y+=gap){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
}

function drawParticles(t){
  ctx.font = '10px monospace';
  particles.forEach((p,i) => {
    p.x += p.vx; p.y += p.vy;
    if(p.x<0) p.x=W; if(p.x>W) p.x=0;
    if(p.y<0) p.y=H; if(p.y>H) p.y=0;

    // connections
    for(let j=i+1;j<particles.length;j++){
      const q = particles[j];
      const dx = p.x-q.x, dy = p.y-q.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 130){
        ctx.strokeStyle = 'rgba(229,9,20,' + (0.09*(1-dist/130)) + ')';
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      }
    }

    if(p.isNode){
      ctx.fillStyle = 'rgba(255,30,45,0.55)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*1.4,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(156,163,175,0.18)';
      if(Math.floor((t+p.glyphFlip)/1400)%2===0){
        ctx.fillText(p.glyph, p.x, p.y);
      } else {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
    }
  });
}

function loop(t){
  ctx.clearRect(0,0,W,H);
  drawGrid();
  if(!reduceMotion) drawParticles(t || 0);
  requestAnimationFrame(loop);
}
if(!reduceMotion){ requestAnimationFrame(loop); } else { drawGrid(); }
window.addEventListener('scroll', () => { if(reduceMotion){ ctx.clearRect(0,0,W,H); drawGrid(); } }, {passive:true});

/* Scroll-reveal observer is initialized at the end of this file, after all
   dynamically-rendered content (cards, grids, modals) has been built — see
   bottom of file. Setting it up here would miss anything injected later. */

/* ================= COUNTERS ================= */
const counters = document.querySelectorAll('[data-count]');
const countIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'),10);
      if(reduceMotion){ el.textContent = target + '+'; countIo.unobserve(el); return; }
      let cur = 0;
      const step = Math.max(1, Math.round(target/60));
      const iv = setInterval(() => {
        cur += step;
        if(cur >= target){ cur = target; clearInterval(iv); el.textContent = target + '+'; }
        else { el.textContent = cur; }
      }, 20);
      countIo.unobserve(el);
    }
  });
}, {threshold:0.4});
counters.forEach(el => countIo.observe(el));

/* ================= SERVICES DATA (full catalog) ================= */
const services = [
  {slug:'web-application-security', n:'01', t:'Web Application Security', tagline:'Protect Your Web Applications', d:'Security testing for websites and web applications.', img:'images/svc-web-application-security.svg',
    items:['OWASP-based testing','Authentication testing','Authorization testing','Input validation','API security','Business logic testing'],
    intro:'We assess websites and web applications to identify security weaknesses that could expose sensitive information, compromise accounts, or affect business operations.',
    assess:['Authentication and session management','Authorization and access control','Input validation','Injection vulnerabilities','Cross-site scripting (XSS)','CSRF protection','File upload functionality','Business logic','Security headers','Configuration weaknesses','API integration','Sensitive data exposure'],
    steps:['Scope Definition — Define authorized domains, applications, accounts, and testing limitations.','Reconnaissance — Identify technologies, application components, endpoints, and attack surface.','Automated Assessment — Use appropriate security testing tools to identify potential vulnerabilities.','Manual Testing — Security professionals manually validate application behavior and potential weaknesses.','Vulnerability Validation — Confirm findings safely without causing unnecessary disruption.','Risk Analysis — Evaluate technical severity and potential business impact.','Reporting — Provide technical evidence, risk ratings, affected components, and remediation guidance.','Retesting — Verify that remediation has effectively addressed identified issues.'],
    deliverables:['Executive summary','Technical security report','Vulnerability details','Risk/severity classification','Evidence','Remediation recommendations','Retest report']},
  {slug:'mobile-application-security', n:'02', t:'Mobile Application Security', tagline:'Secure Android & iOS Applications', d:'Security assessment for Android and iOS applications.', img:'images/svc-mobile-application-security.svg',
    items:['API security','Authentication & authorization','Data storage','Cryptography','Network security','App architecture review'],
    intro:'We assess mobile applications and their supporting APIs to identify weaknesses involving application logic, authentication, data protection, communications, and backend services.',
    assess:['Android security','iOS security','API communication','Authentication','Authorization','Local data storage','Cryptographic implementation','Certificate validation','Network communication','Application configuration','Reverse-engineering resistance','Sensitive information exposure'],
    steps:['Scope — Define authorized apps, accounts, and environments.','Application Analysis — Review app structure, permissions, and components.','Static Analysis — Examine the application without executing it.','Dynamic Analysis — Assess the application while it runs.','API Testing — Test the backend services the app communicates with.','Manual Validation — Confirm findings through hands-on testing.','Risk Analysis — Evaluate severity and business impact.','Reporting — Document findings clearly for technical and business audiences.','Retesting — Verify fixes after remediation.'],
    deliverables:['Mobile application security report','Vulnerability findings','Evidence','Risk analysis','Remediation recommendations','Retesting results']},
  {slug:'penetration-testing', n:'03', t:'Penetration Testing', tagline:'Think Like an Attacker. Defend Like an Expert.', d:'Ethical security testing to identify exploitable weaknesses.', img:'images/svc-penetration-testing.svg',
    items:['External penetration testing','Internal penetration testing','Web application testing','API testing','Network security testing'],
    intro:'Authorized penetration testing simulates realistic attack scenarios to identify security weaknesses before malicious actors can exploit them.',
    assess:['External penetration testing','Internal penetration testing','Web application penetration testing','API penetration testing','Network penetration testing','Wireless security assessment','Cloud penetration testing','Mobile application testing'],
    steps:['Pre-Engagement — Define target, scope, authorization, rules of engagement, testing window, emergency contacts, and out-of-scope systems.','Reconnaissance — Identify the authorized attack surface.','Enumeration — Analyze exposed services, applications, technologies, and configurations.','Vulnerability Discovery — Identify potential security weaknesses.','Controlled Validation — Safely validate whether vulnerabilities are exploitable.','Risk Assessment — Determine technical and business impact.','Reporting — Document findings and recommended remediation.','Retesting — Verify fixes after remediation.'],
    deliverables:['Executive summary','Technical security report','Vulnerability details','Risk/severity classification','Evidence and findings','Remediation recommendations','Retesting report']},
  {slug:'vulnerability-assessment', n:'04', t:'Vulnerability Assessment', tagline:'Discover. Prioritize. Remediate.', d:'Identify vulnerabilities across your digital infrastructure.', img:'images/svc-vulnerability-assessment.svg',
    items:['Vulnerability discovery','Risk classification','CVE analysis','Security prioritization','Remediation guidance'],
    intro:'Our vulnerability assessment service identifies and prioritizes weaknesses across systems, applications, networks, and infrastructure.',
    assess:['Operating systems','Servers','Network devices','Applications','Databases','Cloud infrastructure','Web services','Security configurations','Known vulnerabilities'],
    steps:['Asset Discovery — Map the systems and services in scope.','Vulnerability Scanning — Identify known weaknesses across the environment.','Configuration Analysis — Review settings for insecure defaults or drift.','Finding Validation — Confirm which results are real and exploitable.','Risk Prioritization — Rank findings by severity and business impact.','Reporting — Document findings with clear remediation guidance.','Remediation — Support fixes with actionable recommendations.','Retesting — Verify vulnerabilities have been resolved.'],
    deliverables:['Asset overview','Vulnerability inventory','Severity classification','Risk prioritization','Evidence','Remediation guidance','Executive summary']},
  {slug:'security-audit', n:'05', t:'Security Audit', tagline:'Measure Your Security Posture', d:'Evaluate security controls, configurations, and policies.', img:'images/svc-security-audit.svg',
    items:['Infrastructure audit','Application security audit','Access-control review','Configuration review','Compliance readiness'],
    intro:'We review security controls, configurations, policies, processes, and technical safeguards to identify gaps and improvement opportunities.',
    assess:['Access control','Identity management','Security policies','Infrastructure','Network configuration','Application security','Backup controls','Logging and monitoring','Endpoint security','Security awareness','Incident response readiness'],
    steps:['Audit Scope — Define the systems, policies, and controls under review.','Documentation Review — Examine existing policies and procedures.','Interviews — Speak with relevant stakeholders and teams.','Technical Assessment — Evaluate systems and configurations directly.','Control Evaluation — Compare controls against expected practice.','Gap Analysis — Identify where controls fall short.','Risk Assessment — Rank gaps by potential impact.','Final Report — Document findings and a path to improvement.'],
    deliverables:['Security audit report','Control assessment','Gap analysis','Risk register','Recommendations','Improvement roadmap']},
  {slug:'api-security', n:'06', t:'API Security', tagline:'Secure the Connections Behind Your Applications', d:'Assess APIs for common and advanced security weaknesses.', img:'images/svc-api-security.svg',
    items:['Authentication & authorization','Rate limiting','Input validation','API misconfiguration','OWASP API Top 10'],
    intro:'APIs are critical components of modern applications. We assess APIs for authentication, authorization, data exposure, business logic, and configuration weaknesses.',
    assess:['Authentication','Authorization','Object-level access control','Input validation','Rate limiting','Session management','API configuration','Data exposure','Business logic','Error handling','API documentation exposure'],
    steps:['API Discovery — Identify all APIs in scope.','Endpoint Mapping — Catalog available endpoints and methods.','Authentication Analysis — Test how identity is verified.','Authorization Testing — Confirm access controls hold up.','Input Testing — Probe how the API handles unexpected input.','Business Logic Review — Look for flaws in intended workflows.','Validation — Confirm findings are real and reproducible.','Reporting — Document risk and remediation guidance.'],
    deliverables:['API security report','Endpoint risk analysis','Vulnerability evidence','Remediation recommendations']},
  {slug:'cloud-security', n:'07', t:'Cloud Security', tagline:'Secure Your Cloud Environment', d:'Assess cloud environments and configurations.', img:'images/svc-cloud-security.svg',
    items:['IAM review','Storage security','Network configuration','Workload security','Misconfiguration assessment'],
    intro:'We assess cloud infrastructure, workloads, identity controls, storage, networking, and configurations to identify security risks.',
    assess:['Identity and Access Management','Cloud storage','Virtual networks','Security groups','Compute resources','Logging','Monitoring','Encryption','Secrets management','Configuration security'],
    steps:['Architecture Review — Understand the cloud environment\u2019s design.','Asset Discovery — Identify resources and services in scope.','IAM Review — Examine identity and access management controls.','Configuration Assessment — Check for insecure settings.','Network Review — Assess virtual networks and exposure.','Storage Review — Evaluate storage security and access.','Logging Review — Confirm visibility into activity.','Risk Analysis — Prioritize findings by impact.','Reporting — Document results and recommendations.'],
    deliverables:['Cloud security report','Configuration findings','Risk analysis','Remediation recommendations']},
  {slug:'system-security', n:'08', t:'System Security', tagline:'Protect Servers, Endpoints & Infrastructure', d:'Evaluate operating systems, servers, and endpoint configurations.', img:'images/svc-system-security.svg',
    items:['Server hardening','Endpoint security','Patch management','Privilege review','Service analysis'],
    intro:'We evaluate operating systems, servers, endpoints, and system configurations to identify weaknesses that could increase organizational risk.',
    assess:['Windows systems','Linux systems','Server hardening','Endpoint security','Patch management','User privileges','Services','Authentication','System configurations','Logging','Malware protection'],
    steps:['Asset Identification — Catalog systems in scope.','Configuration Review — Examine system settings against hardening baselines.','Patch Assessment — Check for missing or outdated updates.','Privilege Review — Evaluate user and service account permissions.','Service Analysis — Identify unnecessary or risky running services.','Security Hardening Review — Compare against best-practice benchmarks.','Risk Assessment — Rank findings by exposure and impact.','Reporting — Document results and remediation steps.'],
    deliverables:['System security report','Hardening findings','Risk classification','Remediation recommendations']},
  {slug:'network-security', n:'09', t:'Network Security', tagline:'Strengthen Your Network Infrastructure', d:'Assess network architecture, devices, and exposed services.', img:'images/svc-network-security.svg',
    items:['Firewall review','Segmentation testing','Wireless assessment','IDS/IPS review','Exposed service analysis'],
    intro:'We assess network architecture, devices, communication paths, security controls, and exposed services.',
    assess:['Network architecture','Firewalls','Routers','Switches','VPN','Wireless networks','Network segmentation','IDS/IPS','Access controls','Exposed services','Network configurations'],
    steps:['Network Mapping — Identify network segments and devices.','Architecture Review — Assess overall network design.','Service Enumeration — Identify exposed services and ports.','Configuration Assessment — Review device and control settings.','Security Control Review — Evaluate firewalls, IDS/IPS, and segmentation.','Vulnerability Assessment — Identify weaknesses across the network.','Risk Analysis — Prioritize findings by impact.','Reporting — Document results with remediation guidance.'],
    deliverables:['Network security report','Architecture findings','Risk analysis','Remediation recommendations']},
  {slug:'saas-security', n:'10', t:'SaaS Security', tagline:'Secure Your SaaS Environment', d:'Assess Software-as-a-Service applications and configurations.', img:'images/svc-saas-security.svg',
    items:['Access & identity review','Tenant isolation','Data protection','Integration review','Admin control review'],
    intro:'We assess Software-as-a-Service applications and their configurations to identify risks involving access, data protection, tenant isolation, and integrations.',
    assess:['SaaS configuration','User access','Authentication','Authorization','Data protection','Tenant isolation','Third-party integrations','API security','Logging','Administrative controls'],
    steps:['SaaS Inventory — Identify platforms and configurations in scope.','Configuration Review — Examine security-relevant settings.','Identity Assessment — Evaluate authentication and access management.','Access-Control Testing — Confirm permissions are enforced correctly.','Data Protection Review — Assess how data is stored and shared.','Integration Assessment — Review third-party connections.','Risk Analysis — Prioritize findings by impact.','Reporting — Document results and recommendations.'],
    deliverables:['SaaS security report','Configuration findings','Risk analysis','Remediation recommendations']},
  {slug:'source-code-review', n:'11', t:'Source Code Security Review', tagline:'Find Security Problems Before Deployment', d:'Review source code for insecure patterns and vulnerabilities.', img:'images/svc-source-code-review.svg',
    items:['Static analysis','Manual code review','Dependency analysis','Secrets management review','Secure coding guidance'],
    intro:'We review source code to identify insecure coding patterns, vulnerabilities, configuration issues, and weaknesses that could become exploitable in production.',
    assess:['Authentication','Authorization','Input validation','Cryptography','Secrets management','Injection risks','Error handling','File handling','Dependency security','Business logic','Secure coding practices'],
    steps:['Code Collection — Gather the codebase and context in scope.','Architecture Review — Understand how the application is structured.','Static Analysis — Scan code for common insecure patterns.','Manual Code Review — Examine critical logic by hand.','Dependency Analysis — Check third-party libraries for known issues.','Finding Validation — Confirm which results are real risks.','Risk Classification — Rank findings by severity.','Report — Document findings with secure coding guidance.'],
    deliverables:['Code security report','Vulnerability findings','Affected code locations','Severity classification','Secure coding recommendations']},
  {slug:'email-security', n:'12', t:'Email Security', tagline:'Protect Your Organization From Email-Based Threats', d:'Assess email security controls to reduce phishing and spoofing risk.', img:'images/svc-email-security.svg',
    items:['SPF / DKIM / DMARC review','Phishing resilience','Mail gateway review','Account protection'],
    intro:'We assess organizational email security controls and configurations to help reduce phishing, spoofing, malicious email, and account-compromise risks.',
    assess:['Email authentication','SPF','DKIM','DMARC','Mail security configuration','Phishing resilience','Security awareness','Email gateway configuration','Account protection'],
    steps:['Domain Assessment — Review domains in scope.','Email Configuration Review — Examine mail security settings.','Authentication Analysis — Check SPF, DKIM, and DMARC configuration.','Security-Control Assessment — Evaluate gateway and account protections.','Risk Analysis — Identify gaps and their potential impact.','Recommendations — Provide practical steps to close the gaps.'],
    deliverables:['Email security report','Authentication findings','Risk analysis','Recommendations']},
  {slug:'security-consulting', n:'13', t:'Security Consulting', tagline:'Build a Stronger Security Strategy', d:'Practical cybersecurity guidance tailored to organizations.', img:'images/svc-security-consulting.svg',
    items:['Security strategy','Risk assessment','Security architecture','Incident readiness','Security roadmap'],
    intro:'We provide cybersecurity guidance tailored to an organization\u2019s infrastructure, applications, risk profile, and business requirements.',
    assess:['Cybersecurity strategy','Security architecture','Risk assessment','Security roadmap','Incident readiness','Security policies','Vulnerability management','Security awareness','Cloud security','Application security','Network security'],
    steps:['Understand — Learn the organization\u2019s environment and goals.','Assess — Evaluate current security posture.','Identify Gaps — Pinpoint where controls fall short.','Prioritize Risks — Rank issues by business impact.','Design Strategy — Build a practical plan forward.','Implement Recommendations — Support execution of the plan.','Measure Improvement — Track progress over time.'],
    deliverables:['Security strategy document','Risk assessment summary','Roadmap','Recommendations']},
];

function serviceCardHtml(s,i){
  return `
    <div class="card service-card reveal reveal-delay-${(i%4)+1}">
      <div class="picture-panel"><img src="${s.img}" alt="${s.t} illustration" loading="lazy" width="640" height="400"></div>
      <span class="service-num">${s.n}</span>
      <h3>${s.t}</h3>
      <p class="desc">${s.d}</p>
      <ul class="service-list">${s.items.map(x=>`<li>${x}</li>`).join('')}</ul>
      <a href="${window.__onServicesPage ? '#'+s.slug : 'services.html#'+s.slug}" class="service-link" data-service-slug="${s.slug}" data-cursor="VIEW">Explore Service <span class="arrow">→</span></a>
    </div>`;
}

const servicesGridEl = document.getElementById('servicesGrid');
if(servicesGridEl){
  window.__onServicesPage = true;
  servicesGridEl.innerHTML = services.map((s,i) => serviceCardHtml(s,i)).join('');
}

/* ---- service detail accordion (services.html only) ---- */
const serviceDetailsEl = document.getElementById('serviceDetails');
if(serviceDetailsEl){
  serviceDetailsEl.innerHTML = services.map(s => `
    <div class="service-detail" id="${s.slug}">
      <div class="service-detail-top">
        <div>
          <span class="eyebrow">${s.n} — ${s.t}</span>
          <h3>${s.tagline}</h3>
          <p class="sd-intro">${s.intro}</p>
        </div>
        <a href="#services-overview" class="service-detail-close" data-close-slug="${s.slug}">✕ Close</a>
      </div>
      <div class="sd-columns">
        <div class="sd-block">
          <h4>What We <span class="h4-accent">Assess</span></h4>
          <ul class="sd-list">${s.assess.map(a=>`<li>${a}</li>`).join('')}</ul>
        </div>
        <div class="sd-block">
          <h4>Methodology</h4>
          <div class="sd-steps">${s.steps.map((st,idx)=>{
            const parts = st.split(' — ');
            const title = parts[0]; const desc = parts[1] || '';
            return `<div class="sd-step"><span class="step-n">${String(idx+1).padStart(2,'0')}</span><span class="step-t"><b>${title}</b>${desc ? ' — '+desc : ''}</span></div>`;
          }).join('')}</div>
        </div>
      </div>
      <div class="sd-deliverables">
        <h4>Deliverables</h4>
        <div class="sd-deliverables-grid">${s.deliverables.map(d=>`<span>${d}</span>`).join('')}</div>
      </div>
      ${s.note ? `<p class="sd-intro" style="margin-top:22px;font-size:12.5px;">${s.note}</p>` : ''}
      <div class="sd-cta">
        <a href="contact.html" class="btn btn-primary" data-cursor="REQUEST">Request This Assessment</a>
      </div>
    </div>`).join('');

  function openService(slug){
    let found = false;
    document.querySelectorAll('.service-detail').forEach(d => {
      const match = d.id === slug;
      d.classList.toggle('open', match);
      if(match) found = true;
    });
    if(found){
      const target = document.getElementById(slug);
      setTimeout(() => target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'}), 30);
    }
    return found;
  }
  window.__openService = openService;

  function handleHash(){
    const slug = location.hash.replace('#','');
    if(slug && document.getElementById(slug) && document.getElementById(slug).classList.contains('service-detail')){
      openService(slug);
    } else {
      document.querySelectorAll('.service-detail').forEach(d => d.classList.remove('open'));
    }
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();

  serviceDetailsEl.addEventListener('click', (e) => {
    const closeLink = e.target.closest('[data-close-slug]');
    if(closeLink){
      e.preventDefault();
      document.getElementById(closeLink.dataset.closeSlug).classList.remove('open');
      history.pushState(null, '', location.pathname);
      document.getElementById('services-overview')?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    }
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-service-slug]');
    if(link && link.getAttribute('href')?.startsWith('#')){
      e.preventDefault();
      const slug = link.dataset.serviceSlug;
      history.pushState(null, '', '#'+slug);
      openService(slug);
    }
  });
}

/* ---- nav services dropdown (all pages) ---- */
const navDropdownEls = document.querySelectorAll('[data-nav-services-panel]');
if(navDropdownEls.length){
  const onServicesPage = !!document.getElementById('serviceDetails');
  const footerHref = onServicesPage ? '#services-overview' : 'services.html';
  const panelHtml = services.map(s => `<a href="${onServicesPage ? '#'+s.slug : 'services.html#'+s.slug}" data-service-slug="${s.slug}"><span class="drop-num">${s.n}</span>${s.t}</a>`).join('')
    + `<a href="${footerHref}" class="nav-dropdown-footer">→ View all 13 security services</a>`;
  navDropdownEls.forEach(el => { el.innerHTML = panelHtml; });
}

/* ---- nav dropdown open/close behavior (desktop) ---- */
document.querySelectorAll('.nav-item-dropdown').forEach(item => {
  const trigger = item.querySelector('.nav-drop-trigger');
  if(!trigger) return;
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.nav-item-dropdown.open').forEach(o => { o.classList.remove('open'); o.querySelector('.nav-drop-trigger')?.setAttribute('aria-expanded','false'); });
    if(!isOpen){ item.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-item-dropdown.open').forEach(o => { o.classList.remove('open'); o.querySelector('.nav-drop-trigger')?.setAttribute('aria-expanded','false'); });
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    document.querySelectorAll('.nav-item-dropdown.open').forEach(o => o.classList.remove('open'));
  }
});

/* ---- mobile services list toggle ---- */
const mobileDropTrigger = document.getElementById('mobileServicesTrigger');
const mobileServicesList = document.getElementById('mobileServicesList');
if(mobileDropTrigger && mobileServicesList){
  mobileDropTrigger.addEventListener('click', () => {
    mobileServicesList.classList.toggle('open');
    mobileDropTrigger.querySelector('.caret')?.classList.toggle('open');
  });
}

/* ================= TIMELINE DATA ================= */
const process = [
  {n:'01', t:'Reconnaissance', d:"Understand the organization's attack surface."},
  {n:'02', t:'Discovery', d:'Identify technologies, vulnerabilities, and weaknesses.'},
  {n:'03', t:'Validation', d:'Safely validate findings within authorized scope.'},
  {n:'04', t:'Risk Analysis', d:'Determine business impact and severity.'},
  {n:'05', t:'Reporting', d:'Deliver professional technical and executive reports.'},
  {n:'06', t:'Remediation', d:'Provide actionable, prioritized recommendations.'},
  {n:'07', t:'Retesting', d:'Verify that identified issues have been resolved.'},
];
const timelineGridEl = document.getElementById('timelineGrid');
if(timelineGridEl){
  timelineGridEl.innerHTML = process.map((p,i) => `
    <div class="card tl-step reveal reveal-delay-${(i%4)+1}">
      <span class="tl-num">${p.n}</span>
      <h4>${p.t}</h4>
      <p>${p.d}</p>
    </div>`).join('');
}

const tlSection = document.querySelector('.tl-bar');
if(tlSection){
  const tlIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ const f = document.getElementById('tlFill'); if(f) f.style.width = '100%'; tlIo.unobserve(entry.target); }
    });
  }, {threshold:0.4});
  tlIo.observe(tlSection);
}

/* ================= SOC CHARTS ================= */
const threatBarsEl = document.getElementById('threatBars');
if(threatBarsEl){
  const threatData = [22,35,18,44,30,52,27];
  threatBarsEl.innerHTML = threatData.map(v => `<div class="bar" style="height:${v}%"></div>`).join('');
}

const sevRowsEl = document.getElementById('sevRows');
if(sevRowsEl){
  const sevData = [
    {label:'CRIT', val:2, max:26, color:'#FF1E2D'},
    {label:'HIGH', val:5, max:26, color:'#E50914'},
    {label:'MED', val:11, max:26, color:'#c96b2f'},
    {label:'LOW', val:8, max:26, color:'#6b7280'},
  ];
  sevRowsEl.innerHTML = sevData.map(s => `
    <div class="sev-row">
      <span class="sev-label">${s.label}</span>
      <div class="sev-bar-track"><div class="sev-bar-fill" data-w="${(s.val/s.max*100)}" style="background:${s.color}"></div></div>
      <span class="sev-val">${String(s.val).padStart(2,'0')}</span>
    </div>`).join('');
}

const socWrap = document.querySelector('.soc-wrap');
if(socWrap){
  const socIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        document.querySelectorAll('.sev-bar-fill').forEach(el => { el.style.width = el.getAttribute('data-w') + '%'; });
        socIo.unobserve(entry.target);
      }
    });
  }, {threshold:0.3});
  socIo.observe(socWrap);
}

/* RED SHIELD TRAINING SECTION */
const courseTracks = {
  cybersecurity: {
    label:'Cybersecurity',
    badge:'Cybersecurity',
    title:'Cybersecurity Fundamentals & Ethical Hacking',
    img:'images/photos/cybercrime-alert.jpg',
    desc:'Build a strong foundation in cybersecurity, ethical hacking, network security, Linux security, vulnerability assessment, web security, and defensive security.',
    level:'Beginner → Intermediate',
    duration:'[ editable — duration ]',
    overview:'A practical cybersecurity training program designed to build strong foundations in offensive security, defensive security, networking, Linux, vulnerability assessment, and ethical hacking. The course takes students from cybersecurity fundamentals toward practical security testing and defensive analysis, using hands-on labs rather than slides alone.',
    learn:['Cybersecurity fundamentals','CIA Triad','Threats, vulnerabilities & risks','Security controls','Networking fundamentals','TCP/IP & the OSI model','IP addressing','Ports & protocols','Linux fundamentals','Windows security fundamentals','Reconnaissance & footprinting','Network scanning & enumeration','Vulnerability assessment','Password security & authentication','Web application security','OWASP fundamentals','API security fundamentals','Wireless security','Social engineering awareness','Malware fundamentals','Cryptography fundamentals','Security monitoring','Incident response fundamentals','SOC fundamentals & log analysis','Defensive security','Ethical hacking methodology'],
    roadmap:[
      {t:'Cybersecurity Fundamentals', d:'Core concepts, the CIA triad, and how risk is assessed.'},
      {t:'Networking Fundamentals', d:'TCP/IP, the OSI model, and how data actually moves.'},
      {t:'Linux & Windows Security', d:'Hardening and securing the two dominant operating systems.'},
      {t:'Reconnaissance & Info Gathering', d:'Footprinting a target the way an attacker would.'},
      {t:'Scanning & Enumeration', d:'Mapping live hosts, ports, and services.'},
      {t:'Vulnerability Assessment', d:'Finding and prioritizing weaknesses systematically.'},
      {t:'Web Application Security', d:'OWASP-based testing of real web applications.'},
      {t:'Authentication & Password Security', d:'Where identity controls succeed and fail.'},
      {t:'Wireless & Network Security', d:'Securing Wi-Fi and network-level defenses.'},
      {t:'Security Monitoring & SOC', d:'Reading logs and alerts like an analyst.'},
      {t:'Incident Response', d:'What to do in the first hour of a real incident.'},
      {t:'Practical Capstone', d:'A full assessment tying every module together.'},
    ],
    labs:['Linux Security Lab','Network Scanning Lab','Vulnerability Assessment Lab','Web Security Lab','OWASP Lab','Password Security Lab','Wi-Fi Security Lab','SOC Monitoring Lab','Log Analysis Lab','Incident Response Lab','CTF Challenge Lab','Final Security Assessment'],
    tools:['Kali Linux','Nmap','Wireshark','Burp Suite','Metasploit','OWASP ZAP','Gobuster','Nikto','Linux CLI','Wazuh','SIEM concepts','Git','Python fundamentals'],
    who:'Aspiring pentesters, SOC analysts, and IT staff moving into a security role.',
    prerequisites:'Basic computer literacy. Prior networking/OS exposure helps but isn\u2019t required.',
    outcomes:['Understand modern cybersecurity concepts','Analyze common security threats','Perform authorized security assessments','Understand vulnerability management','Analyze network traffic','Understand web security','Work with security tools','Understand SOC operations','Perform basic incident analysis','Build a cybersecurity lab environment'],
  },
  ccna: {
    label:'CCNA',
    badge:'Networking',
    title:'CCNA — Cisco Networking Fundamentals',
    img:'images/course-ccna-networking.svg',
    desc:'Learn networking from the ground up including IP addressing, subnetting, switching, routing, VLANs, network security, wireless networking, and troubleshooting.',
    level:'Beginner',
    duration:'[ editable — duration ]',
    overview:'A practical networking course designed to establish strong networking fundamentals required for cybersecurity, system administration, cloud, and IT careers. This is the recommended starting point before Cybersecurity Fundamentals.',
    learn:['Networking fundamentals','OSI model','TCP/IP model','Ethernet & MAC addresses','IPv4','IPv6','Binary basics','Subnetting','VLSM fundamentals','ARP & ICMP','TCP & UDP','DNS & DHCP','NAT','Switching','VLANs & trunking','STP fundamentals','Static routing','Dynamic routing concepts','Wireless networking','Network security','ACLs','Device management','Troubleshooting','Automation & programmability fundamentals'],
    roadmap:[
      {t:'Networking Fundamentals', d:'What a network actually is, end to end.'},
      {t:'OSI & TCP/IP Models', d:'The mental model behind every networking concept.'},
      {t:'IPv4 & IPv6 Addressing', d:'How devices get and use addresses.'},
      {t:'Subnetting', d:'Dividing networks efficiently — by hand, not just a calculator.'},
      {t:'Ethernet & Switching', d:'How traffic actually moves on the local network.'},
      {t:'VLANs & Trunking', d:'Segmenting networks for security and performance.'},
      {t:'Routing Fundamentals', d:'How traffic finds its way between networks.'},
      {t:'Routing Protocol Concepts', d:'Static vs dynamic routing, and when to use each.'},
      {t:'Wireless Networking', d:'Wi-Fi standards, security, and configuration.'},
      {t:'IP Services', d:'DHCP, NAT, and NTP in practice.'},
      {t:'Network Security', d:'ACLs and baseline device hardening.'},
      {t:'Troubleshooting & Capstone', d:'Diagnosing and fixing a broken network topology.'},
    ],
    labs:['Cisco Router Configuration','Cisco Switch Configuration','VLAN Configuration','Trunk Configuration','Inter-VLAN Routing','Static Routing','DHCP Configuration','NAT Configuration','ACL Configuration','IPv4 Subnetting Lab','IPv6 Lab','Network Troubleshooting','Packet Tracer Labs','Final Network Design'],
    tools:['Cisco Packet Tracer','Wireshark','Cisco IOS','Linux networking tools','Ping','Traceroute','Netstat / ss','IP utilities'],
    who:'Beginners, career-changers, and anyone starting before Cybersecurity Fundamentals.',
    prerequisites:'None — this is the recommended starting point for newcomers to IT and security.',
    outcomes:['Design basic networks','Configure network devices in labs','Understand routing and switching','Calculate subnets','Configure VLANs','Understand network services','Troubleshoot connectivity','Apply basic network security','Build enterprise-style lab topologies'],
  },
};
const trackOrder = ['cybersecurity','ccna'];

/* -- course spotlight cards -- */
const courseSpotlightGridEl = document.getElementById('courseSpotlightGrid');
if(courseSpotlightGridEl){
  courseSpotlightGridEl.innerHTML = trackOrder.map((key,i) => {
    const c = courseTracks[key];
    return `
    <div class="card course-spotlight reveal reveal-delay-${i+1}">
      <div class="course-spotlight-img">
        <img src="${c.img}" alt="${c.title}" loading="lazy">
        <span class="course-spotlight-badge">${c.badge}</span>
      </div>
      <div class="course-spotlight-body">
        <h3>${c.title}</h3>
        <p class="desc">${c.desc}</p>
        <div class="course-meta-row">
          <span>LEVEL: ${c.level}</span>
          <span>⏱ ${c.duration}</span>
          <span>HANDS-ON LABS</span>
        </div>
        <button class="read-more-btn" type="button" data-open-course="${key}">Read More <span class="arrow">→</span></button>
      </div>
    </div>`;
  }).join('');
}

/* -- generic tab system for roadmap / labs / tools / outcomes -- */
function buildTabs(tabsId, panelsId, renderPanel){
  const tabsEl = document.getElementById(tabsId);
  const panelsEl = document.getElementById(panelsId);
  if(!tabsEl || !panelsEl) return;
  tabsEl.innerHTML = trackOrder.map((key,i) => `<button class="track-tab${i===0?' active':''}" type="button" role="tab" aria-selected="${i===0}" data-track-tab="${key}">${courseTracks[key].label}</button>`).join('');
  panelsEl.innerHTML = trackOrder.map((key,i) => `<div class="track-panel${i===0?' active':''}" data-track-panel="${key}">${renderPanel(courseTracks[key])}</div>`).join('');
  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-track-tab]');
    if(!btn) return;
    const track = btn.dataset.trackTab;
    tabsEl.querySelectorAll('.track-tab').forEach(t => { t.classList.toggle('active', t === btn); t.setAttribute('aria-selected', t === btn); });
    panelsEl.querySelectorAll('.track-panel').forEach(p => p.classList.toggle('active', p.dataset.trackPanel === track));
  });
}

buildTabs('roadmapTabs','roadmapPanels', (c) => `
  <div class="roadmap-grid">${c.roadmap.map((m,i) => `
    <div class="card module-card reveal reveal-delay-${(i%4)+1}">
      <span class="mod-n">MODULE ${String(i+1).padStart(2,'0')}</span>
      <h5>${m.t}</h5>
      <p>${m.d}</p>
    </div>`).join('')}</div>`);

buildTabs('labTabs','labPanels', (c) => `
  <div class="lab-badge-grid">${c.labs.map(l => `<span class="lab-badge">${l}</span>`).join('')}</div>`);

buildTabs('toolTabs','toolPanels', (c) => `
  <div class="tool-badge-grid">${c.tools.map(t => `<span class="tool-badge">${t}</span>`).join('')}</div>`);

buildTabs('outcomeTabs','outcomePanels', (c) => `
  <div class="outcome-grid">${c.outcomes.map(o => `<div class="card outcome-card"><span class="oc-icon">✓</span><p>${o}</p></div>`).join('')}</div>`);

/* -- training journey -- */
const trainingJourneyEl = document.getElementById('trainingJourney');
if(trainingJourneyEl){
  const journeySteps = ['START','NETWORKING FOUNDATION','CYBERSECURITY FUNDAMENTALS','HANDS-ON LABS','SPECIALIZATION','CAPSTONE PROJECT','JOB-READY SKILLS'];
  trainingJourneyEl.innerHTML = journeySteps.map((s,i) => `
    ${i>0 ? '<div class="journey-connector"></div>' : ''}
    <div class="journey-node reveal reveal-delay-${(i%4)+1}"><span class="jn-dot"></span>${s}</div>`).join('');
}

/* -- course details modal -- */
const courseModalOverlay = document.getElementById('courseModalOverlay');
if(courseModalOverlay){
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalHeroImg = document.getElementById('modalHeroImg');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('courseModalTitle');
  const modalBody = document.getElementById('modalBody');
  let lastFocused = null;

  function renderModalBody(c){
    return `
      <div class="modal-section">
        <h4>Overview</h4>
        <p class="modal-overview">${c.overview}</p>
      </div>
      <div class="modal-section">
        <h4>What You Will Learn</h4>
        <ul class="modal-checklist">${c.learn.map(l => `<li>${l}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <h4>Course Roadmap</h4>
        <div class="modal-roadmap">${c.roadmap.map((m,i) => `
          <div class="mr-step"><span class="mr-n">MODULE ${String(i+1).padStart(2,'0')}</span><span><span class="mr-t">${m.t}</span><div class="mr-d">${m.d}</div></span></div>`).join('')}</div>
      </div>
      <div class="modal-two-col">
        <div class="modal-section">
          <h4>Hands-On Labs</h4>
          <div class="modal-tags">${c.labs.map(l => `<span>${l}</span>`).join('')}</div>
          <span class="lab-authorized-tag" style="margin-top:12px;">AUTHORIZED TRAINING ENVIRONMENT</span>
        </div>
        <div class="modal-section">
          <h4>Tools</h4>
          <div class="modal-tags">${c.tools.map(t => `<span>${t}</span>`).join('')}</div>
        </div>
      </div>
      <div class="modal-two-col">
        <div class="modal-section">
          <h4>Who Should Take This</h4>
          <p class="modal-meta-block"><b>Who it's for:</b> ${c.who}</p>
          <p class="modal-meta-block" style="margin-top:10px;"><b>Prerequisites:</b> ${c.prerequisites}</p>
        </div>
        <div class="modal-section">
          <h4>Learning Outcomes</h4>
          <ul class="modal-checklist" style="grid-template-columns:1fr;">${c.outcomes.slice(0,6).map(o => `<li>${o}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="modal-cta">
        <a href="contact.html" class="btn btn-primary" data-cursor="REQUEST">Start Training →</a>
        <button class="btn btn-ghost" type="button" data-close-modal>Close</button>
      </div>`;
  }

  function openCourseModal(key){
    const c = courseTracks[key];
    if(!c) return;
    lastFocused = document.activeElement;
    modalHeroImg.src = c.img; modalHeroImg.alt = c.title;
    modalTag.textContent = c.badge;
    modalTitle.textContent = c.title;
    modalBody.innerHTML = renderModalBody(c);
    courseModalOverlay.classList.add('open');
    courseModalOverlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }
  function closeCourseModal(){
    courseModalOverlay.classList.remove('open');
    courseModalOverlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-course]');
    if(opener){ openCourseModal(opener.dataset.openCourse); }
  });
  modalCloseBtn.addEventListener('click', closeCourseModal);
  modalBody.addEventListener('click', (e) => { if(e.target.closest('[data-close-modal]')) closeCourseModal(); });
  courseModalOverlay.addEventListener('click', (e) => { if(e.target === courseModalOverlay) closeCourseModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && courseModalOverlay.classList.contains('open')) closeCourseModal(); });
}

/* ================= LAB TERMINAL TYPE EFFECT ================= */
const labLines = [
  {cls:'', text:'┌──[ RED SHIELD LAB ]──┐'},
  {cls:'', text:''},
  {cls:'', text:'TARGET: TRAINING-LAB'},
  {cls:'ok-line', text:'STATUS: ONLINE'},
  {cls:'', text:'MODE: AUTHORIZED'},
  {cls:'', text:''},
  {cls:'prompt', text:'> START LAB'},
  {cls:'prompt', text:'> RUN SECURITY TEST'},
  {cls:'prompt', text:'> ANALYZE RESULTS'},
  {cls:'', text:''},
  {cls:'', text:'└──────────────────────┘'},
];
function typeTerminal(){
  const el = document.getElementById('labTerminal');
  if(!el) return;
  if(reduceMotion){
    el.innerHTML = labLines.map(l => `<div class="${l.cls}">${l.text||'&nbsp;'}</div>`).join('');
    return;
  }
  el.innerHTML = '';
  let li = 0;
  function nextLine(){
    if(li >= labLines.length){ return; }
    const line = labLines[li];
    const div = document.createElement('div');
    div.className = line.cls;
    el.appendChild(div);
    let ci = 0;
    const cursor = document.createElement('span');
    cursor.className = 'blink-cursor';
    function typeChar(){
      if(ci < line.text.length){
        div.textContent = line.text.slice(0, ci+1);
        div.appendChild(cursor);
        ci++;
        setTimeout(typeChar, 14);
      } else {
        cursor.remove();
        li++;
        setTimeout(nextLine, 90);
      }
    }
    typeChar();
  }
  nextLine();
}
const labTermEl = document.getElementById('labTerminal');
if(labTermEl){
  const labIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ typeTerminal(); labIo.unobserve(entry.target); } });
  }, {threshold:0.4});
  labIo.observe(labTermEl);
}

/* ================= RESEARCH DATA ================= */
const research = [
  {t:'AI for Cybersecurity', d:'Applying machine learning to strengthen detection and response.'},
  {t:'Threat Detection', d:'Behavioral and signature-based approaches to catching threats early.'},
  {t:'IoT Security', d:'Assessing risk across connected devices and embedded systems.'},
  {t:'Zero-Day Detection', d:'Research into identifying previously unknown vulnerabilities.'},
  {t:'Ransomware Detection', d:'Studying detection and containment of ransomware behavior.'},
  {t:'Security Automation', d:'Automating repeatable parts of the security workflow.'},
];
const researchGridEl = document.getElementById('researchGrid');
if(researchGridEl){
  const researchIcon = `<svg class="r-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
  researchGridEl.innerHTML = research.map((r,i) => `
    <div class="card research-card reveal reveal-delay-${(i%3)+1}">
      ${researchIcon}
      <h4>${r.t}</h4>
      <p>${r.d}</p>
    </div>`).join('');
}

/* ================= WHY CHOOSE DATA ================= */
const why = [
  {t:'Offensive Security Mindset', d:'Think like an attacker to strengthen defenses.'},
  {t:'Practical Security', d:'Focus on real-world risks rather than theoretical checklists.'},
  {t:'Professional Reporting', d:'Clear technical and executive-level reports.'},
  {t:'Risk-Based Approach', d:'Prioritize vulnerabilities based on business impact.'},
  {t:'Continuous Learning', d:'Research-driven security practices.'},
  {t:'Ethical & Authorized', d:'All security testing is performed only with explicit authorization.'},
];
const whyGridEl = document.getElementById('whyGrid');
if(whyGridEl){
  const whyIcon = `<svg class="w-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2 4 5v6c0 5.5 3.6 9.7 8 11 4.4-1.3 8-5.5 8-11V5Z"/></svg>`;
  whyGridEl.innerHTML = why.map((w,i) => `
    <div class="card why-card reveal reveal-delay-${(i%3)+1}">
      ${whyIcon}
      <h4>${w.t}</h4>
      <p>${w.d}</p>
    </div>`).join('');
}

/* ================= SOCIAL DATA ================= */
const socialGridEl = document.getElementById('socialGrid');
if(socialGridEl){
  const socialIcons = {
    linkedin: `<svg class="s-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21H18v-5.7c0-1.36-.02-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3v5.8H10V9Z"/></svg>`,
    facebook: `<svg class="s-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.3 3.65 15.1 3.5 13.7 3.5c-2.9 0-4.9 1.77-4.9 5v2.4H6v3.1h2.8V21h4.7Z"/></svg>`,
    instagram: `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>`
  };
  const socials = [
    {key:'linkedin', name:'LinkedIn'},
    {key:'facebook', name:'Facebook'},
    {key:'instagram', name:'Instagram'},
  ];
  socialGridEl.innerHTML = socials.map((s,i) => {
    const url = SITE_CONFIG.social[s.key];
    const display = url ? url : '[ ADD ' + s.name.toUpperCase() + ' URL IN CONFIG ]';
    return `<a class="card social-card reveal reveal-delay-${i+1}" href="${url || '#'}" target="${url ? '_blank' : '_self'}" rel="noopener">
      ${socialIcons[s.key]}
      <span><span class="s-name">${s.name}</span><br><span class="s-url">${display}</span></span>
    </a>`;
  }).join('');
}

/* ================= CONTACT FORM (UI only — no backend wired) ================= */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if(form && status){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 4500);
    form.reset();
  });
}

/* ================= SCROLL REVEAL (initialized last, after all dynamic content) ================= */
const revealEls = document.querySelectorAll('.reveal');
if(reduceMotion){
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));
}

