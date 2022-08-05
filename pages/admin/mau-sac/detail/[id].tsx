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
import { ChromePicker } from "react-color";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import getColorRequest from "../../../../api/color/getColorRequest";
import Button from "@mui/material/Button";
import editColorRequest from "../../../../api/color/editColorRequest";
import { ApiRequestError } from "../../../../interfaces/ApiRequestError";
import extractDiff from "../../../../util/extractDiff";

type EditColorFormInputs = {
    colorName: string,
    colorHex: string
}


const DetailColorPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const [editMode, setEditMode] = useState(false);
    const editColorForm = useForm<EditColorFormInputs>({
        defaultValues: {
            colorName: "",
            colorHex: ""
        }
    });


    //=====Queries============
    const getColorQuery = useQuery(["getColorById"], () => getColorRequest(router.query.id as string)
        , {
            select: (data) => {
                return data.data;
            },
            onSuccess: ({data}) => {
                editColorForm.reset(data);
            },
            enabled: !!router.query.id
        });
    const editColorQuery = useMutation((data: { colorId: string, colorName?: string, colorHex?: string }) => editColorRequest({
        colorId: data.colorId,
        colorName: data.colorName,
        colorHex: data.colorHex,
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
    const handleColorEditDenied = () => {
        setEditMode(false)
        if (getColorQuery.data) {
            editColorForm.reset();
        }
    }
    const handleFormSubmit: SubmitHandler<EditColorFormInputs> = (formData) => {
        if (getColorQuery.data) {
            const data = extractDiff(getColorQuery.data.data, { colorId: getColorQuery.data.data.colorId as string, colorName: formData.colorName, colorHex: formData.colorHex });
            editColorQuery.mutate({ ...data, colorId: getColorQuery.data.data.colorId });
        }
    }
    //==========================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/mau-sac" passHref>
                    <MuiLink underline="hover" color="inherit">Màu sắc</MuiLink>
                </Link>
                <Typography color="text.primary">Chi tiết</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thông tin Màu sắc</Typography>
            <form onSubmit={editColorForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <Controller
                        name="colorName"
                        control={editColorForm.control}
                        render={
                            ({ field }) =>
                                <FormControl>
                                    <TextField disabled={!editMode} fullWidth label="Tên màu" required {...field}></TextField>
                                </FormControl>
                        }
                    />
                    <Controller
                        name="colorHex"
                        control={editColorForm.control}
                        render={({ field }) =>
                        (
                            <Stack direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                                <ChromePicker
                                    color={field.value}
                                    onChange={(e) => { if (!editMode) return; field.onChange(e.hex); }}
                                    disableAlpha
                                ></ChromePicker>
                                <Stack sx={{ flex: 1 }} alignItems="center" spacing={1}>
                                    <Box sx={{ backgroundColor: field.value, width: "75px", height: "75px" }}></Box>
                                    <Typography fontSize={"18px"} fontWeight={"bold"}>Mã màu</Typography>
                                </Stack>
                            </Stack>
                        )
                        }
                    />
                    <Box>
                        {
                            !editMode ?
                                <Button variant="contained" onClick={() => { setEditMode(true) }}>Sửa</Button>
                                :
                                <Stack direction={"row"} spacing={1}>
                                    <Button color="error" onClick={handleColorEditDenied}>Huỷ</Button>
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