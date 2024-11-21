import { PaletteMode } from '@mui/material/styles';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded';
import MenuButton, { MenuButtonProps } from '../SideMenu/MenuButton';
import { memo } from 'react';

interface ToggleColorModeProps extends MenuButtonProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const  ToggleColorMode =({
  mode,
  toggleColorMode,
  ...props
}: ToggleColorModeProps) =>{
  return (
    <MenuButton
      onClick={toggleColorMode}
      size="small"
      aria-label="button to toggle theme"
      {...props}
    >
      {mode === 'dark' ? (
        <WbSunnyRoundedIcon fontSize="small" />
      ) : (
        <ModeNightRoundedIcon fontSize="small" />
      )}
    </MenuButton>
  );
}

export default memo(ToggleColorMode);
