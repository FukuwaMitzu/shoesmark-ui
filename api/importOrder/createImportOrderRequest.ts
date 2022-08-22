import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { ImportOrder } from "./importOrder";

export interface CreateImportOrderParam extends RequestWithAuth{
  note?: string;
}

const createImportOrderRequest: ApiRequestHandler<CreateImportOrderParam, JsonEntity<ImportOrder>> = ({accessToken,...data})=> axios.post(SHOESMARK_API_DOMAIN+"/importOrder", {
    ...data
}, {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default createImportOrderRequest;