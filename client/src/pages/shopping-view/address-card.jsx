import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PropTypes from "prop-types";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
}) => {
  return (
    <div>
      <Card className="max-w-[450px] ">
        <CardContent className="grid p-4 gap-4 w-max max-w-full">
          <Label>
            <span className="font-extrabold spa">Address : </span>
            {addressInfo?.address}
          </Label>
          <Label>
            <span className="font-extrabold spa">City : </span>{" "}
            {addressInfo?.city}
          </Label>
          <Label>
            <span className="font-extrabold spa">Zipcode : </span>
            {addressInfo?.zipcode}
          </Label>
          <Label>
            <span className="font-extrabold spa">Phone : </span>
            {addressInfo?.phone
              ? `${addressInfo.phone.toString().slice(0, 2)}-${addressInfo.phone
                  .toString()
                  .slice(2, 5)}-${addressInfo.phone.toString().slice(5)}`
              : "N/A"}
          </Label>

          <Label>
            <span className="font-extrabold spa">Notes : </span>{" "}
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
  addressInfo: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    zipcode: PropTypes.string,
    phone: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  handleDeleteAddress: PropTypes.func.isRequired,
  handleEditAddress: PropTypes.func.isRequired,
};

export default AddressCard;
