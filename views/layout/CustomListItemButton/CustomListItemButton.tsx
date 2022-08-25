import ListItemButton from "@mui/material/ListItemButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributeAnchorTarget, useEffect, useState } from "react";

interface CustomListItemButtonProps extends React.PropsWithChildren {
  href?: string;
  target?: HTMLAttributeAnchorTarget;
}
const CustomListItemButton: React.FC<CustomListItemButtonProps> = ({
  href,
  target,
  children,
}) => {
  const router = useRouter();
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (href) {
      if (router.pathname==href) setActive(true);
      else setActive(false);
    }
  }, [router.asPath]);

  return href ? (
    <Link href={href} passHref>
      <a target={target} style={{ width: "100%" }}>
        <ListItemButton selected={isActive}>{children}</ListItemButton>
      </a>
    </Link>
  ) : (
    <ListItemButton>{children}</ListItemButton>
  );
};

export default CustomListItemButton;
