import React, { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaCheckCircle, FaTimesCircle, FaIndustry, FaCalendarAlt, FaCode, FaMapMarkerAlt } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { 
  fetchDashboardAnalytics,
  fetchModuleAnalytics,
  fetchCustomerAnalytics,
  fetchDefectLocationAnalytics,
  fetchDefectCodeAnalytics 
} from '../services/api';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Analytics = () => {
  // State for date range picker
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState(new Date()); // today
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    auditCounts: [],
    defectCategories: [],
    defectTrends: [],
    plantMetrics: [],
    customerAnalysis: [],
    defectLocationAnalysis: [],
    defectCodeAnalysis: [],
    moduleAnalysis: [],
    overallMetrics: {
      totalAudits: 0,
      passedAudits: 0,
      failedAudits: 0,
      overallPassRate: 0,
      overallDefectRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  
  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  // Get colors for charts based on value
  const getDefectRateColor = (value) => {
    if (value < 3) return '#4CAF50'; // Green for good
    if (value < 7) return '#FFC107'; // Yellow for warning
    return '#F44336'; // Red for bad
  };

  const getPassRateColor = (value) => {
    if (value > 90) return '#4CAF50'; // Green for good
    if (value > 80) return '#FFC107'; // Yellow for warning
    return '#F44336'; // Red for bad
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Format dates for API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        const [
          basicAnalytics, 
          moduleData, 
          customerData, 
          locationData,
          codeData
        ] = await Promise.all([
          fetchDashboardAnalytics(formattedStartDate, formattedEndDate, selectedPlant),
          fetchModuleAnalytics(formattedStartDate, formattedEndDate, selectedPlant),
          fetchCustomerAnalytics(formattedStartDate, formattedEndDate, selectedPlant),
          fetchDefectLocationAnalytics(formattedStartDate, formattedEndDate, selectedPlant),
          fetchDefectCodeAnalytics(formattedStartDate, formattedEndDate, selectedPlant)
        ]);

        // Format the dates in defect trends for display
        const formattedDefectTrends = basicAnalytics.defectTrends.map(item => ({
          ...item,
          formattedDate: formatDate(item.date)
        }));

        setAnalyticsData({
          ...basicAnalytics,
          defectTrends: formattedDefectTrends,
          moduleAnalysis: moduleData || [],
          customerAnalysis: customerData || [],
          defectLocationAnalysis: locationData || [],
          defectCodeAnalysis: codeData || []
        });
      } catch (error) {
        toast.error(`Error loading dashboard data: ${error.message}`);
        setAnalyticsData({
          auditCounts: [],
          defectCategories: [],
          defectTrends: [],
          plantMetrics: [],
          customerAnalysis: [],
          defectLocationAnalysis: [],
          defectCodeAnalysis: [],
          moduleAnalysis: [],
          overallMetrics: {
            totalAudits: 0,
            passedAudits: 0,
            failedAudits: 0,
            overallPassRate: 0,
            overallDefectRate: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [startDate, endDate, selectedPlant]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  // Get the overall metrics
  const { totalAudits, passedAudits, failedAudits, overallPassRate, overallDefectRate } = analyticsData.overallMetrics || {};

  // Transform customer data for clustered bar chart - group by customer name
  const customerMap = new Map();
  
  (analyticsData?.customerAnalysis || []).forEach(customer => {
    const customerName = customer?.Customer || 'N/A';
    
    if (customerMap.has(customerName)) {
      // If we already have this customer, add to existing counts
      const existingCustomer = customerMap.get(customerName);
      existingCustomer.Passed += customer?.passedAudits || 0;
      existingCustomer.Failed += customer?.failedAudits || 0;
      existingCustomer.TotalAudits += customer?.totalAudits || 0;
      existingCustomer.TotalDefectRate += (customer?.avgDefectRate || 0) * (customer?.totalAudits || 0);
    } else {
      // First time seeing this customer
      customerMap.set(customerName, {
        Customer: customerName,
        Passed: customer?.passedAudits || 0,
        Failed: customer?.failedAudits || 0,
        TotalAudits: customer?.totalAudits || 0,
        TotalDefectRate: (customer?.avgDefectRate || 0) * (customer?.totalAudits || 0)
      });
    }
  });
  
  // Calculate the averages and format the data for the chart
  const transformedCustomerData = Array.from(customerMap.values()).map(customer => ({
    Customer: customer.Customer,
    Passed: customer.Passed,
    Failed: customer.Failed,
    PassRate: customer.TotalAudits > 0 ? (customer.Passed / customer.TotalAudits) * 100 : 0,
    AvgDefectRate: customer.TotalAudits > 0 ? customer.TotalDefectRate / customer.TotalAudits : 0
  }));

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}
      <div className="w-full bg-gray-50 border-b border-gray-200 py-6">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between mb-6">
      {/* Logo added here */}
      <img 
        src="/bodyline2.png" 
        alt="MAS Holdings Logo" 
        className="h-10 w-auto"
      />
      <h1 className="text-3xl font-bold text-center text-gray-800">FCA Analytics Dashboard</h1>
      <div className="w-10"></div> {/* Empty div for balanced centering */}
    </div>
    
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {/* Date picker and plant selector remain unchanged */}
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholderText="Start Date"
                dateFormat="dd/MM/yyyy"
              />
              <span className="text-gray-500">to</span>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholderText="End Date"
                dateFormat="dd/MM/yyyy"
              />
            </div>

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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaChartBar className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Audits</p>
                <h3 className="text-xl font-bold text-gray-800">{totalAudits}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaCheckCircle className="h-8 w-8 text-[#0a9396]" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Passed Audits</p>
                <h3 className="text-xl font-bold text-[#0a9396]">{passedAudits}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaTimesCircle className="h-8 w-8 text-[#ae2012]" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Failed Audits</p>
                <h3 className="text-xl font-bold text-[#ae2012]">{failedAudits}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaCheckCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pass Rate</p>
                <h3 className="text-xl font-bold text-gray-800">{overallPassRate}%</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <FaChartLine className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Defect Rate</p>
                <h3 className="text-xl font-bold text-gray-800">{overallDefectRate}%</h3>
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
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#374151" 
                  tickFormatter={(value) => value}
                />
                <YAxis stroke="#374151" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} 
                  formatter={(value) => [`${value}%`, 'Defect Rate']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="defectRate" 
                  stroke="#023047" 
                  strokeWidth={2} 
                  name="Defect Rate (%)"
                  dot={{ stroke: '#023047', strokeWidth: 2, r: 4 }}
                  activeDot={{ stroke: '#023047', strokeWidth: 2, r: 6 }}
                />
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
                <Bar dataKey="count" fill="#003049" name="Count" />
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
                <Bar yAxisId="left" dataKey="passRate" fill="#8ecae6" name="Pass Rate (%)" />
                <Bar yAxisId="right" dataKey="avgDefectRate" fill="#023047" name="Defect Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Defect Code Analysis - FIXED OVERLAP */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              <FaCode className="inline-block mr-2" />
              Defect Code Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={analyticsData?.defectCodeAnalysis?.slice(0, 10) || []} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" stroke="#374151" />
                <YAxis 
                  type="category" 
                  dataKey="DefectCode" 
                  stroke="#374151"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar dataKey="defectCount" fill="#023047" name="Defect Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Performance Analysis - CHANGED TO BAR CHART */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mt-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Customer Performance Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={transformedCustomerData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="Customer" 
                stroke="#374151" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#374151" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
              <Legend wrapperStyle={{ paddingTop: 15 }} />
              <Bar dataKey="Passed" fill="#8ecae6" name="Passed Audits" />
              <Bar dataKey="Failed" fill="#219ebc" name="Failed Audits" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Small Stats Table for Pass Rate and Defect Rate */}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Defect Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transformedCustomerData.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{customer.Customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`font-medium ${customer.PassRate > 90 ? 'text-green-600' : customer.PassRate > 80 ? 'text-yellow-600' : 'text-red-600'}`}
                      >
                        {customer.PassRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`font-medium ${customer.AvgDefectRate < 3 ? 'text-green-600' : customer.AvgDefectRate < 7 ? 'text-yellow-600' : 'text-red-600'}`}
                      >
                        {customer.AvgDefectRate.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Defect Location Analysis */}
        <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            <FaMapMarkerAlt className="inline-block mr-2" />
            Defect Location Analysis
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={analyticsData?.defectLocationAnalysis?.slice(0, 10) || []}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis type="number" stroke="#374151" />
              <YAxis 
                type="category" 
                dataKey="DefectLocation" 
                stroke="#374151"
                width={110}
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
              <Legend />
              <Bar dataKey="totalDefects" fill="#219ebc" name="Total Defects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <footer className="mt-16 py-4 bg-gray-800 text-center flex items-center justify-between px-8">
  <div className="flex items-center">
    <img 
      src="/MAS White.png" 
      alt="FCA App Logo" 
      className="h-10 w-auto"
    />
  </div>
  <p className="text-white text-sm font-semibold">
    © {new Date().getFullYear()} FCA App. Bodyline Digital Excellence.
  </p>
</footer>
    </div>
  );
};

export default Analytics;