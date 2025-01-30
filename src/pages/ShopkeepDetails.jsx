import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import InventoryList from "./Components/InventoryList";
import {
  fetchShopkeepById,
  generateInventory,
  setPlayerview,
} from "../api/shopkeepAPI";
import VisibilityIcon from "@mui/icons-material/Visibility";
const ShopkeepDetails = () => {
  const { id } = useParams();
  const [shopkeep, setShopkeep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadShopkeep = async () => {
      setLoading(true);
      const { data, error } = await fetchShopkeepById(id);
      if (data) setShopkeep(data);
      if (error) setError(error);
      setLoading(false);
    };

    loadShopkeep();
  }, [id]);

  const handleSetPlayerview = async () => {
    const { error } = await setPlayerview(id);
    if (error) {
      alert(`Error setting playerview: ${error}`);
    } else {
      alert("Playerview set successfully!");

      navigate("/playerview");
    }
  };

  const handleGenerateInventory = async () => {
    setIsGenerating(true);

    const { data, error } = await generateInventory(id);
    if (error) {
      alert(`Error generating inventory: ${error}`);
    } else {
      alert("Inventory generated successfully!");
      setShopkeep(data);
    }

    setIsGenerating(false);
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
            image={shopkeepInfo.image_url}
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
            <IconButton
              onClick={handleSetPlayerview}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "50%",
                alignSelf: "flex-start",
                zIndex: 1,
                marginTop: "1rem",
                marginLeft: "1rem",
              }}
            >
              <VisibilityIcon />
            </IconButton>
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
        <InventoryList inventory={inventory} />
      </Grid2>
    </Grid2>
  );
};

export default ShopkeepDetails;
