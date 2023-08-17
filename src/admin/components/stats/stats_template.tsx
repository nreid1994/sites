import React from "react";

import "./stats.scss";
import { StatsController, StatsProps, StatsState } from "./stats_interface";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Spinner } from "../../../contrib/components/spinner/spinner";
import { LinkContainer } from "react-router-bootstrap";
import { ArrowDown } from "react-bootstrap-icons";

export function template(
  this: StatsController,
  props: StatsProps,
  state: StatsState
) {
  return !state.info ? (
    <Spinner />
  ) : (
    <Container fluid>
      <Card.Title className="mt-3">Sites Info</Card.Title>
      <Row className="col-12">
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Users
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.users}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Opportunities
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.opportunities}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Views
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.views}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Active Viewers
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.sessions}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='col-12'>
        <Col className='col-2 mt-2'>
          <Card>
            <Card.Body>
                <Card.Title className='sites_info_card_title'>
                  Home
                </Card.Title>
                <Card.Text className='sites_info_card_text'>

                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className='col-2 mt-2'>
          <Card>
            <Card.Body>
                <Card.Title className='sites_info_card_title'>
                  Auth
                </Card.Title>
                <Card.Text className='sites_info_card_text'>

                </Card.Text>
            </Card.Body>
          </Card>
          </Col>
          <Col className='col-2 mt-2'>
          <Card>
            <Card.Body>
                <Card.Title className='sites_info_card_title'>
                  Admin
                </Card.Title>
                <Card.Text className='sites_info_card_text'>

                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className='col-2 mt-2'>
          <Card>
            <Card.Body>
                <Card.Title className='sites_info_card_title'>
                  Profile
                </Card.Title>
                <Card.Text className='sites_info_card_text'>

                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className='col-2 mt-2'>
          <Card>
            <Card.Body>
                <Card.Title className='sites_info_card_title'>
                  Opportunity
                </Card.Title>
                <Card.Text className='sites_info_card_text'>

                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className='col-2 mt-2'>
          <Card>
            <Card.Body>
                <Card.Title className='sites_info_card_title'>
                  Article
                </Card.Title>
                <Card.Text className='sites_info_card_text'>

                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    
  );
}
