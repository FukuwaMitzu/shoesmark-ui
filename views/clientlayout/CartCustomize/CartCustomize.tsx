import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import useLocalStorage from "@rehooks/local-storage";
import { useQuery } from "@tanstack/react-query";
import Big from "big.js";
import { useEffect } from "react";
import getAllShoesRequest, {
  GetAllShoesQueryKey,
} from "../../../api/shoes/getAllShoesRequest";
import CartShoesItem from "../../../components/CartShoesItem/CartShoesItem";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";
import { CartLocalStorge } from "../../../interfaces/CartLocalStorge";
import currencyFormater from "../../../util/currencyFormater";

const CartCustomize: React.FC = (data) => {
  const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);

  const currentStep = useStepper("CartCustomize");

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
      onSuccess: (data) => {
        currentStep.updateData(cart);
      },
    }
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      if (cart.length == 0) currentStep.changeStepStatus("invalid");
      else if (currentStep.context?.status == "invalid")
        currentStep.changeStepStatus("valid");
    }, 150);
    return () => clearTimeout(delay);
  }, [cart.length]);

  return (
    <>
      {cart.length == 0 ? (
        <Box>
          <Typography textAlign={"center"}>Giỏ hàng trống</Typography>
        </Box>
      ) : (
        <Box>
          <Box sx={{ marginBottom: "35px" }}>
            <Typography variant={"h6"}>
              Giá trị đơn hàng:{" "}
              <Typography color={"error"} component={"span"} variant={"h6"}>
                {currencyFormater.format(
                  getAllShoes.data
                    ? getAllShoes.data
                        .reduce((pre, current) => {
                          const buyQuantity =
                            cart.find((data) => data.shoesId == current.shoesId)
                              ?.quantity ?? 1;
                          const price = new Big(current.price);
                          const quantity = new Big(buyQuantity);
                          const sale = new Big(current.sale);
                          const khuyenMai = price
                            .mul(quantity)
                            .mul(new Big(100).minus(sale).div(100));
                          return pre.plus(khuyenMai);
                        }, new Big(0))
                        .toNumber()
                    : 0
                )}
              </Typography>
            </Typography>
            <Typography>
              Tổng số sản phẩm:{" "}
              {getAllShoes.data?.reduce((pre, current) => {
                const buyQuantity =
                  cart.find((data) => data.shoesId == current.shoesId)
                    ?.quantity ?? 1;
                return buyQuantity + pre;
              }, 0)}
            </Typography>
          </Box>
          <Stack gap={3} divider={<Divider />}>
            {getAllShoes.data?.map((shoes) => (
              <CartShoesItem
                key={shoes.shoesId}
                {...shoes}
                buyQuantity={
                  cart.find((data) => data.shoesId == shoes.shoesId)
                    ?.quantity ?? 1
                }
              ></CartShoesItem>
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};
export default CartCustomize;
