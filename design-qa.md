# Design QA — Field Notes homepage

## Reference truth

- Selected reference: `/Users/mberlanga/.codex/generated_images/01a002c9-1248-7201-a54b-7bcd73a3d8a8/exec-29026f0b-20fe-4d8b-90cb-cf7dec54f2b9.png`
- Saved QA copy: `design-qa/source-design.png`
- Reference dimensions: 1487 × 1058 px
- Compared state: homepage at the top of the page, light theme, desktop navigation visible, mobile menu closed

## Implementation capture

- URL: `http://127.0.0.1:5173/`
- Browser viewport: 1440 × 1024 CSS px
- Final capture: `design-qa/implementation-desktop-final.png` (1440 × 1024 px)
- Source and implementation were each normalized to 1440 × 1024 for comparison.

## Comparison inputs

- Full viewport, source left / implementation right: `design-qa/source-vs-implementation.png`
- Featured-note crop, source left / implementation right: `design-qa/feature-source-vs-implementation.png`
- Normalized source: `design-qa/source-normalized.png`
- Normalized implementation: `design-qa/implementation-normalized.png`

The combined comparison was visually inspected after the final capture. The implementation matches the reference's warm paper palette, editorial serif hierarchy, quiet navigation, two-column opening, featured-note composition, exact forecasting chart, margin reflection, ruled sections, and dense experience row.

## Iterations and findings

1. The first pass placed the featured section and Experience fold too low. The desktop grid, main-column width, opening height, featured-section height, chart dimensions, and vertical spacing were adjusted to the measured reference geometry.
2. The next comparison exposed a P2 mismatch: the featured article CTA inherited the body ink color instead of the reference's rust accent. The overly broad anchor color rule was removed and the final capture was regenerated.
3. Final combined review found no remaining P0, P1, or P2 visual issues. Minor P3 variation is limited to platform font rasterization and browser scrollbar treatment.

## Functional and responsive QA

- Desktop homepage: no horizontal overflow and no console warnings or errors.
- Content integrity: 5 experience entries, 4 featured projects, 6 public projects, 4 research themes, 2 education records, 6 skill groups, and 3 notes are present.
- Responsive checks: 390 × 844 and 320 × 844 viewports; no document overflow; the wide chart scrolls within its own labeled evidence region.
- Mobile navigation: menu opens with correct `aria-expanded` state, keeps the intended link order, closes after navigation, and lands on the selected section.
- Route regressions checked: USD/MXN article route and Interactive CV game route both render; article links back to the legacy Writing and Education anchors remain valid.
- Validation: `npm run build`, `npm run lint`, and `git diff --check` pass.

## Final result

final result: passed

## Content update addendum — 2026-08-14

The homepage copy was subsequently expanded with concrete project outcomes, architectural context, and a more personal About note. The original comparison files remain as the visual-design baseline. The revised content was rechecked at 1440 × 1024 and 390 × 844: the project and About layouts remain readable, the document has no horizontal overflow, and the build and lint checks still pass.
