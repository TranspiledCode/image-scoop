import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useDemoMode } from '../hooks/useDemoMode';

const DemoRouteGuard = ({ children }) => {
  const isDemoMode = useDemoMode();

  if (isDemoMode) {
    return <Navigate to="/" replace />;
  }

  return children;
};

DemoRouteGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DemoRouteGuard;
