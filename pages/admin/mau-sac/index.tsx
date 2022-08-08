import { CustomNextPage } from "../../_app";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import { GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useCustomPagination from "../../../components/CustomPagination/hooks/useCustomPagination";
import LoadingButton from "@mui/lab/LoadingButton";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomDataGrid from "../../../views/layout/CustomDataGrid/CustomDataGrid";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import getAllColorRequest, { GetAllColorQueryKey } from "../../../api/color/getAllColorRequest";
import deleteManyColorRequest from "../../../api/color/deleteManyColorRequest";

const columns: GridColDef[] = [
    {
        field: "colorName",
        headerName: "Tên màu",
        width: 200
    },
    {
        field: "colorHex",
        headerName: "Mã màu",
        renderCell: (params: GridRenderCellParams<string>) => (
            <Box sx={{ width: 35, height: 35, backgroundColor: params.value }}></Box>
        )
    },
    {
        field: "action",
        headerName: "Chi tiết",
        sortable: false,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Stack>
                <Link href={`/admin/mau-sac/detail/${params.id}`} passHref><IconButton><LaunchOutlinedIcon></LaunchOutlinedIcon></IconButton></Link>
            </Stack>
        )
    }
]

type ColorQueryInputs = {
    colorName: string
}

const ColorPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const { handlePagination, pagination, setPagination } = useCustomPagination({ limit: 32, offset: 0, total: 0 });

    const searchForm = useForm<ColorQueryInputs>();
    //========ReactQuery============
    const getAllColorQuery = useQuery([GetAllColorQueryKey, pagination.offset, pagination.limit], ()=>getAllColorRequest({
        colorName: searchForm.getValues("colorName"),
        limit: pagination.limit,
        offset: pagination.offset
    }), {
        select: (data) => data.data,
        onSuccess: (data) => {
            setPagination({ ...pagination, total: data.total });
        }
    });
    const deleteSelectedQuery = useMutation((ids: string[]) => deleteManyColorRequest({
        ids: ids,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: (data, variables) => { 
            getAllColorQuery.refetch();
            enqueueSnackbar(`Đã xoá ${variables.length} phần tử`, {variant:"success"});
        },
        onError: (error)=>{
            enqueueSnackbar(`Xoá thất bại`, {variant:"error"});
        }
    });
    const handleCreateColor = () => {
        router.push(router.pathname + "/create");
    }
    const handleDeleteColor = (e: React.MouseEvent<HTMLButtonElement>, selectedRows: Array<GridRowId>) => {
        if (deleteSelectedQuery.isLoading) return;
        deleteSelectedQuery.mutate(selectedRows.map((row) => row.toString()));
    }
    const handleSearchForm: SubmitHandler<ColorQueryInputs> = () => {
        getAllColorQuery.refetch();
    }
    //==============================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Typography color="text.primary">Màu sắc</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Quản lý Màu sắc</Typography>
            <form onSubmit={searchForm.handleSubmit(handleSearchForm)}>
                <Stack direction={"column"} spacing={2} width={"475px"}>
                    <TextField fullWidth label="Tên màu" variant="outlined" {...searchForm.register("colorName")}></TextField>
                    <LoadingButton
                        loading={getAllColorQuery.isLoading}
                        variant="contained" type="submit"
                    >Tìm kiếm</LoadingButton>
                </Stack>
            </form>
            <Box sx={{marginTop:"55px"}}>
                <CustomDataGrid
                    columns={columns}
                    rows={getAllColorQuery.data?.data ?? []}
                    pagination={pagination}
                    error={getAllColorQuery.isError}
                    loading={getAllColorQuery.isLoading}
                    getRowId={(row)=>row.colorId}
                    onPageChange={handlePagination}
                    onCreate={handleCreateColor}
                    onDeleteConfirmed={handleDeleteColor}
                />
            </Box>
        </Box>
    )
}
ColorPage.layout = "manager";
ColorPage.auth = {
    role: ["admin", "employee"]
}
export default ColorPage;
