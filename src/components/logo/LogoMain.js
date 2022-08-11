// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import logoDark from 'assets/images/logo.webp';
import logo from 'assets/images/logo.webp';

const LogoMain = () => {
  const theme = useTheme();
  return <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="PushFi" width="200" />;
};

export default LogoMain;
