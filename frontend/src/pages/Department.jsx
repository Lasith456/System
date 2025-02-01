import Navbar from "../components/NavigationBar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

function Department() {
  const API_URL =
    import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

  const [departments, setDepartments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 6;

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch Departments from Backend
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}api/departments`);
      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  // Add New Department
  const addDepartment = async () => {
    try {
      const response = await axios.post(`${API_URL}api/departments`, {
        name: newDepartment,
      });
      setDepartments([...departments, response.data]);
      console.log("Added new department:", response.data);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  // Update Existing Department
  const updateDepartment = async () => {
    try {
      const response = await axios.put(
        `${API_URL}api/departments/${currentDepartmentId}`,
        { name: newDepartment }
      );
      setDepartments(
        departments.map((department) =>
          department._id === currentDepartmentId
            ? { ...department, name: response.data.name }
            : department
        )
      );
      console.log("Updated department:", response.data);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  // Delete Department
  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`${API_URL}api/departments/${id}`);
      setDepartments(departments.filter((department) => department._id !== id));
      console.log(`Deleted department with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  // Handle Form Submission for Add/Edit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (newDepartment.trim() === "") return;

    if (isEditMode) {
      updateDepartment();
    } else {
      addDepartment();
    }

    setIsPopupOpen(false);
    setNewDepartment("");
    setCurrentDepartmentId(null);
  };

  const handleEdit = (id, name) => {
    setIsPopupOpen(true);
    setIsEditMode(true);
    setNewDepartment(name);
    setCurrentDepartmentId(id);
  };

  const handleAddDepartment = () => {
    setIsPopupOpen(true);
    setIsEditMode(false);
    setNewDepartment("");
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setNewDepartment("");
    setCurrentDepartmentId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Filtered Departments Based on Search
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  );
  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed flex flex-col items-start justify-start w-auto h-auto mt-20 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl top-6 bottom-4 left-4 right-4 rounded-2xl backdrop-filter backdrop-blur-xl"
      >
        {/* Add Department and Search Field */}
        <div className="flex items-center px-4 mt-4 space-x-4">
          <button
            onClick={handleAddDepartment}
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-green-600"
          >
            Add Department
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search departments..."
            className="flex-grow px-3 py-2 text-gray-900 rounded focus:outline-none"
          />
        </div>

        {/* Department List */}
        <div className="w-full p-4 overflow-y-auto max-h-auto">
          {currentDepartments.length === 0 ? (
            <p>No departments found.</p>
          ) : (
            <ul className="space-y-4">
              {currentDepartments.map((department) => (
                <li
                  key={department._id}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {department.name}
                    </h3>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        handleEdit(department._id, department.name)
                      }
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDepartment(department._id)}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === 1
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-white bg-gray-700 rounded">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === totalPages
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* Popup Box */}
      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-white">
              {isEditMode ? "Edit Department" : "Add New Department"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3 py-2 mb-4 text-gray-900 rounded focus:outline-none"
                placeholder="Enter department name"
              />

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
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Department;
