import CommonForm from "@/components/common/form";
import { optVerifyFormControls } from "@/config";
import { otpVerification } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  otp: "",
};

const OtpVerify = () => {
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location?.state?.email;

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(otpVerification({ otp: formData.otp, email })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message, {
          className: " dark:bg-gray-900 dark:text-white",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressClassName: "custom-progress-bar",
        });

        navigate("/auth/reset-password", { state: { email } });
      } else {
        toast.error(data?.payload?.message || "An error has occurred", {
          className: " dark:bg-gray-900 dark:text-white",
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressClassName: "custom-progress-bar",
        });
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <CommonForm
        formControls={optVerifyFormControls}
        buttonText=" Verify OTP"
        formdata={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!/^[0-9]{6}$/.test(formData.otp)}
      />
    </div>
  );
};

export default OtpVerify;
