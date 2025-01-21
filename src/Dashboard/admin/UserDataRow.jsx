import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hook/useAxiosSecure";
import UpdateUserModal from "../../modal/UpdateUserModal";

const UserDataRow = ({ userData, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  const { name, role, email } = userData || {};

  const updateRole = async (selectedRole) => {
    if (role === selectedRole) return;
    try {
      await axiosSecure.patch(`/user/role/${email}`, {
        role: selectedRole,
      });
      refetch();
      toast.success("Role updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data);
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{name}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{role}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update Role</span>
        </span>
        {/* Modal */}
        <UpdateUserModal
          role={role}
          updateRole={updateRole}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </td>
    </tr>
  );
};

export default UserDataRow;
