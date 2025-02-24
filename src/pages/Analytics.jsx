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

  // Calculate KPIs
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
    const criticalDefects = defectCategories.filter(d => (d?.count || 0) > 10).length;
    const topPerformingModule = moduleAnalysis.length > 0
      ? [...moduleAnalysis].sort((a, b) => (b?.passRate || 0) - (a?.passRate || 0))[0]
      : null;

    return { totalAudits, avgDefectRate, passRate, criticalDefects, topPerformingModule };
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

  const kpis = calculateKPIs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}
      <div className="w-full bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">FCA Analytics Dashboard</h1>
          
          <div className="flex justify-center gap-4">
            <select
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaChartBar className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Audits</p>
                <h3 className="text-xl font-bold text-gray-800">{kpis.totalAudits}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaChartLine className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Defect Rate</p>
                <h3 className="text-xl font-bold text-gray-800">{kpis.avgDefectRate}%</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaCheckCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pass Rate</p>
                <h3 className="text-xl font-bold text-gray-800">{kpis.passRate}%</h3>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaClock className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Best Shift</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {(analyticsData.shiftAnalysis?.[0]?.Shift) || 'N/A'}
                </h3>
              </div>
            </div>
          </div> */}

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaIndustry className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Best Module</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {kpis.topPerformingModule?.Module || 'N/A'}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaUsers className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Critical Defects</p>
                <h3 className="text-xl font-bold text-gray-800">{kpis.criticalDefects}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Defect Trend Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Defect Rate Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.defectTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Line type="monotone" dataKey="defectRate" stroke="#4B5563" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Defect Categories Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Top Defect Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.defectCategories || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="DefectCategory" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar dataKey="count" fill="#023047" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Module Performance Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Module Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.moduleAnalysis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="Module" stroke="#374151" />
                <YAxis yAxisId="left" orientation="left" stroke="#4B5563" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="passRate" fill="#219ebc" name="Pass Rate (%)" />
                <Bar yAxisId="right" dataKey="avgDefectRate" fill="#64748B" name="Defect Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Shift Performance Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Shift Performance Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.shiftAnalysis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="Shift" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar dataKey="passRate" fill="#0a9396" name="Pass Rate (%)" />
                <Bar dataKey="avgDefectRate" fill="#64748B" name="Avg Defect Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Analysis Table */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Customer Performance Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Defect Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(analyticsData?.customerAnalysis || []).map((customer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{customer?.Customer || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{customer?.Style || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {(customer?.passRate || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {(customer?.avgDefectRate || 0).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Defect Location Analysis */}
        <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Defect Location Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={analyticsData?.defectLocationAnalysis || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#374151" />
              <YAxis type="category" dataKey="DefectLocation" stroke="#374151" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
              <Legend />
              <Bar dataKey="frequency" fill="#219ebc" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;