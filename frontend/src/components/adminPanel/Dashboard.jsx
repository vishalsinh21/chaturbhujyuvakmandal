import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// Custom Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-gradient-to-br from-[#111] to-[#222] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
    <h2 className="text-lg font-semibold text-gray-300 mb-2">{title}</h2>
    <p className="text-4xl font-bold text-white">{value}</p>
  </div>
);

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-[#222] p-6 rounded-2xl animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-600 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [visitAnalytics, setVisitAnalytics] = useState({
    total: 0,
    today: 0,
    byPath: {},
    byDevice: { desktop: 0, mobile: 0 },
  });
  const [contentAnalytics, setContentAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [visitRes, contentRes] = await Promise.all([
          axiosInstance.get('/visits/all'),
          axiosInstance.get('/admin-analytics')
        ]);
        setVisitAnalytics(visitRes.data);
        setContentAnalytics(contentRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !contentAnalytics) return <SkeletonLoader />;

  // Chart Data
  const shippingStatusData = [
    { name: 'Processing', value: contentAnalytics.orderStatus.processingCount },
    { name: 'Shipped', value: contentAnalytics.orderStatus.shippedCount },
    { name: 'Delivered', value: contentAnalytics.orderStatus.deliveredCount },
    { name: 'Cancelled', value: contentAnalytics.orderStatus.cancelledCount }
  ];

  const deviceData = [
    { name: 'Desktop', value: visitAnalytics.byDevice.desktop },
    { name: 'Mobile', value: visitAnalytics.byDevice.mobile }
  ];

  const pathData = Object.entries(visitAnalytics.byPath).map(([path, count]) => ({ name: path, value: count }));

  const COLORS = ['#0ea5e9', '#22c55e', '#facc15', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-8 bg-[#111]">
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Analytics</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Visits" value={visitAnalytics.total} />
        <StatCard title="Today's Visits" value={visitAnalytics.today} />
        <StatCard title="Aarti Page Visits" value={visitAnalytics.byPath['/aarti'] || 0} />
        <StatCard title="Social Icons" value={contentAnalytics.socialIconsCount} />
        <StatCard title="Gallery Items" value={contentAnalytics.galleryCount} />
        <StatCard title="Contacts" value={contentAnalytics.contactCount} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {/* Shipping Status */}
        <div className="bg-[#222] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Shipping Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={shippingStatusData} dataKey="value" nameKey="name" outerRadius={80} label>
                {shippingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Device Distribution */}
        <div className="bg-[#222] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Device Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visits by Path Pie Chart */}
      <div className="bg-[#222] p-6 rounded-2xl shadow-lg mt-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Visits by Page</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pathData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pathData.map((entry, index) => (
                <Cell key={`cell-path-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
