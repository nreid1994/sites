import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "./article_feed.scss";
import {
  ArticleFeedController,
  ArticleFeedProps,
  ArticleFeedState,
} from "./article_feed_interface";
import { ArticleCard } from "../article_card/article_card";

export function template(
  this: ArticleFeedController,
  props: ArticleFeedProps,
  state: ArticleFeedState
) {
  return (
    <>
      {state.canAddArticle && (
        <div className="d-flex justify-content-end">
          <Button variant="success" onClick={this.onAddButtonClick}>
            Add Article
            <i className="fa fa-plus ms-2" />
          </Button>
        </div>
      )}
      <Card className="card border-0 mb-5">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Articles!
          <sub style={{ display: "block" }}>
            Available Jobs and Volunteering Roles!
          </sub>
        </Card.Title>
        {!state.articles.length ? (
          <Spinner />
        ) : (
          <Card.Body className="px-4 py-2">
            <InfiniteScroll
              dataLength={state.articlesSliced.length}
              next={this.fetchFeed}
              hasMore={state.hasMoreItems}
              loader={<Spinner />}
              height={750}
            >
              {state.articlesSliced.map((item, index) => (
                <ArticleCard
                  className="border-bottom mb-4"
                  article={item}
                  key={`article-${index}`}
                />
              ))}
            </InfiniteScroll>
          </Card.Body>
        )}
      </Card>

      <Modal
        show={state.showAddModal}
        onHide={this.onAddModalClose}
        dialogClassName="modal-90w"
        aria-labelledby="add-article"
        centered={true}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-article">Add Article</Modal.Title>
        </Modal.Header>
        <Form
          className="form-floating mb-3"
          id="addForm"
          onSubmit={this.handleAddSubmit}
        >
          <Modal.Body>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                maxLength={100}
                required
              />
              <Form.Label htmlFor="title">Title</Form.Label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                as="textarea"
                rows={50}
                id="contents"
                name="contents"
                placeholder="Contents"
                maxLength={3000}
                required
              />
              <Form.Label htmlFor="contents">Contents</Form.Label>
            </Form.Floating>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="primary"
              className="btn-login text-uppercase fw-bold"
            >
              Submit {state.showAddSpinner ? <Spinner /> : null}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
