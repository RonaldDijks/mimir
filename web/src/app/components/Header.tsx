import Link from "next/link";

export const Header = () => {
  return (
    <nav className="py-2 px-3">
      <Link className="text-xl font-bold" href="/">
        Mimir
      </Link>
    </nav>
  );
};
