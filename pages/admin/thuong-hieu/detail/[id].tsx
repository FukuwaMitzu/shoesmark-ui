import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CustomNextPage } from "../../../_app";
import MuiLink from "@mui/material/Link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import { ApiRequestError } from "../../../../interfaces/ApiRequestError";
import extractDiff from "../../../../util/extractDiff";
import getBrandRequest from "../../../../api/brand/getBrandRequest";
import editBrandRequest from "../../../../api/brand/editBrandRequest";

type EditBrandFormInputs = {
    brandName: string,
}


const DetailBrandPage: CustomNextPage = ()=>{
    const session = useSession();
    const router = useRouter();

    const {enqueueSnackbar} = useSnackbar();

    const [editMode, setEditMode] = useState(false); 
    const editBrandForm = useForm<EditBrandFormInputs>({
        defaultValues:{
            brandName:""
        }
    });
    
    //=====Queries============
    const getBrandQuery = useQuery(["getBrandById"], ()=>getBrandRequest(router.query.id as string)
    ,{
        select: (data)=>{
            return data.data;
        },
        onSuccess: ({data})=>{
            editBrandForm.reset(data);
        },
        enabled: !!router.query.id
    });
    const editColorQuery = useMutation((data: {brandId: string, brandName?: string, description?:string})=>editBrandRequest({
        brandId: data.brandId,
        brandName: data.brandName,
        accessToken: session.data?.user?.accessToken
    }),{
        onSuccess:(data)=>{
            enqueueSnackbar("Lưu thành công", {variant:"success"});
            router.back();
        },
        onError: (error: ApiRequestError)=>{
            if(error.response?.data)
            enqueueSnackbar(error.response?.data.message[0], {variant:"error"});
        }
    });
    //======Effects============

    //======CallBacks===========
    const handleBrandEditDenied = ()=>{
        setEditMode(false)
        if(getBrandQuery.data){
            editBrandForm.reset();
        }
    }
    const handleFormSubmit:SubmitHandler<EditBrandFormInputs> = (formData)=>{
        if(getBrandQuery.data){
            const data = extractDiff(getBrandQuery.data.data, {brandName: formData.brandName});
            editColorQuery.mutate({...data, brandId:getBrandQuery.data.data.brandId});
        }
    }
    //==========================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/thuong-hieu" passHref>
                    <MuiLink underline="hover" color="inherit">Thương hiệu</MuiLink>
                </Link>
                <Typography color="text.primary">Chi tiết</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thông tin Thương hiệu</Typography>
            <form onSubmit={editBrandForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <Controller
                        name="brandName"
                        control={editBrandForm.control}
                        render={({field})=>(
                            <FormControl>
                                <TextField disabled={!editMode} fullWidth label="Tên thương hiệu" required {...field}></TextField>
                            </FormControl>  
                        )}
                    />
                    <Box>
                        {
                            !editMode?
                            <Button variant="contained" onClick={()=>{setEditMode(true)}}>Sửa</Button>
                            :
                            <Stack direction={"row"} spacing={1}>
                                <Button color="error" onClick={handleBrandEditDenied}>Huỷ</Button>
                                <LoadingButton loading={editColorQuery.isLoading} type={"submit"}>Lưu</LoadingButton>
                            </Stack>
                        }
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}

DetailBrandPage.layout = "manager";
DetailBrandPage.auth = {
    role: ["admin", "employee"]
}

export default DetailBrandPage;