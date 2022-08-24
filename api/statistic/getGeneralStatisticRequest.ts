import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";

export const GetGeneralStatisticQueryKey = "GetGeneralStatistic";

export type GeneralStatisticDuration = "yearly" | "monthly" | "weekly";

interface GetGeneralStatisticParam extends RequestWithAuth {
  from: Date;
  duration: "yearly" | "monthly" | "weekly";
}
export interface GeneralStatistic {
  renevue: number;
  income: number;
  totalOrder: number;
  totalRegisterdUser: number;
  revenueProgress: {
    type: GeneralStatisticDuration;
    data: number[];
  };
  categories: Array<{
    categoryName: string;
    totalOrder: number;
  }>;
}

const GetGeneralStatisticRequest: ApiRequestHandler<
  GetGeneralStatisticParam,
  JsonEntity<GeneralStatistic>
> = ({ accessToken, ...data }) =>
  axios.get(SHOESMARK_API_DOMAIN + "/statistic/general", {
    params: {
      ...data,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default GetGeneralStatisticRequest;
