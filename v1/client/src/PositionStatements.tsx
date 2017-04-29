import React = require("react");
import StatementContent from "./StatementContent";
import Editor from "./Editor";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {
  getInitiatorPositionStatement, 
  getResponderPositionStatement,
  getActiveUserIsInitiator,
  getActiveUserIsResponder,
  getNewStatementText
} from './selectors';


const mapStateToProps = (state, {debateID}) => createStructuredSelector({
  initiatorStatement: getInitiatorPositionStatement(debateID),
  responderStatement: getResponderPositionStatement(debateID),
  activeUserIsInitiator: getActiveUserIsInitiator(debateID),
  activeUserIsResponder: getActiveUserIsResponder(debateID),
  newStatementText: getNewStatementText(debateID)
})(state);

const mapDispatchToProps = (dispatch, {debateID, isRebuttal}) => {
  return {
    textChanged: (event)=>{
      dispatch({
        type: "SET_NEW_STATEMENT_TEXT",
        payload: {
          text: event.nativeEvent.target.value,
          debateID
        }
      });
    },
    submitClicked: (event)=>{
      dispatch({
        type: "SUBMIT_POSITION_STATEMENT",
        payload: debateID
      });
    }
  }
}

const renderInitiatorStatement = ({
  initiatorStatement, 
  activeUserIsResponder, 
  activeUserIsInitiator,
  textChanged,
  submitClicked,
  newStatementText
}) => {
  if (!!initiatorStatement) {
    return <h3><span>{initiatorStatement}</span></h3>
  } else if (activeUserIsInitiator) {
    return <Editor 
      text={newStatementText} 
      limit={140} 
      textChanged={textChanged} 
      submitClicked={submitClicked} 
      placeholder="State your position"
    />
  } else {
    return <h3 className="ghost"><span>Unstated</span></h3>
  }
}

const renderResponderStatement = ({
  responderStatement, 
  activeUserIsResponder, 
  activeUserIsInitiator,
  textChanged,
  submitClicked,
  newStatementText
}) => {
  if (!!responderStatement) {
    return <h3><span>{responderStatement}</span></h3>
  } else if (activeUserIsResponder) {
    return <Editor 
      text={newStatementText} 
      limit={140} 
      textChanged={textChanged} 
      submitClicked={submitClicked} 
      placeholder="State your position"
    />
  } else if (activeUserIsInitiator) {
    return <h3 className="ghost"><span>Your opponent will state their competing position</span></h3>
  } else {
    return <h3 className="ghost"><span>Unstated</span></h3>;
  }
}

const PositionStatements = (props) => (
  <header className="position-statements">
    <div className="position-statement initiator-position-statement">
      { renderInitiatorStatement(props) }
    </div>
    <div className="position-statement responder-position-statement">
      { renderResponderStatement(props) }
    </div>
  </header>
);

export default connect(mapStateToProps, mapDispatchToProps)(PositionStatements);