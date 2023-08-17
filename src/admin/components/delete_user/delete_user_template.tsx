import React from "react";

import "./delete_user.scss";
import {
  DeleteUserController,
  DeleteUserProps,
  DeleteUserState,
} from "./delete_user_interface";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Spinner } from "../../../contrib/components/spinner/spinner";

export function template(
  this: DeleteUserController,
  props: DeleteUserProps,
  state: DeleteUserState
) {
  return (
    <Container>
      <Card.Title className="mt-3">Force Logout</Card.Title>
      <Row className="col-8">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Force Non-Admin User to Logout
        </Card.Title>
        <Form
          className="form-floating mb-3"
          id="DeleteUserForm"
          onSubmit={this.onDeleteUserSubmit}
        >
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              id="usernameOrId"
              name="usernameOrId"
              placeholder="Enter UserName or UserId"
              required
            />
            <Form.Label htmlFor="usernameOrId">Username or UserID</Form.Label>
          </Form.Floating>
          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              className="btn-login text-uppercase fw-bold"
            >
              Force Logout {state.showSpinner ? <Spinner /> : null}
            </Button>
          </div>
        </Form>
      </Row>
    </Container>
  );
}
