import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import useLocalStorage from "@rehooks/local-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import getAllShoesRequest, { GetAllShoesQueryKey } from "../../../api/shoes/getAllShoesRequest";
import CartShoesItem from "../../../components/CartShoesItem/CartShoesItem";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";
import { CartLocalStorge } from "../../../interfaces/CartLocalStorge";

const CartCustomize: React.FC = (data) => {
    const [cart, setCart] = useLocalStorage<CartLocalStorge>("cart", []);

    const currentStep = useStepper("CartCustomize");

    //=======Queries==========
    const getAllShoes = useQuery([GetAllShoesQueryKey, cart.length], () => getAllShoesRequest({
        ids: cart.length > 0 ? cart.map((data) => data.shoesId) : undefined
    }), {
        select: ({ data }) => data.data,
        enabled: cart.length > 0,
        onSuccess: (data) => {
            currentStep.update(cart);
        }
    });

    useEffect(()=>{
        if(cart.length==0)currentStep.changeStepStatus("invalid");
        else if (currentStep.context?.status=="invalid") currentStep.changeStepStatus("valid");
    }, [cart.length]);
    
    return (
        <>
            {
                cart.length == 0 ?
                <Box>
                    <Typography>Giỏ hàng trống</Typography>
                </Box>
                :
                <Stack gap={3} divider={<Divider />}>
                    {
                        getAllShoes.data?.map((shoes) => (
                            <CartShoesItem key={shoes.shoesId} {...shoes} buyQuantity={cart.find((data) => data.shoesId == shoes.shoesId)?.quantity ?? 1}></CartShoesItem>
                        ))
                    }
                </Stack>
            }
        </>
    )
}
export default CartCustomize;