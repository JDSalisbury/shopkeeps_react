import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import ShopkeepDetails from "./pages/ShopkeepDetails";
import ShopkeepList from "./pages/ShopkeepList";
import PlayerView from "./pages/PlayerView";
import PlayerShopDetail from "./pages/PlayerShopDetail";

// ponytail: plaintext password in the bundle — fine for "don't stumble in", not real auth
const ADMIN_PASSWORD = "JDSalsy";

const ProtectedRoute = ({ children }) => {
  const [authed, setAuthed] = useState(
    sessionStorage.getItem("admin_auth") === "true"
  );
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setAuthed(true);
    } else {
      setWrong(true);
    }
  };

  if (authed) return children;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <Typography variant="h5">Admin Access</Typography>
      <TextField
        type="password"
        label="Password"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setWrong(false);
        }}
        error={wrong}
        helperText={wrong ? "Incorrect password" : ""}
        autoFocus
      />
      <Button type="submit" variant="contained">
        Enter
      </Button>
    </Box>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PlayerView />} />
      <Route path="/shop/:id" element={<PlayerShopDetail />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <ShopkeepList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shopkeep/:id"
        element={
          <ProtectedRoute>
            <ShopkeepDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
