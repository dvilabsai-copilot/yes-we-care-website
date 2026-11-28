-- Remove the duplicate text used to track the original DOCX. Each card already
-- contains the same copy in its heading and paragraph.
UPDATE "PageSection" AS section
SET "bodyHtml" = regexp_replace(
      section."bodyHtml",
      '(<article data-docx-source="[^"]*">)<span hidden>[^<]*</span><span>',
      '\1<span aria-hidden="true">',
      'g'
    ),
    "updatedAt" = CURRENT_TIMESTAMP
FROM "Page" AS page
WHERE section."pageId" = page."id"
  AND page."slug" = 'about'
  AND section."sectionKey" = 'static-section-3'
  AND section."bodyHtml" LIKE '%<span hidden>%';
