import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { User } from "./user";

export interface EditUserParam extends RequestWithAuth {
  userId: string;
  username?: string;
  password?: string;
  email?: string;
  isActive?: boolean;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  district?: string;
  address?: string;
}

const editUserRequest: ApiRequestHandler<EditUserParam, JsonEntity<User>> = ({
  accessToken,
  userId,
  ...data
}) =>
  axios.put(
    SHOESMARK_API_DOMAIN + "/user/" + userId,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export default editUserRequest;
