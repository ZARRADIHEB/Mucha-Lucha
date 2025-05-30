import CommonForm from "@/components/common/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addressFormControls } from "@/config";
import { toast } from "react-toastify";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "./address-card";

const initialFormData = {
  address: "",
  city: "",
  zipcode: "",
  phone: "",
  notes: "",
};

const Address = ({ setCurrentSelectedAddress, numberOfCols }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (id) => {
    setActiveCard(id);
  };

  const handleManageAddress = (e) => {
    e.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      toast.error("You reach the maximum number of addresses", {
        className: " dark:bg-gray-900 dark:text-white",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: "custom-progress-bar",
      });

      return;
    }

    if (
      formData.phone.toString().length < 8 ||
      formData.phone.toString().length > 8
    ) {
      toast.error("Phone number must be exactly 8 digits", {
        className: " dark:bg-gray-900 dark:text-white",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: "custom-progress-bar",
      });
      setIsValid(false);
      return;
    }

    if (
      formData.zipcode.toString().length < 4 ||
      formData.zipcode.toString().length > 4
    ) {
      toast.error("Zipcode must be exactly 4 digits", {
        className: " dark:bg-gray-900 dark:text-white",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: "custom-progress-bar",
      });
      setIsValid(false);
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
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

            setFormData(initialFormData);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          console.log(data);
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
            setFormData(initialFormData);
          }
        });
  };

  useEffect(() => {
    setIsValid(
      Object.values(formData).every(
        (value) => typeof value === "string" && value.trim() !== ""
      )
    );
  }, [formData]);

  const handleDeleteAddress = (getCurrentAddress) => {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
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
      }
    });
  };

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      zipcode: String(getCurrentAddress?.zipcode || ""),
      phone: String(getCurrentAddress?.phone || ""),
      notes: getCurrentAddress?.notes || "",
    });
  };

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div
        className={`mb-5 p-3 grid grid-cols-1 ${
          numberOfCols ? `sm:grid-cols-${numberOfCols}` : "sm:grid-cols-3"
        } gap-2`}
      >
        {addressList && addressList.length > 0
          ? addressList.map((address, index) => (
              <AddressCard
                key={index}
                addressInfo={address}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                activeCard={activeCard}
                setActiveCard={handleCardClick}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formdata={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Save" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isValid}
        />
      </CardContent>
    </Card>
  );
};
Address.propTypes = {
  setCurrentSelectedAddress: PropTypes.func.isRequired,
  numberOfCols: PropTypes.number.isRequired,
};

export default Address;
