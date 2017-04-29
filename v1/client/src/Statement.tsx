import React = require("react");
import StatementContent from "./StatementContent";
import Author from "./Author";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getAuthorID, getIsInitiatorStatement} from "./selectors";

const mapStateToProps = (state, {id, debateID}) => createStructuredSelector({
  authorID: getAuthorID(id),
  isInitiatorStatement: getIsInitiatorStatement(id)
})(state);

const Statement = ({id, debateID, authorID, isInitiatorStatement}) => (
  <article 
    className={`
      statement 
      ${
        isInitiatorStatement 
          ? "initiator-statement" 
          : "responder-statement"
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