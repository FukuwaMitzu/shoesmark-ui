import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CustomNextPage } from "../../../_app";
import MuiLink from "@mui/material/Link";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { ChromePicker, ColorResult } from "react-color";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import getColorByIdRequest from "../../../../api/color/getColorByIdRequest";
import Button from "@mui/material/Button";
import editColorRequest from "../../../../api/color/editColorRequest";
import { ApiRequestError } from "../../../../interfaces/ApiRequestError";
import extractDiff from "../../../../util/extractDiff";



const DetailColorPage: CustomNextPage = ()=>{
    const session = useSession();
    const router = useRouter();

    const {enqueueSnackbar} = useSnackbar();
    const [colorHex, setColorHex] = useState("#FF4B4B");
    const [colorName, setColorName] = useState("");

    const [editMode, setEditMode] = useState(false); 
    const editColorForm = useForm();
    
    //=====Queries============
    const getColorByIdQuery = useQuery(["getColorById"], ()=>getColorByIdRequest(router.query.id as string)
    ,{
        select: (data)=>{
            return data.data;
        },
        onSuccess: (data)=>{
            setColorHex(data.data.colorHex);
            setColorName(data.data.colorName);
        },
        enabled: !!router.query.id
    });
    const editColorQuery = useMutation((data: {colorId: string, colorName?: string, colorHex?:string})=>editColorRequest({
        colorId: data.colorId,
        colorName: data.colorName,
        colorHex: data.colorHex,
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
    const handleColorChange = (color:ColorResult)=>{
        if(!editMode)return;
        setColorHex(color.hex);
    }
    const handleColorEditDenied = ()=>{
        setEditMode(false)
        if(getColorByIdQuery.data){
            setColorName(getColorByIdQuery.data.data.colorName);
            setColorHex(getColorByIdQuery.data.data.colorHex);
        }
    }
    const handleFormSubmit = ()=>{
        if(getColorByIdQuery.data){
            const data = extractDiff(getColorByIdQuery.data.data, {colorId: getColorByIdQuery.data.data.colorId as string, colorName: colorName, colorHex: colorHex });
            editColorQuery.mutate({...data, colorId:getColorByIdQuery.data.data.colorId});
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
                    <FormControl>
                        <TextField disabled={!editMode} fullWidth label="Tên màu" required value={colorName} onChange={(e)=>{setColorName(e.target.value)}}></TextField>
                    </FormControl>  
                    <Stack direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                        <ChromePicker 
                            color={colorHex}
                            onChange={handleColorChange}
                            disableAlpha
                        ></ChromePicker>
                        <Stack sx={{flex:1}} alignItems="center" spacing={1}>
                            <Box sx={{backgroundColor: colorHex, width: "75px", height: "75px"}}></Box>
                            <Typography fontSize={"18px"} fontWeight={"bold"}>Mã màu</Typography>
                        </Stack>
                    </Stack>
                    <Box>
                        {
                            !editMode?
                            <Button variant="contained" onClick={()=>{setEditMode(true)}}>Sửa</Button>
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