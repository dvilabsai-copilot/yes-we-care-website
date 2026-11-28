-- Update the known legacy image tags while preserving any separately edited images.
DO $$
DECLARE
  photo RECORD;
BEGIN
  FOR photo IN SELECT * FROM (VALUES
    ('home', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/approved-family-wide.png" alt="Care coordinator with an older couple on a sofa"'),
    ('services', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-services-hero.webp" alt="Care coordinator discussing support with a father and daughter"'),
    ('hospital-assistance', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-hospital-support.png" alt="Care aide helping an older patient walk in hospital"'),
    ('home-care', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-home-care-hero.webp" alt="Care aide helping an older woman in her kitchen"'),
    ('elder-care', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-elder-care-hero.webp" alt="Care companion walking with an older couple in a garden"'),
    ('pre-post-operative-care', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-recovery-hero.webp" alt="Care coordinator discussing recovery arrangements with a man and his sister"'),
    ('travel-companion', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-travel-hero.webp" alt="Travel companion with an older woman and her luggage at a station"'),
    ('healthcare-concierge', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-concierge.png" alt="Healthcare concierge coordinating care from a desk"'),
    ('how-it-works', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-journey-hero.webp" alt="Daughter and father discussing care arrangements over a video call"'),
    ('corporate-care', 'static-section-0', 'src="assets/corporate-team.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-corporate-intro.png" alt="Colleagues discussing employee care support at work"'),
    ('volunteer', 'static-section-0', 'src="assets/corporate-team.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-volunteer-support.png" alt="Volunteers assembling supplies together"'),
    ('contact', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-contact-hero.webp" alt="Care coordination staff ready to answer calls"'),
    ('faq', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-faq-support.png" alt="Care coordinator answering an older woman''s questions"'),
    ('privacy', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-privacy-hero.webp" alt="Closed laptop and document folder on a care office desk"'),
    ('terms', 'static-section-0', 'src="assets/care-family.jpg" alt="Illustrative YWC family care website design"', 'src="assets/ywc-terms-hero.webp" alt="Two people reviewing a service agreement together"'),
    ('home', 'static-section-2', 'src="assets/care-family.jpg" alt="Elder care assistance coordination"', 'src="assets/approved-elder.png" alt="Elder care assistance coordination"'),
    ('home', 'static-section-2', 'src="assets/care-family.jpg" alt="Hospital assistance coordination"', 'src="assets/approved-hospital.png" alt="Hospital assistance coordination"'),
    ('home', 'static-section-2', 'src="assets/care-family.jpg" alt="Home care assistance coordination"', 'src="assets/ywc-home-care-card.webp" alt="Home care assistance coordination"'),
    ('home', 'static-section-2', 'src="assets/care-family.jpg" alt="Pre and post-operative care coordination"', 'src="assets/approved-care-team.png" alt="Pre and post-operative care coordination"'),
    ('home', 'static-section-2', 'src="assets/care-family.jpg" alt="Travel companion assistance"', 'src="assets/approved-travel.png" alt="Travel companion assistance"'),
    ('home', 'static-section-2', 'src="assets/care-family.jpg" alt="Healthcare concierge coordination"', 'src="assets/ywc-concierge-card.webp" alt="Healthcare concierge coordination"'),
    ('home', 'static-section-3', 'src="assets/care-at-home.jpg" alt="Illustrative family care imagery"', 'src="assets/approved-why-wide.png" alt="Illustrative family care imagery"'),
    ('home', 'static-section-5', 'src="assets/corporate-team.jpg" alt="Illustrative workplace support imagery"', 'src="assets/approved-corporate-wide.png" alt="Illustrative workplace support imagery"')
  ) AS photos(page_slug, section_key, old_image, new_image)
  LOOP
    UPDATE "PageSection" AS section
    SET "bodyHtml" = replace(section."bodyHtml", photo.old_image, photo.new_image),
        "updatedAt" = CURRENT_TIMESTAMP
    FROM "Page" AS page
    WHERE section."pageId" = page."id"
      AND page."slug" = photo.page_slug
      AND section."sectionKey" = photo.section_key
      AND strpos(section."bodyHtml", photo.old_image) > 0;
  END LOOP;
END $$;

UPDATE "PageSection" AS section
SET "imagePath" = 'assets/ywc-request-hero.webp', "updatedAt" = CURRENT_TIMESTAMP
FROM "Page" AS page
WHERE section."pageId" = page."id"
  AND page."slug" = 'request-assistance'
  AND section."sectionKey" = 'hero'
  AND section."imagePath" = 'assets/ywc-request-consultation.png';
