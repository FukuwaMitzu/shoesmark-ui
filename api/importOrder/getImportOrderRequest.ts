import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { ImportOrder } from "./importOrder";

export const GetImportOrderQueryKey = "GetImportOrder";

interface GetImportOrderParam extends RequestWithAuth{
    importOrderId: string
}

const getImportOrderRequest: ApiRequestHandler<GetImportOrderParam, JsonEntity<ImportOrder>> = ({accessToken, importOrderId}) => axios.get(SHOESMARK_API_DOMAIN + "/importOrder/"+importOrderId, {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }  
});

export default getImportOrderRequest;