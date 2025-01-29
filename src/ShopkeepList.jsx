import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Fab,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Plus Icon
import CastleIcon from "@mui/icons-material/Castle";
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

  const handleAddShopkeep = async (location) => {
    if (!location) {
      const location = prompt("Enter the location for the new shopkeep:");
      if (!location) return; // Exit if no location is provided
    }

    try {
      console.log("Creating new shopkeep at location:", location);

      const response = await axios.post(
        `${API_BASE_URL}/generate_shopkeep?location=${location}`
      );
      console.log("Shopkeep created:", response.data);
      setShopkeeps((prev) => [...prev, response.data.shopkeep]); // Update state with new shopkeep
    } catch (error) {
      alert("Error creating shopkeep: " + error.message);
    }
  };

  const groupedShopkeeps = groupByLocation(shopkeeps);

  return (
    <div style={{ padding: "1rem" }}>
      {Object.entries(groupedShopkeeps).map(([location, shopkeeps]) => (
        <div key={location} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              justifyContent: "space-between",
              backgroundImage: "linear-gradient(to right, #17170e, white)",
            }}
          >
            <IconButton
              onClick={() => handleAddShopkeep(location)}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "50%",
                alignSelf: "flex-start",
                zIndex: 1,
              }}
            >
              <AddIcon />
            </IconButton>
            <img
              src="/castle_banner1.jpg"
              alt="Castle Banner"
              style={{
                height: "125px",
                width: "20%",
                objectFit: "cover",
                marginRight: "auto",
                marginLeft: "-40px",
                maskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
              }}
            />

            <Typography variant="h5" style={{ marginBottom: "1rem" }}>
              {location}
            </Typography>
          </div>
          <Divider style={{ marginBottom: "1rem" }} />
          <Grid2 container spacing={4} justifyContent="flex-start">
            {shopkeeps.map((shopkeep) => (
              <Grid2 item xs={12} sm={6} md={4} key={shopkeep.id}>
                <Link
                  to={`/shopkeep/${shopkeep.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card>
                    <CardMedia
                      style={{ height: 200, objectFit: "contain" }}
                      component="img"
                      height="200"
                      image={shopkeep.image_url}
                      alt={shopkeep.name}
                    />
                    <CardContent>
                      <Typography variant="h6" align="center">
                        {shopkeep.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid2>
            ))}
          </Grid2>
        </div>
      ))}
      <Fab
        color="primary"
        onClick={handleAddShopkeep}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#4CAF50",
        }}
      >
        <AddIcon />
        <CastleIcon fontSize="small" style={{ marginLeft: "3px" }} />
      </Fab>
    </div>
  );
};

export default ShopkeepList;
