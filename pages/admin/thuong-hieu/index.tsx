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
import getAllBrandRequest from "../../../api/brand/getAllBrandRequest";
import deleteManyBrandRequest from "../../../api/brand/deleteManyBrandRequest";
import { GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

const columns: GridColDef[] = [
    {
        field: "brandName",
        headerName: "Tên thương hiệu",
        width: 200
    },
    {
        field: "action",
        headerName: "Chi tiết",
        sortable: false,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Stack>
                <Link href={`/admin/thuong-hieu/detail/${params.id}`} passHref><IconButton><LaunchOutlinedIcon></LaunchOutlinedIcon></IconButton></Link>
            </Stack>
        )
    }
]

type BrandQueryInputs = {
    brandName: string
}

const BrandPage: CustomNextPage = ()=>{
    const session = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const { handlePagination, pagination, setPagination } = useCustomPagination({ limit: 32, offset: 0, total: 0 });

    const searchForm = useForm<BrandQueryInputs>();
    //========ReactQuery============
    const getAllBrandQuery = useQuery(["getAllBrand", pagination.offset, pagination.limit], ()=>getAllBrandRequest({
        brandName: searchForm.getValues("brandName"),
        limit: pagination.limit,
        offset: pagination.offset
    }), {
        select: (data) => data.data,
        onSuccess: (data) => {
            setPagination({ ...pagination, total: data.total });
        }
    });
    const deleteSelectedQuery = useMutation((ids: string[]) => deleteManyBrandRequest({
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
    const handleSearchForm: SubmitHandler<BrandQueryInputs> = () => {
        getAllBrandQuery.refetch();
    }
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Typography color="text.primary">Thương hiệu</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Quản lý Thương hiệu</Typography>
            <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
                <Stack direction={"column"} spacing={2} width={"475px"}>
                    <TextField fullWidth label="Tên thương hiệu" variant="outlined" {...searchForm.register("brandName")}></TextField>
                    <LoadingButton
                        loading={getAllBrandQuery.isLoading}
                        variant="contained" type="submit"
                    >Tìm kiếm</LoadingButton>
                </Stack>
            </form>
            <Box sx={{marginTop:"55px"}}>
                <CustomDataGrid
                    columns={columns}
                    rows={getAllBrandQuery.data?.data ?? []}
                    pagination={pagination}
                    error={getAllBrandQuery.isError}
                    loading={getAllBrandQuery.isLoading}
                    getRowId={(row)=>row.brandId}
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