import React = require("react");
import Author from "./Author";
import EditableStatementContent from "./EditableStatementContent";
import {rebuttalCharLimit, openingStatementCharLimit} from './limits';
import {connect} from "react-redux";

const mapStateToProps = (state, {debateID, isRebuttal}) => {
  const currentDebate = state.debates[debateID];
  const { rebuttalIDs, openingStatementIDs, newStatementText } = currentDebate;
  const allStatementIDs = [...openingStatementIDs, ...rebuttalIDs];
  return {
    authorID: state.activeUserID,
    isInitiatorStatement: (allStatementIDs.length % 2 === 0),
    newStatementText,
    isRebuttal
  };
};

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
        type: "SUBMIT_NEW_STATEMENT",
        payload: debateID
      });
    }
  }
}

const NewStatement = ({
  isRebuttal, 
  authorID, 
  isInitiatorStatement,
  newStatementText,
  textChanged,
  submitClicked
})=>(
  <article 
    className={`
      statement 
      new-statement 
      ${
        isInitiatorStatement 
          ? 'initiator-statement' 
          : 'responder-statement'
      }
    `} 
  >
    <div className="statement-content-wrap">
      <Author id={authorID} />
      <EditableStatementContent 
        limit={
          isRebuttal 
            ? rebuttalCharLimit 
            : openingStatementCharLimit
        }
        text={newStatementText}
        textChanged={textChanged}
        submitClicked={submitClicked}
      />
    </div>
    <h5 className="instruction">
      <span>
        { 
          isRebuttal 
            ? "Write your rebuttal" 
            : "Write your opening statement"
        }
      </span>
    </h5>
  </article>
);

export default connect(mapStateToProps, mapDispatchToProps)(NewStatement);