import { useState } from "react"
import { toast } from "react-toastify"
import useAxiosSecure from "../../hook/useAxiosSecure"
import UpdateUserModal from "../../modal/UpdateUserModal"

const UserDataRow = ({ userData, refetch }) => {
  const axiosSecure = useAxiosSecure()
  const [isOpen, setIsOpen] = useState(false)
  const { name, role, email, photoURL } = userData || {}

  const updateRole = async (selectedRole) => {
    if (role === selectedRole) return
    try {
      await axiosSecure.patch(`/user/role/${email}`, {
        role: selectedRole,
      })
      refetch()
      toast.success("Role updated successfully!")
    } catch (err) {
      toast.error(err?.response?.data)
    } finally {
      setIsOpen(false)
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "tutor":
        return "bg-blue-100 text-blue-600"
      case "student":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 mr-3">
            
          </div>
          <p className="text-gray-900 whitespace-no-wrap font-medium">{name}</p>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(role)}`}
        >
          {role}
        </span>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer inline-flex items-center px-3 py-1.5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Update Role
        </button>
        {/* Modal */}
        <UpdateUserModal role={role} updateRole={updateRole} isOpen={isOpen} setIsOpen={setIsOpen} />
      </td>
    </>
  )
}

export default UserDataRow
