
import { CustomNextPage } from "../../_app";

const ShoesPage: CustomNextPage = ()=>{
    return (
        <div></div>
    )   
}

ShoesPage.layout="manager";
ShoesPage.auth = {
    role: ["admin", "employee"]
}
export default ShoesPage;