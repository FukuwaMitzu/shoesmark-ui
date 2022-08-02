import axios from "axios"
import { SHOESMARK_API_DOMAIN } from "../../config/domain"
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler"
import { JsonAction } from "../../interfaces/JsonAction"

interface DeleteManyShoesParam extends RequestWithAuth{
    ids: string[]
}

const deleteManyShoesRequest: ApiRequestHandler<DeleteManyShoesParam, JsonAction> = (data)=> axios.delete<JsonAction>(SHOESMARK_API_DOMAIN+"/shoes",{
    data:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});
export default deleteManyShoesRequest;