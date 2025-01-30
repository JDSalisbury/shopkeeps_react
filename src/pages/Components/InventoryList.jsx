import React from "react";
import { Card, List, ListItem, ListItemText, Typography } from "@mui/material";

const InventoryList = ({ inventory }) => {
  return (
    <Card
      style={{ overflowY: "auto", maxHeight: "70vh", paddingRight: "10px" }}
    >
      <List>
        {inventory.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={`${item.name} (${item.price} gold)`}
              secondary={
                <div>
                  <Typography>{item.description}</Typography>
                  <Typography>
                    {item.damage !== "N/A" ? `Damage: ${item.damage} | ` : ""}
                    {item.armor_class !== "N/A"
                      ? `AC: ${item.armor_class} | `
                      : ""}
                    Qty: {item.quantity}
                  </Typography>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default InventoryList;
