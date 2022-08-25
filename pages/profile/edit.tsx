import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Breadcrumbs, FormControl, InputLabel, Link as MuiLink, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import editMeRequest from "../../apiRequests/user/editMeRequest";
import getMeRequest, { GetMeQueryKey } from "../../apiRequests/user/getMeRequest";
import getUserExistRequest from "../../apiRequests/user/getUserExistRequest";
import { ApiRequestError } from "../../interfaces/ApiRequestError";
import extractDiff from "../../util/extractDiff";
import genderList from "../../util/genderList";
import { CustomNextPage } from "../_app";

type EditUserFormInputs = {
  email: string;
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

const EditProfilePage: CustomNextPage = () => {
  const session = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const editUserForm = useForm<EditUserFormInputs>({
    defaultValues: {
      gender: genderList[2].value,
      email: "",
      address: "",
      firstName: "",
      lastName: "",
      city: "",
      district: "",
      phoneNumber: "",
    },
  });

  //======Queries======
  const getMeQuery = useQuery(
    [GetMeQueryKey],
    () => getMeRequest({ accessToken: session.data?.user?.accessToken }),
    {
      select: ({ data }) => data.data,
      onSuccess: (data) => {
        editUserForm.reset({
          ...JSON.parse(JSON.stringify(data)),
        });
      },
    }
  );

  const editMeQuery = useMutation(
    (data: Partial<EditUserFormInputs>) =>
      editMeRequest({
        ...data,
        accessToken: session.data?.user?.accessToken,
      }),
    {
      onSuccess: () => {
        enqueueSnackbar("Cập nhật thành công", { variant: "success" });
        router.back();
      },
      onError: (error: ApiRequestError) => {
        enqueueSnackbar(error.response?.data.message[0], { variant: "error" });
      },
    }
  );
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
    ["getDistrict", editUserForm.watch("city")],
    () =>
      axios.get("https://provinces.open-api.vn/api/d/search/", {
        params: {
          q: "*",
          p: editUserForm.watch("userCity")?.code,
        },
      }),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => data,
      initialData: (): any => ({ data: [] }),
      enabled: !!editUserForm.watch("city"),
    }
  );

  const getEmailExist = useQuery(
    ["getEmailExist"],
    () =>
      getUserExistRequest({
        email: editUserForm.getValues("email"),
      }),
    {
      select: ({ data }) => data,
      retry: false,
      enabled: false,
    }
  );

  //=======Callbacks====================
  const handleEditUser: SubmitHandler<EditUserFormInputs> = (data) => {
    if (!getMeQuery.data) return;
    const diff = extractDiff(getMeQuery.data, data);
    editMeQuery.mutate(diff);
  };
  //=======Effects=====================
  useEffect(() => {
    const handler = setTimeout(() => {
      const userEmail = editUserForm.getValues("email");
      if (
        userEmail.length > 0 &&
        userEmail != getMeQuery.data?.email
      )
        getEmailExist.refetch();
    }, 350);
    return () => clearTimeout(handler);
  }, [editUserForm.watch("email")]);


  return (
    <Box>
      <Breadcrumbs sx={{ marginBottom: "15px" }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Trang chủ
          </MuiLink>
        </Link>
        <Link href="/profile" passHref>
          <MuiLink underline="hover" color="inherit">
            Thông tin cá nhân
          </MuiLink>
        </Link>
        <Typography color="text.primary">Chỉnh sửa hồ sơ</Typography>
      </Breadcrumbs>
      <Typography
        variant="h4"
        fontWeight={"bold"}
        textTransform={"uppercase"}
        color="text.primary"
      >
        Chỉnh sửa hồ sơ
      </Typography>
     <Box marginTop={"35px"}>
     <form onSubmit={editUserForm.handleSubmit(handleEditUser)}>
        <Stack spacing={2} width={"450px"}>
          <Controller
            name="email"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField
                
                error={getEmailExist.isError}
                label="Email"
                type={"email"}
                required
                {...field}
                helperText={
                  getEmailExist.isError &&
                  (getEmailExist.error as any).response.data.message[0]
                }
              ></TextField>
            )}
          />
          <Stack direction={"row"} spacing={2}>
            <Controller
              name="lastName"
              control={editUserForm.control}
              render={({ field }) => (
                <TextField
                  
                  label="Tên đệm"
                  {...field}
                  fullWidth
                ></TextField>
              )}
            />
            <Controller
              name="firstName"
              control={editUserForm.control}
              render={({ field }) => (
                <TextField
                  
                  label="Tên"
                  {...field}
                  fullWidth
                ></TextField>
              )}
            />
          </Stack>
          <Controller
            name="gender"
            control={editUserForm.control}
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
          <Controller
            name="phoneNumber"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField
                
                label="Số điện thoại"
                type={"tel"}
                {...field}
              ></TextField>
            )}
          />
          <Controller
            name="userCity"
            control={editUserForm.control}
            render={({ field }) => (
              <Autocomplete
                
                freeSolo
                value={
                  editUserForm.getValues("city") !== ""
                    ? { name: editUserForm.getValues("city") }
                    : null
                }
                getOptionLabel={(option: any) => option.name}
                options={getProvince.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={field.value}
                    required
                    label="Tỉnh / Thành phố"
                  />
                )}
                onChange={(e, value: any) => {
                  field.onChange(value);
                  editUserForm.setValue("city", value?.name ?? "");
                }}
              />
            )}
          />
          <Controller
            name="userDistrict"
            control={editUserForm.control}
            render={({ field }) => (
              <Autocomplete
                
                freeSolo
                value={
                  editUserForm.getValues("district") !== ""
                    ? { name: editUserForm.getValues("district") }
                    : null
                }
                getOptionLabel={(option: any) => option.name}
                options={getDistrict.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={field.value}
                    required
                    label="Quận / Huyện"
                  />
                )}
                onChange={(e, value: any) => {
                  field.onChange(value);
                  editUserForm.setValue("district", value?.name ?? "");
                }}
              />
            )}
          />
          <Controller
            name="address"
            control={editUserForm.control}
            render={({ field }) => (
              <TextField label="Địa chỉ"  {...field} />
            )}
          />
        </Stack>
        <LoadingButton variant={"contained"} loading={editMeQuery.isLoading} type={"submit"} sx={{marginTop:"25px"}}>Lưu thay đổi</LoadingButton>
      </form>
     </Box>
    </Box>
  );
};
EditProfilePage.auth = {
  role: ["admin", "user", "employee"],
};
EditProfilePage.layout = "customer";
export default EditProfilePage;
