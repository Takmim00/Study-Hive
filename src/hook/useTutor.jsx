import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useTutor = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { refetch, data: tutor = [] } = useQuery({
    queryKey: ["tutor", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/viewBooked?email=${user?.email}`);

      return res.data;
    },
  });
  return [tutor, refetch];
};

export default useTutor;
