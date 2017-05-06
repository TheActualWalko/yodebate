import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getIsLoggedIn, getName, getAuthTested} from "./author-selectors";
import {facebookLogin, facebookLogout} from "./author-actions";

const mapStateToProps = createStructuredSelector({
  isLoggedIn: getIsLoggedIn,
  authTested: getAuthTested,
  name: getName
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
    return <button onClick={props.facebookLogin}>Log in with Facebook</button>
  }
}

const Header = (props)=>(
  <header className="main-header">
    <img className="logo" src="./apple-touch-icon.png" />
    <div className="auth">
      <Name {...props} />
      <LoginLogout {...props} />
    </div>
  </header>
);

export default connect(mapStateToProps, mapDispatchToProps)(Header);