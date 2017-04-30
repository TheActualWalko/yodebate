import React = require("react");
import Author from "./Author";
import EditableStatementContent from "./EditableStatementContent";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {setNewStatementText, submitNewStatement} from "./actions";

const mapStateToProps = (state, {debateID, isRebuttal}) => {
  const currentDebate = state.getIn(["debates", debateID]).toJS();
  const { rebuttalIDs, openingStatementIDs, newStatementText } = currentDebate;
  const allStatementIDs = [...openingStatementIDs, ...rebuttalIDs];
  return {
    authorID: state.get("activeUserID"),
    isInitiatorStatement: (allStatementIDs.length % 2 === 0),
    newStatementText,
    isRebuttal
  };
};

const mapDispatchToProps = (dispatch, {debateID, isRebuttal}) => {
  return {
    textChanged: (event)=>{
      dispatch(setNewStatementText(debateID, event.nativeEvent.target.value));
    },
    submitClicked: (event)=>{
      dispatch(submitNewStatement(debateID));
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
          ? "initiator-statement" 
          : "responder-statement"
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
        placeholder={isRebuttal ? "Write a rebuttal" : "Write an opening statement"}
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