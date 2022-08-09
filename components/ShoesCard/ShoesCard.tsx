import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from "@mui/material/IconButton"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { Color } from '../../api/color/color'
import { SHOESMARK_API_DOMAIN } from '../../config/domain'
import Image from "next/image"
import { MouseEventHandler, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ListItemIcon from '@mui/material/ListItemIcon'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CartModal from '../CartModal/CartModal'

interface ShoesCardProps {
    shoesId: string,
    shoesName: string
    size: number,
    color?: Color,
    shoesImage: string,
    price: number,
    sale: number,
    quantity: number,
}


const ShoesCard: React.FC<ShoesCardProps> = (shoes) => {
    const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
    const [addingCart, setAddingCart] = useState(false);

    const openMore = Boolean(moreAnchor);

    const niemYet = shoes.price;
    const khuyenMai = shoes.price * (100 - shoes.sale) / 100;

    var formatter = new Intl.NumberFormat('vi', {
        style: 'currency',
        currency: 'VND',
    });

    //=========CallBacks====================
    const handleMoreOption: MouseEventHandler<HTMLButtonElement> = (event) => {
        setMoreAnchor(event.currentTarget);
    }
    const closeMore = () => {
        setMoreAnchor(null);
    }
    const handleAddToCart = () => {
        setAddingCart(true);
        closeMore();
    }
    const handleWatchLate = () =>{
        closeMore();
    }
    const closeAddToCart = ()=>{
        setAddingCart(false);
    }
    return (
        <>
            <Card sx={{ maxWidth: "250px", width: "100%" }}>
                <CardHeader
                    action={
                        <>
                            <IconButton aria-label="settings"
                                onClick={handleMoreOption}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                open={openMore}
                                anchorEl={moreAnchor}
                                onClose={closeMore}
                            >
                                {
                                    shoes.quantity > 0 &&
                                    <MenuItem onClick={handleAddToCart}>
                                        <ListItemIcon>
                                            <AddShoppingCartIcon></AddShoppingCartIcon>
                                        </ListItemIcon>
                                        Thêm vào giỏ hàng
                                    </MenuItem>
                                }
                                <MenuItem onClick={handleWatchLate}>
                                    <ListItemIcon>
                                        <WatchLaterIcon></WatchLaterIcon>
                                    </ListItemIcon>
                                    Xem sau
                                </MenuItem>
                            </Menu>
                        </>
                    }
                    title={
                        <Typography
                            sx={{
                                height: "48px",
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical',
                            }}
                        >{shoes.shoesName}</Typography>
                    }
                    subheader={
                        <Stack direction={"row"} gap={2} alignItems="center">
                            <Typography>Size: {shoes.size}</Typography>
                            {
                                shoes.color &&
                                <Stack direction={"row"} alignItems="center" gap={1}>
                                    <Box sx={{ backgroundColor: shoes.color?.colorHex, width: "15px", height: "15px" }}></Box>
                                    <Typography>{shoes.color?.colorName}</Typography>
                                </Stack>
                            }
                        </Stack>
                    }
                />
                <Image
                    layout='responsive'
                    width={"100%"}
                    height={"75px"}
                    objectFit={"cover"}
                    src={`${SHOESMARK_API_DOMAIN}/${shoes.shoesImage}`}
                />
                <CardContent>
                    {
                        shoes.quantity > 0 ?
                            <>
                                <Typography color="GrayText" sx={{ textDecorationLine: "line-through", opacity: shoes.sale != 0 ? 1 : 0 }}>{`${formatter.format(niemYet)}`}</Typography>
                                <Typography color={"error"} variant={"h6"}>
                                    {formatter.format(khuyenMai)}
                                </Typography>
                            </>
                            :
                            <>
                                <Typography color="GrayText" sx={{ textDecorationLine: "line-through", opacity: 0 }}>{`${formatter.format(niemYet)}`}</Typography>
                                <Typography color={"error"} variant={"h6"}>
                                    Hết hàng
                                </Typography>
                            </>
                    }
                </CardContent>

            </Card>
            <CartModal
                {...shoes}
                open={addingCart}
                onClose={closeAddToCart}
            />
        </>
    )
}
export default ShoesCard;