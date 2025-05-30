import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import Switch from "../common/Theme";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Switch customClass="hidden lg:block" />
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};
AdminHeader.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default AdminHeader;
