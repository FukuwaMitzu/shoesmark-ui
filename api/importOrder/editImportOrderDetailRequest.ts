import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { ImportOrderDetail } from "./importOrderDetail";

export interface EditImportOrderDetailParam extends RequestWithAuth{
    importOrderId: string;
    shoesId: string;
    quantity: number;
}

const editImportOrderDetailRequest: ApiRequestHandler<EditImportOrderDetailParam, JsonEntity<ImportOrderDetail>> = ({accessToken,...data})=> axios.put(SHOESMARK_API_DOMAIN+`/importOrder/${data.importOrderId}/detail`, {
    ...data
},{
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default editImportOrderDetailRequest;