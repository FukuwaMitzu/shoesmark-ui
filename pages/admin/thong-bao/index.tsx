import { CustomNextPage } from "../../_app";

const NotificationPage: CustomNextPage = ()=>{
    return (
        <div></div>
    )   
}

NotificationPage.layout="manager";
NotificationPage.auth = {
    role: ["admin", "employee"]
}
export default NotificationPage;