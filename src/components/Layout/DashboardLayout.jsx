import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import './DashboardLayout.css';
import logo from "../../assets/logo.png"

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const navItems = [
        {
            section: '',
            items: [
                { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
                { path: '/about', icon: <InfoIcon />, label: 'About' },
                { path: '/news', icon: <NewspaperIcon />, label: 'News' },
                { path: '/gallery', icon: <PhotoLibraryIcon />, label: 'Gallery' },
            ]
        }
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                    
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((section, index) => (
                        <div key={index} className="nav-section">
                            <div className="nav-section-title">{section.section}</div>
                            {section.items.map((item, itemIndex) => (
                                <Link
                                    key={itemIndex}
                                    to={item.path}
                                    className={`nav-item ${isActive(item.path)}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-text">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user?.username || 'Admin User'}</div>
                            <div className="user-role">{user?.role || 'Administrator'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Sidebar Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="menu-toggle" onClick={toggleSidebar}>
                            <MenuIcon />
                        </button>
                        {/* <div className="topbar-search">
                            <SearchIcon />
                            <input type="text" placeholder="Search..." />
                        </div> */}
                    </div>

                    <div className="topbar-right">                    
                        <button className="topbar-icon" onClick={handleLogout}>
                            <LogoutIcon />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
