import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Chat from "./pages/chat/index";
import reportWebVitals from "./reportWebVitals";

import { HashRouter as Router, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/react-chat-room-v1">
      <Switch>
        <Route path="/" exact>
          <App />
        </Route>
        <Route path="/chat-room" exact>
          <Chat />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
