import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Article } from "../../../contrib/lib";

export interface ArticleViewProps {
  id: string;
}

export interface ArticleViewState {
  article?: Article;
  session_id?: string;
  canModifyArticle: boolean;
  showEditSpinner: boolean;
  showEditModal: boolean;
  modalTitle?: string;
  modalContents?: string;
}

export interface ArticleViewController {
  onEditButtonClick: (event: MouseEvent) => void;
  onDeleteButtonClick: (event: MouseEvent) => void;
  onEditModalClose: () => void;
  handleEditSubmit: (event: FormEvent) => void;
  onModalTitleChange: (event: ChangeEvent) => void;
  onModalContentsChange: (event: ChangeEvent) => void;
}
