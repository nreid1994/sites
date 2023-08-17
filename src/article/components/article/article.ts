import { Component } from "react";
import { template } from "./article_template";
import { ArticleCardProps } from "../article_card/article_card_interface";
import {
  ArticleProps,
  ArticleController,
  ArticleState,
} from "./article_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";

export class Article
  extends Component<WithRouterProps<ArticleProps>, ArticleState>
  implements ArticleController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<ArticleProps>) {
    super(props);
    this.state = { errorMessage: "" };
  }

  get id() {
    return this.props.params.id ?? "";
  }
}

export default withRouting<ArticleProps>(Article);
