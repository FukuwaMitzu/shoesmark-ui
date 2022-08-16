import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../../_app";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import useCustomPagination from "../../../components/CustomPagination/hooks/useCustomPagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import getManyOrderRequest from "../../../api/order/getManyOrderRequest";
import getAllUserRequest from "../../../api/user/getAllUserRequest";
import { useEffect } from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import stringAvatar from "../../../util/stringAvatar";
import dayjs from "dayjs";
import currencyFormater from "../../../util/currencyFormater";
import deleteManyOrderRequest from "../../../api/order/deleteManyOrderRequest";
import CustomLazyDataGrid from "../../../views/layout/CustomDataGrid/CustomLazyDataGrid";

const columns: GridColDef[] = [
  {
    field: "fullName",
    headerName: "Người lập đơn",
    width: 250,
    valueGetter: (data: GridValueGetterParams) => {
      return data.row.orderLastName + " " + data.row.orderFirstName;
    },
    renderCell: (params: GridRenderCellParams<string>) => (
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Avatar {...stringAvatar(params.value ?? "")}></Avatar>
        <Typography>{params.value}</Typography>
      </Stack>
    ),
  },
  {
    field: "paymentMethod",
    headerName: "Phương thức thanh toán",
    width: 200,
    valueGetter: (data: GridValueGetterParams) => {
      return data.row.paymentMethod == "credit_card"
        ? "Thanh toán trực tuyến"
        : "Thanh toán khi nhận hàng";
    },
  },
  {
    field: "orderPhoneNumber",
    headerName: "SĐT",
    width: 125,
  },
  {
    field: "orderEmail",
    headerName: "Email",
    width: 250,
  },
  {
    field: "quantity",
    headerName: "Số lượng mua",
    width: 150,
    valueGetter: (data: GridValueGetterParams) => {
      return data.row.details.reduce(
        (pre: number, current: any) => pre + current.quantity,
        0
      );
    },
  },
  {
    field: "totalPrice",
    headerName: "Thành tiền",
    width: 150,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography>
        {currencyFormater.format(parseFloat(params.value ?? "0"))}
      </Typography>
    ),
  },
  {
    field: "createdAt",
    headerName: "Ngày khởi tạo",
    width: 250,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography>{dayjs(params.value).format("LLL")}</Typography>
    ),
  },
  {
    field: "updatedAt",
    headerName: "Cập nhật gần đây",
    width: 250,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography>{dayjs(params.value).fromNow()}</Typography>
    ),
  },
  {
    field: "action",
    headerName: "Chi tiết",
    sortable: false,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Stack>
        <Link href={`/admin/don-hang/detail/${params.id}`} passHref>
          <IconButton>
            <LaunchOutlinedIcon></LaunchOutlinedIcon>
          </IconButton>
        </Link>
      </Stack>
    ),
  },
];

interface OrderFormInputs {
  ownerIds: string[];
  searchFor: string;
  fullName: string;
  orderFullName: string;
}

const ImportOrderPage: CustomNextPage = () => {
  const session = useSession();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { handlePagination, pagination, setPagination } = useCustomPagination({
    limit: 32,
    offset: 0,
    total: 0,
  });
  const { limit, offset } = pagination;
  const searchForm = useForm<OrderFormInputs>({
    defaultValues: {
      ownerIds: [],
      fullName: "",
      searchFor: "any",
      orderFullName: "",
    },
  });

  //========Queries====================
  const getManyOrderQuery = useQuery(
    ["getManyOrder", { limit, offset }, searchForm.getValues("searchFor")],
    () => {
      let ids: string[] = [];
      if (searchForm.getValues("searchFor") == "me")
        ids.push(session.data?.user?.id ?? "");
      else if (searchForm.getValues("searchFor") == "others")
        ids = searchForm.getValues("ownerIds");
      return getManyOrderRequest({
        ownerIds: ids.length > 0 ? ids : undefined,
        onlyAnonymous:
          searchForm.getValues("searchFor") == "anonymous" ? true : undefined,
        fullName:
          searchForm.getValues("searchFor") == "any"
            ? searchForm.getValues("orderFullName")
            : undefined,
        limit: pagination.limit,
        offset: pagination.offset,
        accessToken: session.data?.user?.accessToken,
      });
    },
    {
      select: (data) => data.data,
      onSuccess: (data) => {
        setPagination({
          ...pagination,
          total: data.total,
        });
      },
    }
  );
  const getAllUserQuery = useQuery(
    ["getManyUser"],
    () => {
      return getAllUserRequest({
        fullName: searchForm.getValues("fullName"),
        accessToken: session.data?.user?.accessToken,
      });
    },
    {
      enabled: searchForm.getValues("searchFor") == "others",
      select: (data) => data.data,
    }
  );
  const deleteManyQuery = useMutation(
    (ids: string[]) =>
      deleteManyOrderRequest({
        ids: ids,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      onSuccess: (data, variables) => {
        getManyOrderQuery.refetch();
        enqueueSnackbar(`Đã xoá ${variables.length} phần tử`, {
          variant: "success",
        });
      },
      onError: (error) => {
        enqueueSnackbar(`Xoá thất bại`, { variant: "error" });
      },
    }
  );
  //========Callbacks==================
  const handleSearchForm: SubmitHandler<OrderFormInputs> = (data) => {
    getManyOrderQuery.refetch();
  };
  const handleCreateImportOrder = () => {
    router.push(router.pathname + "/create");
  };

  const handleDeleteOrder = (
    e: React.MouseEvent<HTMLButtonElement>,
    selectedRows: Array<GridRowId>
  ) => {
    if (deleteManyQuery.isLoading) return;
    deleteManyQuery.mutate(selectedRows.map((row) => row.toString()));
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllUserQuery.refetch();
    }, 350);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchForm.watch("fullName")]);

  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/admin/dashboard" passHref>
          <MuiLink underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        </Link>
        <Typography color="text.primary">Đơn hàng</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Quản lý Đơn hàng
      </Typography>
      <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
        <Stack direction={"column"} spacing={2} width={"475px"}>
          <Controller
            name="searchFor"
            control={searchForm.control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Đối tượng tìm kiếm:</FormLabel>
                <RadioGroup
                  defaultValue="any"
                  name="radio-buttons-group"
                  onChange={(data, value) => field.onChange(value)}
                >
                  <FormControlLabel
                    value="me"
                    control={<Radio />}
                    label={"Chỉ mình tôi"}
                  />
                  <FormControlLabel
                    value="anonymous"
                    control={<Radio />}
                    label={"Không là thành viên"}
                  />
                  <FormControlLabel
                    value="others"
                    control={<Radio />}
                    label={"Của nhóm người"}
                  />
                  <FormControlLabel
                    value="any"
                    control={<Radio />}
                    label={"Bất kỳ"}
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
          {searchForm.watch("searchFor") == "others" && (
            <Controller
              name="ownerIds"
              control={searchForm.control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  getOptionLabel={(option: any) =>
                    `${option.lastName}  ${option.firstName}`
                  }
                  filterSelectedOptions
                  filterOptions={(x, value) => {
                    const regex = new RegExp(`${value.inputValue}`, "i");
                    return x.filter((y) => {
                      return regex.test(`${y.lastName} ${y.firstName}`);
                    });
                  }}
                  options={getAllUserQuery.data?.data ?? []}
                  renderInput={(params) => (
                    <Controller
                      name="fullName"
                      control={searchForm.control}
                      render={({ field }) => (
                        <TextField
                          {...params}
                          {...field}
                          label="Nhóm người dùng"
                        />
                      )}
                    />
                  )}
                  onChange={(e, data) =>
                    field.onChange(data.map((a) => a.userId))
                  }
                />
              )}
            />
          )}
          {searchForm.watch("searchFor") == "any" && (
            <Controller
              name="orderFullName"
              control={searchForm.control}
              render={({ field }) => <TextField {...field} label="Tên" />}
            />
          )}
          <LoadingButton
            loading={getManyOrderQuery.isLoading}
            variant="contained"
            type="submit"
          >
            Tìm kiếm
          </LoadingButton>
        </Stack>
      </form>
      <Box sx={{ marginTop: "55px" }}>
        <CustomLazyDataGrid
          columns={columns}
          rows={getManyOrderQuery.data?.data ?? []}
          pagination={pagination}
          error={getManyOrderQuery.isError}
          loading={getManyOrderQuery.isLoading}
          getRowId={(row) => row.orderId}
          allowAdding={false}
          onPageChange={handlePagination}
          onCreate={handleCreateImportOrder}
          onDeleteConfirmed={handleDeleteOrder}
        />
      </Box>
    </Box>
  );
};

ImportOrderPage.layout = "manager";
ImportOrderPage.auth = {
  role: ["admin", "employee"],
};
export default ImportOrderPage;
