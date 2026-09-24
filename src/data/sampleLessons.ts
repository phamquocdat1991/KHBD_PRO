import { LessonPlan } from '../types';

export const SAMPLE_LESSONS: LessonPlan[] = [
  {
    id: 'lesson-math-11-01',
    title: 'Phương trình lượng giác cơ bản',
    subject: 'Toán',
    grade: 'Lớp 11',
    textbook: 'Cánh Diều',
    periodsCount: 2,
    tableFormat: '2col',
    language: 'vi',
    status: 'completed',
    coreContent: 'Định nghĩa và công thức nghiệm phương trình sin x = m, cos x = m. Điều kiện có nghiệm và các trường hợp đặc biệt.',
    createdAt: '2026-09-02T08:30:00.000Z',
    updatedAt: '2026-09-02T10:15:00.000Z',
    options: {
      nls: true,
      aiEducation: true,
      stemLesson: false,
      teachingMethod: 'Dạy học giải quyết vấn đề kết hợp Khám phá số',
      warmupType: 'Video tình huống thực tế (Vòng quay Mặt Trời)',
      customIntegration: 'Tích hợp liên môn Vật lí (Dao động điều hòa)',
      gdqpan: false,
      timeline: true,
      mathFormulas: true,
      worksheets: true,
    },
    objectives: {
      knowledge: [
        'Nhận biết và giải thành thạo phương trình lượng giác cơ bản: sin x = m, cos x = m.',
        'Xác định chính xác điều kiện có nghiệm (|m| ≤ 1) và biểu diễn họ nghiệm trên đường tròn lượng giác.',
        'Vận dụng giải các bài toán thực tiễn đơn giản liên quan đến dao động điều hòa.'
      ],
      generalCompetencies: [
        'Năng lực tự chủ và tự học: Tự giác nghiên cứu tài liệu sách giáo khoa và video minh họa.',
        'Năng lực giao tiếp và hợp tác: Tương tác nhóm giải bài tập và tranh luận cách viết công thức nghiệm.'
      ],
      specificCompetencies: [
        'Năng lực tư duy và lập luận toán học: So sánh và rút ra tính tuần hoàn của hàm lượng giác.',
        'Năng lực giải quyết vấn đề toán học: Biến đổi linh hoạt giữa radian và độ.'
      ],
      digitalCompetencies: [
        'Sử dụng phần mềm vẽ đồ thị GeoGebra trực tuyến để quan sát giao điểm giữa đường thẳng y = m và đồ thị y = sin x (Thông tư 02/2025 & CV 3456/BGDĐT).',
        'Khai thác máy tính khoa học cầm tay Casio để dò nghiệm lượng giác và chuyển đổi radian - độ.'
      ],
      aiCompetencies: [
        'Hiểu cách thức các thuật toán máy tính và AI nhận diện mẫu chu kỳ dao động tuần hoàn (Khung QĐ 2422/QĐ-BGDĐT).',
        'Sử dụng AI trợ lý học tập để kiểm tra chéo các bước biến đổi lượng giác phức tạp.'
      ],
      qualities: [
        'Chăm chỉ: Rèn luyện tính cẩn thận, chính xác khi viết các họ nghiệm có đuôi + k2π (k ∈ ℤ).',
        'Trách nhiệm: Hoàn thành đầy đủ nhiệm vụ học tập nhóm được phân công.'
      ]
    },
    teachingEquipment: {
      teacher: [
        'Máy chiếu/Tivi thông minh kết nối máy tính, phần mềm trình chiếu GeoGebra.',
        'Bộ phiếu học tập số 1 và số 2 (in giấy hoặc gửi qua nhóm học tập).',
        'Mô hình động đường tròn lượng giác số.'
      ],
      student: [
        'Sách giáo khoa Toán 11 (Cánh Diều), vở ghi, thước kẻ, compa.',
        'Máy tính bỏ túi khoa học, điện thoại/máy tính bảng (nếu được phép).'
      ]
    },
    activities: [
      {
        id: 'act-1',
        activityNumber: 1,
        title: 'Hoạt động 1: Khởi động (Mở đầu)',
        durationMinutes: 7,
        objective: 'Tạo tâm thế hứng thú, kết nối kiến thức đồ thị hàm số lượng giác với bài toán tìm giao điểm để dẫn dắt vào phương trình sin x = m.',
        content: 'HS quan sát hình ảnh chiếc đu quay chuyển động tuần hoàn và bài toán xác định thời điểm người ngồi trên cabin đạt độ cao 15m.',
        product: 'Câu trả lời miệng của học sinh và phương trình mô hình hóa thiết lập được: sin(πt/30) = 1/2.',
        implementation: {
          step1Teacher: 'GV trình chiếu video ngắn về vòng quay Mặt Trời (Sun Wheel), đưa ra câu hỏi gợi mở: "Làm thế nào để tính chính xác những thời điểm cabin ở vị trí độ cao 15 mét so với mặt đất?"',
          step1Student: 'HS quan sát hình ảnh, lắng nghe nhiệm vụ và suy nghĩ liên hệ kiến thức hàm số sin đã học ở bài trước.',
          step2Teacher: 'GV quan sát các nhóm trao đổi nhanh (2 phút), khuyến khích HS biểu diễn góc quay tương ứng trên đường tròn.',
          step2Student: 'HS thảo luận theo cặp bàn, đưa ra dự đoán về số lần cabin đạt độ cao đó trong một vòng quay.',
          step3Teacher: 'GV mời đại diện 1 HS nêu phương trình thiết lập được và nhận xét sơ bộ.',
          step3Student: 'Đại diện HS đứng tại chỗ trả lời: Ta cần giải phương trình dạng sin(góc) = một số thực m.',
          step4Teacher: 'GV nhận xét, chuẩn hóa câu trả lời và dẫn dắt vào bài mới: "Để giải bài toán này và các bài toán tương tự, hôm nay chúng ta cùng tìm hiểu Phương trình lượng giác cơ bản".',
          step4Student: 'HS ghi tên bài mới vào vở và xác định mục tiêu bài học.'
        }
      },
      {
        id: 'act-2',
        activityNumber: 2,
        title: 'Hoạt động 2: Hình thành kiến thức mới',
        durationMinutes: 20,
        objective: 'Học sinh phát biểu được điều kiện có nghiệm và công thức nghiệm của phương trình sin x = m.',
        content: 'Nghiên cứu hình vẽ giao điểm đồ thị y = sin x và đường thẳng y = m. Xây dựng công thức nghiệm tổng quát với k ∈ ℤ.',
        product: 'Kết quả hoàn thành Phiếu học tập số 1 và công thức nghiệm được ghi vào vở: sin x = sin α ⇔ x = α + k2π hoặc x = π - α + k2π (k ∈ ℤ).',
        implementation: {
          step1Teacher: 'GV phát Phiếu học tập số 1, yêu cầu HS mở GeoGebra thay đổi giá trị m từ -2 đến 2.',
          step1Student: 'HS nhận phiếu học tập, quan sát sự di chuyển của đường thẳng y = m cắt đồ thị hình sin.',
          step2Teacher: 'GV đi vòng quanh lớp, gợi ý các nhóm yếu chú ý đến miền giá trị [-1; 1] của hàm sin x.',
          step2Student: 'HS thảo luận nhóm 4 người: Kết luận khi |m| > 1 thì đường thẳng không cắt đồ thị (vô nghiệm); khi |m| ≤ 1 có vô số giao điểm.',
          step3Teacher: 'GV gọi nhóm 2 trình bày kết quả phiếu học tập; mời nhóm 5 nhận xét và bổ sung.',
          step3Student: 'Đại diện nhóm 2 lên bảng viết công thức nghiệm. Nhóm 5 đặt câu hỏi tại sao nghiệm thứ hai lại có dạng (π - α).',
          step4Teacher: 'GV chốt kiến thức: Nhấn mạnh hai cung bù nhau có cùng giá trị sin, giải thích ý nghĩa của chu kỳ 2π và số nguyên k.',
          step4Student: 'HS lắng nghe, ghi chép nội dung trọng tâm vào vở, thực hành bấm máy tính tìm góc lượng giác tương ứng.'
        }
      },
      {
        id: 'act-3',
        activityNumber: 3,
        title: 'Hoạt động 3: Luyện tập',
        durationMinutes: 12,
        objective: 'Củng cố kĩ năng giải phương trình sin x = m với m đặc biệt (0, 1, -1) và m tùy ý; xử lý linh hoạt đơn vị độ và radian.',
        content: 'HS làm việc cá nhân giải các câu hỏi trong Phiếu bài tập: a) sin x = 1/2; b) sin 2x = -√3/2; c) sin(x + 30°) = 0.',
        product: 'Bài làm trong vở của học sinh và lời giải chi tiết trên bảng phụ.',
        implementation: {
          step1Teacher: 'GV giao 3 bài tập trên màn chiếu, yêu cầu 3 HS lên bảng thực hiện tương ứng 3 câu.',
          step1Student: 'Cả lớp làm bài cá nhân vào vở, 3 HS lên bảng làm bài.',
          step2Teacher: 'GV theo dõi tiến trình làm bài của lớp, kịp thời sửa lỗi quên đuôi "+ k2π".',
          step2Student: 'HS hoàn thiện bài tập, kiểm tra chéo đáp số với bạn cùng bàn.',
          step3Teacher: 'GV yêu cầu HS dưới lớp nhận xét bài làm của 3 bạn trên bảng.',
          step3Student: 'HS nhận xét về tính chính xác, cách trình bày và lưu ý điều kiện k ∈ ℤ.',
          step4Teacher: 'GV chấm điểm, tuyên dương học sinh làm tốt, nhắc nhở các sai lầm thường gặp khi đổi dấu góc âm.',
          step4Student: 'HS sửa sai (nếu có) và đóng khung các trường hợp đặc biệt vào sổ tay ghi nhớ.'
        }
      },
      {
        id: 'act-4',
        activityNumber: 4,
        title: 'Hoạt động 4: Vận dụng',
        durationMinutes: 6,
        objective: 'Vận dụng kiến thức phương trình lượng giác để giải quyết trọn vẹn bài toán chiếc đu quay ban đầu.',
        content: 'Giải phương trình sin(πt/30) = 1/2 để tìm các thời điểm t trong 60 giây đầu tiên.',
        product: 'Báo cáo ngắn gọn kết quả thời gian: t = 5 giây và t = 25 giây.',
        implementation: {
          step1Teacher: 'GV đưa lại bài toán thực tế đầu giờ, giao nhiệm vụ mở rộng về nhà tìm hiểu chu kỳ dao động của sóng điện từ.',
          step1Student: 'HS đọc đề bài, áp dụng công thức vừa học để tính toán giá trị thời gian t.',
          step2Teacher: 'GV hướng dẫn HS kiểm tra điều kiện vật lý: 0 ≤ t ≤ 60 giây.',
          step2Student: 'HS thay k = 0, k = 1 để tìm các nghiệm thực tế phù hợp.',
          step3Teacher: 'GV cho 1 HS chia sẻ kết quả nhanh qua mic.',
          step3Student: 'HS trả lời: Trong 1 phút đầu tiên, cabin đạt độ cao 15m tại thời điểm giây thứ 5 và giây thứ 25.',
          step4Teacher: 'GV tổng kết tiết học, giao nhiệm vụ bài tập về nhà.',
          step4Student: 'HS ghi nhận bài tập về nhà và dọn dẹp bàn học.'
        }
      }
    ],
    mindmap: {
      id: 'mm-root',
      label: 'PHƯƠNG TRÌNH LƯỢNG GIÁC CƠ BẢN',
      children: [
        {
          id: 'mm-1',
          label: 'Điều kiện có nghiệm',
          children: [
            { id: 'mm-1-1', label: '|m| ≤ 1: Có nghiệm' },
            { id: 'mm-1-2', label: '|m| > 1: Vô nghiệm' }
          ]
        },
        {
          id: 'mm-2',
          label: 'Công thức nghiệm sin x = sin α',
          children: [
            { id: 'mm-2-1', label: 'x = α + k2π (k ∈ ℤ)' },
            { id: 'mm-2-2', label: 'x = π - α + k2π (k ∈ ℤ)' }
          ]
        },
        {
          id: 'mm-3',
          label: 'Trường hợp đặc biệt',
          children: [
            { id: 'mm-3-1', label: 'sin x = 0 ⇔ x = kπ' },
            { id: 'mm-3-2', label: 'sin x = 1 ⇔ x = π/2 + k2π' },
            { id: 'mm-3-3', label: 'sin x = -1 ⇔ x = -π/2 + k2π' }
          ]
        }
      ]
    },
    slides: [
      {
        slideNumber: 1,
        title: 'BÀI GIẢNG: PHƯƠNG TRÌNH LƯỢNG GIÁC CƠ BẢN',
        subtitle: 'Môn Toán 11 – Cánh Diều',
        bullets: [
          'Giáo viên: Thầy Nguyễn Nam',
          'Tích hợp Năng lực số (TT 02/2025 & CV 3456)',
          'Tích hợp Giáo dục AI (QĐ 2422/QĐ-BGDĐT)'
        ]
      },
      {
        slideNumber: 2,
        title: '1. Khởi động: Vòng quay Mặt Trời',
        bullets: [
          'Quan sát chuyển động tuần hoàn',
          'Mô hình hóa chiều cao theo hàm sin',
          'Xác định thời điểm đạt độ cao 15m'
        ]
      }
    ],
    worksheetsAppendix: [
      'PHIẾU HỌC TẬP SỐ 1: KHÁM PHÁ CÔNG THỨC NGHIỆM SIN X = M\n1. Dùng GeoGebra quan sát tương giao giữa đồ thị $y = \\sin x$ và đường thẳng $y = m$.\n2. Khi $|m| \\le 1$, viết họ tất cả các nghiệm: $x = \\alpha + k2\\pi$ hoặc $x = \\pi - \\alpha + k2\\pi\\;(k \\in \\mathbb{Z})$.\n3. Áp dụng giải phương trình: $\\sin x = \\frac{1}{2}$.',
      'PHIẾU HỌC TẬP SỐ 2: VẬN DỤNG THỰC TẾ\n1. Thiết lập phương trình dao động đu quay: $\\sin(\\frac{\\pi t}{30}) = \\frac{1}{2}$ với $0 \\le t \\le 60$ giây.\n2. Xác định các thời điểm cabin đạt độ cao 15 mét.'
    ]
  },
  {
    id: 'lesson-lit-10-02',
    title: 'Chữ người tử tù (Nguyễn Tuân)',
    subject: 'Ngữ văn',
    grade: 'Lớp 10',
    textbook: 'Kết nối tri thức với cuộc sống',
    periodsCount: 2,
    tableFormat: '2col',
    language: 'vi',
    status: 'completed',
    coreContent: 'Phân tích vẻ đẹp hình tượng Huấn Cao (tài hoa, khí phách thiên lương) và cảnh cho chữ xưa nay chưa từng có.',
    createdAt: '2026-09-01T14:00:00.000Z',
    updatedAt: '2026-09-01T16:20:00.000Z',
    options: {
      nls: true,
      aiEducation: false,
      stemLesson: false,
      teachingMethod: 'Dạy học theo trạm kết hợp Đọc hiểu thẩm mỹ',
      warmupType: 'Trải nghiệm video thư pháp truyền thống',
      customIntegration: 'Giáo dục lòng tự hào văn hóa dân tộc',
      gdqpan: false,
      timeline: true,
      mathFormulas: false,
      worksheets: true,
    },
    objectives: {
      knowledge: [
        'Cảm nhận được vẻ đẹp hình tượng Huấn Cao: sự thống nhất giữa cái Tài, cái Dũng và cái Thiện.',
        'Phân tích được nghệ thuật xây dựng tình huống truyện độc đáo và cảnh tượng cho chữ trang trọng nơi ngục tù.'
      ],
      generalCompetencies: [
        'Tự chủ và tự học: Tìm đọc các tác phẩm trong tập "Vang bóng một thời".',
        'Giao tiếp và hợp tác: Trình bày cảm thụ văn học theo nhóm chuyên gia.'
      ],
      specificCompetencies: [
        'Năng lực thẩm mỹ văn học: Nhận diện phong cách nghệ thuật tài hoa, uyên bác của Nguyễn Tuân.'
      ],
      qualities: [
        'Yêu nước, trân trọng các giá trị văn hóa nghệ thuật truyền thống dân tộc (thư pháp).'
      ]
    },
    teachingEquipment: {
      teacher: ['Tranh ảnh tư liệu nghệ thuật thư pháp, video minh họa cảnh cho chữ'],
      student: ['Sách giáo khoa Ngữ văn 10 (KNTT), phiếu cảm thụ văn học']
    },
    activities: [
      {
        id: 'lit-act-1',
        activityNumber: 1,
        title: 'Hoạt động 1: Khởi động (Trải nghiệm Thư pháp)',
        durationMinutes: 8,
        objective: 'Tạo không khí văn hóa truyền thống, gợi mở thú chơi chữ thanh cao và trang nhã.',
        content: 'Xem video clip ngắn về ông đồ viết thư pháp ngày Tết.',
        product: 'Cảm xúc và suy nghĩ ban đầu của HS về câu đối và người viết chữ đẹp.',
        implementation: {
          step1Teacher: 'GV trình chiếu trích đoạn "Mỗi năm hoa đào nở / Lại thấy ông đồ già".',
          step1Student: 'HS lắng nghe và quan sát hình ảnh.',
          step2Teacher: 'GV đặt câu hỏi: "Tại sao người xưa lại trân quý nét chữ của người có tâm, có tài?"',
          step2Student: 'HS trao đổi nhanh 1 phút.',
          step3Teacher: 'GV mời 2 HS đại diện chia sẻ ý kiến.',
          step3Student: 'HS trả lời: Chữ viết thể hiện cái nết, cái tâm của người cầm bút.',
          step4Teacher: 'GV chốt ý và giới thiệu tác phẩm: Hôm nay chúng ta sẽ tìm hiểu người tử tù Huấn Cao.',
          step4Student: 'HS mở bài học mới trong SGK.'
        }
      }
    ]
  },
  {
    id: 'lesson-stem-phys-10-03',
    title: 'Thiết kế Mô hình Xe Chạy Bằng Phản Lực Khí (STEM)',
    subject: 'Vật lí',
    grade: 'Lớp 10',
    textbook: 'Cánh Diều',
    periodsCount: 3,
    tableFormat: '2col',
    language: 'vi',
    status: 'completed',
    coreContent: 'Vận dụng Định luật III Newton về tương tác và phản lực để thiết kế chế tạo xe phản lực từ vật liệu tái chế.',
    createdAt: '2026-08-28T09:00:00.000Z',
    updatedAt: '2026-08-28T11:45:00.000Z',
    options: {
      nls: true,
      aiEducation: true,
      stemLesson: true,
      teachingMethod: 'Dạy học STEM theo quy trình thiết kế kĩ thuật (EDP)',
      warmupType: 'Thí nghiệm phóng tên lửa bóng bay gợi mở',
      customIntegration: 'Giáo dục Bảo vệ Môi trường (Vật liệu tái chế)',
      gdqpan: true,
      timeline: true,
      mathFormulas: true,
      worksheets: true,
    },
    objectives: {
      knowledge: [
        'Vận dụng định luật III Newton: Trong mọi trường hợp, khi vật A tác dụng lên vật B một lực, thì vật B cũng tác dụng lại vật A một lực (F_AB = -F_BA).',
        'Giải thích nguyên lý chuyển động phản lực của tên lửa, bóng bay và các phương tiện hiện đại.'
      ],
      generalCompetencies: [
        'Giải quyết vấn đề và sáng tạo: Lên bản vẽ thiết kế, thử nghiệm và cải tiến mô hình xe phản lực.'
      ],
      specificCompetencies: [
        'Năng lực tìm hiểu thế giới tự nhiên dưới góc độ vật lí và năng lực công nghệ thiết kế mô hình.'
      ],
      stemCompetencies: [
        'Science (Khoa học): Định luật III Newton, lực cản không khí, ma sát lăn.',
        'Technology (Công nghệ): Sử dụng phần mềm mô phỏng chuyển động và đo vận tốc.',
        'Engineering (Kĩ thuật): Quy trình thiết kế kĩ thuật 5 bước (Xác định vấn đề -> Nghiên cứu kiến thức nền -> Thiết kế bản vẽ -> Chế tạo thử nghiệm -> Đánh giá cải tiến).',
        'Mathematics (Toán học): Tính toán tỉ số khối lượng, đo đạc khoảng cách và vận tốc trung bình.'
      ],
      digitalCompetencies: [
        'Sử dụng ứng dụng cảm biến Phyphox trên điện thoại thông minh để đo gia tốc và vận tốc xe (TT 02/2025 & CV 3456).'
      ],
      aiCompetencies: [
        'Ứng dụng AI phân tích dữ liệu thử nghiệm để đề xuất phương án tối ưu hình dáng khí động học (QĐ 2422/QĐ-BGDĐT).'
      ],
      qualities: [
        'Trung thực trong ghi chép số liệu thực nghiệm; tinh thần hợp tác nhóm và ý thức bảo vệ môi trường.'
      ]
    },
    teachingEquipment: {
      teacher: ['Bộ vật liệu mẫu, bệ phóng thử nghiệm, thước đo khoảng cách laser, máy quay tốc độ cao'],
      student: ['Vỏ chai nhựa, nắp chai, que xiên, ống hút, bóng bay, băng dính, kéo, súng bắn keo']
    },
    activities: [
      {
        id: 'stem-act-1',
        activityNumber: 1,
        title: 'Hoạt động 1: Xác định vấn đề (Giao nhiệm vụ thiết kế)',
        durationMinutes: 10,
        objective: 'Tiếp nhận thử thách STEM: Thiết kế chế tạo chiếc xe đồ chơi chạy bằng phản lực khí của quả bóng bay đạt quãng đường tối thiểu 3 mét.',
        content: 'Quan sát tên lửa bóng bay phóng trên dây dẫn hướng, nhận diện nguyên lý phản lực và tiêu chí sản phẩm.',
        product: 'Bản tiêu chí đánh giá sản phẩm xe phản lực khí được thống nhất trong lớp.',
        implementation: {
          step1Teacher: 'GV biểu diễn phóng quả bóng bay được bơm căng khí. Đặt câu hỏi: "Lực nào đã đẩy quả bóng bay về phía trước?"',
          step1Student: 'HS quan sát, liên hệ hiện tượng khi khí phụt ra phía sau thì bóng bay lao về phía trước.',
          step2Teacher: 'GV công bố thử thách STEM: Mỗi nhóm 4 HS sẽ chế tạo 1 chiếc xe phản lực từ vật liệu tái chế với tiêu chí: chạy thẳng, quãng đường ≥ 3m.',
          step2Student: 'Các nhóm thảo luận, ghi nhận tiêu chí kỹ thuật vào sổ tay STEM.',
          step3Teacher: 'GV cho đại diện các nhóm nhắc lại tiêu chí và phân công vai trò trong nhóm.',
          step3Student: 'Nhóm trưởng phân công: Kiến trúc sư (bản vẽ), Kỹ sư chế tạo, Chuyên viên đo lường, Báo cáo viên.',
          step4Teacher: 'GV chốt yêu cầu: Chuyển sang bước nghiên cứu kiến thức nền Định luật III Newton.',
          step4Student: 'HS sẵn sàng bước vào hoạt động tiếp theo.'
        }
      },
      {
        id: 'stem-act-2',
        activityNumber: 2,
        title: 'Hoạt động 2: Nghiên cứu kiến thức nền và Đề xuất giải pháp (Thiết kế)',
        durationMinutes: 35,
        objective: 'Nắm vững Định luật III Newton về tương tác lực: $\\vec{F}_{AB} = -\\vec{F}_{BA}$, vẽ được bản thiết kế xe phản lực với kích thước và thông số cụ thể.',
        content: 'Nghiên cứu nguyên lý phản lực khi khí thoát ra khỏi bóng bay; tính toán phân bố tải trọng và giảm ma sát trục bánh xe.',
        product: 'Bản vẽ kĩ thuật mô hình xe phản lực trên khổ giấy A3 kèm bảng kê vật liệu tái chế cần dùng.',
        implementation: {
          step1Teacher: 'GV hướng dẫn HS thí nghiệm ảo và ôn tập định luật III Newton, giải thích cơ chế phụt khí sinh phản lực.',
          step1Student: 'HS ghi chép công thức định luật III Newton, phân tích lực tác dụng lên thân xe.',
          step2Teacher: 'GV giao nhiệm vụ vẽ bản thiết kế: yêu cầu có kích thước (dài ≤ 20cm, rộng ≤ 10cm), vị trí gắn bóng và ống dẫn khí.',
          step2Student: 'Nhóm làm việc: Kiến trúc sư phác thảo bản vẽ, các thành viên phản biện và hoàn thiện phương án tối ưu.',
          step3Teacher: 'GV tổ chức cho các nhóm dán bản vẽ lên bảng và thuyết minh nhanh (2 phút/nhóm).',
          step3Student: 'Đại diện nhóm bảo vệ ý tưởng thiết kế, giải thích vì sao chọn hình dáng khí động học thuôn nhọn.',
          step4Teacher: 'GV nhận xét, góp ý chỉnh sửa về vị trí đặt trọng tâm xe để chống lật khi tăng tốc.',
          step4Student: 'Các nhóm tiếp thu góp ý, hoàn thiện bản vẽ kỹ thuật cuối cùng trước khi chế tạo.'
        }
      },
      {
        id: 'stem-act-3',
        activityNumber: 3,
        title: 'Hoạt động 3: Chế tạo mẫu thử nghiệm và Đánh giá (Thực hành)',
        durationMinutes: 40,
        objective: 'Lắp ráp hoàn chỉnh mô hình xe theo bản thiết kế; tiến hành thử nghiệm, đo đạc quãng đường bằng thước laser và ứng dụng Phyphox.',
        content: 'Chế tạo xe từ vỏ chai và nắp chai nhựa; thử nghiệm xả khí cho xe chạy trên đường đua lớp học.',
        product: 'Chiếc xe đồ chơi phản lực bóng bay hoàn chỉnh và bảng nhật ký thử nghiệm (quãng đường, độ lệch hướng, thời gian chạy).',
        implementation: {
          step1Teacher: 'GV nhắc nhở quy tắc an toàn khi dùng kéo và súng bắn keo, bàn giao vật liệu cho các nhóm.',
          step1Student: 'Các nhóm nhận vật liệu, phân công thành viên cắt gọt trục bánh xe, gắn ống thổi bóng bay.',
          step2Teacher: 'GV giám sát quá trình thao tác kỹ thuật, hỗ trợ căn chỉnh độ thẳng của 2 trục bánh xe.',
          step2Student: 'HS lắp ráp từng bộ phận, kiểm tra độ quay trơn của bánh xe trước khi gắn cố định bóng bay.',
          step3Teacher: 'GV mở đường đua thử nghiệm 5 mét có vạch chia centimet; tổ chức cho các nhóm chạy thử lần 1.',
          step3Student: 'Nhóm tiến hành bơm bóng bay (đường kính 15cm), đặt xe tại vạch xuất phát, mở van xả khí và bấm giờ.',
          step4Teacher: 'GV ghi nhận kết quả: các nhóm chưa đạt cự ly 3m hoặc bị quay tròn cần tiến hành hiệu chỉnh.',
          step4Student: 'HS ghi chép số liệu đo lường, phân tích nguyên nhân xe chạy lệch để sửa chữa kịp thời.'
        }
      },
      {
        id: 'stem-act-4',
        activityNumber: 4,
        title: 'Hoạt động 4: Chia sẻ, Thảo luận và Điều chỉnh (Báo cáo & Hoàn thiện)',
        durationMinutes: 35,
        objective: 'Báo cáo kết quả thử nghiệm chính thức; phân tích các yếu tố ảnh hưởng đến vận tốc xe; liên hệ ứng dụng phản lực trong đời sống.',
        content: 'Cuộc đua xe phản lực STEM chung kết; trình bày bài học kinh nghiệm và phương án nâng cấp động cơ 2 bóng bay.',
        product: 'Bài thuyết trình nhóm và sản phẩm xe đạt chuẩn tiêu chí kỹ thuật (quãng đường ≥ 3m, chạy thẳng).',
        implementation: {
          step1Teacher: 'GV tổ chức vòng thi đấu chung kết giữa các nhóm: mỗi đội có 2 lượt chạy lấy kết quả tốt nhất.',
          step1Student: 'Các đội thi đấu chính thức; cổ vũ và ghi nhận thành tích của nhóm bạn.',
          step2Teacher: 'GV hướng dẫn lớp thảo luận: "Yếu tố nào quyết định quãng đường đi xa nhất của xe?"',
          step2Student: 'HS thảo luận, chỉ ra: đường kính ống xả, khối lượng thân xe và độ ma sát của trục bánh xe.',
          step3Teacher: 'GV mời nhóm đạt thành tích tốt nhất chia sẻ bí quyết cân chỉnh cân bằng trọng tâm xe.',
          step3Student: 'Đội thắng cuộc báo cáo quy trình tối ưu: bôi trơn trục que xiên bằng sáp nến để giảm ma sát lăn.',
          step4Teacher: 'GV tổng kết bài học STEM, đánh giá theo phiếu tiêu chí Rubric và liên hệ với tên lửa vũ trụ.',
          step4Student: 'HS tự đánh giá đóng góp cá nhân trong nhóm và dọn dẹp vệ sinh khu vực chế tạo.'
        }
      }
    ],
    mindmap: {
      id: 'stem-mm-root',
      label: 'DỰ ÁN XE PHẢN LỰC KHÍ STEM',
      children: [
        {
          id: 'stem-mm-1',
          label: '1. Kiến thức nền tảng',
          children: [
            { id: 'stem-mm-1-1', label: 'Định luật III Newton (F_AB = -F_BA)' },
            { id: 'stem-mm-1-2', label: 'Nguyên lý phản lực phụt khí' },
            { id: 'stem-mm-1-3', label: 'Lực ma sát lăn và ma sát trượt' }
          ]
        },
        {
          id: 'stem-mm-2',
          label: '2. Quy trình thiết kế EDP',
          children: [
            { id: 'stem-mm-2-1', label: 'Xác định tiêu chí (quãng đường ≥ 3m)' },
            { id: 'stem-mm-2-2', label: 'Bản vẽ kĩ thuật & lựa chọn vật liệu' },
            { id: 'stem-mm-2-3', label: 'Chế tạo mẫu thử & Đo lường Phyphox' },
            { id: 'stem-mm-2-4', label: 'Thử nghiệm & Cải tiến trọng tâm' }
          ]
        }
      ]
    },
    slides: [
      {
        slideNumber: 1,
        title: 'DỰ ÁN STEM: XE ĐỒ CHƠI CHẠY BẰNG PHẢN LỰC KHÍ',
        subtitle: 'Môn Khoa học tự nhiên 7 – Bộ Cánh Diều',
        bullets: [
          'Ứng dụng Định luật III Newton',
          'Vận dụng quy trình thiết kế kĩ thuật 5 bước',
          'Tích hợp cảm biến đo lường số Phyphox'
        ]
      },
      {
        slideNumber: 2,
        title: 'Tiêu chí đánh giá sản phẩm',
        bullets: [
          'Chạy thẳng theo quỹ đạo đường đua',
          'Quãng đường di chuyển tối thiểu 3 mét',
          'Vật liệu chế tạo hoàn toàn từ rác thải tái chế'
        ]
      }
    ],
    worksheetsAppendix: [
      'PHIẾU HỌC TẬP STEM: BẢN THIẾT KẾ VÀ NHẬT KÝ THỬ NGHIỆM XE PHẢN LỰC\n1. Bản vẽ kĩ thuật mô hình xe: Ghi rõ chiều dài, chiều rộng, đường kính bánh xe và góc nghiêng của ống xả khí.\n2. Bảng kết quả thử nghiệm 3 lần chạy (Đo quãng đường bằng thước dây hoặc Phyphox):\n   - Lần 1: Quãng đường _____ m; Hiện tượng: ____________________\n   - Lần 2 (Sau cải tiến): Quãng đường _____ m; Hiện tượng: ____________________\n   - Lần 3 (Chung kết): Quãng đường _____ m; Tốc độ trung bình: _____ m/s.\n3. Nhóm đã thực hiện những cải tiến kỹ thuật nào để xe chạy xa hơn và không bị lệch hướng?'
    ]
  }
];
