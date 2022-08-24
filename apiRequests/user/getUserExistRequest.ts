import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler } from "../../interfaces/ApiRequestHandler";
import { JsonAction } from "../../interfaces/JsonAction";

interface GetAllUserParam {
  email?: string;
  username?: string;
}

const getUserExistRequest: ApiRequestHandler<GetAllUserParam, JsonAction> = ({
  ...data
}) =>
  axios.get(SHOESMARK_API_DOMAIN + "/user/exist", {
    params: {
      ...data,
    },
    // headers: {
    //     "Authorization": `Bearer ${accessToken}`
    // }
  });

export default getUserExistRequest;
