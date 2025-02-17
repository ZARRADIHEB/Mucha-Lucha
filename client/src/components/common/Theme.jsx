import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Switch = ({ customClass }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <label
      className={`${customClass} relative inline-flex items-center cursor-pointer`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={darkMode}
        onChange={() => {
          setDarkMode(!darkMode);
          document.documentElement.classList.toggle("dark", !darkMode);
        }}
      />
      <div
        className="w-14 h-7 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 
     peer-checked:from-blue-400 peer-checked:to-indigo-500 
     transition-all duration-500 ease-in-out"
      >
        <div
          className={`absolute top-[2px] left-[2px] bg-white rounded-full h-[24px] w-[24px] flex 
    items-center justify-center transform transition-transform duration-500 ease-in-out 
   ${darkMode ? "translate-x-[28px]" : "translate-x-0"}`}
        >
          {darkMode ? "🌙" : "☀️"}
        </div>
      </div>
    </label>
  );
};
Switch.propTypes = {
  customClass: PropTypes.string,
};

export default Switch;
