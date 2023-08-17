import { Component } from "react";
import { template } from "./article_form_template";
import {
  ArticleFormProps,
  ArticleFormController,
  ArticleFormState,
} from "./article_form_interface";

export class ArticleForm
  extends Component<ArticleFormProps, ArticleFormState>
  implements ArticleFormController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ArticleFormProps) {
    super(props);
  }
}
