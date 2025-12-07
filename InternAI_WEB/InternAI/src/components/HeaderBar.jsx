import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./HeaderBar.css";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BusinessIcon from '@mui/icons-material/Business';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const HeaderBar = ({ userData, mainPage }) => { 
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const isUserProfilePage = location.pathname === "/user-profile";
    const isCompanyDashboard = location.pathname === "/company-dashboard";
    const isMainPage = location.pathname === "/main";
    const isUserApplications = location.pathname === "/user-applications";
    const isUserSettings = location.pathname === "/user-settings";
    const isAiAssistantPage = location.pathname === "/ai-assistant";
    const isCvAnalysisPage = location.pathname === "/cv-analysis";

    const handleProfileClick = () => {
        if (userData?.companyName) { 
            if (!isCompanyDashboard) navigate("/company-dashboard", { state: { companyData: userData } });
        } else if (userData) { 
            if (!isUserProfilePage) {
                navigate("/user-profile", { state: { userdata: userData } });
            }
        }
    };

    const handleDrawerToggle = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        setDrawerOpen(false);
        navigate("/");
    };

    const commonDrawerItems = [
        ...(!userData ? [
            { text: "Giriş Yap", icon: <LoginIcon />, link: "/", active: location.pathname === "/" },
            { text: "Öğrenci Kayıt", icon: <PersonAddIcon />, link: "/signup", active: location.pathname === "/signup" },
            { text: "Şirket Kayıt", icon: <BusinessIcon />, link: "/company-signup", active: location.pathname === "/company-signup" }
        ] : [])
    ];

    const userDrawerItems = userData && !userData.companyName ? [
        { text: "Ana Sayfa (Stajlar)", icon: <WorkIcon />, link: "/main", active: isMainPage, state: { userdata: userData } },
        { text: "AI Asistan", icon: <ChatIcon />, link: "/ai-assistant", active: isAiAssistantPage, state: { userdata: userData } },
        { text: "CV Analizi", icon: <InsertDriveFileIcon />, link: "/cv-analysis", active: isCvAnalysisPage, state: { userdata: userData } }, 
        { text: "Başvurularım", icon: <AssignmentIcon />, link: "/user-applications", active: isUserApplications, state: { userdata: userData } },
        { text: "Profilim", icon: <AccountCircleIcon />, link: "/user-profile", active: isUserProfilePage, state: { userdata: userData } },
        { text: "Ayarlar", icon: <SettingsIcon />, link: "/user-settings", active: isUserSettings, state: { userdata: userData } },
        { text: "Çıkış Yap", icon: <ExitToAppIcon />, action: handleLogout },
    ] : [];

    const companyDrawerItems = userData && userData.companyName ? [
        { text: "Şirket Paneli", icon: <BusinessIcon />, link: "/company-dashboard", active: isCompanyDashboard, state: { companyData: userData } },
        { text: "Çıkış Yap", icon: <ExitToAppIcon />, action: handleLogout },
    ] : [];

    const drawerList = (
        <div
            className="drawer-container"
            role="presentation"
            onClick={handleDrawerToggle(false)}
            onKeyDown={handleDrawerToggle(false)}
        >
            {userData && (
                <div className="drawer-header">
                    <AccountCircleIcon className="drawer-avatar" />
                    <div className="drawer-user-info">
                        <p className="drawer-user-name">{userData.companyName || userData.fullName}</p>
                        <p className="drawer-user-email">{userData.companyEmail || userData.email}</p>
                    </div>
                </div>
            )}
            <List className="drawer-list">
                {(userData ? (userData.companyName ? companyDrawerItems : userDrawerItems) : commonDrawerItems).map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={item.link ? Link : 'button'}
                            to={item.link}
                            state={item.state}
                            onClick={item.action}
                            className={item.active ? 'drawer-link active-link' : 'drawer-link'}
                        >
                            <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    if (!userData && (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/company-login" || location.pathname === "/company-signup" || location.pathname === "/mailcontrol")) {
        return null;
    }


    return (
        <div className="headerBar">
            <div className="header-left">
                <Link to={userData?.companyName ? "/company-dashboard" : (userData ? "/main" : "/")}
                    state={userData?.companyName ? { companyData: userData } : (userData ? { userdata: userData } : null)}
                    className="header-logoText">
                    <span className="header-internText">Intern</span>
                    <span className="header-aiText">AI</span>
                </Link>
                {userData && (
                    <div className="header-userText">
                       
                    </div>
                )}
            </div>
            <div className="header-right">
                {userData && (
                    <IconButton
                        onClick={handleProfileClick}
                        sx={{ marginRight: '10px' }}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                )}
                <IconButton onClick={handleDrawerToggle(true)}>
                    <MenuIcon />
                </IconButton>
            </div>
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle(false)}>
                {drawerList}
            </Drawer>
        </div>
    );
};

export default HeaderBar;