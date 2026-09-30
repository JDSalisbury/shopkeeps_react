import { createTheme } from "@mui/material/styles";

// Fantasy tavern palette: emerald + gold on warm parchment.
// The theme carries color/spacing/typography so pages stay free of hardcoded values.
const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32", light: "#4caf50", dark: "#1b5e20" },
    secondary: { main: "#b8860b", light: "#d4af37", dark: "#8b6508" },
    background: { default: "#f4efe4", paper: "#fffdf7" },
    text: { primary: "#2b2620", secondary: "#6b6154" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h5: { fontFamily: '"Cinzel", serif', fontWeight: 700 },
    h6: { fontFamily: '"Cinzel", serif', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(184, 134, 11, 0.28)",
          boxShadow: "0 2px 14px rgba(43, 38, 32, 0.1), inset 0 0 0 1px rgba(184, 134, 11, 0.07)",
        },
      },
    },
  },
});

// Lift-on-hover for clickable cards only (list grid), not static detail/inventory cards.
export const hoverCardSx = {
  transition: "transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },
};

export default theme;
