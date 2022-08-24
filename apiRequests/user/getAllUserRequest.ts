import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth, RequestWithPagination } from "../../interfaces/ApiRequestHandler";
import { JsonCollection } from "../../interfaces/JsonCollection";
import { User } from "./user";

interface GetAllUserParam extends RequestWithPagination, RequestWithAuth{
    ids?: string[]
    fullName?: string
}

const getAllUserRequest: ApiRequestHandler<GetAllUserParam, JsonCollection<User>> = ({accessToken, ...data}) => axios.get(SHOESMARK_API_DOMAIN + "/user", {
    params:{
        ...data
    },
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default getAllUserRequest;