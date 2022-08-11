// material-ui
import { Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
  const { user } = useAuth();
  return (
    <MainCard title={user?.email}>
      <Typography variant="body2">Role: {user?.role}</Typography>
    </MainCard>
  );
};

export default SamplePage;
