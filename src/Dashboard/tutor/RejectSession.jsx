import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const RejectSession = () => {
  const [sessionsWithRejects, setSessionsWithRejects] = useState([]);

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

  return (
    <div className="w-11/12 mx-auto">
      <Helmet>
        <title>Dashboard || Reject Dashboard</title>
      </Helmet>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          All <span className="text-blue-600">Reject</span>
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
              className=" bg-white border rounded-lg shadow-lg p-4"
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
  );
};

export default RejectSession;
