import React = require("react");
import StatementContent from "./StatementContent";
import Author from "./Author";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getInitiatorPositionStatement, getResponderPositionStatement} from './selectors';


const mapStateToProps = (state, {debateID}) => createStructuredSelector({
  initiatorStatement: getInitiatorPositionStatement(debateID),
  responderStatement: getResponderPositionStatement(debateID),
})(state);

const PositionStatements = ({debateID, initiatorStatement, responderStatement}) => (
  <header className="position-statements">
    <div className="position-statement initiator-position-statement">
      <h3><span>{initiatorStatement}</span></h3>
    </div>
    <div className="position-statement responder-position-statement">
      <h3><span>{responderStatement}</span></h3>
    </div>
  </header>
);

export default connect(mapStateToProps)(PositionStatements);