import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getName, getDescription, getImageURL} from "./author-selectors";

const mapStateToProps = createStructuredSelector({
  name: getName,
  description: getDescription,
  imageURL: getImageURL
});

const Author = ({imageURL, name, description})=>(
  <div className="author">
    <img src={imageURL} alt={name} />
    <h4>{name}</h4>
    <h5>{description}</h5>
  </div>
);

export default connect(mapStateToProps)(Author) as React.ComponentClass<{authorID: any}>;