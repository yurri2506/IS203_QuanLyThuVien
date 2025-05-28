"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import HeaderNoLogin from "@/app/components/HeaderNoLogin";

const RequireAuth = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const publicRoutes = ["/user-login", "/", "/Categories", "/About", "/Help"];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("TOKEN:", token);
    setHasToken(!!token);

    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/user-login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) return null;

  const LayoutWithHeader = () => {
    // Không cần header trên trang login
    if (pathname === "/user-login") {
      return <>{children}</>;
    }

    const isPublicPage = publicRoutes.includes(pathname);

    return (
      <>
        {hasToken || !isPublicPage ? <Header /> : <HeaderNoLogin />}
        <main
          style={{
            padding: "0 180px 0 0px",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </>
    );
  };

  return <LayoutWithHeader />;
};

export default RequireAuth;