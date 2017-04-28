import React = require("react");
import StatementContent from "./StatementContent";
import Author from "./Author";
import {connect} from "react-redux";

const mapStateToProps = (state, {id, debateID}) => {
  const {openingStatementIDs, rebuttalIDs, initiatorID, responderID} = state.getIn(["debates", debateID]).toJS();
  const allStatementIDs = [...openingStatementIDs, ...rebuttalIDs];
  const isInitiatorStatement = (allStatementIDs.indexOf(id) % 2 === 0);
  const authorID = isInitiatorStatement ? initiatorID : responderID;
  return {
    authorID,
    isInitiatorStatement
  };
};

const Statement = ({id, debateID, authorID, isInitiatorStatement}) => (
  <article 
    className={`
      statement 
      ${
        isInitiatorStatement 
          ? 'initiator-statement' 
          : 'responder-statement'
      }
    `} 
    id={id}
  >
    <div className="statement-content-wrap">
      <Author id={authorID} />
      <StatementContent id={id} debateID={debateID} />
    </div>
  </article>
);

export default connect(mapStateToProps)(Statement);