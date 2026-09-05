import React, { createContext, useContext, useState, useEffect } from 'react';
import { LessonPlan, Subject, GradeLevel, GeminiModelId } from '../types';
import { SAMPLE_LESSONS } from '../data/sampleLessons';
import { GeminiService, GenerateParams } from '../services/geminiService';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface LessonContextType {
  activeLesson: LessonPlan | null;
  library: LessonPlan[];
  activeView: 'studio' | 'library' | 'guidelines';
  isGenerating: boolean;
  generationProgress: string;
  selectedModel: GeminiModelId;
  searchQuery: string;
  filterGrade: string;
  filterSubject: string;
  setSelectedModel: (model: GeminiModelId) => void;
  setActiveView: (view: 'studio' | 'library' | 'guidelines') => void;
  setActiveLesson: (lesson: LessonPlan | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterGrade: (grade: string) => void;
  setFilterSubject: (subject: string) => void;
  createLessonPlan: (params: Omit<GenerateParams, 'apiKey' | 'modelId'>) => Promise<void>;
  updateActiveLesson: (updates: Partial<LessonPlan>) => void;
  deleteLessonPlan: (id: string) => void;
  duplicateLessonPlan: (id: string) => void;
  loadSampleLesson: (id: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

const LESSON_LIBRARY_KEY = 'khbd_library_v2';

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { geminiApiKey } = useAuth();

  const [library, setLibrary] = useState<LessonPlan[]>(() => {
    try {
      const saved = localStorage.getItem(LESSON_LIBRARY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_LESSONS;
    } catch {
      return SAMPLE_LESSONS;
    }
  });

  const [activeLesson, setActiveLesson] = useState<LessonPlan | null>(() => {
    return library[0] || SAMPLE_LESSONS[0];
  });

  const [activeView, setActiveView] = useState<'studio' | 'library' | 'guidelines'>('studio');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3.8-flash');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem(LESSON_LIBRARY_KEY, JSON.stringify(library));
    } catch (e) {
      console.error('Failed to persist library:', e);
    }
  }, [library]);

  const createLessonPlan = async (params: Omit<GenerateParams, 'apiKey' | 'modelId'>) => {
    setIsGenerating(true);
    setGenerationProgress('Bắt đầu khởi tạo cấu trúc...');
    try {
      const newPlan = await GeminiService.generateLessonPlan(
        {
          ...params,
          apiKey: geminiApiKey,
          modelId: selectedModel,
        },
        (status) => setGenerationProgress(status)
      );

      setLibrary((prev) => [newPlan, ...prev]);
      setActiveLesson(newPlan);
      setActiveView('studio');

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#8b5cf6'],
        });
      } catch {}
    } catch (err) {
      console.error('Error in createLessonPlan:', err);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const updateActiveLesson = (updates: Partial<LessonPlan>) => {
    if (!activeLesson) return;
    const updated = { ...activeLesson, ...updates, updatedAt: new Date().toISOString() };
    setActiveLesson(updated);
    setLibrary((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const deleteLessonPlan = (id: string) => {
    setLibrary((prev) => prev.filter((item) => item.id !== id));
    if (activeLesson?.id === id) {
      const remaining = library.filter((item) => item.id !== id);
      setActiveLesson(remaining[0] || null);
    }
  };

  const duplicateLessonPlan = (id: string) => {
    const target = library.find((item) => item.id === id);
    if (!target) return;
    const clone: LessonPlan = {
      ...target,
      id: 'lesson-' + Date.now(),
      title: `${target.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLibrary((prev) => [clone, ...prev]);
    setActiveLesson(clone);
  };

  const loadSampleLesson = (id: string) => {
    const found = library.find((item) => item.id === id) || SAMPLE_LESSONS.find((item) => item.id === id);
    if (found) {
      setActiveLesson(found);
      setActiveView('studio');
    }
  };

  return (
    <LessonContext.Provider
      value={{
        activeLesson,
        library,
        activeView,
        isGenerating,
        generationProgress,
        selectedModel,
        searchQuery,
        filterGrade,
        filterSubject,
        setSelectedModel,
        setActiveView,
        setActiveLesson,
        setSearchQuery,
        setFilterGrade,
        setFilterSubject,
        createLessonPlan,
        updateActiveLesson,
        deleteLessonPlan,
        duplicateLessonPlan,
        loadSampleLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};
