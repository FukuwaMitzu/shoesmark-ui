import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

export interface DeleteImportOrderDetailParam extends RequestWithAuth{
    importOrderId: string;
    shoesId: string;
}

const deleteImportOrderDetailRequest: ApiRequestHandler<DeleteImportOrderDetailParam, JsonAction> = ({accessToken,...data})=> axios.delete(SHOESMARK_API_DOMAIN+`/importOrder/${data.importOrderId}/detail`,{
    data:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default deleteImportOrderDetailRequest;