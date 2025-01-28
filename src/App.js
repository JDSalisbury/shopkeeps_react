import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShopkeepDetails from "./ShopkeepDetails";
import ShopkeepList from "./ShopkeepList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopkeepList />} />
        <Route path="/shopkeep/:id" element={<ShopkeepDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
