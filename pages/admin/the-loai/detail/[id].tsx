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
import FormLabel from "@mui/material/FormLabel";
import editCategoryRequest from "../../../../api/category/editCategoryRequest";
import getCategoryByIdRequest from "../../../../api/category/getCategoryByIdRequest";

type EditCateogryFormInputs = {
    categoryName: string,
    description: string
}



const DetailColorPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const [editMode, setEditMode] = useState(false);
    const editCategoryForm = useForm<EditCateogryFormInputs>({
        defaultValues:{
            categoryName:"",
            description:""
        }
    });

    //=====Queries============
    const getCategoryByIdQuery = useQuery(["getCategoryById"], () => getCategoryByIdRequest(router.query.id as string)
        , {
            select: (data) => {
                return data.data;
            },
            onSuccess: (data) => {
                editCategoryForm.setValue("categoryName", data.data.categoryName);
                editCategoryForm.setValue("description", data.data.description);
            },
            enabled: !!router.query.id
        });
    const editCategoryQuery = useMutation((data: { categoryId: string, categoryName?: string, description?: string }) => editCategoryRequest({
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        description: data.description,
        accessToken: session.data?.user?.accessToken
    }), {
        onSuccess: (data) => {
            enqueueSnackbar("Lưu thành công", { variant: "success" });
            router.back();
        },
        onError: (error: ApiRequestError) => {
            if (error.response?.data)
                enqueueSnackbar(error.response?.data.message[0], { variant: "error" });
        }
    });
    //======Effects============

    //======CallBacks===========
    const handleCategoryEditDenied = () => {
        setEditMode(false)
        if (getCategoryByIdQuery.data) {
            editCategoryForm.setValue("categoryName", getCategoryByIdQuery.data.data.categoryName);
            editCategoryForm.setValue("description", getCategoryByIdQuery.data.data.description);
        }
    }
    const handleFormSubmit: SubmitHandler<EditCateogryFormInputs> = (formData) => {
        if (getCategoryByIdQuery.data) {
            const data = extractDiff(getCategoryByIdQuery.data.data, { categoryName: formData.categoryName });
            editCategoryQuery.mutate({ ...data, categoryId: getCategoryByIdQuery.data.data.categoryId });
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
            <form onSubmit={editCategoryForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <Controller
                        name="categoryName"
                        control={editCategoryForm.control}
                        render={({ field }) => (
                            <FormControl>
                                <TextField disabled={!editMode} fullWidth label="Tên thể loại" required {...field}></TextField>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="description"
                        control={editCategoryForm.control}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel htmlFor="description">Mô tả</FormLabel>
                                <TextField
                                    id="description"
                                    disabled={!editMode}
                                    multiline
                                    maxRows={20}
                                    rows={10}
                                    {...field}
                                />
                            </FormControl>
                        )}
                    />
                        <Box>
                            {
                                !editMode ?
                                    <Button variant="contained" onClick={() => { setEditMode(true) }}>Sửa</Button>
                                    :
                                    <Stack direction={"row"} spacing={1}>
                                        <Button color="error" onClick={handleCategoryEditDenied}>Huỷ</Button>
                                        <LoadingButton loading={editCategoryQuery.isLoading} type={"submit"}>Lưu</LoadingButton>
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