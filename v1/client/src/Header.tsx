import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getIsLoggedIn, getName} from "./author-selectors";
import {facebookLogin} from "./author-actions";

const mapStateToProps = createStructuredSelector({
  isLoggedIn: getIsLoggedIn,
  name: getName
});

const mapDispatchToProps = {facebookLogin};

const Header = ({isLoggedIn, name, facebookLogin})=>(
  <header>
    {
      isLoggedIn
        ? <span>Logged in as <strong>{name}</strong></span>
        : <button onClick={facebookLogin}>Log In</button>
    }
  </header>
);

export default connect(mapStateToProps, mapDispatchToProps)(Header);