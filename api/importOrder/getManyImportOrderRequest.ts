import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth, RequestWithPagination } from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { ImportOrder } from "./importOrder";

interface GetManyImportOrderParam extends RequestWithPagination, RequestWithAuth{
    creatorIds?: string[]
}

const getManyImportOrderRequest: ApiRequestHandler<GetManyImportOrderParam, JsonCollection<ImportOrder>> = (data) => axios.get(SHOESMARK_API_DOMAIN + "/importOrder", {
    params:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }  
});

export default getManyImportOrderRequest;