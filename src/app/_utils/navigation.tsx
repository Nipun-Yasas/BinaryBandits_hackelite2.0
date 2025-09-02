import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import WorkIcon from '@mui/icons-material/Work';
import ExploreIcon from '@mui/icons-material/Explore';

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
    segment: 'profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
  },
  {
    segment: 'quiz',
    title: 'Quiz',
    icon: <QuizIcon />,
  },
  {
    segment: 'explore',
    title: 'Career suggestions',
    icon: <WorkIcon />,
  },
  {
    segment: 'forum',
    title: 'Forum',
    icon: <ForumIcon />,
  },
  {
    segment: 'explore',
    title: 'Explore careers',
    icon: <ExploreIcon />,
  },
];

export default NAVIGATION;