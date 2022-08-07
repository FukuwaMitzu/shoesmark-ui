import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";


interface DeleteManyUserParam extends RequestWithAuth{
    ids: string[]
}

const deleteManyUserRequest: ApiRequestHandler<DeleteManyUserParam, JsonAction> = ({accessToken, ...data})=> axios.delete(SHOESMARK_API_DOMAIN + "/user",{
    data:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});
export default deleteManyUserRequest;