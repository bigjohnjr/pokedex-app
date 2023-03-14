import React from "react";
import { useState } from "react";
import Pokemon from "./components/Pokemon";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Pokemon />
      {/* <div className="right-box">
        <CaptureList />
      </div> */}
    </div>
  );
}

export default App;
