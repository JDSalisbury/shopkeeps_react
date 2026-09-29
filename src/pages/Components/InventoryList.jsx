import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const BLANK = { name: "", price: "", quantity: "", description: "", damage: "N/A", armor_class: "N/A" };

const ItemForm = ({ form, onChange, onSave, onCancel, saveLabel = "Save" }) => (
  <Stack spacing={1} sx={{ p: 1, width: "100%" }}>
    <Stack direction="row" spacing={1}>
      <TextField label="Name" size="small" value={form.name} onChange={e => onChange("name", e.target.value)} sx={{ flex: 1 }} />
      <TextField label="Price" size="small" type="number" value={form.price} onChange={e => onChange("price", e.target.value)} sx={{ width: 90 }} />
      <TextField label="Qty" size="small" type="number" value={form.quantity} onChange={e => onChange("quantity", e.target.value)} sx={{ width: 70 }} />
    </Stack>
    <TextField label="Description" size="small" multiline value={form.description} onChange={e => onChange("description", e.target.value)} fullWidth />
    <Stack direction="row" spacing={1}>
      <TextField label="Damage" size="small" value={form.damage} onChange={e => onChange("damage", e.target.value)} sx={{ flex: 1 }} />
      <TextField label="AC" size="small" value={form.armor_class} onChange={e => onChange("armor_class", e.target.value)} sx={{ flex: 1 }} />
    </Stack>
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Button size="small" onClick={onCancel}>Cancel</Button>
      <Button size="small" variant="contained" onClick={onSave}>{saveLabel}</Button>
    </Stack>
  </Stack>
);

const coerce = (form) => ({ ...form, price: Number(form.price), quantity: Number(form.quantity) });

const InventoryList = ({ inventory, onAdd, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(BLANK);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(BLANK);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: item.price, quantity: item.quantity, description: item.description, damage: item.damage, armor_class: item.armor_class });
  };

  const handleEditSave = () => {
    onUpdate(editingId, coerce(editForm));
    setEditingId(null);
  };

  const handleAddSave = () => {
    onAdd(coerce(addForm));
    setAddForm(BLANK);
    setShowAdd(false);
  };

  return (
    <Card sx={{ overflowY: "auto", maxHeight: "70vh" }}>
      {onAdd && (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {showAdd ? (
            <ItemForm
              form={addForm}
              onChange={(k, v) => setAddForm(f => ({ ...f, [k]: v }))}
              onSave={handleAddSave}
              onCancel={() => { setShowAdd(false); setAddForm(BLANK); }}
              saveLabel="Add"
            />
          ) : (
            <Button size="small" startIcon={<AddIcon />} onClick={() => setShowAdd(true)} sx={{ m: 1 }}>
              Add Item
            </Button>
          )}
        </Box>
      )}
      <List disablePadding>
        {inventory.map((item, i) => (
          <React.Fragment key={item.id}>
            {i > 0 && <Divider component="li" />}
            {editingId === item.id ? (
              <ListItem>
                <ItemForm
                  form={editForm}
                  onChange={(k, v) => setEditForm(f => ({ ...f, [k]: v }))}
                  onSave={handleEditSave}
                  onCancel={() => setEditingId(null)}
                />
              </ListItem>
            ) : (
              <ListItem alignItems="flex-start">
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 600 }}
                  secondaryTypographyProps={{ component: "div" }}
                  primary={`${item.name} — ${item.price} gold`}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.damage !== "N/A" ? `Damage: ${item.damage} | ` : ""}
                          {item.armor_class !== "N/A" ? `AC: ${item.armor_class} | ` : ""}
                          Qty: {item.quantity}
                        </Typography>
                        {(onUpdate || onDelete) && (
                          <Stack direction="row">
                            {onUpdate && <IconButton size="small" onClick={() => startEdit(item)}><EditIcon fontSize="small" /></IconButton>}
                            {onDelete && <IconButton size="small" color="error" onClick={() => onDelete(item.id)}><DeleteIcon fontSize="small" /></IconButton>}
                          </Stack>
                        )}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default InventoryList;
