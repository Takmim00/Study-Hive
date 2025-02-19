import { useQuery } from "@tanstack/react-query";
import { FaSwatchbook } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import axios from "axios";
import { useEffect, useState } from "react";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

const TutorDashboard = () => {
  const [sessionsWithRejects, setSessionsWithRejects] = useState([]);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: stats = [] } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });
  const { data: reject = [], isLoading: rejectLoading } = useQuery({
    queryKey: ["reject"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://study-hive-server-three.vercel.app/rejects"
      );
      return data;
    },
  });

  const { data: tutors = [], isLoading: tutorsLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://study-hive-server-three.vercel.app/tutors"
      );
      return data;
    },
  });

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

  if (rejectLoading || tutorsLoading) {
    return <div>Loading...</div>;
  }

  const statsArray = [
    { category: "Users", quantity: stats.user },
    { category: "Booked", quantity: stats.booked },
    { category: "Metarials", quantity: stats.metarials },
  ];
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

  return (
    <div>
      <h2 className="text-3xl">
        <span>Hi, Welcome </span>{" "}
        {user?.displayName ? user.displayName : "Back"}
      </h2>
      <div className="stats gap-4 shadow">
        <div className="stat">
          <div className="stat-figure ">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Users</div>
          <div className="stat-value">{stats?.user}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>
        <div className="stat">
          <div className="stat-figure ">
            <FaSwatchbook className="text-3xl" />
          </div>
          <div className="stat-title">Booked</div>
          <div className="stat-value">{stats?.booked}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-figure ">
            <SiMaterialformkdocs className="text-3xl" />
          </div>
          <div className="stat-title">Metarials</div>
          <div className="stat-value">{stats?.metarials}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>

      <div className="w-full" style={{ height: "400px" }}>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Bar
              dataKey="quantity"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top" }}
            >
              {statsArray.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 6]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-11/12 mx-auto">
        <div className="my-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            All <span className="text-blue-600">Reject Reason</span>
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            This intuitive tool allows you to design and share in-depth study
            sessions, creating valuable resources for your students and fellow
            tutors.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3  gap-6">
          {sessionsWithRejects.length > 0 ? (
            sessionsWithRejects.map((session) => (
              <div
                key={session._id}
                className=" bg-white border text-black  rounded-lg shadow-lg p-4"
              >
                <h3>
                  <strong>Name : </strong>{" "}
                  {session.tutor ? session.tutor.name : "Tutor not found"}
                </h3>
                <p>
                  <strong>Rejection Reason : </strong> {session.rejectionReason}
                </p>
                <p>
                  <strong>Feedback : </strong> {session.feedback}
                </p>
              </div>
            ))
          ) : (
            <p>No rejected sessions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
