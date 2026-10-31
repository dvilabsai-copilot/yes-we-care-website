# YWC Testing Summary

## Automated checks

| Check | Result | Evidence |
| --- | --- | --- |
| Active HTML page count | PASS | 16 top-level HTML pages found and checked. |
| HTTP serving | PASS | All 16 pages returned HTTP 200 from `http://127.0.0.1:5173/`. |
| Internal links | PASS | All local `href` targets resolve to existing files; telephone and external links were excluded from local-file checks. |
| Service cards | PASS | Homepage and Services page each link to all six correct service detail pages. |
| Service bullet coverage | PASS | Every source-listed bullet was represented on all six service pages. |
| Pre/post priority correction | PASS | `pre-post-operative-care.html` contains separate Before Surgery and After Surgery sections with all source-listed arrangements. |
| Enquiry form | PASS | Six core service options plus Corporate Partnership are present; no medical-record field was added. |
| Demo-only behavior copy | PASS | The form states that it does not send/store enquiries and that an enquiry is not a confirmed booking. |
| FAQ accordion structure | PASS | 11 native `<details>` accordions are present, including the booking-confirmation clarification. |
| Phone/address | PASS | Phone links and the full Chennai office address are present. |
| Local assets | PASS | All referenced local CSS, JavaScript and image assets resolve. |
| JavaScript syntax | PASS | Bundled Node `--check` completed with exit code 0 for `js/main.js`. |
| HTML parsing | PASS | Python HTMLParser completed for all 16 pages without parse errors. |
| Unsupported active claims | PASS | No active-page claims for verified providers, certifications, 24/7 service, guaranteed outcomes, emergency response or direct treatment were found. FAQ `free` and medical-boundary language are source/clarification contexts. |

## Browser checks

The local homepage was rendered through Chrome at `http://127.0.0.1:5173/index.html`. Five visual correction iterations were captured at the approved desktop width, followed by responsive captures at 1440px, 1024px, 768px, and 390px. The final 390px pass verified the responsive menu layout and corrected the corporate-care grid so it stacks without horizontal overflow. No form was submitted and no external data was transmitted. See [`homepage-visual-audit.md`](homepage-visual-audit.md) and the `visual-tests/` artifacts for the evidence set.

## Remaining risks

- The retained `original-stitch-export` design-reference files contain legacy unsupported claims; they are not active navigation targets but should be excluded from public deployment or separately corrected.
- Privacy Policy and Terms & Conditions remain legal/client approval drafts.
- Branding tagline reconciliation remains pending client approval.

