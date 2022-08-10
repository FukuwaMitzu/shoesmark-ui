import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { isNotEmpty } from "class-validator";
import useStepper from "../../../components/CustomStepper/hooks/useStepperContext";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useMutation } from "@tanstack/react-query";
import { v1 as uuidv1 } from "uuid";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

interface PaymentFormProps { }
interface PaymentFormInputs {
    paymentMethod: string
    onlinePaymentId: string
    cardExpiredDate: string
    CVV: string
    cardFullName: string
    cardNumber: string
}
const PaymentForm: React.FC<PaymentFormProps> = (data) => {
    const session = useSession();

    const currentStep = useStepper("Payment");
    const cartStep = useStepper("CartCustomize");

    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

    const paymentForm = useForm<PaymentFormInputs>({
        defaultValues: {
            paymentMethod: currentStep.context?.data?.paymentMethod ?? "pay_on_receive",
            cardFullName: currentStep.context?.data?.cardFullName ?? "",
            cardNumber: currentStep.context?.data?.cardNumber ?? "",
            cardExpiredDate: currentStep.context?.data?.cardExpiredDate ?? dayjs().toISOString(),
            CVV: currentStep.context?.data?.CVV ?? "",
            onlinePaymentId: currentStep.context?.data?.onlinePaymentId ?? "",
        }
    });

    //==========Queries===============
    const fakeOnlinePayment = useMutation(() => new Promise((ex, rej) => {
        setTimeout(() => {
            ex(uuidv1().split('-')[0]);
        }, 550);
    }), {
        onSuccess: (data: any) => {
            paymentForm.setValue("onlinePaymentId", data);
            currentStep.changeStepStatus("complete");
            setOpenSuccessDialog(true);
        }
    })

    useEffect(() => {
        const delay = setTimeout(() => {
            if (paymentForm.getValues("paymentMethod") == "credit_card") {
                let flag = true;
                flag = flag && isNotEmpty(paymentForm.getValues("onlinePaymentId"));
                flag = flag && isNotEmpty(paymentForm.getValues("cardNumber"));
                flag = flag && isNotEmpty(paymentForm.getValues("cardExpiredDate"));
                flag = flag && isNotEmpty(paymentForm.getValues("cardFullName"));
                flag = flag && isNotEmpty(paymentForm.getValues("CVV"));
                if (flag) {
                    currentStep.changeStepStatus("valid");
                }
                else if (currentStep.context?.status == "valid") currentStep.changeStepStatus("invalid");
            }
            else if (currentStep.context?.status == "invalid") currentStep.changeStepStatus("valid");
            currentStep.update(paymentForm.getValues());
        }, 150);
        return () => clearTimeout(delay);
    }, [
        paymentForm.watch("paymentMethod"),
        paymentForm.getValues("onlinePaymentId"),
        paymentForm.getValues("cardExpiredDate"),
        paymentForm.getValues("cardFullName"),
        paymentForm.getValues("CVV"),
    ]);

    //=========Callbacks==============
    const handleClose = ()=>{
        setOpenSuccessDialog(false)
    }
    const handleSubmit: SubmitHandler<PaymentFormInputs> = (data) => {
        fakeOnlinePayment.mutate();
    }
    return (
        <form onSubmit={paymentForm.handleSubmit(handleSubmit)}>
            <Typography variant="h4" fontWeight={"bold"} textTransform={"uppercase"} color="text.primary">Thanh toán</Typography>
            <Box marginTop="25px">
                <FormControl>
                    <FormLabel>Hình thức thanh toán</FormLabel>
                    <Controller
                        name="paymentMethod"
                        control={paymentForm.control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="pay_on_receive" control={<Radio />} label="Thanh toán khi nhận hàng" />
                                <FormControlLabel value="credit_card" control={<Radio />} label="Thanh toán trực tuyến" />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
                {
                    paymentForm.watch("paymentMethod") == "credit_card" &&
                    <>
                        <Stack gap={2} sx={{ maxWidth: "550px", width: "100%" }}>
                            <Controller
                                name="cardFullName"
                                control={paymentForm.control}
                                render={({ field }) => (
                                    <TextField required {...field} label="Tên trên thẻ"></TextField>
                                )}
                            />
                            <Controller
                                name="cardNumber"
                                control={paymentForm.control}
                                render={({ field }) => (
                                    <TextField required {...field} label="Số thẻ tín dụng"></TextField>
                                )}
                            />
                            <Controller
                                name="cardExpiredDate"
                                control={paymentForm.control}
                                render={({ field }) => (
                                    <DatePicker {...field} label="Hạn sử dụng" renderInput={(params) => <TextField required {...params} />}></DatePicker>
                                )}
                            />
                            <Controller
                                name="CVV"
                                control={paymentForm.control}
                                render={({ field }) => (
                                    <TextField required {...field} label="CVV"></TextField>
                                )}
                            />
                        </Stack>
                        <LoadingButton disabled={currentStep.context?.status=="complete"} loading={fakeOnlinePayment.isLoading} type="submit" variant="contained" sx={{ marginTop: "25px" }}>Thanh toán</LoadingButton>
                    </>
                }
                <Dialog
                    open={openSuccessDialog}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        Thanh toán thành công
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Mã giao dịch của bạn là: #{paymentForm.getValues("onlinePaymentId")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </form>
    )
}

export default PaymentForm;