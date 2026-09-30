import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InventoryList from "./Components/InventoryList";
import {
  addItem,
  deleteItem,
  deleteShopkeep,
  fetchShopkeepById,
  generateInventory,
  setPlayerview,
  updateItem,
  updateShopkeep,
} from "../api/shopkeepAPI";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ShopkeepDetails = () => {
  const { id } = useParams();
  const [shopkeep, setShopkeep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingShopkeep, setEditingShopkeep] = useState(false);
  const [shopkeepForm, setShopkeepForm] = useState({});

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

  const startEditShopkeep = () => {
    const s = shopkeep.shopkeep;
    setShopkeepForm({ gold: s.gold ?? 0, friendship_level: s.friendship_level ?? 0, notes: s.notes ?? "" });
    setEditingShopkeep(true);
  };

  const handleShopkeepSave = async () => {
    const updates = { gold: Number(shopkeepForm.gold), friendship_level: Number(shopkeepForm.friendship_level), notes: shopkeepForm.notes };
    const { error } = await updateShopkeep(id, updates);
    if (error) { alert(`Error: ${error}`); return; }
    setShopkeep(prev => ({ ...prev, shopkeep: { ...prev.shopkeep, ...updates } }));
    setEditingShopkeep(false);
  };

  const handleItemAdd = async (item) => {
    const { data, error } = await addItem(id, item);
    if (error) { alert(`Error: ${error}`); return; }
    setShopkeep(prev => ({ ...prev, inventory: [...prev.inventory, data] }));
  };

  const handleItemUpdate = async (itemId, updates) => {
    const { data, error } = await updateItem(itemId, updates);
    if (error) { alert(`Error: ${error}`); return; }
    setShopkeep(prev => ({ ...prev, inventory: prev.inventory.map(item => item.id === itemId ? data : item) }));
  };

  const handleDeleteShopkeep = async () => {
    if (!window.confirm(`Delete ${shopkeep.shopkeep.name}? This cannot be undone.`)) return;
    const { error } = await deleteShopkeep(id);
    if (error) { alert(`Error: ${error}`); return; }
    navigate("/admin");
  };

  const handleItemDelete = async (itemId) => {
    const { error } = await deleteItem(itemId);
    if (error) { alert(`Error: ${error}`); return; }
    setShopkeep(prev => ({ ...prev, inventory: prev.inventory.filter(item => item.id !== itemId) }));
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Error: {error}</Typography>;

  const { shopkeep: shopkeepInfo, inventory } = shopkeep;

  return (
    <>
      <Box
        onClick={() => navigate("/admin")}
        title="Back to list"
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
          "& .back-icon": { position: "absolute", top: 6, right: -56, color: "common.white", fontSize: 20, transition: "right 180ms ease" },
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
            <CardMedia component="img" image={shopkeepInfo.image_url} alt={shopkeepInfo.name} />
            <CardContent>
              <Typography variant="h5">
                {shopkeepInfo.name}{" "}
                <Typography variant="subtitle2" component="span" color="text.secondary" sx={{ verticalAlign: "middle" }}>
                  — {shopkeepInfo.character_class}
                </Typography>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>{shopkeepInfo.description}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Voice: {shopkeepInfo.voice}</Typography>
              <Typography variant="body2" color="text.secondary">Personality: {shopkeepInfo.personality}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
                <Button variant="contained" color="primary" onClick={handleGenerateInventory} disabled={isGenerating}>
                  {isGenerating ? <CircularProgress size={24} sx={{ color: "common.white" }} /> : "Generate Inventory"}
                </Button>
                <Tooltip title="Show this shopkeep to players">
                  <IconButton
                    onClick={handleSetPlayerview}
                    color="primary"
                    sx={{ bgcolor: "primary.main", color: "common.white", "&:hover": { bgcolor: "primary.dark" } }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete shopkeep">
                  <IconButton
                    onClick={handleDeleteShopkeep}
                    sx={{ bgcolor: "error.main", color: "common.white", "&:hover": { bgcolor: "error.dark" } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={8} sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5">
              {shopkeepInfo.shop_name}{" "}
              <Typography variant="subtitle2" component="span" color="text.secondary" sx={{ verticalAlign: "middle" }}>
                — {shopkeepInfo.shop_type}
              </Typography>
            </Typography>

            {editingShopkeep ? (
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Gold"
                    size="small"
                    type="number"
                    value={shopkeepForm.gold}
                    onChange={e => setShopkeepForm(f => ({ ...f, gold: e.target.value }))}
                    sx={{ width: 120 }}
                  />
                  <TextField
                    label="Friendship Level"
                    size="small"
                    type="number"
                    value={shopkeepForm.friendship_level}
                    onChange={e => setShopkeepForm(f => ({ ...f, friendship_level: e.target.value }))}
                    sx={{ width: 150 }}
                  />
                </Stack>
                <TextField
                  label="Notes"
                  size="small"
                  multiline
                  minRows={2}
                  value={shopkeepForm.notes}
                  onChange={e => setShopkeepForm(f => ({ ...f, notes: e.target.value }))}
                  fullWidth
                />
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => setEditingShopkeep(false)}>Cancel</Button>
                  <Button size="small" variant="contained" onClick={handleShopkeepSave}>Save</Button>
                </Stack>
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Gold: {shopkeepInfo.gold} | Friendship Level: {shopkeepInfo.friendship_level}
                  {shopkeepInfo.notes ? ` | ${shopkeepInfo.notes}` : ""}
                </Typography>
                <IconButton size="small" onClick={startEditShopkeep} sx={{ ml: 0.5 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Box>

          <InventoryList
            inventory={inventory}
            onAdd={handleItemAdd}
            onUpdate={handleItemUpdate}
            onDelete={handleItemDelete}
          />
        </Grid2>
      </Grid2>
    </>
  );
};

export default ShopkeepDetails;
