import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { CustomNextPage } from "../_app";
import MuiLink from "@mui/material/Link";
import LazyPaymentForm from "../../views/clientlayout/PaymentForm/LazyPaymentForm";
import { useRouter } from "next/router";
import LazyCustomStepper from "../../components/CustomStepper/LazyCustomStepper";
import { StepItem } from "../../components/CustomStepper/CustomStepper";
import LazyCartCustomize from "../../views/clientlayout/CartCustomize/LazyCartCustomize";
import LazyCompleteOrder from "../../views/clientlayout/CompleteOrder/LazyCompleteOrder";
import LazyCreateOrderForm from "../../views/clientlayout/CreateOrderForm/LazyCreateOrderForm";

const steps:StepItem[] = [
    {
        name: "CartCustomize",
        label: "Tuỳ chỉnh giỏ hàng",
        renderContent: ()=>(
            <LazyCartCustomize/>
        )
    },
    {
        name: "CreateOrder",
        label: "Tạo đơn hàng",
        renderContent: ()=>(
            <LazyCreateOrderForm/>
        )
    },
    {
        name: "Payment",
        label: "Thanh toán",
        renderContent: ()=>(
            <LazyPaymentForm/>
        )
    },
    {
        name: "Complete",
        label: "Hoàn tất",
        renderContent: ()=>(
            <LazyCompleteOrder/>
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
            <LazyCustomStepper
                steps={steps}
                sticky
                onComplete={()=>{
                    router.reload();
                }}
            />
        </Box>
    )
}
CartPage.layout="customer"
export default CartPage;