# KHBD AI PRO 2.1.0 — pastel studio

The studio follows the supplied reference photograph: a coral teacher card, pastel subject folders and shortcuts, a central lesson configuration surface, and a Copilot column showing both the existing lesson tree and contextual chat. Vietnamese labels replace the concept image's garbled text. Profile information, lesson counts, recent items, mindmap and chat use existing application state.

## Behavior

- Opens the configuration form by default. The A4 editor remains available through its existing tab and recent lesson buttons.
- Preserves the lesson library storage key and schema, generation service/fallbacks, source ingestion, A4 editor and Word/PowerPoint exporters.
- Keeps all advanced controls inside an expandable details section.
- Adds quick subject selection and restores a versioned device-local form draft after reload. Unknown/corrupt drafts are ignored. Storage write failures are shown without blocking editing.
- Draft storage contains configuration and entered text only. API keys and attachment bytes are not copied into drafts; teachers are told to select attachments again after reloading.
- Replaces the old unconditional “Online” badge with actual key-configuration status. This does not imply that the configured key has been verified.
- Sidebar actions are keyboard-operable buttons. Mobile uses the compact navigation rail; the full library remains accessible from the header.
- Screen-only theme rules leave print styling separate.

## Validation

- `npm run build`: passed (TypeScript and Vite production build).
- `npm test`: 51 tests passed across 7 files.
- Existing tests cover source ingestion, generation with mocked HTTP, editing and saving objectives, library behavior, authentication error states, Word/PowerPoint export and API errors.
- New tests cover draft restoration, corrupt storage, quota errors, navigation retaining the draft, and inline Copilot context/response handling.
- The existing editor test now explicitly opens the A4 tab, reflecting the new form-first entry point; its saved-data assertion is unchanged.

## Remaining verification

The Vercel preview was opened in Chrome and visually compared with the reference. The form header was compacted and the actual lesson mindmap changed to a branching SVG, with full labels retained in an expandable outline. This is a reference-based implementation, not a verified 100% pixel match. The supplied asset is a photograph of a concept with distorted colors and garbled labels, not a source design file.

No real Gemini key was supplied or used; live generation and chat remain unverified. Existing Google/email sign-in methods explicitly report that their authentication service is not connected. Existing library persistence remains browser-local rather than cloud-synchronized. These are pre-existing product limitations, not replaced by mock sign-in or fabricated AI output.

## Follow-up browser verification

- Verified the Vercel preview for commit `5a5d38c`: page rendering, branching diagram, advanced STEM control and English-language action label.
- Verified on the preceding preview: quick subject selection, draft restoration across reload, A4 objective editing and persistence across reload, and a clear missing-key error without fabricated generation.
- The Word download contains the exact edited objective and passes ZIP integrity validation (13,330 bytes).
- The PowerPoint download from the final preview passes ZIP integrity validation and contains 2 slides (54,826 bytes), matching the selected sample lesson.
- No application console error was observed in the checked interactions; browser-extension metadata errors were excluded.
- Browser download-event waiting timed out for Word, but the actual synchronized download was present and its content was checked. This was an observation-channel limitation, not a failed export.
- Mobile breakpoints are implemented but have not been tested in a separate mobile viewport.

Production release status is recorded in pull request #4 and the associated Vercel deployment rather than asserted in this source document.
