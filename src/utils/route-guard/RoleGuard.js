import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

const RoleGuard = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (children.props.roles.indexOf(user.roleName) === -1) {
      navigate('/dashboard', { replace: true });
    }
  }, [children.props.roles, user.roleName, navigate]);

  return children;
};

RoleGuard.propTypes = {
  children: PropTypes.node
};

export default RoleGuard;
