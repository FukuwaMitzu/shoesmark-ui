import SpeedDial, { SpeedDialProps } from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SettingsIcon from "@mui/icons-material/Settings";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { v4 as uuidv4 } from "uuid";
import { MouseEventHandler, ReactNode, useState } from "react";

export interface OptionDialItem {
  title: string;
  icon: ReactNode;
  enabled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface OptionDialProps extends SpeedDialProps {
  options: OptionDialItem[];
}

const OptionDial: React.FC<OptionDialProps> = ({ options, ...props }) => {
  const [openOption, setOpenOption] = useState(false);

  const openOptions = () => {
    setOpenOption(true);
  };
  const closeOptions = () => {
    setOpenOption(false);
  };

  return (
    <SpeedDial
      sx={{ position: "fixed", bottom: 25, right: 25 }}
      icon={<SpeedDialIcon openIcon={<SettingsIcon />} />}
      onOpen={openOptions}
      open={openOption}
      onClose={closeOptions}
      {...props}
    >
      {options.map(
        ({ enabled, ...optionProps }) =>
          (enabled = enabled ?? true) && <SpeedDialAction key={uuidv4()} {...optionProps} />
      )}
    </SpeedDial>
  );
};


export default OptionDial;