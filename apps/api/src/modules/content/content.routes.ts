import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";

const service = new ContentService();
const controller = new ContentController(service);

export const contentRouter = Router();

contentRouter.get("/articles", asyncHandler(controller.listArticles));
contentRouter.get("/articles/:slug", asyncHandler(controller.getArticle));
