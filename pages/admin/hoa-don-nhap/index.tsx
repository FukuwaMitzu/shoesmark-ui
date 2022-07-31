import { CustomNextPage } from "../../_app";

const OrderPage: CustomNextPage = ()=>{
    return (
        <div></div>
    )   
}

OrderPage.layout="manager";
OrderPage.auth = {
    role: ["admin", "employee"]
}
export default OrderPage;