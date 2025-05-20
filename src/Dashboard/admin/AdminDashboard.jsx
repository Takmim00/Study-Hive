"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { FaSwatchbook, FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa"
import { FaUsers, FaArrowTrendUp, FaArrowTrendDown, FaEllipsis } from "react-icons/fa6"
import { SiMaterialformkdocs } from "react-icons/si"
import { MdNotifications } from "react-icons/md"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts"
import useAuth from "../../hook/useAuth"
import useAxiosSecure from "../../hook/useAxiosSecure"

const AdminDashboard = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotifications, setShowNotifications] = useState(false)

  // Fetch dashboard stats
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats")
      return res.data
    },
  })

  // Prepare data for charts
  const statsArray = [
    { category: "Users", quantity: stats.user || 0 },
    { category: "Booked", quantity: stats.booked || 0 },
    { category: "Materials", quantity: stats.metarials || 0 },
  ]

  // Mock data for additional charts
  const monthlyData = [
    { name: "Jan", users: 65, sessions: 42, materials: 28 },
    { name: "Feb", users: 78, sessions: 50, materials: 32 },
    { name: "Mar", users: 90, sessions: 58, materials: 37 },
    { name: "Apr", users: 81, sessions: 56, materials: 42 },
    { name: "May", users: 95, sessions: 64, materials: 45 },
    { name: "Jun", users: 110, sessions: 70, materials: 52 },
  ]

  const userTypeData = [
    { name: "Students", value: 65 },
    { name: "Tutors", value: 25 },
    { name: "Admins", value: 10 },
  ]

  const sessionStatusData = [
    { name: "Completed", value: 45 },
    { name: "Upcoming", value: 35 },
    { name: "Cancelled", value: 20 },
  ]

  const recentActivities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "booked a session",
      subject: "Advanced Calculus",
      time: "10 minutes ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      user: "Michael Chen",
      action: "uploaded material",
      subject: "Physics Lab Notes",
      time: "25 minutes ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      action: "registered as",
      subject: "new student",
      time: "1 hour ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      user: "Dr. James Wilson",
      action: "created session",
      subject: "Organic Chemistry",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const notifications = [
    {
      id: 1,
      title: "New User Registration",
      description: "5 new users registered today",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Session Alert",
      description: "3 sessions scheduled for tomorrow",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System Update",
      description: "Platform update scheduled for tonight",
      time: "3 hours ago",
      unread: false,
    },
  ]

  // Custom triangle bar shape
  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`
  }

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />
  }

  // Color schemes
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]
  const gradientColors = {
    users: ["#0088FE", "#0044FF"],
    sessions: ["#00C49F", "#00A07A"],
    materials: ["#FFBB28", "#FF9900"],
  }

  // Dashboard tabs
  const tabs = [
    { id: "overview", label: "Overview", icon: <FaGraduationCap /> },
    { id: "users", label: "Users", icon: <FaUsers /> },
    { id: "sessions", label: "Sessions", icon: <FaChalkboardTeacher /> },
    { id: "materials", label: "Materials", icon: <SiMaterialformkdocs /> },
  ]

  return (
    <div className="p-4 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome back, {user?.displayName || "Admin"}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img
              src={user?.photoURL || "/placeholder.svg?height=40&width=40"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 pb-2 scrollbar-hide">
        <div className="flex p-1 rounded-lg bg-white shadow-sm space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-500 mt-1">{stats.user || 0}</h3>
                <div className="flex items-center mt-2">
                  <span className="flex items-center text-xs font-medium text-green-500">
                    <FaArrowTrendUp className="mr-1" />
                    22%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FaUsers className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          
        </div>

        <div className="rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Booked Sessions</p>
                <h3 className="text-3xl font-bold text-gray-500 mt-1">{stats.booked || 0}</h3>
                <div className="flex items-center mt-2">
                  <span className="flex items-center text-xs font-medium text-green-500">
                    <FaArrowTrendUp className="mr-1" />
                    18%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <FaSwatchbook className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
          
        </div>

        <div className="rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Study Materials</p>
                <h3 className="text-3xl font-bold text-gray-500 mt-1">{stats.metarials || 0}</h3>
                <div className="flex items-center mt-2">
                  <span className="flex items-center text-xs font-medium text-red-500">
                    <FaArrowTrendDown className="mr-1" />
                    14%
                  </span>
                  <span className="ml-2 text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <SiMaterialformkdocs className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className=" gap-6">
        {/* Main Chart */}
        <div className=" rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800">Growth Overview</h3>
            <div className="flex p-1 rounded-lg text-xs bg-gray-100 space-x-1">
              <button className="px-3 py-1 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50">Weekly</button>
              <button className="px-3 py-1 rounded-md bg-blue-50 text-blue-700">Monthly</button>
              <button className="px-3 py-1 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50">Yearly</button>
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
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                <YAxis tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    color: "#111827",
                  }}
                />
                <Legend />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColors.users[0]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gradientColors.users[1]} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColors.sessions[0]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gradientColors.sessions[1]} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorMaterials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColors.materials[0]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gradientColors.materials[1]} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={gradientColors.users[0]}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
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

        
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Triangle Bar Chart */}
        <div className="rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">Platform Statistics</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statsArray}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="category" tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                <YAxis tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    color: "#111827",
                  }}
                />
                <Bar
                  dataKey="quantity"
                  fill="#8884d8"
                  shape={<TriangleBar />}
                  label={{ position: "top", fill: "#6b7280" }}
                >
                  {statsArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Types Pie Chart */}
        <div className="rounded-xl bg-white shadow-sm p-6 transition-all hover:shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">User Types</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sessionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
