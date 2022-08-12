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
import { Category } from "../../api/category/category";
import Chip from "@mui/material/Chip";
import { Brand } from "../../api/brand/brand";
import currencyFormater from "../../util/currencyFormater";
import Big from "big.js";

interface DetailOrderItemProps {
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
  onChange?: (shoesId: string, quantity: number) => void;
  onDelete?: (shoesId: string) => void;
}

const Subheader = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  color: theme.palette.text.primary,
}));

const DetailOrderItem: React.FC<DetailOrderItemProps> = (data) => {
  const [buyQuantity, setQuantity] = useState(data.buyQuantity);

  const price = new Big(data.price);
  const buy = new Big(buyQuantity);
  const sale = new Big(data.sale);

  const niemYet = price.mul(buy);

  const khuyenMai = price.mul(buy.mul((new Big(100)).minus(sale)).div(100));

  const handleQuantityInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const number = Number.parseInt(e.target.value);
    if (isNaN(number)) return;
    setQuantity(Math.min(Math.max(number, 1), data.quantity));
  };

  useEffect(() => {
    if (data.onChange) data.onChange(data.shoesId, data.quantity);
  }, [data.quantity]);

  const handleDeleteShoes: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (data.onDelete) data.onDelete(data.shoesId);
  };

  return (
    <Box>
      <Stack direction={"row"} gap={2}>
        <Box>
          <Image
            height={"150px"}
            width={"150px"}
            src={`${SHOESMARK_API_DOMAIN}/${data.shoesImage}`}
          ></Image>
        </Box>
        <Stack sx={{ flex: 1 }}>
          <Typography>{data.shoesName}</Typography>
          <Subheader direction={"row"} gap={2}>
            <Typography>Size: {data.size}</Typography>
            {data.color && (
              <Stack direction={"row"} alignItems="center" gap={1}>
                <Box
                  sx={{
                    backgroundColor: data.color?.colorHex,
                    width: "15px",
                    height: "15px",
                  }}
                ></Box>
                <Typography>{data.color?.colorName}</Typography>
              </Stack>
            )}
          </Subheader>
          <Stack
            direction="row"
            spacing={1}
            marginTop={"7px"}
            marginBottom={"7px"}
          >
            {data.categories?.map((category) => (
              <Chip
                key={category.categoryId}
                label={category.categoryName}
                size="small"
              />
            ))}
          </Stack>
          <Typography sx={{ marginY: "5px" }} color="GrayText">
            Còn {data.quantity - buyQuantity} sản phẩm
          </Typography>
          <Box sx={{ marginTop: "5px" }}>
            {data.sale > 0 && (
              <Typography
                color="GrayText"
                sx={{ textDecorationLine: "line-through" }}
              >{`${currencyFormater.format(niemYet.toNumber())}`}</Typography>
            )}
            <Typography color={"error"} variant={"h6"}>
              {currencyFormater.format(khuyenMai.toNumber())}
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
export default DetailOrderItem;
