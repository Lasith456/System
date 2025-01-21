import Navbar from "../components/NavigationBar";
import { motion } from "framer-motion";
import { useState } from "react";

function Department() {
  const [departments, setDepartments] = useState([
    { id: 1, name: "HR" },
    { id: 2, name: "IT" },
    { id: 3, name: "Finance" },
  ]);

  const handleEdit = (id) => {
    console.log(`Edit department with ID: ${id}`);
    // Add logic for editing a department
  };

  const handleDelete = (id) => {
    console.log(`Delete department with ID: ${id}`);
    // Add logic for deleting a department
  };

  const handleAddDepartment = () => {
    console.log("Add new department");
    // Add logic for adding a new department
  };

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed flex flex-col items-start justify-start w-auto h-auto mt-20 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl top-6 bottom-4 left-4 right-4 rounded-2xl backdrop-filter backdrop-blur-xl"
      >
        {/* Add Department Button */}
        <button
          onClick={handleAddDepartment}
          className="px-4 py-2 ml-4 text-gray-300 bg-gray-700 rounded hover:bg-green-600"
        >
          Add Department
        </button>

        {/* Department List */}
        <div className="w-full p-4 overflow-y-auto max-h-80">
          {departments.length === 0 ? (
            <p>No departments yet.</p>
          ) : (
            <ul className="space-y-4">
              {departments.map((department) => (
                <li
                  key={department.id}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {department.name}
                    </h3>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(department.id)}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
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
      </motion.div>
    </div>
  );
}

export default Department;
