"use client";

import { useRouter } from "next/navigation";

// Simple sign in button that redirects to login page
const ButtonSignin = ({ text = "Iniciar sesión", extraStyle }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <button
      className={`btn ${extraStyle ? extraStyle : ""}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonSignin;