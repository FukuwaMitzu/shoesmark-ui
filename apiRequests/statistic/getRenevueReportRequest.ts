import axios from "axios";
import { SHOESMARK_API_DOMAIN } from "../../config/domain";
import {
  ApiRequestHandler,
  RequestWithAuth,
} from "../../interfaces/ApiRequestHandler";
import { JsonEntity } from "../../interfaces/JsonEntity";

export const GetRenevueReportQueryKey = "GetGeneralStatistic";

// export type GeneralStatisticDuration = "yearly" | "monthly" | "weekly";

interface GetRenevueReportParam extends RequestWithAuth {
  date: string;
  //   duration: "yearly" | "monthly" | "weekly";
}
type SubReport = {
  renevue: number;
  income: number;
  totalOrder: number;
}
export interface RenevueReport {
  successOrderReport: SubReport,
  canceledOrderReport: SubReport
}

const GetRenevueReportRequest: ApiRequestHandler<
  GetRenevueReportParam,
  JsonEntity<RenevueReport>
> = ({ accessToken, ...data }) =>
  axios.get(SHOESMARK_API_DOMAIN + "/statistic/report/renevue", {
    params: {
      ...data,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default GetRenevueReportRequest;
