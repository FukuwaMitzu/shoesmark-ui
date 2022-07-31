import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { CustomNextPage } from "../../_app";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { ApiRequestError } from "../../../interfaces/ApiRequestError";
import createBrandRequest from "../../../api/brand/createBrandRequest";

type CreateBrandFormInputs = {
    brandName: string,
}

const CreateBrandPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const {enqueueSnackbar} = useSnackbar();

    const createBrandForm = useForm<CreateBrandFormInputs>();
    
    //=======Queries==================
    const createColorQuery = useMutation((data: {brandName: string}) => createBrandRequest({
        brandName: data.brandName,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: ()=>{
            enqueueSnackbar("Thêm thành công", {variant:"success"});
            router.back();
        },
        onError: (error:ApiRequestError)=>{
            if(error.response!==undefined){
                const response = error.response.data;
                enqueueSnackbar(response.message[0], {variant:"error"});
            }
        }
    });

    //========Callbacks===============
    const handleFormSubmit:SubmitHandler<CreateBrandFormInputs> = (data)=>{
        createColorQuery.mutate({brandName: data.brandName});
    }
    //=================================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/thuong-hieu" passHref>
                    <MuiLink underline="hover" color="inherit">Thương hiệu</MuiLink>
                </Link>
                <Typography color="text.primary">Thêm Thương hiệu</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thêm Thương hiệu</Typography>
            <form onSubmit={createBrandForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <FormControl>
                        <TextField fullWidth label="Tên thương hiệu" {...createBrandForm.register("brandName")} required></TextField>
                    </FormControl>  
                    <LoadingButton 
                        loading={createColorQuery.isLoading}
                        variant={"contained"} type="submit"
                    >Khởi tạo</LoadingButton>
                </Stack>
            </form>
        </Box>
    )
}

CreateBrandPage.layout = "manager";
CreateBrandPage.auth = {
    role: ["admin", "employee"]
}
export default CreateBrandPage;