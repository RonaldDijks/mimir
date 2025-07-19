import Link from "next/link";
import { DarkModeToggle } from "./DarkModeToggle";

export const Header = () => {
  return (
    <nav className="py-2 px-3 flex justify-between items-center">
      <Link className="text-xl font-bold" href="/">
        Mimir
      </Link>
      <DarkModeToggle />
    </nav>
  );
};
