import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import RoleGuard from 'utils/route-guard/RoleGuard';
// import { enums } from 'utils/EnumUtility';

const MainLayout = Loadable(lazy(() => import('layout/MainLayout')));
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));
const CustomersPage = Loadable(lazy(() => import('pages/customers/customers-page')));

const NotFound = Loadable(lazy(() => import('pages/maintenance/404')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'Customers',
          element: (
            <RoleGuard>
              <CustomersPage roles={['Admin', 'Broker']} />
            </RoleGuard>
          )
        }
      ]
    },
    {
      path: '/404',
      element: <NotFound></NotFound>
    }
  ]
};

export default MainRoutes;
