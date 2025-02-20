import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PropTypes from "prop-types";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  activeCard,
  setActiveCard,
}) => {
  const handleCardClick = () => {
    if (setCurrentSelectedAddress) {
      setCurrentSelectedAddress(addressInfo);
    }

    setActiveCard(addressInfo._id);
  };

  return (
    <div>
      <Card
        className={`max-w-[450px] cursor-pointer ${
          activeCard === addressInfo._id ? "border-green-500" : ""
        } `}
        onClick={handleCardClick}
      >
        <CardContent className="grid p-4 gap-4 w-max max-w-full cursor-pointer">
          <Label className="cursor-pointer">
            <span className="font-extrabold ">Address : </span>
            {addressInfo?.address}
          </Label>
          <Label className="cursor-pointer">
            <span className="font-extrabold ">City : </span> {addressInfo?.city}
          </Label>
          <Label className="cursor-pointer">
            <span className="font-extrabold ">Zipcode : </span>
            {addressInfo?.zipcode}
          </Label>
          <Label className="cursor-pointer">
            <span className="font-extrabold ">Phone : </span>
            {addressInfo?.phone
              ? `${addressInfo.phone.toString().slice(0, 2)}-${addressInfo.phone
                  .toString()
                  .slice(2, 5)}-${addressInfo.phone.toString().slice(5)}`
              : "N/A"}
          </Label>

          <Label className="cursor-pointer">
            <span className="font-extrabold ">Notes : </span>{" "}
            {addressInfo?.notes}
          </Label>
        </CardContent>
        <CardFooter className="flex justify-between p-3">
          <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
          <Button onClick={() => handleDeleteAddress(addressInfo)}>
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
AddressCard.propTypes = {
  activeCard: PropTypes.string.isRequired,
  setActiveCard: PropTypes.func.isRequired,
  addressInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    address: PropTypes.string,
    city: PropTypes.string,
    zipcode: PropTypes.string,
    phone: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  handleDeleteAddress: PropTypes.func.isRequired,
  handleEditAddress: PropTypes.func.isRequired,
  setCurrentSelectedAddress: PropTypes.func,
};

export default AddressCard;
