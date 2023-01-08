import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col
} from "reactstrap";
import { Link } from "react-router-dom";
import { Button, Label } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
  render() {
    return (
      <button
      type="button"
      onClick={this.props.toggleModal}
      className="btn btn-outline-secondary"
    >
      <i className="fa fa-pencil"></i>
      &nbsp; Submit Comment
    </button>
);
  }
}

function RenderDish({ dish}) {
  if (dish != null) {
    return (
      <FadeTransform
      in
      transformProps={{
          exitTransform: 'scale(0.5) translateY(-50%)'
      }} unmountOnExit>
      <Card>
        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
        <CardBody>
          <CardTitle>{dish.name}</CardTitle>
          <CardText>{dish.description}</CardText>
        </CardBody>
      </Card>
      </FadeTransform>
    );
  } else return <div></div>;
}

function RenderComments({ comments , toggleModal, postComment, dishId}) {
  if (comments != null) {
    return (
      <div>
        <h4>Comments</h4>
        <Stagger in>
        {comments.map((comment) => {
          return (
            <>
              <ul key={comment.id} className="list-unstyled">
                <div className="Comment">
                  <Fade in unmountOnExit>

                  <li className="Comment-text">{comment.comment}</li>
                  <br />
                  <li className="UserInfo-name Comment-date">
                    --&nbsp;{comment.author}, &nbsp;
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(Date.parse(comment.date)))}
                  </li>
                    </Fade>
                </div>
              </ul>
            </>
          );
        })}
        </Stagger>
        <CommentForm toggleModal={toggleModal} dishId={dishId} postComment={postComment}/>
      </div>
    );
  }
}

class DishDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isModalClose: true,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLogin = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    alert("Current State is: " + JSON.stringify(values));
    this.props.postComment(this.props.dish.id, values.rating, values.author, values.comment);
  }

  render() {
    if (this.props.isLoading) {
      return(
        <div className="container">
            <div className="row">            
                <Loading />
            </div>
        </div>
      );    
    }
    else if (this.props.errMess) {
      return(
        <div className="container">
            <div className="row">            
                <h4>{this.props.errMess}</h4>
            </div>
        </div>
    );
    }  
    if(this.props.dish != null) { 
      return (
        <div className="container">
        <Modal show={this.state.isModalOpen} onHide={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h4>Submit Comment</h4>
            <button type="button" class="close hide-modal" onClick={this.toggleModal}>&times;</button>
            </ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={12}>
                  Rating
                </Label>
                <Col md={12}>
                  <Control.select
                    model=".rating"
                    name="rating"
                    className="form-control custom-select show-tick"
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>

              <Row className="form-group">
                <Label htmlFor="author" md={12}>
                  Your Name
                </Label>
                <Col md={12}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="comment" md={12}>
                  Comment
                </Label>
                <Col md={12}>
                  <Control.textarea
                    model=".comment"
                    id="comment"
                    name="comment"
                    rows="6"
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Col md={{ size: 10}}>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
          <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{this.props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={this.props.dish}/>
          </div>

          <div className="col-12 col-md-5 m-1">
            <RenderComments comments={this.props.comments} toggleModal={this.toggleModal} postComment={this.props.postComment} dishId={this.props.dish.id}/>
          </div>
        </div>
      </div>
    );
}
  }
}

export default DishDetail;
