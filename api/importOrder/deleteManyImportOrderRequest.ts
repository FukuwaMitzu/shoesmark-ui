import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";


interface DeleteManyImportOrderParam extends RequestWithAuth{
    ids: string[]
}

const deleteManyImportOrderRequest: ApiRequestHandler<DeleteManyImportOrderParam, JsonAction> = ({accessToken, ...data})=> axios.delete(SHOESMARK_API_DOMAIN + "/importOrder",{
    data:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});
export default deleteManyImportOrderRequest;