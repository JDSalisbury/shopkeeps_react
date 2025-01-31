import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShopkeepDetails from "./pages/ShopkeepDetails";
import ShopkeepList from "./pages/ShopkeepList";
import PlayerView from "./pages/PlayerView";
import { PLAYER_VIEW } from "./config";

const App = () => {
  if (PLAYER_VIEW) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<PlayerView />} />
        </Routes>
      </Router>
    );
  }
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
