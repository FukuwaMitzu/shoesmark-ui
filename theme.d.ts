import { PaletteColorOptions } from "@mui/material"

declare module "@mui/material/styles/createPalette" {
    interface PaletteOptions {
      client?: PaletteColorOptions
      search?: PaletteColorOptions
    }
  }