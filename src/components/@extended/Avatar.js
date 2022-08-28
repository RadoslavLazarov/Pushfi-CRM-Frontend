import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import MuiAvatar from '@mui/material/Avatar';
import { Box } from '@mui/material';

// project import
import getColors from 'utils/getColors';
import useAuth from 'hooks/useAuth';

// ==============================|| AVATAR - COLOR STYLE ||============================== //

function getColorStyle({ theme, color, type }) {
  const colors = getColors(theme, color);
  const { lighter, light, main, contrastText } = colors;

  switch (type) {
    case 'filled':
      return {
        color: contrastText,
        backgroundColor: main
      };
    case 'outlined':
      return {
        color: main,
        border: '1px solid',
        borderColor: main,
        backgroundColor: 'transparent'
      };
    case 'combined':
      return {
        color: main,
        border: '1px solid',
        borderColor: light,
        backgroundColor: lighter
      };
    default:
      return {
        color: main,
        backgroundColor: lighter
      };
  }
}

// ==============================|| AVATAR - SIZE STYLE ||============================== //

function getSizeStyle(size) {
  switch (size) {
    case 'badge':
      return {
        border: '2px solid',
        fontSize: '0.675rem',
        width: 20,
        height: 20
      };
    case 'xs':
      return {
        fontSize: '0.75rem',
        width: 24,
        height: 24
      };
    case 'sm':
      return {
        fontSize: '0.875rem',
        width: 32,
        height: 32
      };
    case 'lg':
      return {
        fontSize: '1.2rem',
        width: 52,
        height: 52
      };
    case 'xl':
      return {
        fontSize: '1.5rem',
        width: 64,
        height: 64
      };
    case 'md':
    default:
      return {
        fontSize: '1rem',
        width: 40,
        height: 40
      };
  }
}

// ==============================|| STYLED - AVATAR ||============================== //

const AvatarStyle = styled(MuiAvatar, { shouldForwardProp: (prop) => prop !== 'color' && prop !== 'type' && prop !== 'size' })(
  ({ theme, variant, color, type, size }) => ({
    ...getSizeStyle(size),
    ...getColorStyle({ variant, theme, color, type }),
    ...(size === 'badge' && {
      borderColor: theme.palette.background.default
    })
  })
);

// ==============================|| EXTENDED - AVATAR ||============================== //

export default function Avatar({ variant = 'circular', children, color = 'primary', type, size = 'md', ...others }) {
  const theme = useTheme();

  return (
    <AvatarStyle variant={variant} theme={theme} color={color} type={type} size={size} {...others}>
      {children}
    </AvatarStyle>
  );
}

Avatar.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string
};

export function AvatarCustom({ avatarColor, fullName, size }) {
  const { user } = useAuth();
  let names;
  let color;
  let adminFirstLetter;

  if (fullName) {
    names = fullName.split(' ');
  } else if (user?.fullName) {
    names = user.fullName.split(' ');
  } else {
    adminFirstLetter = 'A';
  }

  if (avatarColor) {
    color = avatarColor;
  } else {
    color = user?.avatarColor;
  }

  let firstNameLetter;
  let lastNameLetter;

  if (names?.length) {
    firstNameLetter = names[0].split('')[0]?.toUpperCase();
    lastNameLetter = names[1].split('')[0]?.toUpperCase();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `${size}px`,
        width: `${size}px`,
        bgcolor: color,
        color: '#fff',
        borderRadius: '50%',
        fontWeight: 700,
        fontSize: 10
      }}
    >
      {adminFirstLetter ? adminFirstLetter : firstNameLetter + lastNameLetter}
    </Box>
  );
}

AvatarCustom.propTypes = {
  avatarColor: PropTypes.string,
  fullName: PropTypes.string,
  size: PropTypes.number
};
