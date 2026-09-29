import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InventoryList from "./Components/InventoryList";
import { fetchShopkeepById } from "../api/shopkeepAPI";

const PlayerShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shopkeep, setShopkeep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await fetchShopkeepById(id);
      if (data) setShopkeep(data);
      if (error) setError(error);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error)
    return (
      <Typography color="error" sx={{ p: 3 }}>
        Error: {error}
      </Typography>
    );

  const { shopkeep: shopkeepInfo, inventory } = shopkeep;

  if (!shopkeepInfo.revealed) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <>
      {/* Page-corner fold back to town */}
      <Box
        onClick={() => navigate("/")}
        title="Back to town"
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 64px 64px 0",
          borderColor: "transparent",
          borderRightColor: "primary.main",
          cursor: "pointer",
          transition: "border-width 180ms ease",
          zIndex: 1200,
          "&:hover": { borderWidth: "0 88px 88px 0" },
          "& .back-icon": {
            position: "absolute",
            top: 6,
            right: -56,
            color: "common.white",
            fontSize: 20,
            transition: "right 180ms ease",
          },
          "&:hover .back-icon": { right: -76 },
        }}
      >
        <ArrowBackIcon className="back-icon" />
      </Box>

      <Grid2
        container
        spacing={4}
        justifyContent="flex-start"
        sx={{ p: { xs: 2, md: 3 }, display: "flex", flexFlow: "row", height: "100vh", overflow: "hidden" }}
      >
        <Grid2 item xs={12} sm={6} md={4} sx={{ maxWidth: 400, minWidth: 300, height: "100%", overflowY: "auto" }}>
          <Card>
            <CardMedia
              component="img"
              image={shopkeepInfo.image_url}
              alt={shopkeepInfo.name}
              sx={{ objectFit: "cover", objectPosition: "top" }}
            />
            <CardContent>
              <Typography variant="h5">
                {shopkeepInfo.name}{" "}
                <Typography
                  variant="subtitle2"
                  component="span"
                  color="text.secondary"
                  sx={{ verticalAlign: "middle" }}
                >
                  — {shopkeepInfo.character_class}
                </Typography>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {shopkeepInfo.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Voice: {shopkeepInfo.voice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Personality: {shopkeepInfo.personality}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2
          item
          xs={12}
          sm={6}
          md={8}
          sx={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5">
              {shopkeepInfo.shop_name}{" "}
              <Typography
                variant="subtitle2"
                component="span"
                color="text.secondary"
                sx={{ verticalAlign: "middle" }}
              >
                — {shopkeepInfo.shop_type}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gold: {shopkeepInfo.gold} | Friendship Level:{" "}
              {shopkeepInfo.friendship_level}
            </Typography>
          </Box>
          <InventoryList inventory={inventory} />
        </Grid2>
      </Grid2>
    </>
  );
};

export default PlayerShopDetail;
