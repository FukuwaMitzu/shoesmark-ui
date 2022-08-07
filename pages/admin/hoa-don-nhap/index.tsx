import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { CustomNextPage } from "../../_app";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomDataGrid from "../../../views/layout/CustomDataGrid/CustomDataGrid";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import getManyImportOrderRequest from "../../../api/importOrder/getManyImportOrderRequest";
import useCustomPagination from "../../../components/CustomPagination/hooks/useCustomPagination";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import getAllUserRequest from "../../../api/user/getAllUserRequest";
import { Autocomplete } from "@mui/material";
import { ChangeEventHandler, useEffect } from "react";
import { useRouter } from "next/router";

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0].charAt(0)}${name.split(' ')[1][0].charAt(0)}`,
    };
}

const columns: GridColDef[] = [
    {
        field: "fullName",
        headerName: "Người lập đơn",
        width: 250,
        valueGetter: (data: GridValueGetterParams) => {
            return data.row.creator.lastName + " " + data.row.creator.firstName;
        },
        renderCell: (params: GridRenderCellParams<string>) => (
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Avatar {...stringAvatar(params.value ?? "")}></Avatar>
                <Typography>{params.value}</Typography>
            </Stack>
        )
    },
    {
        field: "note",
        headerName: "Ghi chú",
        width: 100,
    },
    {
        field: "createdAt",
        headerName: "Ngày khởi tạo",
        flex: 1,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Typography>{dayjs(params.value).format("LLL")}</Typography>
        )
    },
    {
        field: "updatedAt",
        headerName: "Cập nhật gần đây",
        flex: 1,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Typography>{dayjs(params.value).fromNow()}</Typography>
        )
    },
    {
        field: "action",
        headerName: "Chi tiết",
        sortable: false,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Stack>
                <Link href={`/admin/hoa-don-nhap/detail/${params.id}`} passHref><IconButton><LaunchOutlinedIcon></LaunchOutlinedIcon></IconButton></Link>
            </Stack>
        )
    }
]

interface ImportOrderFormInputs {
    creatorIds: string[]
    searchFor: string
    fullName: string
}

const ImportOrderPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();
    const { handlePagination, pagination, setPagination } = useCustomPagination({ limit: 32, offset: 0, total: 0 });
    const { limit, offset } = pagination;
    const searchForm = useForm<ImportOrderFormInputs>({
        defaultValues: {
            creatorIds: [],
            fullName: "",
            searchFor: "others"
        }
    });
    //========Queries====================
    const getManyImportOrderQuery = useQuery(["getManyImportOrder", { limit, offset }], () => {
        let ids = [];
        if (searchForm.getValues("searchFor") == "me") ids.push(session.data?.user?.id ?? "");
        else ids = searchForm.getValues("creatorIds");
        return getManyImportOrderRequest({
            creatorIds: ids,
            limit: pagination.limit,
            offset: pagination.offset,
            accessToken: session.data?.user?.accessToken
        })
    }, {
        select: (data) => data.data
    });
    const getAllUserQuery = useQuery(["getManyUser"], () => {
        return getAllUserRequest({
            fullName: searchForm.getValues("fullName"),
            accessToken: session.data?.user?.accessToken
        });
    }, {
        enabled: searchForm.getValues("searchFor") == "others",
        select: (data) => data.data
    });
    //========Callbacks==================
    const handleSearchForm: SubmitHandler<ImportOrderFormInputs> = (data) => {
        getManyImportOrderQuery.refetch();
    }
    const handleCreateImportOrder = () => {

    }
    const handleDeleteImportOrder = () => {

    }
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getAllUserQuery.refetch();
        }, 350);
        return () => clearTimeout(delayDebounceFn)
    }, [searchForm.watch("fullName")])
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Typography color="text.primary">Đơn nhập</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Quản lý Đơn nhập</Typography>
            <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
                <Stack direction={"column"} spacing={2} width={"475px"}>
                    <Controller
                        name="searchFor"
                        control={searchForm.control}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel>Tìm kiếm đơn nhập:</FormLabel>
                                <RadioGroup
                                    defaultValue="others"
                                    name="radio-buttons-group"
                                    onChange={(data, value) => field.onChange(value)}
                                >
                                    <FormControlLabel value="me" control={<Radio />} label={"Chỉ mình tôi"} />
                                    <FormControlLabel value="others" control={<Radio />} label={"Của người khác"} />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                    {
                        searchForm.watch("searchFor") == "others" &&
                        <Controller
                            name="creatorIds"
                            control={searchForm.control}
                            render={({ field }) => (
                                <Autocomplete
                                    multiple
                                    getOptionLabel={(option: any) => `${option.lastName}  ${option.firstName}`}
                                    filterSelectedOptions
                                    filterOptions={(x, value)=>{
                                        const regex = new RegExp(`${value.inputValue}`, "i");
                                        return x.filter((y)=>{
                                            return regex.test(`${y.lastName} ${y.firstName}`);
                                        })
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
                                            )
                                            }
                                        />
                                    )}
                                    onChange={
                                        (e, data) => field.onChange(data.map((a) => a.userId))
                                    }
                                />
                            )}
                        />
                    }
                    <LoadingButton
                        loading={getManyImportOrderQuery.isLoading}
                        variant="contained" type="submit"
                    >Tìm kiếm</LoadingButton>
                </Stack>
            </form>
            <Box sx={{ marginTop: "55px" }}>
                <CustomDataGrid
                    columns={columns}
                    rows={getManyImportOrderQuery.data?.data ?? []}
                    pagination={pagination}
                    error={getManyImportOrderQuery.isError}
                    loading={getManyImportOrderQuery.isLoading}
                    getRowId={(row) => row.importOrderId}
                    onPageChange={handlePagination}
                    onCreate={handleCreateImportOrder}
                    onDeleteConfirmed={handleDeleteImportOrder}
                />
            </Box>
        </Box>
    )
}

ImportOrderPage.layout = "manager";
ImportOrderPage.auth = {
    role: ["admin", "employee"]
}
export default ImportOrderPage;