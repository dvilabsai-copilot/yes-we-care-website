import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { faqs, pages, services } from './seed-content';
import { docxParagraphs } from './docx-content';

const prisma = new PrismaClient();

const staticPageFiles: Record<string, { file: string; title: string }> = {
  home: { file: 'index.html', title: 'Home' },
  about: { file: 'about.html', title: 'About Us' },
  services: { file: 'services.html', title: 'Our Services' },
  'corporate-care': { file: 'corporate-care.html', title: 'Corporate Care and Employee Support' },
  volunteer: { file: 'volunteer.html', title: 'Volunteer Initiative' },
  'how-it-works': { file: 'how-it-works.html', title: 'How Our Service Works' },
  contact: { file: 'contact.html', title: 'Contact Us' },
  faq: { file: 'faq.html', title: 'Frequently Asked Questions' },
  'hospital-assistance': { file: 'hospital-assistance.html', title: 'Hospital Assistance' },
  'home-care': { file: 'home-care.html', title: 'Home Care Assistance' },
  'elder-care': { file: 'elder-care.html', title: 'Elder Care Assistance' },
  'pre-post-operative-care': { file: 'pre-post-operative-care.html', title: 'Pre- and Post-Operative Care' },
  'travel-companion': { file: 'travel-companion.html', title: 'Travel Companion Service' },
  'healthcare-concierge': { file: 'healthcare-concierge.html', title: 'Healthcare Concierge Services' },
  privacy: { file: 'privacy.html', title: 'Privacy Policy' },
  terms: { file: 'terms.html', title: 'Terms and Conditions' }
};

type StaticSection = { sectionKey: string; eyebrow?: string; title: string; accentText?: string; bodyHtml: string; configJson: string };

const docxText = (index: number) => String(docxParagraphs[index] || '').replace(/�/g, index === 208 ? '—' : index === 262 ? '©' : '–').trim();
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const docxP = (index: number) => `<p>${escapeHtml(docxText(index))}</p>`;
const docxList = (indexes: number[]) => `<ul class="checklist">${indexes.map(index => `<li>${escapeHtml(docxText(index))}</li>`).join('')}</ul>`;
const docxSteps = (indexes: number[]) => indexes.map(index => `<div class="step"><span>${escapeHtml(docxText(index).match(/^Step (\d+)/)?.[1] || '')}</span><h3>${escapeHtml(docxText(index))}</h3>${docxP(index + 1)}</div>`).join('');
const docxFaqIndexes = [211, 213, 215, 217, 219, 221, 223, 225, 227, 229];
const docxFaqBody = () => `<div class="container"><div class="faq-heading"><div><span class="eyebrow">HELP CENTRE</span><h2>Frequently Asked Questions</h2><p>Explore the most common questions about YWC care coordination services, coverage, service locations and partners.</p></div><span class="faq-mark" aria-hidden="true">?</span></div><div class="faq-list faq-list-modern">${docxFaqIndexes.map((index, position) => `<details><summary><span class="faq-icon" aria-hidden="true">${['♡', '♧', '⌖', '▤', '♧', '◎', '◉', '♧', '♧', '→'][position]}</span>${escapeHtml(docxText(index))}<span aria-hidden="true">⌄</span></summary>${docxP(index + 1)}</details>`).join('')}</div><div class="faq-contact"><span class="feature-icon">☏</span><div><h3>Still have questions?</h3><p>Our team is here to help. Get in touch with us for personalized assistance.</p></div><a class="btn btn-primary" href="contact.html#enquiry">Contact Us <span aria-hidden="true">→</span></a></div></div>`;

function replaceHeroCopy(bodyHtml: string, copyHtml: string, selector = 'hero-copy') {
  const pattern = new RegExp(`(<div class="${selector}">[\\s\\S]*?<h1\\b[^>]*>[\\s\\S]*?<\\/h1>)[\\s\\S]*?(<div class="actions">)`, 'i');
  return bodyHtml.replace(pattern, `$1${copyHtml}$2`);
}

function serviceDetailBody(slug: string) {
  const content: Record<string, { title: number; intro: number[]; lead?: number; bullets: number[]; before?: number; after?: number; extra: number[]; label: string }> = {
    'hospital-assistance': { title: 31, intro: [32, 33], lead: 34, bullets: [35, 36, 37, 38, 39, 40, 41, 42], extra: [43, 44], label: 'Hospital Assistance' },
    'home-care': { title: 45, intro: [46, 47], lead: 48, bullets: [49, 50, 51, 52, 53, 54], extra: [55], label: 'Home Care Assistance' },
    'elder-care': { title: 56, intro: [57, 58], lead: 59, bullets: [60, 61, 62, 63, 64, 65, 66, 67], extra: [68, 69, 70], label: 'Elder Care Assistance' },
    'pre-post-operative-care': { title: 71, intro: [72, 73], before: 74, after: 80, bullets: [75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89], extra: [90, 91, 92], label: 'Pre- &amp; Post-Operative Care' },
    'travel-companion': { title: 93, intro: [94, 95], lead: 96, bullets: [97, 98, 99, 100, 101, 102, 103], extra: [104, 105], label: 'Travel Companion Service' },
    'healthcare-concierge': { title: 106, intro: [107, 108], lead: 109, bullets: [110, 111, 112, 113, 114, 115, 116, 117, 118], extra: [119, 120], label: 'Healthcare Concierge Services' }
  };
  const item = content[slug];
  if (!item) return '';
  const bulletGroups = item.before && item.after ? `<p class="docx-lead">${escapeHtml(docxText(item.before))}</p>${docxList(item.bullets.slice(0, 5))}<p class="docx-lead">${escapeHtml(docxText(item.after))}</p>${docxList(item.bullets.slice(5))}` : `${item.lead ? `<p class="docx-lead">${escapeHtml(docxText(item.lead))}</p>` : ''}${docxList(item.bullets)}`;
  const extra = item.extra.map(index => docxP(index)).join('');
  return `<div class="container"><div class="section-heading"><span class="eyebrow">WHAT WE COORDINATE</span><h2>${escapeHtml(docxText(item.title))}</h2></div><div class="two-cols"><div class="info-card">${item.intro.map(index => docxP(index)).join('')}${bulletGroups}${extra}</div><aside class="info-card highlight"><h3>Need ${item.label}?</h3><p>Tell us what assistance you require, where and when; we can explain suitable available arrangements.</p><a class="btn btn-primary" href="contact.html?service=${slug}#enquiry">Enquire About This Service <span aria-hidden="true">→</span></a></aside></div></div>`;
}

function docxServiceRecord(slug: string, titleIndex: number, introIndexes: number[], labelIndexes: number[], bulletIndexes: number[], closingIndexes: number[], image: string) {
  const title = docxText(titleIndex).replace(/^\d+\.\s*/, '');
  const descriptionHtml = `<h3>${escapeHtml(docxText(titleIndex))}</h3>${introIndexes.map(docxP).join('')}<p>${labelIndexes.map(index => escapeHtml(docxText(index))).join('<br>')}</p>${docxList(bulletIndexes)}${closingIndexes.map(docxP).join('')}`;
  return { slug, title, short: docxText(introIndexes[0]), description: descriptionHtml, image, bullets: bulletIndexes.map(index => docxText(index)) };
}

const docxServiceRecords = [
  docxServiceRecord('hospital-assistance', 31, [32, 33], [34], [35, 36, 37, 38, 39, 40, 41, 42], [43, 44], 'assets/ywc-hospital-support.png'),
  docxServiceRecord('home-care', 45, [46, 47], [48], [49, 50, 51, 52, 53, 54], [55], 'assets/ywc-home-care.png'),
  docxServiceRecord('elder-care', 56, [57, 58], [59], [60, 61, 62, 63, 64, 65, 66, 67], [68, 69, 70], 'assets/ywc-elder-care.png'),
  docxServiceRecord('pre-post-operative-care', 71, [72, 73], [74, 80], [75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89], [90, 91, 92], 'assets/ywc-postoperative-care.png'),
  docxServiceRecord('travel-companion', 93, [94, 95], [96], [97, 98, 99, 100, 101, 102, 103], [104, 105], 'assets/ywc-travel-companion.png'),
  docxServiceRecord('healthcare-concierge', 106, [107, 108], [109], [110, 111, 112, 113, 114, 115, 116, 117, 118], [119, 120], 'assets/ywc-concierge.png')
];

function applyDocxStaticContent(slug: string, sections: StaticSection[]) {
  return sections.map((section, position) => {
    let bodyHtml = section.bodyHtml;
    let title = section.title;
    let accentText = section.accentText;
    if (slug === 'home' && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, `<div class="docx-hero-copy">${[3, 4, 5, 6].map(index => docxP(index)).join('')}</div>`);
    if (slug === 'home' && position === 2) {
      title = docxText(29);
      bodyHtml = bodyHtml.replace(/<p class="section-intro">[\s\S]*?<\/p>/i, docxP(30)).replace(/(<h3>[\s\S]*?<\/h3>)\s*<p>[\s\S]*?<\/p>/gi, (_match, heading, offset, full) => {
        const cardIndex = [...full.slice(0, offset + 1).matchAll(/<h3>/gi)].length;
        return `${heading}${docxP([32, 46, 57, 72, 94, 107][cardIndex] || 30)}`;
      });
    }
    if (slug === 'home' && position === 3) {
      title = docxText(123);
      bodyHtml = `<div class="container split"><div><span class="eyebrow">WHY CHOOSE YES WE CARE</span><h2>${escapeHtml(docxText(123))}</h2>${docxP(124)}<ul class="checklist">${[125, 127, 129, 131, 133, 135].map(index => `<li>${escapeHtml(docxText(index))}</li>`).join('')}</ul>${docxP(137)}</div><div class="why-visual"><img class="rounded-image" src="assets/care-at-home.jpg" alt="Illustrative family care imagery"><blockquote>Having someone who truly cares and coordinates everything gave us much-needed peace of mind.</blockquote></div></div>`;
    }
    if (slug === 'home' && position === 4) {
      title = docxText(172);
      bodyHtml = `<div class="container"><div class="section-heading"><span class="eyebrow">SIMPLE PROCESS</span><h2>${escapeHtml(docxText(172))}</h2></div><div class="steps">${docxSteps([173, 175, 177, 179, 181, 183])}</div>${docxP(185)}</div>`;
    }
    if (slug === 'home' && position === 5) {
      title = docxText(140);
      bodyHtml = `<div class="container split"><div class="corporate-photo"><img class="rounded-image" src="assets/corporate-team.jpg" alt="Illustrative workplace support imagery"></div><div><span class="eyebrow">FOR ORGANIZATIONS</span><h2>${escapeHtml(docxText(140))}</h2>${[141, 142, 143].map(docxP).join('')}<a class="btn btn-outline" href="corporate-care.html">Know More →</a></div><ul class="corporate-highlights"><li><span>♧</span><strong>${escapeHtml(docxText(157))}</strong></li><li><span>▣</span><strong>${escapeHtml(docxText(158))}</strong></li><li><span>♧</span><strong>${escapeHtml(docxText(159))}</strong></li><li><span>♡</span><strong>${escapeHtml(docxText(160))}</strong></li><li><span>♢</span><strong>${escapeHtml(docxText(161))}</strong></li></ul></div>`;
    }
    if (slug === 'home' && position === 6) { title = docxText(233); bodyHtml = `<div><h2>${escapeHtml(docxText(233))}</h2>${docxP(234)}</div>${section.bodyHtml.slice(section.bodyHtml.indexOf('<div class="actions">'))}`; }
    if (slug === 'about' && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, docxP(10), 'about-hero-copy');
    if (slug === 'about' && position === 1) bodyHtml = bodyHtml.replace(/(<div class="about-story-copy">[\s\S]*?<h3>[\s\S]*?<\/h3>)[\s\S]*?(<\/div>)/i, `$1${[11, 12, 13, 14, 16].map(docxP).join('')}$2`).replace(/(<aside class="about-purpose">[\s\S]*?<h3>[\s\S]*?<\/h3>)[\s\S]*?(<\/aside>)/i, `$1${docxP(15)}$2`);
    if (slug === 'about' && position === 2) bodyHtml = `<article><span class="about-icon">◎</span><div><h3>${escapeHtml(docxText(17))}</h3>${docxP(18)}</div></article><article><span class="about-icon">◉</span><div><h3>${escapeHtml(docxText(19))}</h3>${docxP(20)}</div></article>`;
    if (slug === 'about' && position === 3) bodyHtml = `<div class="about-section-heading"><h2>${escapeHtml(docxText(21))}</h2><p>The Principles That Guide Everything We Do</p></div><div class="about-values">${[[22, '♡'], [23, '♢'], [24, '♧'], [25, '⌂'], [26, '✧']].map(([index, icon]) => { const parts = docxText(Number(index)).split(': '); return `<article data-docx-source="${escapeHtml(docxText(Number(index)))}"><span hidden>${escapeHtml(docxText(Number(index)))}</span><span>${icon}</span><h3>${escapeHtml(parts[0])}</h3><p>${escapeHtml(parts.slice(1).join(': '))}</p></article>`; }).join('')}</div>`;
    if (slug === 'about' && position === 4) bodyHtml = `<div class="about-section-heading"><h2>Who We Support</h2><p>${escapeHtml(docxText(188))}</p></div><div class="about-support-grid">${[[189, 190, 'care-family.jpg'], [191, 192, 'care-at-home.jpg'], [193, 194, 'ywc-hospital-support.png'], [195, 196, 'ywc-postoperative-care.png'], [197, 198, 'ywc-elder-care.png'], [199, 200, 'ywc-corporate-support.png']].map(([heading, copy, image]) => `<article><div class="about-support-photo"><img src="assets/${image}" alt="${escapeHtml(docxText(Number(heading)))}"></div><h3>${escapeHtml(docxText(Number(heading)))}</h3>${docxP(Number(copy))}</article>`).join('')}</div>`;
    if (slug === 'about' && position === 5) bodyHtml = `<div class="about-section-heading"><h2>Why Choose YWC?</h2><p>${escapeHtml(docxText(123))}</p></div><div class="about-why-grid">${[[125, 126, '♧'], [127, 128, '♢'], [129, 130, '⚙'], [131, 132, '♡'], [133, 134, '✧'], [135, 136, '✓']].map(([heading, copy, icon]) => `<article><span>${icon}</span><h3>${escapeHtml(docxText(Number(heading)))}</h3>${docxP(Number(copy))}</article>`).join('')}</div>${docxP(137)}`;
    if (slug === 'about' && position === 6) { title = docxText(233); bodyHtml = `<div class="about-cta-photo"><img src="assets/care-at-home.jpg" alt="Family care support"></div><div><span class="eyebrow">LET'S MAKE CARE SIMPLER TOGETHER</span><h2>${escapeHtml(docxText(233))}</h2>${docxP(234)}<div class="actions"><a class="btn btn-primary" href="contact.html#enquiry">Request Assistance <span aria-hidden="true">→</span></a><a href="tel:+919952040006" class="btn btn-secondary">☎ Call Us</a></div></div>`; }
    if (['hospital-assistance', 'home-care', 'elder-care', 'pre-post-operative-care', 'travel-companion', 'healthcare-concierge'].includes(slug) && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, slug === 'hospital-assistance' ? `${docxP(32)}${docxP(33)}` : serviceDetailBody(slug).match(/<div class="info-card">([\s\S]*?)<\/div><aside/)?.[1]?.replace(/<ul class="checklist">[\s\S]*?<\/ul>/i, '') || '', 'hero-copy');
    if (['hospital-assistance', 'home-care', 'elder-care', 'pre-post-operative-care', 'travel-companion', 'healthcare-concierge'].includes(slug) && position === 1) bodyHtml = serviceDetailBody(slug);
    if (slug === 'corporate-care' && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, docxP(143), 'hero-copy');
    if (slug === 'corporate-care' && position === 1) bodyHtml = `<div class="container"><div class="section-heading"><span class="eyebrow">WHY IT MATTERS</span><h2>${escapeHtml(docxText(140))}</h2>${[141, 142, 143].map(docxP).join('')}</div><div class="two-cols"><article class="info-card"><h3>Benefits for Organizations</h3>${docxList([157, 158, 159, 160, 161])}</article><article class="info-card"><h3>Benefits for Employees</h3>${docxList([163, 164, 165, 166])}</article></div></div>`;
    if (slug === 'corporate-care' && position === 2) bodyHtml = `<div class="container"><div class="section-heading"><span class="eyebrow">VOLUNTEER INITIATIVE</span><h2>${escapeHtml(docxText(144))}</h2></div><div class="readable">${[145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155].map(index => index === 145 || index === 147 || index === 150 || index === 152 || index === 154 ? `<h3>${escapeHtml(docxText(index))}</h3>` : docxP(index)).join('')}</div></div>`;
    if (slug === 'corporate-care' && position === 3) { title = docxText(167); bodyHtml = `<div><h2>${escapeHtml(docxText(167))}</h2>${docxP(168)}${docxP(169)}</div>${section.bodyHtml.slice(section.bodyHtml.indexOf('<div class="actions">'))}`; }
    if (slug === 'volunteer' && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, `${docxP(140)}${docxP(143)}`, 'hero-copy');
    if (slug === 'volunteer' && position === 1) bodyHtml = `<div class="container"><div class="section-heading"><span class="eyebrow">HOW IT WORKS</span><h2>${escapeHtml(docxText(144))}</h2></div><div class="steps">${[145, 147, 150, 152, 154].map(index => `<div class="step"><span>${escapeHtml(docxText(index).match(/^Step (\d+)/)?.[1] || '')}</span><h3>${escapeHtml(docxText(index))}</h3>${docxP(index + 1)}${index === 147 ? docxP(149) : ''}</div>`).join('')}</div></div>`;
    if (slug === 'volunteer' && position === 2) bodyHtml = `<div class="container"><div class="section-heading"><span class="eyebrow">PROGRAM PRINCIPLES</span><h2>Benefits for Organizations and Employees</h2></div><div class="two-cols"><div class="info-card"><h3>Benefits for Organizations</h3>${docxList([157, 158, 159, 160, 161])}</div><div class="info-card"><h3>Benefits for Employees</h3>${docxList([163, 164, 165, 166])}</div></div></div>`;
    if (slug === 'volunteer' && position === 3) { title = docxText(167); bodyHtml = `<div><h2>${escapeHtml(docxText(167))}</h2>${docxP(168)}${docxP(169)}</div>${section.bodyHtml.slice(section.bodyHtml.indexOf('<div class="actions">'))}`; }
    if (slug === 'how-it-works' && position === 0) { title = docxText(172); accentText = undefined; bodyHtml = replaceHeroCopy(bodyHtml, docxP(172), 'hero-copy'); }
    if (slug === 'how-it-works' && position === 1) { title = docxText(172); bodyHtml = `<div class="container"><div class="section-heading"><span class="eyebrow">THE CARE JOURNEY</span><h2>${escapeHtml(docxText(172))}</h2></div><div class="steps">${docxSteps([173, 175, 177, 179, 181, 183])}</div>${docxP(185)}</div>`; }
    if (slug === 'faq' && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, docxP(212), 'hero-copy');
    if (slug === 'faq' && position === 1) { title = 'Frequently Asked Questions'; bodyHtml = docxFaqBody(); }
    if (slug === 'contact' && position === 0) bodyHtml = replaceHeroCopy(bodyHtml, docxP(234), 'hero-copy');
    if (slug === 'contact' && position === 1) {
      const formCard = bodyHtml.match(/(<div class="info-card">\s*<h2>Request Assistance[\s\S]*)$/i)?.[1] || '';
      bodyHtml = `<div class="container two-cols"><div class="info-card"><h2>${escapeHtml(docxText(233))}</h2>${docxP(234)}<h3>${escapeHtml(docxText(235))}</h3><p>${escapeHtml(docxText(236))}</p><p>${escapeHtml(docxText(237))}</p><p>${escapeHtml(docxText(238)).replace(/, /g, ',<br>')}</p><h3>${escapeHtml(docxText(239))}</h3>${docxP(240)}<h3>${escapeHtml(docxText(241))}</h3>${docxP(242)}${docxP(243)}<a class="btn btn-secondary" href="tel:+919952040006">☎ Call YWC</a></div>${formCard}</div>`;
    }
    return { ...section, title, accentText, bodyHtml };
  });
}

function stripMarkup(value: string) {
  return value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractStaticSections(html: string): StaticSection[] {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const token = /<\/?(section|div|article)\b[^>]*>/gi;
  const sections: StaticSection[] = [];
  let depth = 0;
  let start = -1;
  let tagName = '';
  for (const match of main.matchAll(token)) {
    const tokenText = match[0];
    const isClosing = tokenText.startsWith('</');
    if (!isClosing) {
      if (depth === 0) { start = match.index ?? -1; tagName = String(match[1]).toLowerCase(); }
      depth += 1;
      continue;
    }
    depth -= 1;
    if (depth !== 0 || start < 0) continue;
    const fragment = main.slice(start, (match.index ?? main.length) + tokenText.length);
    const openingTag = fragment.match(/^<(section|div|article)\b[^>]*>/i)?.[0] || `<${tagName}>`;
    const closingTag = `</${tagName}>`;
    const bodyHtml = fragment.slice(openingTag.length, fragment.endsWith(closingTag) ? -closingTag.length : undefined);
    const heading = fragment.match(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1] || `${tagName} ${sections.length + 1}`;
    const accentMatch = heading.match(/<em\b[^>]*>([\s\S]*?)<\/em>/i);
    const title = stripMarkup(accentMatch ? heading.replace(accentMatch[0], '') : heading).slice(0, 240);
    const accentText = accentMatch ? stripMarkup(accentMatch[1]).slice(0, 160) : undefined;
    const eyebrow = stripMarkup(fragment.match(/class=["'][^"']*eyebrow[^"']*["'][^>]*>([\s\S]*?)<\//i)?.[1] || '').slice(0, 200) || undefined;
    sections.push({ sectionKey: `static-section-${sections.length}`, eyebrow, title, accentText, bodyHtml, configJson: JSON.stringify({ openingTag, closingTag, source: 'pre-cms-static-html' }) });
    start = -1;
    tagName = '';
  }
  return sections;
}

async function seedStaticPages() {
  const workspaceRoot = resolve(__dirname, '..', '..');
  for (const [slug, source] of Object.entries(staticPageFiles)) {
    const filePath = resolve(workspaceRoot, source.file);
    if (!existsSync(filePath)) continue;
    const sections = applyDocxStaticContent(slug, extractStaticSections(readFileSync(filePath, 'utf8')));
    const page = await prisma.page.upsert({ where: { slug }, update: { title: source.title, status: 'PUBLISHED' }, create: { slug, title: source.title, status: 'PUBLISHED' } });
    await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
    for (const [position, sectionData] of sections.entries()) {
      await prisma.pageSection.create({ data: { pageId: page.id, sectionKey: sectionData.sectionKey, sectionType: 'STATIC_HTML', eyebrow: sectionData.eyebrow, title: sectionData.title, accentText: sectionData.accentText, bodyHtml: sectionData.bodyHtml, configJson: sectionData.configJson, position } });
    }
  }
}

async function seedDocxSemanticPages() {
  const footer = await prisma.page.upsert({ where: { slug: 'footer' }, update: { title: 'Website Footer', status: 'PUBLISHED' }, create: { slug: 'footer', title: 'Website Footer', status: 'PUBLISHED' } });
  await prisma.pageSection.deleteMany({ where: { pageId: footer.id } });
  const footerSection = await prisma.pageSection.create({ data: {
    pageId: footer.id, sectionKey: 'footer-content', sectionType: 'FOOTER', title: 'Website Footer',
    bodyHtml: `${escapeHtml(docxText(248))}<br>${escapeHtml(docxText(249))}`, configJson: JSON.stringify({ source: 'docx', copyright: docxText(262), disclaimer: docxText(263), contact: docxText(260), location: docxText(261) }), position: 0
  } });
  await prisma.sectionItem.createMany({ data: [251, 252, 253, 254, 255, 256, 257, 258, 259].map((index, position) => ({ sectionId: footerSection.id, itemType: 'LINK', title: docxText(index), bodyHtml: '', linkUrl: ['index.html', 'about.html', 'services.html', 'corporate-care.html', 'volunteer.html', 'faq.html', 'contact.html', 'privacy.html', 'terms.html'][position], position })) });

  const commitment = await prisma.page.upsert({ where: { slug: 'commitment' }, update: { title: 'Our Commitment to Care', status: 'PUBLISHED' }, create: { slug: 'commitment', title: 'Our Commitment to Care', status: 'PUBLISHED' } });
  await prisma.pageSection.deleteMany({ where: { pageId: commitment.id } });
  await prisma.pageSection.create({ data: { pageId: commitment.id, sectionKey: 'commitment', sectionType: 'RICH_TEXT', eyebrow: 'OUR COMMITMENT TO CARE', title: docxText(203), bodyHtml: [204, 205, 206, 207, 208].map(docxP).join(''), position: 0 } });

  const audiences = await prisma.page.upsert({ where: { slug: 'who-we-support' }, update: { title: docxText(187), status: 'PUBLISHED' }, create: { slug: 'who-we-support', title: docxText(187), status: 'PUBLISHED' } });
  await prisma.pageSection.deleteMany({ where: { pageId: audiences.id } });
  const audienceSection = await prisma.pageSection.create({ data: { pageId: audiences.id, sectionKey: 'audiences', sectionType: 'CARD_GRID', title: docxText(187), bodyHtml: docxP(188), position: 0 } });
  await prisma.sectionItem.createMany({ data: [[189, 190], [191, 192], [193, 194], [195, 196], [197, 198], [199, 200]].map(([titleIndex, bodyIndex], position) => ({ sectionId: audienceSection.id, itemType: 'CARD', title: docxText(titleIndex), bodyHtml: docxText(bodyIndex), position })) });
}

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@ywc.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({ where: { email: adminEmail }, update: { passwordHash, isActive: true }, create: { name: 'YWC Administrator', email: adminEmail, passwordHash } });

  for (const pageData of pages) {
    const page = await prisma.page.upsert({ where: { slug: pageData.slug }, update: { title: pageData.title, status: 'PUBLISHED' }, create: { slug: pageData.slug, title: pageData.title, status: 'PUBLISHED' } });
    await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
    for (const [position, sectionData] of pageData.sections.entries()) {
      const section = await prisma.pageSection.create({ data: { pageId: page.id, sectionKey: sectionData.sectionKey, sectionType: sectionData.sectionType, eyebrow: sectionData.eyebrow, title: sectionData.title, accentText: sectionData.accentText, bodyHtml: sectionData.bodyHtml, imagePath: sectionData.imagePath, theme: sectionData.theme, configJson: sectionData.configJson, position } });
      if (sectionData.items?.length) await prisma.sectionItem.createMany({ data: sectionData.items.map((entry, itemPosition) => ({ sectionId: section.id, itemType: entry.itemType || 'CARD', title: entry.title, bodyHtml: entry.bodyHtml, icon: entry.icon, linkUrl: entry.linkUrl, imagePath: entry.imagePath, position: itemPosition })) });
    }
  }

  for (const [position, fallbackService] of services.entries()) {
    const serviceData = docxServiceRecords.find(entry => entry.slug === fallbackService.slug) || fallbackService;
    const service = await prisma.service.upsert({ where: { slug: serviceData.slug }, update: { title: serviceData.title, shortDescriptionHtml: serviceData.short, descriptionHtml: serviceData.description, heroImagePath: serviceData.image, position, isVisible: true }, create: { slug: serviceData.slug, title: serviceData.title, shortDescriptionHtml: serviceData.short, descriptionHtml: serviceData.description, heroImagePath: serviceData.image, position } });
    await prisma.serviceBullet.deleteMany({ where: { serviceId: service.id } });
    await prisma.serviceBullet.createMany({ data: serviceData.bullets.map((text, bulletPosition) => ({ serviceId: service.id, text, position: bulletPosition })) });
  }

  const docxFaqs = docxFaqIndexes.map(index => [docxText(index), docxText(index + 1)] as [string, string]);
  await prisma.faq.deleteMany();
  for (const [position, [question, answer]] of docxFaqs.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question } });
    if (existing) await prisma.faq.update({ where: { id: existing.id }, data: { answerHtml: answer, position, isVisible: true } });
    else await prisma.faq.create({ data: { question, answerHtml: answer, position, isVisible: true } });
  }

  await seedStaticPages();
  await seedDocxSemanticPages();

  await prisma.siteSetting.upsert({ where: { key: 'enquiry_to_email' }, update: { value: process.env.ENQUIRY_TO_EMAIL || 'dhisoftai@gmail.com' }, create: { key: 'enquiry_to_email', value: process.env.ENQUIRY_TO_EMAIL || 'dhisoftai@gmail.com' } });
  await prisma.siteSetting.upsert({ where: { key: 'brand_name' }, update: { value: 'Yes We Care' }, create: { key: 'brand_name', value: 'Yes We Care' } });
  console.log(JSON.stringify({ seeded: true, pages: await prisma.page.count(), staticPages: Object.keys(staticPageFiles).length, services: services.length, faqs: docxFaqs.length, adminEmail }));
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
