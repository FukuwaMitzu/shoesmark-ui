import ListItemButton from "@mui/material/ListItemButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CustomListItemButtonProps {
  href?: string;
  children?: React.ReactNode;
}
const CustomListItemButton: React.FC<CustomListItemButtonProps> = ({
  href,
  children,
}) => {
  const router = useRouter();
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (href) {
      if (router.pathname.startsWith(href)) setActive(true);
      else setActive(false);
    }
  }, [router.asPath]);

  return href ? (
    <Link href={href} passHref>
      <ListItemButton selected={isActive}>{children}</ListItemButton>
    </Link>
  ) : (
    <ListItemButton>{children}</ListItemButton>
  );
};

export default CustomListItemButton;
