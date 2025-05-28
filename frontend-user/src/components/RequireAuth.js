"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/app/components/Header";

const RequireAuth = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const publicRoutes = ["/user-login"]; // các trang không yêu cầu đăng nhập

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("TOKEN:", token);

    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/user-login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) return null;

  const LayoutWithHeader = () => {
    // Nếu là trang login, không cần Header, không cần wrapper
    if (pathname === "/user-login") {
      return <>{children}</>;
    }

    // Các trang khác: có Header và wrapper để canh giữa nội dung
    return (
      <>
        <Header />
        <main style={{ padding: "0 180px 0 0px", maxWidth: "100%", boxSizing: "border-box" }}>
          {children}
        </main>
      </>
    );
  };

  return <LayoutWithHeader />;
};

export default RequireAuth;
