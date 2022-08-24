import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import GetRenevueReportRequest, {
  GetRenevueReportQueryKey,
} from "../../../api/statistic/getRenevueReportRequest";
import currencyFormater from "../../../util/currencyFormater";
import { CustomNextPage } from "../../_app";

interface RenevueReportSearchFormInputs {
  date: string;
}

const RenevuePage: CustomNextPage = (data) => {
  const session = useSession();

  const searchForm = useForm<RenevueReportSearchFormInputs>({
    defaultValues: {
      date: dayjs().toISOString(),
    },
  });
  //======Queries=========
  const getRenevueReport = useQuery(
    [GetRenevueReportQueryKey, searchForm.watch("date")],
    () =>
      GetRenevueReportRequest({
        date: searchForm.getValues("date"),
        accessToken: session.data?.user?.accessToken,
      }),
    {
      select: ({ data }) => data.data,
    }
  );

  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Typography color="text.primary">Báo cáo doanh thu</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "45px",
        }}
      >
        Báo cáo doanh thu
      </Typography>
      <Box marginBottom={"35px"}>
        <Controller
          name="date"
          control={searchForm.control}
          render={({ field }) => (
            <DatePicker
              views={["month", "year"]}
              label="Thời gian"
              minDate={dayjs("2012")}
              maxDate={dayjs("2025")}
              value={field.value}
              onChange={(e) => {
                field.onChange(e?.toISOString());
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          )}
        />
      </Box>
      <Box marginBottom={"75px"}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginBottom: "25px",
          }}
        >
          Đơn hàng thành công
        </Typography>
        <Stack direction={"row"} sx={{ width: "750px" }} gap={2}>
          <Paper
            sx={{ flex: 1, padding: 2, bgcolor: "#2771E8", color: "white" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>
              Số lượng đơn hàng
            </Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {getRenevueReport.data?.successOrderReport.totalOrder}
            </Typography>
          </Paper>
          <Paper
            sx={{ flex: 1, padding: 2, bgcolor: "#00BD90", color: "white" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>Doanh thu</Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {currencyFormater.format(
                getRenevueReport.data?.successOrderReport.renevue ?? 0
              )}
            </Typography>
          </Paper>
          <Paper
            sx={{ flex: 1, padding: 2, bgcolor: "#E93E7B", color: "white" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>Lợi nhuận</Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {currencyFormater.format(
                getRenevueReport.data?.successOrderReport.income ?? 0
              )}
            </Typography>
          </Paper>
        </Stack>
      </Box>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            marginBottom: "25px",
          }}
        >
          Đơn hàng Thất bại
        </Typography>
        <Stack direction={"row"} sx={{ width: "750px" }} gap={2}>
          <Paper
            sx={{ flex: 1, padding: 2, bgcolor: "#2771E8", color: "white" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>
              Số lượng đơn hàng
            </Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {getRenevueReport.data?.canceledOrderReport.totalOrder}
            </Typography>
          </Paper>
          <Paper
            sx={{ flex: 1, padding: 2, bgcolor: "#00BD90", color: "white" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>Doanh thu</Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {currencyFormater.format(
                getRenevueReport.data?.canceledOrderReport.renevue ?? 0
              )}
            </Typography>
          </Paper>
          <Paper
            sx={{ flex: 1, padding: 2, bgcolor: "#E93E7B", color: "white" }}
          >
            <Typography sx={{ marginBottom: "10px" }}>Lợi nhuận</Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {currencyFormater.format(
                getRenevueReport.data?.canceledOrderReport.income ?? 0
              )}
            </Typography>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};
RenevuePage.auth = {
  role: ["admin", "employee"],
};
RenevuePage.layout = "manager";
export default RenevuePage;
