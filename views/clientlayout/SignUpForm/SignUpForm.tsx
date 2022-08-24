import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isNotEmpty } from "class-validator";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import getUserExistRequest from "../../../apiRequests/user/getUserExistRequest";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";
import genderList from "../../../util/genderList";

type SignUpFormInputs = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  city: string;
  district: string;
  userCity: any;
  userDistrict: any;
  address: string;
};

const SignUpForm: React.FC = () => {
  
  const currentStep = useStepper("signUpForm");

  const signUpForm = useForm<SignUpFormInputs>({
    defaultValues: {
      gender: currentStep.context?.data?.gender ?? genderList[2].value,
      email: currentStep.context?.data?.email ?? "",
      username: currentStep.context?.data?.username ?? "",
      address: currentStep.context?.data?.address ?? "",
      firstName: currentStep.context?.data?.firstName ?? "",
      lastName: currentStep.context?.data?.lastName ?? "",
      password: currentStep.context?.data?.password ?? "",
      city: currentStep.context?.data?.city ?? "",
      district: currentStep.context?.data?.district ?? "",
      phoneNumber: currentStep.context?.data?.phoneNumber ?? "",
    },
  });
  //======Queries===================
  const getProvince = useQuery(
    ["getProvince"],
    () => axios.get("https://provinces.open-api.vn/api/p/"),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
    }
  );
  const getDistrict = useQuery(
    ["getDistrict", signUpForm.watch("userCity")],
    () =>
      axios.get("https://provinces.open-api.vn/api/d/search/", {
        params: {
          q: "*",
          p: signUpForm.watch("userCity")?.code,
        },
      }),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
      enabled: !!signUpForm.watch("userCity"),
    }
  );
  const getEmailExist = useQuery(
    ["getEmailExist"],
    () =>
      getUserExistRequest({
        email: signUpForm.getValues("email"),
      }),
    {
      select: ({ data }) => data,
      retry: false,
      enabled: false,
    }
  );
  const getUserNameExist = useQuery(
    ["getUserNameExist"],
    () =>
      getUserExistRequest({
        username: signUpForm.getValues("username"),
      }),
    {
      select: ({ data }) => data,
      retry: false,
      enabled: false,
    }
  );

  //=======Callbacks====================
  const handleFormSubmit: SubmitHandler<SignUpFormInputs> = (data) => {};
  //=======Effects=====================
  useEffect(() => {
    const handler = setTimeout(() => {
      if (signUpForm.getValues("email").length > 0) getEmailExist.refetch();
    }, 350);
    return () => clearTimeout(handler);
  }, [signUpForm.watch("email")]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (signUpForm.getValues("username").length > 0)
        getUserNameExist.refetch();
    }, 350);
    return () => clearTimeout(handler);
  }, [signUpForm.watch("username")]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const conditions = [
        signUpForm.watch("username"),
        signUpForm.watch("password"),
        signUpForm.watch("firstName"),
        signUpForm.watch("lastName"),
        signUpForm.watch("phoneNumber"),
        signUpForm.watch("email"),
        signUpForm.watch("gender"),
        signUpForm.watch("city"),
        signUpForm.watch("district"),
        signUpForm.watch("address"),
      ];
      let flag = conditions.reduce(
        (pre, current) => pre && isNotEmpty(current),
        true
      );
      if (flag) currentStep.changeStepStatus("valid");
      else currentStep.changeStepStatus("invalid");
      currentStep.updateData(signUpForm.getValues());
    }, 150);
    return () => clearTimeout(delay);
  }, [
    signUpForm.watch("username"),
    signUpForm.watch("password"),
    signUpForm.watch("firstName"),
    signUpForm.watch("lastName"),
    signUpForm.watch("phoneNumber"),
    signUpForm.watch("email"),
    signUpForm.watch("gender"),
    signUpForm.watch("city"),
    signUpForm.watch("district"),
    signUpForm.watch("address"),
  ]);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          marginBottom: "25px",
        }}
      >
        Thông tin đăng ký
      </Typography>
      <form onSubmit={signUpForm.handleSubmit(handleFormSubmit)}>
        <Stack spacing={2} width={"450px"}>
          <TextField
            error={getUserNameExist.isError}
            helperText={
              getUserNameExist.isError &&
              (getUserNameExist.error as any).response.data.message[0]
            }
            required
            label="Tên đăng nhập"
            {...signUpForm.register("username")}
          ></TextField>
          <TextField
            error={getEmailExist.isError}
            label="Email"
            type={"email"}
            required
            {...signUpForm.register("email")}
            helperText={
              getEmailExist.isError &&
              (getEmailExist.error as any).response.data.message[0]
            }
          ></TextField>
          <TextField
            label="Mật khẩu"
            required
            type={"password"}
            {...signUpForm.register("password")}
          ></TextField>
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Tên đệm"
              required
              {...signUpForm.register("lastName")}
              fullWidth
            ></TextField>
            <TextField
              label="Tên"
              required
              {...signUpForm.register("firstName")}
              fullWidth
            ></TextField>
          </Stack>
          <Controller
            name="gender"
            control={signUpForm.control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="gender-select-label">Giới tính</InputLabel>
                <Select
                  labelId="gender-select-label"
                  label="Giới tính"
                  required
                  {...field}
                >
                  {genderList.map((gender) => (
                    <MenuItem key={gender.id} value={gender.value}>
                      {gender.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <TextField
            label="Số điện thoại"
            required
            type={"tel"}
            {...signUpForm.register("phoneNumber")}
          ></TextField>
          <Controller
            name="userCity"
            control={signUpForm.control}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                value={
                  signUpForm.getValues("city") !== ""
                    ? { name: signUpForm.getValues("city") }
                    : null
                }
                getOptionLabel={(option: any) => option.name}
                options={getProvince.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={field.value}
                    onChange={(e) =>
                      signUpForm.setValue("city", e.target.value)
                    }
                    required
                    label="Tỉnh / Thành phố"
                  />
                )}
                onChange={(e, value: any) => {
                  field.onChange(value);
                  signUpForm.setValue("city", value?.name ?? "");
                }}
              />
            )}
          />
          <Controller
            name="userDistrict"
            control={signUpForm.control}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                value={
                  signUpForm.getValues("district") !== ""
                    ? { name: signUpForm.getValues("district") }
                    : null
                }
                getOptionLabel={(option: any) => option.name}
                options={getDistrict.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={field.value}
                    onChange={(e) =>
                      signUpForm.setValue("district", e.target.value)
                    }
                    required
                    label="Quận / Huyện"
                  />
                )}
                onChange={(e, value: any) => {
                  field.onChange(value);
                  signUpForm.setValue("district", value?.name ?? "");
                }}
              />
            )}
          />
          <TextField
            label="Địa chỉ"
            required
            {...signUpForm.register("address")}
          />
        </Stack>
      </form>
    </Box>
  );
};
export default SignUpForm;
