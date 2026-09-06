export type PlantEmbedding = {
  plantId: string;
  name: string;
  text: string; // текст диагноза, который эмбеддили
  embedding: number[]; // вектор
};

export type SearchResult = {
  plantId: string;
  name: string;
  score: number; // косинусное сходство с запросом
};
