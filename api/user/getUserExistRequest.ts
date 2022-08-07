import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

interface GetAllUserParam extends RequestWithAuth{
    email?: string
    username?: string
}

const getUserExistRequest: ApiRequestHandler<GetAllUserParam, JsonAction> = ({accessToken,...data}) => axios.get(SHOESMARK_API_DOMAIN + "/user/exist", {
    params:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default getUserExistRequest;