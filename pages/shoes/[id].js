import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Detail() {
    return(
        <Stack direction={'column'}>
            <Stack direction={'row'}>
                <Box>
                    <img width={"100%"} height={"400px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                </Box>
                <Stack direction={'column'}>
                    <Typography variant="h4">Tên sản phẩm</Typography>
                    <Typography variant="subtitle1">Hãng: Adidas</Typography>
                    <Typography variant="subtitle1">Loại: Đi bộ</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}