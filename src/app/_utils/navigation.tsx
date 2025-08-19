import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: ' Learning Hub',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
];

export default NAVIGATION;