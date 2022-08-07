import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import CustomDataGrid from "../../../views/layout/CustomDataGrid/CustomDataGrid";
import { CustomNextPage } from "../../_app";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import useCustomPagination from "../../../components/CustomPagination/hooks/useCustomPagination";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import getAllUserRequest from "../../../api/user/getAllUserRequest";
import dayjs from "dayjs";
import deleteManyUserRequest from "../../../api/user/deleteManyUserRequest";
import { ApiRequestError } from "../../../interfaces/ApiRequestError";

const columns: GridColDef[] = [
    {
        field: "lastName",
        headerName: "Tên đệm",
        width: 200
    },
    {
        field: "firstName",
        headerName: "Tên",
        width: 150
    },
    {
        field: "gender",
        headerName: "Giới tính",
        width: 100
    },
    {
        field: "role",
        headerName: "Vai trò",
        width: 100
    },
    {
        field: "createdAt",
        headerName: "Ngày khởi tạo",
        width: 250,
        renderCell: (params: GridRenderCellParams<string>)=>(
            <Typography>{dayjs(params.value).format("LLL")}</Typography>
        )
    },
    {
        field: "updatedAt",
        headerName: "Cập nhật gần đây",
        width: 150,
        renderCell: (params: GridRenderCellParams<string>)=>(
            <Typography>{dayjs(params.value).fromNow()}</Typography>
        )
    },
    {
        field: "action",
        headerName: "Chi tiết",
        sortable: false,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Stack>
                <Link href={`/admin/nguoi-dung/detail/${params.id}`} passHref><IconButton><LaunchOutlinedIcon></LaunchOutlinedIcon></IconButton></Link>
            </Stack>
        )
    },
]
type UserQueryInputs = {
    fullName: string
}
const UserPage: CustomNextPage = ()=>{
    const session = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const { handlePagination, pagination, setPagination } = useCustomPagination({ limit: 32, offset: 0, total: 0 });

    const searchForm = useForm<UserQueryInputs>();
    //========ReactQuery============
    const getAllUserQuery = useQuery(["getAllUser", pagination.offset, pagination.limit], ()=>getAllUserRequest({
        fullName: searchForm.getValues("fullName"),
        accessToken: session.data?.user?.accessToken,
        limit: pagination.limit,
        offset: pagination.offset
    }), {
        select: (data) => data.data,
        onSuccess: (data) => {
            setPagination({ ...pagination, total: data.total });
        }
    });
    const deleteManyUser = useMutation((ids:string[])=>deleteManyUserRequest({
        ids: ids,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: (data, variables)=>{
            enqueueSnackbar(`Xoá thành công ${variables.length} phần tử`, {variant: "success"});
            getAllUserQuery.refetch();
        },
        onError: (error: ApiRequestError)=>{
            enqueueSnackbar(error.response?.data.message[0], {"variant":"error"});
        }
    });
    //======Callbacks=====================
    const handleCreateUser = () => {
        router.push(router.pathname + "/create");
    }
    const handleDeleteUser = (e: React.MouseEvent<HTMLButtonElement>, selectedRows: Array<GridRowId>) => {
        if (deleteManyUser.isLoading) return;
        deleteManyUser.mutate(selectedRows.map((row) => row.toString()));
    }
    const handleSearchForm: SubmitHandler<UserQueryInputs> = () => {
        getAllUserQuery.refetch();
    }
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Typography color="text.primary">Người dùng</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Quản lý Người dùng</Typography>
            <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
                <Stack direction={"column"} spacing={2} width={"475px"}>
                    <TextField fullWidth label="Tên người dùng" variant="outlined" {...searchForm.register("fullName")}></TextField>
                    <LoadingButton
                        loading={getAllUserQuery.isLoading}
                        variant="contained" type="submit"
                    >Tìm kiếm</LoadingButton>
                </Stack>
            </form>
            <Box sx={{marginTop:"55px"}}>
                <CustomDataGrid
                    columns={columns}
                    rows={getAllUserQuery.data?.data ?? []}
                    pagination={pagination}
                    error={getAllUserQuery.isError}
                    loading={getAllUserQuery.isLoading}
                    getRowId={(row)=>row.userId}
                    onPageChange={handlePagination}
                    onCreate={handleCreateUser}
                    onDeleteConfirmed={handleDeleteUser}
                />
            </Box>
        </Box>
    )   
}

UserPage.layout="manager";
UserPage.auth = {
    role: ["admin", "employee"]
}
export default UserPage;