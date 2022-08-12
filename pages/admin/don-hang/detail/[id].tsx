import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../../../_app";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import getOrderRequest, {
  GetOrderQueryKey,
} from "../../../../api/order/getOrderRequest";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import genderList from "../../../../util/genderList";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import orderStatusList from "../../../../util/orderStatusList";
import currencyFormater from "../../../../util/currencyFormater";
import { OrderDetail } from "../../../../api/order/orderDetail";

interface OrderFormInputs {
  firstName: string;
  lastName: string;
  ownerId: string;
  status: string;
  totalPrice: number;
  postCode: string;
  note?: string;
  orderFirstName: string;
  orderLastName: string;
  orderPhoneNumber: string;
  orderEmail?: string;
  orderGender: string;
  orderCity: string;
  orderDistrict: string;
  orderAddress: string;
  paymentMethod: string;
  city: any;
  district: any;
  onlinePaymentId?: string;
  datePurchased?: string;
}

const OrderDetailPage: CustomNextPage = () => {
  const router = useRouter();
  const session = useSession();

  const [editing, setEditing] = useState(false);
  
  const [temporaryDetailOrder, setTemporaryDetailOrder] = useState<OrderDetail[]>([]);

  const orderForm = useForm<OrderFormInputs>({
    defaultValues: {
      orderGender: genderList[2].value,
      orderAddress: "",
      orderFirstName: "",
      orderLastName: "",
      orderPhoneNumber: "",
      orderEmail: "",
      postCode: "",
      orderCity: "",
      orderDistrict: "",
      paymentMethod: "pay_on_receive",
      note: "",
      status: orderStatusList[0].value,
      onlinePaymentId: "",
    },
  });

  //==========Queries===========
  const getOrderQuery = useQuery(
    [GetOrderQueryKey],
    () =>
      getOrderRequest({
        orderId: router.query.id as string,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data.data,
      onSuccess: (data) => {
        orderForm.reset({
          ...data,
          ownerId: data.owner?.userId,
        });
        setTemporaryDetailOrder([...data.details]);
      },
    }
  );
  const getProvince = useQuery(
    ["getProvince"],
    () => axios.get("https://provinces.open-api.vn/api/p/"),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
    }
  );
  const getDistrict = useQuery(
    ["getDistrict", orderForm.watch("city")],
    () =>
      axios.get("https://provinces.open-api.vn/api/d/search/", {
        params: {
          q: "*",
          p: orderForm.watch("city")?.code,
        },
      }),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
      enabled: !!orderForm.watch("city"),
    }
  );
  //========Callbacks===========
  const handleSubmit: SubmitHandler<OrderFormInputs> = (data) => {};
  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Link href="/admin/don-hang" passHref>
          <MuiLink underline="hover" color="inherit">
            Đơn hàng
          </MuiLink>
        </Link>
        <Typography color="text.primary">Chi tiết đơn hàng</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Thông tin đơn hàng
      </Typography>
      <form onSubmit={orderForm.handleSubmit(handleSubmit)}>
        <Stack gap={5} direction={"row"} width="100%">
          <Box sx={{ flex: 1, maxWidth: "570px" }}>
            <Typography
              variant="h5"
              fontWeight={"bold"}
              textTransform={"uppercase"}
              sx={{ marginBottom: "25px" }}
            >
              Thông tin khách hàng
            </Typography>
            <Stack gap={2}>
              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                <Controller
                  name="orderLastName"
                  control={orderForm.control}
                  render={({ field }) => (
                    <TextField
                      disabled={!editing}
                      label="Họ"
                      required
                      fullWidth
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="orderFirstName"
                  control={orderForm.control}
                  render={({ field }) => (
                    <TextField
                      disabled={!editing}
                      label="Tên"
                      required
                      fullWidth
                      {...field}
                    />
                  )}
                />
              </Stack>
              <Controller
                name="orderGender"
                control={orderForm.control}
                render={({ field }) => (
                  <FormControl disabled={!editing}>
                    <InputLabel id="gender-select-label">Giới tính</InputLabel>
                    <Select label="Giới tính" {...field}>
                      {genderList.map((gender) => (
                        <MenuItem key={gender.id} value={gender.value}>
                          {gender.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="city"
                control={orderForm.control}
                render={({ field }) => (
                  <Autocomplete
                    disabled={!editing}
                    freeSolo
                    value={
                      orderForm.getValues("orderCity") !== ""
                        ? { name: orderForm.getValues("orderCity") }
                        : null
                    }
                    getOptionLabel={(option: any) => option.name}
                    options={getProvince.data}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Tỉnh / Thành phố"
                      />
                    )}
                    onChange={(e, value: any) => {
                      field.onChange(value);
                      orderForm.setValue("orderCity", value?.name ?? "");
                    }}
                  />
                )}
              />
              <Controller
                name="district"
                control={orderForm.control}
                render={({ field }) => (
                  <Autocomplete
                    disabled={!editing}
                    freeSolo
                    value={
                      orderForm.getValues("orderDistrict") !== ""
                        ? { name: orderForm.getValues("orderDistrict") }
                        : null
                    }
                    getOptionLabel={(option: any) => option.name}
                    options={getDistrict.data}
                    renderInput={(params) => (
                      <TextField {...params} required label="Quận / Huyện" />
                    )}
                    onChange={(e, value: any) => {
                      field.onChange(value);
                      orderForm.setValue("orderDistrict", value?.name ?? "");
                    }}
                  />
                )}
              />
              <Controller
                name="orderAddress"
                control={orderForm.control}
                render={({ field }) => (
                  <TextField
                    disabled={!editing}
                    label="Địa chỉ"
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="postCode"
                control={orderForm.control}
                render={({ field }) => (
                  <TextField
                    disabled={!editing}
                    label="Mã bưu điện"
                    fullWidth
                    required
                    {...field}
                  ></TextField>
                )}
              />
              <Controller
                name="note"
                control={orderForm.control}
                render={({ field }) => (
                  <TextField
                    disabled={!editing}
                    label="Ghi chú"
                    fullWidth
                    {...orderForm.register("note")}
                  ></TextField>
                )}
              />
            </Stack>
          </Box>
          <Stack direction={"column"} sx={{ flex: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={"bold"}
                textTransform={"uppercase"}
                sx={{ marginBottom: "25px" }}
              >
                Thông tin liên hệ
              </Typography>
              <Stack gap={2}>
                <Controller
                  name="orderPhoneNumber"
                  control={orderForm.control}
                  render={({ field }) => (
                    <TextField
                      disabled={!editing}
                      label="Số điện thoại"
                      required
                      fullWidth
                      {...field}
                    ></TextField>
                  )}
                />
                <Controller
                  name="orderEmail"
                  control={orderForm.control}
                  render={({ field }) => (
                    <TextField
                      disabled={!editing}
                      label="Email"
                      fullWidth
                      {...field}
                    ></TextField>
                  )}
                />
              </Stack>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={"bold"}
                textTransform={"uppercase"}
                sx={{ marginBottom: "25px" }}
              >
                Thông tin thanh toán
              </Typography>
              <Stack gap={2}>
                <FormControl disabled={!editing}>
                  <FormLabel>Phương thức thanh toán</FormLabel>
                  <Controller
                    name="paymentMethod"
                    control={orderForm.control}
                    render={({ field }) => (
                      <RadioGroup {...field} name="radio-buttons-group">
                        <FormControlLabel
                          value="pay_on_receive"
                          control={<Radio />}
                          label="Thanh toán khi nhận hàng"
                        />
                        <FormControlLabel
                          value="credit_card"
                          control={<Radio />}
                          label="Thanh toán trực tuyến"
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
                <Controller
                  name="onlinePaymentId"
                  control={orderForm.control}
                  render={({ field }) => (
                    <TextField
                      disabled={!editing}
                      {...field}
                      required
                      label={"Mã giao dịch"}
                    ></TextField>
                  )}
                />
                <Controller
                  name="datePurchased"
                  control={orderForm.control}
                  render={({ field }) => (
                    <DatePicker
                      disabled={!editing}
                      {...field}
                      label="Ngày thanh toán"
                      renderInput={(params) => <TextField {...params} />}
                    ></DatePicker>
                  )}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
        <Divider sx={{ marginY: "50px" }} />
        <Box>
          <Typography
            variant="h5"
            fontWeight={"bold"}
            textTransform={"uppercase"}
            sx={{ marginBottom: "25px" }}
          >
            Chi tiết đơn hàng
          </Typography>
          <Box>
            <Box sx={{marginBottom: "15px"}}>
              <Typography>Giá trị đơn hàng: {currencyFormater.format(orderForm.getValues("totalPrice"))}</Typography>
              <Typography>Tổng số sản phẩm: {getOrderQuery.data?.details.reduce((pre, current)=> current.quantity + pre, 0)}</Typography>
            </Box>
            <Controller
              name="status"
              control={orderForm.control}
              render={({ field }) => (
                <FormControl disabled={!editing} fullWidth>
                  <InputLabel>Trạng thái đơn hàng</InputLabel>
                  <Select {...field} label="Trạng thái đơn hàng">
                    {orderStatusList.map((status) => (
                      <MenuItem key={status.id} value={status.value}>
                        <Typography>{status.title}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            /> 
            <Box>
                
            </Box>       
          </Box>
        </Box>
      </form>
    </Box>
  );
};

OrderDetailPage.layout = "manager";
OrderDetailPage.auth = {
  role: ["admin", "employee"],
};
export default OrderDetailPage;
