import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HeaderBar.css";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";  // Drawer'ı import ettik

const HeaderBar = ({ userData, toggleDrawer, userProfilePage, mainPage }) => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = React.useState(false); // Drawer'ın açık/kapalı durumu

    // Profil sayfası açıkken butona tıklanmasın
    const handleProfileClick = () => {
        if (!userProfilePage) { // Eğer profil sayfası açık değilse, profil sayfasına yönlendir
            navigate("/user-profile", { state: { userdata: userData } });
        }
    };

    // Drawer'ı açıp kapatacak fonksiyon
    const handleDrawerToggle = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <div className="headerBar">
            <div className="logoWrapper">
                <div className="logoText">
                    <span className="internText">Intern</span>
                    <span className="aiText">AI</span>
                </div>
                <div className="userText">{userData}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                    style={{ marginRight: "20px" }}
                    onClick={handleProfileClick} // Profil butonuna tıklamayı kontrol ediyoruz
                >
                    <AccountCircleIcon style={{ color: "white" }} />
                </IconButton>
                <IconButton onClick={handleDrawerToggle(true)}>
                    <MenuIcon style={{ color: "white" }} />
                </IconButton>
            </div>

            {/* Drawer Menü */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle(false)}>
                <div className="drawer-container">
                    <p className="drawer-title">Menü</p>
                    <ul className="drawer-list">
                        {/* Ana Sayfa Butonu */}
                        <li>
                            <Link
                                to="/main"
                                className="drawer-link"
                                style={{ pointerEvents: mainPage ? "none" : "auto", color: mainPage ? "gray" : "white" }}
                                state={{ userdata: userData }} // Kullanıcı verisini main sayfasına gönderiyoruz
                            >
                                Ana Sayfa
                            </Link>
                        </li>
                        <li>
                            <li>
                                <Link
                                    to="/"
                                    className="drawer-link"
                                    style={{
                                        pointerEvents: userData ? "none" : "auto", // userData varsa tıklanamaz yap
                                        color: userData ? "gray" : "white", // userData varsa gri renk
                                    }}
                                >
                                    Giriş Yap
                                </Link>
                            </li>

                        </li>
                        <li>
                            <Link to="/signup" className="drawer-link">Kayıt Ol</Link>
                        </li>
                    </ul>
                </div>
            </Drawer>
        </div>
    );
};

export default HeaderBar;
