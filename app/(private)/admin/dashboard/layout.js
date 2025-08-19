import { redirect } from "next/navigation";
import { verifyAuth } from "@/libs/simple-auth";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

// This is a server-side component to ensure the user is logged in and is an admin
// If not, it will redirect to the login page.
// It's applied to all subpages of /admin/dashboard in /app/dashboard/*** pages
export default async function LayoutAdminPrivate({ children }) {
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  // Note: With simple auth, all authenticated users are admins
  // If you need role-based access, implement it in simple-auth

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <div className="p-4">
          <MobileHeader />
          {children}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
