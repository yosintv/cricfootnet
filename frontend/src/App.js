import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChannelDetail from "./pages/ChannelDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/channel/:channelName" element={<ChannelDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
