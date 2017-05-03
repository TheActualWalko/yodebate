import * as React    from "react";
import * as ReactDOM from "react-dom";
import Root from "./Root";
import {onConnect} from "./api";
import store from "./store";
import {setActiveAuthorID} from "./author-actions";

const getAuthorID = ()=>{
  const location = window.location.href;
  let nextLocation;
  const storage = window.localStorage;
  let authorIDfromURL;
  if (location.indexOf("?authorID=") >= 0) {
    authorIDfromURL = location.split("?authorID=")[1].split("&")[0];
  } else if (location.indexOf("&authorID=") >= 0) {
    authorIDfromURL = location.split("&authorID=")[1].split("&")[0];
  }
  if (authorIDfromURL) {
    storage.setItem("authorID", authorIDfromURL);
    if (location.indexOf("?authorID="+authorIDfromURL+"&") >= 0) {
      nextLocation = location.replace("?authorID="+authorIDfromURL+"&", "");
    } else if (location.indexOf("?authorID="+authorIDfromURL) >= 0) {
      nextLocation = location.replace("?authorID="+authorIDfromURL, "");
    } else if (location.indexOf("authorID="+authorIDfromURL+"&") >= 0) {
      nextLocation = location.replace("authorID="+authorIDfromURL+"&", "");
    } else {
      nextLocation = location.replace("authorID="+authorIDfromURL, "");
    }
    window.location.href = nextLocation;
  }
  if (storage.getItem("authorID")) {
    return storage.getItem("authorID");
  }
};

onConnect(()=>{
  console.log("connected!");
  store.dispatch(setActiveAuthorID(getAuthorID()))
});

ReactDOM.render(React.createElement(Root), document.getElementById("react-container"));
