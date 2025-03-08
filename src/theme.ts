
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Color mode config
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#f3e8ff",
    100: "#e4cbff",
    200: "#d2adff",
    300: "#c18eff",
    400: "#b070ff",
    500: "#9d52ff",
    600: "#8a3aff",
    700: "#7622ff",
    800: "#630aff",
    900: "#5100e6",
  },
  ramadan: {
    gold: "#E6B97A",
    purple: "#9370DB",
    deepBlue: "#1A365D",
    green: "#48BB78",
    darkPurple: "#5E366E",
    navy: "#0F2942",
    cream: "#FFF8E5",
    burgundy: "#800020",
  },
};

const theme = extendTheme({
  colors,
  config,
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "ramadan.purple",
          color: "white",
          _hover: {
            bg: "ramadan.darkPurple",
          },
        },
        outline: {
          border: "2px solid",
          borderColor: "ramadan.purple",
          color: "ramadan.purple",
        },
        ghost: {
          color: "ramadan.purple",
          _hover: {
            bg: "ramadan.purple",
            bg_opacity: 0.1,
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "white",
          boxShadow: "lg",
          borderRadius: "xl",
          overflow: "hidden",
        },
      },
      variants: {
        elevated: (props) => ({
          container: {
            bg: props.colorMode === "dark" ? "gray.800" : "white",
          },
        }),
      },
      defaultProps: {
        variant: "elevated",
      },
    },
  },
});

export default theme;
