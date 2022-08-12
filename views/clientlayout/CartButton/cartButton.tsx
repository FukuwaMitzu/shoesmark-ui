import IconButton from "@mui/material/IconButton";
import LocalMallIcon from '@mui/icons-material/LocalMall';
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import Box from "@mui/material/Box";
import CartItem from "./CartItem/cartItem";
import Button from "@mui/material/Button";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

interface CartButtonProps {

}

const CartButton: React.FC<CartButtonProps> = (data) => {
    const [cartAnchor, setCartAnchor] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setCartAnchor(event.currentTarget);
    }
    const handleClose = () => {
        setCartAnchor(null);
    }

    return (
        <Box>
            <IconButton
                color="inherit"
                onClick={handleClick}
            >
                <Badge badgeContent={10} color={"error"}>
                    <LocalMallIcon></LocalMallIcon>
                </Badge>
            </IconButton>
            <Popover
                anchorEl={cartAnchor}
                open={Boolean(cartAnchor)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={handleClose}
            >
            {//TODO: Thêm giao diện giỏ hàng
            }
            <Box sx={{ width: "100%" }}>
            <Stack direction="column" divider={<Divider></Divider>}>
                <CartItem image="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg">
                
                </CartItem>

                <CartItem image="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg">
                
                </CartItem>
                <CartItem image="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg">
                
                </CartItem>
                
                
            </Stack>
            </Box>
           
            <Box sx={{display:"flex", flexDirection:"row-reverse", position:"sticky", bottom: 0, backgroundColor:"background.paper", paddingY: 1}}>
                <Button variant="text">
                    Xem tất cả
                    <ArrowRightIcon fontSize="large"/>
                </Button>
            </Box>
            </Popover>
        </Box>
    )
}
export default CartButton;