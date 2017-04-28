import React = require("react");
import {connect} from "react-redux";

const mapStateToProps = (state, {id, debateID}) => {
  return {
    text: state.statements[id].text,
    date: state.statements[id].date,
  };
};

const StatementContent = ({id, text, date, debateID})=>(
  <div 
    className="statement-content" 
    key={id}
  >
    <div className="statement-text">
      <main>
        <p>{text}</p>
      </main>
      <footer>
        <a href={`www.yodebate.com/${debateID}#${id}`}>Permalink</a>
        <time>{new Date(date).toDateString()}</time>
      </footer>
    </div>
  </div>
);

export default connect(mapStateToProps)(StatementContent);