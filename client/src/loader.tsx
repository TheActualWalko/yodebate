import React = require("react");

export default (Component)=>{
  class Loader extends React.Component<
    {
      isLoading: boolean, 
      isLoaded: boolean, 
      error: string,
      load: ()=>void
    }, 
    {}
  >{
    componentDidMount() {
      ["load", "isLoading", "isLoaded", "error"].forEach(key=>{
        if (this.props[key] === undefined) {
          throw new Error("Missing loader prop " + key);
        }
      });
      if (this.props.isLoaded === false && this.props.isLoading === false && this.props.error === null) {
        this.props.load();
      }
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.isLoaded === false && nextProps.isLoading === false && nextProps.error === null) {
        nextProps.load();
      }
    }
    render() {
      return this.props.isLoaded ? <Component {...this.props} /> : null
    }
  };
  return Loader as typeof Component;
}
