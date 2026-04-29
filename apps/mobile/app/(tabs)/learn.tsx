import { Search } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { InfoCard } from "@/components/InfoCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { learnArticles } from "@/data/demo";
import { usePublicApiQuery } from "@/lib/api-hooks";
import type { ArticlesResponse } from "@/lib/types";

type ArticleItem = {
  title: string;
  category: string;
  minutes: number;
  summary?: string;
};

export default function LearnScreen() {
  const articlesQuery = usePublicApiQuery<ArticlesResponse>(["content", "articles"], "/content/articles");
  const articles: ArticleItem[] = articlesQuery.data?.articles?.length
    ? articlesQuery.data.articles.map((article) => ({
        title: article.title,
        category: article.category,
        minutes: article.readingMinutes,
        summary: article.summary,
      }))
    : learnArticles;

  return (
    <Screen>
      <View className="flex-row items-center justify-between pt-4">
        <Text className="text-3xl font-bold text-plum">Learn</Text>
        <Pressable className="h-11 w-11 items-center justify-center rounded-ui bg-lilac">
          <Search size={20} color="#4A294F" />
        </Pressable>
      </View>

      <View className="mt-6 flex-row gap-2">
        {["Pregnancy", "Cycle", "TTC"].map((label, index) => (
          <Text key={label} className={`rounded-ui px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-plum text-white" : "bg-cream text-ink"}`}>
            {label}
          </Text>
        ))}
      </View>

      <SectionHeader title="For you" />
      <View className="gap-3">
        {articles.map((article, index) => (
          <InfoCard key={article.title} tone={index === 0 ? "lavender" : index === 1 ? "teal" : index === 2 ? "amber" : "plain"}>
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-semibold text-ink">{article.title}</Text>
                <Text className="mt-1 text-sm text-ink/55">
                  {article.category} · {article.minutes} min
                </Text>
                {article.summary ? <Text className="mt-2 text-sm leading-5 text-ink/60">{article.summary}</Text> : null}
              </View>
              <Text className="text-lg text-berry">›</Text>
            </View>
          </InfoCard>
        ))}
      </View>

      <SectionHeader title="Safety" />
      <InfoCard title="When to seek urgent care" tone="rose">
        <Text className="text-base leading-6 text-ink/70">
          Severe, sudden, or worrying symptoms should be discussed with a healthcare professional or emergency service.
        </Text>
      </InfoCard>
    </Screen>
  );
}
