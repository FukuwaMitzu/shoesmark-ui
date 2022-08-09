import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { User } from "./user";

export const GetMeQueryKey = "GetMeQueryKey";

interface GetMeParam extends RequestWithAuth{
}

const getMeRequest: ApiRequestHandler<GetMeParam, JsonEntity<User>> = ({accessToken, ...data}) => axios.get(SHOESMARK_API_DOMAIN + "/user/me", {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default getMeRequest;