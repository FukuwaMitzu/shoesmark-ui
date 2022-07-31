import axios from "axios"
import { SHOESMARK_API_DOMAIN } from "../../config/domain"
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler"
import { JsonAction } from "../../interfaces/JsonAction"

interface DeleteManyColorParam extends RequestWithAuth{
    ids: string[]
}

const deleteManyColorRequest: ApiRequestHandler<DeleteManyColorParam, JsonAction> = (data)=> axios.delete<JsonAction>(SHOESMARK_API_DOMAIN+"/color",{
    data:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${data.accessToken}`
    }
});
export default deleteManyColorRequest;