import CommonForm from "@/components/common/form";
import { forgetPasswordFormControls } from "@/config";
import { forgetPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  email: "",
};

const ForgetPassword = () => {
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(forgetPassword(formData)).then((data) => {
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

        navigate("/auth/otp-verify", { state: { email: formData.email } });
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
        formControls={forgetPasswordFormControls}
        buttonText="Send OTP"
        formdata={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            formData.email
          )
        }
      />
    </div>
  );
};

export default ForgetPassword;
