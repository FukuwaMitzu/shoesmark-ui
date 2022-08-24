import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Big from "big.js";
import { Color } from "../../apiRequests/color/color";
import currencyFormater from "../../util/currencyFormater";
import Image from "next/image";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import Box from "@mui/material/Box";

interface ShoesShearchDialogItemProps {
    shoesId: string,
    shoesName: string
    size: number,
    color?: Color,
    shoesImage: string,
    price: number,
    sale: number,
    quantity: number,
}


const ShoesSearchDialogItem: React.FC<ShoesShearchDialogItemProps> = (shoes) => {
    const price = new Big(shoes.price);
    const sale = new Big(shoes.sale);


    const niemYet = price;
    const khuyenMai = price.mul((new Big(100)).minus(sale).div(100));
  return (
    <Card sx={{width:"100%"}}>
      <CardHeader
        title={
          <Typography
            sx={{
              height: "48px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {shoes.shoesName}
          </Typography>
        }
        subheader={
          <Stack direction={"row"} gap={2} alignItems="center">
            <Typography>Size: {shoes.size}</Typography>
            {shoes.color && (
              <Stack direction={"row"} alignItems="center" gap={1}>
                <Box
                  sx={{
                    backgroundColor: shoes.color?.colorHex,
                    width: "15px",
                    height: "15px",
                  }}
                ></Box>
                <Typography>{shoes.color?.colorName}</Typography>
              </Stack>
            )}
          </Stack>
        }
      />
      <Image
        layout="responsive"
        width={"100%"}
        height={"75px"}
        objectFit={"cover"}
        src={`${shoes.shoesImage}`}
        alt={shoes.shoesName}
      />
      <CardContent>
        {shoes.quantity > 0 ? (
          <>
            <Typography
              color="GrayText"
              sx={{
                textDecorationLine: "line-through",
                opacity: shoes.sale != 0 ? 1 : 0,
              }}
            >{`${currencyFormater.format(niemYet.toNumber())}`}</Typography>
            <Typography color={"error"} variant={"h6"}>
              {currencyFormater.format(khuyenMai.toNumber())}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              color="GrayText"
              sx={{ textDecorationLine: "line-through", opacity: 0 }}
            >{`${currencyFormater.format(niemYet.toNumber())}`}</Typography>
            <Typography color={"error"} variant={"h6"}>
              Hết hàng
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};
export default ShoesSearchDialogItem;