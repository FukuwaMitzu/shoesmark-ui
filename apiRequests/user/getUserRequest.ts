import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { User } from "./user";

export const GetUserQueryKey = "GetUserQueryKey";

interface GetUserParam extends RequestWithAuth{
    userId: string
}

const getUserRequest: ApiRequestHandler<GetUserParam, JsonEntity<User>> = ({accessToken, userId}) => axios.get(SHOESMARK_API_DOMAIN + "/user/"+userId, {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default getUserRequest;