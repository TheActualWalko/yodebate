import React = require("react");
import Author from "./Author";
import EditableStatementContent from "./EditableStatementContent";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {setNewStatementText, submitNewStatement} from "./debate-actions";
import {getActiveAuthorID} from "./author-selectors.ts";
import {getActiveAuthorIsInitiator, getNewStatementText} from "./debate-selectors";
import {createStructuredSelector} from "reselect";

const mapStateToProps = createStructuredSelector({
  authorID: getActiveAuthorID,
  isInitiatorStatement: getActiveAuthorIsInitiator,
  newStatementText: getNewStatementText
});

const mapDispatchToProps = (dispatch, {isRebuttal, debateID}) => {
  return {
    textChanged: (text)=>{
      dispatch(setNewStatementText({text, debateID}));
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
      <Author authorID={authorID} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NewStatement) as React.ComponentClass<{debateID: any, isRebuttal: boolean}>;