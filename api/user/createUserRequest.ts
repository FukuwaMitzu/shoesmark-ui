import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler, RequestWithAuth } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { User } from "./user";

export interface CreateUserParam extends RequestWithAuth{
    username: string;
    password: string;
    email: string;
    isActive: boolean;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    city: string;
    district: string;
    address: string;
}

const createUserRequest: ApiRequestHandler<CreateUserParam, JsonEntity<User>> = ({accessToken, ...data})=> axios.post(SHOESMARK_API_DOMAIN+"/user", {
    ...data
}, {
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default createUserRequest;