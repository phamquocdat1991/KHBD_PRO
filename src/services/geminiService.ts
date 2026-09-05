import { LessonPlan, GeminiModelId, Subject, GradeLevel, TextbookEdition, TableFormat, AdvancedOptions, LessonLanguage } from '../types';

export interface GenerateParams {
  title: string;
  subject: Subject;
  grade: GradeLevel;
  textbook: TextbookEdition;
  periodsCount: number;
  tableFormat: TableFormat;
  language: LessonLanguage;
  options: AdvancedOptions;
  coreContent: string;
  apiKey?: string;
  modelId?: GeminiModelId;
}

export class GeminiService {
  private static parseJsonResponse<T>(text: string, fallback: T): T {
    try {
      const cleaned = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned) as T;
    } catch {
      return fallback;
    }
  }

  static async generateLessonPlan(params: GenerateParams, onProgress?: (status: string) => void): Promise<LessonPlan> {
    onProgress?.('Đang kết nối mô hình Gemini AI...');
    await new Promise((r) => setTimeout(r, 600));

    const model = params.modelId || 'gemini-3.8-flash';
    const isEnglish = params.language === 'en';

    if (params.apiKey && params.apiKey.trim().length > 10) {
      try {
        onProgress?.(`Đang phân tích chương trình môn ${params.subject} (${model})...`);
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${params.apiKey.trim()}`;
        
        const pedagogicalDirectives = [
          params.options.nls ? '- TÍCH HỢP NĂNG LỰC SỐ (NLS): Bám sát Thông tư 02/2025/TT-BGDĐT và Công văn 3456/BGDĐT.' : '',
          params.options.aiEducation ? '- TÍCH HỢP GIÁO DỤC TRÍ TUỆ NHÂN TẠO (AI): Bám sát Khung Quyết định 2422/QĐ-BGDĐT.' : '',
          params.options.stemLesson ? '- THIẾT KẾ BÀI HỌC STEM: Tuân thủ quy trình thiết kế kỹ thuật theo Công văn 3089/BGDĐT và Công văn 908/BGDĐT.' : '',
          params.options.teachingMethod ? `- PHƯƠNG PHÁP DẠY HỌC CHỦ ĐẠO: Áp dụng phương pháp "${params.options.teachingMethod}".` : '',
          params.options.warmupType ? `- HÌNH THỨC KHỞI ĐỘNG: Thiết kế hoạt động 1 theo hình thức "${params.options.warmupType}".` : '',
          params.options.customIntegration ? `- TÍCH HỢP YÊU CẦU ĐẶC THÙ KHÁC: "${params.options.customIntegration}".` : '',
          params.options.gdqpan ? '- LỒNG GHÉP GIÁO DỤC QUỐC PHÒNG & AN NINH: Theo Thông tư 08/2024/TT-BGDĐT.' : '',
        ].filter(Boolean).join('\n');

        const systemPrompt = `Bạn là chuyên gia sư phạm hàng đầu của Bộ Giáo dục và Đào tạo Việt Nam.
Hãy soạn Kế hoạch bài dạy (KHBD) hoàn chỉnh theo đúng chuẩn Công văn 5512/BGDĐT, Công văn 2345/BGDĐT.
Bài học: "${params.title}" - Môn: ${params.subject} - Khối: ${params.grade} - Bộ sách: ${params.textbook} - Số tiết: ${params.periodsCount}.
Ngôn ngữ bài soạn: ${isEnglish ? 'TIẾNG ANH (ENGLISH LESSON PLAN)' : 'TIẾNG VIỆT'}.

YÊU CẦU SƯ PHẠM NÂNG CAO BẮT BUỘC:
${pedagogicalDirectives}

Yêu cầu kỹ thuật:
1. Đầy đủ 4 phần chuẩn mực: Mục tiêu, Thiết bị dạy học, Tiến trình dạy học (4 hoạt động: Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng), mỗi hoạt động đủ 4 bước tổ chức (Chuyển giao, Tiếp nhận, Báo cáo/Thảo luận, Kết luận/Nhận định).
${params.options.stemLesson ? 'Nếu là bài học STEM, các hoạt động phải thể hiện rõ quy trình thiết kế kỹ thuật 5 bước (Xác định vấn đề -> Nghiên cứu kiến thức nền -> Đề xuất giải pháp -> Chế tạo thử nghiệm -> Đánh giá hoàn thiện).' : ''}
2. Trả về kết quả CHÍNH XÁC dưới dạng định dạng JSON:
{
  "knowledgeObjectives": ["..."],
  "generalCompetencies": ["..."],
  "specificCompetencies": ["..."],
  "digitalCompetencies": ["..."],
  "aiCompetencies": ["..."],
  "stemCompetencies": ["..."],
  "qualities": ["..."],
  "equipmentTeacher": ["..."],
  "equipmentStudent": ["..."],
  "activities": [
    {
      "activityNumber": 1,
      "title": "${isEnglish ? 'Activity 1: Warm-up' : 'Hoạt động 1: Khởi động'}",
      "durationMinutes": 7,
      "objective": "...",
      "content": "...",
      "product": "...",
      "step1Teacher": "...",
      "step1Student": "...",
      "step2Teacher": "...",
      "step2Student": "...",
      "step3Teacher": "...",
      "step3Student": "...",
      "step4Teacher": "...",
      "step4Student": "..."
    }
  ],
  "mindmap": {
    "label": "CHỦ ĐỀ BÀI HỌC",
    "children": [{ "label": "Nhánh 1", "children": [{ "label": "Ý 1.1" }] }]
  },
  "slides": [
    {
      "slideNumber": 1,
      "title": "...",
      "subtitle": "...",
      "bullets": ["...", "..."]
    }
  ]
}`;

        onProgress?.('Đang kiến tạo tiến trình 4 hoạt động sư phạm nâng cao...');
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemPrompt}\n\nNội dung cốt lõi và tài liệu nguồn giáo viên cung cấp:\n${params.coreContent || 'Sử dụng kiến thức SGK chuẩn hiện hành'}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8192,
              responseMimeType: 'application/json'
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          onProgress?.('Bóc tách Sơ đồ tư duy & Kịch bản Slide...');
          const parsed = this.parseJsonResponse<any>(rawText, null);
          if (parsed && parsed.activities && parsed.activities.length > 0) {
            return this.buildLessonPlanFromAiResult(params, parsed);
          }
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, switching to pedagogical intelligent generator:', err);
      }
    }

    // Pedagogical Intelligent Fallback Generator
    onProgress?.('Đang tích hợp các khung Thông tư 02/2025, QĐ 2422 và STEM 3089...');
    await new Promise((r) => setTimeout(r, 600));
    onProgress?.('Tự động tạo tiến trình sư phạm và sơ đồ tư duy...');
    await new Promise((r) => setTimeout(r, 500));

    return this.buildFallbackPlan(params);
  }

  private static buildLessonPlanFromAiResult(params: GenerateParams, ai: any): LessonPlan {
    const id = 'lesson-' + Date.now();
    return {
      id,
      title: params.title,
      subject: params.subject,
      grade: params.grade,
      textbook: params.textbook,
      periodsCount: params.periodsCount,
      tableFormat: params.tableFormat,
      language: params.language,
      options: params.options,
      coreContent: params.coreContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      objectives: {
        knowledge: ai.knowledgeObjectives || [`Nắm vững kiến thức trọng tâm bài ${params.title}.`],
        generalCompetencies: ai.generalCompetencies || ['Năng lực tự chủ, tự học và hợp tác.'],
        specificCompetencies: ai.specificCompetencies || [`Năng lực đặc thù môn ${params.subject}.`],
        digitalCompetencies: params.options.nls ? (ai.digitalCompetencies || ['Ứng dụng công cụ số và học liệu trực quan (TT 02/2025 & CV 3456/BGDĐT).']) : undefined,
        aiCompetencies: params.options.aiEducation ? (ai.aiCompetencies || ['Hiểu nguyên lý cơ bản của Trí tuệ Nhân tạo và ứng dụng AI có trách nhiệm (QĐ 2422/QĐ-BGDĐT).']) : undefined,
        stemCompetencies: params.options.stemLesson ? (ai.stemCompetencies || ['Vận dụng tích hợp kiến thức STEM và quy trình thiết kế kỹ thuật (CV 3089/908).']) : undefined,
        qualities: ai.qualities || ['Chăm chỉ, trung thực, trách nhiệm trong học tập.']
      },
      teachingEquipment: {
        teacher: ai.equipmentTeacher || ['Kế hoạch bài dạy, máy chiếu/Tivi thông minh, học liệu số.'],
        student: ai.equipmentStudent || ['SGK, vở ghi bài, dụng cụ học tập cá nhân.']
      },
      activities: (ai.activities || []).map((act: any, idx: number) => ({
        id: `act-${id}-${idx + 1}`,
        activityNumber: act.activityNumber || idx + 1,
        title: act.title || `Hoạt động ${idx + 1}`,
        durationMinutes: act.durationMinutes || (idx === 0 ? 7 : idx === 1 ? 22 : idx === 2 ? 11 : 5),
        objective: act.objective || 'Mục tiêu hoạt động.',
        content: act.content || 'Nội dung thực hiện.',
        product: act.product || 'Sản phẩm học tập của học sinh.',
        implementation: {
          step1Teacher: act.step1Teacher || 'GV giao nhiệm vụ cụ thể cho học sinh.',
          step1Student: act.step1Student || 'HS tiếp nhận nhiệm vụ và chuẩn bị.',
          step2Teacher: act.step2Teacher || 'GV theo dõi, hướng dẫn và hỗ trợ kịp thời.',
          step2Student: act.step2Student || 'HS làm việc độc lập hoặc trao đổi theo nhóm.',
          step3Teacher: act.step3Teacher || 'GV tổ chức báo cáo, điều phối thảo luận chung.',
          step3Student: act.step3Student || 'Đại diện HS báo cáo sản phẩm, nhận xét chéo.',
          step4Teacher: act.step4Teacher || 'GV nhận xét, chuẩn hóa kiến thức và kết luận.',
          step4Student: act.step4Student || 'HS lắng nghe và ghi chép nội dung chính vào vở.'
        }
      })),
      mindmap: ai.mindmap ? { id: 'mm-' + id, ...ai.mindmap } : undefined,
      slides: ai.slides || []
    };
  }

  private static buildFallbackPlan(params: GenerateParams): LessonPlan {
    const id = 'lesson-' + Date.now();
    const isEn = params.language === 'en';
    const title = params.title.trim() || (isEn ? 'Lesson Title' : 'Bài học mới');

    const warmupTitle = params.options.warmupType
      ? `${isEn ? 'Activity 1: Warm-up' : 'Hoạt động 1: Khởi động'} (${params.options.warmupType})`
      : (isEn ? 'Activity 1: Warm-up' : 'Hoạt động 1: Khởi động (Mở đầu)');

    return {
      id,
      title,
      subject: params.subject,
      grade: params.grade,
      textbook: params.textbook,
      periodsCount: params.periodsCount,
      tableFormat: params.tableFormat,
      language: params.language,
      options: params.options,
      coreContent: params.coreContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      objectives: {
        knowledge: [
          isEn
            ? `Understand and apply key concepts and principles of "${title}".`
            : `Nắm vững khái niệm, định lý và quy tắc trọng tâm của bài học "${title}".`,
          isEn
            ? `Analyze practical applications and problem-solving strategies related to ${params.subject}.`
            : `Phân biệt và giải thích được các trường hợp bản chất liên quan trong thực tiễn môn ${params.subject}.`
        ],
        generalCompetencies: [
          isEn
            ? 'Autonomy and self-learning: Active exploration of digital and textbook resources.'
            : 'Năng lực tự chủ và tự học: Chủ động tìm tòi, nghiên cứu thông tin trong SGK và tài liệu số.',
          isEn
            ? 'Communication and collaboration: Teamwork, constructive debate, and peer feedback.'
            : 'Năng lực giao tiếp và hợp tác: Tự tin trao đổi trong nhóm, lắng nghe và phản biện tích cực.'
        ],
        specificCompetencies: [
          isEn
            ? `Subject-specific competency: Specialized scientific and critical thinking in ${params.subject}.`
            : `Năng lực tư duy logic và giải quyết vấn đề chuyên biệt của bộ môn ${params.subject}.`
        ],
        digitalCompetencies: params.options.nls ? [
          isEn
            ? 'Digital literacy: Exploring simulated software and digital learning materials safely (Circular 02/2025 & Dispatch 3456/BGDDT).'
            : 'Khai thác phần mềm mô phỏng và học liệu số an toàn, hiệu quả (Thông tư 02/2025/TT-BGDĐT & CV 3456/BGDĐT).'
        ] : undefined,
        aiCompetencies: params.options.aiEducation ? [
          isEn
            ? 'AI literacy: Understanding prompt engineering basics and ethical use of AI tools (Decision 2422/QD-BGDDT).'
            : 'Hiểu nguyên lý cơ bản của Trí tuệ Nhân tạo, nhận diện ứng dụng AI trong học tập và tuân thủ đạo đức số (Khung QĐ 2422/QĐ-BGDĐT).'
        ] : undefined,
        stemCompetencies: params.options.stemLesson ? [
          isEn
            ? 'STEM Education: Integrating Science, Technology, Engineering, and Mathematics through design process (Dispatch 3089/908).'
            : 'Tích hợp liên môn STEM: Vận dụng kiến thức Khoa học, Công nghệ, Kỹ thuật và Toán học để giải quyết bài toán thực tế (CV 3089/908).'
        ] : undefined,
        qualities: [
          isEn
            ? 'Diligence, honesty, and responsibility in scientific inquiry and group collaboration.'
            : 'Chăm chỉ, trung thực và có trách nhiệm cao trong thực hành, học tập nhóm.'
        ]
      },
      teachingEquipment: {
        teacher: [
          isEn ? 'Computer, smart screen/projector, digital lesson resources, worksheets.' : 'Máy tính, máy chiếu/màn hình tương tác; phiếu học tập số 1 và số 2.',
          isEn ? 'Specialized software and instructional simulators.' : `Hệ thống học liệu số môn ${params.subject}, video bài giảng và sơ đồ tương tác.`
        ],
        student: [
          isEn ? 'Textbook, notebook, learning toolkit.' : `Sách giáo khoa ${params.subject} (${params.textbook}), vở ghi, dụng cụ học tập bộ môn.`
        ]
      },
      activities: [
        {
          id: `act-${id}-1`,
          activityNumber: 1,
          title: warmupTitle,
          durationMinutes: 7,
          objective: isEn
            ? 'Trigger curiosity and connect real-life contexts to the core lesson questions.'
            : 'Tạo tâm thế hứng thú học tập, xuất hiện mâu thuẫn nhận thức cần giải quyết.',
          content: isEn
            ? `Students participate in warm-up activity (${params.options.warmupType || 'Interactive Game'}).`
            : `HS tham gia hoạt động khởi động theo hình thức: ${params.options.warmupType || 'Trò chơi tương tác / Tình huống thực tiễn'}.`,
          product: isEn ? 'Initial hypothesis and key questions raised by students.' : 'Câu trả lời nhanh và giả thuyết ban đầu của học sinh.',
          implementation: {
            step1Teacher: isEn
              ? `Teacher introduces problem situation related to "${title}" using ${params.options.warmupType || 'media clip'}.`
              : `GV nêu tình huống kích thích tư duy liên quan đến "${title}" (Hình thức: ${params.options.warmupType || 'Trò chơi/Tình huống'}).`,
            step1Student: isEn ? 'Students observe, brainstorm, and take notes.' : 'HS quan sát, suy nghĩ và chuẩn bị tâm thế tham gia.',
            step2Teacher: isEn ? 'Teacher encourages active discussion.' : 'GV bao quát lớp, khích lệ các em đưa ra ý kiến cá nhân.',
            step2Student: isEn ? 'Pair discussion for 1-2 minutes.' : 'HS trao đổi nhanh với bạn cùng bàn.',
            step3Teacher: isEn ? 'Teacher invites representatives to present.' : 'GV mời đại diện 2 học sinh phát biểu.',
            step3Student: isEn ? 'Students share their thoughts with the class.' : 'HS trình bày suy nghĩ của mình trước lớp.',
            step4Teacher: isEn ? 'Teacher summarizes and bridges into the new lesson.' : `GV chuẩn hóa và dẫn dắt vào bài mới: "${title}".`,
            step4Student: isEn ? 'Students write the lesson title in their notebook.' : 'HS mở SGK, ghi tên bài học vào vở.'
          }
        },
        {
          id: `act-${id}-2`,
          activityNumber: 2,
          title: params.options.stemLesson
            ? (isEn ? 'Activity 2: Background Research & Solution Proposal (STEM)' : 'Hoạt động 2: Nghiên cứu kiến thức nền & Đề xuất giải pháp (STEM)')
            : (isEn ? 'Activity 2: Knowledge Formation' : 'Hoạt động 2: Hình thành kiến thức mới'),
          durationMinutes: 20,
          objective: isEn
            ? `Students master core concepts using ${params.options.teachingMethod || 'active learning methods'}.`
            : `Học sinh tự lực khám phá và chiếm lĩnh kiến thức cốt lõi thông qua phương pháp: ${params.options.teachingMethod || 'Dạy học giải quyết vấn đề'}.`,
          content: isEn
            ? 'Group research with Worksheet 1 and scientific observation.'
            : `HS nghiên cứu SGK, làm việc nhóm với Phiếu học tập số 1 ${params.options.customIntegration ? `(Lồng ghép: ${params.options.customIntegration})` : ''}.`,
          product: isEn ? 'Completed worksheet and core formula notes.' : 'Kết quả hoàn thành trên phiếu học tập của các nhóm.',
          implementation: {
            step1Teacher: isEn
              ? 'Teacher distributes Worksheet 1 and assigns group roles.'
              : `GV phát Phiếu học tập số 1, áp dụng phương pháp ${params.options.teachingMethod || 'dạy học tích cực'}.`,
            step1Student: isEn ? 'Students receive worksheets and organize groups.' : 'HS nhận phiếu, phân công nhóm trưởng và thư ký.',
            step2Teacher: isEn ? 'Teacher circulates and provides scaffolding.' : 'GV theo dõi, hỗ trợ kịp thời cho các nhóm gặp khó khăn.',
            step2Student: isEn ? 'Collaborative inquiry and scientific discussion.' : 'HS thảo luận sôi nổi và hoàn thành các câu hỏi trong phiếu.',
            step3Teacher: isEn ? 'Teacher facilitates presentations.' : 'GV gọi đại diện nhóm lên bảng trình bày, mời nhóm khác nhận xét.',
            step3Student: isEn ? 'Group representative presents findings.' : 'Đại diện nhóm báo cáo sản phẩm, nhận phản biện từ các bạn.',
            step4Teacher: isEn ? 'Teacher confirms standard scientific knowledge.' : 'GV nhận xét, chuẩn hóa kiến thức trọng tâm lên bảng.',
            step4Student: isEn ? 'Students write formal conclusions in notebooks.' : 'HS đối chiếu và ghi nhận kiến thức chuẩn vào vở.'
          }
        },
        {
          id: `act-${id}-3`,
          activityNumber: 3,
          title: isEn ? 'Activity 3: Practice & Consolidation' : 'Hoạt động 3: Luyện tập & Củng cố',
          durationMinutes: 12,
          objective: isEn ? 'Deepen understanding through differentiated exercises.' : 'Củng cố, khắc sâu kiến thức thông qua bài tập phân hóa.',
          content: isEn ? 'Individual exercises and digital quizzes.' : 'HS làm việc cá nhân giải quyết các bài tập rèn luyện trong SGK.',
          product: isEn ? 'Detailed solutions in student notebooks.' : 'Lời giải chi tiết và đáp án trong vở của học sinh.',
          implementation: {
            step1Teacher: isEn ? 'Teacher displays tiered questions.' : 'GV giao hệ thống bài tập từ nhận biết đến vận dụng.',
            step1Student: isEn ? 'Students solve exercises individually.' : 'HS quan sát yêu cầu, làm bài vào vở.',
            step2Teacher: isEn ? 'Teacher monitors and helps struggling students.' : 'GV quan sát tốc độ làm bài, nhắc nhở lỗi sai hay gặp.',
            step2Student: isEn ? 'Students solve tasks and check answers.' : 'HS tích cực làm bài, kiểm tra chéo đáp án.',
            step3Teacher: isEn ? 'Teacher calls students to board.' : 'GV gọi 2 - 3 HS lên bảng chữa bài.',
            step3Student: isEn ? 'Students show solutions on board.' : 'HS lên bảng trình bày, dưới lớp nhận xét.',
            step4Teacher: isEn ? 'Teacher grades and summarizes key tips.' : 'GV chữa bài, tuyên dương và đúc rút phương pháp giải.',
            step4Student: isEn ? 'Students correct mistakes and highlight tips.' : 'HS sửa sai vào vở ghi.'
          }
        },
        {
          id: `act-${id}-4`,
          activityNumber: 4,
          title: params.options.stemLesson
            ? (isEn ? 'Activity 4: Fabrication, Testing & Presentation (STEM)' : 'Hoạt động 4: Chế tạo thử nghiệm & Đánh giá sản phẩm STEM')
            : (isEn ? 'Activity 4: Practical Application' : 'Hoạt động 4: Vận dụng thực tiễn'),
          durationMinutes: 6,
          objective: isEn ? 'Apply lesson knowledge to real life or STEM project.' : 'Vận dụng kiến thức bài học để giải quyết bài toán đời sống.',
          content: isEn ? 'Extension project or real-world problem.' : `Nhiệm vụ tìm hiểu thực tế ${params.options.customIntegration ? `(Tích hợp: ${params.options.customIntegration})` : ''}.`,
          product: isEn ? 'Short report, poster or physical artifact.' : 'Báo cáo ngắn, poster hoặc sản phẩm học tập được nộp lại tiết sau.',
          implementation: {
            step1Teacher: isEn ? 'Teacher assigns home challenge.' : 'GV giao nhiệm vụ vận dụng mở rộng về nhà.',
            step1Student: isEn ? 'Students note challenge requirements.' : 'HS chú ý lắng nghe và ghi chép yêu cầu.',
            step2Teacher: isEn ? 'Teacher suggests reliable references.' : 'GV hướng dẫn nguồn tham khảo tài liệu uy tín.',
            step2Student: isEn ? 'Students plan implementation strategy.' : 'HS xác định cách thức triển khai (cá nhân hoặc nhóm).',
            step3Teacher: isEn ? 'Teacher explains evaluation rubric.' : 'GV nêu rõ tiêu chí đánh giá sản phẩm.',
            step3Student: isEn ? 'Students clarify any questions.' : 'HS đặt câu hỏi nếu chưa rõ.',
            step4Teacher: isEn ? 'Teacher concludes the lesson.' : 'GV dặn dò chuẩn bị cho tiết học tiếp theo.',
            step4Student: isEn ? 'Students conclude and tidy workspace.' : 'HS đứng chào giáo viên và thu dọn đồ dùng.'
          }
        }
      ],
      mindmap: {
        id: `mm-${id}`,
        label: title.toUpperCase(),
        children: [
          {
            id: `mm-${id}-1`,
            label: isEn ? '1. Core Knowledge' : '1. Kiến thức cốt lõi',
            children: [
              { id: `mm-${id}-1-1`, label: isEn ? 'Definitions & Principles' : 'Khái niệm & Định nghĩa cơ bản' },
              { id: `mm-${id}-1-2`, label: isEn ? 'Key Formulas & Rules' : 'Quy tắc & Định lý trọng tâm' }
            ]
          },
          {
            id: `mm-${id}-2`,
            label: isEn ? '2. Methods & Skills' : '2. Kĩ năng & Phương pháp',
            children: [
              { id: `mm-${id}-2-1`, label: params.options.teachingMethod || (isEn ? 'Inquiry Process' : 'Quy trình giải quyết vấn đề') },
              { id: `mm-${id}-2-2`, label: isEn ? 'Common Mistakes to Avoid' : 'Các lỗi sai thường gặp cần tránh' }
            ]
          },
          {
            id: `mm-${id}-3`,
            label: isEn ? '3. Practical Applications' : '3. Ứng dụng thực tiễn & STEM',
            children: [
              { id: `mm-${id}-3-1`, label: params.options.customIntegration || (isEn ? 'Real-world Context' : 'Liên hệ đời sống & Khoa học') },
              { id: `mm-${id}-3-2`, label: params.options.nls ? 'Năng lực số & AI 2025' : (isEn ? 'Extension Project' : 'Dự án mở rộng') }
            ]
          }
        ]
      },
      slides: [
        {
          slideNumber: 1,
          title: title.toUpperCase(),
          subtitle: `${params.subject} - ${params.grade} (${params.textbook})`,
          bullets: [
            isEn ? `Duration: ${params.periodsCount} periods` : `Số tiết: ${params.periodsCount} tiết`,
            params.options.nls ? 'Tích hợp NLS (TT 02/2025 & CV 3456/BGDĐT)' : 'Công văn 5512/BGDĐT',
            params.options.aiEducation ? 'Tích hợp Giáo dục AI (QĐ 2422/QĐ-BGDĐT)' : 'Phát triển phẩm chất & năng lực'
          ]
        },
        {
          slideNumber: 2,
          title: isEn ? 'Objectives & Competencies' : 'Mục Tiêu & Năng Lực Bài Học',
          bullets: [
            isEn ? 'Knowledge: Master essential definitions and formulas' : 'Kiến thức: Chiếm lĩnh khái niệm và công thức trọng tâm',
            isEn ? 'General competencies: Autonomy, communication, and problem solving' : 'Năng lực chung: Tự chủ, giao tiếp và giải quyết vấn đề',
            params.options.stemLesson ? 'Năng lực STEM: Thiết kế kĩ thuật (CV 3089/908)' : 'Phẩm chất: Chăm chỉ, trung thực, trách nhiệm'
          ]
        },
        {
          slideNumber: 3,
          title: isEn ? 'Learning Journey' : 'Tiến Trình 4 Hoạt Động',
          bullets: [
            `1. Khởi động: ${params.options.warmupType || 'Tình huống thực tiễn'}`,
            `2. Khám phá kiến thức (${params.options.teachingMethod || 'Dạy học tích cực'})`,
            '3. Luyện tập & Vận dụng sáng tạo'
          ]
        }
      ]
    };
  }
}
