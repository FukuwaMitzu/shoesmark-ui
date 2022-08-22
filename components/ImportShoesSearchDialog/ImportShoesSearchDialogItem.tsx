import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Big from "big.js";
import { Color } from "../../api/color/color";
import currencyFormater from "../../util/currencyFormater";
import Image from "next/image";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import Box from "@mui/material/Box";

interface ImportShoesSearchDialogItemProps {
  shoesId: string;
  shoesName: string;
  size: number;
  color?: Color;
  shoesImage: string;
  importPrice: number;
}

const ImportShoesSearchDialogItem: React.FC<
  ImportShoesSearchDialogItemProps
> = (shoes) => {
  const importPrice = new Big(shoes.importPrice);

  return (
    <Card sx={{ width: "100%" }}>
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
        src={`${SHOESMARK_API_DOMAIN}/${shoes.shoesImage}`}
        alt={shoes.shoesName}
      />
      <CardContent>
        <Typography color={"error"} variant={"h6"}>
          {currencyFormater.format(importPrice.toNumber())}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default ImportShoesSearchDialogItem;
