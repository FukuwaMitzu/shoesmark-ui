import { CustomNextPage } from "../../_app";

const DashboardPage: CustomNextPage = ()=>{
    return (
        <div></div>
    )
}

DashboardPage.layout = "manager";
DashboardPage.auth = {
    role: ["admin", "employee"]
}
export default DashboardPage;