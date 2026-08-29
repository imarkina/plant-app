import { z } from 'zod';

export const PlantHealthEnum = z.enum(['excellent', 'good', 'fair', 'poor', 'critical']);

export const ThreatLevelEnum = z.enum(['low', 'medium', 'high', 'critical']);

export const plantReportSchema = z.object({
  identification: z.object({
    commonName: z
      .string()
      .describe('Название на русском языке, например: филодендрон розовая принцесса'),
    botanicalName: z
      .string()
      .describe("Латинское название, например: Philodendron 'Pink Princess'"),
    confidencePercent: z.number().min(0).max(100).describe('Степень уверенности в %'),
  }),
  health: z.object({
    status: PlantHealthEnum.optional().describe('Общий статус состояния'),
    description: z.string().optional().describe('Подробное описание внешнего вида'),
    diagnosis: z.string().optional().describe('Краткий диагноз'),
    threatLevel: ThreatLevelEnum.optional().describe('Уровень угрозы'),
    pestsOrDiseasesFound: z.boolean().optional().describe('Обнаружены ли вредители или болезни'),
  }),
  actionPlan: z.object({
    urgentActions: z.array(z.string()).describe('Шаги прямо сейчас (карантин, опора и т.д.)'),
    prohibitions: z.array(z.string()).describe('Чего делать КАТЕГОРИЧЕСКИ нельзя'),
  }),
  carePassport: z.object({
    lighting: z.object({
      summary: z.string().describe('Краткое резюме (например: Яркий рассеянный свет)'),
      details: z.string().describe('Детали и риски потери вариегатности'),
      idealPlacement: z.string().describe('Идеальное расположение (окна, фитолампа)'),
    }),
    watering: z.object({
      frequency: z.string().describe('Правило полива (например: По мере просыхания на 1/2)'),
      waterQuality: z.string().describe('Требования к воде'),
    }),
    environment: z.object({
      humidity: z.string().describe('Требования к влажности (например: 50-70%)'),
      temperatureMinC: z.number().describe('Минимальная критическая температура'),
      temperatureOptimal: z.string().describe('Оптимальный диапазон температур'),
      notes: z.string().optional().describe('Примечания по сквознякам или опрыскиванию'),
    }),
    soilAndPot: z.object({
      soilMix: z.string().describe('Состав грунта'),
      potType: z.string().describe('Требования к горшку'),
      repottedWhen: z.string().describe('Когда нужна пересадка'),
    }),
    fertilizing: z.object({
      schedule: z.string().describe('График подкормок'),
      dosage: z.string().describe('Дозировка'),
      warnings: z.string().describe('Ограничения (например: не перекармливать азотом)'),
    }),
  }),
});

export type PlantReportSchema = z.infer<typeof plantReportSchema>;
export type PlantHealthSchema = z.infer<typeof PlantHealthEnum>;
export type ThreatLevelSchema = z.infer<typeof ThreatLevelEnum>;
