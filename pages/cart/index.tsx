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

const steps:StepItem[] = [
    {
        name: "CartCustomize",
        label: "Tuỳ chỉnh giỏ hàng",
        renderContent: ()=>(
            <CartCustomize></CartCustomize>
        )
    },
    {
        name: "CreateOrder",
        label: "Tạo đơn hàng",
        renderContent: ()=>(
            <CreateOrderForm></CreateOrderForm>
        )
    },
    {
        name: "Payment",
        label: "Thanh toán",
        renderContent: ()=>(
            <PaymentForm></PaymentForm>
        )
    },
    {
        name: "Complete",
        label: "Hoàn tất",
        renderContent: ()=>(
            <Box>Hi again</Box>
        )
    }
];

const CartPage: CustomNextPage = () => { 
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
            />
        </Box>
    )
}

export default CartPage;