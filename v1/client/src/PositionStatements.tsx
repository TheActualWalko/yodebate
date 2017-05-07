import React = require("react");
import StatementContent from "./StatementContent";
import Editor from "./Editor";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {
  getInitiatorPositionStatement, 
  getResponderPositionStatement,
  getActiveAuthorIsInitiator,
  getActiveAuthorIsResponder,
  getNewStatementText,
  getHaveAllOpeningStatements
} from "./debate-selectors";
import {setNewStatementText, submitPositionStatement} from "./debate-actions";


const mapStateToProps = createStructuredSelector({
  initiatorStatement: getInitiatorPositionStatement,
  responderStatement: getResponderPositionStatement,
  activeAuthorIsInitiator: getActiveAuthorIsInitiator,
  activeAuthorIsResponder: getActiveAuthorIsResponder,
  newStatementText: getNewStatementText,
  haveAllOpeningStatements: getHaveAllOpeningStatements
});

const mapDispatchToProps = (dispatch, {debateID}) => {
  return {
    textChanged: (text)=>{
      dispatch(setNewStatementText({
        debateID,
        text: text.replace(/[\r\n\v]+/g, '')
      }));
    },
    submitClicked: (event)=>{
      dispatch(submitPositionStatement(debateID));
    }
  }
}

const renderInitiatorStatement = ({
  initiatorStatement, 
  activeAuthorIsResponder, 
  activeAuthorIsInitiator,
  textChanged,
  submitClicked,
  newStatementText,
  haveAllOpeningStatements
}) => {
  if (!!initiatorStatement) {
    return <h3><span>{initiatorStatement.trim()}</span></h3>;
  } else if (activeAuthorIsInitiator) {
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
  activeAuthorIsResponder, 
  activeAuthorIsInitiator,
  textChanged,
  submitClicked,
  newStatementText
}) => {
  if (!!responderStatement) {
    return <h3><span>{responderStatement.trim()}</span></h3>;
  } else if (activeAuthorIsResponder) {
    return <Editor 
      text={newStatementText} 
      limit={80} 
      textChanged={textChanged} 
      submitClicked={submitClicked} 
      placeholder="State your competing position"
    />;
  } else if (activeAuthorIsInitiator) {
    return <h3 className="ghost"><span>Your opponent will state their competing position</span></h3>;
  } else {
    return <h3 className="ghost"><span>Unstated</span></h3>;
  }
}

const PositionStatements = (props) => (
  <header className="position-statements">
    <div className="position-statement initiator-position-statement">
      { renderInitiatorStatement(props) }
    </div>
    { (props.haveAllOpeningStatements || props.activeAuthorIsResponder) && <h4 className="position-statements-vs">vs</h4> }
    { (props.haveAllOpeningStatements || props.activeAuthorIsResponder) && <div className="position-statement responder-position-statement">
      { renderResponderStatement(props) }
    </div> }
  </header>
);

export default connect(mapStateToProps, mapDispatchToProps)(PositionStatements) as React.ComponentClass<{debateID: any}>;