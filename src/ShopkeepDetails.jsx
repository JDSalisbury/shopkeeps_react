import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";
import { API_BASE_URL } from "./config";

const ShopkeepDetails = () => {
  const { id } = useParams();
  const [shopkeep, setShopkeep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopkeep = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shopkeep/${id}`);
        setShopkeep(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShopkeep();
  }, [id]);

  const handleGenerateInventory = async () => {
    setIsGenerating(true);

    try {
      await axios.post(`${API_BASE_URL}/generate_inventory/${id}`);
      alert("Inventory generated successfully!");
      const response = await axios.get(`${API_BASE_URL}/shopkeep/${id}`);
      setShopkeep(response.data);
    } catch (err) {
      alert(`Error generating inventory: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

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
            image={shopkeepInfo.image_url || "https://via.placeholder.com/200"}
            alt={shopkeepInfo.name}
          />
          <CardContent>
            <Typography variant="h5">
              {shopkeepInfo.name} -{" "}
              <Typography
                variant="subtitle2"
                component="span"
                style={{ verticalAlign: "middle" }}
              >
                {shopkeepInfo.character_class}
              </Typography>
            </Typography>
            <Typography variant="body1">{shopkeepInfo.description}</Typography>
            <Typography variant="body2">Voice: {shopkeepInfo.voice}</Typography>
            <Typography variant="body2">
              Personality: {shopkeepInfo.personality}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateInventory}
              disabled={isGenerating}
              style={{ marginTop: "1rem" }}
            >
              {isGenerating ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Generate Inventory"
              )}
            </Button>
          </CardContent>
        </Card>
      </Grid2>

      <Grid2 item xs={12} sm={6} md={8} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
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
            <Typography variant="body2">
              Gold: {shopkeepInfo.gold} | Friendship Level:{" "}
              {shopkeepInfo.friendship_level}
            </Typography>
          </div>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Back to Main Page
          </Button>
        </div>

        <List>
          {inventory.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`${item.name} (${item.price} gold)`}
                secondary={
                  <div>
                    <Typography>{item.description}</Typography>
                    <Typography>
                      {item.damage !== "N/A" ? `Damage: ${item.damage} ` : ""}
                      {item.armor_class !== "N/A"
                        ? `AC: ${item.armor_class} `
                        : ""}
                      Qty: {item.quantity}
                    </Typography>
                  </div>
                }
              />
            </ListItem>
          ))}
        </List>
      </Grid2>
    </Grid2>
  );
};

export default ShopkeepDetails;
