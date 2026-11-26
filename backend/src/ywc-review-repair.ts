import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'node:fs';
import { sanitizeContentHtml } from './admin.controller';

export const serviceOrder = [
  'elder-care', 'hospital-assistance', 'home-care', 'pre-post-operative-care',
  'healthcare-concierge', 'travel-companion'
];

export const conciergeList = [
  'Our Healthcare Concierge Services Include:',
  'Doctor Appointment Coordination: Assistance with identifying suitable healthcare providers and scheduling consultations.',
  'Hospital Coordination: Support with hospital visits, admission and discharge-related arrangements.',
  'Diagnostic Test Coordination: Assistance with scheduling laboratory tests, scans and other diagnostic appointments.',
  'Medical Records Assistance: Help organizing and coordinating medical reports, prescriptions and healthcare documents.',
  'Second Opinion Coordination: Assistance in arranging consultations with other qualified medical professionals when requested.',
  'Follow-Up Appointment Management: Help coordinating follow-up consultations and ongoing healthcare appointments.',
  'Treatment Journey Coordination: Assistance in organizing multiple healthcare-related appointments and requirements.',
  'Family Healthcare Support: Coordination assistance for family members managing healthcare needs for parents and loved ones.'
];

export function restoreServiceHero(html: string) {
  if (html.includes('class="container hero-grid"')) return html;
  const start = /^(\s*)<div>(\s*)<div>(\s*)<span>(SERVICES[^<]*)<\/span>/;
  const actions = /<div>(\s*)<a (href="contact\.html#enquiry")>([\s\S]*?)<\/a>(\s*)<a (href="tel:\+919952040006")>/;
  const media = /<div>(\s*)<img (src="assets\/care-family\.jpg" alt="[^"]*")\s*\/?>(\s*)<\/div>(\s*)<\/div>(\s*)$/;
  if (!start.test(html) || !actions.test(html) || !media.test(html)) {
    throw new Error('Saved hero markup differs from the expected stripped layout.');
  }
  return html
    .replace(start, '$1<div class="container hero-grid">$2<div class="hero-copy">$3<span class="eyebrow">$4</span>')
    .replace(actions, (_match, space, link, label, gap, phone) =>
      '<div class="actions">' + space + '<a class="btn btn-primary" ' + link + '>' +
      label.replace('<span>→</span>', '<span aria-hidden="true">→</span>') +
      '</a>' + gap + '<a ' + phone + ' class="btn btn-secondary">')
    .replace(media, '<div class="hero-media">$1<img $2 loading="eager">$3</div>$4</div>$5');
}

function escapeHtml(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function checklist(heading: string, items: string[]) {
  return '<p class="docx-lead">' + heading + '</p><ul class="checklist">' +
    items.map(item => '<li>' + item + '</li>').join('') + '</ul>';
}

export function restoreServiceChecklist(html: string) {
  if (html.includes('class="two-cols"')) return html;
  const pattern = /^<div><div><span>(WHAT WE COORDINATE)<\/span>(<h2>[^<]+<\/h2>)<\/div><div><div>([\s\S]+?)<\/div><aside>([\s\S]+)<\/aside><\/div><\/div>$/;
  const match = html.trim().match(pattern);
  if (!match) throw new Error('Saved assistance list differs from the expected stripped layout.');
  const [, eyebrow, heading, body, aside] = match;
  const paragraphs = [...body.matchAll(/<p>(.*?)<\/p>/gs)];
  const [lead, ...entries] = paragraphs.map(entry => entry[1]);
  if (paragraphs.map(entry => entry[0]).join('') !== body || !lead || entries.length !== 6 ||
      entries.some(entry => !/^•\s+/.test(entry))) {
    throw new Error('Unexpected assistance list contents. No changes were applied.');
  }
  return '<div class="container"><div class="section-heading"><span class="eyebrow">' + eyebrow + '</span>' +
    heading + '</div><div class="two-cols"><div class="info-card">' +
    checklist(lead, entries.map(entry => entry.replace(/^•\s+/, ''))) + '</div><aside class="info-card highlight">' +
    aside.replace('<a href=', '<a class="btn btn-primary" href=')
      .replace('<span>→</span>', '<span aria-hidden="true">→</span>') + '</aside></div></div>';
}

export function applyConciergeChecklist(html: string) {
  const pattern = /(<div class="two-cols"><div class="info-card">)[\s\S]+?(<\/div><aside class="info-card highlight">)/;
  if (!pattern.test(html)) throw new Error('Concierge detail section layout did not match.');
  const [heading, ...items] = conciergeList.map(escapeHtml);
  return html.replace(pattern, (_match, open, close) => open + checklist(heading, items) + close);
}

export function reorderServiceCards(html: string) {
  const entries = [...html.matchAll(/<a class="service-card" href="([a-z-]+)\.html">[\s\S]*?<\/a>/g)];
  if (entries.length !== serviceOrder.length || new Set(entries.map(entry => entry[1])).size !== serviceOrder.length ||
      serviceOrder.some(slug => !entries.some(entry => entry[1] === slug))) {
    throw new Error('Service card list differs from the six reviewed services.');
  }
  const cardsBySlug = new Map(entries.map(entry => [entry[1], entry[0]]));
  let position = 0;
  return html.replace(/<a class="service-card" href="[a-z-]+\.html">[\s\S]*?<\/a>/g,
    () => cardsBySlug.get(serviceOrder[position++])!);
}

function updateAboutHeading(html: string) {
  const pattern = /(<h1>)About YWC(?: Care)?(<br\s*\/?>)/;
  if (!pattern.test(html)) throw new Error('About heading differs from the reviewed wording.');
  return html.replace(pattern, '$1About YWC Care$2');
}

export function shortenAddress(html: string) {
  return html.replace(/Canyon Workspace,[\s]*(?:<br\s*\/?>[\s]*)?Near Idli Vada Sambar Restaurant,[\s]*(?:<br\s*\/?>[\s]*)?/g, '');
}

function validateRepair(original: string, revised: string, label: string, preserveText: boolean) {
  if (!revised.trim()) throw new Error('No content generated for ' + label);
  if (preserveText) {
    const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/•\s*/g, '').replace(/\s+/g, ' ').trim();
    if (text(original) !== text(revised)) throw new Error('Layout repair would change saved text in ' + label);
  }
  if (sanitizeContentHtml(revised) !== sanitizeContentHtml(sanitizeContentHtml(revised))) {
    throw new Error('HTML did not pass a stable sanitization check for ' + label);
  }
}

async function runRepair() {
  const apply = process.argv[2] === '--apply';
  const backupPath = process.argv[3];
  if ((process.argv.length > 2 && !apply) || (apply && !backupPath)) {
    throw new Error('Run with no arguments to preview, or pass --apply followed by a new backup filename.');
  }

  const db = new PrismaClient();
  try {
    await db.$transaction(async tx => {
      const rows = await tx.pageSection.findMany({
        where: {
          page: { slug: { in: [...serviceOrder, 'about', 'services', 'contact'] } },
          sectionKey: { in: ['static-section-0', 'static-section-1'] }
        },
        include: { page: { select: { slug: true } } }
      });
      const services = await tx.service.findMany({ where: { slug: { in: serviceOrder } } });
      if (services.length !== serviceOrder.length) throw new Error('Expected six service records.');

      const changes = [];
      for (const slug of serviceOrder) {
        const row = rows.find(section => section.page.slug === slug && section.sectionKey === 'static-section-0');
        if (!row?.bodyHtml) throw new Error('Missing hero for ' + slug);
        const bodyHtml = restoreServiceHero(row.bodyHtml);
        validateRepair(row.bodyHtml, bodyHtml, slug + ' hero', true);
        changes.push({ row, data: { bodyHtml } });
      }
      for (const slug of ['pre-post-operative-care', 'travel-companion', 'healthcare-concierge', 'services', 'contact', 'about']) {
        const sectionKey = slug === 'about' ? 'static-section-0' : 'static-section-1';
        const row = rows.find(section => section.page.slug === slug && section.sectionKey === sectionKey);
        if (!row?.bodyHtml) throw new Error('Missing reviewed section for ' + slug);
        let bodyHtml: string;
        let title: string | undefined;
        switch (slug) {
          case 'about':
            if (!/^About YWC(?: Care)?(?:\s*Care That Connects)?$/.test(row.title || '')) {
              throw new Error('About title was edited after the review.');
            }
            title = 'About YWC Care';
            bodyHtml = updateAboutHeading(row.bodyHtml);
            break;
          case 'contact':
            bodyHtml = shortenAddress(row.bodyHtml);
            if (bodyHtml === row.bodyHtml && /Canyon Workspace|Near Idli Vada Sambar Restaurant/i.test(bodyHtml)) {
              throw new Error('Contact address formatting has changed.');
            }
            break;
          case 'services':
            bodyHtml = reorderServiceCards(row.bodyHtml);
            break;
          case 'healthcare-concierge':
            bodyHtml = applyConciergeChecklist(row.bodyHtml);
            break;
          default:
            bodyHtml = restoreServiceChecklist(row.bodyHtml);
        }
        validateRepair(row.bodyHtml, bodyHtml, slug, ['pre-post-operative-care', 'travel-companion'].includes(slug));
        changes.push({ row, data: { bodyHtml, ...(title === undefined ? {} : { title }) } });
      }

      const pending = changes.filter(({ row, data }) =>
        row.bodyHtml !== data.bodyHtml || ('title' in data && row.title !== data.title));
      const reordered = services.filter(service => service.position !== serviceOrder.indexOf(service.slug));
      console.log(JSON.stringify({
        mode: apply ? 'apply' : 'preview',
        sections: pending.map(({ row }) => row.page.slug + '/' + row.sectionKey),
        servicesToReorder: reordered.map(service => service.slug)
      }, null, 2));
      if (!apply || (!pending.length && !reordered.length)) return;

      writeFileSync(backupPath, JSON.stringify({
        sections: pending.map(({ row }) => row),
        services: reordered.map(({ id, slug, position, updatedAt }) => ({ id, slug, position, updatedAt }))
      }, null, 2), { flag: 'wx', mode: 0o600 });
      for (const { row, data } of pending) {
        const result = await tx.pageSection.updateMany({ where: { id: row.id, updatedAt: row.updatedAt }, data });
        if (result.count !== 1) throw new Error('Concurrent section edit detected. Transaction rolled back.');
      }
      for (const service of reordered) {
        const result = await tx.service.updateMany({
          where: { id: service.id, updatedAt: service.updatedAt },
          data: { position: serviceOrder.indexOf(service.slug) }
        });
        if (result.count !== 1) throw new Error('Concurrent service edit detected. Transaction rolled back.');
      }
    }, { timeout: 30_000 });
  } finally {
    await db.$disconnect();
  }
}

if (require.main === module) {
  runRepair().catch(error => {
    console.error(error instanceof Error ? error.message : 'YWC repair failed');
    process.exitCode = 1;
  });
}
