import { saveAs } from 'file-saver';
import { LessonPlan } from '../types';

export class PptxExportService {
  static exportSlideDeck(lesson: LessonPlan): void {
    const slides = lesson.slides || [];
    if (slides.length === 0) {
      alert('Chưa có kịch bản Slide cho bài giảng này!');
      return;
    }

    // Generate a standalone, beautiful HTML presentation deck that can be opened in any browser or imported into Office / Canva / Gamma
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>SLIDE BÀI GIẢNG: ${lesson.title.toUpperCase()}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #0b0f19;
      color: #f1f5f9;
      margin: 0;
      padding: 40px 20px;
    }
    .slide-deck {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    .slide-card {
      background: linear-gradient(135deg, #182444 0%, #0c1222 100%);
      border: 1px solid rgba(6, 182, 212, 0.3);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      position: relative;
      aspect-ratio: 16 / 9;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .slide-badge {
      position: absolute;
      top: 20px;
      right: 25px;
      background: rgba(6, 182, 212, 0.2);
      color: #22d3ee;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    h2 {
      color: #38bdf8;
      font-size: 28px;
      margin-top: 0;
      margin-bottom: 8px;
    }
    h3 {
      color: #94a3b8;
      font-size: 18px;
      font-weight: normal;
      margin-bottom: 24px;
    }
    ul {
      font-size: 18px;
      line-height: 1.8;
      color: #e2e8f0;
      padding-left: 24px;
    }
    li {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="slide-deck">
    ${slides
      .map(
        (s) => `
      <div class="slide-card">
        <span class="slide-badge">Slide ${s.slideNumber}</span>
        <h2>${s.title}</h2>
        ${s.subtitle ? `<h3>${s.subtitle}</h3>` : ''}
        <ul>
          ${s.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const safeTitle = lesson.title.replace(/[^a-zA-Z0-9À-ỹ\s]/g, '').trim().replace(/\s+/g, '_');
    saveAs(blob, `Slide_BaiGiang_${safeTitle}.html`);
  }
}
