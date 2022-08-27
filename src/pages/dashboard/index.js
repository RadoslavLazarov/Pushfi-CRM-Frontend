// material-ui
import { Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <MainCard title={user?.email}>
      <Typography variant="body2">Role: {user?.roleName}</Typography>
    </MainCard>
  );
};

export default Dashboard;
