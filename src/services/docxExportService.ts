import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { LessonPlan, TeacherProfile } from '../types';

export class DocxExportService {
  static async exportLessonPlanToDocx(lesson: LessonPlan, teacher?: TeacherProfile | null): Promise<void> {
    const teacherName = teacher?.name || 'Nguyễn Nam';
    const schoolName = teacher?.schoolName || 'Trường THPT Chuyên';
    const department = teacher?.department || 'Tổ Chuyên Môn';

    const tableBorder = {
      top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    };

    // Build Activity Table Rows
    const activityRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F3F4F6' },
            borders: tableBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'HOẠT ĐỘNG CỦA GIÁO VIÊN', bold: true, font: 'Times New Roman', size: 24 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: 'F3F4F6' },
            borders: tableBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'HOẠT ĐỘNG CỦA HỌC SINH', bold: true, font: 'Times New Roman', size: 24 })],
              }),
            ],
          }),
        ],
      }),
    ];

    lesson.activities.forEach((act) => {
      // Activity title spanning both columns
      activityRows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              shading: { fill: 'E5E7EB' },
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${act.title.toUpperCase()} (${act.durationMinutes || 10} phút)`,
                      bold: true,
                      font: 'Times New Roman',
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'a) Mục tiêu: ', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.objective, font: 'Times New Roman', size: 24 }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'b) Nội dung: ', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.content, font: 'Times New Roman', size: 24 }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'c) Sản phẩm: ', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.product, font: 'Times New Roman', size: 24 }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'd) Tổ chức thực hiện:', bold: true, italics: true, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      // Step 1
      activityRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 1: Chuyển giao nhiệm vụ\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step1Teacher, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 1: Tiếp nhận nhiệm vụ\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step1Student, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      // Step 2
      activityRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 2: Theo dõi, hỗ trợ\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step2Teacher, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 2: Thực hiện nhiệm vụ\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step2Student, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      // Step 3
      activityRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 3: Tổ chức báo cáo\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step3Teacher, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 3: Báo cáo, thảo luận\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step3Student, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      // Step 4
      activityRows.push(
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 4: Kết luận, nhận định\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step4Teacher, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBorder,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '# Bước 4: Ghi nhận kiến thức\n', bold: true, font: 'Times New Roman', size: 24 }),
                    new TextRun({ text: act.implementation.step4Student, font: 'Times New Roman', size: 24 }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134, // ~2cm
                bottom: 1134,
                left: 1701, // ~3cm
                right: 1134, // ~2cm
              },
            },
          },
          children: [
            // Header: School & Republic
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: schoolName.toUpperCase(), bold: true, font: 'Times New Roman', size: 24 }),
                new TextRun({ text: '\t\t\t\tCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n', bold: true, font: 'Times New Roman', size: 24 }),
                new TextRun({ text: `${department.toUpperCase()}\n`, bold: true, font: 'Times New Roman', size: 24 }),
                new TextRun({ text: `Giáo viên: ${teacherName}\t\t\tĐộc lập - Tự do - Hạnh phúc\n\n`, font: 'Times New Roman', size: 24 }),
              ],
            }),

            // Title
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `KẾ HOẠCH BÀI DẠY: ${lesson.title.toUpperCase()}`,
                  bold: true,
                  font: 'Times New Roman',
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Môn học: ${lesson.subject}; Lớp: ${lesson.grade} (Bộ sách: ${lesson.textbook})\nThời lượng thực hiện: ${lesson.periodsCount} tiết\n\n`,
                  italics: true,
                  font: 'Times New Roman',
                  size: 24,
                }),
              ],
            }),

            // I. MỤC TIÊU
            new Paragraph({
              children: [new TextRun({ text: 'I. MỤC TIÊU', bold: true, font: 'Times New Roman', size: 26 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: '1. Về kiến thức:', bold: true, font: 'Times New Roman', size: 24 })],
            }),
            ...lesson.objectives.knowledge.map(
              (k) =>
                new Paragraph({
                  children: [new TextRun({ text: `• ${k}`, font: 'Times New Roman', size: 24 })],
                })
            ),
            new Paragraph({
              children: [new TextRun({ text: '2. Về năng lực:', bold: true, font: 'Times New Roman', size: 24 })],
            }),
            ...lesson.objectives.generalCompetencies.map(
              (g) =>
                new Paragraph({
                  children: [new TextRun({ text: `• ${g}`, font: 'Times New Roman', size: 24 })],
                })
            ),
            ...lesson.objectives.specificCompetencies.map(
              (s) =>
                new Paragraph({
                  children: [new TextRun({ text: `• ${s}`, font: 'Times New Roman', size: 24 })],
                })
            ),
            ...(lesson.objectives.digitalCompetencies && lesson.objectives.digitalCompetencies.length > 0
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: '• Năng lực số (Thông tư 02/2025/TT-BGDĐT & CV 3456/BGDĐT):', bold: true, font: 'Times New Roman', size: 24 })],
                  }),
                  ...lesson.objectives.digitalCompetencies.map(
                    (d) =>
                      new Paragraph({
                        children: [new TextRun({ text: `  - ${d}`, font: 'Times New Roman', size: 24 })],
                      })
                  ),
                ]
              : []),
            ...(lesson.options.aiEducation && lesson.objectives.aiCompetencies && lesson.objectives.aiCompetencies.length > 0
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: '• Năng lực Trí tuệ Nhân tạo - AI (Khung Quyết định 2422/QĐ-BGDĐT):', bold: true, font: 'Times New Roman', size: 24 })],
                  }),
                  ...lesson.objectives.aiCompetencies.map(
                    (a) =>
                      new Paragraph({
                        children: [new TextRun({ text: `  - ${a}`, font: 'Times New Roman', size: 24 })],
                      })
                  ),
                ]
              : []),
            ...(lesson.options.stemLesson && lesson.objectives.stemCompetencies && lesson.objectives.stemCompetencies.length > 0
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: '• Năng lực Bài học STEM (Công văn 3089/BGDĐT & CV 908/BGDĐT):', bold: true, font: 'Times New Roman', size: 24 })],
                  }),
                  ...lesson.objectives.stemCompetencies.map(
                    (st) =>
                      new Paragraph({
                        children: [new TextRun({ text: `  - ${st}`, font: 'Times New Roman', size: 24 })],
                      })
                  ),
                ]
              : []),
            new Paragraph({
              children: [new TextRun({ text: '3. Về phẩm chất:', bold: true, font: 'Times New Roman', size: 24 })],
            }),
            ...lesson.objectives.qualities.map(
              (q) =>
                new Paragraph({
                  children: [new TextRun({ text: `• ${q}`, font: 'Times New Roman', size: 24 })],
                })
            ),
            new Paragraph({ text: '' }),

            // II. THIẾT BỊ DẠY HỌC
            new Paragraph({
              children: [new TextRun({ text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU', bold: true, font: 'Times New Roman', size: 26 })],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '1. Giáo viên: ', bold: true, font: 'Times New Roman', size: 24 }),
                new TextRun({ text: lesson.teachingEquipment.teacher.join('; '), font: 'Times New Roman', size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '2. Học sinh: ', bold: true, font: 'Times New Roman', size: 24 }),
                new TextRun({ text: lesson.teachingEquipment.student.join('; '), font: 'Times New Roman', size: 24 }),
              ],
            }),
            new Paragraph({ text: '' }),

            // III. TIẾN TRÌNH DẠY HỌC
            new Paragraph({
              children: [new TextRun({ text: 'III. TIẾN TRÌNH DẠY HỌC', bold: true, font: 'Times New Roman', size: 26 })],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: activityRows,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const safeTitle = lesson.title.replace(/[^a-zA-Z0-9À-ỹ\s]/g, '').trim().replace(/\s+/g, '_');
    saveAs(blob, `KHBD_${safeTitle}_CV5512.docx`);
  }
}
