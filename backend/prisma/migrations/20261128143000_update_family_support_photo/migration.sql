-- Match the existing card image so this migration preserves other CMS edits.
UPDATE "PageSection" AS section
SET "bodyHtml" = replace(
      section."bodyHtml",
      'src="assets/ywc-elder-care.png" alt="Families Living Away from Their Parents"',
      'src="assets/ywc-process-consultation.png" alt="Care coordinator reviewing a plan with an older couple"'
    ),
    "updatedAt" = CURRENT_TIMESTAMP
FROM "Page" AS page
WHERE section."pageId" = page."id"
  AND page."slug" = 'about'
  AND section."sectionKey" = 'static-section-4'
  AND strpos(section."bodyHtml", 'src="assets/ywc-elder-care.png" alt="Families Living Away from Their Parents"') > 0;
