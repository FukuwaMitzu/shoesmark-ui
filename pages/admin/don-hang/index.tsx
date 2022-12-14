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
import getManyOrderRequest from "../../../apiRequests/order/getManyOrderRequest";
import getAllUserRequest from "../../../apiRequests/user/getAllUserRequest";
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
import deleteManyOrderRequest from "../../../apiRequests/order/deleteManyOrderRequest";
import CustomLazyDataGrid from "../../../views/layout/CustomDataGrid/CustomLazyDataGrid";
import orderStatusList from "../../../util/orderStatusList";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const columns: GridColDef[] = [
  {
    field: "fullName",
    headerName: "Ng?????i l???p ????n",
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
    field: "status",
    headerName: "Tr???ng th??i ????n h??ng",
    width: 200,
    valueGetter: (data: GridValueGetterParams) => {
      const status = orderStatusList.find(
        (status) => status.value == data.value
      );
      return status?.title;
    },
  },
  {
    field: "paymentMethod",
    headerName: "Ph????ng th???c thanh to??n",
    width: 200,
    valueGetter: (data: GridValueGetterParams) => {
      return data.row.paymentMethod == "credit_card"
        ? "Thanh to??n tr???c tuy???n"
        : "Thanh to??n khi nh???n h??ng";
    },
  },
  {
    field: "orderPhoneNumber",
    headerName: "S??T",
    width: 125,
  },
  {
    field: "orderEmail",
    headerName: "Email",
    width: 250,
  },
  {
    field: "quantity",
    headerName: "S??? l?????ng mua",
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
    headerName: "Th??nh ti???n",
    width: 150,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography>
        {currencyFormater.format(parseFloat(params.value ?? "0"))}
      </Typography>
    ),
  },
  {
    field: "createdAt",
    headerName: "Ng??y kh???i t???o",
    width: 250,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography>{dayjs(params.value).format("LLL")}</Typography>
    ),
  },
  {
    field: "updatedAt",
    headerName: "C???p nh???t g???n ????y",
    width: 250,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Typography>{dayjs(params.value).fromNow()}</Typography>
    ),
  },
  {
    field: "action",
    headerName: "Chi ti???t",
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
  status: string;
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
      status: "any",
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


      let status= searchForm.getValues("status");
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
        status: status=="any"? undefined : status,
        sortBy: {
          dateUpdated: "DESC",
          dateCreated: "DESC",
        },
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
        enqueueSnackbar(`???? xo?? ${variables.length} ph???n t???`, {
          variant: "success",
        });
      },
      onError: (error) => {
        enqueueSnackbar(`Xo?? th???t b???i`, { variant: "error" });
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
        <Typography color="text.primary">????n h??ng</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Qu???n l?? ????n h??ng
      </Typography>
      <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
        <Stack direction={"row"} gap={5}>
          <Stack direction={"column"} spacing={2} width={"475px"} sx={{flexShrink:0}}>
            <Controller
              name="searchFor"
              control={searchForm.control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>?????i t?????ng t??m ki???m:</FormLabel>
                  <RadioGroup
                    defaultValue="any"
                    name="radio-buttons-group"
                    onChange={(data, value) => field.onChange(value)}
                  >
                    <FormControlLabel
                      value="me"
                      control={<Radio />}
                      label={"Ch??? m??nh t??i"}
                    />
                    <FormControlLabel
                      value="anonymous"
                      control={<Radio />}
                      label={"Kh??ng l?? th??nh vi??n"}
                    />
                    <FormControlLabel
                      value="others"
                      control={<Radio />}
                      label={"C???a nh??m ng?????i"}
                    />
                    <FormControlLabel
                      value="any"
                      control={<Radio />}
                      label={"B???t k???"}
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
                            label="Nh??m ng?????i d??ng"
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
                render={({ field }) => <TextField {...field} label="T??n" />}
              />
            )}
          </Stack>
          <Stack width={"475px"}>
          <Controller
            name="status"
            control={searchForm.control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Tr???ng th??i ????n h??ng</InputLabel>
                <Select {...field} label={"Tr???ng th??i ????n h??ng"}>
                  <MenuItem value="any">T???t c???</MenuItem>
                  {orderStatusList.map((status) => (
                    <MenuItem key={status.id} value={status.value}>
                      {status.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          </Stack>
        </Stack>
        <LoadingButton
          loading={getManyOrderQuery.isLoading}
          variant="contained"
          type="submit"
          sx={{width:"475px", marginTop: "15px"}}
        >
          T??m ki???m
        </LoadingButton>
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
