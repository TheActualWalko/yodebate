declare const FB: any;
import * as React    from "react";
import * as ReactDOM from "react-dom";
import Root from "./Root";
import {onConnect, onUncache} from "./api";
import store from "./store";
import {receiveFacebookLoginStatus} from "./author-actions";
import {receiveDebate} from "./debate-actions";

let fbInit = false;
let connected = false;

const maybeAuthenticate = ()=>{
  if (fbInit && connected) {
    FB.getLoginStatus(response=>{
      const action: any = receiveFacebookLoginStatus(response);
      store.dispatch(action);
    });
  }
};

window["fbAsyncInit"] = function() {
  console.log("FB init!");
  FB.init({
    appId      : '122114921684013',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
  fbInit = true;
  maybeAuthenticate();
};

onConnect(()=>{
  console.log("connected!");
  connected = true;
  maybeAuthenticate();
});

onUncache(({debateID, debate})=>{
  store.dispatch(receiveDebate({debateID, debate}));
});

ReactDOM.render(React.createElement(Root), document.getElementById("react-container"));
