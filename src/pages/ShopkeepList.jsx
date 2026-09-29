import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Fab,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CastleIcon from "@mui/icons-material/Castle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { fetchAllShopkeeps, addShopkeep, revealShopkeep } from "../api/shopkeepAPI";
import { hoverCardSx } from "../theme";

const ShopkeepList = () => {
  const [shopkeeps, setShopkeeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadShopkeeps = async () => {
      setLoading(true);
      const { data, error } = await fetchAllShopkeeps();
      if (data) setShopkeeps(data);
      if (error) setError(error);
      setLoading(false);
    };

    loadShopkeeps();
  }, []);

  // Group shopkeeps by location
  const groupByLocation = (shopkeeps) => {
    return shopkeeps.reduce((acc, shopkeep) => {
      const location = shopkeep.location || "Unknown Location";
      if (!acc[location]) acc[location] = [];
      acc[location].push(shopkeep);
      return acc;
    }, {});
  };

  const handleRevealToggle = async (e, id) => {
    e.preventDefault(); // don't follow the card Link
    const { data, error } = await revealShopkeep(id);
    if (error) {
      alert("Error toggling reveal: " + error);
    } else {
      setShopkeeps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, revealed: data.revealed } : s))
      );
    }
  };

  const handleAddShopkeep = async (setLocation) => {
    setIsGenerating(true);

    const { data, error } = await addShopkeep(setLocation);
    if (error) {
      alert("Error creating shopkeep: " + error);
    } else {
      setShopkeeps((prev) => [...prev, data]);
    }

    setIsGenerating(false);
  };

  const groupedShopkeeps = groupByLocation(shopkeeps);

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error)
    return (
      <Typography color="error" sx={{ p: 3 }}>
        Error: {error}
      </Typography>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: 12 }}>
      {Object.entries(groupedShopkeeps).map(([location, shopkeeps]) => (
        <Box key={location} sx={{ mb: 5 }}>
          {/* Location banner: castle image with a legible gradient overlay */}
          <Box
            sx={{
              position: "relative",
              height: 120,
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              mb: 2,
              backgroundImage:
                "linear-gradient(90deg, rgba(20,18,10,0.85), rgba(20,18,10,0.15)), url('/castle_banner1.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: 3,
            }}
          >
            <Tooltip title={`Add shopkeep to ${location}`}>
              <IconButton
                onClick={() => handleAddShopkeep(location)}
                disabled={isGenerating}
                color="primary"
                sx={{
                  ml: 2,
                  bgcolor: "primary.main",
                  color: "common.white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                {isGenerating ? (
                  <CircularProgress size={24} sx={{ color: "common.white" }} />
                ) : (
                  <AddIcon />
                )}
              </IconButton>
            </Tooltip>
            <Typography
              variant="h4"
              sx={{ color: "common.white", ml: 2, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
            >
              {location}
            </Typography>
          </Box>

          <Grid2 container spacing={3} justifyContent="flex-start">
            {shopkeeps.map((shopkeep) => (
              <Grid2 item xs={12} sm={6} md={4} key={shopkeep.id}>
                <Box sx={{ position: "relative" }}>
                  <Link
                    to={`/admin/shopkeep/${shopkeep.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      sx={{
                        ...hoverCardSx,
                        outline: shopkeep.revealed
                          ? "2px solid"
                          : "none",
                        outlineColor: "primary.main",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={shopkeep.image_url}
                        alt={shopkeep.name}
                        sx={{ objectFit: "cover", objectPosition: "top" }}
                      />
                      <CardContent>
                        <Typography variant="h6" align="center">
                          {shopkeep.shop_name} — {shopkeep.shop_type}
                        </Typography>
                        <Typography
                          variant="body2"
                          align="center"
                          color="text.secondary"
                        >
                          Owner: {shopkeep.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                  <Tooltip title={shopkeep.revealed ? "Hide from players" : "Reveal to players"}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleRevealToggle(e, shopkeep.id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: shopkeep.revealed ? "primary.main" : "rgba(0,0,0,0.4)",
                        color: "common.white",
                        "&:hover": {
                          bgcolor: shopkeep.revealed ? "primary.dark" : "rgba(0,0,0,0.65)",
                        },
                      }}
                    >
                      {shopkeep.revealed ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ))}

      <Tooltip title="Add a shopkeep (new location)">
        <Fab
          color="primary"
          onClick={() => handleAddShopkeep(null)}
          disabled={isGenerating}
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          {isGenerating ? (
            <CircularProgress size={24} sx={{ color: "common.white" }} />
          ) : (
            <>
              <AddIcon />
              <CastleIcon fontSize="small" sx={{ ml: "3px" }} />
            </>
          )}
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ShopkeepList;
