import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
} from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

type AccessAction = "CREATE_ACCOUNT" | "RESET_PASSWORD" | "NONE";

interface SendOtpParam{
  email: string;
  action: AccessAction;
}

const sendOtpRequest: ApiRequestHandler<SendOtpParam, JsonAction> = (data) =>
  axios.post(
    SHOESMARK_API_DOMAIN + "/auth/otp",
    {
      ...data,
    }
  );

export default sendOtpRequest;
