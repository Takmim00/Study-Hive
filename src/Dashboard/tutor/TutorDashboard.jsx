import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaCalendarCheck,
  FaUsers,
} from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const TutorDashboard = () => {
  const [sessionsWithRejects, setSessionsWithRejects] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRejection, setSelectedRejection] = useState(null);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard stats
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  // Fetch rejection data
  const { data: reject = [], isLoading: rejectLoading } = useQuery({
    queryKey: ["reject"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://study-hive-server-three.vercel.app/rejects"
      );
      return data;
    },
  });

  // Fetch tutor sessions
  const { data: tutors = [], isLoading: tutorsLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://study-hive-server-three.vercel.app/tutors"
      );
      return data;
    },
  });

  // Combine rejection data with tutor data
  useEffect(() => {
    if (reject.length > 0 && tutors.length > 0) {
      const sessionsWithRejectsData = reject.map((rejection) => {
        const matchingTutor = tutors.find(
          (tutor) => tutor._id === rejection.sessionId
        );
        return {
          ...rejection,
          tutor: matchingTutor || null,
        };
      });

      setSessionsWithRejects(sessionsWithRejectsData);
    }
  }, [reject, tutors]);

  // Prepare data for charts
  const statsArray = [
    { category: "Users", quantity: stats.user || 0 },
    { category: "Booked", quantity: stats.booked || 0 },
    { category: "Materials", quantity: stats.metarials || 0 },
  ];

  // Mock data for additional charts
  const monthlyData = [
    { name: "Jan", sessions: 12, materials: 8 },
    { name: "Feb", sessions: 19, materials: 10 },
    { name: "Mar", sessions: 15, materials: 12 },
    { name: "Apr", sessions: 21, materials: 15 },
    { name: "May", sessions: 25, materials: 18 },
    { name: "Jun", sessions: 30, materials: 20 },
  ];

  const sessionStatusData = [
    {
      name: "Approved",
      value: tutors.filter((t) => t.status === "Approved").length || 5,
    },
    {
      name: "Pending",
      value: tutors.filter((t) => t.status === "Pending").length || 3,
    },
    { name: "Rejected", value: sessionsWithRejects.length || 2 },
  ];

  // Custom triangle bar shape
  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  // Color schemes
  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];
  const gradientColors = {
    sessions: ["#0088FE", "#0044FF"],
    materials: ["#00C49F", "#00A07A"],
  };

  // Loading state
  if (statsLoading || rejectLoading || tutorsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back,{" "}
              <span className="text-blue-600">
                {user?.displayName || "Tutor"}
              </span>
            </h1>
            <p className="mt-1 text-gray-600">
              Here's what's happening with your teaching activities and
              resources
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white rounded-full px-4 py-1.5 shadow-sm border border-gray-200">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-gray-700">
                  Active Tutor
                </span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  src={user?.photoURL || "/placeholder.svg?height=40&width=40"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex overflow-x-auto mb-6 pb-2 scrollbar-hide">
        <div className="flex p-1 rounded-lg bg-white shadow-sm space-x-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "sessions"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaChalkboardTeacher className="h-4 w-4 mr-2" />
            Sessions
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "feedback"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            Feedback
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-3xl font-bold mt-1">{stats.user || 0}</h3>
                <div className="flex items-center mt-2">
                  <span className="flex items-center text-xs font-medium text-green-500">
                    <FaArrowTrendUp className="mr-1" />
                    22%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FaUsers className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">
                Active students
              </span>
              <span className="text-xs font-medium text-blue-600">
                {Math.floor((stats.user || 0) * 0.8)} students
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Booked Sessions
                </p>
                <h3 className="text-3xl font-bold mt-1">{stats.booked || 0}</h3>
                <div className="flex items-center mt-2">
                  <span className="flex items-center text-xs font-medium text-green-500">
                    <FaArrowTrendUp className="mr-1" />
                    18%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <FaCalendarCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">
                Completion rate
              </span>
              <span className="text-xs font-medium text-green-600">92%</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Study Materials
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {stats.metarials || 0}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="flex items-center text-xs font-medium text-red-500">
                    <FaArrowTrendDown className="mr-1" />
                    14%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <SiMaterialformkdocs className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">
                Downloads
              </span>
              <span className="text-xs font-medium text-amber-600">
                {Math.floor((stats.metarials || 0) * 3.2)} total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Activity Overview</h3>
              <div className="flex p-1 rounded-lg text-xs bg-gray-100 space-x-1">
                <button className="px-3 py-1 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50">
                  Weekly
                </button>
                <button className="px-3 py-1 rounded-md bg-blue-50 text-blue-700">
                  Monthly
                </button>
                <button className="px-3 py-1 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50">
                  Yearly
                </button>
              </div>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#111827",
                    }}
                  />
                  <Legend />
                  <defs>
                    <linearGradient
                      id="colorSessions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={gradientColors.sessions[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={gradientColors.sessions[1]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorMaterials"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={gradientColors.materials[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={gradientColors.materials[1]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke={gradientColors.sessions[0]}
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="materials"
                    stroke={gradientColors.materials[0]}
                    fillOpacity={1}
                    fill="url(#colorMaterials)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session Status Pie Chart */}
          <div className="rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
            <h3 className="font-semibold mb-4 text-gray-800">Session Status</h3>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {sessionStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#111827",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {sessionStatusData.map((status, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <p className="text-xs font-medium text-gray-700">
                    {status.name}
                  </p>
                  <p className="text-sm font-bold">{status.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
            <h3 className="font-semibold mb-6 text-gray-800">
              Session Statistics
            </h3>
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statsArray}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#111827",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="quantity"
                    fill="#8884d8"
                    shape={<TriangleBar />}
                    label={{ position: "top", fill: "#6b7280" }}
                  >
                    {statsArray.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Recent Sessions</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Session
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Students
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tutors.slice(0, 5).map((session, index) => (
                    <tr key={session._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={
                                session.sessionImage ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={session.sessionTitle}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {session.sessionTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.category || "General"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            session.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : session.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(Math.random() * 20) + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "feedback" && (
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Session Feedback</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {sessionsWithRejects.length} Feedbacks
              </span>
            </div>

            {sessionsWithRejects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionsWithRejects.map((session) => (
                  <div
                    key={session._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedRejection(session)}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {session.tutor
                            ? session.tutor.sessionTitle
                            : "Unknown Session"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {session.tutor ? session.tutor.name : "Unknown Tutor"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Rejection Reason:
                      </div>
                      <div className="text-sm font-medium text-gray-800 bg-red-50 p-2 rounded">
                        {session.rejectionReason}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Feedback:
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {session.feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No Rejection Feedback
                </h3>
                <p className="mt-1 text-gray-500">
                  All your sessions are in good standing!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {selectedRejection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Feedback Details
              </h2>
              <button
                onClick={() => setSelectedRejection(null)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                  <img
                    src={
                      selectedRejection.tutor?.sessionImage ||
                      "/placeholder.svg?height=48&width=48"
                    }
                    alt={selectedRejection.tutor?.sessionTitle || "Session"}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedRejection.tutor?.sessionTitle || "Unknown Session"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedRejection.tutor?.name || "Unknown Tutor"} (
                    {selectedRejection.tutor?.email || "No email"})
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </h3>
              <p className="text-sm text-gray-800 bg-red-50 p-3 rounded border border-red-100">
                {selectedRejection.rejectionReason}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Detailed Feedback
              </h3>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {selectedRejection.feedback}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRejection(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;
