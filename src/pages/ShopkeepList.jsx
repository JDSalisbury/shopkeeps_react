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
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { fetchAllShopkeeps, addShopkeep, revealShopkeep, deleteShopkeep } from "../api/shopkeepAPI";
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

  const handleDeleteShopkeep = async (e, id, name) => {
    e.preventDefault();
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    const { error } = await deleteShopkeep(id);
    if (error) { alert("Error deleting: " + error); return; }
    setShopkeeps(prev => prev.filter(s => s.id !== id));
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
        <Box key={location} sx={{ mb: 3 }}>
          {/* Location banner: castle image with a legible gradient overlay */}
          <Box
            sx={{
              position: "relative",
              height: 72,
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              mb: 1.5,
              backgroundImage:
                "linear-gradient(90deg, rgba(20,18,10,0.85), rgba(20,18,10,0.15)), url('/castle_banner1.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: 2,
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
              variant="h5"
              sx={{ color: "common.white", ml: 2, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
            >
              {location}
            </Typography>
          </Box>

          <Grid2 container spacing={2} justifyContent="flex-start">
            {shopkeeps.map((shopkeep) => (
              <Grid2 item xs={6} sm={4} md={3} key={shopkeep.id}>
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
                        height="140"
                        image={shopkeep.image_url}
                        alt={shopkeep.name}
                        sx={{ objectFit: "cover", objectPosition: "top" }}
                      />
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography variant="subtitle2" align="center" fontWeight={600} noWrap>
                          {shopkeep.shop_name}
                        </Typography>
                        <Typography variant="caption" align="center" color="text.secondary" display="block" noWrap>
                          {shopkeep.shop_type} · {shopkeep.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                  <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Tooltip title={shopkeep.revealed ? "Hide from players" : "Reveal to players"}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleRevealToggle(e, shopkeep.id)}
                        sx={{
                          bgcolor: shopkeep.revealed ? "primary.main" : "rgba(0,0,0,0.4)",
                          color: "common.white",
                          "&:hover": { bgcolor: shopkeep.revealed ? "primary.dark" : "rgba(0,0,0,0.65)" },
                        }}
                      >
                        {shopkeep.revealed ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete shopkeep">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteShopkeep(e, shopkeep.id, shopkeep.name)}
                        sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "common.white", "&:hover": { bgcolor: "error.main" } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
