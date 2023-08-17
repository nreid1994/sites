import React from "react";

import "./article_form.scss";
import {
  ArticleFormController,
  ArticleFormProps,
  ArticleFormState,
} from "./article_form_interface";

export function template(
  this: ArticleFormController,
  props: ArticleFormProps,
  state: ArticleFormState
) {
  return <div>Hi</div>;
}
