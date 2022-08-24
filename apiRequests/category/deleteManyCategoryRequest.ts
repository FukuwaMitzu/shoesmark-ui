import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";


interface DeleteManyCategoryParam extends RequestWithAuth{
    ids: string[]
}

const deleteManyCategoryRequest: ApiRequestHandler<DeleteManyCategoryParam, JsonAction> = (data)=> axios.delete(SHOESMARK_API_DOMAIN + "/category",{
    data:{
        ids:data.ids
    },
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});
export default deleteManyCategoryRequest;