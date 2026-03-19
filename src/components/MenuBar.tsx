import { useDrawerHandle } from "#/helpers/client";
import { IconMenu } from "@tabler/icons-react";
export default function MenuBar() {
  const [isOpen, toggle_drawer] = useDrawerHandle("main-drawer");

  return (
    <>
      <button
        className="btn btn-square btn-primary btn-soft ring fade"
        onClick={toggle_drawer}
      >
        <IconMenu />
      </button>
    </>
  );
}
