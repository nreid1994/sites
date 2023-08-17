import { Component, FormEvent, MouseEvent } from "react";
import { template } from "./article_feed_template";
import { sanitize } from "isomorphic-dompurify";
import {
  ArticleFeedProps,
  ArticleFeedController,
  ArticleFeedState,
} from "./article_feed_interface";
import { UserType } from "../../../contrib/lib";
import { AppUserService } from "../../../contrib/services/app_user_service";
import { ArticleService } from "../../services/article_service";

export class ArticleFeed
  extends Component<ArticleFeedProps, ArticleFeedState>
  implements ArticleFeedController
{
  private readonly articleService = ArticleService.getInstance();
  private readonly appUserService = AppUserService.getInstance();
  private unsubscribeFetchResponse = () => {};
  private unsubscribeAddResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ArticleFeedProps) {
    super(props);
    this.state = {
      articles: [],
      articlesSliced: [],
      hasMoreItems: true,
      canAddArticle: this.appUserService.getUserType() === UserType.STAFF,
      showAddModal: false,
      showAddSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeFetchResponse = this.articleService.onFetchResponse(
      (response) => {
        if (!response.success) {
          alert(response.error);
          return;
        }

        if (!response.articles.length) return;

        this.setState({
          articles: [...response.articles],
          articlesSliced: response.articles.slice(0, 20),
        });
      }
    );

    this.unsubscribeAddResponse = this.articleService.onAddResponse(
      (response) => {
        this.setState({ showAddSpinner: false });

        if (response.error) {
          alert(response.error);
          return;
        }

        alert(`${response.article.title} Successfully Created`);
        (document.getElementById("addForm") as HTMLFormElement).reset();
        this.setState({
          articles: [],
          articlesSliced: [],
          hasMoreItems: true,
        });
        this.onAddModalClose();
        this.articleService.feedFetch({});
      }
    );

    this.articleService.feedFetch({});

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeFetchResponse();
    this.unsubscribeAddResponse();
  };

  readonly fetchFeed = () => {
    const length = this.state.articlesSliced.length;
    const newLength = length + 20;
    this.setState({
      articlesSliced: [
        ...this.state.articlesSliced,
        ...this.state.articles.slice(length, newLength),
      ],
      hasMoreItems: newLength <= this.state.articles.length,
    });
  };

  readonly onAddButtonClick = (event: MouseEvent) => {
    this.setState({ showAddModal: true });
  };

  readonly onAddModalClose = () => {
    this.setState({
      showAddModal: false,
      articles: [],
      articlesSliced: [],
      hasMoreItems: true,
    });
  };

  readonly handleAddSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = sanitize(formData.get("title")?.toString() ?? "");
    const contents = sanitize(formData.get("contents")?.toString() ?? "");

    this.setState({ showAddSpinner: true });
    this.articleService.feedAdd({
      creator_id: this.appUserService.getUserID()!,
      title,
      contents,
    });
  };
}
