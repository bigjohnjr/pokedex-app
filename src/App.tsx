import React from "react";
import { useState } from "react";
import Search from "./components/Search";
import Pokemon from "./components/Pokemon";
import CaptureList from "./components/CaptureList";
import "./App.css";

function App() {
  // const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="App">
      <div className="left-box">
        <Search />
        <Pokemon />
      </div>
      <div className="right-box">
        <CaptureList />
      </div>
    </div>
  );
}

export default App;
