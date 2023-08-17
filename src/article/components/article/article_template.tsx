import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import "./article.scss";
import {
  ArticleController,
  ArticleProps,
  ArticleState,
} from "./article_interface";

import { ArticleFeed } from "../article_feed/article_feed";
import { ArticleView } from "../article_view/article_view";

export function template(
  this: ArticleController,
  props: ArticleProps,
  state: ArticleState
) {
  return (
    <Row className="d-flex align-items-center justify-content-center">
      <Col sm={12} md={10} lg={8} mx={"auto"}>
        <Card className="shadow rounded-3 my-5">
          <Card.Body className="p-4 p-sm-5">
            {!this.id ? <ArticleFeed /> : <ArticleView id={this.id} />}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
