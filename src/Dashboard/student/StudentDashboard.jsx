"use client"

import { useQuery } from "@tanstack/react-query"
import { FaSwatchbook } from "react-icons/fa"
import { FaUsers } from "react-icons/fa6"
import { SiMaterialformkdocs } from "react-icons/si"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import useAuth from "../../hook/useAuth"
import useAxiosSecure from "../../hook/useAxiosSecure"

// Custom color palette
const colors = ["#4361EE", "#3A0CA3", "#7209B7", "#F72585", "#4CC9F0", "#4895EF"]

const StudentDashboard = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const { data: stats = [] } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats")
      return res.data
    },
  })

  const statsArray = [
    { category: "Users", quantity: stats.user },
    { category: "Booked", quantity: stats.booked },
    { category: "Metarials", quantity: stats.metarials },
  ]

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

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-6 ">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          <span>Hi, Welcome </span> {user?.displayName ? user.displayName : "Back"}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsArray.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden border-b-4 transition-transform hover:-translate-y-1"
            style={{ borderBottomColor: colors[index] }}
          >
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-500 text-sm uppercase tracking-wider font-medium">{stat.category}</div>
                  <div className="text-3xl font-bold mt-1">{stat.quantity || 0}</div>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colors[index]}20` }}
                >
                  {index === 0 && <FaUsers className="text-2xl" style={{ color: colors[index] }} />}
                  {index === 1 && <FaSwatchbook className="text-2xl" style={{ color: colors[index] }} />}
                  {index === 2 && <SiMaterialformkdocs className="text-2xl" style={{ color: colors[index] }} />}
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                {index !== 2 ? (
                  <div className="flex items-center text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span>400 (22%)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <span>90 (14%)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Statistics Overview</h3>
        <div className="w-full" style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statsArray}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
              barSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 14 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 14 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="quantity"
                fill="#8884d8"
                shape={<TriangleBar />}
                label={{
                  position: "top",
                  fill: "#6B7280",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {statsArray.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
