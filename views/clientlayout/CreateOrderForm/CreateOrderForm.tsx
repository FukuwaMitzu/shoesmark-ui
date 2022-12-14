import TextField from "@mui/material/TextField";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import genderList from "../../../util/genderList";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import getMeRequest, { GetMeQueryKey } from "../../../apiRequests/user/getMeRequest";
import { useEffect } from "react";
import { isDefined, isNotEmpty } from "class-validator";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";

interface CreateOrderFormInputs {
    postCode: string;
    note?: string;
    orderFirstName: string;
    orderLastName: string;
    orderPhoneNumber: string;
    orderEmail?: string;
    orderGender: string;
    city: any;
    district: any;
    orderCity: string;
    orderDistrict: string;
    orderAddress: string;
}
const CreateOrderForm: React.FC = (data) => {
    const session = useSession();
    const currentStep = useStepper("CreateOrder");
    const createForm = useForm<CreateOrderFormInputs>({
        defaultValues: {
            orderGender: currentStep.context?.data?.orderGender ?? genderList[2].value,
            orderAddress: currentStep.context?.data?.orderAddress ?? "",
            orderFirstName: currentStep.context?.data?.orderFirstName ?? "",
            orderLastName: currentStep.context?.data?.orderLastName ?? "",
            orderPhoneNumber: currentStep.context?.data?.orderPhoneNumber ?? "",
            orderEmail: currentStep.context?.data?.orderEmail ?? "",
            postCode: currentStep.context?.data?.postCode ?? "",
            orderCity: currentStep.context?.data?.orderCity ?? "",
            orderDistrict: currentStep.context?.data?.orderDistrict ?? "",
            note: currentStep.context?.data?.note ?? "",
        }
    });
    //========Queries==============
    const getProvince = useQuery(["getProvince"], () => axios.get("https://provinces.open-api.vn/api/p/"), {
        refetchOnWindowFocus: false,
        select: ({ data }) => data,
        initialData: (): any => ({ data: [] })
    });
    const getDistrict = useQuery(["getDistrict", createForm.watch("city")], () => axios.get("https://provinces.open-api.vn/api/d/search/", {
        params: {
            q: "*",
            p: createForm.watch("city")?.code
        }
    }), {
        refetchOnWindowFocus: false,
        select: ({ data }) => data,
        initialData: (): any => ({ data: [] }),
        enabled: !!createForm.watch("city")
    });
    const getMyProfile = useQuery([GetMeQueryKey], () => getMeRequest({
        accessToken: session.data?.user?.accessToken
    }), {
        select: ({ data }) => data.data,
        onSuccess: (data) => {
            createForm.reset({
                orderLastName: data.lastName,
                orderFirstName: data.firstName,
                orderEmail: data.email,
                orderCity: data.city,
                orderDistrict: data.district,
                orderPhoneNumber: data.phoneNumber,
                orderAddress: data.address,
                orderGender: data.gender,
            }, { keepDefaultValues: true });
        },
        enabled: session.status == "authenticated" && !isDefined(currentStep.context?.data),
    });
    //========Callbacks===========
    const handleSubmit: SubmitHandler<CreateOrderFormInputs> = (data) => {
    }
    //========Effects=============
    //Form validation
    useEffect(() => {
        const delay = setTimeout(() => {
            let flag = true;
            flag = flag && isNotEmpty(createForm.watch("orderFirstName"));
            flag = flag && isNotEmpty(createForm.watch("orderLastName"));
            flag = flag && isNotEmpty(createForm.watch("orderGender"));
            flag = flag && isNotEmpty(createForm.watch("orderDistrict"));
            flag = flag && isNotEmpty(createForm.watch("orderCity"));
            flag = flag && isNotEmpty(createForm.watch("orderAddress"));
            flag = flag && isNotEmpty(createForm.watch("postCode"));
            flag = flag && isNotEmpty(createForm.watch("orderPhoneNumber"));
            if (flag) currentStep.changeStepStatus("valid");
            else currentStep.changeStepStatus("invalid");
            currentStep.updateData(createForm.getValues());
        }, 150);
        return () => clearTimeout(delay);
    }, [
        createForm.watch("orderFirstName"),
        createForm.watch("orderLastName"),
        createForm.watch("orderGender"),
        createForm.watch("orderDistrict"),
        createForm.watch("orderCity"),
        createForm.watch("orderAddress"),
        createForm.watch("postCode"),
        createForm.watch("orderPhoneNumber")
    ]);

    return (
        <form onSubmit={createForm.handleSubmit(handleSubmit)}>
            <Stack gap={5} sx={{ maxWidth: "570px" }}>
                <Box>
                    <Typography variant="h5" fontWeight={"bold"} textTransform={"uppercase"} sx={{ marginBottom: "25px" }}>Th??ng tin kh??ch h??ng</Typography>
                    <Stack gap={2}>
                        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                            <Controller
                                name="orderLastName"
                                control={createForm.control}
                                render={({ field }) => (
                                    <TextField label="H???" required fullWidth {...field} />
                                )}
                            />
                            <Controller
                                name="orderFirstName"
                                control={createForm.control}
                                render={({ field }) => (
                                    <TextField label="T??n" required fullWidth {...field} />
                                )}
                            />
                        </Stack>
                        <Controller
                            name="orderGender"
                            control={createForm.control}
                            render={({ field }) => (
                                <FormControl>
                                    <InputLabel id="gender-select-label">Gi???i t??nh</InputLabel>
                                    <Select
                                        label="Gi???i t??nh"
                                        {...field}
                                    >
                                        {
                                            genderList.map((gender) => (
                                                <MenuItem key={gender.id} value={gender.value}>{gender.title}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Controller
                            name="city"
                            control={createForm.control}
                            render={({ field }) => (
                                <Autocomplete
                                    freeSolo
                                    value={createForm.getValues("orderCity")!=="" ? { name: createForm.getValues("orderCity") } : null}
                                    getOptionLabel={(option: any) => option.name}
                                    options={getProvince.data}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="T???nh / Th??nh ph???"
                                        />
                                    )
                                    }
                                    onChange={(e, value: any) => { field.onChange(value); createForm.setValue("orderCity", value?.name ?? "") }}
                                />
                            )}
                        />
                        <Controller
                            name="district"
                            control={createForm.control}
                            render={({ field }) => (
                                <Autocomplete
                                    freeSolo
                                    value={createForm.getValues("orderDistrict")!=="" ? { name: createForm.getValues("orderDistrict") } : null}
                                    getOptionLabel={(option: any) => option.name}
                                    options={getDistrict.data}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Qu???n / Huy???n"
                                        />
                                    )
                                    }
                                    onChange={(e, value: any) => { field.onChange(value); createForm.setValue("orderDistrict", value?.name??"") }}
                                />
                            )}
                        />
                        <Controller
                            name="orderAddress"
                            control={createForm.control}
                            render={({ field }) => (
                                <TextField label="?????a ch???" required {...field} />
                            )}
                        />
                        <TextField label="M?? b??u ??i???n" fullWidth required {...createForm.register("postCode")}></TextField>
                        <TextField label="Ghi ch??" fullWidth {...createForm.register("note")}></TextField>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight={"bold"} textTransform={"uppercase"} sx={{ marginBottom: "25px" }}>Th??ng tin li??n h???</Typography>
                    <Stack gap={2}>
                        <Controller
                            name="orderPhoneNumber"
                            control={createForm.control}
                            render={({ field }) => (
                                <TextField label="S??? ??i???n tho???i" required fullWidth {...field}></TextField>
                            )}
                        />
                        <Controller
                            name="orderEmail"
                            control={createForm.control}
                            render={({ field }) => (
                                <TextField label="Email" fullWidth {...field}></TextField>
                            )}
                        />
                    </Stack>
                </Box>
            </Stack>
        </form>
    )
}
export default CreateOrderForm;