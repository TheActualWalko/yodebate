import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getIsLoggedIn, getName, getAuthTested} from "./author-selectors";
import {facebookLogin, facebookLogout} from "./author-actions";
import {Link} from "react-router";

const mapStateToProps = createStructuredSelector({
  isLoggedIn: getIsLoggedIn,
  authTested: getAuthTested,
  name: getName,
  link: (state)=>state.get("routing").locationBeforeTransitions.pathname
});

const mapDispatchToProps = {facebookLogin, facebookLogout};

const Name = (props)=>{
  if (props.isLoggedIn && !!props.name) {
    return <span>Logged in as <strong>{props.name}</strong></span>;
  } else if (!props.authTested || (props.isLoggedIn && !props.name)) {
    return <span>Loading...</span>;
  } else {
    return null;
  }
};

const LoginLogout = (props)=>{
  if (!props.authTested || (props.isLoggedIn && !props.name)) {
    return null;
  } else if (props.isLoggedIn) {
    return <button onClick={props.facebookLogout}>Log Out</button>
  } else {
    if (props.link !== "/") {
      return <button onClick={props.facebookLogin}>Log in to view this debate</button>
    } else {
      return <button onClick={props.facebookLogin}>Log in with Facebook</button>
    }
  }
}

const NewDebateButton = (props)=>{
  if (props.authTested && props.isLoggedIn && props.link !== "/") {
    return <Link className="new-debate-link" to={"/"}>Start New Debate</Link>
  } else if (props.authTested && !props.isLoggedIn && props.link === "/") {
    return <button className="new-debate-link" onClick={props.facebookLogin}>Start New Debate</button>
  } else {
    return null
  }
}

const Header = (props)=>(
  <header className="main-header">
    <img className="logo" src="./apple-touch-icon.png" />
    <NewDebateButton {...props} />
    <div className="auth">
      <Name {...props} />
      <LoginLogout {...props} />
    </div>
  </header>
);

export default connect(mapStateToProps, mapDispatchToProps)(Header);