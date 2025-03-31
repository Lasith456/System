import Navbar from "../components/NavigationBar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

function UserManagement() {
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    department: "",
    role: "student",
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Ensure users is always an array
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]); // Ensure departments is always an array
    }
  };

  const updateUser = async () => {
    try {
      const updatedUserData = {
        role: newUserData.role,
        department:
          newUserData.role !== "student" ? newUserData.department : "",
      };

      const response = await axios.put(
        `${API_URL}/users/${currentUserId}`,
        updatedUserData
      );

      setUsers(
        users.map((user) =>
          user._id === currentUserId ? { ...user, ...response.data } : user
        )
      );
      console.log("Updated user:", response.data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      console.log(`Deleted user with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newUserData.role.trim() === "") return;
    updateUser();
    setIsPopupOpen(false);
    setNewUserData({ name: "", department: "", role: "student" });
    setCurrentUserId(null);
  };

  const handleEdit = (id, name, department, role) => {
    setIsPopupOpen(true);
    setNewUserData({ name, department, role });
    setCurrentUserId(id);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setNewUserData({ name: "", department: "", role: "student" });
    setCurrentUserId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed flex flex-col items-start justify-start w-auto h-auto mt-20 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl top-6 bottom-4 left-4 right-4 rounded-2xl backdrop-filter backdrop-blur-xl"
      >
        <div className="flex items-center px-4 mt-4 space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search users..."
            className="flex-grow px-3 py-2 text-gray-900 rounded focus:outline-none"
          />
        </div>

        <div className="w-full p-4 overflow-y-auto max-h-auto">
          {currentUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="space-y-4">
              {currentUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {user.email}
                    </h3>
                    <p className="text-sm text-gray-300">Role: {user.role}</p>
                    {user.role !== "student" && (
                      <p className="text-sm text-gray-300">
                        Department:{" "}
                        {user.department || "No department assigned"}
                      </p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        handleEdit(
                          user._id,
                          user.name,
                          user.department,
                          user.role
                        )
                      }
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
        {totalPages > 1 && (
  <div className="flex justify-center mt-4 space-x-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-3 py-1 text-sm rounded ${
          currentPage === index + 1
            ? "bg-blue-600 text-white"
            : "bg-gray-600 text-white hover:bg-gray-500"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

          )}
        </div>
      </motion.div>

      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-white">Edit User</h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-1 text-gray-300">Role</label>
              <select
                value={newUserData.role}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, role: e.target.value })
                }
                className="w-full px-3 py-2 mb-2 text-gray-900 rounded focus:outline-none"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>

              {newUserData.role !== "student" && (
                <>
                  <label className="block mb-1 text-gray-300">Department</label>
                  <select
                    value={newUserData.department}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        department: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 mb-4 text-gray-900 rounded focus:outline-none"
                  >
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default UserManagement;
