import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Grid2 } from "@mui/material";
import InventoryList from "./Components/InventoryList";
import { fetchPlayerview } from "../api/shopkeepAPI";

const ShopkeepDetails = () => {
  const [shopkeep, setShopkeep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShopkeep = async () => {
      setLoading(true);
      const { data, error } = await fetchPlayerview();
      if (data) setShopkeep(data);
      if (error) setError(error);
      setLoading(false);
    };

    loadShopkeep();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const { shopkeep: shopkeepInfo, inventory } = shopkeep;

  return (
    <Grid2
      container
      spacing={4}
      justifyContent="flex-start"
      style={{ flexFlow: "row", margin: "1rem" }}
    >
      <Grid2
        item
        xs={12}
        sm={6}
        md={4}
        style={{ maxWidth: "400px", minWidth: "300px" }}
      >
        <Card>
          <CardMedia
            component="img"
            image={shopkeepInfo.image_url}
            alt={shopkeepInfo.name}
          />
          <CardContent>
            <Typography variant="h5">{shopkeepInfo.name}</Typography>
            <Typography variant="body1">{shopkeepInfo.description}</Typography>
          </CardContent>
        </Card>
      </Grid2>

      <Grid2
        item
        xs={12}
        sm={6}
        md={8}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 2,
            paddingBottom: "1rem",
          }}
        >
          <Typography variant="h5">
            {shopkeepInfo.shop_name} -{" "}
            <Typography
              variant="subtitle2"
              component="span"
              style={{ verticalAlign: "middle" }}
            >
              {shopkeepInfo.shop_type}
            </Typography>
          </Typography>
        </div>

        <InventoryList inventory={inventory} />
      </Grid2>
    </Grid2>
  );
};

export default ShopkeepDetails;
