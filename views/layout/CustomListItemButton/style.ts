import { alpha, SxProps, Theme } from "@mui/material/styles";

export const ListItemActiveStyle:SxProps<Theme>={
    color: "primary.main",
    backgroundColor: (theme)=>alpha(theme.palette.primary.main, 0.08),
    ":hover":{
        backgroundColor: (theme)=>alpha(theme.palette.primary.main, .13)
    }
};