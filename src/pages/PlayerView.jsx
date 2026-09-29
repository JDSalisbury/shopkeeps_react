import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { fetchAllShopkeeps } from "../api/shopkeepAPI";
import { hoverCardSx } from "../theme";

const PlayerView = () => {
  const [shopkeeps, setShopkeeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await fetchAllShopkeeps(true); // revealed only
      if (data) setShopkeeps(data);
      if (error) setError(error);
      setLoading(false);
    };
    load();
  }, []);

  const groupByLocation = (shopkeeps) =>
    shopkeeps.reduce((acc, s) => {
      const loc = s.location || "Unknown Location";
      if (!acc[loc]) acc[loc] = [];
      acc[loc].push(s);
      return acc;
    }, {});

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error)
    return (
      <Typography color="error" sx={{ p: 3 }}>
        Error: {error}
      </Typography>
    );

  const grouped = groupByLocation(shopkeeps);

  if (!shopkeeps.length)
    return (
      <Typography sx={{ p: 3 }} color="text.secondary">
        No shops available yet.
      </Typography>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {Object.entries(grouped).map(([location, shops]) => (
        <Box key={location} sx={{ mb: 5 }}>
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
            <Typography
              variant="h4"
              sx={{
                color: "common.white",
                ml: 3,
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              {location}
            </Typography>
          </Box>

          <Grid2 container spacing={3} justifyContent="flex-start">
            {shops.map((shopkeep) => (
              <Grid2 item xs={12} sm={6} md={4} key={shopkeep.id}>
                <Link
                  to={`/shop/${shopkeep.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={hoverCardSx}>
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
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ))}
    </Box>
  );
};

export default PlayerView;
