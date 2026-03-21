import { Link, useRouter } from "@tanstack/react-router";
import {
  IconBookmark,
  IconHome,
  IconLogin,
  IconLogout,
  IconSearch,
  IconUpload,
  IconUser,
  IconVideo,
} from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { useState, useEffect } from "react";
import { useDrawerHandle } from "#/helpers/client";
import { ClientOnly } from "@tanstack/react-router";

function NavLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        to={to as any}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-sleek text-sm font-medium hover:bg-base-300 transition-colors [&.active]:bg-primary/10 [&.active]:text-primary"
      >
        {icon}
        {label}
      </Link>
    </li>
  );
}

export default function Sidebar() {
  const [isAuth, setIsAuth] = useState(pb.authStore.isValid);
  const [, toggle] = useDrawerHandle("main-drawer");
  const router = useRouter();

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => setIsAuth(pb.authStore.isValid));
    return () => unsub();
  }, []);

  function close() {
    toggle();
  }

  function logout() {
    pb.authStore.clear();
    close();
    router.navigate({ to: "/" });
  }

  return (
    <aside className="w-72 min-h-screen bg-base-200 flex flex-col p-4 gap-6">
      {/* Brand */}
      <div className="px-4 pt-2">
        <Link to="/app" onClick={close} className="text-2xl font-bold">
          <span className="text-primary">Rab</span>ii
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="space-y-1">
          <NavLink
            to="/app"
            icon={<IconHome size={18} />}
            label="Home"
            onClick={close}
          />
          <NavLink
            to="/app/browser"
            icon={<IconSearch size={18} />}
            label="Browse"
            onClick={close}
          />
          <ClientOnly>
            {isAuth && (
              <>
                <NavLink
                  to="/app/upload"
                  icon={<IconUpload size={18} />}
                  label="Upload"
                  onClick={close}
                />
                <NavLink
                  to="/app/profile"
                  icon={<IconUser size={18} />}
                  label="Profile"
                  onClick={close}
                />
                <NavLink
                  to="/app/profile/videos"
                  icon={<IconVideo size={18} />}
                  label="My Videos"
                  onClick={close}
                />
                <NavLink
                  to="/app/profile/saved"
                  icon={<IconBookmark size={18} />}
                  label="Saved"
                  onClick={close}
                />
              </>
            )}
          </ClientOnly>
        </ul>
      </nav>

      {/* Auth footer */}
      <div className="border-t fade pt-4">
        <ClientOnly>
          {isAuth ? (
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-sleek text-sm font-medium text-error hover:bg-error/10 transition-colors"
            >
              <IconLogout size={18} />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 px-2">
              <Link
                to="/auth/login"
                onClick={close}
                className="btn btn-ghost btn-sm w-full"
              >
                Sign in
              </Link>
              <Link
                to="/auth/sign-up"
                onClick={close}
                className="btn btn-primary btn-sm w-full"
              >
                Sign up
              </Link>
            </div>
          )}
        </ClientOnly>
      </div>
    </aside>
  );
}
