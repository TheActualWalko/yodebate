import React = require("react");

export default ({limit, text, textChanged, submitClicked})=>(
  <div className="statement-content editable-statement-content">
    <div className="statement-text">
      <textarea onChange={textChanged} value={text} rows={Math.round(limit/62.5)} placeholder="Write something"></textarea>
      <footer>
        <span>{text.length}/{limit}</span>
        {text.length > 0 && <button onClick={submitClicked}>Submit</button>}
      </footer>
    </div>
  </div>
);