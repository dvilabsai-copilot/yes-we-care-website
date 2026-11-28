INSERT INTO "SiteSetting" ("id", "key", "value", "updatedAt")
VALUES ('ywc-public-contact-email', 'contact_email', 'yeswecare.hospital.home@gmail.com', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
