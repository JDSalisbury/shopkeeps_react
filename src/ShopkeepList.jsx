import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { API_BASE_URL } from "./config";

const ShopkeepList = () => {
  const [shopkeeps, setShopkeeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopkeeps = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shopkeeps`);
        setShopkeeps(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShopkeeps();
  }, []);

  // Group shopkeeps by location
  const groupByLocation = (shopkeeps) => {
    return shopkeeps.reduce((acc, shopkeep) => {
      const location = shopkeep.location || "Unknown Location"; // Default to "Unknown Location" if undefined
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(shopkeep);
      return acc;
    }, {});
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const groupedShopkeeps = groupByLocation(shopkeeps);

  return (
    <div style={{ padding: "1rem" }}>
      {Object.entries(groupedShopkeeps).map(([location, shopkeeps]) => (
        <div key={location} style={{ marginBottom: "2rem" }}>
          <Typography variant="h5" style={{ marginBottom: "1rem" }}>
            {location}
          </Typography>
          <Divider style={{ marginBottom: "1rem" }} />
          <Grid container spacing={4} justifyContent="center">
            {shopkeeps.map((shopkeep) => (
              <Grid item xs={12} sm={6} md={4} key={shopkeep.id}>
                <Link
                  to={`/shopkeep/${shopkeep.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card>
                    <CardMedia
                      style={{ height: 200, objectFit: "contain" }}
                      component="img"
                      height="200"
                      image={
                        shopkeep.image_url || "https://via.placeholder.com/200"
                      }
                      alt={shopkeep.name}
                    />
                    <CardContent>
                      <Typography variant="h6" align="center">
                        {shopkeep.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default ShopkeepList;
