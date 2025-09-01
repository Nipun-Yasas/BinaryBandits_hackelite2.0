import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
  {
    segment: 'resources',
    title: 'Resources',
    icon: <AutoStoriesIcon />,
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
  },
  {
    segment: 'admin',
    title: 'Admin',
    icon: <AdminPanelSettingsIcon />,
  },
];

export default NAVIGATION;