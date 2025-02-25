import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../../index.css";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const curserRef = useRef(null);
  const titleRef = useRef(null);
  const buttonLeftRef = useRef(null);
  const buttonRightRef = useRef(null);
  const footerRef = useRef(null);
  const [year] = useState(new Date().getFullYear());

  // Mouse cursor effect for the hexagon background
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (curserRef.current) {
        curserRef.current.style.left = `${e.clientX}px`;
        curserRef.current.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // GSAP animations for landing page content
  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, ease: "bounce.out" }
    );
    gsap.fromTo(
      buttonLeftRef.current,
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(
      buttonRightRef.current,
      { x: 200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(
      footerRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 1 }
    );
  }, []);

  const rows = new Array(12).fill(20);

  return (
    <div className="relative">
      {/* Hexagon Background */}
      <div className="hero bg-black">
        <div ref={curserRef} className="curser"></div>
        <div className="container">
          {rows.map((count, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row">
              {Array.from({ length: count }).map((_, i) => (
                <div key={`hex-${rowIndex}-${i}`} className="hexagon"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Landing Page Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white text-center">
        <h1 ref={titleRef} className="text-5xl font-bold mb-10">
          Welcome To Mucha Lucha
        </h1>
        <div className="flex gap-6">
          <Button
            ref={buttonLeftRef}
            className=" flex items-center justify-center cursor-pointer "
            onClick={() => {
              window.location.href = "/auth/login";
            }}
          >
            Login
          </Button>
          <Button
            ref={buttonRightRef}
            className="flex items-center justify-center cursor-pointer"
            onClick={() => {
              window.location.href = "/auth/register";
            }}
          >
            Register
          </Button>
        </div>
        <footer
          className="absolute bottom-4 text-gray-400 text-sm lg:text-lg"
          ref={footerRef}
        >
          Designed by iZ17 &copy; {year} All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
