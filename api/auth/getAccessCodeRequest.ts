import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import { ApiRequestHandler } from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";

export const GetAccessCodeQueryKey = "GetAccessCode";

interface AccessCodeResponse {
  accessCode: string;
}

interface GetAccessCodeParam {
  code: string;
  email: string;
}

const getAccessCodeRequest: ApiRequestHandler<
  GetAccessCodeParam,
  JsonEntity<AccessCodeResponse>
> = (data) =>
  axios.get(SHOESMARK_API_DOMAIN + "/auth/accessCode", {
    params: {
      ...data,
    },
  });
export default getAccessCodeRequest;
