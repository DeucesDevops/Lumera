import type { Request, Response } from "express";
import type { ContentService } from "./content.service";

export class ContentController {
  constructor(private readonly service: ContentService) {}

  listArticles = async (req: Request, res: Response) => {
    const articles = this.service.listArticles(typeof req.query.category === "string" ? req.query.category : undefined);
    res.json({ articles });
  };

  getArticle = async (req: Request, res: Response) => {
    const slugParam = req.params.slug;
    const slug = Array.isArray(slugParam) ? (slugParam[0] ?? "") : (slugParam ?? "");
    const article = this.service.getArticle(slug);
    res.json({ article });
  };
}
