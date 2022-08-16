import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export default function Detail() {
    return(
        <Stack direction={'column'} gap={4}>
            <Stack direction={'row'} gap={2}>
                <Box>
                    <img width={"100%"} height={"400px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                </Box>
                <Stack justifyContent={'space-around'} direction={'column'}>
                    <Typography variant="h3">Tên sản phẩm</Typography>
                    <Typography variant="h5">Hãng: Adidas</Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip label="Nam" />
                        <Chip label="Đi bộ"/>
                    </Stack>
                    <Typography variant="subtitle1">Size: 39</Typography>
                    <Typography variant="subtitle1">Màu trắng</Typography>
                    <Typography variant="h4" >Giá: 2.999.000 đ</Typography>
                    <Button variant="contained" endIcon={<ShoppingCartCheckoutIcon/>}>Thêm vào giỏ hàng</Button>
                </Stack>
            </Stack>
            <Box bgcolor={'#ECEFF1'} sx={{display:'flex',flexDirection:'column',padding:'20px',hight:'30px',lineHeight:'30px'}} gap={2}>
                <Typography variant="h5">Thông tin chi tiết sản phẩm</Typography>
                <Typography sx={{lineHeight:'inherit'}}>
                    Vẻ đẹp kinh điển. Phong cách vốn dĩ. Đa năng hàng ngày. Suốt hơn 50 năm qua và chưa dừng ở đó, giày adidas Stan Smith luôn giữ vững vị trí là một biểu tượng. Đôi giày này là phiên bản cải biên mới mẻ, là một phần cam kết của adidas hướng tới chỉ sử dụng polyester tái chế bắt đầu từ năm 2024. Với thân giày vegan và đế ngoài làm từ cao su phế liệu, đôi giày này vẫn mang phong cách đầy tính biểu tượng, đồng thời thân thiện với môi trường.
                </Typography>
                <Typography sx={{lineHeight:'inherit'}}>
                    Giày sử dụng chất liệu vegan thay cho thành phần hoặc chất liệu có nguồn gốc từ động vật. Sản phẩm này may bằng vải công nghệ Primegreen, thuộc dòng chất liệu tái chế hiệu năng cao. Thân giày chứa 50% thành phần tái chế. Không sử dụng polyester nguyên sinh.
                </Typography>
            </Box>
            <Stack gap={1}>
                <Typography variant="h5">Các sản phẩm liên quan</Typography>
                <Stack direction={'row'} gap={1}>
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                    <img width={"100%"} height={"120px"} src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg" />
                </Stack>
            </Stack>
        </Stack>
    )
}