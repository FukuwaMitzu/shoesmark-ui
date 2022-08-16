import * as React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { SHOESMARK_API_DOMAIN } from "../../../../config/domain";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import useLocalStorage from "@rehooks/local-storage";
import { CartLocalStorge } from "../../../../interfaces/CartLocalStorge";
import Big from "big.js";
import { Color } from "../../../../api/color/color";
import currencyFormater from "../../../../util/currencyFormater";
import Tooltip from "@mui/material/Tooltip";

interface CartShoesPopoverItemProps {
  shoesId: string;
  shoesImage: string;
  shoesName: string;
  color?: Color;
  size: number;
  quantity: number;
  buyQuantity: number;
  price: number;
  sale: number;
}

const CartItem: React.FC<CartShoesPopoverItemProps> = (props) => {
  const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);
  const [buyQuantity, setQuantity] = useState(props.buyQuantity);

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
    <Box sx={{ display: "flex" }}>
      <Image
        width={"120px"}
        height={"120px"}
        src={`${SHOESMARK_API_DOMAIN}/${props.shoesImage}`}
        objectFit="cover"
        alt="123"
      />
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography width="175px" noWrap>
            {props.shoesName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {props.color?.colorName}
          </Typography>
        </CardContent>
        <Box
          sx={{ display: "flex", alignItems: "center", pl: 2, pb: 1, gap: 1 }}
        >
          <Typography>Size: {props.size}</Typography>
          <TextField
            label="Số lượng"
            type={"number"}
            size="small"
            sx={{ width: "15ch" }}
            value={buyQuantity}
            onChange={handleQuantityInput}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          flexShrink: 0,
        }}
      >
        <CardContent>
          <Typography noWrap textAlign={"right"}>
            {currencyFormater.format(khuyenMai.toNumber())}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", flex:1, pl: 9, pb: 1 }}>
          <Tooltip title="Xoá">
            <IconButton aria-label="delete" onClick={handleDeleteShoes}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
