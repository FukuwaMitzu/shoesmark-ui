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
import getAllCategoryRequest from "../../../api/category/getAllCategoryRequest";
import deleteManyCategoryRequest from "../../../api/category/deleteManyCategoryRequest";
import dayjs from "dayjs";
const columns: GridColDef[] = [
    {
        field: "categoryName",
        headerName: "Tên thể loại",
        width: 200
    },
    {
        field: "createdAt",
        headerName: "Ngày khởi tạo",
        flex: 1,
        renderCell: (params: GridRenderCellParams<string>)=>(
            <Typography>{dayjs(params.value).format("LLL")}</Typography>
        )
    },
    {
        field: "updatedAt",
        headerName: "Cập nhật gần đây",
        flex:1,
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
                <Link href={`/admin/the-loai/detail/${params.id}`} passHref><IconButton><LaunchOutlinedIcon></LaunchOutlinedIcon></IconButton></Link>
            </Stack>
        )
    },
]
type CategoryQueryInputs = {
    categoryName: string
}
const BrandPage: CustomNextPage = ()=>{
    const session = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const { handlePagination, pagination, setPagination } = useCustomPagination({ limit: 32, offset: 0, total: 0 });

    const searchForm = useForm<CategoryQueryInputs>();
    //========ReactQuery============
    const getAllBrandQuery = useQuery(["getAllCategory", {limit:pagination.limit, offset:pagination.offset}], ()=>getAllCategoryRequest({
        categoryName: searchForm.getValues("categoryName"),
        limit: pagination.limit,
        offset: pagination.offset
    }), {
        select: (data) => data.data,
        onSuccess: (data) => {
            setPagination({ ...pagination, total: data.total });
        }
    });
    const deleteSelectedQuery = useMutation((ids: string[]) => deleteManyCategoryRequest({
        ids: ids,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: (data, variables) => { 
            getAllBrandQuery.refetch();
            enqueueSnackbar(`Đã xoá ${variables.length} phần tử`, {variant:"success"});
        },
        onError: (error)=>{
            enqueueSnackbar(`Xoá thất bại`, {variant:"error"});
        }
    });
    const handleCreateBrand = () => {
        router.push(router.pathname + "/create");
    }
    const handleDeleteBrand = (e: React.MouseEvent<HTMLButtonElement>, selectedRows: Array<GridRowId>) => {
        if (deleteSelectedQuery.isLoading) return;
        deleteSelectedQuery.mutate(selectedRows.map((row) => row.toString()));
    }
    const handleSearchForm: SubmitHandler<CategoryQueryInputs> = () => {
        getAllBrandQuery.refetch();
    }
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Typography color="text.primary">Thể loại</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Quản lý Thể loại</Typography>
            <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
                <Stack direction={"column"} spacing={2} width={"475px"}>
                    <TextField fullWidth label="Tên thể loại" variant="outlined" {...searchForm.register("categoryName")}></TextField>
                    <LoadingButton
                        loading={getAllBrandQuery.isLoading || getAllBrandQuery.isRefetching}
                        variant="contained" type="submit"
                    >Tìm kiếm</LoadingButton>
                </Stack>
            </form>
            <Box sx={{marginTop:"55px"}}>
                <CustomDataGrid
                    columns={columns}
                    rows={getAllBrandQuery.data?.data || []}
                    pagination={pagination}
                    error={getAllBrandQuery.isError}
                    loading={getAllBrandQuery.isLoading}
                    getRowId={(row)=>row.categoryId}
                    onPageChange={handlePagination}
                    onCreate={handleCreateBrand}
                    onDeleteConfirmed={handleDeleteBrand}
                />
            </Box>
        </Box>
    )   
}

BrandPage.layout="manager";
BrandPage.auth = {
    role: ["admin", "employee"]
}
export default BrandPage;