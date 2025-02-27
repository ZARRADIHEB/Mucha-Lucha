import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
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
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account{" "}
        </h1>
        <p className="mt-2">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-primary ml-2 hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formdata={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="flex justify-end">
        <Link to="/auth/forget-password">Forget password?</Link>
      </div>
    </div>
  );
};

export default AuthLogin;
