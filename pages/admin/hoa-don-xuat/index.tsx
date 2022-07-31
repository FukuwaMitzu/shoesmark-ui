import { CustomNextPage } from "../../_app";

const ImportOrderPage: CustomNextPage = ()=>{
    return (
        <div></div>
    )   
}

ImportOrderPage.layout="manager";
ImportOrderPage.auth = {
    role: ["admin", "employee"]
}
export default ImportOrderPage;