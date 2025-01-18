import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";


const useTutor = () => {
  const axiosSecure = useAxiosSecure();
  const {user} = useAuth();
  const {refetch, data: tutor = [] } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tutors/${user.email}`);
      console.log(res.data);
      return res.data;
    },
  });
  return [tutor, refetch];
};

export default useTutor;
