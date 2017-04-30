import React = require("react");
import {connect} from "react-redux";

const mapStateToProps = (state)=>{
  return {
    text: state.get('notification')
  };
};

const Notification = ({text})=>{
  return !!text 
    ? <div className="notification">{text}</div> 
    : null;
};


export default connect(mapStateToProps)(Notification);