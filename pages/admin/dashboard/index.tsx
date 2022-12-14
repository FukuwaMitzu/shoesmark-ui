import { Box, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { CustomNextPage } from "../../_app";
import { Line as LineChart, Pie } from "react-chartjs-2";
import Chart, { ChartData } from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import GetGeneralStatisticRequest, {
  GeneralStatistic,
  GeneralStatisticDuration,
  GetGeneralStatisticQueryKey,
} from "../../../apiRequests/statistic/getGeneralStatisticRequest";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import currencyFormater from "../../../util/currencyFormater";
import { AxiosResponse } from "axios";
import { useState } from "react";
import stringToColor from "../../../util/stringToColor";
import { JsonEntity } from "../../../interfaces/JsonEntity";
import { dateLabels } from "../../../util/dateMapper";
Chart.register();

const DashboardPage: CustomNextPage = () => {
  const session = useSession();

  const [duration, setDuration] = useState<GeneralStatisticDuration>("weekly");

  //=======@Queries================
  const getGeneralStatistic = useQuery(
    [GetGeneralStatisticQueryKey, duration],
    () =>
      GetGeneralStatisticRequest({
        from: dayjs().toDate(),
        duration: duration,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      select: ({ data }) => data.data,
      initialData: (): AxiosResponse<JsonEntity<GeneralStatistic>> => ({
        config: {},
        headers: {},
        status: 200,
        statusText: "ok",
        data: {
          result: "entity",
          data: {
            categories: [],
            income: 0,
            renevue: 0,
            revenueProgress: { type: duration, data: [] },
            totalOrder: 0,
            totalRegisterdUser: 0,
          },
        },
      }),
    }
  );

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setDuration(newValue);
  };

  const pieData: ChartData<"pie", number[], string> = {
    labels: [
      ...getGeneralStatistic.data.categories.map(
        (category) => category.categoryName
      ),
    ],
    datasets: [
      {
        label: "Ph??n lo???i danh m???c ph??? bi???n",
        data: [
          ...getGeneralStatistic.data.categories.map(
            (category) => category.totalOrder
          ),
        ],
        backgroundColor: [
          ...getGeneralStatistic.data.categories.map((category) =>
            stringToColor(category.categoryName)
          ),
        ],
        hoverOffset: 4,
      },
    ],
  };

  const lineData: ChartData<"line", number[], string> = {
    labels: dateLabels(duration),
    datasets: [
      {
        label: "Danh thu",
        data: getGeneralStatistic.data.revenueProgress.data,
        fill: true,
        borderColor: "#008aec",
        backgroundColor: "#b8dffe",
        tension: 0.4,
      },
    ],
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Th???ng k?? t???ng quan
      </Typography>
      <Tabs value={duration} onChange={handleChange} sx={{ marginY: "15px" }}>
        <Tab label="Tu???n n??y" value={"weekly"} />
        <Tab label="Th??ng n??y" value={"monthly"} />
        <Tab label="N??m nay" value={"yearly"} />
      </Tabs>
      <Stack direction={"row"} sx={{ width: "100%" }} gap={2}>
        <Paper sx={{ flex: 1, padding: 2, bgcolor: "#2771E8", color: "white" }}>
          <Typography sx={{ marginBottom: "10px" }}>
            S??? l?????ng ????n h??ng
          </Typography>
          <Typography variant="h5" fontWeight={"bold"}>
            {getGeneralStatistic.data?.totalOrder}
          </Typography>
        </Paper>
        <Paper sx={{ flex: 1, padding: 2, bgcolor: "#00BD90", color: "white" }}>
          <Typography sx={{ marginBottom: "10px" }}>Doanh thu</Typography>
          <Typography variant="h5" fontWeight={"bold"}>
            {currencyFormater.format(getGeneralStatistic.data.renevue)}
          </Typography>
        </Paper>
        <Paper sx={{ flex: 1, padding: 2, bgcolor: "#E93E7B", color: "white" }}>
          <Typography sx={{ marginBottom: "10px" }}>L???i nhu???n</Typography>
          <Typography variant="h5" fontWeight={"bold"}>
            {currencyFormater.format(getGeneralStatistic.data.income)}
          </Typography>
        </Paper>
        <Paper sx={{ flex: 1, padding: 2, bgcolor: "#8C3EE9", color: "white" }}>
          <Typography sx={{ marginBottom: "10px" }}>
            Kh??ch h??ng th??nh vi??n
          </Typography>
          <Typography variant="h5" fontWeight={"bold"}>
            {getGeneralStatistic.data.totalRegisterdUser}
          </Typography>
        </Paper>
      </Stack>
      <Stack sx={{ marginY: "35px" }} direction="row">
        <Box sx={{ width: "750px" }}>
          <Typography
            variant="h5"
            fontWeight={"bold"}
            textTransform={"uppercase"}
            sx={{ marginBottom: "25px" }}
          >
            Doanh thu
          </Typography>
          <LineChart
            data={lineData}
            options={{
              scales: {
                y: {
                  min: 0,
                },
              },
            }}
          />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Typography
            variant="h5"
            fontWeight={"bold"}
            textTransform={"uppercase"}
            sx={{ marginBottom: "25px" }}
          >
            Th??? lo???i ph??? bi???n
          </Typography>
          <Pie data={pieData} />
        </Box>
      </Stack>
    </Box>
  );
};

DashboardPage.layout = "manager";
DashboardPage.auth = {
  role: ["admin", "employee"],
};
export default DashboardPage;
