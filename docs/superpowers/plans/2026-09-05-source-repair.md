# KHBD source repair implementation plan

**Goal:** Restore the existing source-based generation and advertised editing/export workflows on KHBD_PRO, then update its existing Vercel production.

**Architecture:** Preserve the React/Vite application and local library keys. Read DOCX/text locally; send PDF/image bytes as Gemini inline parts alongside teacher content. Reject missing keys, unreadable sources and invalid model output instead of substituting invented template content. No new authentication backend, database or cloud sharing service.

**Tech stack:** React 19, TypeScript, Vite, Gemini REST, Mammoth, docx, PptxGenJS, Vitest.

**Authorization:** User request in this conversation authorizes repairs, verification, GitHub update and production deployment on the existing project.

- [x] Source generation: reproduce with `tests/gemini.test.ts` and `tests/app.test.tsx`; run `npx vitest run`; replace the fallback path in `src/services/geminiService.ts`; add `src/services/sourceDocumentService.ts`; wire prepared sources and persistent errors through LessonConfigForm/LessonContext. Check PDF and PNG inline bytes, DOCX text, missing keys, 400/403/404/429/500, invalid JSON, safety/truncation, and worksheet/timeline preservation.
- [x] Existing app workflows: keep empty libraries empty; ensure all new/open buttons select the proper studio tab; save each editable lesson field into the same structured data used by exports. Exercise edits, reload, search/filter, sample lessons, duplicate/delete and all table formats. Clearly identify unavailable account/cloud operations instead of reporting fake success.
- [x] Existing exports and Copilot: replace HTML download behind PPTX with a real OOXML presentation, preserve worksheet text and selected table/language in DOCX/copy/print, and connect existing Copilot questions to the selected lesson and Gemini. Inspect actual DOCX/PPTX archives.
- [ ] Release: run tests and production build, review diff, create a preview on the existing project, exercise its browser flows, merge only the verified commit and verify the production alias and commit. Record tests and any live credentials limitation in `docs/QA-2026-09-06.md`.
