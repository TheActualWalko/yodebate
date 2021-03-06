import store from "./store";
import socketClient = require("socket.io-client");
import es6promise = require("es6-promise");
const Promise: any = es6promise.Promise;
const socket = socketClient(":3003");

export const onConnect = (callback)=>socket.on("connect", callback);

export const onUncache = (callback)=>socket.on("uncache", callback);

const api = (endpoint, payload) => {
  console.log("calling", endpoint, JSON.stringify(payload));
  return new Promise((resolve, reject)=>{
    socket.emit(endpoint, payload, (error, response)=>{
      error ? reject(error) : resolve(response);
    });
  });
};

export default api;