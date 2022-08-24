import axios from "axios"
import { SHOESMARK_API_DOMAIN } from "../../config/domain"
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler"
import { JsonAction } from "../../interfaces/JsonAction"

interface DeleteManyOrderParam extends RequestWithAuth{
    ids: string[]
}

const deleteManyOrderRequest: ApiRequestHandler<DeleteManyOrderParam, JsonAction> = (data)=> axios.delete<JsonAction>(SHOESMARK_API_DOMAIN+"/order",{
    data:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});
export default deleteManyOrderRequest;