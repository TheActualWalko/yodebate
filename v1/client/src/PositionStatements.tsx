import React = require("react");
import StatementContent from "./StatementContent";
import Author from "./Author";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

export default ({debateID}) => (
  <header className={"position-statements"}>
    <PositionStatement 
      isInitiatorStatement={true} 
      debateID={debateID} />
    <PositionStatement 
      isInitiatorStatement={false} 
      debateID={debateID} />
  </header>
);