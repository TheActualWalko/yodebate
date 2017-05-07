import React = require("react");

export default ({ text, limit, textChanged, submitClicked, placeholder="Write something"}) => (
  <div className="editor">
    <textarea 
      autoFocus 
      onChange={event=>{
        const el = event.nativeEvent.target;
        textChanged(el["value"].slice(0,limit));
        el["style"].height = "1px";
        el["style"].height = (25+el.scrollHeight)+"px";
      }} 
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