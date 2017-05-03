import React = require("react");

export default ({ text, limit, textChanged, submitClicked, placeholder="Write something"}) => (
  <div className="editor">
    <textarea 
      autoFocus 
      onChange={event=>textChanged(event.nativeEvent.target["value"].slice(0,limit))} 
      value={text} 
      rows={Math.ceil(text.length/37.5) || 1} 
      placeholder={placeholder} 
    ></textarea>
    <footer>
      <span>{text.length}/{limit}</span>
      {text.length > 0 && <button onClick={submitClicked}>Submit</button>}
    </footer>
  </div>
);