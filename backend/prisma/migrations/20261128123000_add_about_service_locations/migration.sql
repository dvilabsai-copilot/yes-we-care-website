INSERT INTO "PageSection" (
  "id", "pageId", "sectionKey", "sectionType", "title", "bodyHtml", "position", "configJson", "updatedAt"
)
SELECT
  'ywc-about-service-locations', page."id", 'static-section-7', 'STATIC_HTML', 'Where We Operate',
  '<div><h2>Where We Operate</h2><p>Yes We Care coordinates support in these cities.</p></div><ul><li>Chennai</li><li>Hyderabad</li><li>Bengaluru</li><li>Cochin</li></ul>',
  COALESCE((SELECT MAX(section."position") FROM "PageSection" section WHERE section."pageId" = page."id"), -1) + 1,
  '{"openingTag":"<section class=\"about-section service-locations\" id=\"service-locations\">","closingTag":"</section>","source":"service-coverage"}',
  CURRENT_TIMESTAMP
FROM "Page" page
WHERE page."slug" = 'about'
  AND EXISTS (
    SELECT 1 FROM "PageSection" section
    WHERE section."pageId" = page."id" AND section."sectionType" = 'STATIC_HTML'
  )
ON CONFLICT ("pageId", "sectionKey") DO NOTHING;
