export type PlantEmbedding = {
  plantId: string;
  name: string;
  embedding: number[]; // вектор, посчитанный и закэшированный в БД при сохранении диагноза
};

export type SearchResult = {
  plantId: string;
  name: string;
  score: number; // косинусное сходство с запросом
};
