import React = require("react");
import {connect} from "react-redux";

const mapStateToProps = (state, {id})=>{
  if (!state.authors[id]) {
    return {
      imageURL: "",
      name: "",
      description: "loading..."
    };
  }

  return {
    imageURL: state.authors[id].imageURL,
    name: state.authors[id].name,
    description: state.authors[id].description,
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