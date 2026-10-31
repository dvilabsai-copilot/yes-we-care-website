# Homepage visual audit

Date: 2026-11-01

## Scope

The homepage was compared with the approved 900×1600 reference layout at the local URL `http://127.0.0.1:5173/index.html`. The homepage-only CSS is scoped to `body.homepage`, so the existing inner-page layouts remain unchanged.

## Correction loop

| Capture | Browser content size | Result |
| --- | ---: | --- |
| `iteration-00` | 884×4959 | Baseline; content was complete but far too vertically expanded and lacked the approved shortcut strip/card composition. |
| `iteration-01` | 884×1920 | Added the approved section order, floating service shortcuts, compact service tiles, horizontal process row, corporate highlights, and light CTA treatment. |
| `iteration-02` | 884×1732 | Tightened hero copy, reduced the Why section to the approved four visible points, improved image crops, and corrected the corporate grid. |
| `iteration-03` | 884×1661 | Final desktop pass before direct reference-content alignment. |
| `iteration-04` | 884×1656 | Aligned the approved hero, Why Choose, Services, How It Works, Corporate Care, CTA, and five-column footer composition. |
| `iteration-05` | 884×1656 | Final cleanup: varied clean image crops, added testimonial dots, and replaced the plain location block with a map-style tile. |

The final desktop capture is materially closer to the approved structure and wording while retaining the local supplied assets. The browser’s vertical scrollbar reduces the content width from the requested 900px viewport to 884px.

## Responsive checks

Captures were taken at 1440px, 1024px, 768px, and 390px widths. The 390px pass exposed and then resolved a corporate-care grid cascade issue; the final mobile version stacks the corporate image, copy, and highlights without horizontal overflow.

Artifacts are in `visual-tests/`:

- `final-desktop.jpg` / `final-desktop.png`
- `final-mobile.jpg` / `final-mobile.png`
- `responsive-1440.jpg`, `responsive-1024.jpg`, `responsive-768.jpg`, `responsive-390.jpg`
- `iteration-00` through `iteration-04`

## Validation

- All 16 top-level HTML pages returned HTTP 200 from port 5173.
- `js/main.js` passed `node --check`.
- All top-level HTML files parsed successfully with Python’s `HTMLParser`.
- Homepage service links and existing navigation routes were preserved.
- No new backend, form submission, email address, or unsupported service guarantee was introduced.

## Remaining reference differences

- The approved mockup uses six different service-card photos; the repository currently contains only three care/workplace image assets, so the homepage uses clean varied crops of the supplied family-care asset.
- The footer now has a map-style Chennai tile. The approved mockup’s email address remains omitted because it is not confirmed in the current content set; the confirmed phone/address are preserved.
