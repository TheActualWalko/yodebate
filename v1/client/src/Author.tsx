import React = require("react");
import {connect} from "react-redux";

const mapStateToProps = (state, {id})=>{
  if (!state.getIn(["authors", id])) {
    return {
      imageURL: "",
      name: "",
      description: "loading..."
    };
  }

  return {
    imageURL: state.getIn(["authors", id, "imageURL"]),
    name: state.getIn(["authors", id, "name"]),
    description: state.getIn(["authors", id, "description"]),
  };
};

const Author = ({imageURL, name, description})=>(
  <div className="author">
    <img src={imageURL} alt={name} />
    <h4>{name}</h4>
    <h5>{description}</h5>
  </div>
);

export default connect(mapStateToProps)(Author);