import React = require("react");

export default ({ text, limit, textChanged, submitClicked, placeholder="Write Something"}) => (
  <div className="editor">
    <textarea onChange={textChanged} value={text} rows={Math.ceil(text.length/62.5) || 1} placeholder={placeholder}></textarea>
    <footer>
      <span>{text.length}/{limit}</span>
      {text.length > 0 && <button onClick={submitClicked}>Submit</button>}
    </footer>
  </div>
);