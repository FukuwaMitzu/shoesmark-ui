import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { styled } from "@mui/material/styles";
import { Color } from "../../apiRequests/color/color";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Category } from "../../apiRequests/category/category";
import Chip from "@mui/material/Chip";
import { Brand } from "../../apiRequests/brand/brand";
import currencyFormater from "../../util/currencyFormater";
import Big from "big.js";
import stringToColor from "../../util/stringToColor";

interface DetailImportOrderItemProps {
  shoesId: string;
  shoesImage: string;
  shoesName: string;
  color?: Color;
  size: number;
  quantity: number;
  price: number;
  brand?: Brand;
  categories?: Category[];
  disabled?: boolean;
  onChange?: (shoesId: string, quantity: number) => void;
  onDelete?: (shoesId: string) => void;
}

const Subheader = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  color: theme.palette.text.primary,
}));

const DetailImportOrderItem: React.FC<DetailImportOrderItemProps> = (props) => {
  const [quantity, setQuantity] = useState(props.quantity);

  const price = new Big(props.price);
  const importQuantity = new Big(quantity);
  const niemYet = price.mul(importQuantity);

  const handleQuantityInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const number = Number.parseInt(e.target.value);
    if (isNaN(number)) return;
    setQuantity(Math.max(number, 1));
  };

  useEffect(()=>{
    setQuantity(props.quantity);
  }, [props.quantity]);

  useEffect(() => {
    if (props.onChange) props.onChange(props.shoesId, quantity);
  }, [quantity]);

  const handleDeleteShoes: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props.onDelete) props.onDelete(props.shoesId);
  };

  return (
    <Box>
      <Stack direction={"row"} gap={2}>
        <Box>
          <Image
            height={"150px"}
            width={"150px"}
            src={`${props.shoesImage}`}
            alt={props.shoesName}
          ></Image>
        </Box>
        <Stack sx={{ flex: 1 }}>
          <Typography>{props.shoesName}</Typography>
          <Subheader direction={"row"} gap={2}>
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
          <Box sx={{ marginTop: "5px" }}>
            <Typography color={"error"} variant={"h6"}>
              {currencyFormater.format(niemYet.toNumber())}
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
              disabled={props.disabled}
              label="Số lượng"
              type={"number"}
              size="small"
              sx={{ width: "15ch" }}
              value={quantity}
              onChange={handleQuantityInput}
            ></TextField>
            <Box sx={{ flex: 1 }}></Box>
            {
              !props.disabled &&
              <Button color="error" onClick={handleDeleteShoes}>
                Xoá
            </Button>
            }
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default DetailImportOrderItem;
