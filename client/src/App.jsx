import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import  Landing  from "./components/Landing";

import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
