import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {
  getName, 
  getDescription, 
  getImageURL,
  getIsLoaded,
  getIsLoading,
  getError
} from "./author-selectors";
import {getAuthor} from "./author-actions";
import loader from "./loader";

const mapStateToProps = createStructuredSelector({
  name: getName,
  description: getDescription,
  imageURL: getImageURL,
  isLoaded: getIsLoaded,
  isLoading: getIsLoading,
  error: getError
});

const mapDispatchToProps = (dispatch, {authorID}) => ({
  load: ()=>dispatch(getAuthor(authorID))
});

const Author = ({imageURL, name, description})=>(
  <div className="author">
    <img src={imageURL} alt={name} />
    <h4>{name}</h4>
    <h5>{description}</h5>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(loader(Author)) as React.ComponentClass<{authorID: any}>;