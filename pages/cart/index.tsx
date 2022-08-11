import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { CustomNextPage } from "../_app";
import MuiLink from "@mui/material/Link";
import CustomStepper, { StepItem } from "../../components/CustomStepper/CustomStepper";
import CartCustomize from "../../views/clientlayout/CartCustomize/CartCustomize";
import CreateOrderForm from "../../views/clientlayout/CreateOrderForm/CreateOrderForm";
import PaymentForm from "../../views/clientlayout/PaymentForm/PaymentForm";
import CompleteOrder from "../../views/clientlayout/CompleteOrder/CompleteOrder";
import { useRouter } from "next/router";

const steps:StepItem[] = [
    {
        name: "CartCustomize",
        label: "Tuỳ chỉnh giỏ hàng",
        renderContent: ()=>(
            <CartCustomize/>
        )
    },
    {
        name: "CreateOrder",
        label: "Tạo đơn hàng",
        renderContent: ()=>(
            <CreateOrderForm/>
        )
    },
    {
        name: "Payment",
        label: "Thanh toán",
        renderContent: ()=>(
            <PaymentForm/>
        )
    },
    {
        name: "Complete",
        label: "Hoàn tất",
        renderContent: ()=>(
            <CompleteOrder/>
        )
    }
];

const CartPage: CustomNextPage = () => { 
    const router = useRouter();
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/" passHref>
                    <MuiLink underline="hover" color="inherit">Trang chủ</MuiLink>
                </Link>
                <Typography color="text.primary">Giỏ hàng</Typography>
            </Breadcrumbs>
            <Typography variant="h4" fontWeight={"bold"} textTransform={"uppercase"} color="text.primary">Giỏ hàng</Typography>
            <CustomStepper
                steps={steps}
                sticky
                onComplete={()=>{
                    router.reload();
                }}
            />
        </Box>
    )
}

export default CartPage;