import React, { useState } from 'react';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { DocxExportService } from '../../services/docxExportService';
import { PptxExportService } from '../../services/pptxExportService';
import { Bot, GitBranch, Presentation, Send, FileDown } from 'lucide-react';
import { MindmapNode } from '../../types';

export const CopilotPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeLesson } = useLesson();

  const [activeTab, setActiveTab] = useState<'mindmap' | 'slides' | 'chat'>('mindmap');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Kính chào Thầy/Cô! Tôi là Trợ lý Sư phạm AI đồng hành. Thầy/Cô cần gợi ý trò chơi khởi động, câu hỏi trắc nghiệm hay tinh chỉnh thời gian cho bài học này?',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();
      if (lower.includes('trắc nghiệm') || lower.includes('câu hỏi')) {
        reply = `📝 Gợi ý 3 câu hỏi trắc nghiệm phân hóa cho "${activeLesson?.title || 'bài học'}":\n\n1. [Nhận biết] Khái niệm cốt lõi của bài học là gì?\nA. Đáp án đúng\nB. Đáp án nhiễu 1\nC. Đáp án nhiễu 2\nD. Đáp án nhiễu 3\n👉 Đáp án: A\n\n2. [Thông hiểu] Điều kiện nào sau đây quyết định tính chất bài toán?\n👉 Giải thích chi tiết theo SGK hiện hành.`;
      } else if (lower.includes('khởi động') || lower.includes('trò chơi')) {
        reply = `🎯 Gợi ý Trò chơi Khởi động: "Mảnh Ghép Bí Mật" (5 phút)\n- GV chuẩn bị 4 mảnh ghép câu hỏi ngắn.\n- HS trả lời đúng từng mảnh ghép để lật mở bức tranh chủ đề của bài học "${activeLesson?.title}".\n- Tác dụng: Kích thích tò mò và gắn kết ngay từ đầu giờ.`;
      } else if (lower.includes('học sinh yếu') || lower.includes('hạ độ khó')) {
        reply = `💡 Biện pháp hỗ trợ học sinh trung bình/yếu:\n- Cung cấp Phiếu gợi ý công thức mẫu (step-by-step).\n- Phân công bạn học khá ngồi cạnh hỗ trợ (học tập đôi bạn cùng tiến).\n- Chia nhỏ các yêu cầu tính toán thành từng bước nhỏ.`;
      } else {
        reply = `Đã ghi nhận yêu cầu của Thầy/Cô về "${userText}". Tôi đã bổ sung các gợi ý sư phạm phù hợp với đối tượng học sinh và chương trình GDPT 2018.`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 500);
  };

  const handleExportDocx = () => {
    if (activeLesson) {
      DocxExportService.exportLessonPlanToDocx(activeLesson, currentUser);
    }
  };

  const handleExportPptx = () => {
    if (activeLesson) {
      PptxExportService.exportSlideDeck(activeLesson);
    }
  };

  // Render SVG Mindmap Tree recursively
  const renderMindmapNode = (node: MindmapNode, depth = 0) => {
    return (
      <div key={node.id} className={`space-y-2 ${depth > 0 ? 'ml-4 pl-3 border-l-2 border-sky-300' : ''}`}>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
            depth === 0
              ? 'bg-sky-600 text-white font-bold'
              : depth === 1
              ? 'bg-white text-sky-800 border border-sky-300 shadow-xs'
              : 'bg-slate-100 text-slate-700 border border-slate-200 text-[11px]'
          }`}
        >
          <GitBranch className="w-3 h-3 text-sky-500" />
          <span>{node.label}</span>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {node.children.map((child) => renderMindmapNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-sky-600" />
          <span className="text-sm font-bold text-slate-900">AI Pedagogical Copilot</span>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'mindmap'
                ? 'bg-white text-sky-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sơ Đồ Tư Duy
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'slides'
                ? 'bg-white text-sky-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kịch Bản Slide
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-sky-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hỏi Đáp AI
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {activeTab === 'mindmap' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[300px]">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Sơ đồ cấu trúc bài dạy</span>
              <span className="text-sky-600 text-[10px] font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">Tự động bóc tách</span>
            </div>
            {activeLesson?.mindmap ? (
              renderMindmapNode(activeLesson.mindmap)
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Chưa có sơ đồ tư duy. Hãy chọn hoặc tạo bài dạy mới.
              </div>
            )}
          </div>
        )}

        {activeTab === 'slides' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 pb-1">
              <span>Kịch bản phân bổ {activeLesson?.slides?.length || 0} slide bài giảng:</span>
              <button
                onClick={handleExportPptx}
                className="text-sky-600 hover:text-sky-700 flex items-center gap-1 text-[11px] font-bold"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Xuất Trình Chiếu</span>
              </button>
            </div>

            {activeLesson?.slides && activeLesson.slides.length > 0 ? (
              activeLesson.slides.map((slide) => (
                <div key={slide.slideNumber} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-sky-800">
                      Slide {slide.slideNumber}: {slide.title}
                    </span>
                  </div>
                  {slide.subtitle && (
                    <div className="text-[11px] text-slate-500 mb-2 italic">{slide.subtitle}</div>
                  )}
                  <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                    {slide.bullets.map((b, i) => (
                      <li key={i} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Chưa có kịch bản slide. Hãy tạo bài dạy trước.
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-[380px]">
            <div className="flex-1 overflow-y-auto space-y-3 p-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Hỏi AI về bài dạy... (Enter để gửi)"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setChatInput('Tạo câu hỏi trắc nghiệm phân hóa')}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-sky-800 border border-slate-200"
              >
                + Câu hỏi trắc nghiệm
              </button>
              <button
                type="button"
                onClick={() => setChatInput('Gợi ý trò chơi khởi động hấp dẫn')}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-sky-800 border border-slate-200"
              >
                + Trò chơi khởi động
              </button>
              <button
                type="button"
                onClick={() => setChatInput('Hạ độ khó cho học sinh yếu')}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-sky-800 border border-slate-200"
              >
                + Hỗ trợ HS yếu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Export Actions at bottom */}
      <div className="pt-3 mt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={handleExportDocx}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Xuất Word (.docx)</span>
        </button>

        <button
          onClick={handleExportPptx}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Xuất Slide (.pptx)</span>
        </button>
      </div>
    </div>
  );
};
