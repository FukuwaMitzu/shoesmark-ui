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
import {ChromePicker, ColorResult } from "react-color";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { ApiRequestError } from "../../../interfaces/ApiRequestError";
import createColorRequest from "../../../api/color/createColorRequest";


type CreateColorFormInputs = {
    colorName: string,
}

const CreateColorPage: CustomNextPage = () => {
    const session = useSession();
    const router = useRouter();

    const {enqueueSnackbar} = useSnackbar();

    const [color, setColor] = useState("#FF4B4B");
    const createColorForm = useForm<CreateColorFormInputs>();
    
    //=======Queries==================
    const createColorQuery = useMutation((data: {colorName: string, colorHex: string}) => createColorRequest({
        colorHex: data.colorHex,
        colorName: data.colorName,
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
    const handleColorChange = (color:ColorResult)=>{
        setColor(color.hex);
    }
    const handleFormSubmit:SubmitHandler<CreateColorFormInputs> = (data)=>{
        createColorQuery.mutate({colorHex: color, colorName: data.colorName});
    }
    //=================================
    return (
        <Box>
            <Breadcrumbs sx={{ marginBottom: "15px" }}>
                <Link href="/admin/dashboard" passHref>
                    <MuiLink underline="hover" color="inherit">Dashboard</MuiLink>
                </Link>
                <Link href="/admin/mau-sac" passHref>
                    <MuiLink underline="hover" color="inherit">Màu sắc</MuiLink>
                </Link>
                <Typography color="text.primary">Thêm Màu</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "25px" }}>Thêm Màu sắc</Typography>
            <form onSubmit={createColorForm.handleSubmit(handleFormSubmit)}>
                <Stack direction={"column"} spacing={3} width={"475px"}>
                    <FormControl>
                        <TextField fullWidth label="Tên màu" {...createColorForm.register("colorName")} required></TextField>
                    </FormControl>  
                    <Stack direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                        <ChromePicker 
                            color={color}
                            onChange={handleColorChange}
                            disableAlpha
                        ></ChromePicker>
                        <Stack sx={{flex:1}} alignItems="center" spacing={1}>
                            <Box sx={{backgroundColor: color, width: "75px", height: "75px"}}></Box>
                            <Typography fontSize={"18px"} fontWeight={"bold"}>Mã màu</Typography>
                        </Stack>
                    </Stack>
                    <LoadingButton 
                        loading={createColorQuery.isLoading}
                        variant={"contained"} type="submit"
                    >Khởi tạo</LoadingButton>
                </Stack>
            </form>
        </Box>
    )
}

CreateColorPage.layout = "manager";
CreateColorPage.auth = {
    role: ["admin", "employee"]
}
export default CreateColorPage;