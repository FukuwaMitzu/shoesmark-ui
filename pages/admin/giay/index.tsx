import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { CustomNextPage } from "../../_app";
import Typography from "@mui/material/Typography";
import CustomDataGrid from "../../../views/layout/CustomDataGrid/CustomDataGrid";
import { GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useCustomPagination from "../../../components/CustomPagination/hooks/useCustomPagination";
import getAllShoesRequest from "../../../api/shoes/getAllShoesRequest";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import { SHOESMARK_API_DOMAIN } from "../../../config/domain";
import dayjs from "dayjs";


const columns: GridColDef[] = [
    {
        field: "shoesName",
        headerName: "Tên giày",
        width: 250
    },
    {
        field: "shoesImage",
        headerName: "Ảnh giày",
        width: 100,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Image width={150} height={150} src={SHOESMARK_API_DOMAIN+"/"+params.value}></Image>
        )
    },
    {
        field: "quantity",
        headerName: "Số lượng",
        width: 100,
        align:"center"
    },
   
    {
        field: "price",
        headerName: "Đơn giá bán",
        width:150,
        renderCell: (params: GridRenderCellParams<string>) => (
            <Typography>{new Intl.NumberFormat("vi",{style:"currency", currency: "VND"}).format(parseFloat(params.value ?? ""))}</Typography>
        )
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
                <Link href={`/admin/giay/detail/${params.id}`} passHref><IconButton><LaunchOutlinedIcon></LaunchOutlinedIcon></IconButton></Link>
            </Stack>
        )
    }
]


const ShoesPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();
    
    const {handlePagination, pagination,setPagination} = useCustomPagination({limit: 32, offset:0, total:0});
    //=========Queries=========================
    const getAllShoesQuery = useQuery(["getAllShoes", pagination], ()=>getAllShoesRequest({
        limit: pagination.limit,
        offset: pagination.offset,
        shoesName: ""
    }),{
        select:(data)=>data.data,
        onSuccess: (data)=>{

        }
    });
    const handleCreateShoes = () => {
        router.push(router.pathname + "/create");
    }
    const handleDeleteShoes = (e: React.MouseEvent<HTMLButtonElement>, selectedRows: Array<GridRowId>) => {
        // if (deleteSelectedQuery.isLoading) return;
        // deleteSelectedQuery.mutate(selectedRows.map((row) => row.toString()));
    }
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Typography color="text.primary">Giày</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Quản lý Giày</Typography>
            <Box sx={{ marginTop: "55px" }}>
                <CustomDataGrid
                    columns={columns}
                    rows={getAllShoesQuery.data?.data ?? []}
                    pagination={pagination}
                    error={getAllShoesQuery.isError}
                    loading={getAllShoesQuery.isLoading}
                    getRowId={(row) => row.shoesId}
                    rowHeight={85}
                    onPageChange={handlePagination}
                    onCreate={handleCreateShoes}
                    onDeleteConfirmed={handleDeleteShoes}
                />
            </Box>
        </Box>

    )
}

ShoesPage.layout = "manager";
ShoesPage.auth = {
    role: ["admin", "employee"]
}
export default ShoesPage;