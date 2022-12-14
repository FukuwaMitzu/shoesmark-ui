import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";
import Stack from "@mui/material/Stack";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import createAnonymousOrderRequest, {
  CreateAnonymousOrderParam,
} from "../../../apiRequests/order/createAnonymousOrderRequest";
import createMyOrderRequest, {
  CreateMyOrderParam,
} from "../../../apiRequests/order/createMyOrderRequest";
import createAnonymousOrderDetailRequest, {
  CreateAnonymousOrderDetailParam,
} from "../../../apiRequests/order/createAnonymousOrderDetailRequest";
import createMyOrderDetailRequest, {
  CreateMyOrderDetailParam,
} from "../../../apiRequests/order/createMyOrderDetailRequest";
import { CartLocalStorge } from "../../../interfaces/CartLocalStorge";
import useLocalStorage from "@rehooks/local-storage";

interface CompleteOrderProps {}
const CompleteOrder: React.FC = (data) => {
  const session = useSession();
  const [cart, setCart] = useLocalStorage("cart", []);
  const cartStep = useStepper("CartCustomize");
  const createOrderStep = useStepper("CreateOrder");
  const paymentStep = useStepper("Payment");
  const currentStep = useStepper("Complete");
  const [loading, setLoading] = useState(true);

  const resetCartShop = () => {
    setCart([]);
  };

  //======Queries====================
  const createMyOrder = useMutation(
    (data: CreateMyOrderParam) => createMyOrderRequest(data),
    {
      onSuccess: ({ data }) => {
        if (cartStep.context?.data) {
          Promise.all(
            (cartStep.context.data as CartLocalStorge).map((cart) => {
              return createMyOrderDetail.mutateAsync({
                orderId: data.data.orderId,
                shoesId: cart.shoesId,
                quantity: cart.quantity,
                accessToken: session.data?.user?.accessToken,
              });
            })
          ).then(() => {
            setLoading(false);
            resetCartShop();
          });
        }
      },
    }
  );
  const createMyOrderDetail = useMutation(
    (data: CreateMyOrderDetailParam) => createMyOrderDetailRequest(data),
    {}
  );
  const createAnonymousOrder = useMutation(
    (data: CreateAnonymousOrderParam) => createAnonymousOrderRequest(data),
    {
      onSuccess: ({ data }) => {
        if (cartStep.context?.data) {
          Promise.all(
            (cartStep.context.data as CartLocalStorge).map((cart) => {
              return createAnonymousOrderDetail.mutateAsync({
                shoesId: cart.shoesId,
                quantity: cart.quantity,
                orderSessionToken: data.orderSessionToken,
              });
            })
          ).then(() => {
            setLoading(false);
            resetCartShop();
          });
        }
      },
    }
  );
  const createAnonymousOrderDetail = useMutation(
    (data: CreateAnonymousOrderDetailParam) =>
      createAnonymousOrderDetailRequest(data),
    {}
  );

  useEffect(() => {
    if (loading == false) {
      currentStep.changeStepStatus("complete");
    }
  }, [currentStep, loading]);

  useEffect(() => {
    if (session.status == "authenticated" && !createMyOrder.isSuccess) {
      createMyOrder.mutate({
        postCode: createOrderStep.context?.data.postCode,
        note: createOrderStep.context?.data.note,
        orderFirstName: createOrderStep.context?.data.orderFirstName,
        orderLastName: createOrderStep.context?.data.orderLastName,
        orderPhoneNumber: createOrderStep.context?.data.orderPhoneNumber,
        orderEmail: createOrderStep.context?.data.orderEmail != "" ? createOrderStep.context?.data.orderEmail: undefined,
        orderGender: createOrderStep.context?.data.orderGender,
        orderCity: createOrderStep.context?.data.orderCity,
        orderDistrict: createOrderStep.context?.data.orderDistrict,
        orderAddress: createOrderStep.context?.data.orderAddress,
        paymentMethod: paymentStep.context?.data.paymentMethod,
        onlinePaymentId: paymentStep.context?.data.onlinePaymentId,
        accessToken: session.data.user?.accessToken,
      });
    } else if (session.status == "unauthenticated" && !createAnonymousOrder.isSuccess) {
      createAnonymousOrder.mutate({
        postCode: createOrderStep.context?.data.postCode,
        note: createOrderStep.context?.data.note,
        orderFirstName: createOrderStep.context?.data.orderFirstName,
        orderLastName: createOrderStep.context?.data.orderLastName,
        orderPhoneNumber: createOrderStep.context?.data.orderPhoneNumber,
        orderEmail: createOrderStep.context?.data.orderEmail !=""? createOrderStep.context?.data.orderEmail: undefined,
        orderGender: createOrderStep.context?.data.orderGender,
        orderCity: createOrderStep.context?.data.orderCity,
        orderDistrict: createOrderStep.context?.data.orderDistrict,
        orderAddress: createOrderStep.context?.data.orderAddress,
        paymentMethod: paymentStep.context?.data.paymentMethod,
        onlinePaymentId: paymentStep.context?.data.onlinePaymentId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  //================================
  return (
    <Box paddingTop="35px">
      <Stack alignItems={"center"} gap={5}>
        {loading && <CircularProgress size={50}></CircularProgress>}
        <Typography>
          {loading
            ? "????n h??ng ??ang ???????c x??? l??. Xin h??y ?????i m???t l??c"
            : "????n h??ng c???a b???n ???? ???????c x??c nh???n. Shop s??? li??n l???c v???i b???n s???m nh???t c?? th???."}
        </Typography>
      </Stack>
    </Box>
  );
};
export default CompleteOrder;
