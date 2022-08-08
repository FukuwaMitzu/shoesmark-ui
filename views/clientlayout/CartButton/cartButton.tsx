import IconButton from "@mui/material/IconButton";
import LocalMallIcon from '@mui/icons-material/LocalMall';
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import Box from "@mui/material/Box";

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
            </Popover>
        </Box>
    )
}
export default CartButton;