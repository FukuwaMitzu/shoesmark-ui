import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import getShoesRequest, {
  GetShoesQueryKey,
} from "../../api/shoes/getShoesRequest";
import stringToColor from "../../util/stringToColor";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import currencyFormater from "../../util/currencyFormater";
import Big from "big.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
export default function Detail() {
  const router = useRouter();

  //========Queries===============
  const getShoes = useQuery(
    [GetShoesQueryKey],
    () =>
      getShoesRequest({
        shoesId: router.query.id as string,
      }),
    {
      select: ({ data }) => data.data,
    }
  );

  const shoes = getShoes.data;

  const price = new Big(shoes?.price ?? 0);
  const sale = new Big(shoes?.sale ?? 0);

  const niemYet = price;
  const khuyenMai = price.mul(new Big(100).minus(sale).div(100));

  return (
    <Stack direction={"column"} gap={4}>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/" passHref>
                    <MuiLink underline="hover" color="inherit">Home</MuiLink>
                </Link>
                <Link href="/shoes" passHref>
                    <MuiLink underline="hover" color="inherit">Giày</MuiLink>
                </Link>
                <Typography color="text.primary">{shoes?.shoesName}</Typography>
            </Breadcrumbs>
      <Stack direction={"row"} gap={2}>
        <Box>
          <Image
            width={"450px"}
            height={"400px"}
            src={`${SHOESMARK_API_DOMAIN}/${shoes?.shoesImage}`}
            alt={shoes?.shoesName}
            objectFit="cover"
          />
        </Box>
        <Stack direction={"column"}>
          <Typography variant="h4" marginBottom={"10px"}>
            {getShoes.data?.shoesName}
          </Typography>
          <Stack direction="row" spacing={1}>
            {shoes?.brand && (
              <Chip
                sx={{
                  bgcolor: stringToColor(shoes.brand?.brandName),
                  color: "white",
                }}
                label={shoes.brand?.brandName}
              />
            )}
            {shoes?.categories?.map((category) => (
              <Chip key={category.categoryId} label={category.categoryName} />
            ))}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={3}
            marginTop={"10px"}
          >
            <Typography variant="subtitle1">Size: {shoes?.size}</Typography>
            <Stack direction={"row"} gap={1}>
              <Box
                width="25px"
                height={"25px"}
                bgcolor={shoes?.color?.colorHex}
              ></Box>
              <Typography>{shoes?.color?.colorName}</Typography>
            </Stack>
          </Stack>
          <Box marginTop={"55px"}>
            {shoes?.quantity && shoes?.quantity > 0 ? (
              <>
                <Typography
                  color="GrayText"
                  sx={{
                    textDecorationLine: "line-through",
                    opacity: shoes?.sale != 0 ? 1 : 0,
                  }}
                  variant={"h5"}
                >{`${currencyFormater.format(niemYet.toNumber())}`}</Typography>
                <Typography color={"error"} fontWeight={"bold"} variant={"h4"}>
                  {currencyFormater.format(khuyenMai.toNumber())}
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  color="GrayText"
                  sx={{ textDecorationLine: "line-through", opacity: 0 }}
                >{`${currencyFormater.format(niemYet.toNumber())}`}</Typography>
                <Typography color={"error"} fontWeight={"bold"} variant={"h4"}>
                  Hết hàng
                </Typography>
              </>
            )}
          </Box>
          <Button
            variant="contained"
            sx={{ width: "250px", marginTop: "25px" }}
            endIcon={<ShoppingCartCheckoutIcon />}
          >
            Thêm vào giỏ hàng
          </Button>
        </Stack>
      </Stack>
      <Box
        bgcolor={"#ECEFF1"}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          hight: "30px",
          lineHeight: "30px",
        }}
        gap={2}
      >
        <Typography variant="h5">Thông tin chi tiết sản phẩm</Typography>
        <Typography sx={{ lineHeight: "inherit" }}>
          {shoes?.description}
        </Typography>
      </Box>
      <Stack gap={1}>
        <Typography variant="h5">Các sản phẩm liên quan</Typography>
        <Stack direction={"row"} gap={1}>
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
          <img
            width={"100%"}
            height={"120px"}
            src="https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f3b27f9624241c3a13cac0000cb69ba_9366/TOP_TEN_HI_STAR_WARS_mau_xanh_la_FZ3465_01_standard.jpg"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
