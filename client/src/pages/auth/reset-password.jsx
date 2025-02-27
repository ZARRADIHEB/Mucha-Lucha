import CommonForm from "@/components/common/form";
import { resetPasswordFormControls } from "@/config";
import { resetPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  password: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location?.state?.email;

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      resetPassword({
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    ).then((data) => {
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

        navigate("/auth/login");
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
        formControls={resetPasswordFormControls}
        buttonText=" Reset Password"
        formdata={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={
          formData.password.length < 8 || formData.confirmPassword.length < 8
        }
      />
    </div>
  );
};

export default ResetPassword;
