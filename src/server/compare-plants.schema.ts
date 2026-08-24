import { z } from 'zod';

const CompareStatusEnum = z.enum([
  'positive', // Улучшение / уход работает
  'negative', // Ухудшение / уход не работает
  'neutral', // Без изменений / нужно время
]);

export const plantComparisonSchema = z.object({
  summary: z.object({
    status: CompareStatusEnum.describe('Общий тренд: positive, negative или neutral'),
    headline: z
      .string()
      .describe(
        'Краткий вердикт в 1-2 предложениях (например: "За 2 недели тургор восстановился — уход работает")',
      ),
  }),
  detailedAnalysis: z.object({
    foliageAndShoots: z
      .string()
      .describe('Изменения в листьях и побегах (новый рост, цвет, тургор)'),
    problemAreas: z
      .string()
      .describe('Динамика проблемных зон (пятна, вредители, налет, повреждения)'),
    overallHabit: z.string().describe('Изменение общего вида и формы растения'),
  }),
  carePlanAdjustments: z.object({
    keepDoing: z
      .array(z.string())
      .describe('Действия, которые доказали эффективность и их нужно продолжить'),
    urgentChanges: z.array(z.string()).describe('Что нужно срочно изменить или скорректировать'),
    watchPoints: z.array(z.string()).describe('На что обратить внимание в ближайшие 1-2 недели'),
  }),
});

export type PlantComparisonSchema = z.infer<typeof plantComparisonSchema>;
export type CompareStatusSchema = z.infer<typeof CompareStatusEnum>;
