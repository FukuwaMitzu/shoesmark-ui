import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal"
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { Color } from "../../api/color/color";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import useLocalStorage from "@rehooks/local-storage";
import { CartLocalStorge } from "../../interfaces/CartLocalStorge";
import { useSnackbar } from "notistack";

interface CartModalProps {
    shoesId: string,
    open: boolean,
    shoesName: string
    size: number,
    color?: Color,
    shoesImage: string,
    price: number,
    sale: number,
    quantity: number,
    onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void
}

const Wrapper = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "100%",
    maxWidth: "575px",
    backgroundColor: theme.palette.background.paper,
    padding: 15,
}));

const Subheader = styled(Stack)(({ theme }) => ({
    alignItems: "center",
    color: theme.palette.text.primary
}));


const CartBackDrop: React.FC<CartModalProps> = (data) => {
    const [buyQuantity, setQuantity] = useState(1);
    const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);
    const {enqueueSnackbar} = useSnackbar();
    const niemYet = data.price * buyQuantity;
    const khuyenMai = data.price * buyQuantity * (100 - data.sale) / 100;

    var formatter = new Intl.NumberFormat('vi', {
        style: 'currency',
        currency: 'VND',
    });

    const handleQuantityInput:ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e)=>{
        const number = Number.parseInt(e.target.value);
        if(isNaN(number))return;
        setQuantity(Math.min(Math.max(number, 1), data.quantity));
    }
    const handleAddToCart:MouseEventHandler<HTMLButtonElement> = (e)=>{
        const cartItem = cart.find((item)=>item.shoesId==data.shoesId);
        if(cartItem){cartItem.quantity += buyQuantity;    }
        else cart.push({shoesId: data.shoesId, quantity: buyQuantity});
        setCart([...cart]);
        enqueueSnackbar("Đã thêm sản phẩm vào giỏ hàng", {variant: "success"});
        //Close the modal
        if(data.onClose) data.onClose(e, "backdropClick");
    }
    return (
        <Modal
            open={data.open}
            onClose={data.onClose}
        >
            <Wrapper>
                <Stack width={"100%"} direction={"row"} gap={2}>
                    <Box>
                        <Image width={"175px"} height={"175px"} src={`${SHOESMARK_API_DOMAIN}/${data.shoesImage}`} />
                    </Box>
                    <Stack sx={{flex:1}}>
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
                        <Typography sx={{marginY: "5px"}} color="GrayText">Còn {data.quantity - buyQuantity} sản phẩm</Typography>
                        <Box sx={{ marginTop: "10px" }}>
                            {
                                data.sale > 0 &&
                                <Typography color="GrayText" sx={{ textDecorationLine: "line-through" }}>{`${formatter.format(niemYet)}`}</Typography>
                            }
                            <Typography color={"error"} variant={"h6"}>
                                {formatter.format(khuyenMai)}
                            </Typography>
                        </Box>
                        <Box sx={{flex:1}}></Box>
                        <Stack direction={"row"} gap={2} marginTop={"15px"} alignItems={"center"}>
                            <TextField label="Số lượng" type={"number"} size="small" sx={{width:"15ch"}} value={buyQuantity} onChange={handleQuantityInput}></TextField>
                            <Box sx={{flex:1}}></Box>
                            <Button color="error" onClick={(e)=>{if(data.onClose)data.onClose(e, "backdropClick")}}>Huỷ</Button>
                            <Button onClick={handleAddToCart}>Thêm</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Wrapper>
        </Modal>
    )
}

export default CartBackDrop;