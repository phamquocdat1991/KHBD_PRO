import React, { useState } from 'react';
import { GeminiService } from '../../services/geminiService';
import { useLesson } from '../../context/LessonContext';
import { useAuth } from '../../context/AuthContext';
import { DocxExportService } from '../../services/docxExportService';
import { PptxExportService } from '../../services/pptxExportService';
import { Bot, GitBranch, Presentation, Send, FileDown } from 'lucide-react';
import { LessonMindmap } from './LessonMindmap';
import { MindmapNode } from '../../types';
import { LessonImagesPanel } from './LessonImagesPanel';

export const CopilotPanel: React.FC = () => {
  const { currentUser, geminiApiKey } = useAuth();
  const { activeLesson, selectedModel } = useLesson();
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');

  const [activeTab, setActiveTab] = useState<'mindmap' | 'slides' | 'chat' | 'images'>('mindmap');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Kính chào Thầy/Cô! Tôi là Trợ lý Sư phạm AI đồng hành. Thầy/Cô cần gợi ý trò chơi khởi động, câu hỏi trắc nghiệm hay tinh chỉnh thời gian cho bài học này?',
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSending) return;
    if (!activeLesson) { setChatError('Hãy mở một bài dạy trước khi hỏi AI.'); return; }
    const userText=chatInput.trim();
    setChatError(''); setIsSending(true);
    try {
      const reply=await GeminiService.answerLessonQuestion(activeLesson,userText,geminiApiKey,selectedModel,messages.filter((_,i)=>i>0));
      setMessages(prev=>[...prev,{role:'user',text:userText},{role:'assistant',text:reply}]);
      setChatInput('');
    } catch(error) { setChatError(error instanceof Error?error.message:'Không nhận được câu trả lời. Hãy thử lại.'); }
    finally { setIsSending(false); }
  };

  const handleExportDocx = async () => {
    if (activeLesson) {
      try { await DocxExportService.exportLessonPlanToDocx(activeLesson, currentUser); } catch(error) { setChatError(`Không xuất được Word. ${error instanceof Error ? error.message : 'Vui lòng thử lại.'}`); }
    }
  };

  const handleExportPptx = async () => {
    if (activeLesson) {
      try { await PptxExportService.exportSlideDeck(activeLesson); } catch(error) { setChatError(error instanceof Error ? error.message : 'Không xuất được PowerPoint.'); }
    }
  };

  // Render SVG Mindmap Tree recursively
  const renderMindmapNode = (node: MindmapNode, depth = 0) => {
    return (
      <div key={node.id} data-depth={depth} className={`space-y-2 ${depth > 0 ? 'ml-4 pl-3 border-l-2 border-sky-300' : ''}`}>
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
    <div className="copilot-panel flex flex-col h-full bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm overflow-hidden">
      {/* Header Tabs */}
      <div className="flex flex-wrap gap-3 items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-sky-600" />
          <span className="text-sm font-bold text-slate-900">Copilot</span>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200/60">
          <button onClick={()=>setActiveTab('images')} className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${activeTab==='images'?'bg-white text-sky-700 shadow-sm':'text-slate-600'}`}>Hình minh họa</button>
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

      {chatError && <p role="alert" className="mb-3 text-xs text-rose-700">{chatError}</p>}
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        <div hidden={activeTab!=='images'}><LessonImagesPanel key={activeLesson?.id}/></div>
        {activeTab === 'mindmap' && (
          <div className="mindmap-surface p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Sơ đồ cấu trúc bài dạy</span>
              <span className="text-sky-600 text-[10px] font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">Tự động bóc tách</span>
            </div>
            {activeLesson?.mindmap ? (
              <>
                <LessonMindmap root={activeLesson.mindmap} />
                <details className="mindmap-details"><summary>Xem đầy đủ nội dung sơ đồ</summary>{renderMindmapNode(activeLesson.mindmap)}</details>
              </>
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

        {activeTab !== 'slides' && (
          <section className="copilot-chat flex flex-col">
            <h3>Trợ lý sư phạm AI</h3>
            <p className="chat-context">{activeLesson ? `Đang trao đổi: ${activeLesson.title}` : 'Chọn một bài trong thư viện để bắt đầu.'}</p>
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
                aria-label="Câu hỏi cho trợ lý sư phạm"
                disabled={isSending || !activeLesson}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Hỏi AI về bài dạy... (Enter để gửi)"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                aria-label="Gửi câu hỏi AI"
                disabled={isSending || !chatInput.trim() || !activeLesson}
                className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setChatInput('Tạo câu hỏi trắc nghiệm phân hóa')}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-sky-800 border border-slate-200"
              >
                + Câu hỏi trắc nghiệm
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => setChatInput('Gợi ý trò chơi khởi động hấp dẫn')}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-sky-800 border border-slate-200"
              >
                + Trò chơi khởi động
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => setChatInput('Hạ độ khó cho học sinh yếu')}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-sky-800 border border-slate-200"
              >
                + Hỗ trợ HS yếu
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Quick Export Actions at bottom */}
      <div className="pt-3 mt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={handleExportDocx}
          disabled={!activeLesson}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Xuất Word (.docx)</span>
        </button>

        <button
          onClick={handleExportPptx}
          disabled={!activeLesson?.slides?.length}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Xuất Slide (.pptx)</span>
        </button>
      </div>
    </div>
  );
};
