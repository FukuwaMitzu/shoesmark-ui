import Box from "@mui/material/Box";
import { CustomNextPage } from "../../../_app"

const OrderDetailPage: CustomNextPage = ()=>{
    return (
        <Box></Box>
    )
}

OrderDetailPage.layout = "manager";
OrderDetailPage.auth={
    role: ["admin", "employee"]
};
export default OrderDetailPage;