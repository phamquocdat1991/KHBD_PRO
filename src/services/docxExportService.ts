import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, Packer
} from 'docx';
import { saveAs } from 'file-saver';
import { LessonPlan, TeacherProfile } from '../types';
import { stepLabels, tableHeaders, stepTime } from './lessonPresentation';

export class DocxExportService {
  static async exportLessonPlanToDocx(lesson: LessonPlan, teacher?: TeacherProfile | null): Promise<void> {
    const en = lesson.language === 'en';
    const tr = (vi: string, english: string) => en ? english : vi;

    const BORDER = { style: BorderStyle.SINGLE, size: 6, color: '000000' };
    const CELL_MARGINS = { top: 80, bottom: 80, left: 120, right: 120 };

    // Standard Paragraph helper with Times New Roman and standard Vietnamese typography
    const p = (text: string, bold = false, center = false, size = 26, italic = false, spacingAfter = 80) => new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 40, after: spacingAfter, line: 280 },
      children: text.split('\n').map((line, i) => new TextRun({
        text: line,
        bold,
        italics: italic,
        font: 'Times New Roman',
        size,
        ...(i ? { break: 1 } : {})
      }))
    });

    const heading1 = (text: string) => new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 180, after: 80 },
      children: [new TextRun({ text, bold: true, font: 'Times New Roman', size: 26 })]
    });

    const heading2 = (text: string) => new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 100, after: 50 },
      children: [new TextRun({ text, bold: true, font: 'Times New Roman', size: 26 })]
    });

    const list = (values: string[] | undefined, bullet = '-') =>
      (values || []).map(v => p(`${bullet} ${v}`, false, false, 26, false, 50));

    const cell = (paragraphs: Paragraph[], widthDxa: number, isHeader = false) => new TableCell({
      width: { size: widthDxa, type: WidthType.DXA },
      borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
      margins: CELL_MARGINS,
      children: paragraphs,
      ...(isHeader ? { shading: { fill: 'F3F4F6' } } : {})
    });

    const children: (Paragraph | Table)[] = [];

    // 1. School & Teacher Header Banner
    if (teacher?.schoolName || teacher?.name) {
      children.push(
        p(`${teacher?.schoolName ? teacher.schoolName.toUpperCase() : ''}${teacher?.department ? ` — ${teacher.department.toUpperCase()}` : ''}${teacher?.name ? ` | ${tr('GV','Teacher')}: ${teacher.name}` : ''}${lesson.createdAt ? ` | ${tr('Ngày soạn','Date')}: ${new Date(lesson.createdAt).toLocaleDateString('vi-VN')}` : ''}`, false, true, 22, true, 100)
      );
    }

    // 2. Subject, Grade, Textbook banner (Tham chiếu khungkhbdmaunguvan.docx)
    children.push(
      p(`${tr('Môn học','Subject')}: ${lesson.subject} | ${tr('Lớp','Grade')}: ${lesson.grade} | ${tr('Bộ sách','Textbook')}: ${lesson.textbook}`, true, false, 24, false, 80),
      p(tr('KẾ HOẠCH BÀI DẠY:','LESSON PLAN:'), true, true, 28, false, 40),
      p(lesson.title.toUpperCase(), true, true, 32, false, 60),
      p(`${tr('Thời lượng thực hiện','Duration')}: ${lesson.periodsCount} ${tr('tiết','periods')}`, false, true, 24, true, 180)
    );

    // 3. I. MỤC TIÊU
    children.push(
      heading1(tr('I. MỤC TIÊU','I. OBJECTIVES')),
      heading2(tr('1. Về kiến thức:','1. Knowledge:')),
      ...list(lesson.objectives.knowledge),
      heading2(tr('2. Về năng lực:','2. Competencies:')),
      p(tr('a) Năng lực đặc thù:','a) Subject competencies:'), true, false, 26, false, 40),
      ...list(lesson.objectives.specificCompetencies),
      p(tr('b) Năng lực chung:','b) General competencies:'), true, false, 26, false, 40),
      ...list(lesson.objectives.generalCompetencies)
    );

    if (lesson.options.nls && lesson.objectives.digitalCompetencies?.length) {
      children.push(
        p(tr('c) Năng lực số:','c) Digital competencies:'), true, false, 26, false, 40),
        ...list(lesson.objectives.digitalCompetencies)
      );
    }
    if (lesson.options.aiEducation && lesson.objectives.aiCompetencies?.length) {
      children.push(
        p(tr('d) Năng lực AI (Trí tuệ nhân tạo):','d) AI competencies:'), true, false, 26, false, 40),
        ...list(lesson.objectives.aiCompetencies)
      );
    }
    if (lesson.options.stemLesson && lesson.objectives.stemCompetencies?.length) {
      children.push(
        p(tr('e) Năng lực STEM:','e) STEM competencies:'), true, false, 26, false, 40),
        ...list(lesson.objectives.stemCompetencies)
      );
    }

    children.push(
      heading2(tr('3. Về phẩm chất:','3. Qualities:')),
      ...list(lesson.objectives.qualities)
    );

    // 4. II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
    children.push(
      heading1(tr('II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU','II. EQUIPMENT AND MATERIALS')),
      heading2(tr('1. Giáo viên (GV):','1. Teacher:')),
      ...list(lesson.teachingEquipment.teacher),
      heading2(tr('2. Học sinh (HS):','2. Students:')),
      ...list(lesson.teachingEquipment.student)
    );

    // 5. III. TIẾN TRÌNH DẠY HỌC
    children.push(
      heading1(tr('III. TIẾN TRÌNH DẠY HỌC','III. LEARNING ACTIVITIES')),
      p(`${tr('Phương pháp dạy học chủ đạo','Primary teaching method')}: ${lesson.options.teachingMethod}`, false, false, 26, true, 120)
    );

    const labels = stepLabels(en);
    const headers = tableHeaders(lesson);

    for (let index = 0; index < lesson.activities.length; index++) {
      const a = lesson.activities[index];
      const actTitle = `${tr('HOẠT ĐỘNG','ACTIVITY')} ${a.activityNumber || index + 1}: ${a.title.toUpperCase()}${lesson.options.timeline && a.durationMinutes ? ` (Khoảng ${a.durationMinutes} ${tr('phút','minutes')})` : ''}`;

      children.push(
        heading2(actTitle),
        p(`${tr('a) Mục tiêu:','a) Objective:')} ${a.objective}`, false, false, 26, false, 40),
        p(`${tr('b) Nội dung:','b) Content:')} ${a.content}`, false, false, 26, false, 40),
        p(`${tr('c) Sản phẩm:','c) Product:')} ${a.product}`, false, false, 26, false, 40)
      );

      if (lesson.options.nls || lesson.options.aiEducation || lesson.options.stemLesson) {
        children.push(
          p(`${tr('d) Mục đích sư phạm của việc dùng NLS/AI/STEM:','d) Pedagogical purpose of Digital/AI/STEM:')} ${tr('Ứng dụng công nghệ hỗ trợ trực quan hóa kiến thức, tăng cường tương tác và phát triển năng lực tự học của học sinh.','Applying technology to support visualization, enhance interactivity and develop students independent learning competencies.')}`, false, false, 26, false, 40),
          p(tr('e) Tổ chức thực hiện:','e) Implementation:'), true, false, 26, false, 60)
        );
      } else {
        children.push(
          p(tr('d) Tổ chức thực hiện:','d) Implementation:'), true, false, 26, false, 60)
        );
      }

      // --- 2-Column Table Format (Tham chiếu khungkhbdmaunguvan.docx) ---
      if (lesson.tableFormat === '2col') {
        const colWidth = 4680; // 50% - 50% of printable area

        const headerRow = new TableRow({
          tableHeader: true,
          children: [
            cell([p(headers[0], true, true, 26, false, 40)], colWidth, true),
            cell([p(headers[1], true, true, 26, false, 40)], colWidth, true),
          ]
        });

        const gvParagraphs: Paragraph[] = [];
        const hsParagraphs: Paragraph[] = [];

        labels.forEach((pair, i) => {
          const tText = a.implementation[`step${i + 1}Teacher` as keyof typeof a.implementation] || '';
          const sText = a.implementation[`step${i + 1}Student` as keyof typeof a.implementation] || '';

          // Teacher column
          gvParagraphs.push(p(`${pair[0]}:`, true, false, 26, false, 20));
          tText.split('\n').filter(Boolean).forEach(line => {
            gvParagraphs.push(p(line.startsWith('-') || line.startsWith('+') ? line : `- ${line}`, false, false, 26, false, 20));
          });

          // Student column
          hsParagraphs.push(p(`${pair[1]}:`, true, false, 26, false, 20));
          sText.split('\n').filter(Boolean).forEach(line => {
            hsParagraphs.push(p(line.startsWith('-') || line.startsWith('+') ? line : `- ${line}`, false, false, 26, false, 20));
          });
        });

        // Add Product at the bottom of HS column (as in khungkhbdmaunguvan.docx)
        if (a.product) {
          hsParagraphs.push(
            p(tr('Sản phẩm dự kiến / Kết quả:','Expected Product / Outcomes:'), true, false, 26, false, 20)
          );
          a.product.split('\n').filter(Boolean).forEach(line => {
            hsParagraphs.push(p(line.startsWith('-') || line.startsWith('+') ? line : `- ${line}`, false, false, 26, false, 20));
          });
        }

        const contentRow = new TableRow({
          children: [
            cell(gvParagraphs, colWidth, false),
            cell(hsParagraphs, colWidth, false),
          ]
        });

        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [colWidth, colWidth],
          rows: [headerRow, contentRow]
        }));
      } else if (lesson.tableFormat === '1col') {
        labels.forEach((pair, i) => {
          const tText = a.implementation[`step${i + 1}Teacher` as keyof typeof a.implementation] || '';
          const sText = a.implementation[`step${i + 1}Student` as keyof typeof a.implementation] || '';
          children.push(
            p(`${pair[0]}:`, true, false, 26),
            p(tText, false, false, 26),
            p(`${pair[1]}:`, true, false, 26),
            p(sText, false, false, 26)
          );
        });
      } else {
        // 3-col or 4-col format
        const colCount = lesson.tableFormat === '4col' ? 4 : 3;
        const totalW = 9360;
        const colWidths = lesson.tableFormat === '4col'
          ? [1400, 3280, 3280, 1400]
          : [3400, 3400, 2560];

        const rows: TableRow[] = [
          new TableRow({
            tableHeader: true,
            children: headers.map((h, i) => cell([p(h, true, true, 26)], colWidths[i], true))
          })
        ];

        labels.forEach((pair, i) => {
          const tText = a.implementation[`step${i + 1}Teacher` as keyof typeof a.implementation] || '';
          const sText = a.implementation[`step${i + 1}Student` as keyof typeof a.implementation] || '';
          const cells: TableCell[] = [];

          if (lesson.tableFormat === '4col') {
            cells.push(cell([p(lesson.options.timeline ? `${stepTime(a, i)} ${tr('phút','min')}` : '—', false, true, 26)], colWidths[0]));
          }

          cells.push(
            cell([p(`${pair[0]}:`, true, false, 26), p(tText, false, false, 26)], colWidths[cells.length]),
            cell([p(`${pair[1]}:`, true, false, 26), p(sText, false, false, 26)], colWidths[cells.length + 1])
          );

          if (lesson.tableFormat === '3col' || lesson.tableFormat === '4col') {
            cells.push(cell([p(i === 0 ? a.product : '', false, false, 26)], colWidths[colWidths.length - 1]));
          }

          rows.push(new TableRow({ children: cells }));
        });

        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: colWidths,
          rows
        }));
      }
    }

    // 6. IV. HỒ SƠ DẠY HỌC (PHỤ LỤC) (Tham chiếu khungkhbdmaunguvan.docx)
    children.push(
      heading1(tr('IV. HỒ SƠ DẠY HỌC','IV. TEACHING DOSSIER & APPENDIX')),
      heading2(tr('1. Hệ thống Phiếu học tập','1. Worksheets System'))
    );

    if (lesson.worksheetsAppendix && lesson.worksheetsAppendix.length > 0) {
      lesson.worksheetsAppendix.forEach((w, idx) => {
        children.push(
          p(`${tr('Phiếu học tập số','Worksheet No.')} ${idx + 1}:`, true, false, 26, false, 40),
          ...w.split('\n').map(line => p(line, false, false, 26, false, 40))
        );
      });
    } else {
      children.push(
        p(tr('Đính kèm các phiếu học tập khám phá kiến thức và bài tập vận dụng theo tiến trình 4 hoạt động.','Attached are discovery and application worksheets according to the 4 activities.'), false, false, 26, true, 60)
      );
    }

    children.push(
      heading2(tr('2. Tiêu chí và Rubric đánh giá hoạt động học tập','2. Assessment Criteria & Rubric')),
      p(tr('• Mức 1 (Chưa đạt): Chưa nêu được kiến thức cốt lõi, tham gia hoạt động thụ động.','• Level 1 (Beginning): Core concepts not identified, passive participation.'), false, false, 26, false, 30),
      p(tr('• Mức 2 (Đạt): Nắm được định nghĩa cơ bản, hoàn thành nhiệm vụ ở mức tối thiểu.','• Level 2 (Developing): Basic definitions understood, minimum tasks completed.'), false, false, 26, false, 30),
      p(tr('• Mức 3 (Khá): Phân tích tốt, tương tác nhóm tích cực, báo cáo rõ ràng.','• Level 3 (Proficient): Good analysis, active group collaboration, clear reports.'), false, false, 26, false, 30),
      p(tr('• Mức 4 (Tốt): Vận dụng sáng tạo, diễn giải xuất sắc và thể hiện tư duy phản biện cao.','• Level 4 (Advanced): Creative application, excellent articulation and high critical thinking.'), false, false, 26, false, 60),
      heading2(tr('3. Hướng dẫn tự học và nhiệm vụ về nhà','3. Self-study Guide & Homework')),
      p(tr('• Ôn tập và củng cố: Hệ thống hóa lại kiến thức đã học vào vở ghi.','• Review & Consolidate: Systematize learned knowledge into notebooks.'), false, false, 26, false, 30),
      p(tr('• Bài tập rèn luyện: Hoàn thiện câu hỏi bài tập trong sách giáo khoa.','• Practice: Complete exercises and questions in the textbook.'), false, false, 26, false, 30),
      p(tr('• Chuẩn bị bài mới: Đọc trước nội dung bài học tiếp theo và chuẩn bị tư liệu theo phân công.','• Next Lesson Prep: Read the next lesson and prepare assigned materials.'), false, false, 26, false, 60)
    );

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4 standard
            margin: { top: 1134, bottom: 1134, left: 1417, right: 1134 } // Top 20mm, Bottom 20mm, Left 25mm, Right 20mm
          }
        },
        children
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `KHBD_${lesson.title.replace(/[^\p{L}\p{N}\s]/gu, '').trim().replace(/\s+/g, '_') || 'Bai_day'}.docx`);
  }
}
