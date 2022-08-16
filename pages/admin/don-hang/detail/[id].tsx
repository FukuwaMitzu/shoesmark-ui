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
import { useMutation, useQuery } from "@tanstack/react-query";
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
import Big from "big.js";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import OptionDial, {
  OptionDialItem,
} from "../../../../components/OptionDial/OptionDial";
import Button from "@mui/material/Button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ShoesSearchDialog from "../../../../components/ShoesSearchDialog/ShoesSearchDialog";
import { Shoes } from "../../../../api/shoes/shoes";
import extractDiff from "../../../../util/extractDiff";
import { isNotEmptyObject } from "class-validator";
import editOrderDetailRequest from "../../../../api/order/editOrderDetail";
import deleteOrderDetailRequest from "../../../../api/order/deleteOrderDetail";
import createOrderDetailRequest from "../../../../api/order/createOrderDetail";
import editOrderRequest from "../../../../api/order/editOrder";
import LazyDetailOrderItem from "../../../../components/DetailOrderItem/LazyDetailOrderItem";
import { useSnackbar } from "notistack";

type QueueTransaction = {
  order?: any;
  deleteQueue?: TemporaryOrderDetail[];
  updateQueue?: TemporaryOrderDetail[];
  addQueue?: TemporaryOrderDetail[];
};
interface OrderFormInputs {
  orderId: string;
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
interface TemporaryOrderDetail {
  orderId: string;
  shoesId: string;
  shoes: Shoes;
  quantity: number;
  price: number;
  sale: number;
}
const OrderDetailPage: CustomNextPage = () => {
  const router = useRouter();
  const session = useSession();

  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [openShoesSearchDialog, setOpenShoesSearchDialog] = useState(false);
  const [temporaryDetailOrder, setTemporaryDetailOrder] = useState<
    TemporaryOrderDetail[]
  >([]);

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
        orderForm.reset(
          {
            orderId: data.orderId,
            orderCity: data.orderCity,
            orderFirstName: data.orderFirstName,
            orderLastName: data.orderLastName,
            datePurchased: data.datePurchased,
            note: data.note,
            onlinePaymentId: data.onlinePaymentId,
            orderAddress: data.orderAddress,
            orderDistrict: data.orderDistrict,
            orderEmail: data.orderEmail ?? "",
            orderGender: data.orderGender,
            orderPhoneNumber: data.orderPhoneNumber,
            paymentMethod: data.paymentMethod,
            postCode: data.postCode,
            status: data.status,
            totalPrice: data.totalPrice,
            ownerId: data.owner?.userId,
          },
          { keepDefaultValues: true }
        );
        setTemporaryDetailOrder(
          JSON.parse(JSON.stringify(data.details)) as TemporaryOrderDetail[]
        );
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

  const updateOrderDetail = useMutation(
    (data: QueueTransaction) => {
      const updateOrder = isNotEmptyObject(data.order)
        ? [
            editOrderRequest({
              ...data.order,
              orderId: getOrderQuery.data?.orderId,
              accessToken: session.data?.user?.accessToken,
            }),
          ]
        : [];
      const deleteQueue = data.deleteQueue
        ? data.deleteQueue.map((queue) => {
            return deleteOrderDetailRequest({
              ...queue,
              accessToken: session.data?.user?.accessToken,
            });
          })
        : [];
      const updateQueue = data.updateQueue
        ? data.updateQueue.map((queue) => {
            return editOrderDetailRequest({
              ...queue,
              accessToken: session.data?.user?.accessToken,
            });
          })
        : [];
      const addQueue = data.addQueue
        ? data.addQueue.map((queue) => {
            return createOrderDetailRequest({
              ...queue,
              accessToken: session.data?.user?.accessToken,
            });
          })
        : [];
      return Promise.all([
        ...deleteQueue,
        ...addQueue,
        ...updateQueue,
        ...updateOrder,
      ]);
    },
    {
      onSuccess: () => {
        getOrderQuery.refetch();
        enqueueSnackbar("Cập nhật thành công", { variant: "success" });
      },
      onError: () => {
        getOrderQuery.refetch();
        enqueueSnackbar("Đã xảy ra lỗi", { variant: "error" });
      },
    }
  );

  //========Callbacks===========
  const handleSubmit: SubmitHandler<OrderFormInputs> = (data) => {};
  const handleChange = (shoesId: string, quantity: number) => {
    const detail = temporaryDetailOrder.find(
      (detail) => detail.shoesId == shoesId
    );
    if (detail) {
      detail.quantity = quantity;
      setTemporaryDetailOrder([...temporaryDetailOrder]);
    }
  };
  const handleDelete = (shoesId: string) => {
    const filter = temporaryDetailOrder.filter(
      (shoes) => shoes.shoesId != shoesId
    );
    setTemporaryDetailOrder(filter);
  };
  const handleOpenShoesSearchDialog = () => {
    setOpenShoesSearchDialog(true);
  };
  const handleCloseShoesSearchDialog = () => {
    setOpenShoesSearchDialog(false);
  };
  const handleAddShoes = (shoes: Shoes) => {
    const index = temporaryDetailOrder.findIndex(
      (temp) => temp.shoesId == shoes.shoesId
    );
    if (index > -1) {
      let temp = temporaryDetailOrder[index];
      temporaryDetailOrder[index] = temporaryDetailOrder[0];
      temporaryDetailOrder[0] = temp;
      temp.price = shoes.price;
      temp.sale = shoes.sale;
    } else if (index == -1) {
      temporaryDetailOrder.unshift({
        orderId: orderForm.getValues("orderId"),
        shoesId: shoes.shoesId,
        quantity: 1,
        shoes,
        price: shoes.price,
        sale: shoes.sale,
      });
      setTemporaryDetailOrder([...temporaryDetailOrder]);
    }
    handleCloseShoesSearchDialog();
  };

  const handleCompleteUpdate = () => {
    const orderDiff = extractDiff(getOrderQuery.data, orderForm.getValues());

    let details = getOrderQuery.data?.details;
    let tempDetails = temporaryDetailOrder;
    //Filter delete elements
    let flags: number[] = [];
    let deleteQueue = details?.filter((data, index) => {
      const tempIndex = tempDetails.findIndex(
        (temp) => temp.shoesId == data.shoesId
      );
      if (tempIndex == -1) {
        flags.push(index);
      }
      return tempIndex == -1;
    });
    details = details?.filter((data, index) => flags.indexOf(index) == -1);

    //Filter addition elements
    flags = [];
    const addQueue = tempDetails.filter((temp, index) => {
      const detailIndex = details?.findIndex(
        (data) => data.shoesId == temp.shoesId
      );
      if (detailIndex == -1) {
        flags.push(index);
      }
      return detailIndex == -1;
    });
    tempDetails = tempDetails.filter(
      (data, index) => flags.indexOf(index) == -1
    );

    const updateQueue = tempDetails.filter((data) => {
      const detail = details?.find((e) => e.shoesId == data.shoesId);
      if (detail) return isNotEmptyObject(extractDiff(data, detail));
      else return false;
    });

    updateOrderDetail.mutate({
      order: orderDiff,
      addQueue,
      deleteQueue,
      updateQueue,
    });
  };

  //Options dial
  const options: OptionDialItem[] = [
    {
      icon: <EditIcon></EditIcon>,
      title: "Sửa",
      enabled: !editing,
      onClick: () => {
        setEditing(true);
      },
    },
    {
      icon: <ClearOutlinedIcon></ClearOutlinedIcon>,
      title: "Huỷ",
      enabled: editing,
      onClick: () => {
        setEditing(false);
        getOrderQuery.refetch();
      },
    },
    {
      icon: <SaveIcon></SaveIcon>,
      title: "Lưu",
      enabled: editing,
      onClick: () => {
        setEditing(false);
        handleCompleteUpdate();
      },
    },
  ];
  return (
    <Box paddingBottom={"125px"}>
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
                    {...field}
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
                {orderForm.watch("paymentMethod") == "credit_card" && (
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
                )}
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
            <Box sx={{ marginBottom: "15px" }}>
              <Typography>
                Giá trị đơn hàng:{" "}
                {currencyFormater.format(
                  temporaryDetailOrder.length > 0
                    ? temporaryDetailOrder
                        .reduce((pre, current) => {
                          const price = new Big(current.price);
                          const quantity = new Big(current.quantity);
                          const sale = new Big(current.sale);
                          const khuyenMai = price
                            .mul(quantity)
                            .mul(new Big(100).minus(sale).div(100));
                          return pre.plus(khuyenMai);
                        }, new Big(0))
                        .toNumber()
                    : orderForm.getValues("totalPrice")
                )}
              </Typography>
              <Typography>
                Tổng số sản phẩm:{" "}
                {temporaryDetailOrder.reduce(
                  (pre, current) => current.quantity + pre,
                  0
                )}
              </Typography>
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
            <Box sx={{ marginY: "25px" }}>
              <Button
                sx={{ opacity: editing ? 1 : 0 }}
                variant="outlined"
                startIcon={<AddOutlinedIcon />}
                onClick={handleOpenShoesSearchDialog}
              >
                Thêm mới
              </Button>
              <ShoesSearchDialog
                open={openShoesSearchDialog}
                onClose={handleCloseShoesSearchDialog}
                onItemSelected={handleAddShoes}
              ></ShoesSearchDialog>
            </Box>
            <Stack sx={{ marginY: "25px", minHeight: "275px" }} gap={5}>
              {!getOrderQuery.isLoading &&
                temporaryDetailOrder.map((detail) => (
                  <LazyDetailOrderItem
                    key={detail.shoesId}
                    {...detail.shoes}
                    price={detail.price}
                    sale={detail.sale}
                    buyQuantity={detail.quantity}
                    disabled={!editing}
                    onChange={handleChange}
                    onDelete={handleDelete}
                  />
                ))}
            </Stack>
          </Box>
        </Box>
        <OptionDial ariaLabel="Tuỳ chọn" options={options} />
      </form>
    </Box>
  );
};

OrderDetailPage.layout = "manager";
OrderDetailPage.auth = {
  role: ["admin", "employee"],
};
export default OrderDetailPage;
