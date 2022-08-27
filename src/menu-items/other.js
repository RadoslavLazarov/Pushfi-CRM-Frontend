// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined,
  UserOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  MenuUnfoldOutlined,
  BoxPlotOutlined,
  StopOutlined,
  BorderOutlined,
  SmileOutlined,
  GatewayOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
  UserOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: 'other',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/dashboard',
      icon: icons.ChromeOutlined
    },
    {
      id: 'customers',
      title: <FormattedMessage id="customers" />,
      type: 'item',
      url: '/customers',
      icon: icons.UserOutlined,
      roles: ['Admin', 'Broker']
    }
    // {
    //   id: 'disabled-menu',
    //   title: <FormattedMessage id="disabled-menu" />,
    //   type: 'item',
    //   url: '#',
    //   icon: icons.StopOutlined,
    //   disabled: true
    // }
    // {
    //   id: 'documentation',
    //   title: <FormattedMessage id="documentation" />,
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/mantis/',
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true,
    //   chip: {
    //     label: 'gitbook',
    //     color: 'secondary',
    //     size: 'small'
    //   }
    // }
  ]
};

export default other;
