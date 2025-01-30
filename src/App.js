import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShopkeepDetails from "./pages/ShopkeepDetails";
import ShopkeepList from "./pages/ShopkeepList";
import PlayerView from "./pages/PlayerView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopkeepList />} />
        <Route path="/shopkeep/:id" element={<ShopkeepDetails />} />
        <Route path="/playerview/" element={<PlayerView />} />
      </Routes>
    </Router>
  );
};

export default App;
