import { AdvancedOptions } from '../types';

// generateContent JSON Schema: https://ai.google.dev/api/generate-content#v1beta.GenerationConfig
// Keep the error branch so unreadable sources never force a fabricated lesson.
export function lessonResponseSchema(options: AdvancedOptions) {
  const text = { type: 'string' };
  const list = (required = true) => ({ type: 'array', items: text, minItems: required ? 1 : 0 });
  const steps = ['step1Teacher', 'step1Student', 'step2Teacher', 'step2Student',
    'step3Teacher', 'step3Student', 'step4Teacher', 'step4Student'];
  const activityFields = ['title', 'objective', 'content', 'product', ...steps];
  const properties = {
    knowledgeObjectives: list(), generalCompetencies: list(), specificCompetencies: list(),
    digitalCompetencies: list(options.nls), aiCompetencies: list(options.aiEducation),
    stemCompetencies: list(options.stemLesson), qualities: list(),
    equipmentTeacher: list(), equipmentStudent: list(),
    activities: {
      type: 'array', minItems: 4, maxItems: 4,
      items: {
        type: 'object',
        properties: {
          ...Object.fromEntries(activityFields.map(key => [key, text])),
          durationMinutes: { type: 'integer', minimum: 1 },
        },
        required: [...activityFields, ...(options.timeline ? ['durationMinutes'] : [])],
      },
    },
    worksheetsAppendix: list(options.worksheets),
    mindmap: { $ref: '#/$defs/mindmap' },
    slides: {
      type: 'array', minItems: 1,
      items: {
        type: 'object',
        properties: { title: text, subtitle: text, bullets: list(), notesForTeacher: text },
        required: ['title', 'bullets'],
      },
    },
  };
  return {
    $defs: {
      mindmap: {
        type: 'object', properties: {
          label: text,
          children: { type: 'array', items: { $ref: '#/$defs/mindmap' } },
        },
        required: ['label'],
      },
    },
    anyOf: [
      { type: 'object', properties, required: Object.keys(properties) },
      { type: 'object', properties: { error: text }, required: ['error'] },
    ],
  };
}
