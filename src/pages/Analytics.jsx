import React, { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaCheckCircle, FaClock, FaIndustry, FaUsers } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  fetchDashboardAnalytics,
  fetchShiftAnalytics,
  fetchModuleAnalytics,
  fetchCustomerAnalytics,
  fetchDefectLocationAnalytics 
} from '../services/api';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7');
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    auditCounts: [],
    defectCategories: [],
    defectTrends: [],
    plantMetrics: [],
    shiftAnalysis: [],
    moduleAnalysis: [],
    customerAnalysis: [],
    defectLocationAnalysis: []
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calculate KPIs with safe handling of undefined values
  const calculateKPIs = () => {
    const auditCounts = analyticsData?.auditCounts || [];
    const plantMetrics = analyticsData?.plantMetrics || [];
    const defectCategories = analyticsData?.defectCategories || [];
    const moduleAnalysis = analyticsData?.moduleAnalysis || [];

    const totalAudits = auditCounts.reduce((acc, curr) => acc + (curr?.count || 0), 0);

    const avgDefectRate = plantMetrics.length > 0 
      ? (plantMetrics.reduce((acc, curr) => acc + (curr?.avgDefectRate || 0), 0) / plantMetrics.length).toFixed(2)
      : 0;

    const passRate = auditCounts.length > 0
      ? ((auditCounts.find(ac => ac?.Status?.toLowerCase() === 'pass')?.count || 0) / (totalAudits || 1) * 100).toFixed(2)
      : 0;

    const criticalDefects = defectCategories
      .filter(d => (d?.count || 0) > 10)
      .length;
    
    const topPerformingModule = moduleAnalysis.length > 0
      ? [...moduleAnalysis].sort((a, b) => (b?.passRate || 0) - (a?.passRate || 0))[0]
      : null;

    return { 
      totalAudits: totalAudits || 0,
      avgDefectRate: avgDefectRate || 0,
      passRate: passRate || 0,
      criticalDefects: criticalDefects || 0,
      topPerformingModule
    };
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [basicAnalytics, shiftData, moduleData, customerData, locationData] = await Promise.all([
          fetchDashboardAnalytics(parseInt(dateRange), selectedPlant),
          fetchShiftAnalytics(dateRange, selectedPlant),
          fetchModuleAnalytics(dateRange, selectedPlant),
          fetchCustomerAnalytics(dateRange, selectedPlant),
          fetchDefectLocationAnalytics(dateRange, selectedPlant)
        ]);

        setAnalyticsData({
          ...basicAnalytics,
          shiftAnalysis: shiftData || [],
          moduleAnalysis: moduleData || [],
          customerAnalysis: customerData || [],
          defectLocationAnalysis: locationData || []
        });
      } catch (error) {
        toast.error(`Error loading dashboard data: ${error.message}`);
        console.error('Dashboard data error:', error);
        
        setAnalyticsData({
          auditCounts: [],
          defectCategories: [],
          defectTrends: [],
          plantMetrics: [],
          shiftAnalysis: [],
          moduleAnalysis: [],
          customerAnalysis: [],
          defectLocationAnalysis: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dateRange, selectedPlant]);

  // Calculate KPIs before rendering
  const kpis = calculateKPIs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">FCA Analytics Dashboard</h1>
          
          <div className="flex gap-4">
          <select
  className="px-4 py-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={selectedPlant}
  onChange={(e) => setSelectedPlant(e.target.value)}
>
  <option value="all">All Plants</option>
  {(analyticsData?.plantMetrics || []).map(metric => (
    <option key={metric?.Plant || 'unknown'} value={metric?.Plant || ''}>
      {metric?.Plant || 'Unknown Plant'}
    </option>
  ))}
</select>

            <select
              className="px-4 py-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <FaChartBar className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Audits</p>
                <h3 className="text-xl font-bold text-gray-900">{kpis.totalAudits}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <FaChartLine className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Defect Rate</p>
                <h3 className="text-xl font-bold text-gray-900">{kpis.avgDefectRate}%</h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <FaCheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                <h3 className="text-xl font-bold text-gray-900">{kpis.passRate}%</h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <FaClock className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Best Shift</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {(analyticsData.shiftAnalysis?.[0]?.Shift) || 'N/A'}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <FaIndustry className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Best Module</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {kpis.topPerformingModule?.Module || 'N/A'}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <FaUsers className="h-8 w-8 text-indigo-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Critical Defects</p>
                <h3 className="text-xl font-bold text-gray-900">{kpis.criticalDefects}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  {/* Defect Trend Over Time */}
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-bold mb-4">Defect Rate Trend</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={Array.isArray(analyticsData?.defectTrends) ? analyticsData.defectTrends : []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="defectRate" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Top Defect Categories */}
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-bold mb-4">Top Defect Categories</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={Array.isArray(analyticsData?.defectCategories) ? analyticsData.defectCategories : []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="DefectCategory" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Module Performance Analysis */}
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-bold mb-4">Module Performance</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={Array.isArray(analyticsData?.moduleAnalysis) ? analyticsData.moduleAnalysis : []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Module" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="passRate" fill="#8884d8" name="Pass Rate (%)" />
        <Bar yAxisId="right" dataKey="avgDefectRate" fill="#82ca9d" name="Defect Rate (%)" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Shift-wise Analysis */}
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-bold mb-4">Shift Performance Analysis</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={Array.isArray(analyticsData?.shiftAnalysis) ? analyticsData.shiftAnalysis : []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Shift" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="passRate" fill="#8884d8" name="Pass Rate (%)" />
        <Bar dataKey="avgDefectRate" fill="#82ca9d" name="Avg Defect Rate (%)" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Defect Location Analysis */}
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-bold mb-4">Defect Location Analysis</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart 
        data={Array.isArray(analyticsData?.defectLocationAnalysis) ? analyticsData.defectLocationAnalysis : []}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="DefectLocation" />
        <Tooltip />
        <Legend />
        <Bar dataKey="frequency" fill="#8884d8" name="Frequency" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* Customer and Location Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Performance Table */}
<div className="bg-white shadow rounded-lg p-6">
  <h3 className="text-lg font-bold mb-4">Customer Performance Analysis</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Defect Rate</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.isArray(analyticsData?.customerAnalysis) ? (
          analyticsData.customerAnalysis.map((customer, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">{customer?.Customer || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{customer?.Style || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(customer?.passRate || 0).toFixed(2)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(customer?.avgDefectRate || 0).toFixed(2)}%
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
              No customer data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

          
        </div>
      </div>
    </div>
  );
};

export default Analytics;