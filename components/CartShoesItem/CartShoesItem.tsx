import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { styled } from "@mui/material/styles";
import { Color } from "../../api/color/color";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react";
import useLocalStorage from "@rehooks/local-storage";
import { CartLocalStorge } from "../../interfaces/CartLocalStorge";
import { Category } from "../../api/category/category";
import Chip from "@mui/material/Chip";

interface CartShoesItemProps {
    shoesId: string,
    shoesImage: string
    shoesName: string,
    color?: Color,
    size: number,
    quantity: number,
    buyQuantity: number,
    price: number,
    sale: number,
    categories?: Category[],
}

const Subheader = styled(Stack)(({ theme }) => ({
    alignItems: "center",
    color: theme.palette.text.primary
}));

const CartShoesItem: React.FC<CartShoesItemProps> = (data) => {
    const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);
    const [buyQuantity, setQuantity] = useState(data.buyQuantity);

    var formatter = new Intl.NumberFormat('vi', {
        style: 'currency',
        currency: 'VND',
    });

    const niemYet = data.price * buyQuantity;
    const khuyenMai = data.price * buyQuantity * (100 - data.sale) / 100;


    const handleQuantityInput: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const number = Number.parseInt(e.target.value);
        if (isNaN(number)) return;
        setQuantity(Math.min(Math.max(number, 1), data.quantity));
    }

    const handleDeleteShoes: MouseEventHandler<HTMLButtonElement> = (e) => {
        setCart(cart.filter((shoes)=>shoes.shoesId != data.shoesId));
    }

    useEffect(() => {
        const delay = setTimeout(() => {
            const shoes = cart.find((shoes) => shoes.shoesId == data.shoesId);
            if (shoes) {
                shoes.quantity = buyQuantity;
                setCart([...cart]);
            }
        }, 150);
        return () => clearTimeout(delay);
    }, [buyQuantity]);

    return (
        <Box>
            <Stack direction={"row"} gap={2}>
                <Box>
                    <Image height={"150px"} width={"150px"} src={`${SHOESMARK_API_DOMAIN}/${data.shoesImage}`}></Image>
                </Box>
                <Stack sx={{ flex: 1 }}>
                    <Typography>{data.shoesName}</Typography>
                    <Subheader direction={"row"} gap={2}>
                        <Typography>Size: {data.size}</Typography>
                        {
                            data.color &&
                            <Stack direction={"row"} alignItems="center" gap={1}>
                                <Box sx={{ backgroundColor: data.color?.colorHex, width: "15px", height: "15px" }}></Box>
                                <Typography>{data.color?.colorName}</Typography>
                            </Stack>
                        }
                    </Subheader>
                    <Stack direction="row" spacing={1} marginTop={"7px"} marginBottom={"7px"}>
                        {
                            data.categories?.map((category) => (
                                <Chip key={category.categoryId} label={category.categoryName} size="small" />
                                ))
                            }
                    </Stack>
                    <Typography sx={{marginY: "5px"}} color="GrayText">Còn {data.quantity - buyQuantity} sản phẩm</Typography>
                    <Box sx={{ marginTop: "5px" }}>
                        {
                            data.sale > 0 &&
                            <Typography color="GrayText" sx={{ textDecorationLine: "line-through" }}>{`${formatter.format(niemYet)}`}</Typography>
                        }
                        <Typography color={"error"} variant={"h6"}>
                            {formatter.format(khuyenMai)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}></Box>
                    <Stack direction={"row"} gap={2} marginTop={"15px"} alignItems={"center"}>
                        <TextField label="Số lượng" type={"number"} size="small" sx={{ width: "15ch" }} value={buyQuantity} onChange={handleQuantityInput}></TextField>
                        <Box sx={{ flex: 1 }}></Box>
                        <Button color="error" onClick={handleDeleteShoes}>Xoá</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}
export default CartShoesItem;