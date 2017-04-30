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
import {setNewStatementText, submitPositionStatement} from "./actions";


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
      dispatch(setNewStatementText(
        debateID, 
        event.nativeEvent.target.value.replace(/[\r\n\v]+/g, '')
      ));
    },
    submitClicked: (event)=>{
      dispatch(submitPositionStatement(debateID));
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
    return <h3><span>{initiatorStatement}</span></h3>;
  } else if (activeUserIsInitiator) {
    return <Editor 
      text={newStatementText} 
      limit={80} 
      textChanged={textChanged} 
      submitClicked={submitClicked} 
      placeholder="State your position"
    />;
  } else {
    return <h3 className="ghost"><span>Unstated</span></h3>;
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
    return <h3><span>{responderStatement}</span></h3>;
  } else if (activeUserIsResponder) {
    return <Editor 
      text={newStatementText} 
      limit={80} 
      textChanged={textChanged} 
      submitClicked={submitClicked} 
      placeholder="State your competing position"
    />;
  } else if (activeUserIsInitiator) {
    return <h3 className="ghost"><span>Your opponent will state their competing position</span></h3>;
  } else {
    return <h3 className="ghost"><span>Unstated</span></h3>;
  }
}

const renderVS = ({responderStatement, initiatorStatement}) => {
  if (!!responderStatement && !!initiatorStatement) {
    return <h4 className="position-statements-vs">vs</h4>;
  } else {
    return null;
  }
}

const PositionStatements = (props) => (
  <header className="position-statements">
    <div className="position-statement initiator-position-statement">
      { renderInitiatorStatement(props) }
    </div>
    { renderVS(props) }
    <div className="position-statement responder-position-statement">
      { renderResponderStatement(props) }
    </div>
  </header>
);

export default connect(mapStateToProps, mapDispatchToProps)(PositionStatements);