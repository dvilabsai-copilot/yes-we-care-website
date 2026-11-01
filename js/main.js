document.addEventListener('DOMContentLoaded', async () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  const pageKey = path.replace('.html', '') || 'index';
  document.body.classList.add(`page-${pageKey}`);
  if (!['index', 'about'].includes(pageKey)) document.body.classList.add('inner-page');

  const navItems = [
    ['Home', 'index.html', 'index'], ['About Us', 'about.html', 'about'], ['Services', 'services.html', 'services'],
    ['Corporate Care', 'corporate-care.html', 'corporate-care'], ['Volunteer', 'volunteer.html', 'volunteer'],
    ['Resources', 'faq.html', 'faq'], ['Contact', 'contact.html', 'contact']
  ];
  const navMarkup = navItems.map(([label, href, key]) => `<a class="${pageKey === key ? 'active' : ''}" href="${href}">${label}${key === 'services' ? ' <span aria-hidden="true">⌄</span>' : ''}</a>`).join('');
  const headerMarkup = `<header class="site-header"><div class="container nav-shell"><a class="brand" href="index.html" aria-label="Yes We Care Home"><img class="brand-logo" src="assets/logo.jpg" alt="Yes We Care"></a><button id="menu-toggle" class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="main-navigation" aria-label="Main navigation">${navMarkup}</nav><div class="header-cta"><a class="phone-pill" href="tel:+919952040006">☎ 99520 40006</a><a class="btn btn-primary" href="request-assistance.html">Request Assistance <span aria-hidden="true">→</span></a></div></div></header>`;
  const footerMarkup = `<footer class="footer"><div class="container footer-grid"><div class="footer-brand"><a href="index.html"><img class="footer-brand-logo" src="assets/logo.jpg" alt="Yes We Care"></a><p>A caring coordination partner for individuals, families and working professionals with healthcare and care assistance arrangements.</p><div class="social-links" aria-label="Social links"><span>f</span><span>◎</span><span>in</span><span>▶</span></div></div><div><h3>Quick Links</h3><a href="index.html">Home</a><a href="about.html">About Us</a><a href="services.html">Our Services</a><a href="corporate-care.html">Corporate Care</a><a href="volunteer.html">Volunteer</a><a href="faq.html">Resources</a><a href="contact.html">Contact</a></div><div><h3>Our Services</h3><a href="hospital-assistance.html">Hospital Assistance</a><a href="home-care.html">Home Care Assistance</a><a href="elder-care.html">Elder Care Assistance</a><a href="pre-post-operative-care.html">Pre- &amp; Post-Operative Care</a><a href="travel-companion.html">Travel Companion</a><a href="healthcare-concierge.html">Healthcare Concierge</a></div><div><h3>Contact Us</h3><a href="tel:+919952040006">☎ 99520 40006</a><p>Okkiyam Thoraipakkam, Chennai – 600097, Tamil Nadu, India.</p><p>Mon – Sat, 9:00 AM – 6:00 PM</p></div><div><h3>Our Location</h3><p>No. A4, Canyon Workspace, Near Idli Vada Sambar Restaurant, Chandrasekaran Avenue, Old Mahabalipuram Road, Okkiyam Thoraipakkam, Chennai – 600097, Tamil Nadu, India.</p><div class="map-placeholder" aria-label="YWC location map"><span>YWC Care Support</span></div></div></div><div class="container fineprint"><p>© 2026 Yes We Care Hospital &amp; Home Assist Pvt. Ltd. All rights reserved.</p><div><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a></div></div><div class="container disclaimer">Service Disclaimer: Services are subject to availability, location, agreed scope and applicable charges unless otherwise agreed. Healthcare coordination and assistance services do not replace professional medical advice, diagnosis or treatment. Clinical services are subject to applicable legal and professional requirements.</div></footer>`;
  document.querySelector('.site-header')?.replaceWith(document.createRange().createContextualFragment(headerMarkup));
  document.querySelector('.footer')?.replaceWith(document.createRange().createContextualFragment(footerMarkup));

  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-navigation');
  toggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? '✕' : '☰'; });

  const serviceCard = (href, image, icon, title, copy) => `<a class="service-card service-card-image" href="${href}"><img src="assets/${image}" alt="${title}"><div><span class="service-icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${copy}</p><span class="card-link">Know More <span aria-hidden="true">→</span></span></div></a>`;
  const relatedCard = (href, icon, title) => `<a class="related-card" href="${href}"><span class="related-icon" aria-hidden="true">${icon}</span><strong>${title}</strong><span aria-hidden="true">→</span></a>`;
  const hero = (crumb, title, accent, copy, image, alt) => `<section class="page-hero"><div class="page-hero-inner container"><div class="page-hero-copy"><div class="breadcrumb">Home <span>›</span> ${crumb}</div><h1>${title} <em>${accent}</em></h1><p>${copy}</p><div class="actions"><a class="btn btn-primary" href="request-assistance.html">Request Assistance <span aria-hidden="true">→</span></a><a href="tel:+919952040006" class="btn btn-secondary">☎ Call Us</a></div></div><div class="page-hero-media"><img src="assets/${image}" alt="${alt}" loading="eager"></div></div></section>`;
  const iconCard = (icon, title, copy) => `<article class="icon-card"><span class="feature-icon" aria-hidden="true">${icon}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`;
  const cta = (title, copy = 'Tell us what support you need and our team will help you explore suitable arrangements.') => `<section class="section cta-band"><div><span class="eyebrow">NEED HELP?</span><h2>${title}</h2><p>${copy}</p></div><div class="actions"><a class="btn btn-primary" href="request-assistance.html">Request Assistance <span aria-hidden="true">→</span></a><a href="tel:+919952040006" class="btn btn-secondary">☎ Call Us</a></div></section>`;

  function formMarkup() { return `<p>Fill in the details below and our care coordination team will get in touch with you shortly.</p><form id="enquiry-form" class="enquiry-form" novalidate><div class="form-grid"><label>Full Name *<input name="name" required minlength="2" placeholder="Enter your full name" autocomplete="name"></label><label>Phone Number *<input name="phone" required inputmode="tel" pattern="[0-9+ ()-]{10,16}" placeholder="Enter 10 digit mobile number" autocomplete="tel"></label><label>Email Address (optional)<input name="email" type="email" placeholder="Enter your email" autocomplete="email"></label><label>City / Location *<input name="city" required placeholder="Enter your city or location"></label><label>Service Required *<select name="service" required><option value="">Select a service</option><option value="hospital-assistance">Hospital Assistance</option><option value="home-care">Home Care Assistance</option><option value="elder-care">Elder Care Assistance</option><option value="pre-post-operative-care">Pre- &amp; Post-Operative Care</option><option value="travel-companion">Travel Companion Service</option><option value="healthcare-concierge">Healthcare Concierge</option><option value="corporate-care">Corporate Care</option></select></label><label>Preferred Date (optional)<input name="date" type="date"></label></div><label>Briefly describe your requirement *<textarea name="message" required minlength="10" rows="5" placeholder="Tell us about your requirements, special needs or any additional details"></textarea></label><label class="consent"><input name="consent" type="checkbox" required> I agree to be contacted by YWC regarding my enquiry.</label><button type="submit" class="btn btn-primary">Submit Enquiry <span aria-hidden="true">→</span></button><p class="form-notice">Your enquiry will be sent securely to our care coordination team. An enquiry is not a confirmed booking; service confirmation depends on scope, charges and availability.</p><div id="form-feedback" role="status" aria-live="polite"></div></form>`; }
  function faqPreviewMarkup() { return `<details><summary>What is the best way to contact YWC?</summary><p>Call 9952040006 to discuss your requirements, availability and applicable charges.</p></details><details><summary>How soon will I get a response?</summary><p>We will review your enquiry and contact you through the details you provide.</p></details><details><summary>Is my information kept confidential?</summary><p>We use the information only to discuss your enquiry during this local preview.</p></details>`; }
  function faqItems() { const items = [
    ['What is Yes We Care Hospital & Home Assist Pvt. Ltd.?','Yes We Care Hospital & Home Assist Pvt. Ltd. is focused on healthcare concierge services, elder care assistance, hospital coordination, home assistance arrangements, travel companionship, and pre-operative and post-operative support coordination.'],
    ['Do you provide hospital assistance?','We help coordinate hospital-related requirements, including doctor appointments, hospital visits, admission and discharge arrangements, and related services, depending on individual needs and availability.'],
    ['Can you help arrange care for my elderly parents while I am at work?','Yes. You can contact us to discuss your parents\' requirements. We can explore suitable assistance options based on the requested service, location, schedule, and availability.'],
    ['Do you provide post-operative care?','We help coordinate suitable post-operative support, such as home nursing, physiotherapy, follow-up appointments, and other recovery-related arrangements, subject to availability and clinical requirements.'],
    ['Can you arrange a companion for a hospital visit or railway station journey?','You can contact us to discuss travel companion requirements, including accompaniment to hospitals, doctor appointments, diagnostic centres, and agreed railway station journeys.'],
    ['Do you offer free services?','Our services are paid unless otherwise agreed. Any volunteer assistance offered through an eligible employee volunteering initiative is subject to the program\'s rules, volunteer availability, and agreed arrangements.'],
    ['Are your services available every day?','Availability depends on the location, service type, schedule, and availability of suitable personnel. Please contact us to confirm arrangements for your specific requirements.'],
    ['Do you provide medical treatment?','Our primary focus is healthcare coordination and assistance arrangements. Medical consultations, diagnosis, prescriptions, and clinical treatment must be provided by appropriately qualified and authorized healthcare professionals.'],
    ['How can a company partner with Yes We Care?','Organizations can contact us to discuss employee wellness, elder care assistance, and volunteer support initiatives tailored to their workplace requirements.'],
    ['How can I book a service?','Call us at 9952040006 to discuss your requirements, availability, and applicable charges.']
  ]; return items.map(([q,a],i) => `<details><summary><span class="faq-icon" aria-hidden="true">${['♡','♧','⌖','▤','♧','◎','◉','♧','♧','→'][i]}</span>${q}<span aria-hidden="true">⌄</span></summary><p>${a}</p></details>`).join(''); }

  const pageTemplates = {
    services: `${hero('Services', 'Our', 'Services', 'Comprehensive assistance for every stage of your healthcare journey. We bring compassion, coordination and convenience together to make quality care accessible for you and your loved ones.', 'care-family.jpg', 'Care coordinator supporting an elderly couple')}<section class="section offer-section"><div class="container"><div class="section-heading"><span class="eyebrow">WHAT WE OFFER</span><h2>Trusted Support Across Every Need</h2><p>From hospital visits to home care, elder care, travel support and more, our services are designed to bring comfort, convenience and peace of mind to you and your family.</p></div><div class="card-grid service-offer-grid">${serviceCard('hospital-assistance.html','care-family.jpg','✚','Hospital Assistance','Doctor appointments, hospital visits, admission and discharge coordination, diagnostic arrangements and report support.')}${serviceCard('home-care.html','care-at-home.jpg','⌂','Home Care Assistance','Suitable home assistance, daily living support, caregiver arrangements and home nursing coordination where required.')}${serviceCard('elder-care.html','care-at-home.jpg','♧','Elder Care Assistance','Appointment support, hospital visits, essential errands, companionship and updates for families where agreed.')}${serviceCard('pre-post-operative-care.html','care-family.jpg','♡','Pre- & Post-Operative Care','Practical arrangements before treatment and recovery support including follow-ups, home care and therapy coordination.')}${serviceCard('travel-companion.html','care-family.jpg','✈','Travel Companion Service','Companionship and practical assistance for hospital, diagnostic, railway station and other agreed journeys.')}${serviceCard('healthcare-concierge.html','corporate-team.jpg','☏','Healthcare Concierge','A single coordination contact for appointments, providers, reports, follow-ups and related care requirements.')}</div></div></section>${cta('Let Us Be Your Support Partner','Contact us for personalized assistance or to know more about our services. We are here to help you and your loved ones, every step of the way.')}`,
    'hospital-assistance': `${hero('Services › Hospital Assistance', 'Hospital', 'Assistance', 'Compassionate support during hospital visits, admissions, treatment and discharge – so you and your loved ones never feel alone.', 'care-family.jpg', 'Hospital assistance for an older adult')}<section class="section detail-section"><div class="container detail-grid"><div><span class="eyebrow">WHAT WE DO</span><h2>Hospital support made easier</h2><p>Our hospital assistance service helps individuals and families coordinate hospital-related requirements when family members cannot be present throughout the process.</p><ul class="checklist"><li>Doctor appointment scheduling and coordination</li><li>Support with hospital visits</li><li>Assistance navigating hospital departments and procedures</li><li>Coordination of admission and discharge formalities</li><li>Diagnostic appointment coordination</li><li>Assistance with collecting and organizing medical reports</li><li>Insurance-related documentation coordination</li><li>Coordination with family members regarding hospital requirements</li></ul><p class="note"><strong>Our goal:</strong> To make hospital visits more organized and less stressful. Medical decisions, clinical procedures and insurance approvals remain the responsibility of qualified professionals and relevant institutions.</p></div><aside class="detail-aside"><div class="request-card"><span class="feature-icon">✚</span><h3>Need Hospital Assistance?</h3><p>Tell us what support you require, where and when. We can discuss suitable arrangements.</p><a class="btn btn-primary" href="request-assistance.html?service=hospital-assistance">Request Assistance <span aria-hidden="true">→</span></a></div><div class="why-card"><h3>Why Choose YWC?</h3>${iconCard('♡','Compassionate support','Personalized help for patients and families.')}${iconCard('♧','Experienced coordination','Clear communication with hospitals and care providers.')}${iconCard('✓','Timely assistance','Reliable updates and practical support throughout the visit.')}</div></aside></div></section><section class="section soft"><div class="container"><div class="section-heading"><span class="eyebrow">WHO IS IT FOR?</span><h2>Support for individuals and families</h2><p>Our hospital assistance service is designed for people who need practical support during medical care and hospital visits.</p></div><div class="audience-grid">${iconCard('♙','Senior citizens','Companionship and support during hospital visits.')}${iconCard('♧','Individuals and families','Guidance through admissions and treatment.')}${iconCard('▣','Patients with ongoing treatments','Regular follow-up and coordination.')}${iconCard('♿','Anyone needing hospital support','Make the experience smoother and less stressful.')}</div></div></section><section class="section related-section"><div class="container"><div class="section-heading"><span class="eyebrow">RELATED SERVICES</span><h2>Explore other care coordination services</h2></div><div class="related-grid">${relatedCard('home-care.html','⌂','Home Care Assistance')}${relatedCard('elder-care.html','♧','Elder Care Assistance')}${relatedCard('pre-post-operative-care.html','♡','Pre- & Post-Operative Care')}${relatedCard('travel-companion.html','✈','Travel Companion')}${relatedCard('healthcare-concierge.html','☏','Healthcare Concierge')}</div></div></section>${cta('Need Assistance for Yourself or a Loved One?')}`,
    'how-it-works': `${hero('How It Works', 'How It', 'Works', 'A simple and structured process to get the right care and assistance for you or your loved ones.', 'care-family.jpg', 'Care coordinator supporting a family')}<section class="section journey-section"><div class="container"><div class="section-heading"><span class="eyebrow">YOUR SUPPORT JOURNEY</span><h2>Your Support Journey in <em>6 Simple Steps</em></h2><p>From your first call to continued support, we make the process simple, compassionate and reliable.</p></div><div class="journey-list"><article class="journey-step"><span class="journey-number">1</span><div class="journey-copy"><span class="feature-icon">☎</span><div><h3>Contact Us</h3><p>Tell us about your healthcare coordination, elder care, home assistance or travel companion requirements.</p></div></div><img src="assets/care-at-home.jpg" alt="Contact YWC for support"></article><article class="journey-step"><span class="journey-number">2</span><div class="journey-copy"><span class="feature-icon">▤</span><div><h3>Share Your Requirements</h3><p>We understand the type of assistance needed, preferred schedule, location and relevant arrangements.</p></div></div><img src="assets/care-family.jpg" alt="Sharing care requirements"></article><article class="journey-step"><span class="journey-number">3</span><div class="journey-copy"><span class="feature-icon">♧</span><div><h3>Explore Available Options</h3><p>We explain suitable service options, applicable charges and availability based on your needs.</p></div></div><img src="assets/care-family.jpg" alt="Exploring service options"></article><article class="journey-step"><span class="journey-number">4</span><div class="journey-copy"><span class="feature-icon">🤝</span><div><h3>Confirm Your Service</h3><p>Once requirements, charges, scope and arrangements are agreed, the service can be confirmed.</p></div></div><img src="assets/corporate-team.jpg" alt="Confirming a service arrangement"></article><article class="journey-step"><span class="journey-number">5</span><div class="journey-copy"><span class="feature-icon">♡</span><div><h3>Receive Assistance</h3><p>We coordinate the agreed service and provide updates as appropriate to the nature of the arrangement.</p></div></div><img src="assets/care-family.jpg" alt="Receiving care assistance"></article><article class="journey-step"><span class="journey-number">6</span><div class="journey-copy"><span class="feature-icon">✓</span><div><h3>Follow-Up</h3><p>Where applicable, we help coordinate follow-up appointments or additional care requirements.</p></div></div><img src="assets/care-at-home.jpg" alt="Follow-up care support"></article></div><p class="readable">Service availability, timelines and the scope of assistance depend on the location and specific requirements.</p></div></section>${cta('Ready to Get Started?','Our team is just a call or message away. Let us help you find the right care and support.')}`,
    'corporate-care': `${hero('Corporate Care', 'Corporate Care &', 'Employee Support', 'A workplace support program that helps organizations build a healthier, happier and more productive workforce through care, guidance and timely assistance.', 'corporate-team.jpg', 'Corporate care and employee support')}<section class="shortcut-strip container"><div>${relatedCard('hospital-assistance.html','✚','Hospital Assistance')}${relatedCard('home-care.html','⌂','Home Care Assistance')}${relatedCard('elder-care.html','♧','Elder Care Assistance')}${relatedCard('pre-post-operative-care.html','♡','Pre- & Post-Operative Care')}${relatedCard('travel-companion.html','✈','Travel Companion')}${relatedCard('healthcare-concierge.html','☏','Healthcare Concierge')}</div></section><section class="section corporate-intro"><div class="container split"><img class="rounded-image" src="assets/corporate-team.jpg" alt="Employees supporting one another"><div><span class="eyebrow">SUPPORT BEYOND THE WORKPLACE</span><h2>Supporting Your People <em>Beyond the Workplace</em></h2><p>Yes We Care aims to help organizations explore an employee support initiative that encourages colleagues to support one another with elder care responsibilities.</p><p>We help coordinate practical support for elderly parents and family members when work schedules make it difficult for employees to be physically present.</p></div></div></section><section class="section soft"><div class="container"><div class="section-heading"><span class="eyebrow">HOW IT HELPS</span><h2>Practical support for employees. Real benefits for your organization.</h2></div><div class="benefit-grid">${iconCard('♧','Easier Care Navigation','Help employees and families find suitable care options quickly and confidently.')}${iconCard('♡','Reduced Stress','Relieve the burden of managing healthcare and caregiving alongside work.')}${iconCard('▥','Greater Productivity','Better-supported employees can focus on work and family responsibilities.')}${iconCard('♢','Trusted and Verified Support','Access to suitable providers and separately arranged professional support when required.')}${iconCard('♧','Inclusive Support','Care coordination for employees, parents and family members.')}${iconCard('◉','Flexible and Customisable','Programs shaped around organizational needs, location and availability.')}</div></div></section><section class="section volunteer-band"><div class="container split"><img class="rounded-image" src="assets/care-family.jpg" alt="People joining hands in a volunteer initiative"><div><span class="eyebrow">EMPLOYEE VOLUNTEER INITIATIVE</span><h2>Employee <em>Volunteer Support</em></h2><p>Employees who wish to participate can register their interest in offering or receiving eligible elder care assistance. Support may include accompanying an elderly person to a doctor appointment, helping with an agreed essential errand or coordinating a railway station drop-off.</p><div class="volunteer-points"><span>Meaningful volunteer opportunities</span><span>Team-led community initiatives</span><span>Care with dignity and respect</span></div><a class="btn btn-outline" href="volunteer.html">Explore the initiative <span aria-hidden="true">→</span></a></div></div></section>${cta('Partner With YWC for a Healthier, Happier Workforce','Organizations interested in introducing an employee wellness, elder care and volunteer support initiative can contact Yes We Care to discuss a suitable program.')}`,
    contact: `${hero('Contact Us', 'Contact', 'Us', 'Whether you have a question, need guidance, or want to request assistance, our team is here for you. Reach out to us and we will get back to you as soon as possible.', 'care-at-home.jpg', 'YWC care coordination support')}<section class="section contact-methods-section"><div class="container contact-methods">${iconCard('☎','Call Us','9952040006 · Mon – Sat, 9:00 AM – 6:00 PM')}${iconCard('✉','Email Us','Please call to discuss the best contact channel for your enquiry.')}${iconCard('⌖','Our Office','Okkiyam Thoraipakkam, Chennai – 600097, Tamil Nadu, India.')}${iconCard('▣','Request Assistance','Tell us how we can help you and our team will follow up.')}</div></section><section class="section contact-office"><div class="container split"><div class="info-card"><span class="eyebrow">OUR OFFICE</span><h2>Let us help you care for your loved ones</h2><p>Whether you need hospital assistance, elder care support, home assistance, a travel companion or help coordinating post-operative services, we are here to discuss your requirements.</p><div class="office-detail"><strong>Address</strong><span>No. A4, Canyon Workspace, Near Idli Vada Sambar Restaurant, Chandrasekaran Avenue, Old Mahabalipuram Road, Okkiyam Thoraipakkam, Chennai – 600097, Tamil Nadu, India.</span></div><div class="office-detail"><strong>Phone</strong><a href="tel:+919952040006">9952040006</a></div><div class="office-detail"><strong>Hours</strong><span>Monday – Saturday<br>9:00 AM – 6:00 PM</span></div></div><div class="map-large"><span>YWC Care Support Centre</span><strong>Chennai – 600097</strong></div></div></section><section class="section enquiry-section" id="enquiry"><div class="container contact-lower"><div class="enquiry-photo"><img src="assets/care-family.jpg" alt="Care coordinator with a family"></div><div class="info-card"><span class="eyebrow">SEND US A MESSAGE</span><h2>We are here to help</h2>${formMarkup()}</div><div class="faq-preview"><span class="eyebrow">HELP CENTRE</span><h2>Frequently Asked Questions</h2>${faqPreviewMarkup()}</div></div></section>`,
    'request-assistance': `${hero('Request Assistance', 'Request', 'Assistance', 'Tell us your requirement and our team will get in touch with you at the earliest. We are here to coordinate trusted care and support for you and your loved ones.', 'care-family.jpg', 'YWC request assistance support')}<section class="section request-intro"><div class="container trust-markers"><div>${iconCard('♢','Trusted Support','Care coordination shaped around your requirements.')}${iconCard('♧','Personalized Guidance','Clear options based on location and availability.')}${iconCard('♡','Compassionate Coordination','Practical support throughout the care journey.')}</div></div><div class="container request-grid"><div class="info-card request-help"><span class="eyebrow">WE ARE HERE TO HELP</span><h2>Find the right support</h2><p>Whether you need hospital assistance, home care, elder care, post-operative support, travel companionship or any other service, our team will understand your needs and guide you to suitable options.</p>${iconCard('☏','Personalized Support','We listen to your needs and suggest the best care options.')}${iconCard('♧','Experienced Team','Our care coordinators are here to support you at every step.')}${iconCard('♡','End-to-End Coordination','From initial enquiry to service arrangement, we stay with you.')}${iconCard('♢','Confidential and Caring','Your information is treated with compassion during this local preview.')}</div><div class="info-card request-form"><span class="eyebrow">SEND US YOUR REQUEST</span><h2>Tell us what you need</h2>${formMarkup()}</div></div></section><section class="section process-section"><div class="container"><div class="section-heading"><span class="eyebrow">HOW IT WORKS</span><h2>A simple and transparent process</h2></div><div class="process-grid">${iconCard('▤','1. Submit Your Request','Share your details and requirements through the form.')}${iconCard('☏','2. We Get In Touch','Our care coordinator will contact you to understand your needs.')}${iconCard('♧','3. Discuss Options','We suggest suitable services based on your requirements.')}${iconCard('⚙','4. Coordinate Support','We arrange and coordinate the service for you.')}${iconCard('♡','5. Ongoing Assistance','We stay in touch to ensure continuous support.')}</div></div></section><section class="section request-faq"><div class="container faq-shell"><div class="section-heading"><span class="eyebrow">HELP CENTRE</span><h2>Frequently Asked Questions</h2><p>Find answers to common questions about our services and the request process.</p></div>${faqPreviewMarkup()}</div></section>`,
    faq: `${hero('Frequently Asked Questions', 'Frequently Asked', 'Questions', 'Find answers to common questions about our services, process and support. If you need more information, we are always here to help.', 'care-at-home.jpg', 'Care coordinator supporting an older adult')}<section class="section faq-section"><div class="container faq-shell"><div class="faq-heading"><div><span class="eyebrow">HELP CENTRE</span><h2>Frequently Asked Questions</h2><p>Explore the most common questions about YWC care coordination services, coverage, service availability and more.</p></div><span class="faq-mark" aria-hidden="true">?</span></div><div class="faq-list faq-list-modern">${faqItems()}</div><div class="faq-contact"><span class="feature-icon">☏</span><div><h3>Still have questions?</h3><p>Our team is here to help. Get in touch with us for personalized assistance.</p></div><a class="btn btn-primary" href="contact.html#enquiry">Contact Us <span aria-hidden="true">→</span></a></div></div></section>`
  };

  if (pageTemplates[pageKey]) document.querySelector('main')?.replaceChildren(document.createRange().createContextualFragment(pageTemplates[pageKey]));

  // Load editable CMS content after the approved static layout is rendered.
  // If the API is unavailable, the existing static page remains unchanged.
  const cmsApiBase = window.YWC_CMS_API_BASE || (['localhost', '127.0.0.1'].includes(location.hostname)
    ? 'http://127.0.0.1:4102/api/public'
    : new URL('api/public', document.baseURI).toString());
  const setCmsHeading = (heading, title, accentText) => {
    if (!heading) return;
    heading.replaceChildren(document.createTextNode(title || ''));
    if (accentText) {
      const accent = document.createElement('em');
      accent.textContent = accentText;
      heading.append(' ', accent);
    }
  };
  const setCmsHtml = (element, html) => { if (element && html != null) element.innerHTML = html; };
  const applyCmsItems = (elements, items) => {
    elements.forEach((element, index) => {
      const item = items[index];
      if (!item) return;
      const title = element.querySelector('h3');
      const body = element.querySelector('p');
      if (title && item.title) title.textContent = item.title;
      if (body && item.bodyHtml != null) setCmsHtml(body, item.bodyHtml);
    });
  };
  const applyCmsFooter = (footerPage) => {
    const section = footerPage?.sections?.[0];
    const footer = document.querySelector('footer.footer');
    if (!section || !footer) return;
    const config = JSON.parse(section.configJson || '{}');
    const brandCopy = footer.querySelector('.footer-brand p');
    if (brandCopy) brandCopy.innerHTML = section.bodyHtml || '';
    const quickLinks = footer.querySelectorAll('.footer-grid > div:nth-child(2) a');
    (section.items || []).slice(0, quickLinks.length).forEach((item, index) => {
      quickLinks[index].textContent = item.title || '';
      if (item.linkUrl) quickLinks[index].setAttribute('href', item.linkUrl);
    });
    const contactColumn = footer.querySelector('.footer-grid > div:nth-child(4)');
    const contactLink = contactColumn?.querySelector('a[href^="tel:"]');
    if (contactLink && config.contact) contactLink.textContent = `☎ ${config.contact.replace(/^Contact:\s*/i, '')}`;
    const locationColumn = footer.querySelector('.footer-grid > div:nth-child(5)');
    const locationCopy = locationColumn?.querySelector('p');
    if (locationCopy && config.location) locationCopy.textContent = config.location.replace(/^Location:\s*/i, '');
    const fineprint = footer.querySelector('.fineprint p');
    if (fineprint && config.copyright) fineprint.textContent = config.copyright;
    const disclaimer = footer.querySelector('.disclaimer');
    if (disclaimer && config.disclaimer) disclaimer.textContent = config.disclaimer;
  };
  async function applyCmsPageContent() {
    const cmsSlug = pageKey === 'index' ? 'home' : pageKey;
    let timer;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), 1500);
      const response = await fetch(`${cmsApiBase}/pages/${encodeURIComponent(cmsSlug)}`, { signal: controller.signal });
      if (!response.ok) return;
      const page = await response.json();
      const footerResponse = await fetch(`${cmsApiBase}/pages/footer`, { signal: controller.signal });
      if (footerResponse.ok) applyCmsFooter(await footerResponse.json());
      const sections = Object.fromEntries((page.sections || []).map(section => [section.sectionKey, section]));
      const staticSections = (page.sections || []).filter(section => section.sectionType === 'STATIC_HTML');
      if (staticSections.length) {
        const main = document.querySelector('main');
        const fragment = document.createDocumentFragment();
        staticSections.sort((a, b) => a.position - b.position).forEach(section => {
          try {
            const config = JSON.parse(section.configJson || '{}');
            const template = document.createElement('template');
            template.innerHTML = `${config.openingTag || '<section>'}${section.bodyHtml || ''}${config.closingTag || '</section>'}`;
            const element = template.content.firstElementChild;
            if (element) {
              const heading = element.querySelector('h1, h2, h3');
              const eyebrow = element.querySelector('.eyebrow');
              if (heading && section.title) setCmsHeading(heading, section.title, section.accentText);
              if (eyebrow && section.eyebrow) eyebrow.textContent = section.eyebrow;
              fragment.appendChild(element);
            }
          } catch { /* ignore one malformed section and preserve the remaining page */ }
        });
        if (main && fragment.childElementCount) main.replaceChildren(fragment);
      }
      const heroSection = sections.hero;
      const heroCopy = document.querySelector('.page-hero-copy') || document.querySelector('.hero-copy');
      const heroHeading = heroCopy?.querySelector('h1');
      if (heroSection && heroHeading) setCmsHeading(heroHeading, heroSection.title, heroSection.accentText);
      if (heroSection && heroCopy) {
        const paragraphs = [...heroCopy.querySelectorAll(':scope > p')];
        setCmsHtml(pageKey === 'index' ? paragraphs[1] : paragraphs[0], heroSection.bodyHtml);
      }

      if (pageKey === 'index') {
        const why = sections['why-choose'];
        if (why) {
          const root = document.querySelector('.home-why');
          setCmsHeading(root?.querySelector('h2'), why.title);
          setCmsHtml(root?.querySelector('.split > div > p'), why.bodyHtml);
          (why.items || []).forEach((item, index) => { const line = root?.querySelectorAll('.checklist li')[index]; if (line && item.title) line.textContent = item.title; });
        }
        const services = sections['services-overview'];
        if (services) {
          const root = document.querySelector('.home-services');
          setCmsHeading(root?.querySelector('h2'), services.title);
          setCmsHtml(root?.querySelector('.section-intro'), services.bodyHtml);
          applyCmsItems([...root?.querySelectorAll('.service-card') || []], services.items || []);
        }
        const process = sections['how-it-works'];
        if (process) {
          const root = document.querySelector('.home-how');
          setCmsHeading(root?.querySelector('h2'), process.title);
          setCmsHtml(root?.querySelector('.section-intro'), process.bodyHtml);
          applyCmsItems([...root?.querySelectorAll('.step') || []], process.items || []);
        }
        const corporate = sections['corporate-promo'];
        if (corporate) {
          const root = document.querySelector('.home-corporate');
          setCmsHeading(root?.querySelector('h2'), corporate.title);
          setCmsHtml(root?.querySelector('.split > div:nth-child(2) > p'), corporate.bodyHtml);
          (corporate.items || []).forEach((item, index) => { const line = root?.querySelectorAll('.corporate-highlights li strong')[index]; if (line && item.title) line.textContent = item.title; });
        }
        const homeCta = sections['home-cta'];
        if (homeCta) { const root = document.querySelector('.home-cta'); setCmsHeading(root?.querySelector('h2'), homeCta.title); setCmsHtml(root?.querySelector('p'), homeCta.bodyHtml); }
      }

      if (pageKey === 'services') {
        const serviceGrid = sections['service-grid'];
        const root = document.querySelector('.offer-section') || document.querySelector('main');
        if (serviceGrid) { setCmsHeading(root?.querySelector('.section-heading h2'), serviceGrid.title); setCmsHtml(root?.querySelector('.section-heading p'), serviceGrid.bodyHtml); applyCmsItems([...root?.querySelectorAll('.service-card') || []], serviceGrid.items || []); }
      }
      if (pageKey === 'how-it-works') {
        const journey = sections.journey;
        const root = document.querySelector('.journey-section');
        if (journey) { setCmsHeading(root?.querySelector('.section-heading h2'), journey.title); setCmsHtml(root?.querySelector('.section-heading p'), journey.bodyHtml); applyCmsItems([...root?.querySelectorAll('.journey-step') || []], journey.items || []); }
      }
      if (pageKey === 'corporate-care') {
        const intro = sections.intro;
        const root = document.querySelector('.corporate-intro');
        if (intro) { setCmsHeading(root?.querySelector('h2'), intro.title); setCmsHtml(root?.querySelector('div > p'), intro.bodyHtml); }
        const benefits = sections.benefits;
        const benefitRoot = document.querySelector('.soft');
        if (benefits) { setCmsHeading(benefitRoot?.querySelector('.section-heading h2'), benefits.title); applyCmsItems([...benefitRoot?.querySelectorAll('.benefit-grid .icon-card') || []], benefits.items || []); }
      }
      if (pageKey === 'request-assistance') {
        const trust = sections['trust-markers'];
        if (trust) applyCmsItems([...document.querySelectorAll('.trust-markers .icon-card')], trust.items || []);
        const help = sections['request-help'];
        const helpRoot = document.querySelector('.request-help');
        if (help && helpRoot) { setCmsHeading(helpRoot.querySelector('h2'), help.title); setCmsHtml(helpRoot.querySelector(':scope > p'), help.bodyHtml); applyCmsItems([...helpRoot.querySelectorAll('.icon-card')], help.items || []); }
        const form = sections['request-form'];
        const formRoot = document.querySelector('.request-form');
        if (form && formRoot) { setCmsHeading(formRoot.querySelector('h2'), form.title); setCmsHtml(formRoot.querySelector(':scope > p'), form.bodyHtml); }
        const process = sections.process;
        const processRoot = document.querySelector('.process-section');
        if (process && processRoot) { setCmsHeading(processRoot.querySelector('.section-heading h2'), process.title); applyCmsItems([...processRoot.querySelectorAll('.process-grid .icon-card')], process.items || []); }
        const faq = sections.faq;
        const faqRoot = document.querySelector('.request-faq');
        if (faq && faqRoot) { setCmsHeading(faqRoot.querySelector('.section-heading h2'), faq.title); setCmsHtml(faqRoot.querySelector('.section-heading p'), faq.bodyHtml); }
      }
      document.documentElement.dataset.cmsLoaded = 'true';
    } catch { /* static fallback is intentional for offline/local preview use */ }
    finally { if (timer) clearTimeout(timer); }
  }
  await applyCmsPageContent();

  // Replace legacy composite screenshots with clean standalone photographs.
  const imageAliases = {
    'assets/care-family.jpg': 'assets/ywc-hero-family.png',
    'assets/care-at-home.jpg': 'assets/ywc-home-care.png',
    'assets/corporate-team.jpg': 'assets/ywc-corporate-support.png'
  };
  document.querySelectorAll('img[src]').forEach(img => {
    const replacement = imageAliases[img.getAttribute('src')];
    if (replacement) img.src = replacement;
  });
  const heroImages = {
    services: 'assets/ywc-hero-family.png',
    'hospital-assistance': 'assets/ywc-hospital-support.png',
    'home-care': 'assets/ywc-home-care.png',
    'elder-care': 'assets/ywc-elder-care.png',
    'pre-post-operative-care': 'assets/ywc-postoperative-care.png',
    'travel-companion': 'assets/ywc-travel-companion.png',
    'healthcare-concierge': 'assets/ywc-concierge.png',
    'how-it-works': 'assets/ywc-process-consultation.png',
    'corporate-care': 'assets/ywc-corporate-support.png',
    contact: 'assets/ywc-contact-support.png',
    'request-assistance': 'assets/ywc-request-consultation.png',
    faq: 'assets/ywc-faq-support.png',
    volunteer: 'assets/ywc-volunteer-support.png'
  };
  const heroImage = document.querySelector('.page-hero-media img, .hero-media img');
  if (heroImage && heroImages[pageKey]) heroImage.src = heroImages[pageKey];
  const serviceImages = {
    'hospital-assistance.html': 'assets/ywc-hospital-support.png',
    'home-care.html': 'assets/ywc-home-care.png',
    'elder-care.html': 'assets/ywc-elder-care.png',
    'pre-post-operative-care.html': 'assets/ywc-postoperative-care.png',
    'travel-companion.html': 'assets/ywc-travel-companion.png',
    'healthcare-concierge.html': 'assets/ywc-concierge.png'
  };
  document.querySelectorAll('.service-card').forEach(card => {
    const img = card.querySelector('img');
    const replacement = serviceImages[card.getAttribute('href')];
    if (img && replacement) img.src = replacement;
  });
  if (pageKey === 'index') {
    const whyImage = document.querySelector('.why-visual img');
    const homeHero = document.querySelector('.hero-media img');
    const homeCorporate = document.querySelector('.home-corporate .corporate-photo img');
    const homeServiceImages = [
      'assets/approved-hospital.png',
      'assets/approved-family.png',
      'assets/approved-elder.png',
      'assets/approved-care-team.png',
      'assets/approved-travel.png',
      'assets/approved-corporate.png'
    ];
    if (homeHero) homeHero.src = 'assets/approved-family-wide.png';
    if (whyImage) whyImage.src = 'assets/approved-why-wide.png';
    if (homeCorporate) homeCorporate.src = 'assets/approved-corporate-wide.png';
    document.querySelectorAll('.home-services .service-card img').forEach((img, index) => {
      if (homeServiceImages[index]) img.src = homeServiceImages[index];
    });
  }
  if (pageKey === 'about') {
    const aboutImages = [
      ['.about-hero-media img', 'assets/ywc-hero-family.png'],
      ['.about-photo img', 'assets/ywc-elder-care.png'],
      ['.about-support-grid article:nth-child(1) img', 'assets/ywc-hospital-support.png'],
      ['.about-support-grid article:nth-child(2) img', 'assets/ywc-home-care.png'],
      ['.about-support-grid article:nth-child(3) img', 'assets/ywc-postoperative-care.png'],
      ['.about-support-grid article:nth-child(4) img', 'assets/ywc-request-consultation.png'],
      ['.about-support-grid article:nth-child(5) img', 'assets/ywc-corporate-support.png'],
      ['.about-cta-photo img', 'assets/ywc-travel-companion.png']
    ];
    aboutImages.forEach(([selector, source]) => {
      const img = document.querySelector(selector);
      if (img) img.src = source;
    });
  }
  if (pageKey === 'index') {
    document.querySelector('.hero-copy > .eyebrow')?.remove();
    const footerLogoImage = document.querySelector('.footer-brand-logo');
    if (footerLogoImage) {
      const footerLogo = footerLogoImage.closest('a');
      footerLogoImage.src = 'assets/logo-transparent.png';
      footerLogoImage.alt = 'Yes We Care';
      footerLogo.className = 'footer-logo';
    }
    const footerYear = document.querySelector('.homepage .fineprint p');
    if (footerYear && document.documentElement.dataset.cmsLoaded !== 'true') footerYear.textContent = '© 2025 Yes We Care Hospital & Home Assist Pvt. Ltd. All rights reserved.';
    const footerTerms = document.querySelector('.homepage .fineprint a[href="terms.html"]');
    if (footerTerms && document.documentElement.dataset.cmsLoaded !== 'true') footerTerms.textContent = 'Terms of Use';
    const footerLegal = footerTerms?.parentElement;
    if (footerLegal && !footerLegal.querySelector('[data-home-sitemap]')) {
      const sitemap = document.createElement('a');
      sitemap.href = 'index.html';
      sitemap.dataset.homeSitemap = 'true';
      sitemap.textContent = 'Sitemap';
      footerLegal.appendChild(sitemap);
    }
  }
  const journeyImages = [
    'assets/ywc-contact-support.png',
    'assets/ywc-corporate-intro.png',
    'assets/ywc-request-consultation.png',
    'assets/ywc-corporate-support.png',
    'assets/ywc-hospital-support.png',
    'assets/ywc-postoperative-care.png'
  ];
  document.querySelectorAll('.journey-step > img').forEach((img, index) => {
    if (journeyImages[index]) img.src = journeyImages[index];
  });
  const corporateIntroImage = document.querySelector('.corporate-intro img');
  if (corporateIntroImage) corporateIntroImage.src = 'assets/ywc-corporate-intro.png';
  const volunteerImage = document.querySelector('.volunteer-band img');
  if (volunteerImage) volunteerImage.src = 'assets/ywc-volunteer-support.png';
  const enquiryImage = document.querySelector('.enquiry-photo img');
  if (enquiryImage) enquiryImage.src = 'assets/ywc-request-consultation.png';
  const service = new URLSearchParams(location.search).get('service');
  const select = document.querySelector('select[name=service]');
  if (select && service && [...select.options].some(option => option.value === service)) select.value = service;
  const form = document.getElementById('enquiry-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const button = form.querySelector('button[type=submit]');
    if (!form.checkValidity()) {
      feedback.className = 'form-error';
      feedback.textContent = 'Please complete the required fields and consent checkbox before proceeding.';
      form.reportValidity();
      return;
    }
    button.disabled = true;
    feedback.className = '';
    feedback.textContent = 'Sending your enquiry…';
    const values = Object.fromEntries(new FormData(form).entries());
    values.consent = Boolean(form.elements.consent?.checked);
    if (values.date && !values.preferredDate) values.preferredDate = values.date;
    delete values.date;
    const enquiryEndpoint = window.YWC_API_BASE || (['localhost', '127.0.0.1'].includes(location.hostname)
      ? 'http://127.0.0.1:4102/ywc/api/enquiry'
      : new URL('api/enquiry', document.baseURI).toString());
    try {
      const response = await fetch(enquiryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error('delivery-failed');
      feedback.className = 'form-success';
      feedback.textContent = 'Thank you. Your enquiry has been sent and our team will contact you shortly.';
      form.reset();
    } catch {
      feedback.className = 'form-error';
      feedback.textContent = 'We could not send your enquiry right now. Please call 9952040006.';
    } finally {
      button.disabled = false;
    }
  });
});
