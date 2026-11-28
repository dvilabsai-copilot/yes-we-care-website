-- Store the photos with their sections so rearranging cards cannot swap their images.
WITH replacements AS (
  SELECT section."id", CASE section."sectionKey"
    WHEN 'static-section-0' THEN replace(section."bodyHtml",
      'src="assets/care-family.jpg" alt="Care coordinator supporting an elderly couple"',
      'src="assets/ywc-hero-family.png" alt="Care coordinator supporting an elderly couple"')
    WHEN 'static-section-1' THEN replace(section."bodyHtml",
      'src="assets/care-at-home.jpg" alt="Care coordinator supporting an older adult"',
      'src="assets/ywc-elder-care.png" alt="Care coordinator supporting an older adult"')
    WHEN 'static-section-4' THEN replace(replace(replace(replace(section."bodyHtml",
      'src="assets/care-family.jpg" alt="Working Professionals"',
      'src="assets/ywc-contact-support.png" alt="Care coordinator speaking by phone"'),
      'src="assets/care-at-home.jpg" alt="Senior Citizens"',
      'src="assets/ywc-home-care.png" alt="Senior Citizens"'),
      'src="assets/ywc-hospital-support.png" alt="Patients and Their Families"',
      'src="assets/ywc-postoperative-care.png" alt="Patients and Their Families"'),
      'src="assets/ywc-postoperative-care.png" alt="Individuals Recovering at Home"',
      'src="assets/ywc-request-consultation.png" alt="Individuals Recovering at Home"')
    WHEN 'static-section-6' THEN replace(section."bodyHtml",
      'src="assets/care-at-home.jpg" alt="Family care support"',
      'src="assets/ywc-travel-companion.png" alt="Family care support"')
    ELSE section."bodyHtml"
  END AS "bodyHtml"
  FROM "PageSection" AS section
  JOIN "Page" AS page ON page."id" = section."pageId"
  WHERE page."slug" = 'about'
    AND section."sectionKey" IN ('static-section-0', 'static-section-1', 'static-section-4', 'static-section-6')
)
UPDATE "PageSection" AS section
SET "bodyHtml" = replacements."bodyHtml", "updatedAt" = CURRENT_TIMESTAMP
FROM replacements
WHERE section."id" = replacements."id"
  AND section."bodyHtml" IS DISTINCT FROM replacements."bodyHtml";
