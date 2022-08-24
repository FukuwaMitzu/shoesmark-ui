import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAccessCode,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";
import { User } from "../user/user";

export interface SignUpParam extends RequestWithAccessCode {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  city: string;
  district: string;
  userCity: any;
  userDistrict: any;
  address: string;
}

const signUpRequest: ApiRequestHandler<SignUpParam, JsonEntity<User>> = ({
  accessCode,
  ...data
}) =>
  axios.post(
    SHOESMARK_API_DOMAIN + "/auth/signUp",
    {
      ...data,
    },
    {
      headers: {
        "access-code": `${accessCode}`,
      },
    }
  );

export default signUpRequest;
