import IconButton from "@mui/material/IconButton";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import Box from "@mui/material/Box";
import CartItem from "./CartItem/CartItem";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import useLocalStorage from "@rehooks/local-storage";
import { CartLocalStorge } from "../../../interfaces/CartLocalStorge";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import getAllShoesRequest, {
  GetAllShoesQueryKey,
} from "../../../api/shoes/getAllShoesRequest";
import Typography from "@mui/material/Typography";

interface CartButtonProps {}

const CartButton: React.FC<CartButtonProps> = (data) => {
  const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);
  const [cartAnchor, setCartAnchor] = useState<null | HTMLElement>(null);

  //=======Queries==========
  const getAllShoes = useQuery(
    [GetAllShoesQueryKey, cart.length],
    () =>
      getAllShoesRequest({
        ids: cart.length > 0 ? cart.map((data) => data.shoesId) : undefined,
      }),
    {
      select: ({ data }) => data.data,
      enabled: cart.length > 0,
    }
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setCartAnchor(null);
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={cart.length} color={"error"}>
          <LocalMallIcon></LocalMallIcon>
        </Badge>
      </IconButton>
      <Popover
        anchorEl={cartAnchor}
        open={Boolean(cartAnchor)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={handleClose}
      >
        <Box sx={{ width: "100%" }}>
          <Stack direction="column" divider={<Divider></Divider>}>
            {cart.length > 0 ? (
              getAllShoes?.data?.map((shoes) => (
                <CartItem
                  key={shoes.shoesId}
                  {...shoes}
                  buyQuantity={
                    cart.find((data) => data.shoesId == shoes.shoesId)
                      ?.quantity ?? 1
                  }
                ></CartItem>
              ))
            ) : (
              <Box
                width="350px"
                height="250px"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1">Giỏ hàng trống</Typography>
              </Box>
            )}
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            paddingY: 1,
          }}
        >
          <Link href={"/cart"}>
            <Button variant="text" onClick={handleClose}>
              Xem tất cả
              <ArrowRightIcon fontSize="large" />
            </Button>
          </Link>
        </Box>
      </Popover>
    </Box>
  );
};
export default CartButton;