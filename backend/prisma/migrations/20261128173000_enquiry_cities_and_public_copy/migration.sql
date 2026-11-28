-- Adjust the original public wording and form fields while preserving other CMS edits.
DO $$
DECLARE
  change RECORD;
BEGIN
  FOR change IN SELECT * FROM (VALUES
    ('contact', 'Explore how the enquiry experience would work on the live website.', 'Tell us what assistance you need. Our care coordination team will get in touch.'),
    ('contact', 'City / Locality *<input name="city" required placeholder="Where is help needed?">', 'City / Location *<select name="city" required><option value="">Choose a city</option><option value="Chennai">Chennai</option><option value="Hyderabad">Hyderabad</option><option value="Bengaluru">Bengaluru</option><option value="Cochin">Cochin</option></select>'),
    ('contact', 'Please avoid entering sensitive medical details into this demo form.', 'Tell us what support you need. Please leave out sensitive medical details.'),
    ('contact', 'Preview Enquiry (Demo Only) →', 'Submit Enquiry →'),
    ('contact', 'Demo only: this static website does not send or store your enquiry. Submitting an enquiry is not a confirmed booking; service confirmation depends on scope, charges and availability. Please call YWC to request assistance.', 'Your enquiry will be sent to the Yes We Care team. Submitting an enquiry is not a confirmed booking; service confirmation depends on scope, charges and availability.'),
    ('privacy', 'This draft must be reviewed and approved before the public website goes live.', 'This page is pending final approval.'),
    ('terms', 'This draft must be reviewed and approved before the public website goes live.', 'This page is pending final approval.'),
    ('privacy', 'The static demonstration form does not transmit, collect or store submissions.', 'For questions about information submitted through the enquiry form, contact Yes We Care.'),
    ('terms', ' No contractual terms have been approved for publication in this demonstration.', '')
  ) AS changes(page_slug, old_copy, new_copy)
  LOOP
    UPDATE "PageSection" AS section
    SET "bodyHtml" = replace(section."bodyHtml", change.old_copy, change.new_copy),
        "updatedAt" = CURRENT_TIMESTAMP
    FROM "Page" AS page
    WHERE section."pageId" = page."id"
      AND page."slug" = change.page_slug
      AND strpos(section."bodyHtml", change.old_copy) > 0;
  END LOOP;
END $$;

UPDATE "SectionItem" AS item
SET "bodyHtml" = 'Our care coordination team uses the details you share to respond to your enquiry.',
    "updatedAt" = CURRENT_TIMESTAMP
FROM "PageSection" AS section
JOIN "Page" AS page ON page."id" = section."pageId"
WHERE item."sectionId" = section."id"
  AND page."slug" = 'request-assistance'
  AND section."sectionKey" = 'request-help'
  AND item."bodyHtml" = 'Your information is treated with compassion during this local preview.';
