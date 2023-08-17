import { ChangeEvent, Component, FormEvent, MouseEvent } from "react";
import { template } from "./article_view_template";
import {
  ArticleViewProps,
  ArticleViewController,
  ArticleViewState,
} from "./article_view_interface";
import { ArticleService } from "../../services/article_service";
import { sanitize } from "isomorphic-dompurify";
import { AppUserService } from "../../../contrib/services/app_user_service";

export class ArticleView
  extends Component<ArticleViewProps, ArticleViewState>
  implements ArticleViewController
{
  private readonly articleService = ArticleService.getInstance();
  private readonly appUserService = AppUserService.getInstance();
  private unsubscribeFetchResponse = () => {};
  private unsubscribeModifyResponse = () => {};
  private unsubscribeDeleteResponse = () => {};
  private unsubscribeSessionResponse = () => {};
  private clearRefreshInterval = -1;
  private clearSessionInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: ArticleViewProps) {
    super(props);
    this.state = {
      article: undefined,
      session_id: undefined,
      showEditModal: false,
      canModifyArticle: false,
      showEditSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.articleService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.clearSessionInterval = window.setInterval(() => {
      if (!this.state.article) return;
      this.articleService.feedSession({
        session_id: this.state.session_id,
        article_id: this.state.article.article_id,
      });
    }, 30000);

    this.unsubscribeFetchResponse = this.articleService.onFetchResponse(
      (response) => {
        if (!response.success) {
          const error: string = response.error;
          if (error.includes(this.props.id)) {
            alert(`Article ${this.props.id} Doesn't Exist`);
            window.location.href = "/opportunities";
            return;
          }

          alert(`${error}. Please Refresh`);
          return;
        }

        this.setState({
          article: response.article,
          canModifyArticle:
            this.appUserService.getUserID() === response.article.creator_id,
        });
      }
    );

    this.unsubscribeModifyResponse = this.articleService.onModifyResponse(
      (response) => {
        if (this.state.showEditSpinner) {
          this.setState({ showEditSpinner: false });
        }

        if (!response.success) {
          const error: string = response.error;
          if (error.includes(this.props.id)) {
            alert(`Article ${this.props.id} Doesn't Exist`);
            window.location.href = "/articles";
            return;
          }

          alert(`${error}. Please Refresh`);
          return;
        }

        this.setState({
          article: response.article,
          canModifyArticle:
            this.appUserService.getUserID() === response.orticle.creator_id,
          showEditModal: false,
        });
      }
    );

    this.unsubscribeDeleteResponse = this.articleService.onDeleteResponse(
      (response) => {
        if (!response.success) {
          const error: string = response.error;
          if (error.includes(this.props.id)) {
            alert(`Article ${this.props.id} Doesn't Exist`);
            window.location.href = "/opportunities";
            return;
          }

          alert(`${error}. Please Refresh`);
          return;
        }

        alert("Article Successfully Deleted!");
        window.location.href = "/opportunities";
      }
    );

    // Refresh content every 2 minutes.
    this.clearRefreshInterval = window.setInterval(() => {
      this.articleService.feedFetch({ article_id: this.props.id });
    }, 120000);

    this.clearSessionInterval = window.setInterval(() => {
      if (!this.state.article) return;
      this.articleService.feedSession({
        session_id: this.state.session_id,
        article_id: this.state.article.article_id,
      });
    }, 30000);

    this.articleService.feedFetch({ article_id: this.props.id });
    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearRefreshInterval);
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeFetchResponse();
    this.unsubscribeDeleteResponse();
    this.unsubscribeModifyResponse();
    this.unsubscribeSessionResponse();
    this.articleService.feedSession({
      session_id: this.state.session_id,
      article_id: this.props.id,
      destroy: true,
    });
  };

  readonly onEditButtonClick = (event: MouseEvent) => {
    this.setState({
      showEditModal: true,
      modalTitle: this.state.article?.title ?? "",
      modalContents: this.state.article?.contents ?? "",
    });
  };

  readonly onDeleteButtonClick = (event: MouseEvent) => {
    if (window.confirm("Are You Sure?")) {
      this.articleService.feedDelete({
        article_id: this.props.id,
      });
      window.location.href = "/opportunities";
    }
  };

  readonly onEditModalClose = () => {
    this.setState({ showEditModal: false });
  };

  readonly handleEditSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = sanitize(formData.get("title")?.toString() ?? "");
    const contents = sanitize(formData.get("contents")?.toString() ?? "");

    this.setState({ showEditSpinner: true });
    this.articleService.feedModify({
      article_id: this.props.id,
      title,
      contents,
    });
  };

  readonly onModalTitleChange = (event: ChangeEvent) => {
    const modalTitle = sanitize((event.target as HTMLInputElement).value);
    this.setState({ modalTitle });
  };

  readonly onModalContentsChange = (event: ChangeEvent) => {
    const modalContents = (event.target as HTMLInputElement).value;
    this.setState({ modalContents });
  };
}
