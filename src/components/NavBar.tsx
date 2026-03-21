import { ClientOnly, Link } from "@tanstack/react-router";
import MenuBar from "./MenuBar";
import SearchBar from "./Searchbar";
import { IconUser } from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { useState, useEffect, Suspense } from "react";

export default function MainNavbar() {
  const [isAuth, setIsAuth] = useState(pb.authStore.isValid);

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      setIsAuth(pb.authStore.isValid);
    });
    return () => unsub();
  }, []);

  return (
    <div className="top-0 sticky p-4 z-20">
      <nav className="h-16 rounded-sleek backdrop-blur-sm bg-base-200/50 shadow ring space-x-2 fade  container mx-auto items-center flex">
        <div className="space-x-2 flex items-center">
          <MenuBar />
          <Link to="/app" className="text-xl font-bold" viewTransition>
            <span className="text-primary">Rab</span>ii
          </Link>
        </div>
        <div className="hidden sm:flex flex-1">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ClientOnly
            fallback={
              <>
                {" "}
                <Link disabled to="/app/profile" className="link link-icon">
                  <IconUser />
                </Link>
              </>
            }
          >
            {isAuth ? (
              <Link to="/app/profile" className="link link-icon">
                <IconUser />
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to="/auth/sign-up" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </ClientOnly>
        </div>
      </nav>
    </div>
  );
}
