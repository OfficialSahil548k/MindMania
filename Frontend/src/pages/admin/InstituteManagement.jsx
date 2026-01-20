import React, { useState, useEffect, useCallback } from "react";
import {
  fetchMyInstitutes,
  createInstitute,
  updateInstitute,
  deleteInstitute,
} from "../../api/axios";
import { useToast } from "../../context/ToastContext";

const InstituteManagement = () => {
  // const { user, token } = useContext(AuthContext); // Removed faulty import
  const toast = useToast();
  const [institutes, setInstitutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInstitute, setCurrentInstitute] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchInstitutes = useCallback(async () => {
    try {
      const { data } = await fetchMyInstitutes();
      setInstitutes(data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      toast.error("Failed to load institutes.");
    }
  }, [toast]);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setCurrentInstitute(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (institute) => {
    setCurrentInstitute(institute);
    setFormData({ name: institute.name, description: institute.description });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentInstitute) {
        await updateInstitute(currentInstitute._id, formData);
        toast.success("Institute updated successfully!");
      } else {
        await createInstitute(formData);
        toast.success("Institute created successfully!");
      }
      setIsModalOpen(false);
      fetchInstitutes();
    } catch (error) {
      console.error("Error saving institute:", error);
      toast.error("Failed to save institute.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      try {
        await deleteInstitute(id);
        toast.success("Institute deleted successfully!");
        fetchInstitutes();
      } catch (error) {
        console.error("Error deleting institute:", error);
        toast.error("Failed to delete institute.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Institutes
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            + Add Institute
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              You haven't created any institutes yet.
            </div>
          ) : (
            institutes.map((inst) => (
              <div
                key={inst._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {inst.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {inst.description || "No description provided."}
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => openEditModal(inst)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inst._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentInstitute ? "Edit Institute" : "Create Institute"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteManagement;
