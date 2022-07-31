import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CustomNextPage } from "../../../_app";
import MuiLink from "@mui/material/Link";
import { useForm } from "react-hook-form";
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
import FormLabel from "@mui/material/FormLabel";
import editCategoryRequest from "../../../../api/category/editCategoryRequest";
import getCategoryByIdRequest from "../../../../api/category/getCategoryByIdRequest";



const DetailColorPage: CustomNextPage = ()=>{
    const session = useSession();
    const router = useRouter();

    const {enqueueSnackbar} = useSnackbar();
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");

    const [editMode, setEditMode] = useState(false); 
    
    const editBrandForm = useForm();
    
    //=====Queries============
    const getCategoryByIdQuery = useQuery(["getCategoryById"], ()=>getCategoryByIdRequest(router.query.id as string)
    ,{
        select: (data)=>{
            return data.data;
        },
        onSuccess: (data)=>{
            setDescription(data.data.description);
            setCategoryName(data.data.categoryName);
        },
        enabled: !!router.query.id
    });
    const editColorQuery = useMutation((data: {categoryId: string, categoryName?: string, description?:string})=>editCategoryRequest({
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        description: description,
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
    const handleCategoryEditDenied = ()=>{
        setEditMode(false)
        if(getCategoryByIdQuery.data){
            setCategoryName(getCategoryByIdQuery.data.data.categoryName);
            setDescription(getCategoryByIdQuery.data.data.description);
        }
    }
    const handleFormSubmit = ()=>{
        if(getCategoryByIdQuery.data){
            const data = extractDiff(getCategoryByIdQuery.data.data, {categoryName: categoryName});
            editColorQuery.mutate({...data, categoryId:getCategoryByIdQuery.data.data.categoryId});
        }
    }
    //==========================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/the-loai" passHref>
                    <MuiLink underline="hover" color="inherit">Thể loại</MuiLink>
                </Link>
                <Typography color="text.primary">Chi tiết</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thông tin Thể loại</Typography>
            <form onSubmit={editBrandForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <FormControl>
                        <TextField disabled={!editMode} fullWidth label="Tên thể loại" required value={categoryName} onChange={(e)=>{setCategoryName(e.target.value)}}></TextField>
                    </FormControl> 
                    <FormControl>
                        <FormLabel htmlFor="description">Mô tả</FormLabel>
                        <TextField
                            id="description"
                            disabled={!editMode}
                            multiline
                            maxRows={20}
                            rows={10}
                            value={description}
                            onChange={(e)=>{setDescription(e.target.value)}}
                        />
                    </FormControl> 
                    <Box>
                        {
                            !editMode?
                            <Button variant="contained" onClick={()=>{setEditMode(true)}}>Sửa</Button>
                            :
                            <Stack direction={"row"} spacing={1}>
                                <Button color="error" onClick={handleCategoryEditDenied}>Huỷ</Button>
                                <LoadingButton loading={editColorQuery.isLoading} type={"submit"}>Lưu</LoadingButton>
                            </Stack>
                        }
                    </Box>
                </Stack>
            </form>
        </Box>
    )
}

DetailColorPage.layout = "manager";
DetailColorPage.auth = {
    role: ["admin", "employee"]
}

export default DetailColorPage;