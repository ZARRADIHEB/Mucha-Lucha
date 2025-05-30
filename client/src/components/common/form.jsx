import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const types = {
  INPUT: "input",
  SELECT: "select",
  TEXTAREA: "textarea",
  isBtnDisabled: PropTypes.bool,
};

const CommonForm = ({
  formControls,
  formdata,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const icons = {
    show: FaEye,
    hide: FaEyeSlash,
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const renderInputsByComponentType = (getControlItem) => {
    let element = null;
    const value = formdata[getControlItem.name] || "";
    switch (getControlItem.componentType) {
      case types.INPUT:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={
              (getControlItem.id === "password" && showPassword) ||
              (getControlItem.id === "confirmPassword" && showConfirmPassword)
                ? "text"
                : getControlItem.type
            }
            value={value}
            onChange={(e) =>
              setFormData({
                ...formdata,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );

        break;

      case types.SELECT:
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formdata,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;

      case types.TEXTAREA:
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formdata,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            onChange={(e) =>
              setFormData({
                ...formdata,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls?.map((controlItem) => (
          <div className={`grid w-full gap-1.5 `} key={controlItem.name}>
            <Label className="mb-1 font-extrabold">{controlItem.label}</Label>
            <div
              className={`${controlItem.type === "password" ? "relative" : ""}`}
            >
              {renderInputsByComponentType(controlItem)}
              {controlItem.id === "password" && (
                <span
                  onClick={handleShowPassword}
                  className="absolute top-1/2 right-5 translate-y-[-50%] cursor-pointer p-2"
                >
                  {showPassword ? <icons.hide /> : <icons.show />}
                </span>
              )}{" "}
              {controlItem.id === "confirmPassword" && (
                <span
                  onClick={handleShowConfirmPassword}
                  className="absolute top-1/2 right-5 translate-y-[-50%] cursor-pointer p-2"
                >
                  {showConfirmPassword ? <icons.hide /> : <icons.show />}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};
CommonForm.propTypes = {
  isBtnDisabled: PropTypes.bool,
  formControls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      componentType: PropTypes.oneOf(["input", "select", "textarea"])
        .isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  formdata: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
};

export default CommonForm;
