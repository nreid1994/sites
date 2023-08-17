import { FormEvent, MouseEvent } from "react";
import { Article } from "../../../contrib/lib";

export interface ArticleFeedProps {}

export interface ArticleFeedState {
  articles: Article[];
  articlesSliced: Article[];
  hasMoreItems: boolean;
  canAddArticle: boolean;
  showAddModal: boolean;
  showAddSpinner: boolean;
}

export interface ArticleFeedController {
  fetchFeed: () => void;
  onAddModalClose: () => void;
  onAddButtonClick: (event: MouseEvent) => void;
  handleAddSubmit: (event: FormEvent) => void;
}
