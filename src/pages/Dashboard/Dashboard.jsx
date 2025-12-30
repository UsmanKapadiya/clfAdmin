import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PeopleIcon from '@mui/icons-material/People';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getDashboardStats } from '../../services/authService';
import { ImageOutlined, NewspaperOutlined, VideoLibraryOutlined } from '@mui/icons-material';

const Dashboard = () => {
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setAboutData(res.data?.data);
        } else {
          setError(res.error || 'Failed to fetch about list');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch about list');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

    const stats = [
      {
        icon: <NewspaperOutlined/>,
        value: aboutData?.activatedNewsCount ?? '-',
        label: 'Activated News',
      },
      {
        icon: <ImageOutlined />,
        value: aboutData?.imagesCount ?? '-',
        label: 'Total Uploaded Images',
      },
      {
        icon: <VideoLibraryOutlined />,
        value: aboutData?.videosCount ?? '-',
        label: 'Total Uploaded Videos',
      }
    ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            {/* <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change} from last month
            </div> */}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
