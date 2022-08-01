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
import createCategoryRequest from "../../../api/category/createCategoryRequest";
import FormLabel from "@mui/material/FormLabel";

type CreateCateogryFormInputs = {
    categoryName: string,
    description: string
}

const CreateCategoryPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const {enqueueSnackbar} = useSnackbar();

    const createBrandForm = useForm<CreateCateogryFormInputs>();
    
    //=======Queries==================
    const createColorQuery = useMutation((data: {categoryName: string, description?: string}) => createCategoryRequest({
        categoryName: data.categoryName,
        description: data.description,
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
    const handleFormSubmit:SubmitHandler<CreateCateogryFormInputs> = (data)=>{
        createColorQuery.mutate({categoryName: data.categoryName, description: data.description});
    }
    //=================================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/the-loai" passHref>
                    <MuiLink underline="hover" color="inherit">Thể loại</MuiLink>
                </Link>
                <Typography color="text.primary">Thêm Thể loại</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thêm Thể loại</Typography>
            <form onSubmit={createBrandForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <FormControl>
                        <TextField fullWidth label="Tên thể loại" {...createBrandForm.register("categoryName")} required></TextField>
                    </FormControl>  
                    <FormControl>
                        <FormLabel htmlFor="description">Mô tả</FormLabel>
                        <TextField
                            id="description"
                            multiline
                            maxRows={20}
                            rows={10}
                            {...createBrandForm.register("description")}
                        />
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

CreateCategoryPage.layout = "manager";
CreateCategoryPage.auth = {
    role: ["admin", "employee"]
}
export default CreateCategoryPage;