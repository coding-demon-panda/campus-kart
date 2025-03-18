import { Link, useLocation } from 'react-router-dom';
import './users.css';

const iconMap = {
  Home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 20V14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14V20M10.9833 3.60011L4.98335 7.14177C4.37395 7.50149 4 8.15646 4 8.8641V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V8.8641C20 8.15646 19.6261 7.50149 19.0167 7.14177L13.0167 3.60011C12.3894 3.22988 11.6106 3.22988 10.9833 3.60011Z"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  LayoutGrid: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 16.5L9 10L13 16L21 6.5"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Users: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18.5051 19H20C21.1046 19 22.0669 18.076 21.716 17.0286C21.1812 15.4325 19.8656 14.4672 17.5527 14.1329M14.5001 10.8645C14.7911 10.9565 15.1244 11 15.5 11C17.1667 11 18 10.1429 18 8C18 5.85714 17.1667 5 15.5 5C15.1244 5 14.7911 5.04354 14.5001 5.13552M9.5 14C13.1135 14 15.0395 15.0095 15.716 17.0286C16.0669 18.076 15.1046 19 14 19H5C3.89543 19 2.93311 18.076 3.28401 17.0286C3.96047 15.0095 5.88655 14 9.5 14ZM9.5 11C11.1667 11 12 10.1429 12 8C12 5.85714 11.1667 5 9.5 5C7.83333 5 7 5.85714 7 8C7 10.1429 7.83333 11 9.5 11Z"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  MessageSquare: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19M9 13H15M9 17H15"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.65202 4.56614C9.85537 3.65106 10.667 3 11.6044 3H12.3957C13.3331 3 14.1447 3.65106 14.3481 4.56614L14.551 5.47935C15.2121 5.73819 15.8243 6.09467 16.3697 6.53105L17.2639 6.24961C18.1581 5.96818 19.1277 6.34554 19.5964 7.15735L19.9921 7.84264C20.4608 8.65445 20.3028 9.68287 19.612 10.3165L18.9218 10.9496C18.9733 11.2922 19.0001 11.643 19.0001 12C19.0001 12.357 18.9733 12.7078 18.9218 13.0504L19.612 13.6835C20.3028 14.3171 20.4608 15.3455 19.9921 16.1574L19.5965 16.8426C19.1278 17.6545 18.1581 18.0318 17.2639 17.7504L16.3698 17.4689C15.8243 17.9053 15.2121 18.2618 14.551 18.5206L14.3481 19.4339C14.1447 20.3489 13.3331 21 12.3957 21H11.6044C10.667 21 9.85537 20.3489 9.65202 19.4339L9.44909 18.5206C8.78796 18.2618 8.17579 17.9053 7.63034 17.4689L6.73614 17.7504C5.84199 18.0318 4.87234 17.6545 4.40364 16.8426L4.00798 16.1573C3.53928 15.3455 3.69731 14.3171 4.38811 13.6835L5.07833 13.0504C5.02678 12.7077 5.00005 12.357 5.00005 12C5.00005 11.643 5.02678 11.2922 5.07833 10.9496L4.38813 10.3165C3.69732 9.68288 3.5393 8.65446 4.008 7.84265L4.40365 7.15735C4.87235 6.34554 5.842 5.96818 6.73616 6.24962L7.63035 6.53106C8.1758 6.09467 8.78796 5.73819 9.44909 5.47935L9.65202 4.56614Z"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  HelpCircle: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 17H12.01M12 14C12.8906 12.0938 15 12.2344 15 10C15 8.5 14 7 12 7C10.4521 7 9.50325 7.89844 9.15332 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="#101010"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: 'Home', label: 'Dashboard', path: '/settings' },
    { icon: 'LayoutGrid', label: 'Notifications', path: '/accounts' },
    { icon: 'Users', label: 'History', path: '/contacts' },
    { icon: 'MessageSquare', label: 'My Products', path: '/integrations' },
    { icon: 'Settings', label: 'Settings', path: '/dashboard' },
    { icon: 'HelpCircle', label: 'Promotions', path: '/help' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <span className="triumphiq">Campus Cart</span>
      </div>

      <nav className="sidebarBox">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menuElement ${
              location.pathname === item.path
                ? 'menuElementSelected'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="sidebarIcons">
              {iconMap[item.icon]}
            </div>
            <div className={`sidebarText ${
              location.pathname === item.path
                ? 'sidebarTextSelected'
                : 'sidebarText'
            }`}>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
