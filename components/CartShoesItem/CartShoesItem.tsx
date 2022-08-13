import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { styled } from "@mui/material/styles";
import { Color } from "../../api/color/color";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import useLocalStorage from "@rehooks/local-storage";
import { CartLocalStorge } from "../../interfaces/CartLocalStorge";
import { Category } from "../../api/category/category";
import Chip from "@mui/material/Chip";
import { Brand } from "../../api/brand/brand";
import Big from "big.js";
import stringToColor from "../../util/stringToColor";
interface CartShoesItemProps {
  shoesId: string;
  shoesImage: string;
  shoesName: string;
  color?: Color;
  size: number;
  quantity: number;
  buyQuantity: number;
  price: number;
  sale: number;
  brand?: Brand;
  categories?: Category[];
}

const Subheader = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  color: theme.palette.text.primary,
}));

const CartShoesItem: React.FC<CartShoesItemProps> = (props) => {
  const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);
  const [buyQuantity, setQuantity] = useState(props.buyQuantity);

  var formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });

  const price = new Big(props.price);
  const buy = new Big(buyQuantity);
  const sale = new Big(props.sale);

  const niemYet = price.mul(buyQuantity);
  const khuyenMai = price
    .mul(buyQuantity)
    .mul(new Big(100).minus(sale).div(100));

  const handleQuantityInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const number = Number.parseInt(e.target.value);
    if (isNaN(number)) return;
    setQuantity(Math.min(Math.max(number, 1), props.quantity));
  };

  const handleDeleteShoes: MouseEventHandler<HTMLButtonElement> = (e) => {
    setCart(cart.filter((shoes) => shoes.shoesId != props.shoesId));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      const shoes = cart.find((shoes) => shoes.shoesId == props.shoesId);
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
          <Image
            height={"150px"}
            width={"150px"}
            src={`${SHOESMARK_API_DOMAIN}/${props.shoesImage}`}
            alt={props.shoesName}
          ></Image>
        </Box>
        <Stack sx={{ flex: 1 }}>
          <Typography>{props.shoesName}</Typography>
          <Subheader direction={"row"} gap={2}>
            <Typography>{props.brand?.brandName}</Typography>
            <Typography>Size: {props.size}</Typography>
            {props.color && (
              <Stack direction={"row"} alignItems="center" gap={1}>
                <Box
                  sx={{
                    backgroundColor: props.color?.colorHex,
                    width: "15px",
                    height: "15px",
                  }}
                ></Box>
                <Typography>{props.color?.colorName}</Typography>
              </Stack>
            )}
          </Subheader>
          <Stack
            direction="row"
            spacing={1}
            marginTop={"7px"}
            marginBottom={"7px"}
          >
            {props.brand && (
              <Chip
                sx={{
                  bgcolor: stringToColor(props.brand?.brandName),
                  color: "white",
                }}
                label={props.brand?.brandName}
                size="small"
              />
            )}
            {props.categories?.map((category) => (
              <Chip
                key={category.categoryId}
                label={category.categoryName}
                size="small"
              />
            ))}
          </Stack>
          <Typography sx={{ marginY: "5px" }} color="GrayText">
            Còn {props.quantity - buyQuantity} sản phẩm
          </Typography>
          <Box sx={{ marginTop: "5px" }}>
            {props.sale > 0 && (
              <Typography
                color="GrayText"
                sx={{ textDecorationLine: "line-through" }}
              >{`${formatter.format(niemYet.toNumber())}`}</Typography>
            )}
            <Typography color={"error"} variant={"h6"}>
              {formatter.format(khuyenMai.toNumber())}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}></Box>
          <Stack
            direction={"row"}
            gap={2}
            marginTop={"15px"}
            alignItems={"center"}
          >
            <TextField
              label="Số lượng"
              type={"number"}
              size="small"
              sx={{ width: "15ch" }}
              value={buyQuantity}
              onChange={handleQuantityInput}
            ></TextField>
            <Box sx={{ flex: 1 }}></Box>
            <Button color="error" onClick={handleDeleteShoes}>
              Xoá
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default CartShoesItem;
