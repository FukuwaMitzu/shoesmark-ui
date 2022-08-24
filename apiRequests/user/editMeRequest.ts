import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { User } from "./user";

export interface EditMeParam extends RequestWithAuth {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  district?: string;
  address?: string;
}

const editMeRequest: ApiRequestHandler<EditMeParam, JsonEntity<User>> = ({
  accessToken,
  ...data
}) =>
  axios.put(
    SHOESMARK_API_DOMAIN + "/user/me",
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

export default editMeRequest;
