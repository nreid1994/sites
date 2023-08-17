import { Component } from "react";
import { template } from "./article_card_template";
import {
  ArticleCardProps,
  ArticleCardController,
  ArticleCardState,
} from "./article_card_interface";

export class ArticleCard
  extends Component<ArticleCardProps, ArticleCardState>
  implements ArticleCardController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ArticleCardProps) {
    super(props);
    this.state = { activeViews: 0 };
  }
}