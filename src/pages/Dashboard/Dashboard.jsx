import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
  const stats = [
    {
      icon: <PeopleIcon />,
      value: '2,543',
      label: 'Total Users',
      change: '+12.5%',
      positive: true,
      color: 'blue'
    },
    {
      icon: <AttachMoneyIcon />,
      value: '$45,231',
      label: 'Total Revenue',
      change: '+8.2%',
      positive: true,
      color: 'green'
    },
    {
      icon: <ShoppingCartIcon />,
      value: '1,245',
      label: 'Total Orders',
      change: '+15.3%',
      positive: true,
      color: 'purple'
    },
    {
      icon: <TrendingUpIcon />,
      value: '89.2%',
      label: 'Conversion Rate',
      change: '-2.1%',
      positive: false,
      color: 'orange'
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
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Recent Activity
          </h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <strong>New order #1234</strong> - John Doe placed an order worth $299
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>2 hours ago</div>
            </div>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <strong>User registered</strong> - Jane Smith created a new account
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>5 hours ago</div>
            </div>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
              <strong>Payment received</strong> - Payment of $1,250 confirmed
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>1 day ago</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              <strong>Product updated</strong> - "Premium Package" details modified
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>2 days ago</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              padding: '12px 16px',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              + Add New User
            </button>
            <button style={{
              padding: '12px 16px',
              background: 'var(--success-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              + Create Order
            </button>
            <button style={{
              padding: '12px 16px',
              background: 'var(--secondary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              📊 View Reports
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
