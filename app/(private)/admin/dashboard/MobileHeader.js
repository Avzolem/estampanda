"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export default function MobileHeader() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center mb-4 lg:hidden">
      <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button">
        Open Menu
      </label>

      <button onClick={handleLogout} className="btn btn-outline btn-error">
        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
