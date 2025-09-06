import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    authtext: {
      main: string;
    };
  }
  interface PaletteOptions {
    authtext: {
      main: string;
    };
  }
}

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  defaultColorScheme: "light",
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0B1D51",
          light: "#3a4a7c",
          dark: "#06123a",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#725CAD",
          light: "#a18be6",
          dark: "#4c3977",
          contrastText: "#ffffff",
        },
        error: {
          main: "#D32F2F",
          light: "#EF5350",
          dark: "#C62828",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#FBC02D",
          light: "#FFEE58",
          dark: "#F57F17",
          contrastText: "#000000",
        },
        info: {
          main: "#0288D1",
          light: "#4FC3F7",
          dark: "#01579B",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#388E3C",
          light: "#66BB6A",
          dark: "#2E7D32",
          contrastText: "#FFFFFF",
        },
        authtext: {
          main: "#FFFFFF",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#8073fa",
          light: "#a79efc",
          dark: "#5b4ec7",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#cf72ed",
          light: "#e3a1f5",
          dark: "#9e52b5",
          contrastText: "#ffffff",
        },
        error: {
          main: "#EF5350",
          light: "#E57373",
          dark: "#D32F2F",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#FFCA28",
          light: "#FFE082",
          dark: "#FBC02D",
          contrastText: "#000000",
        },
        info: {
          main: "#4FC3F7",
          light: "#81D4FA",
          dark: "#0288D1",
          contrastText: "#000000",
        },
        success: {
          main: "#66BB6A",
          light: "#A5D6A7",
          dark: "#388E3C",
          contrastText: "#000000",
        },
        authtext: {
          main: "#000000",
        },
      },
    },
  },
  typography: {
    fontFamily:
      'Inter, Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.4,
      color: "#8073fa",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      fontFamily: "Poppins, sans-serif",
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
});

export default theme;
