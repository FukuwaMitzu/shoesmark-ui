import * as React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";

export default function CartItem(data) {
  return (
    <Box sx={{ display: "flex" }}>
      <Image width={"100%"} height={"75px"} src={`${data.image}`} />
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography width={'250px'} noWrap="true">
            Chuck 70 Canvas
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            Trắng
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 2, pb: 1, gap: 1}}>
          <Typography>Size:40</Typography>
          <TextField label="Số lượng" type={'number'} size="small" sx={{width:"12ch"}}/>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography>2.999.000 đ</Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 9, pb: 1 }}>
          <IconButton aria-label="delete">
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
