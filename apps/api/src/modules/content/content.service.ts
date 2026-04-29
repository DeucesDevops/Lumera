const articles = [
  {
    slug: "when-to-seek-care",
    title: "When to seek urgent care",
    category: "safety",
    readingMinutes: 4,
    summary: "Symptoms that should prompt a call to your provider or emergency care.",
  },
  {
    slug: "prenatal-vitamins-basics",
    title: "Prenatal vitamins basics",
    category: "pregnancy",
    readingMinutes: 3,
    summary: "A practical overview of supplement reminders and provider questions.",
  },
  {
    slug: "cycle-patterns",
    title: "Understanding cycle patterns",
    category: "cycle",
    readingMinutes: 3,
    summary: "How logs can help you discuss patterns with a healthcare professional.",
  },
];

export class ContentService {
  listArticles(category?: string) {
    return category ? articles.filter((article) => article.category === category) : articles;
  }

  getArticle(slug: string) {
    return articles.find((article) => article.slug === slug) ?? null;
  }
}
