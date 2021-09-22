import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

// Components
import TextField from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Logo from "./assets/images/logo.png";

import { Link } from "react-router-dom";

function App() {
  const [name, setName] = useState<string>();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome To Chat Room!</p>
        <div className="mb-2 flex items-center">
          <label htmlFor="name">Name：</label>
          <TextField
            id="name"
            onChange={(e) => {
              setName((preVal) => (preVal = e.target.value));
            }}
          />
        </div>
        {name ? (
          <Button variant="contained">
            <Link
              to={{
                pathname: "/chat-room",
                state: {
                  name: name,
                },
              }}
            >
              Entry
            </Link>
          </Button>
        ) : (
          <></>
        )}

        <img className="mt-2" src={Logo} alt="Logo" width="200" />
      </header>
    </div>
  );
}

export default App;
