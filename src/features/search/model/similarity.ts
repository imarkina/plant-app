import type { PlantEmbedding, SearchResult } from './search.types';

// Косинусное сходство двух векторов → число [-1..1] (для эмбеддингов обычно [0..1]).
// TODO (сама): dot(a, b) / (|a| * |b|)
// 1. скалярное произведение
// 2. длины (нормы) векторов
// 3. отношение — не забыть про деление на ноль, если вектор нулевой
export function cosineSimilarity(a: number[], b: number[]): number {
  void a;
  void b;
  return 0; // заглушка
}

// Поиск: вектор запроса + база растений → отсортированные по убыванию score результаты.
// TODO (сама):
// 1. для каждого растения — cosineSimilarity(queryEmbedding, plant.embedding)
// 2. собрать { plantId, name, score }
// 3. отсортировать по score по убыванию
export function search(queryEmbedding: number[], plants: PlantEmbedding[]): SearchResult[] {
  void queryEmbedding;
  void plants;
  return []; // заглушка
}
